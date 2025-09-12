import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react";

const CartPanel = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartCount, getCartTotal } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const calculateShipping = () => {
    return getCartTotal() > 50000 ? 0 : 2000;
  };

  const calculateTotal = () => {
    return getCartTotal() + calculateShipping();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {getCartCount() > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-2 text-xs bg-luxury-gold text-luxury-purple-dark">
              {getCartCount()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Mon Panier</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Votre panier est vide</h3>
                <p className="text-muted-foreground mb-4">
                  Ajoutez des produits à votre panier
                </p>
                <Button onClick={() => {
                  setIsOpen(false);
                  window.location.href = '/products';
                }}>
                  Continuer mes achats
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto space-y-4 py-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        {item.image_url ? (
                          <img 
                            src={item.image_url} 
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-300 rounded"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.price.toLocaleString()} DA
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-500"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t pt-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total</span>
                    <span>{getCartTotal().toLocaleString()} DA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Livraison</span>
                    <span>
                      {calculateShipping() === 0 ? (
                        <Badge variant="secondary">Gratuite</Badge>
                      ) : (
                        `${calculateShipping().toLocaleString()} DA`
                      )}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{calculateTotal().toLocaleString()} DA</span>
                  </div>
                </div>

                {getCartTotal() < 50000 && (
                  <div className="text-xs text-muted-foreground text-center mb-4">
                    Ajoutez {(50000 - getCartTotal()).toLocaleString()} DA pour la livraison gratuite
                  </div>
                )}

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => {
                    setIsOpen(false);
                    window.location.href = '/order';
                  }}
                >
                  Finaliser la commande
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartPanel;