"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";

// Dummy data bab (nantinya bisa dipisah ke file JSON)
const chapterList = [
  { id: 1, title: "Bab 1: Perkenalan Diri", desc: "Watashi, Anata, dan profesi." },
  { id: 2, title: "Bab 2: Kata Tunjuk Benda", desc: "Kore, Sore, Are dan kepemilikan partikel 'no'." },
  { id: 3, title: "Bab 3: Tempat & Harga", desc: "Koko, Soko, Asoko dan berbelanja." },
];

export default function DashboardPage() {
  // Secara default, hanya Bab 1 yang terbuka [1]
  const [unlockedChapters, setUnlockedChapters] = useState<number[]>([1]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Saat halaman dimuat, cek apakah ada progress yang tersimpan di memori browser
    const saved = localStorage.getItem("komorebi_progress");
    if (saved) {
      setUnlockedChapters(JSON.parse(saved));
    }
    setIsMounted(true); // Tandai bahwa komponen sudah siap dirender di client
  }, []);

  // Mencegah error Hydration (layar kedap-kedip) di Next.js
  if (!isMounted) return null;

  // Asumsi total bab ada 10, hitung berapa yang sudah selesai (bab terakhir terbuka dikurangi 1)
  const totalSelesai = unlockedChapters.length > 1 ? unlockedChapters.length - 1 : 0;
  const progressPercentage = (totalSelesai / 10) * 100;

  return (
    <main className="max-w-4xl mx-auto p-8 pt-16 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Ohayou, Faizar! 🌅</h1>
          <p className="text-slate-600 mt-1">Langkah pertamamu menuju matahari terbit.</p>
        </div>
        <div className="bg-white/40 px-4 py-2 rounded-full border border-white/50 shadow-sm font-bold text-orange-600">
          ⭐ Level N5
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Progress Tracker (Kini Dinamis!) */}
        <div className="md:col-span-1">
          <GlassCard className="flex flex-col items-center text-center sticky top-8 bg-white/40">
            <h2 className="font-semibold text-lg mb-6">Progress Tracker</h2>
            
            <div className="relative w-32 h-32 rounded-full border-8 border-white/30 flex items-center justify-center mb-4 overflow-hidden">
               {/* Lingkaran orange yang mengisi sesuai progress */}
               <div 
                  className="absolute bottom-0 w-full bg-orange-400 transition-all duration-1000 ease-out opacity-80"
                  style={{ height: `${progressPercentage}%` }}
               ></div>
              <span className="text-2xl font-bold text-slate-800 z-10">{progressPercentage}%</span>
            </div>
            
            <p className="text-sm text-slate-600">{totalSelesai} / 10 Bab Selesai</p>
            <p className="text-xs text-slate-500 mt-4">Terus semangat belajarnya!</p>
          </GlassCard>
        </div>

        {/* Kolom Kanan: Daftar Bab (Kini Dinamis!) */}
        <div className="md:col-span-2 space-y-4">
          {chapterList.map((chapter) => {
            const isUnlocked = unlockedChapters.includes(chapter.id);
            const isFinished = unlockedChapters.includes(chapter.id + 1); // Dianggap selesai jika bab depannya terbuka
            
            if (isFinished) {
              return (
                <GlassCard key={chapter.id} className="opacity-70 border-l-4 border-l-emerald-400 flex justify-between items-center bg-white/40">
                  <div>
                    <p className="text-xs font-bold text-emerald-600 mb-1">SELESAI</p>
                    <h3 className="text-xl font-bold">{chapter.title}</h3>
                    <p className="text-sm text-slate-600">{chapter.desc}</p>
                  </div>
                  <div className="text-2xl">✅</div>
                </GlassCard>
              );
            }

            if (isUnlocked) {
              return (
                <GlassCard key={chapter.id} className="border-2 border-orange-300 shadow-glow flex flex-col justify-between bg-white/60">
                  <div className="mb-4">
                    <p className="text-xs font-bold text-orange-600 mb-1">SEDANG DIKERJAKAN</p>
                    <h3 className="text-xl font-bold">{chapter.title}</h3>
                    <p className="text-sm text-slate-600">{chapter.desc}</p>
                  </div>
                  <div className="self-end">
                    <Link href={`/learn/${chapter.id}`}>
                      <GlowButton>Lanjutkan Belajar ➔</GlowButton>
                    </Link>
                  </div>
                </GlassCard>
              );
            }

            return (
              <GlassCard key={chapter.id} className="opacity-50 grayscale flex justify-between items-center cursor-not-allowed bg-white/40">
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-1">TERKUNCI</p>
                  <h3 className="text-xl font-bold">{chapter.title}</h3>
                  <p className="text-sm text-slate-600">{chapter.desc}</p>
                </div>
                <div className="text-2xl">🔒</div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </main>
  );
}