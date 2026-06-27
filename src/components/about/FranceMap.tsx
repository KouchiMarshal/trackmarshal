"use client";

import { useState } from "react";

const REGIONS = [
  { name: "Île-de-France",              auto: 23, moto: 14 },
  { name: "Auvergne-Rhône-Alpes",       auto: 18, moto: 11 },
  { name: "Occitanie",                  auto: 14, moto: 9  },
  { name: "Nouvelle-Aquitaine",         auto: 13, moto: 7  },
  { name: "Normandie",                  auto: 11, moto: 5  },
  { name: "Grand Est",                  auto: 11, moto: 8  },
  { name: "Provence-Alpes-Côte d'Azur", auto: 10, moto: 10 },
  { name: "Hauts-de-France",            auto: 9,  moto: 6  },
  { name: "Pays de la Loire",           auto: 8,  moto: 5  },
  { name: "Bretagne",                   auto: 7,  moto: 4  },
  { name: "Centre-Val de Loire",        auto: 5,  moto: 3  },
  { name: "Bourgogne-Franche-Comté",    auto: 5,  moto: 4  },
  { name: "Corse",                      auto: 2,  moto: 1  },
];

type Filter = "all" | "auto" | "moto";

export default function FranceMap() {
  const [filter, setFilter] = useState<Filter>("all");
  const [hovered, setHovered] = useState<string | null>(null);

  function getValue(r: typeof REGIONS[0]) {
    if (filter === "auto") return r.auto;
    if (filter === "moto") return r.moto;
    return r.auto + r.moto;
  }

  const sorted = [...REGIONS].sort((a, b) => getValue(b) - getValue(a));
  const max = getValue(sorted[0]);

  const totalAuto = REGIONS.reduce((s, r) => s + r.auto, 0);
  const totalMoto = REGIONS.reduce((s, r) => s + r.moto, 0);
  const total = totalAuto + totalMoto;
  const regionCount = REGIONS.length;

  return (
    <div className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm sm:rounded-[40px]">

      {/* Demo banner */}
      <div className="flex items-center gap-3 border-b border-amber-200 bg-amber-50 px-6 py-3 sm:px-8">
        <span className="text-base">🧪</span>
        <p className="text-xs font-bold text-amber-700">
          Données de démonstration — ces chiffres sont fictifs et illustrent le potentiel de la plateforme. Les vraies données s'afficheront ici dès que les commissaires auront renseigné leur région.
        </p>
      </div>

      {/* Header */}
      <div className="border-b border-zinc-200 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#FF5A1F] sm:text-sm">
              Vivier de commissaires
            </p>
            <h2 className="mt-2 text-2xl font-black text-zinc-900 sm:text-3xl">
              Répartition par région
            </h2>
          </div>
          <div className="flex items-center gap-1.5 rounded-2xl border border-zinc-200 bg-zinc-50 p-1">
            {(["all", "auto", "moto"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                  filter === f
                    ? "bg-[#FF5A1F] text-white shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {f === "all" ? "Tous" : f === "auto" ? "🚗 Auto" : "🏍️ Moto"}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-4 text-center">
            <p className="text-2xl font-black text-zinc-900 sm:text-3xl">{total}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-zinc-400">commissaires</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-4 text-center">
            <p className="text-2xl font-black text-zinc-900 sm:text-3xl">{regionCount}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-zinc-400">régions</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-4 text-center">
            <p className="text-2xl font-black text-[#FF5A1F] sm:text-3xl">2</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-zinc-400">disciplines</p>
          </div>
        </div>
      </div>

      {/* Regional bars */}
      <div className="divide-y divide-zinc-100">
        {sorted.map((region) => {
          const val = getValue(region);
          const pct = Math.round((val / max) * 100);
          const isHovered = hovered === region.name;
          return (
            <div
              key={region.name}
              onMouseEnter={() => setHovered(region.name)}
              onMouseLeave={() => setHovered(null)}
              className={`flex items-center gap-4 px-6 py-3.5 transition sm:px-8 ${isHovered ? "bg-orange-50" : ""}`}
            >
              <div className="w-44 shrink-0 truncate text-sm font-semibold text-zinc-700 sm:w-56">
                {region.name}
              </div>
              <div className="relative flex-1 h-2.5 rounded-full bg-zinc-100">
                <div
                  className="h-2.5 rounded-full bg-[#FF5A1F] transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="w-10 shrink-0 text-right text-sm font-black text-zinc-900">
                {val}
              </div>
              {isHovered && filter === "all" && (
                <div className="hidden shrink-0 items-center gap-2 sm:flex">
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">{region.auto} auto</span>
                  <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">{region.moto} moto</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-100 bg-zinc-50 px-6 py-4 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              {totalAuto} Auto
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-purple-400" />
              {totalMoto} Moto
            </span>
          </div>
          <p className="text-[10px] font-bold text-amber-500 italic">
            ⚠ Chiffres fictifs à titre de démonstration
          </p>
        </div>
      </div>

    </div>
  );
}
