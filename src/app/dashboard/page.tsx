import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";

export default function DashboardPage() {
  return (
    <main className="max-w-4xl mx-auto p-8 pt-16">
      {/* Header Sapaan */}
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

        {/* Kolom Kiri: Progress Tracker */}
        <div className="md:col-span-1">
          <GlassCard className="flex flex-col items-center text-center sticky top-8">
            <h2 className="font-semibold text-lg mb-6">Progress Tracker</h2>
            <div className="relative w-32 h-32 rounded-full border-8 border-white/30 flex items-center justify-center mb-4">
              <div className="absolute w-full h-full rounded-full border-8 border-orange-400 border-t-transparent animate-spin-slow"></div>
              <span className="text-2xl font-bold text-orange-600">20%</span>
            </div>

            <p className="text-sm text-slate-600">2 / 10 Bab Selesai</p>
            <p className="text-xs text-slate-500 mt-4">Sedikit lagi bisa baca hiragana dengan lancar!</p>
          </GlassCard>
        </div>

        {/* Kolom Kanan: Daftar Bab */}
        <div className="md:col-span-2 space-y-4">

          {/* Bab 1 (Selesai) */}
          <GlassCard className="opacity-70 border-l-4 border-l-emerald-400 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-emerald-600 mb-1">SELESAI</p>
              <h3 className="text-xl font-bold">Bab 1: Perkenalan Diri</h3>
              <p className="text-sm text-slate-600">Watashi, Anata, dan profesi.</p>
            </div>
            <div className="text-2xl">✅</div>
          </GlassCard>

          {/* Bab 2 (Aktif - Menyala) */}
          <GlassCard className="border-2 border-orange-300 shadow-glow flex flex-col justify-between">
            <div className="mb-4">
              <p className="text-xs font-bold text-orange-600 mb-1">SEDANG DIKERJAKAN</p>
              <h3 className="text-xl font-bold">Bab 2: Kata Tunjuk Benda</h3>
              <p className="text-sm text-slate-600">Kore, Sore, Are dan kepemilikan partikel {'no'}.</p>
            </div>
            <div className="self-end">
              <Link href="/learn/1">
                <GlowButton>Lanjutkan Belajar ➔</GlowButton>
              </Link>
            </div>
          </GlassCard>

          {/* Bab 3 (Terkunci) */}
          <GlassCard className="opacity-50 grayscale flex justify-between items-center cursor-not-allowed">
            <div>
              <p className="text-xs font-bold text-slate-500 mb-1">TERKUNCI</p>
              <h3 className="text-xl font-bold">Bab 3: Tempat & Harga</h3>
              <p className="text-sm text-slate-600">Koko, Soko, Asoko dan berbelanja.</p>
            </div>
            <div className="text-2xl">🔒</div>
          </GlassCard>

        </div>
      </div>
    </main>
  );
}