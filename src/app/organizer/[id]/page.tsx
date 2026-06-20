import { supabase } from "@/lib/supabase";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";
import { formatDateRange } from "@/lib/formatDate";
import { CalendarDays, MapPin, Users, Star } from "lucide-react";

type Props = { params: Promise<{ id: string }> };

export default async function OrganizerPublicProfilePage({ params }: Props) {
  const { id } = await params;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("role", "organizer")
    .single();

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 text-zinc-900">
        Organisateur introuvable
      </main>
    );
  }

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", id)
    .order("event_date", { ascending: false })
    .limit(6);

  const { count: totalEvents } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .eq("organizer_id", id);

  const { count: totalApplications } = await supabase
    .from("applications")
    .select("id", { count: "exact", head: true })
    .in("event_id", (events || []).map((e) => e.id));

  // Trust score
  const eventIds = (events || []).map((e: any) => e.id);

  const { count: totalApps } = eventIds.length > 0
    ? await supabase.from("applications").select("id", { count: "exact", head: true }).in("event_id", eventIds)
    : { count: 0 };

  const { count: respondedApps } = eventIds.length > 0
    ? await supabase.from("applications").select("id", { count: "exact", head: true }).in("event_id", eventIds).neq("status", "pending")
    : { count: 0 };

  const { count: eventsWithBriefing } = await supabase
    .from("events").select("id", { count: "exact", head: true })
    .eq("organizer_id", id).not("briefing", "is", null).neq("briefing", "");

  const responseRate = totalApps ? Math.round(((respondedApps || 0) / totalApps) * 100) : null;
  const briefingRate = (totalEvents || 0) > 0 ? Math.round(((eventsWithBriefing || 0) / (totalEvents || 1)) * 100) : null;

  // Fetch marshal reviews for all events of this organizer
  const { data: rawReviews } = eventIds.length > 0
    ? await supabase
        .from("marshal_reviews")
        .select("id, rating, comment, created_at, event_id, marshal_id")
        .in("event_id", eventIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  const reviews = rawReviews || [];

  // Fetch reviewer profiles
  const reviewerIds = [...new Set(reviews.map((r: any) => r.marshal_id))];
  const { data: reviewerProfiles } = reviewerIds.length > 0
    ? await supabase.from("profiles").select("id, full_name, avatar_url").in("id", reviewerIds)
    : { data: [] };
  const profilesById: Record<string, any> = {};
  (reviewerProfiles || []).forEach((p: any) => { profilesById[p.id] = p; });

  // Fetch event titles for reviews
  const eventsById: Record<string, any> = {};
  (events || []).forEach((e: any) => { eventsById[e.id] = e; });

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
    : null;

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicNavbar />

      <section className="relative pt-40 pb-20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[320px_1fr]">

            {/* Sidebar profil */}
            <div>
              <div className="sticky top-32 overflow-hidden rounded-[40px] border border-zinc-200 bg-white shadow-sm">
                <div className="relative h-48 bg-gradient-to-br from-[#FF5A1F]/20 to-transparent">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                    <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-zinc-100">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt={profile.full_name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-4xl font-black text-[#FF5A1F]">
                          {profile.full_name?.charAt(0) || "O"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-8 pb-8 pt-16 text-center">
                  <h1 className="text-3xl font-black text-zinc-900">{profile.full_name}</h1>
                  <p className="mt-2 text-zinc-600">{profile.city}{profile.country ? `, ${profile.country}` : ""}</p>

                  {profile.organizer_verified && (
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
                      ✔ Organisateur vérifié
                    </div>
                  )}

                  {avgRating !== null && (
                    <div className="mt-5 flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={18}
                            className={s <= Math.round(avgRating) ? "fill-[#FF5A1F] text-[#FF5A1F]" : "text-zinc-300"}
                          />
                        ))}
                      </div>
                      <p className="text-sm font-bold text-zinc-700">
                        {avgRating.toFixed(1)} / 5 <span className="font-normal text-zinc-400">({reviews.length} avis)</span>
                      </p>
                    </div>
                  )}

                  <div className="mt-8 grid grid-cols-2 gap-4 text-center">
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <p className="text-3xl font-black text-[#FF5A1F]">{totalEvents || 0}</p>
                      <p className="mt-1 text-xs text-zinc-500">Événements</p>
                    </div>
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <p className="text-3xl font-black text-[#FF5A1F]">{totalApplications || 0}</p>
                      <p className="mt-1 text-xs text-zinc-500">Candidatures</p>
                    </div>
                  </div>

                  {(responseRate !== null || briefingRate !== null) && (
                    <div className="mt-6 space-y-3 text-left">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Fiabilité</p>
                      {responseRate !== null && (
                        <div>
                          <div className="mb-1 flex justify-between text-xs text-zinc-500">
                            <span>Taux de réponse</span>
                            <span className="font-bold text-zinc-700">{responseRate}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-zinc-100">
                            <div className="h-1.5 rounded-full bg-[#FF5A1F] transition-all" style={{ width: `${responseRate}%` }} />
                          </div>
                        </div>
                      )}
                      {briefingRate !== null && (
                        <div>
                          <div className="mb-1 flex justify-between text-xs text-zinc-500">
                            <span>Briefings publiés</span>
                            <span className="font-bold text-zinc-700">{briefingRate}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-zinc-100">
                            <div className="h-1.5 rounded-full bg-[#FF5A1F] transition-all" style={{ width: `${briefingRate}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="mt-6 flex h-12 w-full items-center justify-center rounded-2xl bg-[#FF5A1F] font-bold text-white transition hover:scale-[1.01]"
                    >
                      Contacter
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="space-y-16">

              {/* Événements */}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F]">Organisateur</p>
                <h2 className="mt-3 text-4xl font-black text-zinc-900 lg:text-6xl">Événements publiés</h2>
                <p className="mt-4 text-zinc-600">
                  Retrouvez tous les événements organisés par {profile.full_name}.
                </p>

                <div className="mt-10 grid gap-6 xl:grid-cols-2">
                  {(events || []).length === 0 && (
                    <div className="col-span-2 rounded-[32px] border border-dashed border-zinc-300 p-12 text-center text-zinc-500">
                      Aucun événement publié pour le moment.
                    </div>
                  )}

                  {(events || []).map((event: any) => (
                    <a
                      key={event.id}
                      href={`/events/${event.slug}`}
                      className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm transition hover:border-[#FF5A1F]/30"
                    >
                      <div className="relative h-[200px]">
                        <img
                          src={event.image_url || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <span className="rounded-full bg-[#FF5A1F] px-3 py-1 text-xs font-black uppercase text-white">{event.discipline}</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-black text-zinc-900">{event.title}</h3>
                        <div className="mt-3 space-y-2 text-sm text-zinc-600">
                          <div className="flex items-center gap-2"><CalendarDays size={14} />{formatDateRange(event.event_date, event.event_end_date)}</div>
                          <div className="flex items-center gap-2"><MapPin size={14} />{event.location}{event.country ? `, ${event.country}` : ""}</div>
                          <div className="flex items-center gap-2"><Users size={14} />{event.marshals_needed} commissaires</div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Avis des commissaires */}
              {reviews.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F]">Réputation</p>
                  <h2 className="mt-3 text-4xl font-black text-zinc-900 lg:text-5xl">Avis des commissaires</h2>
                  <p className="mt-4 text-zinc-600">
                    {reviews.length} avis laissés par des commissaires ayant participé aux événements de {profile.full_name}.
                  </p>

                  <div className="mt-8 space-y-4">
                    {reviews.map((review: any) => {
                      const reviewer = profilesById[review.marshal_id];
                      const event = eventsById[review.event_id];
                      return (
                        <div key={review.id} className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 overflow-hidden rounded-full bg-zinc-100 shrink-0">
                                {reviewer?.avatar_url ? (
                                  <img src={reviewer.avatar_url} className="h-full w-full object-cover" alt="" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-sm font-black text-[#FF5A1F]">
                                    {reviewer?.full_name?.charAt(0) || "?"}
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-zinc-900">{reviewer?.full_name || "Commissaire"}</p>
                                {event && (
                                  <p className="text-xs text-zinc-400">{event.title}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  size={14}
                                  className={s <= review.rating ? "fill-[#FF5A1F] text-[#FF5A1F]" : "text-zinc-200"}
                                />
                              ))}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="mt-4 text-sm text-zinc-600 leading-relaxed">{review.comment}</p>
                          )}
                          <p className="mt-3 text-xs text-zinc-400">
                            {new Date(review.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
