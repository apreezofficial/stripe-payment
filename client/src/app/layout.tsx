import Navbar from "@/components/layout/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-pink-50 text-gray-900">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
