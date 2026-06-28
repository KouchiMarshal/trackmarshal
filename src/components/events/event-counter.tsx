"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ApplyButton from "./apply-button";

type Props = {
  eventId: string;
  marshalsNeeded: number;
  eventDiscipline?: string | null;
  staffRoles?: { role: string; count: number }[];
  initialCount?: number;
  initialRoleCounts?: Record<string, number>;
};

export default function EventCounter({ eventId, marshalsNeeded, eventDiscipline, staffRoles, initialCount = 0, initialRoleCounts = {} }: Props) {
  // Valeurs calculées côté serveur (clé admin) : correctes pour tout le monde,
  // y compris les visiteurs non connectés que le RLS empêche de lire.
  const [count, setCount] = useState<number>(initialCount);
  const [roleCounts, setRoleCounts] = useState<Record<string, number>>(initialRoleCounts);

  useEffect(() => {
    let active = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    // La requête live dépend du RLS : un visiteur anonyme obtiendrait 0 et
    // écraserait les bonnes valeurs serveur. On ne l'active donc que pour
    // les utilisateurs connectés, qui bénéficient du suivi temps réel.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active || !session) return;
      fetchCount();
      channel = supabase
        .channel(`event-counter-${eventId}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "applications", filter: `event_id=eq.${eventId}` }, fetchCount)
        .subscribe();
    });

    return () => { active = false; if (channel) supabase.removeChannel(channel); };
  }, [eventId]);

  async function fetchCount() {
    const { data, count: c } = await supabase
      .from("applications")
      .select("desired_role", { count: "exact" })
      .eq("event_id", eventId)
      .eq("status", "accepted");

    setCount(c ?? 0);

    const counts: Record<string, number> = {};
    (data || []).forEach((a) => {
      const role = a.desired_role || "";
      counts[role] = (counts[role] || 0) + 1;
    });
    setRoleCounts(counts);
  }

  const accepted = count;
  const isFull = accepted >= (marshalsNeeded || 0);
  const pct = Math.min(100, Math.round((accepted / (marshalsNeeded || 1)) * 100));

  return (
    <>
      <div className="mt-4 flex items-center justify-between text-sm text-zinc-500">
        <span>{accepted} / {marshalsNeeded} commissaires</span>
        {isFull && <span className="font-bold text-blue-600">Complet — liste d'attente ouverte</span>}
      </div>

      <div className="mt-4 h-2 w-full rounded-full bg-zinc-200">
        <div className="h-2 rounded-full bg-[#FF5A1F] transition-all" style={{ width: `${pct}%` }} />
      </div>

      {staffRoles && staffRoles.length > 1 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">Détail des postes</p>
          {staffRoles.map((r) => {
            const acceptedForRole = roleCounts[r.role] || 0;
            const remaining = Math.max(0, r.count - acceptedForRole);
            const full = remaining === 0;
            return (
              <div key={r.role} className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5">
                <span className="text-sm font-medium text-zinc-700">{r.role}</span>
                <div className="flex items-center gap-2">
                  {full && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">Complet</span>
                  )}
                  <span className={`text-sm font-bold ${full ? "text-green-700" : "text-zinc-900"}`}>
                    {acceptedForRole} / {r.count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8">
        <ApplyButton eventId={eventId} isFull={isFull} eventDiscipline={eventDiscipline ?? undefined} />
      </div>
    </>
  );
}
