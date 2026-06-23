"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { BookOpen, CheckCircle2, FileUser, Search } from "lucide-react";

type Marshal = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  city: string | null;
  disciplines: string | null;
  years_experience: number | null;
  bio: string | null;
  slug: string | null;
};

export default function CvLabPage() {
  const [marshals, setMarshals] = useState<Marshal[]>([]);
  const [eventCounts, setEventCounts] = useState<Record<string, number>>({});
  const [verifiedLicenses, setVerifiedLicenses] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    const [{ data: profiles }, { data: apps }, { data: licenses }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, avatar_url, city, disciplines, years_experience, bio, slug").eq("role", "marshal").order("full_name"),
      supabase.from("applications").select("marshal_id").eq("status", "accepted"),
      supabase.from("licenses").select("user_id, verified"),
    ]);

    const counts: Record<string, number> = {};
    (apps || []).forEach((a) => { counts[a.marshal_id] = (counts[a.marshal_id] || 0) + 1; });

    const verified: Record<string, boolean> = {};
    (licenses || []).forEach((l) => { if (l.verified) verified[l.user_id] = true; });

    setMarshals(profiles || []);
    setEventCounts(counts);
    setVerifiedLicenses(verified);
    setLoading(false);
  }

  const filtered = marshals.filter((m) =>
    !search || m.full_name?.toLowerCase().includes(search.toLowerCase()) || m.city?.toLowerCase().includes(search.toLowerCase())
  );

  const completionScore = (m: Marshal) => {
    let score = 0;
    if (m.full_name) score++;
    if (m.avatar_url) score++;
    if (m.bio) score++;
    if (m.disciplines) score++;
    if (m.years_experience) score++;
    if (m.city) score++;
    return Math.round((score / 6) * 100);
  };

  return (
    <div>
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
        <div className="flex h-20 items-center justify-between px-6 lg:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Administration — Bêta</p>
            <h1 className="mt-1 text-2xl font-black text-zinc-900 lg:text-3xl">CV Lab</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-3 text-center">
              <p className="text-xs text-zinc-500">Commissaires</p>
              <p className="text-2xl font-black text-zinc-900">{marshals.length}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] p-6 pb-24 lg:p-10 lg:pb-10">

        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#FF5A1F]/20 bg-[#FF5A1F]/5 p-5">
          <BookOpen size={20} className="shrink-0 text-[#FF5A1F]" />
          <p className="text-sm text-zinc-700">
            <span className="font-bold">CV Lab — zone bêta.</span> Ici tu peux prévisualiser le CV de chaque commissaire et ajouter leurs épreuves passées avant l'arrivée sur la plateforme. Non visible des utilisateurs.
          </p>
        </div>

        <div className="mb-6 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Rechercher un commissaire..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30 sm:max-w-sm"
          />
        </div>

        {loading && <p className="py-20 text-center text-zinc-500">Chargement...</p>}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((m) => {
            const score = completionScore(m);
            const events = eventCounts[m.id] || 0;
            const hasLicense = verifiedLicenses[m.id];
            return (
              <Link
                key={m.id}
                href={`/admin/cv-lab/${m.id}`}
                className="group flex gap-4 rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-[#FF5A1F]/30 hover:shadow-md"
              >
                <img
                  src={m.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.full_name || "C")}&background=FF5A1F&color=fff&size=80`}
                  alt={m.full_name || ""}
                  className="h-14 w-14 shrink-0 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate font-black text-zinc-900 group-hover:text-[#FF5A1F] transition">{m.full_name || "Sans nom"}</p>
                    {hasLicense && <CheckCircle2 size={14} className="shrink-0 text-green-500 mt-0.5" />}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-zinc-500">{m.city || "Ville non renseignée"}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                      <FileUser size={12} />
                      <span>{events} épreuve{events !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex flex-1 items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-zinc-100">
                        <div
                          className={`h-1.5 rounded-full transition-all ${score >= 80 ? "bg-green-500" : score >= 50 ? "bg-yellow-400" : "bg-zinc-300"}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-bold ${score >= 80 ? "text-green-600" : score >= 50 ? "text-yellow-600" : "text-zinc-400"}`}>{score}%</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
