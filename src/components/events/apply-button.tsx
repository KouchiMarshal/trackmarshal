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

    // Fetch event discipline if not passed as prop
    if (!discipline) {
      const { data: eventData } = await supabase
        .from("events")
        .select("discipline")
        .eq("id", eventId)
        .single();
      if (eventData?.discipline) setDiscipline(eventData.discipline);
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

    // License category check
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
      const confirmed = confirm("Votre candidature a été acceptée. Êtes-vous sûr de vouloir l'annuler ?");
      if (!confirmed) return;
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
              {loading ? "Annulation..." : "Annuler ma candidature"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
