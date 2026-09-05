"use client";

import { useMemo, useState } from "react";

type CalEvent = {
  id: string;
  title: string;
  discipline: string | null;
  location: string | null;
  region: string | null;
  start_date: string;
  end_date: string | null;
  official_url: string | null;
};

function fmtDay(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
function monthLabel(d: string) {
  const s = new Date(d + "T00:00:00").toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function CalendarClient({ events }: { events: CalEvent[] }) {
  const [search, setSearch] = useState("");
  const [discipline, setDiscipline] = useState("Toutes");
  const [region, setRegion] = useState("Toutes");

  const disciplines = useMemo(
    () => ["Toutes", ...Array.from(new Set(events.map((e) => e.discipline).filter(Boolean) as string[])).sort()],
    [events],
  );
  const regions = useMemo(
    () => ["Toutes", ...Array.from(new Set(events.map((e) => e.region).filter(Boolean) as string[])).sort()],
    [events],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return events.filter((e) => {
      const matchQ =
        !q ||
        e.title.toLowerCase().includes(q) ||
        (e.location ?? "").toLowerCase().includes(q) ||
        (e.region ?? "").toLowerCase().includes(q);
      const matchD = discipline === "Toutes" || e.discipline === discipline;
      const matchR = region === "Toutes" || e.region === region;
      return matchQ && matchD && matchR;
    });
  }, [events, search, discipline, region]);

  return (
    <section className="bg-white pb-24 pt-6">
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8">

        {/* Filtres */}
        <div className="sticky top-16 z-20 -mx-4 mb-8 border-b border-zinc-200 bg-white/90 px-4 py-4 backdrop-blur lg:top-20">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une épreuve, une ville…"
            className="h-12 w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-5 text-zinc-900 outline-none focus:border-[#FF5A1F]"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <select value={discipline} onChange={(e) => setDiscipline(e.target.value)} className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-700 outline-none focus:border-[#FF5A1F]">
              {disciplines.map((d) => <option key={d} value={d}>{d === "Toutes" ? "Toutes disciplines" : d}</option>)}
            </select>
            {regions.length > 1 && (
              <select value={region} onChange={(e) => setRegion(e.target.value)} className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-700 outline-none focus:border-[#FF5A1F]">
                {regions.map((r) => <option key={r} value={r}>{r === "Toutes" ? "Toutes régions" : r}</option>)}
              </select>
            )}
            <span className="ml-auto self-center text-sm text-zinc-500">{filtered.length} épreuve{filtered.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Liste */}
        {events.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
            <p className="text-4xl">🗓️</p>
            <p className="mt-4 text-lg font-bold text-zinc-700">Le calendrier arrive bientôt.</p>
            <p className="mt-2 text-zinc-500">Les prochaines épreuves seront ajoutées ici très prochainement.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-[28px] border border-zinc-200 bg-zinc-50 p-12 text-center text-zinc-500">
            Aucune épreuve ne correspond à ta recherche.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((e, i) => {
              const showMonth = i === 0 || monthLabel(e.start_date) !== monthLabel(filtered[i - 1].start_date);
              return (
                <div key={e.id}>
                  {showMonth && (
                    <p className="mb-2 mt-8 text-xs font-black uppercase tracking-[0.25em] text-[#FF5A1F] first:mt-0">
                      {monthLabel(e.start_date)}
                    </p>
                  )}
                  <div className="flex flex-col gap-4 rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
                    <div className="flex w-full shrink-0 items-center gap-3 sm:w-32 sm:flex-col sm:items-start sm:gap-0">
                      <p className="text-lg font-black text-zinc-900">{fmtDay(e.start_date)}</p>
                      {e.end_date && e.end_date !== e.start_date && (
                        <p className="text-sm text-zinc-500">→ {fmtDay(e.end_date)}</p>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-black text-zinc-900">{e.title}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500">
                        {e.discipline && (
                          <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-700">{e.discipline}</span>
                        )}
                        {e.location && <span>📍 {e.location}{e.region ? `, ${e.region}` : ""}</span>}
                      </div>
                    </div>
                    {e.official_url && (
                      <a
                        href={e.official_url}
                        target="_blank"
                        rel="noopener nofollow"
                        className="shrink-0 rounded-xl bg-[#FF5A1F] px-4 py-2.5 text-center text-sm font-bold text-white transition hover:opacity-90"
                      >
                        Site officiel →
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
