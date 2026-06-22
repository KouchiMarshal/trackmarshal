"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Building2, CheckCircle2, Clock3, Users, FileBadge2 } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ total: 0, pending: 0, verified: 0, noLicense: 0 });
  const [orgStats, setOrgStats] = useState({ total: 0, pending: 0, verified: 0 });
  const [licenseStats, setLicenseStats] = useState<{ type: string; count: number }[]>([]);
  const [asaStats, setAsaStats] = useState<{ asa: string; count: number }[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<{ key: string; label: string; count: number }[]>([]);
  const [disciplineStats, setDisciplineStats] = useState<{ disc: string; count: number }[]>([]);
  const [topOrganizers, setTopOrganizers] = useState<any[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [asaExpanded, setAsaExpanded] = useState(false);

  useEffect(() => {
    async function load() {
      const now = new Date();
      const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1).toISOString();

      const [marshals, licensesRes, organizers, eventsRes, monthlyRes] = await Promise.all([
        supabase.from("profiles").select("id, license_url, license_verified").eq("role", "marshal"),
        supabase.from("licenses").select("user_id, type, asa, url, verified"),
        supabase.from("profiles").select("organizer_verified").eq("role", "organizer"),
        supabase.from("events").select("organizer_id, discipline"),
        supabase.from("profiles").select("created_at").eq("role", "marshal").gte("created_at", twelveMonthsAgo),
      ]);

      // --- Commissaires ---
      const marshalData = marshals.data || [];
      const licensesData = licensesRes.data || [];
      const total = marshalData.length;
      const marshalIdsWithLicense = new Set(licensesData.map((l) => l.user_id));
      // Marshals still on old system only (no entry in new licenses table)
      const oldOnlyMarshals = marshalData.filter((p: any) => !marshalIdsWithLicense.has(p.id) && p.license_url);
      const pending = licensesData.filter((l) => l.url && !l.verified).length
        + oldOnlyMarshals.filter((p: any) => !p.license_verified).length;
      const verified = licensesData.filter((l) => l.verified).length
        + oldOnlyMarshals.filter((p: any) => p.license_verified).length;
      const noLicense = marshalData.filter((p: any) => !marshalIdsWithLicense.has(p.id) && !p.license_url).length;
      setStats({ total, pending, verified, noLicense });

      const ltMap: Record<string, number> = {};
      licensesData.forEach((l) => {
        const t = l.type || "Non renseigné";
        ltMap[t] = (ltMap[t] || 0) + 1;
      });
      setLicenseStats(
        Object.entries(ltMap).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count)
      );

      const asaMap: Record<string, number> = {};
      licensesData.forEach((l) => {
        if (l.asa) { const a = l.asa.trim(); asaMap[a] = (asaMap[a] || 0) + 1; }
      });
      setAsaStats(
        Object.entries(asaMap).map(([asa, count]) => ({ asa, count })).sort((a, b) => b.count - a.count).slice(0, 15)
      );

      // --- Organisateurs ---
      const orgData = organizers.data || [];
      setOrgStats({
        total: orgData.length,
        pending: orgData.filter((o) => !o.organizer_verified).length,
        verified: orgData.filter((o) => o.organizer_verified).length,
      });

      // --- Événements ---
      const eventsData = eventsRes.data || [];
      setTotalEvents(eventsData.length);

      // Discipline breakdown
      const discMap: Record<string, number> = {};
      eventsData.forEach((e) => {
        const d = e.discipline || "Non renseigné";
        discMap[d] = (discMap[d] || 0) + 1;
      });
      setDisciplineStats(
        Object.entries(discMap).map(([disc, count]) => ({ disc, count })).sort((a, b) => b.count - a.count)
      );

      // Top organisateurs par nombre d'événements
      const orgEventMap: Record<string, number> = {};
      eventsData.forEach((e) => {
        if (e.organizer_id) orgEventMap[e.organizer_id] = (orgEventMap[e.organizer_id] || 0) + 1;
      });
      const topOrgIds = Object.entries(orgEventMap).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([id]) => id);
      if (topOrgIds.length > 0) {
        const { data: orgProfiles } = await supabase
          .from("profiles")
          .select("id, full_name, organization_name, avatar_url")
          .in("id", topOrgIds);
        const profileMap: Record<string, any> = {};
        (orgProfiles || []).forEach((p) => { profileMap[p.id] = p; });
        setTopOrganizers(
          Object.entries(orgEventMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([id, count]) => ({ ...profileMap[id], eventCount: count }))
            .filter((o) => o.id)
        );
      }

      // --- Inscriptions par mois (12 derniers mois) ---
      const monthMap: Record<string, number> = {};
      (monthlyRes.data || []).forEach((p) => {
        const d = new Date(p.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        monthMap[key] = (monthMap[key] || 0) + 1;
      });
      const months: { key: string; label: string; count: number }[] = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const label = d.toLocaleDateString("fr-FR", { month: "short" });
        months.push({ key, label, count: monthMap[key] || 0 });
      }
      setMonthlyStats(months);
    }
    load();
  }, []);

  const maxMonthCount = Math.max(...monthlyStats.map((m) => m.count), 1);
  const maxDisciplineCount = Math.max(...disciplineStats.map((d) => d.count), 1);

  return (
    <div>
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
        <div className="flex h-20 items-center px-6 lg:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Administration</p>
            <h1 className="mt-1 text-2xl font-black text-zinc-900 lg:text-3xl">Tableau de bord</h1>
          </div>
        </div>
      </header>

      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-[1400px] p-6 pb-32 lg:p-10 lg:pb-10 space-y-10">

          {/* Compteurs globaux */}
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm p-8">
              <div className="flex items-center gap-3">
                <Users size={20} className="text-zinc-500" />
                <p className="text-sm text-zinc-600">Total commissaires</p>
              </div>
              <p className="mt-6 text-5xl font-black text-zinc-900">{stats.total}</p>
            </div>

            <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-8">
              <div className="flex items-center gap-3">
                <Clock3 size={20} className="text-yellow-600" />
                <p className="text-sm text-yellow-700">En attente de validation</p>
              </div>
              <p className="mt-6 text-5xl font-black text-yellow-600">{stats.pending}</p>
              {stats.pending > 0 && (
                <Link href="/admin/licenses" className="mt-4 inline-block text-xs font-bold text-yellow-600 underline underline-offset-4">
                  Valider maintenant →
                </Link>
              )}
            </div>

            <div className="rounded-3xl border border-green-200 bg-green-50 p-8">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-green-600" />
                <p className="text-sm text-green-700">Licences vérifiées</p>
              </div>
              <p className="mt-6 text-5xl font-black text-green-600">{stats.verified}</p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm p-8">
              <div className="flex items-center gap-3">
                <FileBadge2 size={20} className="text-zinc-500" />
                <p className="text-sm text-zinc-600">Sans licence uploadée</p>
              </div>
              <p className="mt-6 text-5xl font-black text-zinc-500">{stats.noLicense}</p>
            </div>
          </div>

          {/* Liens rapides */}
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            <Link href="/admin/licenses" className="group rounded-3xl border border-yellow-200 bg-yellow-50 p-8 transition hover:border-yellow-300 hover:bg-yellow-100">
              <Clock3 size={32} className="text-yellow-600" />
              <h2 className="mt-6 text-2xl font-black text-zinc-900">Licences à valider</h2>
              <p className="mt-3 text-zinc-600">Vérifiez les licences des commissaires et validez-les après vérification.</p>
              <p className="mt-6 text-sm font-bold text-yellow-600 group-hover:underline">{stats.pending} en attente →</p>
            </Link>

            <Link href="/admin/organizers" className="group rounded-3xl border border-blue-200 bg-blue-50 p-8 transition hover:border-blue-300 hover:bg-blue-100">
              <Building2 size={32} className="text-blue-600" />
              <h2 className="mt-6 text-2xl font-black text-zinc-900">Organisateurs</h2>
              <p className="mt-3 text-zinc-600">Vérifiez les comptes organisateurs (ASA/ASK) avant qu'ils puissent publier des événements.</p>
              <p className="mt-6 text-sm font-bold text-blue-600 group-hover:underline">{orgStats.pending} en attente · {orgStats.total} total →</p>
            </Link>

            <Link href="/admin/commissaires" className="group rounded-3xl border border-zinc-200 bg-white shadow-sm p-8 transition hover:border-zinc-300 hover:bg-zinc-50">
              <Users size={32} className="text-zinc-600" />
              <h2 className="mt-6 text-2xl font-black text-zinc-900">Tous les commissaires</h2>
              <p className="mt-3 text-zinc-600">Consultez la liste complète des commissaires inscrits sur la plateforme.</p>
              <p className="mt-6 text-sm font-bold text-zinc-700 group-hover:underline">{stats.total} commissaires →</p>
            </Link>
          </div>

          {/* Inscriptions par mois */}
          <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm p-6 lg:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Statistiques</p>
                <h2 className="mt-2 text-2xl font-black text-zinc-900">Nouvelles inscriptions</h2>
                <p className="mt-1 text-sm text-zinc-500">Commissaires — 12 derniers mois</p>
              </div>
              <p className="text-4xl font-black text-[#FF5A1F]">
                {monthlyStats.reduce((s, m) => s + m.count, 0)}
                <span className="ml-2 text-sm font-normal text-zinc-500">cette période</span>
              </p>
            </div>

            <div className="flex items-end gap-1.5 sm:gap-2">
              {monthlyStats.map((m) => (
                <div key={m.key} className="group flex flex-1 flex-col items-center gap-1">
                  <span className={`text-[10px] font-black text-[#FF5A1F] transition ${m.count === 0 ? "opacity-0" : ""}`}>
                    {m.count}
                  </span>
                  <div
                    className="w-full rounded-t-lg bg-[#FF5A1F] transition-all group-hover:opacity-80"
                    style={{
                      height: `${Math.max(4, Math.round((m.count / maxMonthCount) * 80))}px`,
                      opacity: m.count === 0 ? 0.15 : 1,
                    }}
                  />
                  <span className="text-[9px] text-zinc-500 sm:text-[10px]">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Licence + ASA */}
          <div className="grid gap-6 lg:grid-cols-2">

            <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm p-6 lg:p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Statistiques</p>
              <h2 className="mt-2 text-2xl font-black text-zinc-900">Répartition par licence</h2>
              <div className="mt-6 space-y-3">
                {licenseStats.length === 0 && <p className="text-sm text-zinc-500">Aucune donnée.</p>}
                {licenseStats.map(({ type, count }) => (
                  <Link
                    key={type}
                    href={`/admin/commissaires?filter=license_type&value=${encodeURIComponent(type)}`}
                    className="group flex items-center gap-3 rounded-2xl p-2 -mx-2 transition hover:bg-zinc-50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold truncate text-zinc-900 group-hover:text-[#FF5A1F] transition">{type}</span>
                        <span className="ml-3 shrink-0 text-sm font-black text-[#FF5A1F]">{count}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-zinc-200">
                        <div className="h-1.5 rounded-full bg-[#FF5A1F]" style={{ width: `${Math.round((count / stats.total) * 100)}%` }} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm p-6 lg:p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Statistiques</p>
              <h2 className="mt-2 text-2xl font-black text-zinc-900">Répartition par ASA</h2>
              {asaStats.length === 0 ? (
                <p className="mt-6 text-sm text-zinc-500">Aucune ASA renseignée pour le moment.</p>
              ) : (
                <div className="mt-6 space-y-3">
                  {(asaExpanded ? asaStats : asaStats.slice(0, 6)).map(({ asa, count }) => (
                    <Link
                      key={asa}
                      href={`/admin/commissaires?filter=asa&value=${encodeURIComponent(asa)}`}
                      className="group flex items-center gap-3 rounded-2xl p-2 -mx-2 transition hover:bg-zinc-50"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold truncate text-zinc-900 group-hover:text-[#FF5A1F] transition">{asa}</span>
                          <span className="ml-3 shrink-0 text-sm font-black text-[#FF5A1F]">{count}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-zinc-200">
                          <div className="h-1.5 rounded-full bg-[#FF5A1F]" style={{ width: `${Math.round((count / stats.total) * 100)}%` }} />
                        </div>
                      </div>
                    </Link>
                  ))}
                  {asaStats.length > 6 && (
                    <button
                      onClick={() => setAsaExpanded((v) => !v)}
                      className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200 py-2.5 text-sm font-bold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900"
                    >
                      {asaExpanded ? "Réduire ↑" : `··· ${asaStats.length - 6} de plus`}
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Discipline + Top organisateurs */}
          <div className="grid gap-6 lg:grid-cols-2">

            {/* Répartition par discipline */}
            <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm p-6 lg:p-8">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Statistiques</p>
                  <h2 className="mt-2 text-2xl font-black text-zinc-900">Répartition par discipline</h2>
                </div>
                <p className="text-3xl font-black text-zinc-500">{totalEvents} <span className="text-sm font-normal text-zinc-500">événements</span></p>
              </div>
              {disciplineStats.length === 0 ? (
                <p className="text-sm text-zinc-500">Aucun événement publié.</p>
              ) : (
                <div className="space-y-3">
                  {disciplineStats.map(({ disc, count }) => (
                    <div key={disc} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold truncate text-zinc-900">{disc}</span>
                          <span className="ml-3 shrink-0 text-sm font-black text-[#FF5A1F]">{count}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-zinc-200">
                          <div className="h-1.5 rounded-full bg-[#FF5A1F]" style={{ width: `${Math.round((count / maxDisciplineCount) * 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top organisateurs */}
            <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm p-6 lg:p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Statistiques</p>
              <h2 className="mt-2 text-2xl font-black text-zinc-900">Top organisateurs</h2>
              <p className="mt-1 mb-6 text-sm text-zinc-500">Par nombre d'événements publiés</p>
              {topOrganizers.length === 0 ? (
                <p className="text-sm text-zinc-500">Aucun événement publié.</p>
              ) : (
                <div className="space-y-3">
                  {topOrganizers.map((org, i) => (
                    <div key={org.id} className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <span className="shrink-0 w-7 text-center text-lg font-black text-zinc-500">
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                      </span>
                      <img
                        src={org.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(org.full_name || org.organization_name || "O")}&background=f4f4f5&color=FF5A1F&size=80`}
                        alt=""
                        className="h-9 w-9 shrink-0 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-black text-zinc-900">{org.organization_name || org.full_name || "Organisateur"}</p>
                        {org.organization_name && org.full_name && (
                          <p className="truncate text-xs text-zinc-500">{org.full_name}</p>
                        )}
                      </div>
                      <span className="shrink-0 rounded-xl border border-[#FF5A1F]/20 bg-orange-50 px-3 py-1.5 text-sm font-black text-[#FF5A1F]">
                        {org.eventCount} event{org.eventCount > 1 ? "s" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
