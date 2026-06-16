"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, ExternalLink, Pencil, XCircle } from "lucide-react";
import { Toast, type ToastData } from "@/components/ui/toast";
import { sendEmail } from "@/lib/sendEmail";

const LICENSE_TYPES_FFSA = [
  "ENCOC - Commissaire C",
  "EICOB - Commissaire international B",
  "EICOACPC - Chef de poste",
];

const LICENSE_TYPES_FFM = [
  "FFM - Commissaire de Course",
  "FFM - Commissaire International",
  "FFM - Chef de Poste",
];

export default function AdminLicensesPage() {
  const [commissaires, setCommissaires] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "verified" | "all">("pending");
  const [toast, setToast] = useState<ToastData>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ license_type: "", license_number: "", note: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, email, avatar_url, license_type, license_number, license_url, license_verified, license_type_2, license_number_2, license_url_2, license_verified_2, created_at")
      .eq("role", "marshal")
      .not("license_url", "is", null)
      .order("created_at", { ascending: false });

    setCommissaires(data || []);
    setLoading(false);
  }

  async function validate2(id: string, verified: boolean) {
    await supabase.from("profiles").update({ license_verified_2: verified }).eq("id", id);

    await supabase.from("notifications").insert({
      user_id: id,
      title: verified ? "Votre 2ème licence a été validée ✔" : "Votre 2ème licence n'a pas pu être validée",
      type: verified ? "license_verified" : "license_rejected",
      link: "/dashboard/profile",
    });

    const commissaire = commissaires.find((c) => c.id === id);
    if (commissaire?.email) {
      sendEmail(commissaire.email, verified ? "license_validated" : "license_rejected", {
        licenseType: commissaire.license_type_2,
      });
    }

    setToast({ message: verified ? "2ème licence validée." : "2ème licence rejetée.", type: verified ? "success" : "error" });
    setCommissaires((prev) => prev.map((c) => c.id === id ? { ...c, license_verified_2: verified } : c));
  }

  async function validate(id: string, verified: boolean) {
    await supabase.from("profiles").update({ license_verified: verified }).eq("id", id);

    await supabase.from("notifications").insert({
      user_id: id,
      title: verified
        ? "Votre licence a été validée ✔"
        : "Votre licence n'a pas pu être validée",
      type: verified ? "license_verified" : "license_rejected",
      link: "/dashboard/profile",
    });

    const commissaire = commissaires.find((c) => c.id === id);
    if (commissaire?.email) {
      sendEmail(commissaire.email, verified ? "license_validated" : "license_rejected", {
        licenseType: commissaire.license_type,
      });
    }

    setToast({
      message: verified ? "Licence validée." : "Licence rejetée.",
      type: verified ? "success" : "error",
    });

    setCommissaires((prev) =>
      prev.map((c) => c.id === id ? { ...c, license_verified: verified } : c)
    );
  }

  function startEdit(c: any) {
    setEditingId(c.id);
    setEditForm({ license_type: c.license_type || "", license_number: c.license_number || "", note: "" });
  }

  async function saveEdit(c: any) {
    if (saving) return;
    setSaving(true);

    await supabase
      .from("profiles")
      .update({ license_type: editForm.license_type, license_number: editForm.license_number })
      .eq("id", c.id);

    if (editForm.note.trim()) {
      await supabase.from("notifications").insert({
        user_id: c.id,
        title: `Votre licence a été corrigée par l'admin`,
        body: editForm.note.trim(),
        type: "license_updated",
        link: "/dashboard/profile",
      });

      if (c.email) {
        sendEmail(c.email, "license_updated", {
          note: editForm.note.trim(),
          licenseType: editForm.license_type,
          licenseNumber: editForm.license_number,
        });
      }
    }

    setCommissaires((prev) =>
      prev.map((x) =>
        x.id === c.id
          ? { ...x, license_type: editForm.license_type, license_number: editForm.license_number }
          : x
      )
    );

    setEditingId(null);
    setSaving(false);
    setToast({ message: "Licence mise à jour.", type: "success" });
  }

  const hasPending = (c: any) =>
    !c.license_verified || (c.license_url_2 && !c.license_verified_2);

  const filtered = commissaires.filter((c) => {
    if (filter === "pending") return hasPending(c);
    if (filter === "verified") return c.license_verified && (!c.license_url_2 || c.license_verified_2);
    return true;
  });

  const counts = {
    all: commissaires.length,
    pending: commissaires.filter(hasPending).length,
    verified: commissaires.filter((c) => c.license_verified && (!c.license_url_2 || c.license_verified_2)).length,
  };

  return (
    <div>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
        <div className="flex h-20 items-center justify-between px-6 lg:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Administration</p>
            <h1 className="mt-1 text-2xl font-black lg:text-3xl">Validation des licences</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-5 py-3 text-center">
              <p className="text-xs text-zinc-500">En attente</p>
              <p className="text-2xl font-black text-yellow-400">{counts.pending}</p>
            </div>
            <div className="hidden rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-3 text-center sm:block">
              <p className="text-xs text-zinc-500">Validées</p>
              <p className="text-2xl font-black text-green-400">{counts.verified}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] p-6 pb-24 lg:p-10 lg:pb-10">

        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            {([
              { key: "pending", label: "En attente", count: counts.pending, activeClass: "bg-yellow-600" },
              { key: "verified", label: "Validées", count: counts.verified, activeClass: "bg-green-600" },
              { key: "all", label: "Toutes", count: counts.all, activeClass: "bg-[#FF5A1F]" },
            ] as const).map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-2 rounded-2xl px-5 py-3 font-bold transition ${
                  filter === f.key ? f.activeClass : "bg-white/[0.05] text-zinc-400 hover:text-white"
                }`}
              >
                {f.label}
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{f.count}</span>
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="py-20 text-center text-zinc-500">Chargement...</p>}

        {!loading && filtered.length === 0 && (
          <div className="rounded-[32px] border border-dashed border-white/10 p-16 text-center">
            <CheckCircle2 size={40} className="mx-auto text-green-400" />
            <h2 className="mt-6 text-2xl font-black">
              {filter === "pending" ? "Aucune licence en attente" : "Aucun résultat"}
            </h2>
            <p className="mt-3 text-zinc-500">
              {filter === "pending" ? "Toutes les licences ont été traitées." : ""}
            </p>
          </div>
        )}

        <div className="space-y-5">
          {filtered.map((c) => (
            <div key={c.id} className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
              <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start lg:p-8">

                {/* Identité */}
                <div className="flex items-center gap-4 sm:w-64 sm:shrink-0">
                  <img
                    src={
                      c.avatar_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(c.full_name || "C")}&background=FF5A1F&color=fff&size=80`
                    }
                    alt={c.full_name}
                    className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-black">{c.full_name || "Sans nom"}</p>
                    <p className="truncate text-sm text-zinc-400">{c.email}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Inscrit le {new Date(c.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>

                {/* Infos licence */}
                <div className="flex-1 space-y-3">
                  {editingId === c.id ? (
                    <div className="space-y-3 rounded-2xl border border-[#FF5A1F]/30 bg-[#FF5A1F]/5 p-4">
                      <div>
                        <p className="mb-2 text-xs uppercase tracking-[0.15em] text-zinc-500">Type de licence</p>
                        <select
                          value={editForm.license_type}
                          onChange={(e) => setEditForm((f) => ({ ...f, license_type: e.target.value }))}
                          className="h-12 w-full rounded-xl border border-white/10 bg-black/60 px-4 text-sm text-white outline-none focus:border-[#FF5A1F]"
                        >
                          <option value="">— Sélectionner —</option>
                          <optgroup label="FFSA (Auto)">
                            {LICENSE_TYPES_FFSA.map((t) => <option key={t} value={t}>{t}</option>)}
                          </optgroup>
                          <optgroup label="FFM (Moto)">
                            {LICENSE_TYPES_FFM.map((t) => <option key={t} value={t}>{t}</option>)}
                          </optgroup>
                        </select>
                      </div>
                      <div>
                        <p className="mb-2 text-xs uppercase tracking-[0.15em] text-zinc-500">Numéro de licence</p>
                        <input
                          type="text"
                          value={editForm.license_number}
                          onChange={(e) => setEditForm((f) => ({ ...f, license_number: e.target.value }))}
                          className="h-12 w-full rounded-xl border border-white/10 bg-black/60 px-4 text-sm outline-none focus:border-[#FF5A1F]"
                        />
                      </div>
                      <div>
                        <p className="mb-2 text-xs uppercase tracking-[0.15em] text-zinc-500">Message pour le commissaire</p>
                        <textarea
                          value={editForm.note}
                          onChange={(e) => setEditForm((f) => ({ ...f, note: e.target.value }))}
                          placeholder="Ex : Votre numéro de licence était incorrect, nous l'avons corrigé."
                          rows={3}
                          className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm outline-none focus:border-[#FF5A1F] resize-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(c)}
                          disabled={saving}
                          className="flex h-10 flex-1 items-center justify-center rounded-xl bg-[#FF5A1F] text-sm font-bold transition hover:scale-[1.02] disabled:opacity-50"
                        >
                          {saving ? "Sauvegarde..." : "Sauvegarder"}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex h-10 items-center justify-center rounded-xl border border-white/10 px-4 text-sm text-zinc-400 transition hover:text-white"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                          <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">Type de licence</p>
                          <p className="mt-2 font-bold text-[#FF5A1F]">{c.license_type || "—"}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                          <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">Numéro de licence</p>
                          <p className="mt-2 font-bold">{c.license_number || "—"}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={c.license_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-1 items-center gap-3 rounded-2xl border border-[#FF5A1F]/20 bg-[#FF5A1F]/5 px-5 py-4 font-bold text-[#FF5A1F] transition hover:border-[#FF5A1F]/40 hover:bg-[#FF5A1F]/10"
                        >
                          <ExternalLink size={18} />
                          Ouvrir la licence (PDF ou image)
                        </a>
                        <button
                          onClick={() => startEdit(c)}
                          className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm font-bold text-zinc-400 transition hover:border-white/20 hover:text-white"
                        >
                          <Pencil size={16} />
                          <span className="hidden sm:inline">Modifier</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2ème licence si présente */}
                {c.license_type_2 && (
                  <div className="w-full rounded-2xl border border-white/10 bg-white/[0.02] p-4 lg:w-auto">
                    <p className="mb-2 text-xs uppercase tracking-[0.15em] text-zinc-500">2ème licence</p>
                    <p className="font-bold text-[#FF5A1F]">{c.license_type_2}</p>
                    {c.license_number_2 && <p className="mt-1 text-sm text-zinc-400">N° {c.license_number_2}</p>}
                    {c.license_url_2 && (
                      <a href={c.license_url_2} target="_blank" rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-[#FF5A1F] underline underline-offset-2">
                        <ExternalLink size={14} /> Ouvrir
                      </a>
                    )}
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => validate2(c.id, true)}
                        disabled={c.license_verified_2}
                        className={`flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold transition ${c.license_verified_2 ? "cursor-not-allowed bg-zinc-800 text-zinc-600" : "bg-green-600 hover:scale-105"}`}
                      >
                        <CheckCircle2 size={12} /> Valider
                      </button>
                      <button
                        onClick={() => validate2(c.id, false)}
                        disabled={!c.license_verified_2}
                        className={`flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold transition ${!c.license_verified_2 ? "cursor-not-allowed bg-zinc-800 text-zinc-600" : "bg-red-600 hover:scale-105"}`}
                      >
                        <XCircle size={12} /> Rejeter
                      </button>
                    </div>
                    <span className={`mt-2 inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase ${c.license_verified_2 ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                      {c.license_verified_2 ? "✔ Validée" : "⏳ En attente"}
                    </span>
                  </div>
                )}

                {/* Statut + actions */}
                <div className="flex flex-col items-start gap-3 sm:items-end sm:shrink-0">
                  <span className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] ${
                    c.license_verified
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {c.license_verified ? "✔ Validée" : "⏳ En attente"}
                  </span>

                  <div className="flex gap-3">
                    <button
                      onClick={() => validate(c.id, true)}
                      disabled={c.license_verified}
                      className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition ${
                        c.license_verified
                          ? "cursor-not-allowed bg-zinc-800 text-zinc-600"
                          : "bg-green-600 hover:scale-105"
                      }`}
                    >
                      <CheckCircle2 size={16} />
                      Valider
                    </button>
                    <button
                      onClick={() => validate(c.id, false)}
                      disabled={!c.license_verified}
                      className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition ${
                        !c.license_verified
                          ? "cursor-not-allowed bg-zinc-800 text-zinc-600"
                          : "bg-red-600 hover:scale-105"
                      }`}
                    >
                      <XCircle size={16} />
                      Rejeter
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
