"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Club = {
  name: string;
  type: string | null;
  category: string | null;
  license_required: string | null;
  region: string | null;
  department: string | null;
  city: string | null;
  description: string | null;
  registration_steps: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
};
type SavedClub = Club & { id: string };
type Suggestion = { id: string; name: string; category: string | null; region: string | null; city: string | null; contact: string | null; message: string | null; created_at: string };

const FIELDS: { key: keyof Club; ph: string }[] = [
  { key: "name", ph: "Nom (circuit, organisateur, club, ASA…)" },
  { key: "type", ph: "Type (Circuit, ASA, Club FFM, Grand Prix…)" },
  { key: "license_required", ph: "Prérequis licence (ex. Internationale B)" },
  { key: "region", ph: "Région / pays" },
  { key: "department", ph: "Département" },
  { key: "city", ph: "Ville" },
  { key: "website", ph: "https://site-inscription…" },
  { key: "email", ph: "Email" },
  { key: "phone", ph: "Téléphone" },
];

const CATS = [
  { v: "", l: "Catégorie…" },
  { v: "club", l: "Club / ASA (débuter)" },
  { v: "circuit", l: "Circuit" },
  { v: "evenement", l: "Événement / Grand Prix" },
];

export default function AdminClubsPage() {
  const [text, setText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [review, setReview] = useState<Club[]>([]);
  const [existing, setExisting] = useState<SavedClub[]>([]);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<SavedClub>>({});
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => { load(); loadSuggestions(); }, []);

  async function load() {
    const { data } = await supabase.from("clubs").select("*").order("region").order("name");
    setExisting((data as SavedClub[]) ?? []);
  }
  async function loadSuggestions() {
    const res = await fetch("/api/admin/clubs/suggestions", { headers: await headers() });
    if (res.ok) { const d = await res.json(); setSuggestions(d.suggestions ?? []); }
  }
  async function deleteSuggestion(id: string) {
    const res = await fetch("/api/admin/clubs/suggestions", { method: "POST", headers: await headers(), body: JSON.stringify({ id }) });
    if (res.ok) setSuggestions((prev) => prev.filter((s) => s.id !== id));
  }
  async function headers(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession();
    return { "Content-Type": "application/json", ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) };
  }

  async function parse() {
    setParsing(true); setMsg(null);
    try {
      const res = await fetch("/api/admin/clubs/parse", { method: "POST", headers: await headers(), body: JSON.stringify({ text }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setReview(data.clubs);
      setMsg({ text: `${data.clubs.length} club(s) détecté(s) — relis puis enregistre.`, ok: true });
    } catch (e: any) { setMsg({ text: e?.message || "Analyse impossible.", ok: false }); }
    finally { setParsing(false); }
  }
  function editRow(i: number, key: keyof Club, v: string) {
    setReview((prev) => prev.map((c, idx) => (idx === i ? { ...c, [key]: v || null } : c)));
  }
  async function save() {
    setSaving(true); setMsg(null);
    try {
      const res = await fetch("/api/admin/clubs/save", { method: "POST", headers: await headers(), body: JSON.stringify({ clubs: review }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setReview([]); setText("");
      setMsg({ text: `${data.inserted} club(s) ajouté(s).`, ok: true });
      load();
    } catch (e: any) { setMsg({ text: e?.message || "Enregistrement impossible.", ok: false }); }
    finally { setSaving(false); }
  }
  async function remove(id: string) {
    if (!confirm("Supprimer ce club ?")) return;
    const res = await fetch("/api/admin/clubs/delete", { method: "POST", headers: await headers(), body: JSON.stringify({ id }) });
    if (res.ok) setExisting((prev) => prev.filter((c) => c.id !== id));
  }
  async function saveEdit() {
    if (!editingId) return;
    const res = await fetch("/api/admin/clubs/update", { method: "POST", headers: await headers(), body: JSON.stringify({ id: editingId, fields: editForm }) });
    const data = await res.json();
    if (res.ok) { setEditingId(null); setMsg({ text: "Club mis à jour.", ok: true }); load(); }
    else setMsg({ text: data.error || "Mise à jour impossible.", ok: false });
  }

  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-10">
      <h1 className="text-3xl font-black text-zinc-900">Annuaire des clubs — import</h1>
      <p className="mt-2 text-zinc-600">
        Colle une liste d&apos;ASA ou de clubs (annuaire FFSA/FFM, page ligue…). L&apos;IA la structure, tu valides, c&apos;est publié.
      </p>

      {msg && <p className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${msg.ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{msg.text}</p>}

      <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-5">
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="Colle ici la liste des clubs / ASA (nom, ville, région, contact si dispo)…" className="w-full rounded-2xl border border-zinc-300 bg-zinc-50 p-4 text-sm outline-none focus:border-[#FF5A1F]" />
        <button onClick={parse} disabled={parsing || !text.trim()} className="mt-3 rounded-xl bg-[#FF5A1F] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50">
          {parsing ? "Analyse en cours…" : "✨ Analyser avec l'IA"}
        </button>
      </div>

      {review.length > 0 && (
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-black text-zinc-900">À valider ({review.length})</h2>
            <button onClick={save} disabled={saving} className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50">
              {saving ? "Enregistrement…" : `Enregistrer les ${review.length} clubs`}
            </button>
          </div>
          <div className="space-y-3">
            {review.map((c, i) => (
              <div key={i} className="grid gap-2 rounded-2xl border border-zinc-200 bg-white p-4 sm:grid-cols-2">
                {FIELDS.map((f) => (
                  <input key={f.key} value={(c[f.key] as string) ?? ""} onChange={(e) => editRow(i, f.key, e.target.value)} placeholder={f.ph} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
                ))}
                <select value={c.category ?? ""} onChange={(e) => editRow(i, "category", e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-bold text-zinc-700 sm:col-span-2">
                  {CATS.map((k) => <option key={k.v} value={k.v}>{k.l}</option>)}
                </select>
                <input value={c.description ?? ""} onChange={(e) => editRow(i, "description", e.target.value)} placeholder="Courte description" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:col-span-2" />
                <textarea value={c.registration_steps ?? ""} onChange={(e) => editRow(i, "registration_steps", e.target.value)} placeholder="Démarches d'inscription (étapes, emails, liens…)" rows={3} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:col-span-2" />
              </div>
            ))}
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-black text-zinc-900">💡 Suggestions reçues ({suggestions.length})</h2>
          <p className="mt-1 text-sm text-zinc-500">Propositions des visiteurs — vérifie puis ajoute-les via l&apos;import ci-dessus.</p>
          <div className="mt-3 space-y-2">
            {suggestions.map((s) => (
              <div key={s.id} className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-zinc-900">{s.name}{s.category ? ` · ${s.category}` : ""}</p>
                    <p className="text-xs text-zinc-600">{[s.city, s.region].filter(Boolean).join(", ")}</p>
                    {s.contact && <p className="mt-1 text-xs text-zinc-700">Contact : {s.contact}</p>}
                    {s.message && <p className="mt-1 text-xs text-zinc-600">{s.message}</p>}
                  </div>
                  <button onClick={() => deleteSuggestion(s.id)} className="shrink-0 text-xs font-bold text-red-600 hover:underline">Traité</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-xl font-black text-zinc-900">Clubs en ligne ({existing.length})</h2>
        <div className="mt-3 space-y-2">
          {existing.length === 0 && <p className="text-sm text-zinc-500">Aucun club pour le moment.</p>}
          {existing.map((c) => (
            <div key={c.id} className="rounded-xl border border-zinc-200 bg-white p-3">
              <div className="flex items-center gap-3">
                <span className="min-w-0 flex-1 truncate text-sm font-bold text-zinc-900">{c.name}</span>
                <span className="hidden shrink-0 text-xs text-zinc-500 sm:inline">{[c.city, c.region].filter(Boolean).join(", ")}</span>
                <button onClick={() => (editingId === c.id ? setEditingId(null) : (setEditingId(c.id), setEditForm({ ...c })))} className="shrink-0 text-xs font-bold text-zinc-600 hover:underline">
                  {editingId === c.id ? "Fermer" : "Éditer"}
                </button>
                <button onClick={() => remove(c.id)} className="shrink-0 text-xs font-bold text-red-600 hover:underline">Suppr.</button>
              </div>
              {editingId === c.id && (
                <div className="mt-3 border-t border-zinc-100 pt-3">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {FIELDS.map((f) => (
                      <input key={f.key} value={(editForm[f.key] as string) ?? ""} onChange={(e) => setEditForm((prev) => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.ph} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
                    ))}
                    <select value={editForm.category ?? ""} onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-bold text-zinc-700 sm:col-span-2">
                      {CATS.map((k) => <option key={k.v} value={k.v}>{k.l}</option>)}
                    </select>
                    <input value={editForm.description ?? ""} onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Courte description" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:col-span-2" />
                    <textarea value={editForm.registration_steps ?? ""} onChange={(e) => setEditForm((prev) => ({ ...prev, registration_steps: e.target.value }))} placeholder="Démarches d'inscription" rows={4} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:col-span-2" />
                  </div>
                  <button onClick={saveEdit} className="mt-2 rounded-lg bg-[#FF5A1F] px-4 py-2 text-sm font-bold text-white transition hover:opacity-90">Enregistrer</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
