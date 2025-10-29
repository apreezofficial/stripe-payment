// components/CheckoutForm.tsx
"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { X, Loader2, CreditCard } from "lucide-react";

interface CartItemSummary {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface CheckoutFormProps {
    cart: CartItemSummary[];
    total: number;
    onClose: () => void;
}

export default function CheckoutForm({ cart, total, onClose }: CheckoutFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        country: 'Nigeria', // Default
    });
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failure'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setPaymentStatus('idle');

        // Prepare data to send to the backend
        const checkoutData = {
            ...formData,
            order_details: cart.map(item => ({
                id: item.id,
                quantity: item.quantity,
                price: item.price,
            })),
            total_amount: total,
            currency: 'USD',
        };
        
        // --- 1. Submission to Backend Payment Endpoint ---
        // NOTE: Replace the placeholder URL with your actual hosted PHP file path
        const paymentEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/payment.php`;

        try {
            const res = await fetch(paymentEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(checkoutData),
            });

            const result = await res.json();
            
            if (res.ok && result.success) {
                // In a real scenario, the backend would redirect to Stripe Checkout
                // or return a client secret to initialize a Stripe Element.
                setPaymentStatus('success');
                // You would typically clear the cart here: clearCart();
            } else {
                console.error("Payment failed result:", result);
                setPaymentStatus('failure');
            }

        } catch (error) {
            console.error("Network or submission error:", error);
            setPaymentStatus('failure');
        } finally {
            setLoading(false);
        }
    };

    if (paymentStatus === 'success') {
        return (
            <div className="text-center p-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900">Payment Successful!</h3>
                <p className="text-gray-600 mt-2">Your order has been placed and is being processed.</p>
                <Button onClick={onClose} className="mt-6 bg-pink-500">Close & View Order</Button>
            </div>
        );
    }
    
    // The main form
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
            </button>
            
            <h4 className="text-xl font-semibold border-b pb-2">Customer Information</h4>
            <input 
                type="text" 
                name="name" 
                placeholder="Full Name" 
                value={formData.name} 
                onChange={handleChange} 
                required
                className="w-full p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500"
            />
            <input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                value={formData.email} 
                onChange={handleChange} 
                required
                className="w-full p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500"
            />

            <h4 className="text-xl font-semibold border-b pb-2 pt-4">Shipping Details</h4>
            <input 
                type="text" 
                name="address" 
                placeholder="Street Address" 
                value={formData.address} 
                onChange={handleChange} 
                required
                className="w-full p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500"
            />
            <div className="grid grid-cols-2 gap-4">
                <input 
                    type="text" 
                    name="city" 
                    placeholder="City" 
                    value={formData.city} 
                    onChange={handleChange} 
                    required
                    className="w-full p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500"
                />
                <input 
                    type="text" 
                    name="zip" 
                    placeholder="Zip/Postal Code" 
                    value={formData.zip} 
                    onChange={handleChange} 
                    required
                    className="w-full p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500"
                />
            </div>
            
            <div className="border p-4 rounded-lg bg-pink-50 text-pink-800 font-bold flex justify-between">
                <span>Total Due:</span>
                <span>${total.toFixed(2)}</span>
            </div>

            <Button 
                type="submit" 
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg font-semibold flex items-center"
                disabled={loading}
            >
                {loading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                    <CreditCard className="mr-2 h-5 w-5" />
                )}
                {loading ? 'Processing Payment...' : 'Pay Now'}
            </Button>
            
            {paymentStatus === 'failure' && (
                <p className="text-red-500 text-center mt-3">Payment failed. Please check your details and try again.</p>
            )}
        </form>
    );
}
