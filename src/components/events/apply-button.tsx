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
  const [withdrawalPending, setWithdrawalPending] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [discipline, setDiscipline] = useState(eventDiscipline);
  const [staffRoles, setStaffRoles] = useState<{role:string,count:number}[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [desiredRole, setDesiredRole] = useState<string | null>(null);

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
      .select("discipline, staff_roles")
      .eq("id", eventId)
      .single();
    if (eventData?.discipline) setDiscipline(eventData.discipline);
    if (eventData?.staff_roles?.length > 0) setStaffRoles(eventData.staff_roles);

    const { data } = await supabase
      .from("applications")
      .select("id, status, withdrawal_reason, desired_role")
      .eq("event_id", eventId)
      .eq("marshal_id", user.id)
      .maybeSingle();

    if (data) {
      setApplicationId(data.id);
      setApplicationStatus(data.status);
      setWithdrawalPending(!!data.withdrawal_reason);
      if (data.desired_role) setDesiredRole(data.desired_role);
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

    if (staffRoles.length > 1 && !selectedRole) {
      setMessage({ text: "Veuillez choisir votre rôle avant de postuler.", type: "error" });
      setLoading(false);
      return;
    }

    const { error, data } = await supabase
      .from("applications")
      .insert({
        event_id: eventId,
        marshal_id: user.id,
        status: isFull ? "waitlisted" : "pending",
        desired_role: staffRoles.length > 1 ? selectedRole : (staffRoles[0]?.role || null)
      })
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
    if (!withdrawReason.trim() || !applicationId) return;
    setWithdrawLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/marshal/request-withdrawal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ applicationId, reason: withdrawReason.trim() }),
    });

    const result = await res.json();
    setWithdrawLoading(false);
    setShowWithdrawModal(false);
    setWithdrawReason("");

    if (result.ok) {
      setWithdrawalPending(true);
      setMessage({
        text: "Votre demande a été envoyée à l'organisateur. Votre inscription reste active jusqu'à sa validation.",
        type: "success",
      });
    } else {
      setMessage({ text: `Erreur : ${result.error || "Inconnue"}`, type: "error" });
    }
  }

  if (profile?.role === "organizer") return null;

  return (
    <div className="mt-10 space-y-4">
      {message && (
        <div className={`rounded-2xl px-5 py-4 text-sm font-semibold ${
          message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      {!applicationId ? (
        <>
          {staffRoles.length > 1 && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Rôle souhaité</p>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="h-14 w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-5 text-zinc-900 outline-none focus:border-[#FF5A1F]"
              >
                <option value="">Choisir votre rôle...</option>
                {staffRoles.map(r => (
                  <option key={r.role} value={r.role}>{r.role} ({r.count} poste{r.count > 1 ? "s" : ""})</option>
                ))}
              </select>
            </div>
          )}
          <button
            onClick={handleApply}
            disabled={loading}
            className={`h-16 w-full rounded-2xl text-lg font-bold text-white transition hover:scale-[1.02] hover:opacity-90 disabled:opacity-60 ${
              isFull ? "bg-blue-600" : "bg-[#FF5A1F]"
            }`}
          >
            {loading ? "Envoi en cours..." : isFull ? "Rejoindre la liste d'attente" : "Postuler comme commissaire"}
          </button>
        </>
      ) : (
        <div className="space-y-3">
          <div className={`flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-bold ${
            applicationStatus === "accepted" ? "bg-green-100 text-green-700"
            : applicationStatus === "rejected" ? "bg-red-100 text-red-700"
            : applicationStatus === "waitlisted" ? "bg-blue-100 text-blue-700"
            : "bg-yellow-100 text-yellow-700"
          }`}>
            <span>
              {applicationStatus === "accepted" ? "✓ Candidature acceptée"
                : applicationStatus === "rejected" ? "✗ Candidature refusée"
                : applicationStatus === "waitlisted" ? "⏳ Vous êtes sur la liste d'attente"
                : "⏳ Candidature en attente de réponse"}
            </span>
          </div>
          {desiredRole && (
            <p className="text-xs text-zinc-500">Rôle : <span className="font-semibold text-zinc-700">{desiredRole}</span></p>
          )}

          {withdrawalPending && (
            <div className="rounded-2xl bg-yellow-100 px-5 py-3 text-sm font-semibold text-yellow-700 border border-yellow-200">
              ⏳ Demande d'annulation envoyée — en attente de l'organisateur
            </div>
          )}

          {applicationStatus !== "rejected" && !withdrawalPending && (
            <button
              onClick={handleCancel}
              disabled={loading}
              className="h-14 w-full rounded-2xl border border-red-200 bg-red-100 text-sm font-bold text-red-700 transition hover:bg-red-200 disabled:opacity-60"
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
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center bg-black/50">
          <div className="w-full max-w-lg rounded-[28px] border border-zinc-200 bg-white p-6 shadow-xl space-y-5">
            <div>
              <h3 className="text-xl font-black text-zinc-900">Demander l'annulation</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Votre participation reste active jusqu'à confirmation de l'organisateur.
              </p>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                Raison de l'annulation <span className="text-red-500">*</span>
              </label>
              <textarea
                value={withdrawReason}
                onChange={(e) => setWithdrawReason(e.target.value)}
                placeholder="Expliquez pourquoi vous ne pouvez plus participer..."
                rows={4}
                className="mt-2 w-full resize-none rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-[#FF5A1F]"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowWithdrawModal(false); setWithdrawReason(""); }}
                className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-zinc-300 bg-zinc-50 text-sm font-bold text-zinc-700 transition hover:bg-zinc-100"
              >
                Retour
              </button>
              <button
                onClick={sendWithdrawRequest}
                disabled={!withdrawReason.trim() || withdrawLoading}
                className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-[#FF5A1F] text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
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
