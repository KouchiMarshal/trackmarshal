"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Clock3, ChevronRight, Search, X } from "lucide-react";

export default function AdminCommissairesPage() {
  const [commissaires, setCommissaires] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [urlFilter, setUrlFilter] = useState<{ type: string; value: string } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("filter");
    const value = params.get("value");
    if (type && value) setUrlFilter({ type, value });
  }, []);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, email, avatar_url, city, country, license_type, license_number, asa, license_verified, license_url, years_experience, created_at")
        .eq("role", "marshal")
        .order("created_at", { ascending: false });

      setCommissaires(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = commissaires.filter((c) => {
    if (urlFilter) {
      if (urlFilter.type === "license_type") {
        return urlFilter.value === "Non renseigné" ? !c.license_type : c.license_type === urlFilter.value;
      }
      if (urlFilter.type === "asa") {
        return c.asa === urlFilter.value;
      }
    }
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.full_name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.license_number?.toLowerCase().includes(q) ||
      c.license_type?.toLowerCase().includes(q) ||
      c.asa?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
        <div className="flex h-20 items-center justify-between px-6 lg:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Administration</p>
            <h1 className="mt-1 text-2xl font-black lg:text-3xl">
              Commissaires ({filtered.length}{filtered.length !== commissaires.length ? `/${commissaires.length}` : ""})
            </h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] p-6 pb-24 lg:p-10 lg:pb-10">

        {urlFilter && (
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-5 py-3">
            <span className="text-xs uppercase tracking-[0.15em] text-[#FF5A1F]">
              {urlFilter.type === "license_type" ? "Licence" : "ASA"}
            </span>
            <span className="flex-1 text-sm font-black text-white">{urlFilter.value}</span>
            <Link
              href="/admin/commissaires"
              onClick={() => setUrlFilter(null)}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-zinc-400 transition hover:text-white"
            >
              <X size={12} /> Effacer
            </Link>
          </div>
        )}

        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3">
          <Search size={18} className="shrink-0 text-zinc-500" />
          <input
            type="text"
            placeholder="Rechercher par nom, email, numéro ou type de licence..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setUrlFilter(null); }}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-600"
          />
        </div>

        {loading && <p className="py-20 text-center text-zinc-500">Chargement...</p>}

        <div className="space-y-4">
          {filtered.map((c) => (
            <Link key={c.id} href={`/admin/commissaires/${c.id}`} className="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.06] sm:flex-row sm:items-center">

              <div className="flex items-center gap-4 flex-1 min-w-0">
                <img
                  src={
                    c.avatar_url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(c.full_name || "C")}&background=FF5A1F&color=fff&size=80`
                  }
                  alt={c.full_name}
                  className="h-14 w-14 shrink-0 rounded-2xl object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate font-black">{c.full_name || "Sans nom"}</p>
                  <p className="truncate text-sm text-zinc-400">{c.email}</p>
                  {(c.city || c.country) && (
                    <p className="text-xs text-zinc-500">{[c.city, c.country].filter(Boolean).join(", ")}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:shrink-0 sm:ml-auto">
                {c.license_type && (
                  <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs">
                    <p className="text-zinc-500">Licence</p>
                    <p className="font-bold text-[#FF5A1F]">{c.license_type}</p>
                    {c.license_number && <p className="text-zinc-400">N° {c.license_number}</p>}
                    {c.asa && <p className="mt-0.5 text-zinc-500">{c.asa}</p>}
                  </div>
                )}

                {c.years_experience && (
                  <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-center">
                    <p className="text-zinc-500">Exp.</p>
                    <p className="font-black">{c.years_experience} ans</p>
                  </div>
                )}

                {c.license_url ? (
                  c.license_verified ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-green-500/20 px-3 py-1.5 text-xs font-bold text-green-400">
                      <CheckCircle2 size={12} /> Validée
                    </span>
                  ) : (
                    <Link
                      href="/admin/licenses"
                      className="flex items-center gap-1.5 rounded-full bg-yellow-500/20 px-3 py-1.5 text-xs font-bold text-yellow-400 transition hover:bg-yellow-500/30"
                    >
                      <Clock3 size={12} /> À valider
                    </Link>
                  )
                ) : (
                  <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-zinc-500">
                    Pas de licence
                  </span>
                )}
                <ChevronRight size={18} className="shrink-0 text-zinc-600" />
              </div>

            </Link>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <p className="py-16 text-center text-zinc-500">Aucun résultat pour "{search}"</p>
        )}

      </div>
    </div>
  );
}
