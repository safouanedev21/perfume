import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { openEditDialog, handleDelete } from '@/pages/admin/AdminProducts';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import AdminProducts from '@/pages/admin/AdminProducts';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentProducts, setRecentProducts] = useState<Tables<'products'>[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Authentication is handled by ProtectedRoute

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin]);

  const fetchDashboardData = async () => {
    try {
      setLoadingData(true);
      
      // Fetch products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (productsError) throw productsError;

      // Fetch orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount');

      if (ordersError) throw ordersError;

      // Calculate stats
      const totalProducts = products?.length || 0;
      const lowStockProducts = products?.filter(p => p.stock_quantity < 10).length || 0;
      const totalOrders = orders?.length || 0;
      const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

      setStats({
        totalProducts,
        lowStockProducts,
        totalOrders,
        totalRevenue,
      });

      setRecentProducts(products || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-purple"></div>
      </div>
    );
  }

  return (
    <>
      {/* Include AdminProducts but hide it */}
      <div className="hidden">
        <AdminProducts />
      </div>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="text-gray-600">Vue d'ensemble de votre parfumerie</p>
          </div>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Faible</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">
              Produits nécessitant un réapprovisionnement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
         
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} DA</div>
           
          </CardContent>
        </Card>
      </div>

      {/* Recent Products */}
      <Card>
        <CardHeader>
          <CardTitle>Produits récents</CardTitle>
          <CardDescription>
            Les derniers produits ajoutés à votre catalogue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.price.toLocaleString()} DA</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={product.stock_quantity < 10 ? "destructive" : "secondary"}>
                      Stock: {product.stock_quantity}
                    </Badge>
                    <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={()=>openEditDialog(product)} >
                      <Edit className="h-4 w-4" />
                    </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucun produit trouvé
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default AdminDashboard;