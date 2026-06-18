"use client";

import { ArrowLeft, CheckCircle2, Clock3, Mail, MapPin, Phone, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import OrganizerSidebar from "@/components/layout/organizer-sidebar";
import NotificationBell from "@/components/notifications/notification-bell";

export default function CommissaireProfilePage() {
  const params = useParams();
  const marshalId = params?.id as string;
  const [profile, setProfile] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!marshalId) return;
    loadProfile();
  }, [marshalId]);

  async function loadProfile() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", marshalId)
      .single();
    setProfile(data);

    const { data: reviewsData } = await supabase
      .from("reviews")
      .select("*")
      .eq("marshal_id", marshalId)
      .order("created_at", { ascending: false });
    setReviews(reviewsData || []);

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-zinc-400">Chargement...</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="text-2xl font-black">Profil introuvable</p>
          <Link href="/organizer/applications" className="mt-4 inline-block text-[#FF5A1F] hover:underline">
            Retour aux candidatures
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">

        <OrganizerSidebar />

        <div className="flex-1">

          <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
            <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">
              <div className="flex items-center gap-4">
                <Link
                  href="/organizer/applications"
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] transition hover:bg-white/10"
                >
                  <ArrowLeft size={18} />
                </Link>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#FF5A1F]">Dashboard Organisateur</p>
                  <h1 className="mt-1 text-xl font-black lg:text-2xl">{profile.full_name || "Commissaire"}</h1>
                </div>
              </div>
              <NotificationBell />
            </div>
          </header>

          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-[#FF5A1F]/10 blur-[140px] pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-[1200px] p-4 pb-24 sm:p-6 lg:p-10 lg:pb-10">

              <div className="grid gap-8 lg:grid-cols-[320px_1fr]">

                {/* Colonne gauche — photo + infos clés */}
                <div className="space-y-6">

                  <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03]">
                    <div className="relative h-[320px]">
                      <img
                        src={
                          profile.avatar_url ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || "Marshal")}&background=FF5A1F&color=fff&size=320`
                        }
                        alt={profile.full_name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="p-6">
                      <h2 className="text-2xl font-black">{profile.full_name}</h2>
                      <p className="mt-1 text-zinc-400">Commissaire Motorsport</p>

                      {profile.city || profile.country ? (
                        <div className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
                          <MapPin size={14} className="text-[#FF5A1F]" />
                          <span>{[profile.city, profile.country].filter(Boolean).join(", ")}</span>
                        </div>
                      ) : null}

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

                  {/* Licence */}
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
                            <CheckCircle2 size={16} />
                            Licence vérifiée
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-sm font-bold text-yellow-400">
                            <Clock3 size={16} />
                            Vérification en attente
                          </div>
                        )}
                      </div>

                      {profile.license_url && (
                        <a
                          href={profile.license_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-bold transition hover:border-[#FF5A1F]/40 hover:text-[#FF5A1F]"
                        >
                          📄 Voir la licence
                        </a>
                      )}
                    </div>
                  )}

                </div>

                {/* Colonne droite — stats + contenu */}
                <div className="space-y-6">

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Ancienneté</p>
                      <p className="mt-4 text-4xl font-black text-[#FF5A1F]">
                        {profile.years_experience || "—"}
                      </p>
                      {profile.years_experience && (
                        <p className="mt-1 text-xs text-zinc-500">ans</p>
                      )}
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Langues</p>
                      <p className="mt-4 text-sm font-bold text-white">
                        {profile.languages || "Non renseigné"}
                      </p>
                    </div>

                    <div className="col-span-2 rounded-[28px] border border-white/10 bg-white/[0.03] p-6 sm:col-span-1">
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Disciplines</p>
                      <p className="mt-4 text-sm font-bold text-white">
                        {profile.disciplines || "Non renseigné"}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  {profile.bio && (
                    <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 lg:p-8">
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Biographie</p>
                      <p className="mt-4 whitespace-pre-wrap leading-relaxed text-zinc-300">{profile.bio}</p>
                    </div>
                  )}

                  {/* Expérience */}
                  {profile.experience && (
                    <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 lg:p-8">
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Expérience Motorsport</p>
                      <p className="mt-4 whitespace-pre-wrap leading-relaxed text-zinc-300">{profile.experience}</p>
                    </div>
                  )}

                  {/* Spécialités */}
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

                  {/* Badges */}
                  {profile.badges && profile.badges.length > 0 && (
                    <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 lg:p-8">
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Badges</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {profile.badges.map((badge: string) => (
                          <span key={badge} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Avis organisateurs — visible uniquement par les organisateurs */}
                  <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 lg:p-8">
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Avis organisateurs</p>
                      {reviews.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-sm font-black text-[#FF5A1F]">
                            <Star size={14} className="fill-[#FF5A1F]" />
                            {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)}
                          </span>
                          <span className="text-xs text-zinc-500">({reviews.length} avis)</span>
                        </div>
                      )}
                    </div>

                    {reviews.length === 0 ? (
                      <p className="mt-4 text-sm text-zinc-500">Aucun avis pour ce commissaire.</p>
                    ) : (
                      <div className="mt-5 space-y-4">
                        {reviews.map((r) => (
                          <div key={r.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                            <div className="flex items-center gap-1">
                              {[1,2,3,4,5].map((s) => (
                                <Star
                                  key={s}
                                  size={14}
                                  className={s <= r.rating ? "fill-[#FF5A1F] text-[#FF5A1F]" : "text-zinc-700"}
                                />
                              ))}
                              <span className="ml-2 text-xs text-zinc-500">
                                {new Date(r.created_at).toLocaleDateString("fr-FR")}
                              </span>
                            </div>
                            {r.comment && (
                              <p className="mt-2 text-sm leading-relaxed text-zinc-300">{r.comment}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
