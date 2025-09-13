import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, Package } from "lucide-react";

type OrderItem = Tables<"order_items"> & {
  products?: Tables<"products">;
};

type Order = Tables<"orders"> & {
  order_items?: OrderItem[];
  city?: string;
  notes?: string;
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          products (
            id,
            name,
            price,
            image_url
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      setOrders(data as Order[]);
    }
    setLoading(false);
  };

  const markAsRead = async (orderId: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: "read" })
      .eq("id", orderId);

    if (error) {
      console.error("Error marking order as read:", error);
    } else {
      fetchOrders(); // refresh list
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-purple dark:border-amber-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 dark:bg-slate-900 min-h-screen p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-amber-100">Commandes</h1>
        <p className="text-gray-600 dark:text-amber-200/70">Consultez et gérez les commandes</p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="dark:bg-gradient-to-br dark:from-purple-900/50 dark:to-amber-900/30 dark:border-amber-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base dark:text-amber-100">
                    Commande #{order.id.slice(0, 8)}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground dark:text-amber-200/70 space-y-1">
                    <p><strong className="dark:text-amber-100">{order.customer_name}</strong></p>
                    <p>📧 {order.customer_email || 'Non renseigné'}</p>
                    <p>📞 {order.customer_phone}</p>
                    <p>📍 {order.customer_address}{order.city ? `, ${order.city}` : ''}</p>
                    {order.notes && <p>📝 {order.notes}</p>}
                    <p className="text-xs">
                      🕐 {new Date(order.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge
                    variant={order.status === "read" ? "secondary" : "destructive"}
                    className={order.status === "read" 
                      ? "dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-500/30" 
                      : "dark:bg-red-900/30 dark:text-red-200 dark:border-red-500/30"
                    }
                  >
                    {order.status === "pending" ? "En attente" : 
                     order.status === "read" ? "Lu" : order.status}
                  </Badge>
                  {order.status !== "read" && (
                    <Button 
                      size="sm" 
                      onClick={() => markAsRead(order.id)}
                      className="bg-luxury-purple hover:bg-luxury-purple-light text-white dark:bg-gradient-to-r dark:from-purple-600 dark:to-amber-600 dark:hover:from-purple-700 dark:hover:to-amber-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marquer comme traitée
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold mb-3 dark:text-amber-100">Articles commandés :</h4>
                {order.order_items && order.order_items.length > 0 ? (
                  <div className="space-y-3">
                    {order.order_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50 dark:bg-purple-900/20 dark:border-amber-500/30"
                      >
                        {/* Product Image */}
                        <div className="w-12 h-12 bg-gray-200 dark:bg-purple-800/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.products?.image_url ? (
                            <img 
                              src={item.products.image_url} 
                              alt={item.products.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-gray-400 dark:text-amber-400" />
                          )}
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-sm dark:text-amber-100">
                            {item.products?.name || `Produit #${item.product_id}`}
                          </h5>
                          <p className="text-sm text-muted-foreground dark:text-amber-200/60">
                            Quantité: {item.quantity}
                          </p>
                        </div>
                        
                        {/* Price */}
                        <div className="text-right">
                          <p className="font-medium dark:text-amber-200">
                            {item.price.toLocaleString()} DA
                          </p>
                          <p className="text-xs text-muted-foreground dark:text-amber-200/50">
                            × {item.quantity} = {(item.price * item.quantity).toLocaleString()} DA
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-amber-200/60 italic">Aucun article trouvé</p>
                )}
                
                {/* Order Total */}
                <div className="mt-4 pt-3 border-t dark:border-amber-500/30">
                  <div className="text-right">
                    <p className="text-lg font-bold dark:text-amber-300">
                      Total: {order.total_amount.toLocaleString()} DA
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:to-slate-800/60 dark:border-amber-500/20">
          <CardContent className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 dark:text-amber-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-amber-100 mb-2">Aucune commande trouvée</h3>
            <p className="text-gray-500 dark:text-amber-200/60">
              Les nouvelles commandes apparaîtront ici.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminOrders;