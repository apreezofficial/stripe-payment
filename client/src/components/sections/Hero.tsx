"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; // Assuming your Button component is fine
import Link from "next/link";
import Image from "next/image"; // Import Next.js Image component

// --- Type Definitions ---
interface Product {
  id: string;
  name: string;
  image: string; // The URL for the image
  price: number;
}

// --- Mock Product Data (Replace with real API fetching) ---
// Note: In a real-world app, you would still fetch the data as you were,
// but for a better demonstration and avoiding runtime errors for the mock,
// I'll use a local mock array for the image paths.
const mockProducts: Product[] = [
  { id: "p1", name: "Sleek Sneaker", image: "/mock-product-1.jpg", price: 89.99 },
  { id: "p2", name: "Utility Bag", image: "/mock-product-2.jpg", price: 45.00 },
  { id: "p3", name: "Crop Hoodie", image: "/mock-product-3.jpg", price: 59.99 },
];
// NOTE: You'll need to create or provide these images in your public folder!

// --- Component ---
export default function Hero() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const totalRemainingProducts = 250; // Hardcoded, but could be fetched from API

  useEffect(() => {
    // Simulating API Fetch
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // --- REAL FETCH (Comment out the line below and uncomment this section) ---
        /*
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=3`, {
          cache: "no-store",
        });
        const data = await res.json();
        setProducts(data);
        */

        // --- MOCK DATA (For demonstration) ---
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        setProducts(mockProducts);
        // --- END MOCK DATA ---

      } catch (error) {
        console.error("Failed to fetch products:", error);
        // Fallback or error state handling
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

          {/* New Product Preview Design (Circular & Overlapping) */}
          <div className="pt-12">
            <h3 className="text-lg font-semibold text-pink-300 mb-4 text-center md:text-left">Top New Arrivals:</h3>
            {loading ? (
              <p className="text-gray-400">Loading today's featured products...</p>
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
                    style={{ zIndex: 10 - index }} // Ensures correct overlap order
                    title={product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-gray-900 overflow-hidden relative cursor-pointer group transition-transform duration-300 hover:scale-105"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill // Use fill to cover the circular container
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: "cover" }}
                      priority={index === 0} // Prioritize loading the first image
                      className="transition-opacity duration-500 ease-in-out group-hover:opacity-80"
                    />
                    {/* Optional: Hover overlay for quick info */}
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
            priority // High priority for the main image
            fill // Fill the parent div
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "contain" }}
            className="drop-shadow-[0_25px_25px_rgba(236,72,153,0.5)] rounded-2xl"
          />
          {/* Optional: Add a subtle animated glow/dot */}
          <div className="absolute top-1/4 left-0 w-8 h-8 bg-pink-400 rounded-full blur-xl animate-pulse" />
        </motion.div>
      </div>
    </section>
  );
}
