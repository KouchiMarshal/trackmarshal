"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Building2, CheckCircle2, Megaphone, Send, Users } from "lucide-react";
import { Toast, type ToastData } from "@/components/ui/toast";

export default function AdminBroadcastPage() {
  const [target, setTarget] = useState<"marshal" | "organizer">("marshal");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; total: number } | null>(null);
  const [toast, setToast] = useState<ToastData>(null);

  async function send() {
    if (!subject.trim() || !body.trim()) {
      setToast({ message: "Le sujet et le message sont obligatoires.", type: "error" });
      return;
    }

    setSending(true);
    setResult(null);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setToast({ message: "Session introuvable.", type: "error" });
      setSending(false);
      return;
    }

    const res = await fetch("/api/admin/broadcast-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ role: target, subject: subject.trim(), body: body.trim() }),
    });

    const data = await res.json();

    if (data.ok) {
      setResult({ sent: data.sent, total: data.total });
      setToast({
        message: `${data.sent} email(s) envoyé(s) sur ${data.total} destinataire(s).`,
        type: "success",
      });
      setSubject("");
      setBody("");
    } else {
      setToast({ message: `Erreur : ${data.error || "Inconnue"}`, type: "error" });
    }

    setSending(false);
  }

  const targetLabel = target === "marshal" ? "commissaires" : "organisateurs";

  return (
    <div>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
        <div className="flex h-20 items-center px-6 lg:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Administration</p>
            <h1 className="mt-1 text-2xl font-black lg:text-3xl">Email groupé</h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl p-6 lg:p-10">

        {/* Sélection des destinataires */}
        <div className="mb-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Destinataires</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              onClick={() => setTarget("marshal")}
              className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition ${
                target === "marshal"
                  ? "border-[#FF5A1F] bg-[#FF5A1F]/10"
                  : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
              }`}
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                target === "marshal" ? "bg-[#FF5A1F]/20" : "bg-white/5"
              }`}>
                <Users size={22} className={target === "marshal" ? "text-[#FF5A1F]" : "text-zinc-500"} />
              </div>
              <div>
                <p className="font-black">Commissaires</p>
                <p className="text-xs text-zinc-500">Tous les commissaires inscrits</p>
              </div>
            </button>

            <button
              onClick={() => setTarget("organizer")}
              className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition ${
                target === "organizer"
                  ? "border-[#FF5A1F] bg-[#FF5A1F]/10"
                  : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
              }`}
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                target === "organizer" ? "bg-[#FF5A1F]/20" : "bg-white/5"
              }`}>
                <Building2 size={22} className={target === "organizer" ? "text-[#FF5A1F]" : "text-zinc-500"} />
              </div>
              <div>
                <p className="font-black">Organisateurs</p>
                <p className="text-xs text-zinc-500">Tous les organisateurs inscrits</p>
              </div>
            </button>
          </div>
        </div>

        {/* Sujet */}
        <div className="mb-5">
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
            Sujet de l&apos;email
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={`Annonce importante — TrackMarshal`}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm outline-none placeholder:text-zinc-600 transition focus:border-[#FF5A1F]/40"
          />
        </div>

        {/* Corps */}
        <div className="mb-8">
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
            Corps du message
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={`Bonjour,\n\nVoici un message important pour tous les ${targetLabel}...\n\nCordialement,\nL'équipe TrackMarshal`}
            rows={10}
            className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm outline-none placeholder:text-zinc-600 transition focus:border-[#FF5A1F]/40"
          />
          <p className="mt-2 text-xs text-zinc-600">
            Les sauts de ligne sont conservés. L'email sera envoyé avec le template TrackMarshal.
          </p>
        </div>

        {/* Résultat */}
        {result && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 p-5">
            <CheckCircle2 size={20} className="shrink-0 text-green-400" />
            <p className="font-semibold text-green-400">
              {result.sent} email{result.sent > 1 ? "s" : ""} envoyé{result.sent > 1 ? "s" : ""} sur {result.total} {targetLabel}
            </p>
          </div>
        )}

        {/* Bouton d'envoi */}
        <button
          onClick={send}
          disabled={sending || !subject.trim() || !body.trim()}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#FF5A1F] px-6 py-5 font-black text-white transition hover:scale-[1.02] active:scale-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Megaphone size={20} />
              Envoyer à tous les {targetLabel}
            </>
          )}
        </button>

      </div>
    </div>
  );
}
