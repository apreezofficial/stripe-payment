// components/CheckoutForm.tsx
"use client";

import { useState, useContext } from "react";
import { Button } from "./ui/button";
import { X, Loader2, CreditCard } from "lucide-react";
import { CartContext } from "@/context/CartContext";

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
    const { clearCart } = useContext(CartContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        country: 'US', // Default country code
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(null);

        // Prepare data to send to the backend
        const checkoutData = {
            ...formData,
            order_details: cart.map(item => ({
                id: item.id,
                quantity: item.quantity,
                price: item.price,
            })),
            total_amount: total,
        };
        
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
            
            if (res.ok && result.success && result.redirect_url) {
                
                // --- REDIRECT TO STRIPE CHECKOUT URL ---
                // This opens the external Stripe page where the user enters card details.
                window.location.href = result.redirect_url; 
                
                // NOTE: Because we redirect, we might not reach clearCart() here.
                // The actual cart clearing must happen on the SUCCESS_URL endpoint 
                // (e.g., /order-success) after Stripe confirms payment.
                
            } else {
                console.error("Backend Setup Failed:", result);
                setErrorMessage(result.error || "Failed to get payment URL from server.");
            }

        } catch (error) {
            console.error("Network error:", error);
            setErrorMessage("Network error: Could not connect to payment gateway.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 relative">
            <button 
                type="button" 
                onClick={onClose} 
                className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 transition-colors"
                title="Close"
            >
                <X className="h-6 w-6" />
            </button>
            
            <h4 className="text-xl font-semibold border-b pb-2 text-pink-600">Customer Information</h4>
            <input 
                type="text" 
                name="name" 
                placeholder="Full Name" 
                value={formData.name} 
                onChange={handleChange} 
                required
                className="w-full p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500 transition-shadow"
            />
            <input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                value={formData.email} 
                onChange={handleChange} 
                required
                className="w-full p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500 transition-shadow"
            />

            <h4 className="text-xl font-semibold border-b pb-2 pt-4 text-pink-600">Shipping Details</h4>
            <input 
                type="text" 
                name="address" 
                placeholder="Street Address" 
                value={formData.address} 
                onChange={handleChange} 
                required
                className="w-full p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500 transition-shadow"
            />
            <div className="grid grid-cols-2 gap-4">
                <input 
                    type="text" 
                    name="city" 
                    placeholder="City" 
                    value={formData.city} 
                    onChange={handleChange} 
                    required
                    className="w-full p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500 transition-shadow"
                />
                <input 
                    type="text" 
                    name="zip" 
                    placeholder="Zip/Postal Code" 
                    value={formData.zip} 
                    onChange={handleChange} 
                    required
                    className="w-full p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500 transition-shadow"
                />
            </div>
             <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500 bg-white"
             >
                <option value="NG">Nigeria (NG)</option>
                <option value="US">United States (US)</option>
                <option value="GB">United Kingdom (GB)</option>
                <option value="CA">Canada (CA)</option>
             </select>

            <div className="border border-pink-200 p-4 rounded-lg bg-pink-50 text-gray-900 font-bold flex justify-between shadow-sm">
                <span>Total Due:</span>
                <span className="text-pink-700 text-xl">${total.toFixed(2)}</span>
            </div>

            {errorMessage && (
                <p className="text-red-500 text-center font-medium border border-red-300 bg-red-50 p-2 rounded-lg">
                    {errorMessage}
                </p>
            )}

            <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold flex items-center shadow-lg transition-all duration-300"
                disabled={loading || cart.length === 0}
            >
                {loading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                    <CreditCard className="mr-2 h-5 w-5" />
                )}
                {loading ? 'Preparing Secure Payment...' : `Redirect to Secure Payment`}
            </Button>
        </form>
    );
}
