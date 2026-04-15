"use client";

import { useState, use } from "react";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";

import vocabularyDataRaw from "@/data/vocabulary.json";
import grammarDataRaw from "@/data/grammar.json";

interface VocabItem {
  id: number;
  chapter: number;
  kanji: string;
  kana: string;
  romaji: string;
  meaning: string;
}

interface GrammarExample {
  jp: string;
  kana: string;
  id: string;
}

interface GrammarItem {
  id: number;
  chapter: number;
  title: string;
  explanation: string;
  examples: GrammarExample[];
}

const vocabularyData = vocabularyDataRaw as VocabItem[];
const grammarData = grammarDataRaw as GrammarItem[];

export default function MaterialPage({ params }: { params: Promise<{ chapter_id: string }> }) {
  const resolvedParams = use(params);
  const chapterId = parseInt(resolvedParams.chapter_id);

  const [activeTab, setActiveTab] = useState<'vocab' | 'grammar'>('vocab');

  const chapterVocab = vocabularyData.filter((v) => v.chapter === chapterId);
  const chapterGrammar = grammarData.filter((g) => g.chapter === chapterId);

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-8 pt-12 min-h-screen">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/40 hover:bg-white/60 transition shadow-sm font-bold text-slate-700">
          ←
        </Link>
        <div>
          <p className="text-sm font-bold text-orange-600">LEVEL N5</p>
          <h1 className="text-3xl font-bold text-slate-800">Bab {chapterId}</h1>
        </div>
      </div>

      {/* Navigasi Tab */}
      <div className="flex gap-4 mb-8 border-b border-white/40 pb-4">
        <button 
          onClick={() => setActiveTab('vocab')}
          className={`text-lg font-bold transition-all px-4 py-2 rounded-xl ${activeTab === 'vocab' ? 'bg-white/50 text-orange-600 shadow-glow' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Kosakata (Kotoba)
        </button>
        <button 
          onClick={() => setActiveTab('grammar')}
          className={`text-lg font-bold transition-all px-4 py-2 rounded-xl ${activeTab === 'grammar' ? 'bg-white/50 text-orange-600 shadow-glow' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Tata Bahasa (Bunpou)
        </button>
      </div>

      {/* Area Konten */}
      <div className="mb-12">
        {activeTab === 'vocab' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {chapterVocab.length > 0 ? chapterVocab.map((vocab) => (
              <GlassCard key={vocab.id} className="text-center hover:shadow-glow transition-all cursor-default bg-white/40">
                <h3 className="text-4xl font-bold text-slate-800 mb-2">{vocab.kanji}</h3>
                <p className="text-sm font-medium text-slate-600">{vocab.kana}</p>
                <p className="text-xs text-slate-500 italic mb-3">{vocab.romaji}</p>
                <div className="border-t border-white/60 pt-2">
                  <p className="font-semibold text-orange-700">{vocab.meaning}</p>
                </div>
              </GlassCard>
            )) : <p className="text-slate-500 italic">Materi kosakata bab ini belum tersedia.</p>}
          </div>
        )}

        {activeTab === 'grammar' && (
          <div className="space-y-6">
            {chapterGrammar.length > 0 ? chapterGrammar.map((grammar) => (
              <GlassCard key={grammar.id} className="bg-white/40">
                <h3 className="text-xl font-bold text-orange-700 mb-2 border-b border-white/60 pb-2">
                  {grammar.title}
                </h3>
                <p className="text-slate-700 mb-4 leading-relaxed">{grammar.explanation}</p>
                
                <div className="bg-white/50 p-4 rounded-xl space-y-3 shadow-inner">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Contoh Kalimat:</p>
                  {grammar.examples.map((ex, index) => (
                    <div key={index} className="border-l-4 border-orange-400 pl-3">
                      <p className="text-lg font-medium text-slate-800">{ex.jp}</p>
                      <p className="text-sm text-slate-600">{ex.kana}</p>
                      <p className="text-sm text-slate-700 italic mt-1">{`"${ex.id}"`}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )) : <p className="text-slate-500 italic">Materi tata bahasa bab ini belum tersedia.</p>}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-center pb-12">
        <Link href={`/quiz/${chapterId}`}>
          <GlowButton className="text-lg px-8">
            Siap Ambil Quiz Bab {chapterId} ➔
          </GlowButton>
        </Link>
      </div>

    </main>
  );
}