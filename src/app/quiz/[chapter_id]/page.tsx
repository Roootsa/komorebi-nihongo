"use client";

import { useState, use } from "react";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";

// Import data kuis yang baru saja kamu buat
import quizDataRaw from "@/data/quiz.json";

// 1. Definisikan Tipe Data
interface QuizQuestion {
  id: string;
  chapter: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const quizData = quizDataRaw as QuizQuestion[];

export default function QuizPage({ params }: { params: Promise<{ chapter_id: string }> }) {
  // 2. Ekstrak Parameter Bab
  const resolvedParams = use(params);
  const chapterId = parseInt(resolvedParams.chapter_id);

  // Ambil hanya soal untuk bab ini
  const questions = quizData.filter((q) => q.chapter === chapterId);

  // 3. State Management untuk Logika Kuis
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Jika data belum ada (mencegah error)
  if (questions.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <GlassCard className="text-center">
          <h2 className="text-2xl font-bold mb-4">Kuis Belum Tersedia</h2>
          <Link href={`/learn/${chapterId}`}>
            <GlowButton>Kembali ke Materi</GlowButton>
          </Link>
        </GlassCard>
      </main>
    );
  }

  const currentQuestion = questions[currentIndex];

  // 4. Fungsi-fungsi Interaksi (Handlers)
  const handleSelectOption = (option: string) => {
    // Jangan izinkan ganti jawaban kalau sudah di-cek
    if (!isAnswerChecked) {
      setSelectedAnswer(option);
    }
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;
    
    setIsAnswerChecked(true);
    
    // Tambah skor jika benar (misal tiap soal poinnya 100/jumlah_soal)
    if (selectedAnswer === currentQuestion.correctAnswer) {
      const poinPerSoal = 100 / questions.length;
      setScore((prev) => prev + poinPerSoal);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      // Lanjut ke soal berikutnya, reset status
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      // Jika ini soal terakhir, akhiri kuis
      setIsFinished(true);
    }
  };

  // 5. Tampilan Jika Kuis Selesai (Result Screen)
  if (isFinished) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <GlassCard className="max-w-md w-full text-center py-12 px-8 flex flex-col items-center shadow-2xl">
          <span className="text-6xl mb-4">{score >= 80 ? '🎉' : 'ganbatte!'}</span>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Kuis Selesai!</h2>
          <p className="text-slate-600 mb-8">Bab {chapterId}</p>
          
          {/* Lingkaran Skor Akhir */}
          <div className="relative w-40 h-40 rounded-full border-[12px] border-white/50 flex items-center justify-center mb-8 shadow-inner">
            <span className={`text-5xl font-bold ${score >= 80 ? 'text-emerald-500' : 'text-orange-500'}`}>
              {Math.round(score)}
            </span>
          </div>

          <p className="font-medium text-slate-700 mb-8">
            {score >= 80 
              ? "Luar Biasa! Kamu sudah siap ke bab selanjutnya." 
              : "Tetap semangat! Coba baca materinya lagi dan ulang kembali."}
          </p>

          <Link href="/dashboard" className="w-full">
            <GlowButton className="w-full">Kembali ke Dashboard</GlowButton>
          </Link>
        </GlassCard>
      </main>
    );
  }

  // 6. Tampilan Utama Kuis
  const progressPercentage = ((currentIndex) / questions.length) * 100;

  return (
    <main className="max-w-3xl mx-auto p-4 md:p-8 pt-12 min-h-screen flex flex-col">
      
      {/* Top Bar: Progress & Skor */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href={`/learn/${chapterId}`} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/40 hover:bg-white/60 transition shadow-sm font-bold text-slate-700">
            X
          </Link>
          <p className="font-bold text-slate-600">Soal {currentIndex + 1} / {questions.length}</p>
        </div>
        <div className="font-bold text-orange-600 bg-white/50 px-4 py-2 rounded-full border border-white/60">
          ⭐ {Math.round(score)}
        </div>
      </div>

      {/* Progress Bar (Visualisasi) */}
      <div className="w-full h-2 bg-white/30 rounded-full mb-12 overflow-hidden">
        <div 
          className="h-full bg-orange-400 transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Area Pertanyaan */}
      <div className="flex-grow flex flex-col">
        <GlassCard className="mb-8 bg-white/40 border-white/60 p-8 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 text-center leading-relaxed">
            {currentQuestion.question}
          </h2>
        </GlassCard>

        {/* Pilihan Jawaban (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {currentQuestion.options.map((option, idx) => {
            
            // Logika Pewarnaan Tombol
            let buttonStyle = "bg-white/50 text-slate-700 hover:bg-white/70"; // Default
            
            if (isAnswerChecked) {
              if (option === currentQuestion.correctAnswer) {
                // Jawaban Benar (Hijau terang)
                buttonStyle = "bg-emerald-400 text-white shadow-lg border-emerald-300";
              } else if (option === selectedAnswer) {
                // Jawaban Salah yang dipilih (Merah)
                buttonStyle = "bg-rose-400 text-white shadow-inner opacity-80 border-rose-300";
              } else {
                // Pilihan lain diredupkan
                buttonStyle = "bg-white/30 text-slate-400 opacity-50";
              }
            } else if (option === selectedAnswer) {
              // Baru Dipilih, belum di-cek (Oranye / Glow)
              buttonStyle = "bg-orange-300 text-white shadow-glow border-orange-200 scale-[1.02] transform transition-transform";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(option)}
                disabled={isAnswerChecked}
                className={`p-4 rounded-2xl text-lg font-bold border border-white/40 transition-all duration-300 ${buttonStyle}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Penjelasan (Muncul setelah cek jawaban) */}
        {isAnswerChecked && (
          <div className="mb-8 p-4 rounded-xl bg-white/40 border-l-4 border-l-blue-400 animate-fade-in">
            <p className="text-sm font-bold text-blue-600 mb-1">Penjelasan:</p>
            <p className="text-slate-700 font-medium">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Footer (Action Buttons) */}
        <div className="mt-auto flex justify-center pb-8">
          {!isAnswerChecked ? (
            <GlowButton 
              onClick={handleCheckAnswer} 
              disabled={!selectedAnswer}
              className={`w-full md:w-auto px-12 ${!selectedAnswer ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
            >
              Cek Jawaban
            </GlowButton>
          ) : (
            <GlowButton onClick={handleNextQuestion} className="w-full md:w-auto px-12 bg-white/70 text-slate-800 border-slate-300">
              {currentIndex + 1 === questions.length ? "Lihat Hasil Akhir" : "Lanjut ke Soal Berikutnya ➔"}
            </GlowButton>
          )}
        </div>
      </div>

    </main>
  );
}