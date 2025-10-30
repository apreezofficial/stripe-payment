"use client";

import { useState, useEffect, useContext, createContext } from "react"; // Added createContext for self-containment
import { ShoppingBag, Menu, X, Home, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- MOCK/INLINED CONTEXT FOR COMPILATION STABILITY ---
// NOTE: In your full Next.js app, you will remove this mock and keep:
// import { CartContext } from "@/context/CartContext";

interface CartItem { id: string; name: string; price: number; quantity: number; }
interface CartContextType { cart: CartItem[]; }

// Define a placeholder/mock context locally
const CartContext = createContext<CartContextType>({ 
    cart: [
        // Mock data to ensure itemCount > 0 for demonstration purposes
        { id: '1', name: 'Mock Item', price: 10, quantity: 1 }
    ] 
});

// --- END MOCK ---

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Use CartContext to get item count
  // This uses the mocked context defined above to satisfy the compiler
  const { cart } = useContext(CartContext); 
  // Calculate total number of unique items in the cart
  const itemCount = cart.length; 
  
  // --- Dynamic Category Fetch Logic ---
  useEffect(() => {
    async function fetchCategories() {
      try {
        // This is still a fallback; replace with your actual fetch
        setCategories(["All Products", "Electronics", "Clothing", "Home Goods"]);
      } catch (err) {
        console.error("Category fetch failed, using fallback.", err);
        setCategories(["All Products", "Electronics", "Clothing", "Home Goods"]);
      }
    }
    fetchCategories();
  }, []);

  const primaryNavLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "/products", icon: Store }, // Default shop page
  ];

  // Helper function to render links using standard <a> tag
  const NavLink = ({ href, children, className = "", onClick }: { href: string, children: React.ReactNode, className?: string, onClick?: () => void }) => (
    <a 
      href={href} 
      className={className} 
      onClick={onClick}
    >
      {children}
    </a>
  );


  return (
    <nav className="w-full bg-pink-600 text-white shadow-xl sticky top-0 z-50 border-b border-pink-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <NavLink href="/" className="text-3xl font-extrabold tracking-tight hover:text-pink-100 transition duration-300">
          Craft<span className="text-pink-200 font-normal">Store</span>
        </NavLink>

        {/* Desktop Menu - Primary Links */}
        <div className="hidden lg:flex items-center space-x-8 font-medium">
          {primaryNavLinks.map((link) => (
            <NavLink
              key={link.name}
              href={link.href}
              className="py-2 px-3 rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-1"
            >
              <link.icon className="w-4 h-4" />
              {link.name}
            </NavLink>
          ))}
        </div>
        
        {/* Desktop Menu - Categories */}
        <div className="hidden lg:flex items-center space-x-6 text-sm">
            {categories.slice(0, 4).map((cat) => (
                <NavLink
                    key={cat}
                    href={`/category/${cat.toLowerCase().replace(/\s/g, '-')}`}
                    className="text-pink-200 hover:text-white transition-colors border-b-2 border-transparent hover:border-pink-200 pb-1"
                >
                    {cat}
                </NavLink>
            ))}
        </div>

        {/* Cart Button & Mobile Toggle */}
        <div className="flex items-center space-x-4">
          
          {/* Cart Button (Desktop & Mobile) */}
          <NavLink href="/cart">
            <Button
              // Changed variant to 'outline' to use the Tailwind white background we set
              variant="outline"
              className="relative bg-white text-pink-600 hover:bg-pink-100 font-bold px-4 py-2 rounded-full transition duration-300 shadow-lg"
              aria-label={`Cart with ${itemCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {/* The "WOW" Superscript Badge */}
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-extrabold rounded-full ring-2 ring-pink-600 transition-all duration-300 transform scale-105">
                  {itemCount}
                </span>
              )}
            </Button>
          </NavLink>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-pink-700 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {/* Use a smooth transition */}
      <div 
        id="mobile-menu" 
        className={`lg:hidden overflow-hidden transition-max-height duration-500 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}
      >
        <div className="bg-pink-700 text-white pb-4 pt-2 space-y-2 px-4 shadow-inner">
          
          {/* Primary Links */}
          {primaryNavLinks.map((link) => (
            <NavLink
              key={link.name}
              href={link.href}
              className="block p-3 rounded-lg hover:bg-pink-600 transition-colors font-semibold flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <link.icon className="w-5 h-5" />
              {link.name}
            </NavLink>
          ))}

          {/* Category Links */}
          <div className="pt-2 border-t border-pink-500 space-y-1">
            <p className="text-pink-200 text-sm px-3 pt-1">Product Categories</p>
            {categories.map((cat) => (
                <NavLink
                key={cat}
                href={`/category/${cat.toLowerCase().replace(/\s/g, '-')}`}
                className="block pl-5 pr-3 py-2 rounded-lg hover:bg-pink-600 transition-colors text-sm"
                onClick={() => setIsOpen(false)}
                >
                {cat}
                </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
          }
                                                                 
