"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
}

export default function Hero() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch first 3 products from backend
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=3`, {
          cache: "no-store",
        });
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="relative w-full bg-gradient-to-b from-pink-500 to-pink-400 text-white py-20 overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.25)_0%,transparent_50%)]" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 relative z-10">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 text-center md:text-left"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Step Into <span className="text-pink-200">Style</span>  
            <br className="hidden md:block" /> with the Latest Collection
          </h1>
          <p className="text-lg md:text-xl text-pink-100 max-w-md">
            Discover our freshest arrivals — from streetwear to chic essentials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href="/products">
              <Button className="bg-white text-pink-600 hover:bg-pink-100 font-semibold px-6 py-3 text-lg">
                Shop Now
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/20 font-semibold px-6 py-3 text-lg"
              >
                Learn More
              </Button>
            </Link>
          </div>

          {/* Fetched products preview */}
          <div className="mt-10 flex flex-wrap gap-4 justify-center md:justify-start">
            {loading ? (
              <p className="text-pink-100">Loading products...</p>
            ) : (
              <>
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-md flex flex-col items-center w-32 sm:w-40"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <p className="mt-2 font-semibold text-sm">{product.name}</p>
                    <p className="text-pink-200 text-xs">${product.price}</p>
                  </motion.div>
                ))}
                <div className="flex flex-col justify-center items-center text-white/90">
                  <p className="text-3xl font-bold">+250</p>
                  <p className="text-xs">more</p>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mt-10 md:mt-0"
        >
          <img
            src="/hero-pink-fashion.png"
            alt="Fashion Hero"
            className="w-[320px] md:w-[480px] drop-shadow-2xl rounded-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
                    }
