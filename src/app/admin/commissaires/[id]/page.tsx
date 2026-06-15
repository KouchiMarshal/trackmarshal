"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft, CheckCircle2, Clock3, ExternalLink,
  Mail, MapPin, Phone, XCircle,
} from "lucide-react";
import { Toast, type ToastData } from "@/components/ui/toast";

export default function AdminCommissaireProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastData>(null);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => { setProfile(data); setLoading(false); });
  }, [id]);

  async function validate(verified: boolean) {
    await supabase.from("profiles").update({ license_verified: verified }).eq("id", id);
    await supabase.from("notifications").insert({
      user_id: id,
      title: verified ? "Votre licence a été validée ✔" : "Votre licence n'a pas pu être validée",
      type: verified ? "license_verified" : "license_rejected",
      link: "/dashboard/profile",
    });
    setProfile((prev: any) => ({ ...prev, license_verified: verified }));
    setToast({ message: verified ? "Licence validée." : "Licence rejetée.", type: verified ? "success" : "error" });
  }

  if (loading) return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <p className="text-zinc-500">Chargement...</p>
    </main>
  );

  if (!profile) return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="text-center">
        <p className="text-2xl font-black">Profil introuvable</p>
        <Link href="/admin/commissaires" className="mt-4 inline-block text-[#FF5A1F] hover:underline">← Retour</Link>
      </div>
    </main>
  );

  return (
    <div>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
        <div className="flex h-20 items-center gap-4 px-6 lg:px-10">
          <Link
            href="/admin/commissaires"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] transition hover:bg-white/10"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Administration</p>
            <h1 className="mt-1 text-xl font-black lg:text-2xl">{profile.full_name || "Commissaire"}</h1>
          </div>
        </div>
      </header>

      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-[#FF5A1F]/10 blur-[140px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-[1200px] p-6 pb-24 lg:p-10">

          <div className="grid gap-8 lg:grid-cols-[320px_1fr]">

            {/* Colonne gauche */}
            <div className="space-y-6">

              <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03]">
                <div className="relative h-[300px]">
                  <img
                    src={profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || "C")}&background=FF5A1F&color=fff&size=320`}
                    alt={profile.full_name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-black">{profile.full_name}</h2>
                  <p className="mt-1 text-sm text-zinc-400">Commissaire Motorsport</p>

                  {(profile.city || profile.country) && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
                      <MapPin size={14} className="text-[#FF5A1F]" />
                      {[profile.city, profile.country].filter(Boolean).join(", ")}
                    </div>
                  )}
                  {profile.email && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
                      <Mail size={14} className="text-[#FF5A1F]" />
                      <a href={`mailto:${profile.email}`} className="hover:text-white">{profile.email}</a>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
                      <Phone size={14} className="text-[#FF5A1F]" />
                      <a href={`tel:${profile.phone}`} className="hover:text-white">{profile.phone}</a>
                    </div>
                  )}
                </div>
              </div>

              {/* Bloc licence + validation */}
              {profile.license_type && (
                <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Licence</p>
                  <p className="mt-3 text-lg font-black text-[#FF5A1F]">🏁 {profile.license_type}</p>
                  {profile.license_number && (
                    <p className="mt-1 text-sm text-zinc-400">N° {profile.license_number}</p>
                  )}

                  <div className="mt-4">
                    {profile.license_verified ? (
                      <div className="flex items-center gap-2 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm font-bold text-green-400">
                        <CheckCircle2 size={16} /> Licence vérifiée
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-sm font-bold text-yellow-400">
                        <Clock3 size={16} /> En attente de validation
                      </div>
                    )}
                  </div>

                  {profile.license_url && (
                    <a
                      href={profile.license_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-bold transition hover:border-[#FF5A1F]/40 hover:text-[#FF5A1F]"
                    >
                      <ExternalLink size={16} />
                      Ouvrir la licence
                    </a>
                  )}

                  {profile.license_url && (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => validate(true)}
                        disabled={profile.license_verified}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold transition ${
                          profile.license_verified ? "cursor-not-allowed bg-zinc-800 text-zinc-600" : "bg-green-600 hover:scale-105"
                        }`}
                      >
                        <CheckCircle2 size={15} /> Valider
                      </button>
                      <button
                        onClick={() => validate(false)}
                        disabled={!profile.license_verified}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold transition ${
                          !profile.license_verified ? "cursor-not-allowed bg-zinc-800 text-zinc-600" : "bg-red-600 hover:scale-105"
                        }`}
                      >
                        <XCircle size={15} /> Rejeter
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Colonne droite */}
            <div className="space-y-6">

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Ancienneté</p>
                  <p className="mt-4 text-4xl font-black text-[#FF5A1F]">{profile.years_experience || "—"}</p>
                  {profile.years_experience && <p className="mt-1 text-xs text-zinc-500">ans</p>}
                </div>
                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Langues</p>
                  <p className="mt-4 text-sm font-bold">{profile.languages || "—"}</p>
                </div>
                <div className="col-span-2 rounded-[28px] border border-white/10 bg-white/[0.03] p-6 sm:col-span-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Disciplines</p>
                  <p className="mt-4 text-sm font-bold">{profile.disciplines || "—"}</p>
                </div>
              </div>

              {profile.bio && (
                <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 lg:p-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Biographie</p>
                  <p className="mt-4 leading-relaxed text-zinc-300">{profile.bio}</p>
                </div>
              )}

              {profile.experience && (
                <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 lg:p-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Expérience Motorsport</p>
                  <p className="mt-4 whitespace-pre-line leading-relaxed text-zinc-300">{profile.experience}</p>
                </div>
              )}

              {profile.specialties && (
                <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 lg:p-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Spécialités</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.specialties.split(",").map((s: string) => s.trim()).filter(Boolean).map((s: string) => (
                      <span key={s} className="rounded-full border border-[#FF5A1F]/20 bg-[#FF5A1F]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-[#FF5A1F]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.badges && profile.badges.length > 0 && (
                <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 lg:p-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Badges</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.badges.map((badge: string) => (
                      <span key={badge} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold">{badge}</span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
