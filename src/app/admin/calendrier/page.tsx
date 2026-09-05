"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ParsedEvent = {
  title: string;
  discipline: string | null;
  location: string | null;
  region: string | null;
  start_date: string;
  end_date: string | null;
  official_url: string | null;
  summary: string | null;
  registration_steps: string | null;
};

type SavedEvent = ParsedEvent & { id: string };

export default function AdminCalendrierPage() {
  const [text, setText] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [review, setReview] = useState<ParsedEvent[]>([]);
  const [existing, setExisting] = useState<SavedEvent[]>([]);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<SavedEvent>>({});

  useEffect(() => { loadExisting(); }, []);

  async function loadExisting() {
    const { data } = await supabase.from("calendar_events").select("*").order("start_date", { ascending: true });
    setExisting((data as SavedEvent[]) ?? []);
  }

  async function authHeaders(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
  }

  async function parse() {
    setParsing(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/calendar/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await authHeaders()) },
        body: JSON.stringify({ text, year }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setReview(data.events);
      setMsg({ text: `${data.events.length} épreuve(s) détectée(s) — relis puis enregistre.`, ok: true });
    } catch (e: any) {
      setMsg({ text: e?.message || "Analyse impossible.", ok: false });
    } finally {
      setParsing(false);
    }
  }

  function editRow(i: number, key: keyof ParsedEvent, value: string) {
    setReview((prev) => prev.map((e, idx) => (idx === i ? { ...e, [key]: value || null } : e)));
  }
  function removeRow(i: number) {
    setReview((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/calendar/save", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await authHeaders()) },
        body: JSON.stringify({ events: review }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setReview([]);
      setText("");
      setMsg({ text: `${data.inserted} épreuve(s) ajoutée(s) au calendrier.`, ok: true });
      loadExisting();
    } catch (e: any) {
      setMsg({ text: e?.message || "Enregistrement impossible.", ok: false });
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette épreuve du calendrier ?")) return;
    const res = await fetch("/api/admin/calendar/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await authHeaders()) },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setExisting((prev) => prev.filter((e) => e.id !== id));
  }

  function startEdit(e: SavedEvent) {
    setEditingId(e.id);
    setEditForm({ ...e });
  }
  function setEdit(key: keyof SavedEvent, value: string) {
    setEditForm((f) => ({ ...f, [key]: value }));
  }
  async function saveEdit() {
    if (!editingId) return;
    const res = await fetch("/api/admin/calendar/update", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await authHeaders()) },
      body: JSON.stringify({ id: editingId, fields: editForm }),
    });
    const data = await res.json();
    if (res.ok) {
      setEditingId(null);
      setMsg({ text: "Épreuve mise à jour.", ok: true });
      loadExisting();
    } else {
      setMsg({ text: data.error || "Mise à jour impossible.", ok: false });
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-10">
      <h1 className="text-3xl font-black text-zinc-900">Calendrier — import</h1>
      <p className="mt-2 text-zinc-600">
        Colle un calendrier d&apos;épreuves (texte brut du site FFSA/FFM, PDF, ou tout autre source).
        L&apos;IA le structure, tu valides, c&apos;est publié.
      </p>

      {msg && (
        <p className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${msg.ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {msg.text}
        </p>
      )}

      {/* Zone d'import */}
      <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-5">
        <div className="mb-3 flex items-center gap-3">
          <label className="text-sm font-bold text-zinc-700">Année de référence</label>
          <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="h-9 w-24 rounded-lg border border-zinc-300 px-2 text-sm" />
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="Colle ici le calendrier (une épreuve par ligne, avec date/lieu/discipline si possible)…"
          className="w-full rounded-2xl border border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-900 outline-none focus:border-[#FF5A1F]"
        />
        <button
          onClick={parse}
          disabled={parsing || !text.trim()}
          className="mt-3 rounded-xl bg-[#FF5A1F] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {parsing ? "Analyse en cours…" : "✨ Analyser avec l'IA"}
        </button>
      </div>

      {/* Révision */}
      {review.length > 0 && (
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-black text-zinc-900">À valider ({review.length})</h2>
            <button onClick={save} disabled={saving} className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50">
              {saving ? "Enregistrement…" : `Enregistrer les ${review.length} épreuves`}
            </button>
          </div>
          <div className="space-y-3">
            {review.map((e, i) => (
              <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-4">
                <div className="grid gap-2 sm:grid-cols-2">
                  <input value={e.title} onChange={(ev) => editRow(i, "title", ev.target.value)} placeholder="Titre" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-bold" />
                  <input value={e.discipline ?? ""} onChange={(ev) => editRow(i, "discipline", ev.target.value)} placeholder="Discipline" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
                  <input value={e.start_date} onChange={(ev) => editRow(i, "start_date", ev.target.value)} placeholder="AAAA-MM-JJ" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
                  <input value={e.end_date ?? ""} onChange={(ev) => editRow(i, "end_date", ev.target.value)} placeholder="Fin (AAAA-MM-JJ)" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
                  <input value={e.location ?? ""} onChange={(ev) => editRow(i, "location", ev.target.value)} placeholder="Lieu" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
                  <input value={e.region ?? ""} onChange={(ev) => editRow(i, "region", ev.target.value)} placeholder="Région" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
                  <input value={e.official_url ?? ""} onChange={(ev) => editRow(i, "official_url", ev.target.value)} placeholder="https://site-officiel…" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:col-span-2" />
                  <input value={e.summary ?? ""} onChange={(ev) => editRow(i, "summary", ev.target.value)} placeholder="Résumé (1 phrase)" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:col-span-2" />
                  <textarea value={e.registration_steps ?? ""} onChange={(ev) => editRow(i, "registration_steps", ev.target.value)} placeholder="Démarches d'inscription (optionnel, une étape par ligne)" rows={3} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:col-span-2" />
                </div>
                <button onClick={() => removeRow(i)} className="mt-2 text-xs font-bold text-red-600 hover:underline">Retirer</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existant */}
      <div className="mt-10">
        <h2 className="text-xl font-black text-zinc-900">Épreuves en ligne ({existing.length})</h2>
        <div className="mt-3 space-y-2">
          {existing.length === 0 && <p className="text-sm text-zinc-500">Aucune épreuve pour le moment.</p>}
          {existing.map((e) => (
            <div key={e.id} className="rounded-xl border border-zinc-200 bg-white p-3">
              <div className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-sm font-bold text-zinc-500">{e.start_date}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-bold text-zinc-900">{e.title}</span>
                {e.discipline && <span className="hidden shrink-0 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700 sm:inline">{e.discipline}</span>}
                <button onClick={() => (editingId === e.id ? setEditingId(null) : startEdit(e))} className="shrink-0 text-xs font-bold text-zinc-600 hover:underline">
                  {editingId === e.id ? "Fermer" : "Éditer"}
                </button>
                <button onClick={() => remove(e.id)} className="shrink-0 text-xs font-bold text-red-600 hover:underline">Suppr.</button>
              </div>

              {editingId === e.id && (
                <div className="mt-3 border-t border-zinc-100 pt-3">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input value={editForm.title ?? ""} onChange={(ev) => setEdit("title", ev.target.value)} placeholder="Titre" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-bold" />
                    <input value={editForm.discipline ?? ""} onChange={(ev) => setEdit("discipline", ev.target.value)} placeholder="Discipline" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
                    <input value={editForm.start_date ?? ""} onChange={(ev) => setEdit("start_date", ev.target.value)} placeholder="AAAA-MM-JJ" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
                    <input value={editForm.end_date ?? ""} onChange={(ev) => setEdit("end_date", ev.target.value)} placeholder="Fin (AAAA-MM-JJ)" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
                    <input value={editForm.location ?? ""} onChange={(ev) => setEdit("location", ev.target.value)} placeholder="Lieu" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
                    <input value={editForm.region ?? ""} onChange={(ev) => setEdit("region", ev.target.value)} placeholder="Région" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
                    <input value={editForm.official_url ?? ""} onChange={(ev) => setEdit("official_url", ev.target.value)} placeholder="https://site-officiel…" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:col-span-2" />
                    <input value={editForm.summary ?? ""} onChange={(ev) => setEdit("summary", ev.target.value)} placeholder="Résumé (1 phrase)" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:col-span-2" />
                    <textarea value={editForm.registration_steps ?? ""} onChange={(ev) => setEdit("registration_steps", ev.target.value)} placeholder="Démarches d'inscription (une étape par ligne)" rows={4} className="rounded-lg border border-zinc-300 px-3 py-2 text-sm sm:col-span-2" />
                  </div>
                  <button onClick={saveEdit} className="mt-2 rounded-lg bg-[#FF5A1F] px-4 py-2 text-sm font-bold text-white transition hover:opacity-90">
                    Enregistrer
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
