import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Search, Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

// Extended product type for display
interface Product extends Tables<'products'> {
  brand?: string;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  isOnSale?: boolean;
  category?: string;
}

const brands = ["Toutes", "Chanel", "Dior", "Lancôme", "Yves Saint Laurent", "Giorgio Armani", "Carolina Herrera"];

const Products = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("tous");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 30000]);
  const [sortBy, setSortBy] = useState("popularity");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync selectedCategory with URL query param and search term
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    const search = params.get("search");
    
    if (category === "homme" || category === "femme" || category === "unisexe") {
      setSelectedCategory(category);
    } else {
      setSelectedCategory("tous");
    }
    
    if (search) {
      setSearchTerm(search);
    }
  }, [location.search]);

  // Fetch products from Supabase
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

      // Transform data to include display properties
      const productsWithDisplayData: Product[] = (data || []).map(product => ({
        ...product,
        brand: extractBrandFromName(product.name),
        originalPrice: product.price * 1.2, // Simulate original price for sale items
        rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
        reviewCount: Math.floor(Math.random() * 200) + 50, // Random review count
        isOnSale: Math.random() > 0.7, // 30% chance of being on sale
        category: Math.random() > 0.5 ? "femme" : "homme", // Random category
      }));

      setAllProducts(productsWithDisplayData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractBrandFromName = (name: string): string => {
    // Simple brand extraction logic - in a real app, this would be more sophisticated
    const brandKeywords = ["Chanel", "Dior", "Lancôme", "Yves Saint Laurent", "Giorgio Armani", "Carolina Herrera"];
    for (const brand of brandKeywords) {
      if (name.toLowerCase().includes(brand.toLowerCase())) {
        return brand;
      }
    }
    return "Autre";
  };

  // Filter products based on current filters
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "tous" || product.category === selectedCategory;
    
    const matchesBrand = selectedBrands.length === 0 || (product.brand && selectedBrands.includes(product.brand));
    
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "name":
        return a.name.localeCompare(b.name);
      default: // popularity
        return (b.reviewCount || 0) - (a.reviewCount || 0);
    }
  });

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    }
  };

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
          <p className="text-muted-foreground">
            Découvrez notre collection complète de parfums authentiques
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24 space-y-6 bg-card p-6 rounded-lg border border-luxury-cream-dark">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Filtres</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden"
                >
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
                  {brands.filter(b => b !== "Toutes").map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={brand}
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                      />
                      <Label htmlFor={brand} className="text-sm">{brand}</Label>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
                <span className="text-sm text-muted-foreground">
                  {sortedProducts.length} produit{sortedProducts.length > 1 ? 's' : ''} trouvé{sortedProducts.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularité</SelectItem>
                    <SelectItem value="price-low">Prix croissant</SelectItem>
                    <SelectItem value="price-high">Prix décroissant</SelectItem>
                    <SelectItem value="rating">Mieux notés</SelectItem>
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
            ) : sortedProducts.length > 0 ? (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }>
                {sortedProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    id={product.id}
                    name={product.name}
                    brand={product.brand || "Autre"}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    image={product.image_url || "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop&crop=center"}
                    rating={product.rating || 4.5}
                    reviewCount={product.reviewCount || 100}
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
                    setSearchTerm("");
                    setSelectedCategory("tous");
                    setSelectedBrands([]);
                    setPriceRange([0, 30000]);
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
  );
};

export default Products;