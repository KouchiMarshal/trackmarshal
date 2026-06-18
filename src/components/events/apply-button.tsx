"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { canApplyToEvent } from "@/lib/licenseUtils";

type ApplyButtonProps = {
  eventId: string;
  eventDiscipline?: string;
  isFull?: boolean;
};

export default function ApplyButton({ eventId, eventDiscipline, isFull = false }: ApplyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [discipline, setDiscipline] = useState(eventDiscipline);
  const [eventOrganizerId, setEventOrganizerId] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState<string>("");
  const [eventSlug, setEventSlug] = useState<string>("");

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  useEffect(() => {
    checkApplication();
  }, []);

  async function checkApplication() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profileData } = await supabase
      .from("profiles")
      .select("id, role, license_type, license_verified, license_type_2, license_verified_2")
      .eq("id", user.id)
      .single();

    setProfile(profileData);

    const { data: eventData } = await supabase
      .from("events")
      .select("discipline, organizer_id, title, slug")
      .eq("id", eventId)
      .single();

    if (eventData) {
      if (!discipline && eventData.discipline) setDiscipline(eventData.discipline);
      setEventOrganizerId(eventData.organizer_id);
      setEventTitle(eventData.title || "");
      setEventSlug(eventData.slug || "");
    }

    const { data } = await supabase
      .from("applications")
      .select("id, status")
      .eq("event_id", eventId)
      .eq("marshal_id", user.id)
      .maybeSingle();

    if (data) {
      setApplicationId(data.id);
      setApplicationStatus(data.status);
    }
  }

  async function handleApply() {
    setLoading(true);
    setMessage(null);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setMessage({ text: "Vous devez être connecté pour postuler.", type: "error" });
      setLoading(false);
      return;
    }

    const check = canApplyToEvent(profile || {}, discipline);
    if (!check.allowed) {
      setMessage({ text: check.reason || "Licence non valide pour cet événement.", type: "error" });
      setLoading(false);
      return;
    }

    const { error, data } = await supabase
      .from("applications")
      .insert({ event_id: eventId, marshal_id: user.id, status: isFull ? "waitlisted" : "pending" })
      .select("id, status")
      .single();

    if (error) {
      setMessage({ text: "Une erreur est survenue. Réessayez.", type: "error" });
      setLoading(false);
      return;
    }

    setApplicationId(data.id);
    setApplicationStatus(data.status);
    setMessage({ text: isFull ? "Vous êtes sur la liste d'attente !" : "Votre candidature a bien été envoyée !", type: "success" });
    setLoading(false);
  }

  async function handleCancel() {
    if (applicationStatus === "accepted") {
      setWithdrawReason("");
      setShowWithdrawModal(true);
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.from("applications").delete().eq("id", applicationId);

    if (error) {
      setMessage({ text: `Erreur : ${error.message}`, type: "error" });
      setLoading(false);
      return;
    }

    setApplicationId(null);
    setApplicationStatus(null);
    setMessage({ text: "Candidature annulée.", type: "success" });
    setLoading(false);
  }

  async function sendWithdrawRequest() {
    if (!withdrawReason.trim()) return;
    setWithdrawLoading(true);

    if (eventOrganizerId) {
      await supabase.from("notifications").insert({
        user_id: eventOrganizerId,
        title: `Demande d'annulation — ${eventTitle}`,
        message: withdrawReason.trim(),
        type: "withdrawal_request",
        link: `/organizer/events/${eventId}`,
        read: false,
      });
    }

    setWithdrawLoading(false);
    setShowWithdrawModal(false);
    setWithdrawReason("");
    setMessage({
      text: "Votre demande a été envoyée à l'organisateur. Votre inscription reste active jusqu'à sa validation.",
      type: "success",
    });
  }

  if (profile?.role === "organizer") return null;

  return (
    <div className="mt-10 space-y-4">
      {message && (
        <div className={`rounded-2xl px-5 py-4 text-sm font-semibold ${
          message.type === "success" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
        }`}>
          {message.text}
        </div>
      )}

      {!applicationId ? (
        <button
          onClick={handleApply}
          disabled={loading}
          className={`h-16 w-full rounded-2xl text-lg font-bold text-white transition hover:scale-[1.02] hover:opacity-90 disabled:opacity-60 ${
            isFull ? "bg-blue-600" : "bg-[#FF5A1F]"
          }`}
        >
          {loading ? "Envoi en cours..." : isFull ? "Rejoindre la liste d'attente" : "Postuler comme commissaire"}
        </button>
      ) : (
        <div className="space-y-3">
          <div className={`flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-bold ${
            applicationStatus === "accepted" ? "bg-green-500/15 text-green-400"
            : applicationStatus === "rejected" ? "bg-red-500/15 text-red-400"
            : applicationStatus === "waitlisted" ? "bg-blue-500/15 text-blue-400"
            : "bg-yellow-500/15 text-yellow-400"
          }`}>
            <span>
              {applicationStatus === "accepted" ? "✓ Candidature acceptée"
                : applicationStatus === "rejected" ? "✗ Candidature refusée"
                : applicationStatus === "waitlisted" ? "⏳ Vous êtes sur la liste d'attente"
                : "⏳ Candidature en attente de réponse"}
            </span>
          </div>
          {applicationStatus !== "rejected" && (
            <button
              onClick={handleCancel}
              disabled={loading}
              className="h-14 w-full rounded-2xl border border-red-500/30 bg-red-500/10 text-sm font-bold text-red-400 transition hover:bg-red-500/20 disabled:opacity-60"
            >
              {loading ? "Annulation..."
                : applicationStatus === "accepted" ? "Demander l'annulation"
                : "Annuler ma candidature"}
            </button>
          )}
        </div>
      )}

      {/* Modal demande d'annulation */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>
          <div className="w-full max-w-lg rounded-[28px] border border-white/10 bg-[#111] p-6 space-y-5">
            <div>
              <h3 className="text-xl font-black">Demander l'annulation</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Votre participation reste active jusqu'à confirmation de l'organisateur.
              </p>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                Raison de l'annulation <span className="text-red-400">*</span>
              </label>
              <textarea
                value={withdrawReason}
                onChange={(e) => setWithdrawReason(e.target.value)}
                placeholder="Expliquez pourquoi vous ne pouvez plus participer..."
                rows={4}
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none placeholder:text-zinc-600 transition focus:border-[#FF5A1F]/40"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowWithdrawModal(false); setWithdrawReason(""); }}
                className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-bold transition hover:bg-white/10"
              >
                Retour
              </button>
              <button
                onClick={sendWithdrawRequest}
                disabled={!withdrawReason.trim() || withdrawLoading}
                className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-[#FF5A1F] text-sm font-bold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {withdrawLoading ? "Envoi..." : "Envoyer la demande"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
