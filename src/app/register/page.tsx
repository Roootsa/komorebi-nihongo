"use client";

export const dynamic = "force-static";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Pengecekan input
    if (!email || !password) {
      alert("Email dan password wajib diisi");
      return;
    }

    setLoading(true);

    try {
      // 1. Buat akun di Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update Nama Profil di Auth
      await updateProfile(user, { displayName: fullName });

      // 3. Inisialisasi Data Progress di Firestore (Database)
      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        email: email,
        unlockedChapters: [1], // Bab 1 otomatis terbuka untuk pengguna baru
        createdAt: new Date().toISOString()
      });

      // 4. Simpan nama ke localStorage untuk sapaan Dashboard
      if (typeof window !== "undefined") {
        localStorage.setItem("komorebi_username", fullName);
        
        // ✅ FITUR BARU: Paksa memori progress kembali murni ke Bab 1
        localStorage.setItem("komorebi_progress", JSON.stringify([1]));
      }

      alert("Akun berhasil dibuat! Selamat belajar 🌸");
      router.push("/dashboard");
    } catch (error: any) {
      // FITUR BARU: Menerjemahkan error Firebase menjadi ramah pengguna
      if (error.code === 'auth/email-already-in-use') {
        alert("Email ini sudah terdaftar! Silakan gunakan email lain atau langsung Login. 🌸");
      } else if (error.code === 'auth/weak-password') {
        alert("Password terlalu pendek! Gunakan minimal 6 karakter ya. 🌸");
      } else if (error.code === 'auth/invalid-email') {
        alert("Format email sepertinya salah. Coba periksa lagi! 🌸");
      } else {
        alert("Gagal mendaftar: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Bagian Kiri: Teks Puitis */}
        <div className="text-center md:text-left space-y-6 hidden md:block px-8">
          <div className="inline-block p-3 bg-white/30 rounded-2xl border border-white/50 mb-2 shadow-glass">
            <span className="text-4xl">🌱</span>
          </div>
          <h1 className="text-5xl font-bold text-slate-800 leading-tight">
            Mulai <br /> <span className="text-orange-600">Perjalananmu</span>
          </h1>
          <p className="text-xl text-slate-700 font-medium italic">
            {"Setiap ahli dulunya adalah seorang pemula."}
          </p>
        </div>

        {/* Bagian Kanan: Form Register */}
        <div className="flex justify-center">
          <GlassCard className="w-full max-w-md p-8 shadow-2xl bg-white/40 border-white/60">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Buat Akun Baru</h2>
            
            <form onSubmit={handleRegister} className="space-y-4" suppressHydrationWarning>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/50 focus:ring-2 focus:ring-orange-400 outline-none transition-all"
                  placeholder="Contoh: Faizar Rasyadan"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/50 focus:ring-2 focus:ring-orange-400 outline-none transition-all"
                  placeholder="nama@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white/50 focus:ring-2 focus:ring-orange-400 outline-none transition-all"
                  placeholder="Minimal 6 karakter"
                  required
                />
              </div>

              <div className="pt-4">
                <GlowButton className="w-full" type="submit" disabled={loading}>
                  {loading ? "Sedang Mendaftar..." : "Daftar Sekarang ➔"}
                </GlowButton>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-slate-600">
              Sudah punya akun? <Link href="/" className="text-orange-600 font-bold hover:underline ml-1">Masuk di sini</Link>
            </p>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}