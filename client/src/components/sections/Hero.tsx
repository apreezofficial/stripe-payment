"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod"; // Import Zod

// --- 1. Zod Schema Definition ---
// Define the expected shape of a single product
const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().url(), // Ensures the image is a valid URL string
  price: z.number().positive(), // Ensures price is a positive number
});

// Define the expected shape of the API response (an array of products)
const ProductsArraySchema = z.array(ProductSchema);

// Infer the TypeScript type from the Zod schema for type safety
type Product = z.infer<typeof ProductSchema>;

// --- Component ---
export default function Hero() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Hardcoded for now, but in a real app, fetch this total count separately
  const totalRemainingProducts = 250; 

  useEffect(() => {
    const fetchAndValidateProducts = async () => {
      setLoading(true);
      setError(null); // Reset error state
      
      const apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/products?limit=3`;
      
      if (!process.env.NEXT_PUBLIC_API_URL) {
          setError("API URL is not configured. Please check NEXT_PUBLIC_API_URL.");
          setLoading(false);
          return;
      }

      try {
        const res = await fetch(apiEndpoint, {
          cache: "no-store", // Ensure real-time fetch on every component load
        });

        if (!res.ok) {
          throw new Error(`API returned status ${res.status}`);
        }

        const rawData = await res.json();
        
        // --- 2. Zod Validation in Real Time ---
        const validatedData = ProductsArraySchema.parse(rawData);
        
        setProducts(validatedData);

      } catch (e) {
        console.error("Failed to fetch or validate products:", e);
        if (e instanceof z.ZodError) {
            setError(`Data validation failed: ${e.errors[0].message}`);
        } else {
            setError(`Could not fetch data. Check API endpoint.`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAndValidateProducts();
  }, []); // Empty dependency array means this runs once on mount

  // Framer Motion variants for staggered appearance
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
      {/* Dynamic Background Effect */}
      <div className="absolute inset-0 bg-pink-600/10 opacity-50 [mask-image:radial-gradient(ellipse_at_top,transparent_30%,black)]" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 relative z-10">
        {/* Text Content */}
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
          
          {/* Action Buttons */}
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

          {/* Product Preview & Status */}
          <div className="pt-12">
            <h3 className="text-lg font-semibold text-pink-300 mb-4 text-center md:text-left">Top New Arrivals:</h3>
            
            {loading ? (
              <p className="text-gray-400">Loading today's featured products...</p>
            ) : error ? (
                <p className="text-red-400 font-semibold">🚨 Error: {error}</p>
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
                    title={product.name}
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
                      // NOTE: If your API uses relative paths, you may need to prepend your domain here.
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-xs font-bold text-white">${Math.round(product.price)}</span>
                    </div>
                  </motion.div>
                ))}
                
                {/* Count Circle */}
                <motion.div
                  variants={itemVariants}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-pink-500 border-4 border-gray-900 flex flex-col items-center justify-center font-bold transition-transform duration-300 hover:scale-105 cursor-pointer"
                  title={`View ${totalRemainingProducts} more products`}
                >
                  <p className="text-xl sm:text-2xl leading-none">+{totalRemainingProducts}</p>
                  <p className="text-xs leading-none">more</p>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Hero Image - Optimized with Next/Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-16 md:mt-0 relative w-[320px] h-[320px] md:w-[480px] md:h-[480px] flex-shrink-0"
        >
          <Image
            src="/hero-pink-fashion.png"
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
