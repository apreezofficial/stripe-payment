// context/CartContext.tsx
"use client";

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

// Define the shape of a Cart Item (Unchanged)
interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// Define the shape of the Context (Unchanged)
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: { id: string, name: string, price: number, image: string }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

// Create the Context (Unchanged)
export const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartTotal: 0,
});

// Key for localStorage
const CART_STORAGE_KEY = 'ecomm_user_cart';

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // 1. Initialize state by loading from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      // Return parsed data, or an empty array if nothing is found
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // 2. useEffect to save cart to localStorage whenever it changes
  useEffect(() => {
    // Ensure we are in the browser environment before accessing localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]); // This effect runs every time the 'cart' state updates

  // Calculate total price (Unchanged)
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // --- Cart Operations (Unchanged logic, now with persistence via useEffect) ---

  const addToCart = (product: { id: string, name: string, price: number, image: string }) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);

      if (existingItem) {
        const newCart = prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        toast.info(`${product.name} quantity increased!`);
        return newCart;
      } else {
        const newItem = { ...product, quantity: 1 };
        toast.success(`${product.name} added to cart!`);
        return [...prevCart, newItem];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
    toast.warning("Item removed from cart.");
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart(prevCart => {
      return prevCart.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      );
    });
  };
  
  const clearCart = () => {
      setCart([]);
      toast.success("Cart successfully cleared after checkout.");
  };

  // ----------------------------------------

  return (
    <CartContext.Provider 
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};
