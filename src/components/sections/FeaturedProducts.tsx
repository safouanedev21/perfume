import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ui/product-card";
import { ArrowRight } from "lucide-react";
import { useLocation } from "react-router-dom";

// Mock data - will be replaced with real data when backend is connected
const featuredProducts = [
  {
    id: "1",
    name: "La Vie Est Belle Intense",
    brand: "Lancôme",
    price: 15500,
    originalPrice: 18900,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop&crop=center",
    rating: 4.8,
    reviewCount: 245,
    isOnSale: true,
    stock: 12,
    category: "femme"
  },
  {
    id: "2", 
    name: "Sauvage Elixir",
    brand: "Dior",
    price: 22000,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop&crop=center",
    rating: 4.9,
    reviewCount: 189,
    stock: 8,
    category: "homme"
  },
  {
    id: "3",
    name: "Black Opium Intense",
    brand: "Yves Saint Laurent",
    price: 17800,
    originalPrice: 21000,
    image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop&crop=center",
    rating: 4.7,
    reviewCount: 312,
    isOnSale: true,
    stock: 3,
    category: "femme"
  },
  {
    id: "4",
    name: "Libre",
    brand: "Yves Saint Laurent", 
    price: 16200,
    image: "https://images.unsplash.com/photo-1594736797933-d0ef7ba26ee2?w=400&h=400&fit=crop&crop=center",
    rating: 4.6,
    reviewCount: 178,
    stock: 15,
    category: "femme"
  },
  {
    id: "5",
    name: "Acqua di Giò Profondo",
    brand: "Giorgio Armani",
    price: 14500,
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59de8?w=400&h=400&fit=crop&crop=center",
    rating: 4.5,
    reviewCount: 156,
    stock: 0,
    category: "homme"
  },
  {
    id: "6",
    name: "Good Girl",
    brand: "Carolina Herrera",
    price: 18900,
    originalPrice: 22500,
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=400&fit=crop&crop=center",
    rating: 4.8,
    reviewCount: 203,
    isOnSale: true,
    stock: 7,
    category: "femme"
  }
];

const FeaturedProducts = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get("category");
  const filteredProducts = category
    ? featuredProducts.filter((product) => product.category === category)
    : featuredProducts;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-luxury-purple to-luxury-gold bg-clip-text text-transparent">
              Produits Vedettes
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre sélection des parfums les plus populaires et les mieux notés par nos clients.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button 
            size="lg"
            variant="outline"
            className="border-luxury-purple text-luxury-purple hover:bg-luxury-purple hover:text-white group"
            onClick={() => window.location.href = '/products'}
          >
            Voir Tous les Produits
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;