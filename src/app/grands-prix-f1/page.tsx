import type { Metadata } from "next";
import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const metadata: Metadata = {
  title: "Devenir commissaire en Formule 1 : le guide des Grands Prix",
  description:
    "Comment devenir commissaire de piste en Formule 1 : le parcours, la licence internationale requise, et où s'inscrire pour officier sur les Grands Prix (Monaco, Belgique, Canada, Grande-Bretagne…).",
  keywords: [
    "devenir commissaire F1",
    "commissaire de piste Formule 1",
    "marshal Formula 1",
    "s'inscrire Grand Prix commissaire",
    "licence internationale commissaire",
  ],
  alternates: { canonical: "/grands-prix-f1" },
  openGraph: {
    title: "Devenir commissaire en Formule 1 | TrackMarshal",
    description: "Le parcours pour officier en F1 et où s'inscrire sur les Grands Prix.",
    url: "https://www.trackmarshal.app/grands-prix-f1",
    type: "article",
  },
};

export const dynamic = "force-dynamic";

const FLAGS: Record<string, string> = {
  // Europe
  france: "🇫🇷", belgique: "🇧🇪", monaco: "🇲🇨", "royaume-uni": "🇬🇧", "grande-bretagne": "🇬🇧",
  angleterre: "🇬🇧", italie: "🇮🇹", espagne: "🇪🇸", suisse: "🇨🇭", allemagne: "🇩🇪",
  "pays-bas": "🇳🇱", "pays bas": "🇳🇱", autriche: "🇦🇹", hongrie: "🇭🇺", portugal: "🇵🇹",
  // Amériques
  canada: "🇨🇦", "états-unis": "🇺🇸", "etats-unis": "🇺🇸", usa: "🇺🇸", mexique: "🇲🇽",
  brésil: "🇧🇷", bresil: "🇧🇷",
  // Asie / Océanie
  australie: "🇦🇺", japon: "🇯🇵", chine: "🇨🇳", singapour: "🇸🇬",
  // Moyen-Orient
  bahreïn: "🇧🇭", bahrein: "🇧🇭", "arabie saoudite": "🇸🇦", qatar: "🇶🇦",
  azerbaïdjan: "🇦🇿", azerbaidjan: "🇦🇿",
  "émirats arabes unis": "🇦🇪", "emirats arabes unis": "🇦🇪", "abu dhabi": "🇦🇪",
};
function flagOf(region?: string | null): string {
  if (!region) return "🏁";
  // Défaut neutre (damier) plutôt qu'un mauvais drapeau pour un pays non listé.
  return FLAGS[region.toLowerCase().trim()] ?? "🏁";
}

const steps = [
  { n: "01", t: "Deviens commissaire dans ton pays", d: "On ne commence jamais en F1. En France, rejoins une ASA (auto) via ta ligue FFSA, suis la formation et obtiens ta licence de commissaire." },
  { n: "02", t: "Prends de l'expérience et monte en grade", d: "Officie régulièrement sur des épreuves nationales, puis vise un grade supérieur. Un Grand Prix exige généralement une licence de niveau international." },
  { n: "03", t: "Obtiens la licence internationale", d: "Pour la plupart des GP, une Licence Commissaire Internationale (souvent niveau B minimum) est requise. Elle s'obtient après expérience et validation par ta fédération." },
  { n: "04", t: "Postule auprès de l'organisateur du GP", d: "Chaque Grand Prix recrute via l'organisateur ou le club de commissaires du pays hôte (ACM à Monaco, RACB en Belgique…). Tu candidates directement auprès d'eux." },
];

export default async function GrandsPrixF1Page() {
  let gps: any[] = [];
  try {
    const { data } = await supabaseAdmin
      .from("clubs")
      .select("*")
      .or("type.ilike.%grand prix%,type.ilike.%formule 1%")
      .order("name");
    gps = data || [];
  } catch {
    gps = [];
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-zinc-50 pt-32 lg:pt-40">
        <div className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-[#FF5A1F]/8 blur-[120px] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-[1000px] px-4 pb-10 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F] sm:text-sm">Formule 1</p>
          <h1 className="mt-6 text-4xl font-black leading-[0.95] tracking-[-0.04em] text-zinc-900 sm:text-5xl lg:text-7xl">
            Commissaire<br /><span className="text-[#FF5A1F]">en Formule 1</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
            Officier au bord de la piste d'un Grand Prix, c'est le rêve de beaucoup de commissaires.
            C'est accessible — mais ça se mérite. Voici le parcours et où t'inscrire.
          </p>
        </div>
      </section>

      {/* Parcours */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-zinc-900 lg:text-3xl">Le parcours jusqu'à la F1</h2>
          <div className="mt-8 space-y-4">
            {steps.map((s) => (
              <div key={s.n} className="flex gap-5 rounded-[28px] border border-zinc-200 bg-white shadow-sm p-6 lg:gap-8 lg:p-8">
                <span className="shrink-0 text-4xl font-black text-[#FF5A1F]/30 lg:text-5xl">{s.n}</span>
                <div>
                  <h3 className="text-xl font-black text-zinc-900">{s.t}</h3>
                  <p className="mt-2 leading-relaxed text-zinc-600">{s.d}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-start gap-3 rounded-[24px] border border-amber-200 bg-amber-50 p-5">
            <span className="shrink-0 text-lg">⚠️</span>
            <p className="text-sm leading-relaxed text-amber-900">
              Le commissariat en F1 est <strong>bénévole</strong> et très demandé : les places sont sélectives.
              Les prérequis (grade, licence) varient selon le Grand Prix et le pays — l'organisateur fait foi.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/devenir-commissaire/devenir-commissaire" className="rounded-2xl bg-[#FF5A1F] px-6 py-3 font-black text-white transition hover:opacity-90">
              Comment débuter comme commissaire →
            </Link>
            <Link href="/devenir-commissaire/clubs" className="rounded-2xl border border-zinc-300 bg-white px-6 py-3 font-black text-zinc-700 transition hover:bg-zinc-50">
              Où s'inscrire (tous événements) →
            </Link>
          </div>
        </div>
      </section>

      {/* Grands Prix */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-16 lg:py-24">
        <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-zinc-900 lg:text-3xl">Où s'inscrire — Grands Prix & grands événements</h2>

          {gps.length === 0 ? (
            <div className="mt-8 rounded-[28px] border border-dashed border-zinc-300 bg-white p-10 text-center">
              <p className="text-4xl">🏎️</p>
              <p className="mt-4 font-bold text-zinc-700">Les Grands Prix seront listés ici très bientôt.</p>
              <p className="mt-2 text-zinc-500">Chaque GP recrute via l'organisateur ou le club de commissaires du pays hôte.</p>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {gps.map((c) => (
                <div key={c.id} className="rounded-[24px] border border-zinc-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-lg font-black text-zinc-900">{c.name}</h3>
                      {(c.city || c.region) && <p className="mt-0.5 text-sm text-zinc-500">{flagOf(c.region)} {[c.city, c.region].filter(Boolean).join(" · ")}</p>}
                    </div>
                    {c.license_required && <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">🎫 {c.license_required}</span>}
                  </div>
                  {c.description && <p className="mt-3 leading-relaxed text-zinc-600">{c.description}</p>}
                  {c.registration_steps && (
                    <div className="mt-3 space-y-1.5 text-sm leading-relaxed text-zinc-700">
                      {String(c.registration_steps).split("\n").filter((l: string) => l.trim()).map((l: string, i: number) => <p key={i}>{l}</p>)}
                    </div>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {c.website && <a href={c.website} target="_blank" rel="noopener nofollow" className="rounded-xl bg-[#FF5A1F] px-4 py-2 text-sm font-bold text-white transition hover:opacity-90">Site / inscription →</a>}
                    {c.email && <a href={`mailto:${c.email}`} className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50">✉️ {c.email}</a>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="mt-8 text-xs leading-relaxed text-zinc-400">
            Informations centralisées à titre indicatif. Les inscriptions, prérequis et conditions relèvent de chaque
            organisateur — leur site officiel fait foi. TrackMarshal est indépendant, sans lien officiel avec la FIA, la FFSA ou la FFM.
          </p>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
