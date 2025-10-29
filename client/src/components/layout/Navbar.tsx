"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]); // will come from backend

  // ✅ Fetch categories from backend (placeholder)
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
        setCategories(["Men", "Women", "Kids", "Accessories"]); // fallback
      }
    }
    fetchCategories();
  }, []);

  return (
    <nav className="w-full bg-pink-500 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wide">
          Test<span className="text-pink-200">Store</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/category/${cat.toLowerCase()}`}
              className="hover:text-pink-200 transition-colors"
            >
              {cat}
            </Link>
          ))}

          <Link href="/about" className="hover:text-pink-200">
            About
          </Link>
          <Link href="/contact" className="hover:text-pink-200">
            Contact
          </Link>

          {/* Cart Button */}
          <Button
            variant="secondary"
            className="bg-white text-pink-600 hover:bg-pink-100 flex items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Cart (0)
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-pink-400"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-pink-600 text-white py-4 space-y-3 px-4">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/category/${cat.toLowerCase()}`}
              className="block hover:text-pink-200"
              onClick={() => setIsOpen(false)}
            >
              {cat}
            </Link>
          ))}

          <Link href="/about" className="block hover:text-pink-200">
            About
          </Link>
          <Link href="/contact" className="block hover:text-pink-200">
            Contact
          </Link>
          <Button
            variant="secondary"
            className="bg-white text-pink-600 hover:bg-pink-100 w-full flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" /> Cart (0)
          </Button>
        </div>
      )}
    </nav>
  );
}
