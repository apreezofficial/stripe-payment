"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";

// --- Zod Schema Definitions (Reused from the other components) ---
const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  material: z.string().optional(),
  description: z.string().optional(),
  details: z.string().optional(),
  image: z.string().url(),
});

const ApiResponseSchema = z.object({
    data: z.array(ProductSchema),
    totalCount: z.number().int().nonnegative(),
    message: z.string().optional(),
});

type Product = z.infer<typeof ProductSchema>;

// --- Component ---
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart } = useContext(CartContext); // Use cart context

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      setError(null);

      // Fetch ALL products (no limit=3 this time)
      const apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/products.php`;
      
      if (!process.env.NEXT_PUBLIC_API_URL) {
          setError("API URL is not configured. Please check NEXT_PUBLIC_API_URL.");
          setLoading(false);
          return;
      }

      try {
        const res = await fetch(apiEndpoint, { cache: "no-store" });

        if (!res.ok) {
          throw new Error(`API returned status ${res.status}`);
        }

        const rawData = await res.json();
        
        const validatedResponse = ApiResponseSchema.parse(rawData);
        
        setProducts(validatedResponse.data);

      } catch (e) {
        console.error("Failed to fetch or validate products:", e);
        setError(`Failed to load products. Check API endpoint or data validation.`);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Framer Motion variants for card animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-2xl text-pink-500 animate-pulse">Loading Our Entire Collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
        <p className="text-2xl text-red-600 mb-4">🚨 Data Fetch Error</p>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 text-center">
            All Styles, All Fashion.
        </h1>
        <p className="text-xl text-gray-600 mb-12 text-center">
            {products.length} Products Found. Find your perfect match.
        </p>

        <motion.div
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-xl overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
            >
              {/* Product Image Link */}
              <Link href={`/products/${product.id}`} passHref>
                <div className="relative w-full h-72 overflow-hidden cursor-pointer">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </Link>
              
              {/* Product Info */}
              <div className="p-5 flex flex-col justify-between h-[150px]">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 truncate">
                    <Link href={`/products/${product.id}`}>{product.name}</Link>
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{product.material || 'Premium Fabric'}</p>
                </div>
                
                {/* Price and Actions */}
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-2xl font-extrabold text-pink-600">
                    ${product.price.toFixed(2)}
                  </p>
                  
                  <div className="flex space-x-2">
                    {/* View Details Button */}
                    <Link href={`/products/${product.id}`} passHref>
                      <Button variant="outline" size="icon" className="text-gray-600 border-gray-300 hover:bg-gray-100">
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </Link>

                    {/* Add to Cart Button */}
                    <Button 
                      onClick={() => addToCart(product)} 
                      className="bg-pink-500 hover:bg-pink-600 text-white p-2"
                      title={`Add ${product.name} to Cart`}
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {products.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <p className="text-xl">No products available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
