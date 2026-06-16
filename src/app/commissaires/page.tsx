"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";
import { supabase } from "@/lib/supabase";
import { MapPin, Search, ShieldCheck, Star } from "lucide-react";

const DISCIPLINES = [
  "Rallye", "Circuit", "Karting", "Drift", "Endurance",
  "Moto Cross", "Enduro", "Trial", "Road Racing", "Supermoto", "Rallye Moto",
];

export default function AnnuaireCommissairesPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id, full_name, slug, avatar_url, city, country, disciplines, years_experience, license_verified, license_verified_2, available, license_type, license_type_2")
      .eq("role", "marshal")
      .order("full_name")
      .then(({ data }) => { setProfiles(data || []); setLoading(false); });
  }, []);

  const filtered = profiles.filter((p) => {
    if (onlyAvailable && p.available === false) return false;
    if (discipline && !p.disciplines?.toLowerCase().includes(discipline.toLowerCase())) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!p.full_name?.toLowerCase().includes(q) && !p.city?.toLowerCase().includes(q) && !p.country?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <main className="min-h-screen bg-black text-white">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 pt-36 pb-16 lg:pt-44">
        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-[#FF5A1F]/10 blur-[200px] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F]">Annuaire</p>
          <h1 className="mt-4 text-5xl font-black lg:text-8xl">Commissaires<br /><span className="text-[#FF5A1F]">disponibles.</span></h1>
          <p className="mt-6 max-w-2xl text-lg text-zinc-400">
            Trouvez le commissaire qu'il vous faut — filtrez par discipline, disponibilité ou localisation.
          </p>
        </div>
      </section>

      {/* Filtres */}
      <section className="sticky top-20 z-30 border-b border-white/10 bg-black/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, ville, pays…"
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] pl-10 pr-4 text-sm outline-none focus:border-[#FF5A1F]/40"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              className="h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm outline-none focus:border-[#FF5A1F]/40"
            >
              <option value="">Toutes disciplines</option>
              {DISCIPLINES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>

            <button
              onClick={() => setOnlyAvailable(!onlyAvailable)}
              className={`h-12 rounded-2xl border px-5 text-sm font-bold transition ${onlyAvailable ? "border-[#FF5A1F] bg-[#FF5A1F]/10 text-[#FF5A1F]" : "border-white/10 text-zinc-400 hover:text-white"}`}
            >
              Disponibles uniquement
            </button>
          </div>
        </div>
      </section>

      {/* Résultats */}
      <section className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8">
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-[32px] border border-white/10 bg-white/[0.03]" />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-24 text-center text-zinc-500">Aucun commissaire trouvé avec ces critères.</div>
        )}

        {!loading && (
          <div className="mb-6 text-sm text-zinc-500">
            {filtered.length} commissaire{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((profile) => (
            <Link
              key={profile.id}
              href={`/marshal/${profile.slug || profile.id}`}
              className="group overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.02] transition hover:border-[#FF5A1F]/30 hover:bg-white/[0.04]"
            >
              <div className="relative h-40 bg-gradient-to-br from-[#FF5A1F]/10 to-zinc-900">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.full_name} className="h-full w-full object-cover opacity-60" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-5xl font-black text-white/10">
                    {profile.full_name?.charAt(0)}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0A0A0A]" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  {profile.available !== false ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-green-500/20 px-3 py-1 text-xs font-bold text-green-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />Disponible
                    </span>
                  ) : (
                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-500">Indisponible</span>
                  )}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-black text-white group-hover:text-[#FF5A1F] transition">{profile.full_name}</h3>
                  <div className="flex shrink-0 items-center gap-1">
                    {profile.license_verified && (
                      <ShieldCheck size={16} className="text-green-400" title="Licence auto validée" />
                    )}
                    {profile.license_verified_2 && (
                      <ShieldCheck size={16} className="text-blue-400" title="Licence moto validée" />
                    )}
                  </div>
                </div>

                {(profile.city || profile.country) && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
                    <MapPin size={12} />
                    {[profile.city, profile.country].filter(Boolean).join(", ")}
                  </div>
                )}

                {profile.years_experience > 0 && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
                    <Star size={12} className="text-[#FF5A1F]" />
                    {profile.years_experience} an{profile.years_experience > 1 ? "s" : ""} d'expérience
                  </div>
                )}

                {profile.disciplines && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {profile.disciplines.split(/[,;/]/).slice(0, 3).map((d: string) => (
                      <span key={d} className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-400">
                        {d.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
