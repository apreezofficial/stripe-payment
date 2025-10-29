"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 flex flex-col items-center justify-center px-6 text-center">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-center mb-3">
          <Sparkles className="w-6 h-6 text-pink-500 mr-2" />
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome to <span className="text-pink-500">Test</span>
          </h1>
        </div>
        <p className="text-gray-600 mt-2 mb-6">
          Discover your perfect outfit today — elegant, comfy, and effortlessly
          you. Shop the latest arrivals and exclusive collections.
        </p>

        <div className="flex justify-center gap-4">
          <Link href="/products">
            <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-6">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Shop Now
            </Button>
          </Link>

          <Link href="/about">
            <Button
              variant="outline"
              className="border-pink-400 text-pink-500 hover:bg-pink-100 rounded-full px-6"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Featured Products */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-20 w-full max-w-6xl"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Featured Collections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
          {["Elegant Dress", "Casual Set", "Cozy Hoodie"].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="h-56 bg-pink-200" />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{item}</h3>
                <p className="text-gray-500 text-sm mb-2">
                  Trending style of the season
                </p>
                <Button
                  className="bg-pink-500 hover:bg-pink-600 text-white w-full rounded-full"
                  size="sm"
                >
                  View Product
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="mt-20 text-sm text-gray-500 mb-4">
        © {new Date().getFullYear()} Test — All rights reserved.
      </footer>
    </main>
  );
}
