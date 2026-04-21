"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ Import router
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";

import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"; 

const chapterList = [
  { id: 1, title: "Bab 1: Perkenalan Diri", desc: "Watashi, Anata, dan profesi." },
  { id: 2, title: "Bab 2: Kata Tunjuk Benda", desc: "Kore, Sore, Are dan kepemilikan partikel 'no'." },
  { id: 3, title: "Bab 3: Tempat & Harga", desc: "Koko, Soko, Asoko dan berbelanja." },
];

export default function DashboardPage() {
  const [unlockedChapters, setUnlockedChapters] = useState<number[]>([1]);
  const [isMounted, setIsMounted] = useState(false);
  const [userName, setUserName] = useState("Pelajar"); 
  const router = useRouter(); // ✅ Inisialisasi router

  useEffect(() => {
    // 1. Ambil data lokal
    const savedName = localStorage.getItem("komorebi_username");
    if (savedName) setUserName(savedName);

    const localProgressStr = localStorage.getItem("komorebi_progress");
    const localProgress = localProgressStr ? JSON.parse(localProgressStr) : [1];
    setUnlockedChapters(localProgress);

    // 2. Dengarkan Status Firebase
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const firebaseProgress = docSnap.data().unlockedChapters || [1];
            
            // Gabungkan data lokal & Firebase
            const mergedProgress = Array.from(new Set([...localProgress, ...firebaseProgress])).sort((a, b) => a - b);
            
            setUnlockedChapters(mergedProgress);
            localStorage.setItem("komorebi_progress", JSON.stringify(mergedProgress));

            if (mergedProgress.length > firebaseProgress.length) {
              await updateDoc(docRef, { unlockedChapters: mergedProgress });
            }
          }
        } catch (error) {
          console.error("Gagal mengambil progress dari database:", error);
        }
        setIsMounted(true); // Izinkan render jika aman
      } else {
        // 🔥 FITUR SATPAM: Tendang ke halaman login jika tidak ada user!
        router.replace("/"); 
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Selama loading ngecek akun, jangan tampilkan apa-apa dulu
  if (!isMounted) return null;

  const totalSelesai = unlockedChapters.length > 1 ? unlockedChapters.length - 1 : 0;
  const progressPercentage = (totalSelesai / 10) * 100;

  return (
    <main className="max-w-4xl mx-auto p-8 pt-16 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Ohayou, {userName}! 🌅</h1>
          <p className="text-slate-600 mt-1">Langkah pertamamu menuju matahari terbit.</p>
        </div>
        <div className="bg-white/40 px-4 py-2 rounded-full border border-white/50 shadow-sm font-bold text-orange-600">
          ⭐ Level N5
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <GlassCard className="flex flex-col items-center text-center sticky top-8 bg-white/40">
            <h2 className="font-semibold text-lg mb-6">Progress Tracker</h2>
            <div className="relative w-32 h-32 rounded-full border-8 border-white/30 flex items-center justify-center mb-4 overflow-hidden">
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

        <div className="md:col-span-2 space-y-4">
          {chapterList.map((chapter) => {
            const isUnlocked = unlockedChapters.includes(chapter.id);
            const isFinished = unlockedChapters.includes(chapter.id + 1);
            
            if (isFinished) {
              return (
                <GlassCard key={chapter.id} className="opacity-95 border-l-4 border-l-emerald-400 flex flex-col justify-between bg-white/60 shadow-sm transition-all hover:shadow-md">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs font-bold text-emerald-600">✅ SELESAI</p>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">{chapter.title}</h3>
                    <p className="text-sm text-slate-600">{chapter.desc}</p>
                  </div>
                  <div className="self-end mt-2">
                    <Link href={`/learn/${chapter.id}`}>
                      <button className="flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100/50 px-4 py-2 rounded-xl transition-all border border-emerald-200 shadow-inner">
                        <span className="text-lg">🔄</span> Ulangi Bab
                      </button>
                    </Link>
                  </div>
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