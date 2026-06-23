"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ApplyButton from "./apply-button";

type Props = {
  eventId: string;
  marshalsNeeded: number;
  eventDiscipline?: string | null;
  staffRoles?: { role: string; count: number }[];
};

export default function EventCounter({ eventId, marshalsNeeded, eventDiscipline, staffRoles }: Props) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetchCount();
    const channel = supabase
      .channel(`event-counter-${eventId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "applications", filter: `event_id=eq.${eventId}` }, fetchCount)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [eventId]);

  async function fetchCount() {
    const { count: c } = await supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("event_id", eventId)
      .eq("status", "accepted");
    setCount(c ?? 0);
  }

  const accepted = count ?? 0;
  const isFull = accepted >= (marshalsNeeded || 0);
  const pct = Math.min(100, Math.round((accepted / (marshalsNeeded || 1)) * 100));

  return (
    <>
      <div className="mt-4 flex items-center justify-between text-sm text-zinc-500">
        <span>{count === null ? "…" : accepted} / {marshalsNeeded} commissaires</span>
        {isFull && <span className="font-bold text-blue-600">Complet — liste d'attente ouverte</span>}
      </div>

      <div className="mt-4 h-2 w-full rounded-full bg-zinc-200">
        <div className="h-2 rounded-full bg-[#FF5A1F] transition-all" style={{ width: `${pct}%` }} />
      </div>

      {staffRoles && staffRoles.length > 1 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">Détail des postes</p>
          {staffRoles.map((r) => (
            <div key={r.role} className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5">
              <span className="text-sm font-medium text-zinc-700">{r.role}</span>
              <span className="text-sm font-bold text-zinc-900">{r.count} poste{r.count > 1 ? "s" : ""}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <ApplyButton eventId={eventId} isFull={isFull} eventDiscipline={eventDiscipline ?? undefined} />
      </div>
    </>
  );
}
