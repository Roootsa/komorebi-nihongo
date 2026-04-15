"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";

import quizDataRaw from "@/data/quiz.json";

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
  const resolvedParams = use(params);
  const chapterId = parseInt(resolvedParams.chapter_id);

  const questions = quizData.filter((q) => q.chapter === chapterId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // FITUR BARU: Menyimpan progress ke localStorage jika lulus
  useEffect(() => {
    if (isFinished && score >= 80) {
      // Ambil data progress sebelumnya (default bab 1 terbuka)
      const savedProgress = JSON.parse(localStorage.getItem("komorebi_progress") || "[1]");
      const nextChapter = chapterId + 1;
      
      // Jika bab selanjutnya belum ada di penyimpanan, tambahkan!
      if (!savedProgress.includes(nextChapter)) {
        savedProgress.push(nextChapter);
        localStorage.setItem("komorebi_progress", JSON.stringify(savedProgress));
      }
    }
  }, [isFinished, score, chapterId]);

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

  const handleSelectOption = (option: string) => {
    if (!isAnswerChecked) setSelectedAnswer(option);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;
    setIsAnswerChecked(true);
    if (selectedAnswer === currentQuestion.correctAnswer) {
      const poinPerSoal = 100 / questions.length;
      setScore((prev) => prev + poinPerSoal);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <GlassCard className="max-w-md w-full text-center py-12 px-8 flex flex-col items-center shadow-2xl">
          <span className="text-6xl mb-4">{score >= 80 ? '🎉' : 'ganbatte!'}</span>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Kuis Selesai!</h2>
          <p className="text-slate-600 mb-8">Bab {chapterId}</p>
          
          <div className="relative w-40 h-40 rounded-full border-[12px] border-white/50 flex items-center justify-center mb-8 shadow-inner">
            <span className={`text-5xl font-bold ${score >= 80 ? 'text-emerald-500' : 'text-orange-500'}`}>
              {Math.round(score)}
            </span>
          </div>

          <p className="font-medium text-slate-700 mb-8">
            {score >= 80 
              ? "Luar Biasa! Bab selanjutnya telah terbuka di Dashboard." 
              : "Tetap semangat! Coba baca materinya lagi dan ulang kembali."}
          </p>

          <Link href="/dashboard" className="w-full">
            <GlowButton className="w-full">Kembali ke Dashboard</GlowButton>
          </Link>
        </GlassCard>
      </main>
    );
  }

  const progressPercentage = ((currentIndex) / questions.length) * 100;

  return (
    <main className="max-w-3xl mx-auto p-4 md:p-8 pt-12 min-h-screen flex flex-col">
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

      <div className="w-full h-2 bg-white/30 rounded-full mb-12 overflow-hidden">
        <div 
          className="h-full bg-orange-400 transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="flex-grow flex flex-col">
        <GlassCard className="mb-8 bg-white/40 border-white/60 p-8 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 text-center leading-relaxed">
            {currentQuestion.question}
          </h2>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {currentQuestion.options.map((option, idx) => {
            let buttonStyle = "bg-white/50 text-slate-700 hover:bg-white/70"; 
            if (isAnswerChecked) {
              if (option === currentQuestion.correctAnswer) buttonStyle = "bg-emerald-400 text-white shadow-lg border-emerald-300";
              else if (option === selectedAnswer) buttonStyle = "bg-rose-400 text-white shadow-inner opacity-80 border-rose-300";
              else buttonStyle = "bg-white/30 text-slate-400 opacity-50";
            } else if (option === selectedAnswer) {
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

        {isAnswerChecked && (
          <div className="mb-8 p-4 rounded-xl bg-white/40 border-l-4 border-l-blue-400 animate-fade-in">
            <p className="text-sm font-bold text-blue-600 mb-1">Penjelasan:</p>
            <p className="text-slate-700 font-medium">{currentQuestion.explanation}</p>
          </div>
        )}

        <div className="mt-auto flex justify-center pb-8">
          {!isAnswerChecked ? (
            <GlowButton onClick={handleCheckAnswer} disabled={!selectedAnswer} className={`w-full md:w-auto px-12 ${!selectedAnswer ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}>
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