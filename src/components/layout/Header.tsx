import { Search, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import CartPanel from "@/components/ui/cart-panel";
import FavoritesPanel from "@/components/ui/favorites-panel";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex h-14 items-center justify-between text-sm text-muted-foreground">
         
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Appelez-nous: +213 553 883 301</span>
          </div>
        </div>

        {/* Main header */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-luxury-purple to-luxury-gold bg-clip-text text-transparent">
              Parfumerie
            </h1>
          </div>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Nom du parfum ou marque..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-luxury-cream-dark focus:ring-luxury-purple"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchTerm.trim()) {
                    window.location.href = `/products?search=${encodeURIComponent(searchTerm.trim())}`;
                  }
                }}
              />
            </div>
          </div>

          {/* Actions - only menu button on mobile */}
          <div className="flex items-center gap-2">
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            </div>
            <div className="hidden md:flex items-center gap-2">
              {/* Favorites */}
              <FavoritesPanel />
              {/* Cart */}
              <CartPanel />
              {/* Theme toggle */}
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-end md:hidden">
            <div className="w-3/4 max-w-xs bg-white dark:bg-gray-900 h-full shadow-lg transform transition-transform duration-300 translate-x-0">
              <div className="flex justify-end p-4">
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <nav className="flex flex-col gap-4 px-6 bg-purple-900">
                <a href="/" className="py-2 text-lg font-medium border-b border-gray-200 dark:border-gray-700">Accueil</a>
                <a href="/products?category=femme" className="py-2 text-lg font-medium border-b border-gray-200 dark:border-gray-700">Femmes</a>
                <a href="/products?category=homme" className="py-2 text-lg font-medium border-b border-gray-200 dark:border-gray-700">Hommes</a>
                <a href="/products?category=unisexe" className="py-2 text-lg font-medium border-b border-gray-200 dark:border-gray-700">Unisexe</a>
                <a href="/products" className="py-2 text-lg font-medium border-b border-gray-200 dark:border-gray-700">Tous les Parfums</a>
                <a href="/products?sale=true" className="py-2 text-lg font-medium border-b border-gray-200 dark:border-gray-700">Offres</a>
                <div className="flex gap-2 mt-4">
                  <FavoritesPanel />
                  <CartPanel />
                  <ThemeToggle />
                </div>
              </nav>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="hidden md:flex h-14 items-center space-x-8 text-sm font-medium">
          <a href="/" className="transition-colors hover:text-luxury-purple">
            Accueil
          </a>
          <a href="/products?category=femme" className="transition-colors hover:text-luxury-purple">
            Femmes
          </a>
          <a href="/products?category=homme" className="transition-colors hover:text-luxury-purple">
            Hommes
          </a>
          <a href="/products?category=unisexe" className="transition-colors hover:text-luxury-purple">
            Unisexe
          </a>
          <a href="/products" className="transition-colors hover:text-luxury-purple">
            Tous les Parfums
          </a>
          <a href="/products?sale=true" className="transition-colors hover:text-luxury-purple text-luxury-gold">
            Offres
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;