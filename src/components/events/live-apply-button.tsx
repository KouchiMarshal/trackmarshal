"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ApplyButton from "./apply-button";

type Props = { eventId: string; marshalsNeeded: number; eventDiscipline?: string | null };

export default function LiveApplyButton({ eventId, marshalsNeeded, eventDiscipline }: Props) {
  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    async function check() {
      const { count } = await supabase
        .from("applications")
        .select("id", { count: "exact", head: true })
        .eq("event_id", eventId)
        .eq("status", "accepted");
      setIsFull((count ?? 0) >= (marshalsNeeded || 0));
    }
    check();
  }, [eventId, marshalsNeeded]);

  return <ApplyButton eventId={eventId} isFull={isFull} eventDiscipline={eventDiscipline ?? undefined} />;
}
