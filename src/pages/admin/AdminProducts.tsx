"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Package, Plus, Search, Edit, Trash2, AlertTriangle, Save, X, Upload, ImageIcon } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { deleteProduct } from "@/lib/products"
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types"

// Exported handlers that will be assigned when the component mounts
export let openEditDialog: (product: Tables<"products">) => void = () => {
  console.warn("openEditDialog not registered (AdminProducts not mounted)")
}

export let handleDelete: (id: string) => void = () => {
  console.warn("handleDelete not registered (AdminProducts not mounted)")
}

const AdminProducts = () => {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Tables<"products">[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Tables<"products"> | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    stock_quantity: 0,
    description: "",
    image_url: "",
    category: "unisexe" as "homme" | "femme" | "unisexe",
    brand: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Authentication is handled by ProtectedRoute

  useEffect(() => {
    if (isAdmin) {
      fetchProducts()
    }
  }, [isAdmin])

  const fetchProducts = async () => {
    try {
      setLoadingData(true)
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
      setError("Erreur lors du chargement des produits")
    } finally {
      setLoadingData(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("La taille de l'image ne peut pas dépasser 5MB")
        return
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setError("Veuillez sélectionner un fichier image valide")
        return
      }

      setImageFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleCreateProduct = async () => {
    try {
      setError("")

      let imageBase64 = formData.image_url

      // Convert image file to base64 if a new file was uploaded
      if (imageFile) {
        imageBase64 = await convertImageToBase64(imageFile)
      }

      const productData = {
        ...formData,
        image_url: imageBase64,
      }

      const { error } = await supabase.from("products").insert([productData as TablesInsert<"products">])

      if (error) throw error

      setSuccess("Produit créé avec succès")
      setIsDialogOpen(false)
      resetForm()
      fetchProducts()
    } catch (error) {
      console.error("Error creating product:", error)
      setError("Erreur lors de la création du produit")
    }
  }

  const handleUpdateProduct = async () => {
    if (!editingProduct) return

    try {
      setError("")

      let imageBase64 = formData.image_url

      // Convert image file to base64 if a new file was uploaded
      if (imageFile) {
        imageBase64 = await convertImageToBase64(imageFile)
      }

      const productData = {
        ...formData,
        image_url: imageBase64,
      }

      const { error } = await supabase
        .from("products")
        .update(productData as TablesUpdate<"products">)
        .eq("id", editingProduct.id)

      if (error) throw error

      setSuccess("Produit mis à jour avec succès")
      setIsDialogOpen(false)
      setEditingProduct(null)
      resetForm()
      fetchProducts()
    } catch (error) {
      console.error("Error updating product:", error)
      setError("Erreur lors de la mise à jour du produit")
    }
  }

  const handleDeleteProductLocal = (id: string) => {
    deleteProduct(id, fetchProducts)
  }

  // Register the delete handler
  useEffect(() => {
    handleDelete = handleDeleteProductLocal
    return () => {
      handleDelete = () => {
        console.warn("handleDelete not registered (AdminProducts unmounted)")
      }
    }
  }, [])

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      stock_quantity: 0,
      description: "",
      image_url: "",
      category: "unisexe",
      brand: "",
    })
    setImageFile(null)
    setImagePreview(null)
  }

  const openEditDialogLocal = (product: Tables<"products">) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price,
      stock_quantity: product.stock_quantity,
      description: product.description || "",
      image_url: product.image_url || "",
      category: (product.category as "homme" | "femme" | "unisexe") || "unisexe",
      brand: product.brand || "",
    })

    // Set preview for existing image
    if (product.image_url) {
      setImagePreview(product.image_url)
    }

    setImageFile(null)
    setIsDialogOpen(true)
  }

  // Assign the exported `openEditDialog` to the local handler while mounted
  // so other modules can trigger the dialog directly.
  useEffect(() => {
    openEditDialog = openEditDialogLocal
    return () => {
      openEditDialog = () => {
        // eslint-disable-next-line no-console
        console.warn("openEditDialog not registered (AdminProducts unmounted)")
      }
    }
  }, [])

  const openCreateDialog = () => {
    setEditingProduct(null)
    resetForm()
    setIsDialogOpen(true)
  }

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "homme":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-500/30"
      case "femme":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-200 dark:border-pink-500/30"
      case "unisexe":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200 dark:border-purple-500/30"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200 dark:border-gray-500/30"
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-purple dark:border-amber-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 dark:bg-slate-900 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-amber-100">Gestion des Produits</h1>
          <p className="text-gray-600 dark:text-amber-200/70">Gérez votre catalogue de parfums</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-luxury-purple hover:bg-luxury-purple-light text-white dark:bg-gradient-to-r dark:from-purple-600 dark:to-amber-600 dark:hover:from-purple-700 dark:hover:to-amber-700">
          <Plus className="mr-2 h-4 w-4" />
          Nouveau produit
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive" className="dark:bg-red-900/20 dark:border-red-500/30 dark:text-red-200">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-500/30">
          <AlertDescription className="text-green-800 dark:text-green-200">{success}</AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <Card className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:to-slate-800/60 dark:border-amber-500/20">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-amber-400" />
            <Input
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 dark:bg-purple-900/20 dark:border-amber-500/30 dark:text-amber-100 dark:placeholder-amber-200/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden dark:bg-gradient-to-br dark:from-purple-900/50 dark:to-amber-900/30 dark:border-amber-500/20">
            <div className="aspect-square bg-gray-100 dark:bg-purple-800/30">
              {product.image_url ? (
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-12 w-12 text-gray-400 dark:text-amber-400" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg line-clamp-2 flex-1 dark:text-amber-100">{product.name}</h3>
                  <Badge className={`ml-2 ${getCategoryBadgeColor(product.category || "unisexe")}`}>
                    {product.category || "unisexe"}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-luxury-purple dark:text-amber-300">{product.price.toLocaleString()} DA</p>
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={product.stock_quantity < 10 ? "destructive" : "secondary"}
                    className={product.stock_quantity < 10 
                      ? "dark:bg-red-900/30 dark:text-red-200 dark:border-red-500/30" 
                      : "dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-500/30"
                    }
                  >
                    Stock: {product.stock_quantity}
                  </Badge>
                  {product.stock_quantity < 10 && <AlertTriangle className="h-4 w-4 text-yellow-500 dark:text-amber-400" />}
                </div>
                {product.description && <p className="text-sm text-gray-600 line-clamp-2 dark:text-amber-200/70">{product.description}</p>}
              </div>
              <div className="flex space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent dark:border-amber-500/30 dark:text-amber-200 dark:hover:bg-purple-800/30 dark:hover:text-amber-100"
                  onClick={() => openEditDialog(product)}
                >
                  <Edit className="mr-1 h-4 w-4" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 hover:text-red-700 dark:border-amber-500/30 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:to-slate-800/60 dark:border-amber-500/20">
          <CardContent className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 dark:text-amber-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-amber-100 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-500 dark:text-amber-200/60 mb-4">
              {searchTerm
                ? "Aucun produit ne correspond à votre recherche."
                : "Commencez par ajouter votre premier produit."}
            </p>
            <Button onClick={openCreateDialog} className="bg-luxury-purple hover:bg-luxury-purple-light text-white dark:bg-gradient-to-r dark:from-purple-600 dark:to-amber-600 dark:hover:from-purple-700 dark:hover:to-amber-700">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un produit
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Product Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto dark:bg-gradient-to-br dark:from-purple-900/90 dark:to-slate-800/90 dark:border-amber-500/20">
          <DialogHeader>
            <DialogTitle className="dark:text-amber-100">{editingProduct ? "Modifier le produit" : "Nouveau produit"}</DialogTitle>
            <DialogDescription className="dark:text-amber-200/70">
              {editingProduct ? "Modifiez les informations du produit" : "Ajoutez un nouveau produit à votre catalogue"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="dark:text-amber-100">Nom du produit</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: La Vie Est Belle"
                className="dark:bg-purple-900/20 dark:border-amber-500/30 dark:text-amber-100 dark:placeholder-amber-200/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand" className="dark:text-amber-100">Marque</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Ex: Lancôme, Dior, Chanel"
                className="dark:bg-purple-900/20 dark:border-amber-500/30 dark:text-amber-100 dark:placeholder-amber-200/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="dark:text-amber-100">Prix (DA)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="15000"
                className="dark:bg-purple-900/20 dark:border-amber-500/30 dark:text-amber-100 dark:placeholder-amber-200/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock" className="dark:text-amber-100">Quantité en stock</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                placeholder="50"
                className="dark:bg-purple-900/20 dark:border-amber-500/30 dark:text-amber-100 dark:placeholder-amber-200/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="dark:text-amber-100">Catégorie</Label>
              <Select
                value={formData.category}
                onValueChange={(value: "homme" | "femme" | "unisexe") => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="dark:bg-purple-900/20 dark:border-amber-500/30 dark:text-amber-100">
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent className="dark:bg-purple-900/90 dark:border-amber-500/30">
                  <SelectItem value="homme" className="dark:text-amber-100 dark:focus:bg-purple-800/50">Homme</SelectItem>
                  <SelectItem value="femme" className="dark:text-amber-100 dark:focus:bg-purple-800/50">Femme</SelectItem>
                  <SelectItem value="unisexe" className="dark:text-amber-100 dark:focus:bg-purple-800/50">Unisexe</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="dark:text-amber-100">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description du produit"
                className="dark:bg-purple-900/20 dark:border-amber-500/30 dark:text-amber-100 dark:placeholder-amber-200/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="dark:text-amber-100">Image du produit</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-luxury-purple file:text-white hover:file:bg-luxury-purple-light dark:file:bg-gradient-to-r dark:file:from-purple-600 dark:file:to-amber-600 dark:bg-purple-900/20 dark:border-amber-500/30 dark:text-amber-100"
                  />
                  <Upload className="h-4 w-4 text-gray-400 dark:text-amber-400" />
                </div>

                {imagePreview && (
                  <div className="relative w-full h-32 bg-gray-100 dark:bg-purple-800/30 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 dark:bg-red-800/70 dark:hover:bg-red-700/70"
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview(null)
                        setFormData({ ...formData, image_url: "" })
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                {!imagePreview && (
                  <div className="w-full h-32 bg-gray-50 dark:bg-purple-800/20 border-2 border-dashed border-gray-300 dark:border-amber-500/30 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-8 w-8 text-gray-400 dark:text-amber-400" />
                      <p className="mt-2 text-sm text-gray-500 dark:text-amber-200/60">Aucune image sélectionnée</p>
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 dark:text-amber-200/50">Formats acceptés: JPG, PNG, GIF. Taille max: 5MB</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="dark:border-amber-500/30 dark:text-amber-200 dark:hover:bg-purple-800/30">
              <X className="mr-2 h-4 w-4" />
              Annuler
            </Button>
            <Button
              onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
              className="bg-luxury-purple hover:bg-luxury-purple-light text-white dark:bg-gradient-to-r dark:from-purple-600 dark:to-amber-600 dark:hover:from-purple-700 dark:hover:to-amber-700"
            >
              <Save className="mr-2 h-4 w-4" />
              {editingProduct ? "Mettre à jour" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminProducts