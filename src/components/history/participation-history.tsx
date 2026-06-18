"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CalendarDays, MapPin } from "lucide-react";
import { formatDateRange } from "@/lib/formatDate";

const DISC_STYLE: Record<string, string> = {
  "Circuit":        "text-blue-400 border-blue-500/30 bg-blue-500/10",
  "Rallye":         "text-[#FF5A1F] border-[#FF5A1F]/30 bg-[#FF5A1F]/10",
  "Course de côte": "text-purple-400 border-purple-500/30 bg-purple-500/10",
  "Karting":        "text-green-400 border-green-500/30 bg-green-500/10",
  "Tout-terrain":   "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
  "Endurance":      "text-red-400 border-red-500/30 bg-red-500/10",
  "Drift":          "text-pink-400 border-pink-500/30 bg-pink-500/10",
  "Moto Cross":     "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  "Enduro":         "text-lime-400 border-lime-500/30 bg-lime-500/10",
  "Road Racing":    "text-orange-400 border-orange-500/30 bg-orange-500/10",
};

export default function ParticipationHistory({ marshalId, forceShow = false }: { marshalId: string; forceShow?: boolean }) {
  const [isOrganizer, setIsOrganizer] = useState(forceShow);
  const [loading, setLoading] = useState(true);
  const [participations, setParticipations] = useState<any[]>([]);

  useEffect(() => {
    checkAndLoad();
  }, [marshalId]);

  async function checkAndLoad() {
    if (!forceShow) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, email")
        .eq("id", user.id)
        .single();

      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "foussardk@gmail.com";
      const canView = profile?.role === "organizer" || user.email === adminEmail;
      if (!canView) { setLoading(false); return; }
      setIsOrganizer(true);
    }

    const { data: apps } = await supabase
      .from("applications")
      .select("id, post, events(id, title, discipline, event_date, event_end_date, location)")
      .eq("marshal_id", marshalId)
      .eq("attended", true)
      .order("created_at", { ascending: false });

    setParticipations(apps || []);
    setLoading(false);
  }

  if (loading || !isOrganizer) return null;

  const byYear: Record<string, any[]> = {};
  participations.forEach((p) => {
    const year = p.events?.event_date
      ? new Date(p.events.event_date).getFullYear().toString()
      : "?";
    if (!byYear[year]) byYear[year] = [];
    byYear[year].push(p);
  });
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  const statsByDiscipline: Record<string, number> = {};
  participations.forEach((p) => {
    const d = p.events?.discipline || "Autre";
    statsByDiscipline[d] = (statsByDiscipline[d] || 0) + 1;
  });

  return (
    <div className="mt-10 rounded-[40px] border border-white/10 bg-[#0A0A0A] p-8 lg:p-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#FF5A1F]">
            Historique des participations
          </p>
          <p className="mt-1 text-xs text-zinc-500">Visible uniquement par les organisateurs</p>
        </div>
        <div className="rounded-2xl border border-[#FF5A1F]/20 bg-[#FF5A1F]/10 px-5 py-3 text-center">
          <p className="text-3xl font-black text-[#FF5A1F]">{participations.length}</p>
          <p className="text-xs text-zinc-500">participation{participations.length > 1 ? "s" : ""}</p>
        </div>
      </div>

      {Object.keys(statsByDiscipline).length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {Object.entries(statsByDiscipline).sort((a, b) => b[1] - a[1]).map(([disc, count]) => (
            <div key={disc} className={`rounded-2xl border px-4 py-2 text-sm font-bold ${DISC_STYLE[disc] || "border-white/10 bg-white/5 text-zinc-300"}`}>
              {count} {disc}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 space-y-6">
        {participations.length === 0 ? (
          <p className="text-zinc-500 text-sm">Aucune participation enregistrée.</p>
        ) : (
          years.map((year) => (
            <div key={year}>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
                {year} — {byYear[year].length} participation{byYear[year].length > 1 ? "s" : ""}
              </p>
              <div className="space-y-2">
                {byYear[year].map((p) => (
                  <div key={p.id} className="flex flex-wrap items-center gap-3 rounded-[20px] border border-white/10 bg-white/[0.02] p-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-white">{p.events?.title}</span>
                        {p.events?.discipline && (
                          <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${DISC_STYLE[p.events.discipline] || "border-white/10 text-zinc-400"}`}>
                            {p.events.discipline}
                          </span>
                        )}
                        {p.post && <span className="text-xs text-zinc-500 italic">{p.post}</span>}
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-zinc-500">
                        {p.events?.event_date && (
                          <span className="flex items-center gap-1">
                            <CalendarDays size={11} />
                            {formatDateRange(p.events.event_date, p.events.event_end_date)}
                          </span>
                        )}
                        {p.events?.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={11} />
                            {p.events.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">
                      ✔ Présent
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
