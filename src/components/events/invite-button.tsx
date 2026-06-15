"use client";

import { useEffect, useState } from "react";
import { Mail, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Props = { marshalId: string; marshalName: string };

export default function InviteButton({ marshalId, marshalName }: Props) {
  const [role, setRole] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [organizerName, setOrganizerName] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);
      const { data: profile } = await supabase.from("profiles").select("role, full_name").eq("id", user.id).single();
      if (!profile || profile.role !== "organizer") return;
      setRole("organizer");
      setOrganizerName(profile.full_name || "");
      const { data: evs } = await supabase.from("events").select("id, title, event_date, slug").eq("organizer_id", user.id).gte("event_date", new Date().toISOString()).order("event_date");
      setEvents(evs || []);
    });
  }, []);

  async function invite(event: any) {
    if (!userId) return;
    setSending(true);
    await supabase.from("notifications").insert({
      user_id: marshalId,
      title: `Invitation : ${event.title}`,
      message: `${organizerName} vous invite à postuler à l'événement "${event.title}".`,
      link: `/events/${event.slug}`,
      read: false,
    });
    setSent(event.id);
    setSending(false);
    setTimeout(() => { setOpen(false); setSent(null); }, 2000);
  }

  if (role !== "organizer") return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(true)}
        className="flex h-12 items-center gap-2 rounded-2xl border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-5 text-sm font-bold text-[#FF5A1F] transition hover:bg-[#FF5A1F]/20"
      >
        <Mail size={16} />
        Inviter à un événement
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-[#0A0A0A]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="font-black text-white">Inviter {marshalName}</p>
                <p className="mt-1 text-xs text-zinc-500">Sélectionnez un événement à venir</p>
              </div>
              <button onClick={() => setOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 hover:bg-white/5">
                <X size={16} />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-4">
              {events.length === 0 && (
                <p className="py-8 text-center text-sm text-zinc-500">Aucun événement à venir disponible.</p>
              )}
              {events.map((ev) => (
                <button
                  key={ev.id}
                  onClick={() => invite(ev)}
                  disabled={sending || sent === ev.id}
                  className={`mb-2 flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition ${
                    sent === ev.id
                      ? "border-green-500/30 bg-green-500/10 text-green-400"
                      : "border-white/10 bg-white/[0.02] hover:border-[#FF5A1F]/30 hover:bg-[#FF5A1F]/5"
                  }`}
                >
                  <div>
                    <p className="font-bold text-white">{ev.title}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {new Date(ev.event_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  {sent === ev.id && <span className="text-sm font-bold text-green-400">Envoyée ✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
