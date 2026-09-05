import type { Metadata } from "next";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";
import ClubsClient from "@/components/clubs/ClubsClient";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const metadata: Metadata = {
  title: "Où s'inscrire comme commissaire : circuits, clubs & ASA",
  description:
    "Le répertoire des circuits, organisateurs, ASA (auto) et clubs FFM (moto) où s'inscrire comme commissaire de piste : démarches, contacts et liens officiels, par région.",
  keywords: [
    "s'inscrire commissaire de piste",
    "devenir commissaire circuit",
    "ASA sport automobile",
    "club moto commissaire",
    "inscription commissaire Monaco Paul Ricard Le Mans",
  ],
  alternates: { canonical: "/devenir-commissaire/clubs" },
  openGraph: {
    title: "Où s'inscrire comme commissaire de piste | TrackMarshal",
    description: "Circuits, organisateurs, ASA et clubs : démarches et contacts pour s'inscrire comme commissaire, par région.",
    url: "https://www.trackmarshal.app/devenir-commissaire/clubs",
  },
};

export const dynamic = "force-dynamic";

export default async function ClubsPage() {
  let clubs: any[] = [];
  try {
    const { data } = await supabaseAdmin.from("clubs").select("*").order("region", { ascending: true }).order("name", { ascending: true });
    clubs = data || [];
  } catch {
    clubs = [];
  }

  return (
    <main className="min-h-screen overflow-hidden bg-zinc-50 text-zinc-900">
      <PublicNavbar />

      <section className="relative overflow-hidden bg-zinc-50 pt-32 lg:pt-40">
        <div className="absolute right-0 top-0 h-[380px] w-[380px] rounded-full bg-[#FF5A1F]/6 blur-[120px] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-[1000px] px-4 pb-6 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F] sm:text-sm">Passer à l'action</p>
          <h1 className="mt-6 text-4xl font-black leading-[0.95] tracking-[-0.04em] text-zinc-900 sm:text-5xl lg:text-6xl">
            Où s'inscrire<br /><span className="text-[#FF5A1F]">comme commissaire</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
            Circuits, organisateurs, ASA (auto) et clubs FFM (moto) : retrouve <strong className="text-zinc-900">où et comment
            t'inscrire</strong> pour officier, avec les démarches et les liens officiels. Filtre par région et trouve le tien.
          </p>
          <a href="/grands-prix-f1" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#FF5A1F] hover:underline">
            🏎️ Tu vises la Formule 1 ? Vois le guide « Commissaire en F1 » →
          </a>
        </div>
      </section>

      <ClubsClient clubs={clubs} />

      <PublicFooter />
    </main>
  );
}
