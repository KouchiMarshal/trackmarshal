import { supabase } from "@/lib/supabase";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";
import { formatDate } from "@/lib/formatDate";
import { CalendarDays, MapPin, Users } from "lucide-react";

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
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
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

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <PublicNavbar />

      <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-[#FF5A1F]/10 blur-[180px] pointer-events-none" />

      <section className="relative pt-40 pb-20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[320px_1fr]">

            {/* Sidebar profil */}
            <div>
              <div className="sticky top-32 overflow-hidden rounded-[40px] border border-white/10 bg-[#0A0A0A]">
                <div className="relative h-48 bg-gradient-to-br from-[#FF5A1F]/20 to-transparent">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                    <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-[#0A0A0A] bg-zinc-800">
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
                  <h1 className="text-3xl font-black">{profile.full_name}</h1>
                  <p className="mt-2 text-zinc-400">{profile.city}{profile.country ? `, ${profile.country}` : ""}</p>

                  {profile.organizer_verified && (
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-bold text-green-400">
                      ✔ Organisateur vérifié
                    </div>
                  )}

                  <div className="mt-8 grid grid-cols-2 gap-4 text-center">
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                      <p className="text-3xl font-black text-[#FF5A1F]">{totalEvents || 0}</p>
                      <p className="mt-1 text-xs text-zinc-500">Événements</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                      <p className="text-3xl font-black text-[#FF5A1F]">{totalApplications || 0}</p>
                      <p className="mt-1 text-xs text-zinc-500">Candidatures</p>
                    </div>
                  </div>

                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="mt-6 flex h-12 w-full items-center justify-center rounded-2xl bg-[#FF5A1F] font-bold transition hover:scale-[1.01]"
                    >
                      Contacter
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Événements */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F]">Organisateur</p>
              <h2 className="mt-3 text-4xl font-black lg:text-6xl">Événements publiés</h2>
              <p className="mt-4 text-zinc-400">
                Retrouvez tous les événements organisés par {profile.full_name}.
              </p>

              <div className="mt-10 grid gap-6 xl:grid-cols-2">
                {(events || []).length === 0 && (
                  <div className="col-span-2 rounded-[32px] border border-dashed border-white/10 p-12 text-center text-zinc-500">
                    Aucun événement publié pour le moment.
                  </div>
                )}

                {(events || []).map((event) => (
                  <a
                    key={event.id}
                    href={`/events/${event.slug}`}
                    className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] transition hover:border-[#FF5A1F]/30"
                  >
                    <div className="relative h-[200px]">
                      <img
                        src={event.image_url || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="rounded-full bg-[#FF5A1F] px-3 py-1 text-xs font-black uppercase">{event.discipline}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-black">{event.title}</h3>
                      <div className="mt-3 space-y-2 text-sm text-zinc-400">
                        <div className="flex items-center gap-2"><CalendarDays size={14} />{formatDate(event.event_date)}</div>
                        <div className="flex items-center gap-2"><MapPin size={14} />{event.location}{event.country ? `, ${event.country}` : ""}</div>
                        <div className="flex items-center gap-2"><Users size={14} />{event.marshals_needed} commissaires</div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
