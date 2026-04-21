"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNavbar() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/register") {
    return null; 
  }
  if (pathname === "/") return null;

  return (
    <header className="md:hidden sticky top-0 w-full bg-white/60 border-b border-white/50 shadow-sm backdrop-blur-md z-50 p-4 flex justify-between items-center">
       <div className="text-xl font-bold text-slate-800">
         Komorebi<span className="text-orange-600">Nihongo</span>
       </div>
       <nav className="flex gap-6">
          <Link href="/dashboard" className="text-2xl hover:scale-110 transition">🏠</Link>
          <Link href="/dictionary" className="text-2xl hover:scale-110 transition">📖</Link>
       </nav>
    </header>
  );
}