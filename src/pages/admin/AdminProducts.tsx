import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  AlertTriangle,
  Save,
  X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { deleteProduct } from '@/lib/products';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

// Exported handlers that will be assigned when the component mounts
export let openEditDialog: (product: Tables<'products'>) => void = () => {
  console.warn('openEditDialog not registered (AdminProducts not mounted)');
};

export let handleDelete: (id: string) => void = () => {
  console.warn('handleDelete not registered (AdminProducts not mounted)');
};

const AdminProducts = () => {
  const { isAdmin} = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Tables<'products'>[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Tables<'products'> | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    stock_quantity: 0,
    description: '',
    image_url: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Authentication is handled by ProtectedRoute

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    try {
      setLoadingData(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Erreur lors du chargement des produits');
    } finally {
      setLoadingData(false);
    }
  };

  const handleCreateProduct = async () => {
    try {
      setError('');
      const { error } = await supabase
        .from('products')
        .insert([formData as TablesInsert<'products'>]);

      if (error) throw error;

      setSuccess('Produit créé avec succès');
      setIsDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
      setError('Erreur lors de la création du produit');
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      setError('');
      const { error } = await supabase
        .from('products')
        .update(formData as TablesUpdate<'products'>)
        .eq('id', editingProduct.id);

      if (error) throw error;

      setSuccess('Produit mis à jour avec succès');
      setIsDialogOpen(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Erreur lors de la mise à jour du produit');
    }
  };

  const handleDeleteProductLocal = (id: string) => {
    deleteProduct(id, fetchProducts);
  };

  // Register the delete handler
  useEffect(() => {
    handleDelete = handleDeleteProductLocal;
    return () => {
      handleDelete = () => {
        console.warn('handleDelete not registered (AdminProducts unmounted)');
      };
    };
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      stock_quantity: 0,
      description: '',
      image_url: '',
    });
  };

  const openEditDialogLocal = (product: Tables<'products'>) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      stock_quantity: product.stock_quantity,
      description: product.description || '',
      image_url: product.image_url || '',
    });
    setIsDialogOpen(true);
  };

  // Assign the exported `openEditDialog` to the local handler while mounted
  // so other modules can trigger the dialog directly.
  useEffect(() => {
    openEditDialog = openEditDialogLocal;
    return () => {
      openEditDialog = () => {
        // eslint-disable-next-line no-console
        console.warn('openEditDialog not registered (AdminProducts unmounted)');
      };
    };
  }, [openEditDialogLocal]);

  const openCreateDialog = () => {
    setEditingProduct(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-purple"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Produits</h1>
          <p className="text-gray-600">Gérez votre catalogue de parfums</p>
        </div>
        <Button 
          onClick={openCreateDialog}
          className="bg-luxury-purple hover:bg-luxury-purple-light text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau produit
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square bg-gray-100">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                <p className="text-2xl font-bold text-luxury-purple">
                  {product.price.toLocaleString()} DA
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant={product.stock_quantity < 10 ? "destructive" : "secondary"}>
                    Stock: {product.stock_quantity}
                  </Badge>
                  {product.stock_quantity < 10 && (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                {product.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                )}
              </div>
              <div className="flex space-x-2 mt-4">
              
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => openEditDialog(product)}
                >
                  <Edit className="mr-1 h-4 w-4" />
                  Modifier
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Aucun produit ne correspond à votre recherche.' : 'Commencez par ajouter votre premier produit.'}
            </p>
            <Button onClick={openCreateDialog} className="bg-luxury-purple hover:bg-luxury-purple-light text-white">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un produit
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Product Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Modifiez les informations du produit' : 'Ajoutez un nouveau produit à votre catalogue'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du produit</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: La Vie Est Belle"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Prix (DA)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="15000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock">Quantité en stock</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                placeholder="50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description du produit"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">URL de l'image</Label>
              <Input
                id="image"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Annuler
            </Button>
            <Button 
              onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
              className="bg-luxury-purple hover:bg-luxury-purple-light text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              {editingProduct ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;