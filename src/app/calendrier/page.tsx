import type { Metadata } from "next";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";
import CalendarClient from "@/components/calendar/CalendarClient";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const metadata: Metadata = {
  title: "Calendrier des épreuves motorsport en France",
  description:
    "Le calendrier des épreuves de sport automobile et moto en France : rallye, circuit, karting, course de côte… Dates, lieux et lien vers le site officiel de chaque épreuve.",
  keywords: [
    "calendrier motorsport",
    "calendrier rallye 2026",
    "épreuves sport automobile France",
    "calendrier karting",
    "courses automobiles France",
  ],
  alternates: { canonical: "/calendrier" },
  openGraph: {
    title: "Calendrier des épreuves motorsport en France | TrackMarshal",
    description:
      "Toutes les épreuves auto et moto à venir en France : dates, lieux et sites officiels.",
    url: "https://www.trackmarshal.app/calendrier",
  },
};

// Rendu dynamique : les ajouts admin apparaissent immédiatement.
export const dynamic = "force-dynamic";

export default async function CalendrierPage() {
  const today = new Date().toISOString().slice(0, 10);

  let events: any[] = [];
  try {
    const { data } = await supabaseAdmin
      .from("calendar_events")
      .select("*")
      .or(`start_date.gte.${today},end_date.gte.${today}`)
      .order("start_date", { ascending: true })
      .limit(500);
    events = data || [];
  } catch {
    events = [];
  }

  return (
    <main className="min-h-screen overflow-hidden bg-zinc-50 text-zinc-900">
      <PublicNavbar />

      <section className="relative overflow-hidden bg-zinc-50 pt-32 lg:pt-40">
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[#FF5A1F]/6 blur-[120px] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-[1600px] px-4 pb-8 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F] sm:text-sm">Calendrier</p>
          <h1 className="mt-6 text-4xl font-black leading-[0.95] tracking-[-0.04em] text-zinc-900 sm:text-6xl lg:text-7xl">
            Les épreuves<br /><span className="text-[#FF5A1F]">motorsport en France</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
            Rallye, circuit, karting, course de côte… Retrouve les prochaines épreuves auto et moto,
            avec le lien vers le site officiel de chacune.
          </p>
        </div>
      </section>

      <CalendarClient events={events} />

      <PublicFooter />
    </main>
  );
}
