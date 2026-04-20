"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";

const chapterList = [
  { id: 1, title: "Bab 1: Perkenalan Diri", desc: "Watashi, Anata, dan profesi." },
  { id: 2, title: "Bab 2: Kata Tunjuk Benda", desc: "Kore, Sore, Are dsb." },
  { id: 3, title: "Bab 3: Tempat & Harga", desc: "Koko, Soko, Asoko dsb." },
];

export default function DashboardPage() {
  const [unlockedChapters, setUnlockedChapters] = useState<number[]>([1]);
  const [userName, setUserName] = useState("Pelajar");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserName(user.displayName || "Pelajar");
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          setUnlockedChapters(docSnap.data().unlockedChapters || [1]);
        }
      } else {
        // Fallback jika belum terdeteksi currentUser (mungkin perlu redirect)
        const savedName = localStorage.getItem("komorebi_username");
        if (savedName) setUserName(savedName);
      }
      setIsMounted(true);
    };

    fetchUserData();
  }, []);

  if (!isMounted) return null;

  const progressPercentage = ((unlockedChapters.length - 1) / 10) * 100;

  return (
    <main className="max-w-4xl mx-auto p-8 pt-16 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Ohayou, {userName}! 🌅</h1>
        <p className="text-slate-600">Selamat datang kembali di Komorebi Nihongo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Kolom Progress */}
        <div className="md:col-span-1">
          <GlassCard className="text-center sticky top-8 bg-white/40">
            <h2 className="font-semibold mb-4">Progress Belajar</h2>
            <div className="relative w-24 h-24 mx-auto rounded-full border-4 border-white/50 flex items-center justify-center mb-2 overflow-hidden">
               <div className="absolute bottom-0 w-full bg-orange-400 opacity-60" style={{ height: `${progressPercentage}%` }}></div>
               <span className="relative font-bold text-slate-800">{Math.round(progressPercentage)}%</span>
            </div>
            <p className="text-xs text-slate-500">{unlockedChapters.length - 1} / 10 Bab Selesai</p>
          </GlassCard>
        </div>

        {/* Kolom Daftar Bab */}
        <div className="md:col-span-2 space-y-4">
          {chapterList.map((chapter) => {
            const isUnlocked = unlockedChapters.includes(chapter.id);
            const isFinished = unlockedChapters.includes(chapter.id + 1);

            return (
              <GlassCard key={chapter.id} className={`flex justify-between items-center ${!isUnlocked ? 'opacity-50 grayscale' : 'bg-white/60 border-orange-200'}`}>
                <div>
                  <p className="text-xs font-bold text-orange-600">{isFinished ? "✅ SELESAI" : isUnlocked ? "📖 TERBUKA" : "🔒 TERKUNCI"}</p>
                  <h3 className="font-bold">{chapter.title}</h3>
                  <p className="text-sm text-slate-600">{chapter.desc}</p>
                </div>
                {isUnlocked && (
                  <Link href={`/learn/${chapter.id}`}>
                    <GlowButton className="text-sm py-2 px-4">{isFinished ? "🔄 Ulang" : "Lanjut"}</GlowButton>
                  </Link>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>
    </main>
  );
}