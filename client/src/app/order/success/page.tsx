// app/order/success/page.tsx
"use client";

import { CheckCircle, XCircle, Home } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OrderStatusPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const sessionId = searchParams.get('session');

  const isSuccess = status === 'success';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-md w-full text-center">
        
        {isSuccess ? (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been placed and confirmed. 
              We'll send a receipt to your email shortly.
            </p>
            {sessionId && (
                <p className="text-sm text-gray-500 mb-6">
                    Reference ID: <span className="font-mono text-gray-700">{sessionId}</span>
                </p>
            )}
            <Link href="/" passHref>
                <Button className="bg-pink-500 hover:bg-pink-600">
                    <Home className="mr-2 h-4 w-4" /> Go to Homepage
                </Button>
            </Link>
          </>
        ) : (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Failed/Canceled</h1>
            <p className="text-gray-600 mb-6">
              Your payment could not be processed, or you canceled the checkout process. 
              Please verify your payment details and try again.
            </p>
            <Link href="/cart" passHref>
                <Button className="bg-red-500 hover:bg-red-600">
                    <Home className="mr-2 h-4 w-4" /> Return to Cart
                </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
    }
