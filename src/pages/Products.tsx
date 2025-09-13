"use client"

import { useState, useEffect, useMemo } from "react"
import { useLocation } from "react-router-dom"
import { Search, Grid, List, SlidersHorizontal } from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import ProductCard from "@/components/ui/product-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { supabase } from "@/integrations/supabase/client"
import type { Tables } from "@/integrations/supabase/types"

// Extended product type for display
interface Product extends Tables<"products"> {
  brand?: string
  isOnSale?: boolean
  category?: string
}

const Products = () => {
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("tous")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 30000])
  const [sortBy, setSortBy] = useState("popularity")
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [availableBrands, setAvailableBrands] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Sync selectedCategory with URL query param and search term
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const category = params.get("category")
    const search = params.get("search")

    if (category === "homme" || category === "femme" || category === "unisexe") {
      setSelectedCategory(category)
    } else {
      setSelectedCategory("tous")
    }

    if (search) {
      setSearchTerm(search)
    }
  }, [location.search])

  // Fetch products from Supabase
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

      if (error) throw error

      const productsWithDisplayData: Product[] = (data || []).map((product) => ({
        ...product,
        brand: product.brand || "Autre", // Use actual brand column
        isOnSale: product.stock_quantity > 0,
        category: product.category,
      }))

      setAllProducts(productsWithDisplayData)

      const uniqueBrands = Array.from(
        new Set(productsWithDisplayData.map((product) => product.brand).filter((brand) => brand && brand !== "Autre")),
      ).sort()
      setAvailableBrands(uniqueBrands)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand])
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand))
    }
  }

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = allProducts.filter((product) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()))

      // Category filter
      const matchesCategory = selectedCategory === "tous" || product.category === selectedCategory

      // Brand filter
      const matchesBrand = selectedBrands.length === 0 || (product.brand && selectedBrands.includes(product.brand))

      // Price filter
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice
    })

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return filtered
  }, [allProducts, searchTerm, selectedCategory, selectedBrands, priceRange, sortBy])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-luxury-purple to-luxury-gold bg-clip-text text-transparent">
              Nos Parfums
            </span>
          </h1>
          <p className="text-muted-foreground">Découvrez notre collection complète de parfums authentiques</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="sticky top-24 space-y-6 bg-card p-6 rounded-lg border border-luxury-cream-dark">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Filtres</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} className="lg:hidden">
                  ✕
                </Button>
              </div>

              {/* Search */}
              <div className="space-y-2">
                <Label>Rechercher</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Nom du parfum ou marque..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous</SelectItem>
                    <SelectItem value="femme">Femme</SelectItem>
                    <SelectItem value="homme">Homme</SelectItem>
                    <SelectItem value="unisexe">Unisexe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Brands */}
              <div className="space-y-2">
                <Label>Marques</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableBrands.map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={brand}
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                      />
                      <Label htmlFor={brand} className="text-sm">
                        {brand}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label>Prix (DA)</Label>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={30000}
                    min={0}
                    step={500}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>{priceRange[0].toLocaleString()} DA</span>
                    <span>{priceRange[1].toLocaleString()} DA</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Section */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(true)} className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
                <span className="text-sm text-muted-foreground">
                  {filteredAndSortedProducts.length} produit{filteredAndSortedProducts.length > 1 ? "s" : ""} trouvé
                  {filteredAndSortedProducts.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-low">Prix croissant</SelectItem>
                    <SelectItem value="price-high">Prix décroissant</SelectItem>
                    <SelectItem value="name">Nom A-Z</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-purple"></div>
              </div>
            ) : filteredAndSortedProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {filteredAndSortedProducts.map((product) => (
                 <ProductCard
  key={product.id}
  id={product.id}
  name={product.name}
  brand={product.brand || "Autre"}
  price={product.price}
  image={product.image_url ? product.image_url : "/placeholder.svg"} // Use placeholder from public folder
  isOnSale={product.isOnSale}
  stock={product.stock_quantity}
/>

                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Aucun produit trouvé avec ces critères.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("tous")
                    setSelectedBrands([])
                    setPriceRange([0, 30000])
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Products
