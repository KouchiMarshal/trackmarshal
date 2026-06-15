"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-4">
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/10 blur-[160px] pointer-events-none" />

      <div className="relative z-10 text-center">
        <img src="/logo.png" alt="TrackMarshal" className="mx-auto h-20 w-20 rounded-full object-cover mb-8 opacity-60" />

        <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-400">Erreur serveur</p>

        <h1 className="mt-4 text-8xl font-black lg:text-[12rem] leading-none">500</h1>

        <p className="mt-6 text-xl text-zinc-400 max-w-md mx-auto">
          Une erreur inattendue s'est produite. Notre équipe a été notifiée.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-center">
          <button
            onClick={reset}
            className="flex h-14 items-center justify-center rounded-2xl bg-[#FF5A1F] px-8 font-black transition hover:scale-[1.02]"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 font-black transition hover:border-[#FF5A1F]/40"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
