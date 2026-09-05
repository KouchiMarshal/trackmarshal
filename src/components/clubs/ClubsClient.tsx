"use client";

import { useMemo, useState } from "react";
import SuggestForm from "./SuggestForm";

type Club = {
  id: string;
  name: string;
  type: string | null;
  category: string | null;
  license_required: string | null;
  region: string | null;
  department: string | null;
  city: string | null;
  description: string | null;
  registration_steps: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
};

type Cat = "club" | "circuit" | "evenement";
const SECTIONS: { key: Cat; label: string; emoji: string }[] = [
  { key: "club", label: "Débuter — clubs & ASA", emoji: "🎓" },
  { key: "circuit", label: "Officier sur un circuit", emoji: "🏁" },
  { key: "evenement", label: "Grands événements", emoji: "🏆" },
];

// Categorie effective : utilise le champ, sinon deduit du type (retrocompat).
function catOf(c: Club): Cat {
  if (c.category === "club" || c.category === "circuit" || c.category === "evenement") return c.category;
  const t = (c.type ?? "").toLowerCase();
  if (t.includes("grand prix") || t.includes("événement") || t.includes("evenement") || t.includes("organisateur")) return "evenement";
  if (t.includes("circuit")) return "circuit";
  return "club";
}

// Différenciation visuelle par catégorie : couleur de badge + liseré.
const CAT_UI: Record<Cat, { badge: string; bar: string }> = {
  club: { badge: "bg-blue-100 text-blue-700", bar: "border-l-blue-400" },
  circuit: { badge: "bg-emerald-100 text-emerald-700", bar: "border-l-emerald-400" },
  evenement: { badge: "bg-[#FF5A1F]/15 text-[#FF5A1F]", bar: "border-l-[#FF5A1F]" },
};

// Drapeau du pays (les régions françaises -> 🇫🇷 par défaut).
const FLAGS: Record<string, string> = {
  belgique: "🇧🇪", monaco: "🇲🇨", "royaume-uni": "🇬🇧", "grande-bretagne": "🇬🇧",
  angleterre: "🇬🇧", canada: "🇨🇦", italie: "🇮🇹", espagne: "🇪🇸", suisse: "🇨🇭",
  allemagne: "🇩🇪", "pays-bas": "🇳🇱", autriche: "🇦🇹", luxembourg: "🇱🇺",
};
function flagOf(region: string | null): string {
  if (!region) return "🇫🇷";
  return FLAGS[region.toLowerCase().trim()] ?? "🇫🇷";
}

// Les Grands Prix sont affichés uniquement sur la page dédiée /grands-prix-f1,
// pas dans l'annuaire "Où s'inscrire".
function isGP(c: Club): boolean {
  return (c.type ?? "").toLowerCase().includes("grand prix");
}

export default function ClubsClient({ clubs }: { clubs: Club[] }) {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("Toutes");
  const [tab, setTab] = useState<"all" | Cat>("all");
  const [open, setOpen] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // On retire les Grands Prix de l'annuaire (ils vivent sur /grands-prix-f1).
  const pool = useMemo(() => clubs.filter((c) => !isGP(c)), [clubs]);

  const regions = useMemo(
    () => ["Toutes", ...Array.from(new Set(pool.map((c) => c.region).filter(Boolean) as string[])).sort()],
    [pool],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return pool.filter((c) => {
      const matchQ = !q || c.name.toLowerCase().includes(q) || (c.city ?? "").toLowerCase().includes(q) || (c.description ?? "").toLowerCase().includes(q);
      const matchR = region === "Toutes" || c.region === region;
      const matchT = tab === "all" || catOf(c) === tab;
      return matchQ && matchR && matchT;
    });
  }, [pool, search, region, tab]);

  function card(c: Club) {
    const place = [c.city, c.department, c.region].filter(Boolean).join(" · ");
    const isOpen = open === c.id;
    const cat = catOf(c);
    const ui = CAT_UI[cat];
    return (
      <div key={c.id} className={`rounded-[24px] border border-l-[5px] border-zinc-200 bg-white p-5 shadow-sm ${ui.bar}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-black text-zinc-900">{c.name}</h3>
            {place && <p className="mt-0.5 text-sm text-zinc-500">{flagOf(c.region)} {place}</p>}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            {c.type && <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${ui.badge}`}>{c.type}</span>}
            {c.license_required && <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">🎫 {c.license_required}</span>}
          </div>
        </div>

        {c.description && <p className="mt-3 leading-relaxed text-zinc-600">{c.description}</p>}

        <div className="mt-4 flex flex-wrap gap-2">
          {c.website && (
            <a href={c.website} target="_blank" rel="noopener nofollow" className="rounded-xl bg-[#FF5A1F] px-4 py-2 text-sm font-bold text-white transition hover:opacity-90">
              Site / inscription →
            </a>
          )}
          {c.email && (
            <a href={`mailto:${c.email}`} className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50">
              ✉️ {c.email}
            </a>
          )}
          {c.phone && (
            <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50">
              📞 {c.phone}
            </a>
          )}
        </div>

        {c.registration_steps && (
          <div className="mt-4 border-t border-zinc-100 pt-3">
            <button onClick={() => setOpen(isOpen ? null : c.id)} className="text-sm font-bold text-[#FF5A1F]">
              {isOpen ? "▾ Masquer les démarches" : "▸ Comment s'inscrire"}
            </button>
            {isOpen && (
              <div className="mt-3 space-y-2 leading-relaxed text-zinc-700">
                {String(c.registration_steps).split("\n").filter((l) => l.trim()).map((line, i) => <p key={i} className="text-sm">{line}</p>)}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="bg-white pb-24 pt-6">
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8">

        {/* Filtres */}
        <div className="sticky top-16 z-20 -mx-4 mb-8 border-b border-zinc-200 bg-white/90 px-4 py-4 backdrop-blur lg:top-20">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un circuit, un club, une ville…"
            className="h-12 w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-5 text-zinc-900 outline-none focus:border-[#FF5A1F]"
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-1 rounded-xl border border-zinc-300 bg-white p-1">
              {(["all", "club", "circuit", "evenement"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`rounded-lg px-3 py-1.5 text-sm font-bold transition ${tab === t ? "bg-[#FF5A1F] text-white" : "text-zinc-600 hover:bg-zinc-100"}`}>
                  {t === "all" ? "Tout" : t === "club" ? "Clubs & ASA" : t === "circuit" ? "Circuits" : "Grands événements"}
                </button>
              ))}
            </div>
            {regions.length > 1 && (
              <select value={region} onChange={(e) => setRegion(e.target.value)} className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-700 outline-none focus:border-[#FF5A1F]">
                {regions.map((r) => <option key={r} value={r}>{r === "Toutes" ? "Toutes régions" : r}</option>)}
              </select>
            )}
            <span className="ml-auto self-center text-sm text-zinc-500">{filtered.length} résultat{filtered.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Liste */}
        {pool.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
            <p className="text-4xl">📍</p>
            <p className="mt-4 text-lg font-bold text-zinc-700">Le répertoire arrive bientôt.</p>
            <p className="mt-2 text-zinc-500">En attendant, contacte l&apos;ASA (auto) ou le club FFM (moto) le plus proche de chez toi.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-[28px] border border-zinc-200 bg-zinc-50 p-12 text-center text-zinc-500">Aucun résultat ne correspond à ta recherche.</div>
        ) : tab === "all" ? (
          <div className="space-y-10">
            {SECTIONS.map((s) => {
              const items = filtered.filter((c) => catOf(c) === s.key);
              if (items.length === 0) return null;
              return (
                <div key={s.key}>
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#FF5A1F]">{s.emoji} {s.label}</p>
                  <div className="space-y-4">{items.map(card)}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">{filtered.map(card)}</div>
        )}

        {/* Proposer un club */}
        <div className="mt-14 rounded-[28px] border border-zinc-200 bg-zinc-50 p-6 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-zinc-900">Un club, un circuit, un contact manque ?</h2>
              <p className="mt-1 text-zinc-600">Aide la communauté : propose-le, on l&apos;ajoutera après vérification.</p>
            </div>
            <button onClick={() => setShowForm((v) => !v)} className="rounded-2xl bg-[#FF5A1F] px-6 py-3 font-black text-white transition hover:opacity-90">
              {showForm ? "Fermer" : "➕ Proposer un ajout"}
            </button>
          </div>
          {showForm && <SuggestForm kind="annuaire" onDone={() => setShowForm(false)} />}
        </div>

        <p className="mt-8 text-xs leading-relaxed text-zinc-400">
          Informations centralisées à titre indicatif. Les inscriptions et conditions relèvent de chaque circuit,
          organisateur ou club — leur site officiel fait foi. Un contact erroné ? Signale-le via « Proposer un ajout ».
        </p>
      </div>
    </section>
  );
}
