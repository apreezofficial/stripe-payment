"use client";

import { useEffect, useState, useContext } from "react";
import { CartContext } from "@/context/CartContext"; // Import Cart Context
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { z } from "zod";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation"; // Hook for Next.js 13+ App Router

// --- Zod Schema Definitions (Reused from Hero, but making all fields required for the detail page) ---
const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  material: z.string(),
  description: z.string(),
  details: z.string(),
  image: z.string().url(),
});
type Product = z.infer<typeof ProductSchema>;

// API response for single product
const ApiResponseSchema = z.object({
    data: ProductSchema,
    message: z.string().optional(),
});

export default function ProductDetail() {
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    if (!productId) {
        setLoading(false);
        setError("No product ID provided.");
        return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      
      // NEW API ENDPOINT: product.php?id=A101
      const apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/products.php?id=${productId}`; 
      
      try {
        const res = await fetch(apiEndpoint, { cache: "no-store" });

        if (!res.ok) {
          throw new Error(`API returned status ${res.status}`);
        }

        const rawData = await res.json();
        
        const validatedResponse = ApiResponseSchema.parse(rawData);
        
        setProduct(validatedResponse.data);

      } catch (e) {
        console.error("Failed to fetch or validate product:", e);
        setError("Failed to load product details or data is corrupt.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);
  
  // Handlers
  const handleAddToCart = () => {
      if (product) {
          addToCart(product);
      }
  };


  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p className="text-xl text-pink-500">Loading Product...</p>
        </div>
    );
  }

  if (error || !product) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
            <p className="text-2xl text-red-500 mb-4">Error loading product.</p>
            <p className="text-gray-600">{error}</p>
            <Link href="/products" passHref>
                <Button className="mt-6 bg-pink-500 hover:bg-pink-600"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Products</Button>
            </Link>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="md:flex">
          
          {/* Product Image */}
          <div className="md:flex-shrink-0 relative h-96 w-full md:w-1/2">
            <Image
              src={product.image}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Product Details */}
          <div className="p-8 md:w-1/2 flex flex-col justify-between">
            <div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-pink-600 text-3xl font-bold mb-6">${product.price.toFixed(2)}</p>

                <div className="space-y-4 text-gray-700 mb-8">
                    <p className="text-lg leading-relaxed">{product.description}</p>
                    <p className="font-semibold text-gray-800">Material: <span className="font-normal text-pink-500">{product.material}</span></p>
                    <p className="font-semibold text-gray-800">Details: <span className="font-normal">{product.details}</span></p>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-8">
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-pink-500 text-white hover:bg-pink-600 py-3 text-lg font-semibold shadow-lg shadow-pink-500/50 transition-all duration-300 transform hover:scale-[1.01]"
              >
                <ShoppingCart className="mr-3 h-5 w-5" /> Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Back Link */}
      <div className="max-w-6xl mx-auto mt-8">
          <Link href="/products" passHref>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
              </Button>
          </Link>
      </div>
    </div>
  );
    }
