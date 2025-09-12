import { Heart, ShoppingBag, Star } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Card, CardContent } from "./card";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  isOnSale?: boolean;
  isWishlisted?: boolean;
  stock: number;
}

const ProductCard = ({ 
  id, 
  name, 
  brand, 
  price, 
  originalPrice, 
  image, 
  rating, 
  reviewCount, 
  isOnSale, 
  isWishlisted = false,
  stock 
}: ProductCardProps) => {
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const [isHovered, setIsHovered] = useState(false);

  const toggleWishlist = () => {
    setWishlisted(!wishlisted);
  };

  const addToCart = () => {
    // Cart functionality will be implemented when backend is connected
    console.log(`Adding product ${id} to cart`);
  };

  return (
    <Card 
      className="group relative overflow-hidden border-luxury-cream-dark hover:shadow-luxury transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden bg-luxury-cream">
          <img 
            src={image} 
            alt={`${brand} ${name}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isOnSale && (
            <Badge className="bg-luxury-gold text-luxury-purple-dark hover:bg-luxury-gold-light">
              -25%
            </Badge>
          )}
          {stock < 5 && stock > 0 && (
            <Badge variant="destructive" className="text-xs">
              Stock limité
            </Badge>
          )}
          {stock === 0 && (
            <Badge variant="secondary" className="text-xs">
              Épuisé
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          } hover:bg-white hover:scale-110`}
          onClick={toggleWishlist}
        >
          <Heart 
            className={`h-4 w-4 transition-colors ${
              wishlisted ? 'fill-luxury-gold text-luxury-gold' : 'text-muted-foreground'
            }`} 
          />
        </Button>

        {/* Quick Add to Cart - appears on hover */}
        <div className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${
          isHovered && stock > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <Button 
            onClick={addToCart}
            className="w-full bg-luxury-purple hover:bg-luxury-purple-light text-white shadow-lg"
            disabled={stock === 0}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Ajouter au panier
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Brand */}
        <p className="text-sm text-luxury-gold font-medium mb-1">{brand}</p>
        
        {/* Product Name */}
        <h3 className="font-semibold text-foreground line-clamp-2 min-h-[2.5rem] mb-2">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-3 w-3 ${
                  i < Math.floor(rating) 
                    ? 'fill-luxury-gold text-luxury-gold' 
                    : 'text-muted-foreground'
                }`} 
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-luxury-purple">
            {price.toLocaleString()} DA
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {originalPrice.toLocaleString()} DA
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;