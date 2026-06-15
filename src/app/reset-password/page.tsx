"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, Lock } from "lucide-react";
import PublicFooter from "@/components/layout/public-footer";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) { setError("Le mot de passe doit faire au moins 6 caractères."); return; }
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return; }

    setLoading(true);
    setError("");

    const { error: err } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (err) { setError(err.message); return; }

    router.push("/login?reset=success");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-4">
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF5A1F]/10 blur-[160px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
          <img src="/logo.png" alt="TrackMarshal" className="mb-6 h-14 w-14 rounded-full object-cover" />

          <h1 className="text-3xl font-black">Nouveau mot de passe</h1>
          <p className="mt-3 text-zinc-400">Choisissez un mot de passe sécurisé.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="relative">
              <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nouveau mot de passe"
                className="h-16 w-full rounded-2xl border border-white/10 bg-black/40 pl-14 pr-14 outline-none focus:border-[#FF5A1F]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirmer le mot de passe"
                className="h-16 w-full rounded-2xl border border-white/10 bg-black/40 pl-14 pr-6 outline-none focus:border-[#FF5A1F]"
              />
            </div>

            {error && (
              <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-16 w-full items-center justify-center rounded-2xl bg-[#FF5A1F] text-lg font-black transition hover:scale-[1.01] disabled:opacity-60"
            >
              {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
            </button>
          </form>
        </div>
      </div>
      <PublicFooter />
    </main>
  );
}
