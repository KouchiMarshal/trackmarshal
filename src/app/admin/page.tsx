"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Building2, CheckCircle2, Clock3, Users, FileBadge2 } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ total: 0, pending: 0, verified: 0, noLicense: 0 });
  const [orgStats, setOrgStats] = useState({ total: 0, pending: 0, verified: 0 });

  useEffect(() => {
    async function load() {
      const [marshals, organizers] = await Promise.all([
        supabase.from("profiles").select("license_url, license_verified").eq("role", "marshal"),
        supabase.from("profiles").select("organizer_verified").eq("role", "organizer"),
      ]);

      const data = marshals.data || [];
      const total = data.length;
      const pending = data.filter((p) => p.license_url && !p.license_verified).length;
      const verified = data.filter((p) => p.license_verified).length;
      const noLicense = data.filter((p) => !p.license_url).length;
      setStats({ total, pending, verified, noLicense });

      const orgData = organizers.data || [];
      setOrgStats({
        total: orgData.length,
        pending: orgData.filter((o) => !o.organizer_verified).length,
        verified: orgData.filter((o) => o.organizer_verified).length,
      });
    }
    load();
  }, []);

  return (
    <div>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
        <div className="flex h-20 items-center px-6 lg:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Administration</p>
            <h1 className="mt-1 text-2xl font-black lg:text-3xl">Tableau de bord</h1>
          </div>
        </div>
      </header>

      <div className="relative overflow-hidden">
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[#FF5A1F]/10 blur-[140px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-[1400px] p-6 pb-24 lg:p-10 lg:pb-10">

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <div className="flex items-center gap-3">
                <Users size={20} className="text-zinc-400" />
                <p className="text-sm text-zinc-400">Total commissaires</p>
              </div>
              <p className="mt-6 text-5xl font-black">{stats.total}</p>
            </div>

            <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-8">
              <div className="flex items-center gap-3">
                <Clock3 size={20} className="text-yellow-400" />
                <p className="text-sm text-yellow-400">En attente de validation</p>
              </div>
              <p className="mt-6 text-5xl font-black text-yellow-400">{stats.pending}</p>
              {stats.pending > 0 && (
                <Link href="/admin/licenses" className="mt-4 inline-block text-xs font-bold text-yellow-400 underline underline-offset-4">
                  Valider maintenant →
                </Link>
              )}
            </div>

            <div className="rounded-3xl border border-green-500/20 bg-green-500/5 p-8">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-green-400" />
                <p className="text-sm text-green-400">Licences vérifiées</p>
              </div>
              <p className="mt-6 text-5xl font-black text-green-400">{stats.verified}</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <div className="flex items-center gap-3">
                <FileBadge2 size={20} className="text-zinc-400" />
                <p className="text-sm text-zinc-400">Sans licence uploadée</p>
              </div>
              <p className="mt-6 text-5xl font-black text-zinc-400">{stats.noLicense}</p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            <Link href="/admin/licenses" className="group rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-8 transition hover:border-yellow-500/40 hover:bg-yellow-500/10">
              <Clock3 size={32} className="text-yellow-400" />
              <h2 className="mt-6 text-2xl font-black">Licences à valider</h2>
              <p className="mt-3 text-zinc-400">Vérifiez les licences des commissaires et validez-les après vérification.</p>
              <p className="mt-6 text-sm font-bold text-yellow-400 group-hover:underline">{stats.pending} en attente →</p>
            </Link>

            <Link href="/admin/organizers" className="group rounded-3xl border border-blue-500/20 bg-blue-500/5 p-8 transition hover:border-blue-500/40 hover:bg-blue-500/10">
              <Building2 size={32} className="text-blue-400" />
              <h2 className="mt-6 text-2xl font-black">Organisateurs</h2>
              <p className="mt-3 text-zinc-400">Vérifiez les comptes organisateurs (ASA/ASK) avant qu'ils puissent publier des événements.</p>
              <p className="mt-6 text-sm font-bold text-blue-400 group-hover:underline">{orgStats.pending} en attente · {orgStats.total} total →</p>
            </Link>

            <Link href="/admin/commissaires" className="group rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition hover:border-white/20 hover:bg-white/[0.06]">
              <Users size={32} className="text-zinc-300" />
              <h2 className="mt-6 text-2xl font-black">Tous les commissaires</h2>
              <p className="mt-3 text-zinc-400">Consultez la liste complète des commissaires inscrits sur la plateforme.</p>
              <p className="mt-6 text-sm font-bold text-zinc-300 group-hover:underline">{stats.total} commissaires →</p>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
