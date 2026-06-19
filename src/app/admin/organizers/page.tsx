"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Building2, CheckCircle2, Clock3, ExternalLink, Search, XCircle } from "lucide-react";
import { Toast, type ToastData } from "@/components/ui/toast";
import { sendEmail } from "@/lib/sendEmail";

export default function AdminOrganizersPage() {
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "verified" | "all">("pending");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<ToastData>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, email, avatar_url, city, country, organizer_verified, created_at, phone, organization_name, organizer_doc_url")
      .eq("role", "organizer")
      .order("created_at", { ascending: false });

    setOrganizers(data || []);
    setLoading(false);
  }

  async function setVerified(id: string, verified: boolean) {
    await supabase.from("profiles").update({ organizer_verified: verified }).eq("id", id);

    await supabase.from("notifications").insert({
      user_id: id,
      title: verified
        ? "Votre compte organisateur a été vérifié ✔"
        : "Votre vérification organisateur a été refusée",
      type: verified ? "organizer_verified" : "organizer_rejected",
      link: "/organizer/dashboard",
    });

    const org = organizers.find((o) => o.id === id);
    if (org?.email) {
      sendEmail(org.email, verified ? "organizer_verified" : "organizer_rejected", {});
    }

    setOrganizers((prev) => prev.map((o) => o.id === id ? { ...o, organizer_verified: verified } : o));
    setToast({ message: verified ? "Organisateur vérifié." : "Vérification refusée.", type: verified ? "success" : "error" });
  }

  const counts = {
    all: organizers.length,
    pending: organizers.filter((o) => !o.organizer_verified).length,
    verified: organizers.filter((o) => o.organizer_verified).length,
  };

  const filtered = organizers.filter((o) => {
    const matchFilter =
      filter === "all" || (filter === "pending" && !o.organizer_verified) || (filter === "verified" && o.organizer_verified);
    const matchSearch =
      !search.trim() ||
      o.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.email?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
        <div className="flex h-20 items-center justify-between px-6 lg:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Administration</p>
            <h1 className="mt-1 text-2xl font-black text-zinc-900 lg:text-3xl">Vérification organisateurs</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-3 text-center">
              <p className="text-xs text-zinc-500">En attente</p>
              <p className="text-2xl font-black text-yellow-600">{counts.pending}</p>
            </div>
            <div className="hidden rounded-2xl border border-green-200 bg-green-50 px-5 py-3 text-center sm:block">
              <p className="text-xs text-zinc-500">Vérifiés</p>
              <p className="text-2xl font-black text-green-600">{counts.verified}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] p-6 pb-24 lg:p-10 lg:pb-10">

        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-zinc-300 bg-zinc-50 px-5 py-3">
          <Search size={18} className="shrink-0 text-zinc-500" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
          />
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {([
            { key: "pending", label: "En attente", count: counts.pending, cls: "bg-yellow-500 text-white" },
            { key: "verified", label: "Vérifiés", count: counts.verified, cls: "bg-green-600 text-white" },
            { key: "all", label: "Tous", count: counts.all, cls: "bg-[#FF5A1F] text-white" },
          ] as const).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-2 rounded-2xl px-5 py-3 font-bold transition ${filter === f.key ? f.cls : "border border-zinc-200 bg-white text-zinc-600 hover:text-zinc-900"}`}
            >
              {f.label}
              <span className={`rounded-full px-2 py-0.5 text-xs ${filter === f.key ? "bg-white/20" : "bg-zinc-100 text-zinc-600"}`}>{f.count}</span>
            </button>
          ))}
        </div>

        {loading && <p className="py-20 text-center text-zinc-500">Chargement...</p>}

        {!loading && filtered.length === 0 && (
          <div className="rounded-[32px] border border-dashed border-zinc-200 bg-white p-16 text-center">
            <Building2 size={40} className="mx-auto text-zinc-400" />
            <h2 className="mt-6 text-2xl font-black text-zinc-900">{filter === "pending" ? "Aucun organisateur en attente" : "Aucun résultat"}</h2>
          </div>
        )}

        <div className="space-y-5">
          {filtered.map((o) => (
            <div key={o.id} className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm">
              <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center lg:p-8">

                <div className="flex items-center gap-4 sm:w-64 sm:shrink-0">
                  <img
                    src={o.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(o.full_name || "O")}&background=FF5A1F&color=fff&size=80`}
                    alt={o.full_name}
                    className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-black text-zinc-900">{o.full_name || "Sans nom"}</p>
                    <p className="truncate text-sm text-zinc-600">{o.email}</p>
                    {o.phone && <p className="text-xs text-zinc-500">{o.phone}</p>}
                    {(o.city || o.country) && <p className="text-xs text-zinc-500">{[o.city, o.country].filter(Boolean).join(", ")}</p>}
                    <p className="mt-1 text-xs text-zinc-400">Inscrit le {new Date(o.created_at).toLocaleDateString("fr-FR")}</p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    {o.organization_name && (
                      <p className="text-sm font-bold text-[#FF5A1F]">🏢 {o.organization_name}</p>
                    )}
                    <span className={`inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] ${
                      o.organizer_verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {o.organizer_verified ? "✔ Vérifié" : "⏳ En attente"}
                    </span>
                    {o.organizer_doc_url && (
                      <div>
                        <a
                          href={o.organizer_doc_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-2 rounded-xl border border-[#FF5A1F]/20 bg-orange-50 px-4 py-2 text-xs font-bold text-[#FF5A1F] transition hover:bg-orange-100"
                        >
                          <ExternalLink size={12} /> Voir justificatif ASA/ASK
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setVerified(o.id, true)}
                      disabled={o.organizer_verified}
                      className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition ${
                        o.organizer_verified ? "cursor-not-allowed bg-zinc-100 text-zinc-400" : "bg-green-600 text-white hover:scale-105"
                      }`}
                    >
                      <CheckCircle2 size={16} /> Vérifier
                    </button>
                    <button
                      onClick={() => setVerified(o.id, false)}
                      disabled={!o.organizer_verified}
                      className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition ${
                        !o.organizer_verified ? "cursor-not-allowed bg-zinc-100 text-zinc-400" : "bg-red-600 text-white hover:scale-105"
                      }`}
                    >
                      <XCircle size={16} /> Révoquer
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
