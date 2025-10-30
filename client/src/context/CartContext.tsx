// context/CartContext.tsx
"use client";

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

// Define the shape of a Cart Item 
interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string; // Used for display, but also sent in order_details
  quantity: number;
}

// Define the shape of the Context
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: { id: string, name: string, price: number, image: string }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

export const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartTotal: 0,
});

const CART_STORAGE_KEY = 'ecomm_user_cart';

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

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
      toast.success("Cart successfully cleared.");
  };

  return (
    <CartContext.Provider 
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};
