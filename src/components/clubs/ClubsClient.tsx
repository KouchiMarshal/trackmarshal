"use client";

import { useMemo, useState } from "react";

type Club = {
  id: string;
  name: string;
  type: string | null;
  region: string | null;
  department: string | null;
  city: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
};

export default function ClubsClient({ clubs }: { clubs: Club[] }) {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("Toutes");
  const [type, setType] = useState<"Tous" | "Auto" | "Moto">("Tous");

  const regions = useMemo(
    () => ["Toutes", ...Array.from(new Set(clubs.map((c) => c.region).filter(Boolean) as string[])).sort()],
    [clubs],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return clubs.filter((c) => {
      const matchQ = !q || c.name.toLowerCase().includes(q) || (c.city ?? "").toLowerCase().includes(q) || (c.department ?? "").toLowerCase().includes(q);
      const matchR = region === "Toutes" || c.region === region;
      const isMoto = (c.type ?? "").toLowerCase().includes("ffm") || (c.type ?? "").toLowerCase().includes("moto");
      const matchT = type === "Tous" || (type === "Moto" ? isMoto : !isMoto);
      return matchQ && matchR && matchT;
    });
  }, [clubs, search, region, type]);

  return (
    <section className="bg-white pb-24 pt-6">
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8">

        {/* Filtres */}
        <div className="sticky top-16 z-20 -mx-4 mb-8 border-b border-zinc-200 bg-white/90 px-4 py-4 backdrop-blur lg:top-20">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un club, une ville, un département…"
            className="h-12 w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-5 text-zinc-900 outline-none focus:border-[#FF5A1F]"
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="flex gap-1 rounded-xl border border-zinc-300 bg-white p-1">
              {(["Tous", "Auto", "Moto"] as const).map((t) => (
                <button key={t} onClick={() => setType(t)} className={`rounded-lg px-3 py-1.5 text-sm font-bold transition ${type === t ? "bg-[#FF5A1F] text-white" : "text-zinc-600 hover:bg-zinc-100"}`}>
                  {t}
                </button>
              ))}
            </div>
            {regions.length > 1 && (
              <select value={region} onChange={(e) => setRegion(e.target.value)} className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-700 outline-none focus:border-[#FF5A1F]">
                {regions.map((r) => <option key={r} value={r}>{r === "Toutes" ? "Toutes régions" : r}</option>)}
              </select>
            )}
            <span className="ml-auto self-center text-sm text-zinc-500">{filtered.length} club{filtered.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Liste */}
        {clubs.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
            <p className="text-4xl">📍</p>
            <p className="mt-4 text-lg font-bold text-zinc-700">L&apos;annuaire arrive bientôt.</p>
            <p className="mt-2 text-zinc-500">
              En attendant, contacte l&apos;ASA (auto) ou le club FFM (moto) le plus proche de chez toi pour t&apos;inscrire et te former.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-[28px] border border-zinc-200 bg-zinc-50 p-12 text-center text-zinc-500">
            Aucun club ne correspond à ta recherche.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((c) => (
              <div key={c.id} className="flex flex-col rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-black text-zinc-900">{c.name}</h3>
                  {c.type && <span className="shrink-0 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-700">{c.type}</span>}
                </div>
                <p className="mt-1 text-sm text-zinc-500">
                  {[c.city, c.department, c.region].filter(Boolean).join(" · ") || "France"}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {c.website && (
                    <a href={c.website} target="_blank" rel="noopener nofollow" className="rounded-xl bg-[#FF5A1F] px-4 py-2 text-sm font-bold text-white transition hover:opacity-90">
                      Site / inscription →
                    </a>
                  )}
                  {c.email && (
                    <a href={`mailto:${c.email}`} className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50">
                      ✉️ Email
                    </a>
                  )}
                  {c.phone && (
                    <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50">
                      📞 {c.phone}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
