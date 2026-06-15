"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Mail } from "lucide-react";
import PublicFooter from "@/components/layout/public-footer";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setError("Veuillez saisir votre email."); return; }
    setLoading(true);
    setError("");

    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);
    if (err) { setError(err.message); return; }
    setSent(true);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-4">
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF5A1F]/10 blur-[160px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <Link href="/login" className="mb-8 flex items-center gap-2 text-zinc-400 transition hover:text-white">
          <ArrowLeft size={18} />
          Retour à la connexion
        </Link>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
          <img src="/logo.png" alt="TrackMarshal" className="mb-6 h-14 w-14 rounded-full object-cover" />

          <h1 className="text-3xl font-black">Mot de passe oublié</h1>

          {sent ? (
            <div className="mt-6">
              <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
                <p className="font-semibold text-green-400">Email envoyé !</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Un lien de réinitialisation a été envoyé à <strong className="text-white">{email}</strong>.
                  Vérifiez votre boîte mail (et vos spams).
                </p>
              </div>
              <Link
                href="/login"
                className="mt-6 flex h-14 w-full items-center justify-center rounded-2xl bg-[#FF5A1F] font-black transition hover:scale-[1.01]"
              >
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              <p className="mt-3 text-zinc-400">
                Saisissez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div className="relative">
                  <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
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
                  {loading ? "Envoi en cours..." : "Envoyer le lien"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      <PublicFooter />
    </main>
  );
}
