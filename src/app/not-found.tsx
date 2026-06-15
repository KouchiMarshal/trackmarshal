import Link from "next/link";
import PublicFooter from "@/components/layout/public-footer";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-4">
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF5A1F]/10 blur-[160px] pointer-events-none" />

      <div className="relative z-10 text-center">
        <img src="/logo.png" alt="TrackMarshal" className="mx-auto h-20 w-20 rounded-full object-cover mb-8 opacity-60" />

        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F]">Erreur 404</p>

        <h1 className="mt-4 text-8xl font-black lg:text-[12rem] leading-none">404</h1>

        <p className="mt-6 text-xl text-zinc-400 max-w-md mx-auto">
          Cette page n'existe pas ou a été déplacée.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-center">
          <Link
            href="/"
            className="flex h-14 items-center justify-center rounded-2xl bg-[#FF5A1F] px-8 font-black transition hover:scale-[1.02]"
          >
            Retour à l'accueil
          </Link>
          <Link
            href="/events"
            className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 font-black transition hover:border-[#FF5A1F]/40"
          >
            Voir les événements
          </Link>
        </div>
      </div>
      <PublicFooter />
    </main>
  );
}
