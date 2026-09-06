"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";
import { supabase } from "@/lib/supabase";

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
  return FLAGS[region.toLowerCase().trim()] ?? "🏁";
}

const steps = [
  { n: "01", t: "Deviens commissaire dans ton pays", d: "On ne commence jamais en F1. En France, rejoins une ASA (auto) via ta ligue FFSA, suis la formation et obtiens ta licence de commissaire." },
  { n: "02", t: "Prends de l'expérience et monte en grade", d: "Officie régulièrement sur des épreuves nationales, puis vise un grade supérieur. Un Grand Prix exige généralement une licence de niveau international." },
  { n: "03", t: "Obtiens la licence internationale", d: "Pour la plupart des GP, une Licence Commissaire Internationale (souvent niveau B minimum) est requise. Elle s'obtient après expérience et validation par ta fédération." },
  { n: "04", t: "Postule auprès de l'organisateur du GP", d: "Chaque Grand Prix recrute via l'organisateur ou le club de commissaires du pays hôte (ACM à Monaco, RACB en Belgique…). Tu candidates directement auprès d'eux." },
];

type GP = {
  id: string; name: string; city?: string | null; region?: string | null;
  license_required?: string | null; description?: string | null;
  registration_steps?: string | null; website?: string | null; email?: string | null;
};

// Calendrier F1 de référence pour le suivi de complétion (ajuste-le selon
// l'année). `match` = mots-clés cherchés dans le nom / pays / ville d'une
// entrée en base pour la relier au GP correspondant.
const F1_CALENDAR: { gp: string; flag: string; match: string[] }[] = [
  { gp: "Australie", flag: "🇦🇺", match: ["australie", "melbourne"] },
  { gp: "Chine", flag: "🇨🇳", match: ["chine", "shanghai"] },
  { gp: "Japon", flag: "🇯🇵", match: ["japon", "suzuka"] },
  { gp: "Bahreïn", flag: "🇧🇭", match: ["bahre", "sakhir"] },
  { gp: "Arabie Saoudite", flag: "🇸🇦", match: ["arabie", "jeddah", "djeddah"] },
  { gp: "Miami (USA)", flag: "🇺🇸", match: ["miami"] },
  { gp: "Canada", flag: "🇨🇦", match: ["canada", "montr"] },
  { gp: "Monaco", flag: "🇲🇨", match: ["monaco"] },
  { gp: "Espagne (Barcelone)", flag: "🇪🇸", match: ["barcelone", "catalogne"] },
  { gp: "Madrid (Espagne)", flag: "🇪🇸", match: ["madrid"] },
  { gp: "Autriche", flag: "🇦🇹", match: ["autriche", "spielberg", "red bull ring"] },
  { gp: "Grande-Bretagne", flag: "🇬🇧", match: ["grande-bretagne", "angleterre", "silverstone", "britannique", "royaume"] },
  { gp: "Belgique", flag: "🇧🇪", match: ["belgique", "spa"] },
  { gp: "Hongrie", flag: "🇭🇺", match: ["hongrie", "hungaro", "budapest"] },
  { gp: "Pays-Bas", flag: "🇳🇱", match: ["pays-bas", "pays bas", "zandvoort", "hollande", "erlandais"] },
  { gp: "Italie (Monza)", flag: "🇮🇹", match: ["monza", "italie"] },
  { gp: "Azerbaïdjan", flag: "🇦🇿", match: ["azerba", "bakou", "baku"] },
  { gp: "Singapour", flag: "🇸🇬", match: ["singapour"] },
  { gp: "États-Unis (Austin)", flag: "🇺🇸", match: ["austin", "cota", "texas"] },
  { gp: "Mexique", flag: "🇲🇽", match: ["mexique", "mexico"] },
  { gp: "Brésil", flag: "🇧🇷", match: ["brésil", "bresil", "sao paulo", "são paulo", "interlagos"] },
  { gp: "Las Vegas (USA)", flag: "🇺🇸", match: ["vegas"] },
  { gp: "Qatar", flag: "🇶🇦", match: ["qatar", "lusail", "losail"] },
  { gp: "Abu Dhabi", flag: "🇦🇪", match: ["abu dhabi", "yas marina", "émirats", "emirats"] },
];

function hasRegInfo(c: GP): boolean {
  return Boolean((c.registration_steps && c.registration_steps.trim()) || c.website || c.email);
}

// Compare le calendrier de référence aux entrées en base.
function analyzeCalendar(gps: GP[]) {
  const missing: { gp: string; flag: string }[] = []; // en base mais sans démarche
  const toAdd: { gp: string; flag: string }[] = []; // pas encore en base
  let done = 0;
  for (const cal of F1_CALENDAR) {
    const entry = gps.find((c) => {
      const hay = `${c.name ?? ""} ${c.region ?? ""} ${c.city ?? ""}`.toLowerCase();
      return cal.match.some((k) => hay.includes(k));
    });
    if (!entry) toAdd.push({ gp: cal.gp, flag: cal.flag });
    else if (!hasRegInfo(entry)) missing.push({ gp: cal.gp, flag: cal.flag });
    else done++;
  }
  return { missing, toAdd, done };
}

export default function F1AdminGate() {
  const [status, setStatus] = useState<"checking" | "denied" | "allowed">("checking");
  const [gps, setGps] = useState<GP[]>([]);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { setStatus("denied"); return; }
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
      if (profile?.role !== "admin") { setStatus("denied"); return; }
      // Admin confirmé : on charge les données via la route protégée.
      try {
        const res = await fetch("/api/admin/gp", { headers: { Authorization: `Bearer ${session.access_token}` } });
        if (res.ok) { const d = await res.json(); setGps(d.gps ?? []); }
      } catch { /* liste vide */ }
      setStatus("allowed");
    })();
  }, []);

  // Tant qu'on n'a pas confirmé un admin (y compris dans le HTML rendu côté
  // serveur), on n'affiche PAS le contenu — juste un état "en préparation".
  if (status !== "allowed") {
    return (
      <main className="min-h-screen bg-zinc-50 text-zinc-900">
        <PublicNavbar />
        <section className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="max-w-md text-center">
            <p className="text-5xl">🏎️</p>
            <h1 className="mt-6 text-3xl font-black text-zinc-900">Page en préparation</h1>
            <p className="mt-3 leading-relaxed text-zinc-600">
              Le guide « Commissaire en Formule 1 » arrive bientôt. Reviens vite !
            </p>
            <Link href="/devenir-commissaire" className="mt-8 inline-flex rounded-2xl bg-[#FF5A1F] px-6 py-3 font-black text-white transition hover:opacity-90">
              Voir l&apos;espace pédagogique →
            </Link>
          </div>
        </section>
        <PublicFooter />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicNavbar />

      {/* Bandeau admin : rappel que la page est masquée au public */}
      <div className="bg-amber-500 px-4 py-2 text-center text-sm font-bold text-white">
        👁️ Aperçu admin — cette page est masquée au public pour l&apos;instant.
      </div>

      {/* Suivi de complétion (admin) : GP à renseigner */}
      {(() => {
        const { missing, toAdd, done } = analyzeCalendar(gps);
        return (
          <section className="border-b border-zinc-200 bg-white">
            <div className="mx-auto max-w-[1000px] px-4 py-8 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-black text-zinc-900">🗒️ Suivi — GP à renseigner</h2>
                <p className="text-sm font-bold text-zinc-500">
                  {done}/{F1_CALENDAR.length} complet{done > 1 ? "s" : ""}
                </p>
              </div>
              <p className="mt-1 text-sm text-zinc-500">
                Basé sur le calendrier F1 de référence. « Renseigné » = au moins des démarches, un site ou un email d&apos;inscription.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {/* Pas encore ajoutés */}
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-sm font-black text-zinc-800">⬜ Pas encore ajoutés <span className="text-zinc-400">({toAdd.length})</span></p>
                  {toAdd.length === 0 ? (
                    <p className="mt-2 text-sm text-zinc-500">Tous les GP du calendrier sont en base. 🎉</p>
                  ) : (
                    <ul className="mt-2 space-y-1">
                      {toAdd.map((g) => (
                        <li key={g.gp} className="text-sm text-zinc-700">{g.flag} {g.gp}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* En base mais sans démarche d'inscription */}
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-black text-red-800">⚠️ Ajoutés mais sans « comment s&apos;inscrire » <span className="text-red-400">({missing.length})</span></p>
                  {missing.length === 0 ? (
                    <p className="mt-2 text-sm text-red-600/80">Aucun — tous les GP présents ont une info d&apos;inscription.</p>
                  ) : (
                    <ul className="mt-2 space-y-1">
                      {missing.map((g) => (
                        <li key={g.gp} className="text-sm text-red-900">{g.flag} {g.gp}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <p className="mt-4 text-xs text-zinc-400">
                Complète les infos depuis <a href="/admin/clubs" className="font-bold text-[#FF5A1F] hover:underline">Admin → Annuaire</a> (les GP y sont gérés). Ce calendrier de référence est modifiable dans le code si la saison change.
              </p>
            </div>
          </section>
        );
      })()}

      {/* Hero */}
      <section className="relative overflow-hidden bg-zinc-50 pt-16 lg:pt-24">
        <div className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-[#FF5A1F]/8 blur-[120px] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-[1000px] px-4 pb-10 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F] sm:text-sm">Formule 1</p>
          <h1 className="mt-6 text-4xl font-black leading-[0.95] tracking-[-0.04em] text-zinc-900 sm:text-5xl lg:text-7xl">
            Commissaire<br /><span className="text-[#FF5A1F]">en Formule 1</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
            Officier au bord de la piste d&apos;un Grand Prix, c&apos;est le rêve de beaucoup de commissaires.
            C&apos;est accessible — mais ça se mérite. Voici le parcours et où t&apos;inscrire.
          </p>
        </div>
      </section>

      {/* Parcours */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-zinc-900 lg:text-3xl">Le parcours jusqu&apos;à la F1</h2>
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
              Les prérequis (grade, licence) varient selon le Grand Prix et le pays — l&apos;organisateur fait foi.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/devenir-commissaire/devenir-commissaire" className="rounded-2xl bg-[#FF5A1F] px-6 py-3 font-black text-white transition hover:opacity-90">
              Comment débuter comme commissaire →
            </Link>
            <Link href="/devenir-commissaire/clubs" className="rounded-2xl border border-zinc-300 bg-white px-6 py-3 font-black text-zinc-700 transition hover:bg-zinc-50">
              Où s&apos;inscrire (tous événements) →
            </Link>
          </div>
        </div>
      </section>

      {/* Grands Prix */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-16 lg:py-24">
        <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-zinc-900 lg:text-3xl">Où s&apos;inscrire — Grands Prix &amp; grands événements</h2>

          {gps.length === 0 ? (
            <div className="mt-8 rounded-[28px] border border-dashed border-zinc-300 bg-white p-10 text-center">
              <p className="text-4xl">🏎️</p>
              <p className="mt-4 font-bold text-zinc-700">Les Grands Prix seront listés ici très bientôt.</p>
              <p className="mt-2 text-zinc-500">Chaque GP recrute via l&apos;organisateur ou le club de commissaires du pays hôte.</p>
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
