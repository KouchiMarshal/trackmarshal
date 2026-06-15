"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import OrganizerSidebar from "@/components/layout/organizer-sidebar";
import { Toast, type ToastData } from "@/components/ui/toast";

function StarRating({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition hover:scale-110"
        >
          <Star
            size={28}
            className={`transition ${
              star <= (hover || value)
                ? "fill-[#FF5A1F] text-[#FF5A1F]"
                : "text-zinc-700"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function OrganizerReviewsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;

  const [event, setEvent] = useState<any>(null);
  const [commissaires, setCommissaires] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Record<string, { rating: number; comment: string }>>({});
  const [existingReviews, setExistingReviews] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastData>(null);

  useEffect(() => {
    if (!eventId) return;
    load();
  }, [eventId]);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { data: eventData } = await supabase.from("events").select("*").eq("id", eventId).single();
    setEvent(eventData);

    const { data: apps } = await supabase
      .from("applications")
      .select("*")
      .eq("event_id", eventId)
      .eq("status", "accepted");

    if (!apps || apps.length === 0) { setLoading(false); return; }

    const marshalIds = apps.map((a: any) => a.marshal_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, license_type, years_experience")
      .in("id", marshalIds);

    setCommissaires(profiles || []);

    const { data: existingData } = await supabase
      .from("reviews")
      .select("*")
      .eq("event_id", eventId)
      .eq("organizer_id", user.id);

    const map: Record<string, any> = {};
    (existingData || []).forEach((r: any) => { map[r.marshal_id] = r; });
    setExistingReviews(map);

    const initial: Record<string, { rating: number; comment: string }> = {};
    (profiles || []).forEach((p: any) => {
      initial[p.id] = {
        rating: map[p.id]?.rating || 0,
        comment: map[p.id]?.comment || "",
      };
    });
    setReviews(initial);
    setLoading(false);
  }

  async function saveReview(marshalId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const r = reviews[marshalId];
    if (!r || r.rating === 0) { setToast({ message: "Veuillez sélectionner une note.", type: "error" }); return; }

    setSaving(marshalId);

    if (existingReviews[marshalId]) {
      await supabase.from("reviews").update({ rating: r.rating, comment: r.comment }).eq("id", existingReviews[marshalId].id);
    } else {
      await supabase.from("reviews").insert({
        organizer_id: user.id,
        marshal_id: marshalId,
        event_id: eventId,
        rating: r.rating,
        comment: r.comment,
      });
    }

    setExistingReviews((prev) => ({ ...prev, [marshalId]: { ...reviews[marshalId] } }));
    setSaving(null);
    setToast({ message: "Avis enregistré.", type: "success" });
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="flex min-h-screen">
        <OrganizerSidebar />
        <div className="flex-1">
          <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
            <div className="flex h-20 items-center gap-4 px-4 lg:px-10">
              <Link href={`/organizer/events/${eventId}`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] transition hover:bg-white/10">
                <ArrowLeft size={18} />
              </Link>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Événement</p>
                <h1 className="mt-1 text-xl font-black lg:text-2xl">Évaluation des commissaires</h1>
              </div>
            </div>
          </header>

          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-[#FF5A1F]/10 blur-[140px] pointer-events-none" />
            <div className="relative z-10 mx-auto max-w-[1200px] p-4 pb-24 lg:p-10 lg:pb-10">

              {event && (
                <div className="mb-8 rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Évaluation pour</p>
                  <h2 className="mt-2 text-3xl font-black">{event.title}</h2>
                  <p className="mt-1 text-zinc-400">{event.location}</p>
                </div>
              )}

              {loading && <p className="py-20 text-center text-zinc-500">Chargement...</p>}

              {!loading && commissaires.length === 0 && (
                <div className="rounded-[32px] border border-dashed border-white/10 p-16 text-center">
                  <h2 className="text-3xl font-black">Aucun commissaire accepté</h2>
                  <p className="mt-4 text-zinc-500">Les évaluations sont disponibles pour les commissaires acceptés.</p>
                </div>
              )}

              <div className="space-y-6">
                {commissaires.map((c) => {
                  const r = reviews[c.id] || { rating: 0, comment: "" };
                  const already = existingReviews[c.id];
                  return (
                    <div key={c.id} className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 lg:p-8">
                      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">

                        <div className="flex items-center gap-4 sm:w-56 sm:shrink-0">
                          <img
                            src={c.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.full_name || "C")}&background=FF5A1F&color=fff&size=80`}
                            alt={c.full_name}
                            className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                          />
                          <div>
                            <p className="font-black">{c.full_name}</p>
                            {c.license_type && <p className="mt-0.5 text-xs text-[#FF5A1F]">{c.license_type}</p>}
                            {c.years_experience && <p className="mt-0.5 text-xs text-zinc-500">{c.years_experience} ans d'exp.</p>}
                          </div>
                        </div>

                        <div className="flex-1 space-y-4">
                          {already && (
                            <p className="text-xs text-green-400">✔ Avis déjà enregistré — vous pouvez le modifier</p>
                          )}
                          <div>
                            <p className="mb-3 text-xs uppercase tracking-[0.15em] text-zinc-500">Note globale *</p>
                            <StarRating
                              value={r.rating}
                              onChange={(val) => setReviews((prev) => ({ ...prev, [c.id]: { ...prev[c.id], rating: val } }))}
                            />
                            <p className="mt-2 text-sm text-zinc-500">
                              {r.rating === 1 ? "Insuffisant" : r.rating === 2 ? "Passable" : r.rating === 3 ? "Bien" : r.rating === 4 ? "Très bien" : r.rating === 5 ? "Excellent" : "Aucune note"}
                            </p>
                          </div>
                          <div>
                            <p className="mb-2 text-xs uppercase tracking-[0.15em] text-zinc-500">Commentaire (optionnel)</p>
                            <textarea
                              value={r.comment}
                              onChange={(e) => setReviews((prev) => ({ ...prev, [c.id]: { ...prev[c.id], comment: e.target.value } }))}
                              placeholder="Ponctuel, professionnel, bonne connaissance du règlement..."
                              rows={3}
                              className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-[#FF5A1F]/40"
                            />
                          </div>
                          <button
                            onClick={() => saveReview(c.id)}
                            disabled={saving === c.id || r.rating === 0}
                            className="flex h-12 items-center gap-2 rounded-2xl bg-[#FF5A1F] px-6 text-sm font-bold transition hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
                          >
                            {saving === c.id ? "Enregistrement..." : already ? "Mettre à jour" : "Enregistrer l'avis"}
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
