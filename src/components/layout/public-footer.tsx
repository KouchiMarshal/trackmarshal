import Link from "next/link";
import { Instagram } from "lucide-react";

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
              <Instagram className="h-5 w-5" />
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
