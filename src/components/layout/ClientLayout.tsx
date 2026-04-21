// src/components/layout/ClientLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopNavbar from "@/components/layout/TopNavbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Deteksi apakah ini halaman auth (Login/Register)
  const isAuthPage = pathname === "/" || pathname === "/register";

  // Jika ini halaman Login/Register, tampilkan halamannya saja (tanpa navbar/sidebar/margin)
  if (isAuthPage) {
    return (
      <div className="flex-1 min-h-screen w-full">
        {children}
      </div>
    );
  }

  // Jika halaman selain Login/Register (seperti Dashboard), tampilkan dengan layout lengkap
  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen md:ml-64">
        <TopNavbar />
        <div className="flex-1">
          {children}
        </div>
      </div>
    </>
  );
}