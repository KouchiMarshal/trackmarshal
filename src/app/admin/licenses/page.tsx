"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, ExternalLink, Pencil, Save, X, XCircle } from "lucide-react";
import { Toast, type ToastData } from "@/components/ui/toast";

type LicenseRow = {
  id: string;
  user_id: string;
  type: string;
  category: string;
  number: string;
  asa: string;
  url: string;
  verified: boolean;
  created_at: string;
  profiles: {
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
  } | null;
};

type EditForm = { type: string; category: string; number: string; asa: string };

export default function AdminLicensesPage() {
  const [licenses, setLicenses] = useState<LicenseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "verified" | "all">("pending");
  const [toast, setToast] = useState<ToastData>(null);
  const [actingId, setActingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ type: "", category: "auto", number: "", asa: "" });
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase
      .from("licenses")
      .select("*, profiles(full_name, email, avatar_url)")
      .order("created_at", { ascending: false });

    setLicenses((data as LicenseRow[]) || []);
    setLoading(false);
  }

  async function act(licenseId: string, action: "verify" | "reject") {
    setActingId(licenseId);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setActingId(null); return; }

    const res = await fetch("/api/admin/licenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ licenseId, action }),
    });

    const json = await res.json();
    setActingId(null);

    if (!res.ok) {
      setToast({ message: json.error || "Erreur serveur.", type: "error" });
      return;
    }

    if (action === "verify") {
      setLicenses((prev) =>
        prev.map((l) => l.id === licenseId ? { ...l, verified: true } : l)
      );
      setToast({ message: "Licence validée.", type: "success" });
    } else {
      setLicenses((prev) => prev.filter((l) => l.id !== licenseId));
      setToast({ message: "Licence rejetée et supprimée.", type: "error" });
    }
  }

  function startEdit(lic: LicenseRow) {
    setEditingId(lic.id);
    setEditForm({ type: lic.type || "", category: lic.category || "auto", number: lic.number || "", asa: lic.asa || "" });
  }

  async function saveEdit(licenseId: string) {
    setSavingEdit(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setSavingEdit(false); return; }

    const res = await fetch("/api/admin/licenses", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ licenseId, ...editForm }),
    });

    const json = await res.json();
    setSavingEdit(false);

    if (!res.ok) {
      setToast({ message: json.error || "Erreur lors de la modification.", type: "error" });
      return;
    }

    setLicenses((prev) =>
      prev.map((l) => l.id === licenseId ? { ...l, ...editForm } : l)
    );
    setEditingId(null);
    setToast({ message: "Licence modifiée.", type: "success" });
  }

  const withDoc = licenses.filter((l) => !!l.url);
  const filtered = withDoc.filter((l) => {
    if (filter === "pending") return !l.verified;
    if (filter === "verified") return l.verified;
    return true;
  });

  const counts = {
    all: withDoc.length,
    pending: withDoc.filter((l) => !l.verified).length,
    verified: withDoc.filter((l) => l.verified).length,
  };

  return (
    <div>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
        <div className="flex h-20 items-center justify-between px-6 lg:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Administration</p>
            <h1 className="mt-1 text-2xl font-black text-zinc-900 lg:text-3xl">Validation des licences</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-3 text-center">
              <p className="text-xs text-zinc-500">En attente</p>
              <p className="text-2xl font-black text-yellow-600">{counts.pending}</p>
            </div>
            <div className="hidden rounded-2xl border border-green-200 bg-green-50 px-5 py-3 text-center sm:block">
              <p className="text-xs text-zinc-500">Validées</p>
              <p className="text-2xl font-black text-green-600">{counts.verified}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] p-6 pb-24 lg:p-10 lg:pb-10">

        <div className="mb-8 flex flex-wrap gap-3">
          {([
            { key: "pending", label: "En attente", count: counts.pending, cls: "bg-yellow-500 text-white" },
            { key: "verified", label: "Validées", count: counts.verified, cls: "bg-green-600 text-white" },
            { key: "all", label: "Toutes", count: counts.all, cls: "bg-[#FF5A1F] text-white" },
          ] as const).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-2 rounded-2xl px-5 py-3 font-bold transition ${
                filter === f.key ? f.cls : "border border-zinc-200 bg-white text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {f.label}
              <span className={`rounded-full px-2 py-0.5 text-xs ${filter === f.key ? "bg-white/20" : "bg-zinc-100 text-zinc-600"}`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {loading && <p className="py-20 text-center text-zinc-500">Chargement...</p>}

        {!loading && filtered.length === 0 && (
          <div className="rounded-[32px] border border-dashed border-zinc-200 bg-white p-16 text-center">
            <CheckCircle2 size={40} className="mx-auto text-green-500" />
            <h2 className="mt-6 text-2xl font-black text-zinc-900">
              {filter === "pending" ? "Aucune licence en attente" : "Aucun résultat"}
            </h2>
          </div>
        )}

        <div className="space-y-5">
          {filtered.map((lic) => {
            const profile = lic.profiles;
            const isActing = actingId === lic.id;
            const isEditing = editingId === lic.id;
            return (
              <div key={lic.id} className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm">
                <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center lg:p-8">

                  {/* User identity */}
                  <div className="flex items-center gap-4 sm:w-60 sm:shrink-0">
                    <img
                      src={
                        profile?.avatar_url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || "C")}&background=FF5A1F&color=fff&size=80`
                      }
                      alt={profile?.full_name || ""}
                      className="h-14 w-14 shrink-0 rounded-2xl object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-black text-zinc-900">{profile?.full_name || "Sans nom"}</p>
                      <p className="truncate text-sm text-zinc-600">{profile?.email}</p>
                    </div>
                  </div>

                  {/* License info */}
                  <div className="flex flex-1 flex-wrap gap-3">
                    <div className="min-w-[140px] rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">Type</p>
                      <p className="mt-1 font-bold text-[#FF5A1F]">{lic.type || "—"}</p>
                    </div>
                    <div className="min-w-[100px] rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">Fédération</p>
                      <p className="mt-1 font-bold text-zinc-900">{lic.category === "moto" ? "FFM" : "FFSA"}</p>
                    </div>
                    {lic.number && (
                      <div className="min-w-[120px] rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                        <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">N°</p>
                        <p className="mt-1 font-bold text-zinc-900">{lic.number}</p>
                      </div>
                    )}
                    {lic.asa && (
                      <div className="min-w-[120px] rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                        <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">ASA</p>
                        <p className="mt-1 font-bold text-zinc-900">{lic.asa}</p>
                      </div>
                    )}
                    {lic.url && (
                      <a
                        href={lic.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 self-center rounded-2xl border border-[#FF5A1F]/20 bg-orange-50 px-4 py-3 text-sm font-bold text-[#FF5A1F] transition hover:bg-orange-100"
                      >
                        <ExternalLink size={14} /> Voir document
                      </a>
                    )}
                  </div>

                  {/* Status + actions */}
                  <div className="flex shrink-0 flex-col items-end gap-3">
                    <span className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] ${
                      lic.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {lic.verified ? "✔ Validée" : "⏳ En attente"}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => isEditing ? setEditingId(null) : startEdit(lic)}
                        disabled={isActing}
                        className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition ${
                          isActing ? "cursor-not-allowed bg-zinc-100 text-zinc-400" :
                          isEditing ? "border border-zinc-200 bg-zinc-100 text-zinc-700 hover:scale-105" :
                          "border border-zinc-200 bg-white text-zinc-700 hover:scale-105"
                        }`}
                      >
                        {isEditing ? <X size={15} /> : <Pencil size={15} />}
                        {isEditing ? "Annuler" : "Modifier"}
                      </button>
                      <button
                        onClick={() => act(lic.id, "verify")}
                        disabled={lic.verified || isActing || isEditing}
                        className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition ${
                          lic.verified || isActing || isEditing
                            ? "cursor-not-allowed bg-zinc-100 text-zinc-400"
                            : "bg-green-600 text-white hover:scale-105"
                        }`}
                      >
                        <CheckCircle2 size={15} />
                        {isActing ? "..." : "Valider"}
                      </button>
                      <button
                        onClick={() => act(lic.id, "reject")}
                        disabled={isActing || isEditing}
                        className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition ${
                          isActing || isEditing ? "cursor-not-allowed bg-zinc-100 text-zinc-400" : "bg-red-600 text-white hover:scale-105"
                        }`}
                      >
                        <XCircle size={15} />
                        {isActing ? "..." : "Rejeter"}
                      </button>
                    </div>
                  </div>

                </div>

                {/* Inline edit form */}
                {isEditing && (
                  <div className="border-t border-zinc-100 bg-zinc-50 p-6 lg:p-8">
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Modifier la licence</p>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-zinc-600">Fédération</label>
                        <select
                          value={editForm.category}
                          onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                        >
                          <option value="auto">FFSA (Auto)</option>
                          <option value="moto">FFM (Moto)</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-zinc-600">Type de licence</label>
                        <input
                          type="text"
                          value={editForm.type}
                          onChange={(e) => setEditForm((f) => ({ ...f, type: e.target.value }))}
                          placeholder="ex. ENCOC, EICOB…"
                          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-zinc-600">Numéro</label>
                        <input
                          type="text"
                          value={editForm.number}
                          onChange={(e) => setEditForm((f) => ({ ...f, number: e.target.value }))}
                          placeholder="N° de licence"
                          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-zinc-600">ASA</label>
                        <input
                          type="text"
                          value={editForm.asa}
                          onChange={(e) => setEditForm((f) => ({ ...f, asa: e.target.value }))}
                          placeholder="ASA rattachée"
                          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => saveEdit(lic.id)}
                        disabled={savingEdit}
                        className="flex items-center gap-2 rounded-xl bg-[#FF5A1F] px-6 py-2.5 text-sm font-bold text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Save size={15} />
                        {savingEdit ? "Enregistrement…" : "Enregistrer"}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
