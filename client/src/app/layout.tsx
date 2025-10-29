// app/layout.tsx 
import { Inter } from 'next/font/google';
import { CartProvider } from '@/context/CartContext'; // <-- Import the provider
import { Toaster } from 'sonner'; // <-- Recommended for showing toasts

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider> {/* <--- CRITICAL: Wrap the content here! */}
          {children}
          <Toaster position="bottom-right" richColors /> {/* For seeing "Item added" messages */}
        </CartProvider> {/* <--- CRITICAL: Close the Provider here! */}
      </body>
    </html>
  );
}
