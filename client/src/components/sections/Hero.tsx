"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; 
import Link from "next/link";
import Image from "next/image";
import { z } from "zod"; 

// --- 1. Zod Schema Definitions (Updated to match new JSON structure) ---
const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(), 
  material: z.string().optional(),     // New Field
  description: z.string().optional(),  // New Field
  details: z.string().optional(),      // New Field
  image: z.string().url(),
});

// The API now returns an object, not just an array.
const ApiResponseSchema = z.object({
    data: z.array(ProductSchema),
    totalCount: z.number().int().nonnegative(), // We will use this value!
    message: z.string().optional(),
});

type Product = z.infer<typeof ProductSchema>;
type ApiResponse = z.infer<typeof ApiResponseSchema>;

// --- Component ---
export default function Hero() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0); // New state for total count
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Calculate remaining products for the circular display
  const remainingCount = totalProducts > products.length ? totalProducts - products.length : 0;

  useEffect(() => {
    const fetchAndValidateProducts = async () => {
      setLoading(true);
      setError(null);
      
      // Use NEXT_PUBLIC_API_URL and the PHP file name
      const apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/products.php?limit=3`;
      
      if (!process.env.NEXT_PUBLIC_API_URL) {
          setError("API URL is not configured. Please check NEXT_PUBLIC_API_URL.");
          setLoading(false);
          return;
      }

      try {
        const res = await fetch(apiEndpoint, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`API returned status ${res.status}`);
        }

        const rawData = await res.json();
        
        // --- Zod Validation of the whole response object ---
        const validatedResponse: ApiResponse = ApiResponseSchema.parse(rawData);
        
        // Update states with validated data
        setProducts(validatedResponse.data);
        setTotalProducts(validatedResponse.totalCount);

      } catch (e) {
        console.error("Failed to fetch or validate products:", e);
        if (e instanceof z.ZodError) {
            setError(`Data validation failed: ${e.errors[0].message}`);
        } else {
            setError(`Could not fetch data. Check API endpoint and CORS.`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAndValidateProducts();
  }, []); 

  // Framer Motion variants for staggered appearance (unchanged)
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <section className="relative w-full bg-gray-900 text-white py-24 md:py-32 overflow-hidden">
      {/* ... (Background and structure unchanged) ... */}
      <div className="absolute inset-0 bg-pink-600/10 opacity-50 [mask-image:radial-gradient(ellipse_at_top,transparent_30%,black)]" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 relative z-10">
        {/* Text Content (unchanged) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-8 text-center md:text-left"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            The Future of <span className="text-pink-400">Fashion</span> is Here
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-lg">
            Discover **real-time** style with our latest drops. Exclusivity meets innovation.
          </p>
          
          {/* Action Buttons (unchanged) */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href="/products" passHref>
              <Button className="bg-pink-500 text-white hover:bg-pink-600 shadow-lg shadow-pink-500/50 font-bold px-8 py-6 text-xl transition-all duration-300 transform hover:scale-[1.03]">
                Shop Latest
              </Button>
            </Link>
            <Link href="/contact" passHref>
              <Button
                variant="outline"
                className="border-gray-500 text-gray-300 hover:bg-gray-800 font-semibold px-8 py-6 text-xl transition-all duration-300"
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Product Preview & Status (Updated for remainingCount) */}
          <div className="pt-12">
            <h3 className="text-lg font-semibold text-pink-300 mb-4 text-center md:text-left">Top New Arrivals:</h3>
            
            {loading ? (
              <p className="text-gray-400">Loading today's featured products...</p>
            ) : error ? (
                <p className="text-red-400 font-semibold">🚨 API Error: {error}</p>
            ) : (
              <motion.div
                className="flex justify-center md:justify-start -space-x-4 sm:-space-x-6"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    style={{ zIndex: 10 - index }} 
                    title={`${product.name} | $${product.price.toFixed(2)}`}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-gray-900 overflow-hidden relative cursor-pointer group transition-transform duration-300 hover:scale-105"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill 
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: "cover" }}
                      priority={index === 0} 
                      className="transition-opacity duration-500 ease-in-out group-hover:opacity-80"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-xs font-bold text-white">${Math.round(product.price)}</span>
                    </div>
                  </motion.div>
                ))}
                
                {/* Count Circle - Dynamically shows the correct remaining count */}
                {remainingCount > 0 && (
                    <motion.div
                      variants={itemVariants}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-pink-500 border-4 border-gray-900 flex flex-col items-center justify-center font-bold transition-transform duration-300 hover:scale-105 cursor-pointer"
                      title={`View ${remainingCount} more products`}
                    >
                      <p className="text-xl sm:text-2xl leading-none">+{remainingCount}</p>
                      <p className="text-xs leading-none">more</p>
                    </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Hero Image (unchanged) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-16 md:mt-0 relative w-[320px] h-[320px] md:w-[480px] md:h-[480px] flex-shrink-0"
        >
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmnztD_4aroVKSfoQo_qNH_Ac5NZDPaX47_vFfefMLM2EzJFXZkfwZRfc&s"
            alt="Fashion Hero"
            priority 
            fill 
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "contain" }}
            className="drop-shadow-[0_25px_25px_rgba(236,72,153,0.5)] rounded-2xl"
          />
          <div className="absolute top-1/4 left-0 w-8 h-8 bg-pink-400 rounded-full blur-xl animate-pulse" />
        </motion.div>
      </div>
    </section>
  );
}
