"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  
  // Sembunyikan sidebar di halaman Login (halaman utama)
  if (pathname === "/") return null;

  return (
    <aside className="fixed hidden md:flex flex-col w-64 h-screen bg-white/40 border-r border-white/50 shadow-glass p-6 backdrop-blur-md z-40">
      <div className="text-2xl font-bold text-slate-800 mb-8">
        Komorebi<br/><span className="text-orange-600">Nihongo</span>
      </div>
      
      <nav className="flex flex-col gap-4">
        <Link 
          href="/dashboard" 
          className={`p-3 rounded-xl font-bold transition ${pathname === '/dashboard' ? 'bg-orange-400 text-white shadow-glow' : 'text-slate-600 hover:bg-white/60'}`}
        >
          🏠 Dashboard
        </Link>
        <Link 
          href="/dictionary" 
          className={`p-3 rounded-xl font-bold transition ${pathname === '/dictionary' ? 'bg-orange-400 text-white shadow-glow' : 'text-slate-600 hover:bg-white/60'}`}
        >
          📖 Kamus Global
        </Link>
      </nav>
    </aside>
  );
}