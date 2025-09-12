import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Tables } from '@/integrations/supabase/types';

interface FavoritesContextType {
  favorites: Tables<'products'>[];
  addToFavorites: (product: Tables<'products'>) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  getFavoritesCount: () => number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<Tables<'products'>[]>([]);

  useEffect(() => {
    loadFavoritesFromStorage();
  }, []);

  const loadFavoritesFromStorage = () => {
    try {
      const savedFavorites = localStorage.getItem('parfumerie_favorites');
      if (savedFavorites) {
        const favoritesData = JSON.parse(savedFavorites);
        setFavorites(favoritesData);
      }
    } catch (error) {
      console.error('Error loading favorites from storage:', error);
    }
  };

  const updateFavoritesInStorage = (newFavorites: Tables<'products'>[]) => {
    try {
      localStorage.setItem('parfumerie_favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error updating favorites in storage:', error);
    }
  };

  const addToFavorites = (product: Tables<'products'>) => {
    if (!isFavorite(product.id)) {
      const newFavorites = [...favorites, product];
      updateFavoritesInStorage(newFavorites);
    }
  };

  const removeFromFavorites = (productId: string) => {
    const newFavorites = favorites.filter(item => item.id !== productId);
    updateFavoritesInStorage(newFavorites);
  };

  const isFavorite = (productId: string) => {
    return favorites.some(item => item.id === productId);
  };

  const getFavoritesCount = () => {
    return favorites.length;
  };

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoritesCount,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};