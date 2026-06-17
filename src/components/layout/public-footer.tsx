import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-black py-10">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="TrackMarshal" className="h-8 w-8 rounded-full object-cover" />
              <p className="font-black">Track<span className="text-[#FF5A1F]">Marshal</span></p>
            </div>
            <a
              href="https://www.instagram.com/trackmarshal.app"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram TrackMarshal"
              className="text-zinc-400 transition hover:text-[#FF5A1F]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-zinc-600">
            <Link href="/about" className="transition hover:text-[#FF5A1F]">À propos</Link>
            <Link href="/events" className="transition hover:text-[#FF5A1F]">Événements</Link>
            <Link href="/commissaires" className="transition hover:text-[#FF5A1F]">Annuaire commissaires</Link>
            <Link href="/devenir-commissaire" className="transition hover:text-[#FF5A1F]">Devenir commissaire</Link>
            <Link href="/login" className="transition hover:text-[#FF5A1F]">Connexion</Link>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-zinc-600">
            <Link href="/mentions-legales" className="transition hover:text-[#FF5A1F]">Mentions légales</Link>
            <Link href="/confidentialite" className="transition hover:text-[#FF5A1F]">Confidentialité</Link>
            <Link href="/cgu" className="transition hover:text-[#FF5A1F]">CGU</Link>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-700">© 2026 TrackMarshal — Tous droits réservés.</p>
      </div>
    </footer>
  );
}
