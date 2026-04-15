"use client"; // Tambahkan ini agar interaksi Link dan Button berjalan mulus

import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";

export default function WelcomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-8">
      {/* Container utama dengan grid untuk membelah layar (Split Screen) */}
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Bagian Kiri: Teks Puitis & Atmosfer */}
        <div className="text-center md:text-left space-y-6 hidden md:block px-8">
          <div className="inline-block p-3 bg-white/30 rounded-2xl border border-white/50 mb-2 shadow-glass">
            <span className="text-4xl">🌅</span>
          </div>
          <h1 className="text-5xl font-bold text-slate-800 drop-shadow-sm leading-tight">
            Komorebi <br /> <span className="text-orange-600">Nihongo</span>
          </h1>
          <p className="text-xl text-slate-700 font-medium italic">
            {`"Langkah pertamamu menuju matahari terbit dimulai di sini."`}
          </p>
          <p className="text-slate-600">
            Platform belajar bahasa Jepang interaktif berbasis Minna no Nihongo.
          </p>
        </div>

        {/* Bagian Kanan: Form Login */}
        <div className="flex justify-center">
          <GlassCard className="w-full max-w-md p-8 shadow-2xl border-t border-l border-white/60">
            
            {/* Judul Muncul hanya di layar HP */}
            <div className="text-center mb-8 md:hidden">
              <span className="text-4xl block mb-2">🌅</span>
              <h2 className="text-3xl font-bold text-slate-800">Komorebi Nihongo</h2>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Selamat Datang Kembali</h2>
            
            <form className="space-y-4">
              {/* Input Username */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username / Email</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl bg-white/40 border border-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-slate-500 text-slate-800 transition-all shadow-inner"
                  placeholder="Masukkan username"
                />
              </div>
              
              {/* Input Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-3 rounded-xl bg-white/40 border border-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-slate-500 text-slate-800 transition-all shadow-inner"
                  placeholder="••••••••"
                />
              </div>

              {/* Ingat Saya & Lupa Password */}
              <div className="flex justify-between items-center text-sm px-1 py-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-400 bg-white/50 border-white/50 w-4 h-4" />
                  <span className="text-slate-600">Ingat saya</span>
                </label>
                <button type="button" className="text-orange-600 hover:text-orange-700 font-bold transition-colors">Lupa password?</button>
              </div>

              {/* Tombol Login */}
              <div className="pt-4">
                {/* Dummy Login: Langsung diarahkan ke /dashboard */}
                <Link href="/dashboard" className="block w-full no-underline">
                  <GlowButton className="w-full flex justify-center items-center gap-2" type="button">
                    Masuk <span className="text-xl">➔</span>
                  </GlowButton>
                </Link>
              </div>
            </form>

            {/* Link Register */}
            <p className="mt-8 text-center text-sm text-slate-600">
              Belum punya akun? <button type="button" className="text-orange-600 font-bold hover:underline ml-1">Mulai perjalananmu</button>
            </p>
          </GlassCard>
        </div>

      </div>
    </main>
  );
}