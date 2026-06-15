import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-black py-10">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 px-4 text-center sm:px-6 lg:flex-row lg:px-8">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="TrackMarshal" className="h-8 w-8 rounded-full object-cover" />
          <p className="font-black">Track<span className="text-[#FF5A1F]">Marshal</span></p>
        </div>
        <p className="text-sm text-zinc-600">© 2026 TrackMarshal — Tous droits réservés.</p>
        <div className="flex items-center gap-6 text-sm text-zinc-600">
          <Link href="/about" className="transition hover:text-[#FF5A1F]">À propos</Link>
          <Link href="/events" className="transition hover:text-[#FF5A1F]">Événements</Link>
          <Link href="/devenir-commissaire" className="transition hover:text-[#FF5A1F]">Devenir commissaire</Link>
          <Link href="/login" className="transition hover:text-[#FF5A1F]">Connexion</Link>
        </div>
      </div>
    </footer>
  );
}
