import type { Metadata } from "next";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";
import ClubsClient from "@/components/clubs/ClubsClient";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const metadata: Metadata = {
  title: "Trouver une ASA ou un club pour devenir commissaire",
  description:
    "L'annuaire des ASA (auto) et clubs FFM (moto) où t'engager comme commissaire de piste, par région. Contacte le club près de chez toi pour t'inscrire et te former.",
  keywords: [
    "ASA sport automobile",
    "club moto commissaire",
    "s'inscrire commissaire de piste",
    "association sportive automobile région",
    "devenir commissaire club",
  ],
  alternates: { canonical: "/devenir-commissaire/clubs" },
  openGraph: {
    title: "Trouver une ASA ou un club près de chez soi | TrackMarshal",
    description: "L'annuaire des ASA et clubs FFM par région pour s'engager comme commissaire de piste.",
    url: "https://www.trackmarshal.app/devenir-commissaire/clubs",
  },
};

export const revalidate = 3600;

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
            Trouve ton club<br /><span className="text-[#FF5A1F]">et inscris-toi</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
            Pour devenir commissaire, tout commence par ton <strong className="text-zinc-900">club local</strong> :
            une ASA pour l'auto, un club FFM pour la moto. Trouve celui près de chez toi et contacte-le pour t'inscrire et te former.
          </p>
        </div>
      </section>

      <ClubsClient clubs={clubs} />

      <PublicFooter />
    </main>
  );
}
