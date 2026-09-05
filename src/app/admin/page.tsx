"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { BarChart3, ExternalLink, Lightbulb, MapPin, Sparkles } from "lucide-react";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ clubs: 0, suggestions: 0 });

  useEffect(() => { load(); }, []);

  async function load() {
    const { count: clubs } = await supabase.from("clubs").select("id", { count: "exact", head: true });

    // Suggestions : via route admin (pas de lecture publique).
    let suggestions = 0;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/admin/clubs/suggestions", {
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
      });
      if (res.ok) { const d = await res.json(); suggestions = (d.suggestions ?? []).length; }
    } catch { /* ignore */ }

    setCounts({ clubs: clubs ?? 0, suggestions });
  }

  const stats = [
    { label: "Clubs, circuits & GP", value: counts.clubs, color: "text-zinc-900", href: "/admin/clubs" },
    { label: "Suggestions à traiter", value: counts.suggestions, color: counts.suggestions > 0 ? "text-amber-600" : "text-zinc-400", href: "/admin/clubs" },
  ];

  const actions = [
    { icon: MapPin, title: "Répertoire « Où s'inscrire »", desc: "Ajoute clubs, ASA, circuits et Grands Prix, avec démarches et contacts.", href: "/admin/clubs", cta: "Gérer le répertoire →" },
    { icon: BarChart3, title: "Statistiques d'audience", desc: "Suis la fréquentation du site (Google Analytics est déjà connecté).", href: "/admin/analytics", cta: "Voir les analytiques →" },
  ];

  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-10">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#FF5A1F]">Administration</p>
      <h1 className="mt-1 text-2xl font-black text-zinc-900 lg:text-3xl">Tableau de bord</h1>
      <p className="mt-2 text-zinc-600">Pilote le contenu du site : répertoire d&apos;inscription et propositions de la communauté.</p>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-[#FF5A1F]/40">
            <p className="text-sm text-zinc-600">{s.label}</p>
            <p className={`mt-4 text-5xl font-black ${s.color}`}>{s.value}</p>
          </Link>
        ))}
      </div>

      {/* Alerte suggestions */}
      {counts.suggestions > 0 && (
        <Link href="/admin/clubs" className="mt-6 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 transition hover:bg-amber-100">
          <Lightbulb size={20} className="text-amber-600" />
          <p className="text-sm font-bold text-amber-800">
            {counts.suggestions} proposition{counts.suggestions > 1 ? "s" : ""} de la communauté à vérifier →
          </p>
        </Link>
      )}

      {/* Actions principales */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {actions.map((a) => (
          <Link key={a.href} href={a.href} className="group rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm transition hover:border-[#FF5A1F]/40">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5A1F]/10">
              <a.icon size={22} className="text-[#FF5A1F]" />
            </div>
            <h2 className="mt-5 text-lg font-black text-zinc-900">{a.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">{a.desc}</p>
            <p className="mt-5 text-sm font-bold text-[#FF5A1F] group-hover:underline">{a.cta}</p>
          </Link>
        ))}
      </div>

      {/* Voir le site */}
      <div className="mt-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Voir côté public</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { label: "Espace pédagogique", href: "/devenir-commissaire" },
            { label: "Où s'inscrire", href: "/devenir-commissaire/clubs" },
            { label: "Commissaire F1", href: "/grands-prix-f1" },
          ].map((l) => (
            <Link key={l.href} href={l.href} target="_blank" className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-bold text-zinc-700 transition hover:border-[#FF5A1F]/40 hover:text-[#FF5A1F]">
              {l.label} <ExternalLink size={13} />
            </Link>
          ))}
        </div>
      </div>

      {/* Outils IA */}
      <div className="mt-10 rounded-3xl border border-zinc-200 bg-gradient-to-br from-orange-50 to-white p-6 lg:p-7">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-[#FF5A1F]" />
          <h2 className="text-lg font-black text-zinc-900">Outils IA actifs</h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          Chatbot pédagogique, quiz adaptatif, génération de bio et import assisté de l&apos;annuaire —
          propulsés par l&apos;IA. Si une fonction répond « indisponible », vérifie que la clé
          <span className="font-mono text-xs"> GEMINI_API_KEY </span> est bien définie sur Vercel.
        </p>
      </div>

      {/* Historique marketplace */}
      <div className="mt-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Espace historique (marketplace)</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { label: "Licences", href: "/admin/licenses" },
            { label: "Commissaires", href: "/admin/commissaires" },
            { label: "Organisateurs", href: "/admin/organizers" },
            { label: "Messages", href: "/admin/messages" },
            { label: "CV Lab", href: "/admin/cv-lab" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-800">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
