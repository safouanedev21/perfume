import { useState } from "react";
import { useFavorites } from "@/contexts/FavouritesContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Heart, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const FavoritesPanel = () => {
  const { favorites, removeFromFavorites, getFavoritesCount } = useFavorites();
  const { addToCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const handleAddToCart = (product: any) => {
    addToCart(product);
    // Optionally show a toast notification
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Heart className="h-5 w-5 bg-purple-950" />
          {getFavoritesCount() > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-2 text-xs bg-luxury-gold text-luxury-purple-dark">
              {getFavoritesCount()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Mes Favoris</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {favorites.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun favori</h3>
                <p className="text-muted-foreground mb-4">
                  Ajoutez des produits à vos favoris
                </p>
                <Button onClick={() => {
                  setIsOpen(false);
                  window.location.href = '/products';
                }}>
                  Découvrir nos produits
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Favorites Items */}
              <div className="flex-1 overflow-y-auto space-y-4 py-4">
                {favorites.map((item) => (
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
                        {item.stock_quantity > 0 ? (
                          <p className="text-xs text-green-600">En stock</p>
                        ) : (
                          <p className="text-xs text-red-600">Rupture de stock</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddToCart(item)}
                          disabled={item.stock_quantity === 0}
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Ajouter
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-500"
                          onClick={() => removeFromFavorites(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Action Button */}
              <div className="border-t pt-4">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => {
                    setIsOpen(false);
                    window.location.href = '/products';
                  }}
                >
                  Voir tous les produits
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

export default FavoritesPanel;