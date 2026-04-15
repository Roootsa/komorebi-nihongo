import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Import komponen navigasi yang baru dibuat
import Sidebar from "@/components/layout/Sidebar";
import TopNavbar from "@/components/layout/TopNavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Komorebi Nihongo",
  description: "Platform belajar bahasa Jepang",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} flex`}>
        {/* Sidebar akan diam di sebelah kiri (untuk laptop) */}
        <Sidebar />
        
        {/* Area utama akan menyesuaikan (bergeser ke kanan jika ada Sidebar) */}
        <div className="flex-1 flex flex-col min-h-screen md:ml-64">
          <TopNavbar />
          <div className="flex-1">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}