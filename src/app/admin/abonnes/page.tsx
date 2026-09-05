"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Download, Mail } from "lucide-react";

type Sub = { id: string; email: string; source: string | null; created_at: string };

export default function AdminAbonnesPage() {
  const [subs, setSubs] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/admin/subscribers", {
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
      });
      const data = await res.json();
      if (res.ok) setSubs(data.subscribers ?? []);
      else setError(data.error || "Erreur de chargement.");
    } catch {
      setError("Connexion impossible.");
    }
    setLoading(false);
  }

  function exportCsv() {
    const header = "email,source,date\n";
    const rows = subs.map((s) => `${s.email},${s.source ?? ""},${new Date(s.created_at).toISOString()}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `abonnes-trackmarshal-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-3xl p-6 lg:p-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#FF5A1F]">Audience</p>
          <h1 className="mt-1 text-2xl font-black text-zinc-900 lg:text-3xl">Abonnés</h1>
          <p className="mt-2 text-zinc-600">Les visiteurs qui ont laissé leur email pour recevoir le guide et les nouveautés.</p>
        </div>
        {subs.length > 0 && (
          <button onClick={exportCsv} className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50">
            <Download size={16} /> Export CSV
          </button>
        )}
      </div>

      <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5A1F]/10">
            <Mail size={22} className="text-[#FF5A1F]" />
          </div>
          <div>
            <p className="text-3xl font-black text-zinc-900">{subs.length}</p>
            <p className="text-sm text-zinc-500">abonné{subs.length > 1 ? "s" : ""} au total</p>
          </div>
        </div>
      </div>

      {error && <p className="mt-4 rounded-xl bg-red-100 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-zinc-500">Chargement…</p>
        ) : subs.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-500">
            Aucun abonné pour l&apos;instant. Le formulaire est en ligne sur la page d&apos;accueil.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-bold">Email</th>
                  <th className="px-4 py-3 font-bold">Source</th>
                  <th className="px-4 py-3 font-bold">Date</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => (
                  <tr key={s.id} className="border-b border-zinc-100 last:border-0">
                    <td className="px-4 py-3 font-medium text-zinc-900">{s.email}</td>
                    <td className="px-4 py-3 text-zinc-500">{s.source ?? "—"}</td>
                    <td className="px-4 py-3 text-zinc-500">{new Date(s.created_at).toLocaleDateString("fr-FR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
