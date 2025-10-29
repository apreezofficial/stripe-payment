// components/CheckoutForm.tsx
"use client";

import { useState, useContext } from "react";
import { Button } from "./ui/button";
import { X, Loader2, CreditCard, CheckCircle } from "lucide-react";
import { CartContext } from "@/context/CartContext"; // Use CartContext to clear cart on success

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
    const { clearCart } = useContext(CartContext); // Assuming you've added clearCart to your CartContext
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        country: 'NG', // Using ISO code for Nigeria
    });
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failure'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setPaymentStatus('idle');
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
            currency: 'USD',
        };
        
        // Submission to Backend Payment Endpoint
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
                setPaymentStatus('success');
                // You would typically clear the cart here:
                // clearCart(); 
            } else {
                console.error("Payment failed result:", result);
                setPaymentStatus('failure');
                setErrorMessage(result.error || "Payment failed due to an unknown error.");
            }

        } catch (error) {
            console.error("Network or submission error:", error);
            setPaymentStatus('failure');
            setErrorMessage("Network error: Could not connect to payment gateway.");
        } finally {
            setLoading(false);
        }
    };

    if (paymentStatus === 'success') {
        return (
            <div className="text-center p-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900">Payment Successful! 🎉</h3>
                <p className="text-gray-600 mt-2">Your order has been placed successfully and your card was charged ${total.toFixed(2)}.</p>
                <Button onClick={onClose} className="mt-6 bg-pink-500">Close & View Order</Button>
            </div>
        );
    }
    
    // The main form
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
            {/* Country is set to Nigeria by default, but allows selection */}
             <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500 bg-white"
             >
                <option value="NG">Nigeria (NGN)</option>
                <option value="US">United States (USD)</option>
                <option value="GB">United Kingdom (GBP)</option>
                <option value="CA">Canada (CAD)</option>
             </select>

            <div className="border border-pink-200 p-4 rounded-lg bg-pink-50 text-gray-900 font-bold flex justify-between shadow-sm">
                <span>Total Due:</span>
                <span className="text-pink-700 text-xl">${total.toFixed(2)}</span>
            </div>

            {paymentStatus === 'failure' && errorMessage && (
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
                {loading ? 'Processing Payment...' : `Pay $${total.toFixed(2)} Now`}
            </Button>
        </form>
    );
}
