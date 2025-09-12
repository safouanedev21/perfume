import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Tables } from '@/integrations/supabase/types';

interface CartItem extends Tables<'products'> {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Tables<'products'>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    loadCartFromStorage();
  }, []);

  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('parfumerie_cart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        setCartItems(cartData);
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }
  };

  const updateCartInStorage = (newCart: CartItem[]) => {
    try {
      localStorage.setItem('parfumerie_cart', JSON.stringify(newCart));
      setCartItems(newCart);
    } catch (error) {
      console.error('Error updating cart in storage:', error);
    }
  };

  const addToCart = (product: Tables<'products'>) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      const newItem: CartItem = { ...product, quantity: 1 };
      updateCartInStorage([...cartItems, newItem]);
    }
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    updateCartInStorage(updatedCart);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cartItems.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    updateCartInStorage(updatedCart);
  };

  const clearCart = () => {
    localStorage.removeItem('parfumerie_cart');
    setCartItems([]);
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};