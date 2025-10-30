// components/CheckoutForm.tsx
"use client";

import { useState, useContext } from "react";
import { Button } from "./ui/button";
import { X, Loader2, CreditCard } from "lucide-react";
import { CartContext } from "@/context/CartContext"; 
import { toast } from 'sonner';

interface CartItemSummary {
    id: string;
    name: string;
    price: number;
    quantity: number;
    // Add image/other necessary details for the backend line item creation
}

interface CheckoutFormProps {
    cart: CartItemSummary[];
    total: number; // Grand Total including shipping
    onClose: () => void;
}

export default function CheckoutForm({ cart, total, onClose }: CheckoutFormProps) {
    const { clearCart } = useContext(CartContext);
    
    // We don't use paymentStatus like before, as success/failure happens on redirect.
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        country: 'NG',
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

        // Prepare data required by payment.php (which now expects line items)
        const checkoutData = {
            ...formData,
            // Send the full cart details as 'order_details' for line item creation
            order_details: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
            })),
            total_amount: total, // Still send total for validation
            currency: 'USD',
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
            
            if (res.ok && result.success && result.checkout_url) {
                // SUCCESS: Received the Checkout URL!
                // 1. Clear the cart locally BEFORE redirecting (optional but good practice)
                clearCart(); 

                // 2. Redirect the user to Stripe
                toast.loading("Redirecting to secure payment page...");
                window.location.href = result.checkout_url;
                
                // Note: The loading state will stop when the user leaves the page
            } else {
                // FAILURE: Could not create the Stripe Session
                console.error("Stripe Session creation failed:", result.error || "No checkout_url received.");
                setErrorMessage(result.error || "Payment gateway connection failed. Please try again.");
                toast.error("Checkout failed. Check the error message.");
            }

        } catch (error) {
            console.error("Network or submission error:", error);
            setErrorMessage("Network error: Could not connect to payment gateway.");
            toast.error("Network error: Check your connection.");
        } finally {
            setLoading(false); // Only useful if redirection fails
        }
    };
    
    // NOTE: This form does NOT have the success/failure screen here anymore.
    // The success screen is now the separate /order/success page.

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
            {/* Input fields remain the same */}
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="w-full p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500 transition-shadow"/>
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="w-full p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500 transition-shadow"/>

            <h4 className="text-xl font-semibold border-b pb-2 pt-4 text-pink-600">Shipping Details</h4>
            <input type="text" name="address" placeholder="Street Address" value={formData.address} onChange={handleChange} required className="w-full p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500 transition-shadow"/>
            <div className="grid grid-cols-2 gap-4">
                <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required className="w-full p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500 transition-shadow"/>
                <input type="text" name="zip" placeholder="Zip/Postal Code" value={formData.zip} onChange={handleChange} required className="w-full p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500 transition-shadow"/>
            </div>
             <select name="country" value={formData.country} onChange={handleChange} required className="w-full p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500 bg-white">
                <option value="NG">Nigeria (NGN)</option>
                <option value="US">United States (USD)</option>
                <option value="GB">United Kingdom (GBP)</option>
                <option value="CA">Canada (CAD)</option>
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
                {loading ? 'Generating Checkout URL...' : `Pay $${total.toFixed(2)} with Stripe`}
            </Button>
        </form>
    );
}
