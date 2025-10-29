// context/CartContext.tsx
"use client";

import React, { createContext, useState, ReactNode } from 'react';
import { toast } from 'sonner'; // Recommend using a library like 'sonner' for notifications

// Define the shape of a Cart Item (Product plus quantity)
interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// Define the shape of the Context
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: { id: string, name: string, price: number, image: string }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  cartTotal: number;
}

// Create the Context
export const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  cartTotal: 0,
});

// Provider Component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Calculate total price of all items in the cart
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const addToCart = (product: { id: string, name: string, price: number, image: string }) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);

      if (existingItem) {
        // Increase quantity
        const newCart = prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        toast.info(`${product.name} quantity increased!`);
        return newCart;
      } else {
        // Add new item
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

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};
