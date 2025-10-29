"use client";

import { useContext, useState } from "react";
import { CartContext } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, CheckCircle, ShoppingCart } from "lucide-react";
import CheckoutForm from "@/components/CheckoutForm"; 

export default function CartPage() {
  // We consume the 'cart' array, which is already populated from localStorage by the CartProvider.
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useContext(CartContext);
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const shippingCost = 15.00; // Example fixed shipping cost
  const subtotal = cartTotal;
  const grandTotal = subtotal + shippingCost;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        <ShoppingCart className="w-16 h-16 text-pink-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/products" passHref>
          <Button className="bg-pink-500 hover:bg-pink-600">Start Shopping Now</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 border-b pb-4">
            Shopping Cart ({cart.length} items)
        </h1>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Cart Items List (Left Side) */}
          <div className="lg:w-2/3 space-y-6">
            {cart.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center bg-white p-4 rounded-lg shadow-md border border-gray-100"
              >
                {/* Image */}
                <div className="relative w-24 h-24 flex-shrink-0 mr-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="100px"
                    className="rounded-lg"
                  />
                </div>

                {/* Details */}
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold text-gray-900">{item.name}</h2>
                  <p className="text-pink-600 font-bold mt-1">${item.price.toFixed(2)}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2 mx-6">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Subtotal & Remove */}
                <div className="text-right flex flex-col items-end">
                    <p className="text-lg font-extrabold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                    <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-600 mt-2"
                        onClick={() => removeFromCart(item.id)}
                    >
                        <Trash2 className="h-4 w-4 mr-1" /> Remove
                    </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary & Checkout (Right Side) */}
          <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-xl sticky top-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-3">Order Summary</h2>
            
            <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className="font-semibold text-green-600">${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t mt-3 border-gray-200">
                    <span className="text-xl font-bold">Order Total:</span>
                    <span className="text-xl font-bold text-pink-600">${grandTotal.toFixed(2)}</span>
                </div>
            </div>

            <Button 
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full bg-pink-500 text-white hover:bg-pink-600 py-3 text-lg font-semibold mt-8 transition-all duration-300"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
        
        {/* Checkout Modal/Section */}
        {isCheckoutOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Complete Your Order</h2>
                    <CheckoutForm 
                        cart={cart}
                        total={grandTotal}
                        onClose={() => setIsCheckoutOpen(false)}
                    />
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
