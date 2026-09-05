"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Item = { id: string; title: string; tip: string | null; url: string | null; position: number | null };

const blank = { title: "", tip: "", url: "", position: "" };

export default function AdminEquipementPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Item>>({});
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("equipment").select("*").order("position").order("created_at");
    setItems((data as Item[]) ?? []);
  }
  async function headers(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession();
    return { "Content-Type": "application/json", ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) };
  }

  async function add() {
    if (form.title.trim().length < 2) { setMsg({ text: "Indique un nom.", ok: false }); return; }
    const res = await fetch("/api/admin/equipment/save", {
      method: "POST", headers: await headers(),
      body: JSON.stringify({ title: form.title, tip: form.tip, url: form.url, position: Number(form.position) || (items.length + 1) * 10 }),
    });
    const data = await res.json();
    if (res.ok) { setForm(blank); setMsg({ text: "Produit ajouté.", ok: true }); load(); }
    else setMsg({ text: data.error || "Erreur.", ok: false });
  }
  async function saveEdit() {
    if (!editingId) return;
    const res = await fetch("/api/admin/equipment/update", { method: "POST", headers: await headers(), body: JSON.stringify({ id: editingId, fields: editForm }) });
    const data = await res.json();
    if (res.ok) { setEditingId(null); setMsg({ text: "Produit mis à jour.", ok: true }); load(); }
    else setMsg({ text: data.error || "Erreur.", ok: false });
  }
  async function remove(id: string) {
    if (!confirm("Supprimer ce produit ?")) return;
    const res = await fetch("/api/admin/equipment/delete", { method: "POST", headers: await headers(), body: JSON.stringify({ id }) });
    if (res.ok) setItems((prev) => prev.filter((i) => i.id !== id));
  }
  async function seed() {
    const res = await fetch("/api/admin/equipment/seed", { method: "POST", headers: await headers() });
    const data = await res.json();
    if (res.ok) { setMsg({ text: `${data.inserted} produits importés.`, ok: true }); load(); }
    else setMsg({ text: data.error || "Erreur.", ok: false });
  }

  const inp = "rounded-lg border border-zinc-300 px-3 py-2 text-sm";

  return (
    <div className="mx-auto max-w-3xl p-6 lg:p-10">
      <h1 className="text-3xl font-black text-zinc-900">Équipement recommandé</h1>
      <p className="mt-2 text-zinc-600">
        Gère les produits affichés sur la page équipement (avec tes liens d&apos;affiliation Amazon).
        Laisse le lien vide pour n&apos;afficher que le conseil, sans bouton.
      </p>

      {msg && <p className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${msg.ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{msg.text}</p>}

      {items.length === 0 && (
        <button onClick={seed} className="mt-5 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50">
          ↧ Importer les produits actuels (liste par défaut)
        </button>
      )}

      {/* Ajouter */}
      <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-5">
        <p className="mb-3 text-sm font-bold text-zinc-700">Ajouter un produit</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Nom (ex. Gants ignifugés)" className={`${inp} sm:col-span-2`} />
          <input value={form.tip} onChange={(e) => setForm((f) => ({ ...f, tip: e.target.value }))} placeholder="Conseil / description" className={`${inp} sm:col-span-2`} />
          <input value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} placeholder="Lien Amazon (https://amzn.to/…)" className={inp} />
          <input value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} placeholder="Ordre (ex. 10, 20…)" className={inp} />
        </div>
        <button onClick={add} className="mt-3 rounded-xl bg-[#FF5A1F] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90">Ajouter</button>
      </div>

      {/* Liste */}
      <div className="mt-8">
        <h2 className="text-xl font-black text-zinc-900">Produits ({items.length})</h2>
        <div className="mt-3 space-y-2">
          {items.length === 0 && <p className="text-sm text-zinc-500">Aucun produit — importe la liste par défaut ci-dessus, ou ajoute-en un.</p>}
          {items.map((it) => (
            <div key={it.id} className="rounded-xl border border-zinc-200 bg-white p-3">
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-zinc-900">{it.title}</p>
                  <p className="truncate text-xs text-zinc-500">{it.url ? "🔗 lien actif" : "— pas de lien"}{it.tip ? ` · ${it.tip}` : ""}</p>
                </div>
                <button onClick={() => (editingId === it.id ? setEditingId(null) : (setEditingId(it.id), setEditForm({ ...it })))} className="shrink-0 text-xs font-bold text-zinc-600 hover:underline">
                  {editingId === it.id ? "Fermer" : "Éditer"}
                </button>
                <button onClick={() => remove(it.id)} className="shrink-0 text-xs font-bold text-red-600 hover:underline">Suppr.</button>
              </div>
              {editingId === it.id && (
                <div className="mt-3 grid gap-2 border-t border-zinc-100 pt-3 sm:grid-cols-2">
                  <input value={editForm.title ?? ""} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))} placeholder="Nom" className={`${inp} sm:col-span-2`} />
                  <input value={editForm.tip ?? ""} onChange={(e) => setEditForm((p) => ({ ...p, tip: e.target.value }))} placeholder="Conseil / description" className={`${inp} sm:col-span-2`} />
                  <input value={editForm.url ?? ""} onChange={(e) => setEditForm((p) => ({ ...p, url: e.target.value }))} placeholder="Lien Amazon" className={inp} />
                  <input value={editForm.position ?? ""} onChange={(e) => setEditForm((p) => ({ ...p, position: Number(e.target.value) }))} placeholder="Ordre" className={inp} />
                  <button onClick={saveEdit} className="rounded-lg bg-[#FF5A1F] px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 sm:col-span-2 sm:w-fit">Enregistrer</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
