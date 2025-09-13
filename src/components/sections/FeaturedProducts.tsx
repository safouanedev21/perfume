import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ui/product-card";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

interface Product extends Tables<'products'> {
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  isOnSale?: boolean;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProducts: Product[] = (data || []).map(p => ({
        ...p,
        // Ensure Base64 images are valid data URLs
        image_url: p.image_url?.startsWith("data:image")
          ? p.image_url
          : p.image_url
          ? `data:image/png;base64,${p.image_url}`
          : undefined,
        originalPrice: p.price * 1.2,
        rating: 4.5 + Math.random() * 0.5,
        reviewCount: Math.floor(Math.random() * 200) + 50,
        isOnSale: Math.random() > 0.7,
      }));

      setProducts(formattedProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

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
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-purple"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {products.map(product => (
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
        )}

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
