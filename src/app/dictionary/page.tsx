"use client";

import { useState } from "react";
import GlassCard from "@/components/ui/GlassCard";

// Tarik data seluruh kosakata
import vocabDataRaw from "@/data/vocabulary.json";

interface VocabItem {
  id: number;
  chapter: number;
  kanji: string;
  kana: string;
  romaji: string;
  meaning: string;
}

const vocabData = vocabDataRaw as VocabItem[];

export default function DictionaryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Logika Filter: Mencari berdasarkan arti, romaji, kana, ATAU kanji
  const filteredVocab = vocabData.filter((v) =>
    v.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.romaji.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.kana.includes(searchQuery) ||
    v.kanji.includes(searchQuery)
  );

  return (
    <main className="max-w-5xl mx-auto p-4 md:p-8 pt-12 min-h-screen">
      
      {/* Header Kamus */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Kamus Global 📖</h1>
        <p className="text-slate-600">Cari kosakata berdasarkan Romaji, Hiragana, Kanji, atau arti kata.</p>
      </div>

      {/* Kolom Pencarian */}
      <div className="mb-10 relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
        <input
          type="text"
          placeholder="Ketik 'buku', 'watashi', atau '先生'..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/60 border-2 border-white/50 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-200/50 shadow-inner text-lg text-slate-800 transition-all placeholder:text-slate-400"
        />
      </div>

      {/* Hasil Pencarian (Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVocab.length > 0 ? (
          filteredVocab.map((v) => (
            <GlassCard key={v.id} className="bg-white/40 hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start mb-4 border-b border-white/60 pb-2">
                <h3 className="text-4xl font-bold text-slate-800">{v.kanji}</h3>
                <span className="text-xs font-bold text-orange-600 bg-white/70 px-3 py-1 rounded-full shadow-sm">
                  Bab {v.chapter}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-600 mb-1">{v.kana}</p>
              <p className="text-xs text-slate-500 italic mb-4">{v.romaji}</p>
              <div className="bg-white/50 p-3 rounded-xl shadow-inner">
                <p className="font-semibold text-orange-700">{v.meaning}</p>
              </div>
            </GlassCard>
          ))
        ) : (
          // Jika tidak ada yang cocok
          <div className="col-span-full py-12 text-center">
            <span className="text-6xl block mb-4">🍃</span>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">Kata tidak ditemukan</h3>
            <p className="text-slate-500">Coba gunakan ejaan atau kata kunci lain.</p>
          </div>
        )}
      </div>

    </main>
  );
}