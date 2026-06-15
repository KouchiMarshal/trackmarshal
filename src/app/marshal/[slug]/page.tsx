import Image from "next/image";
import type { Metadata } from "next";

import { supabaseAdmin as supabase } from "@/lib/supabase-admin";

import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";
import InviteButton from "@/components/events/invite-button";

type MarshalPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: MarshalPageProps): Promise<Metadata> {
  const { slug } = await params;
  let { data: profile } = await supabase.from("profiles").select("full_name, city, country, disciplines, avatar_url").eq("slug", slug).maybeSingle();
  if (!profile) {
    const { data: byId } = await supabase.from("profiles").select("full_name, city, country, disciplines, avatar_url").eq("id", slug).maybeSingle();
    profile = byId;
  }
  if (!profile) return { title: "Commissaire introuvable" };
  const name = profile.full_name || "Commissaire";
  const location = [profile.city, profile.country].filter(Boolean).join(", ");
  const description = `Profil de ${name}${location ? ` — ${location}` : ""}${profile.disciplines ? ` · ${profile.disciplines}` : ""}. Commissaire de piste FFSA sur TrackMarshal.`;
  return {
    title: name,
    description,
    openGraph: {
      title: `${name} — Commissaire de piste | TrackMarshal`,
      description,
      url: `https://www.trackmarshal.app/marshal/${slug}`,
      images: profile.avatar_url ? [{ url: profile.avatar_url, width: 400, height: 400, alt: name }] : [],
    },
    alternates: { canonical: `/marshal/${slug}` },
  };
}

export default async function MarshalPage({
  params,
}: MarshalPageProps) {

  const { slug } = await params;

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!profile) {
    const { data: byId } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", slug)
      .maybeSingle();
    profile = byId;
  }

  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating, comment, created_at, event_id")
    .eq("marshal_id", profile?.id)
    .order("created_at", { ascending: false });

  const avgRating = reviews && reviews.length > 0
    ? Math.round((reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length) * 10) / 10
    : null;

  if (!profile) {

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">

        Profil introuvable

      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">

      <PublicNavbar />

      <section className="relative overflow-hidden border-b border-white/10 pt-40">

        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-[#FF5A1F]/10 blur-[180px]" />

        <div className="mx-auto max-w-[1600px] px-8 pb-24">

          <div className="grid gap-16 lg:grid-cols-[340px_1fr]">

            <div>

              <div className="overflow-hidden rounded-[40px] border border-white/10 bg-[#0A0A0A]">

                <div className="relative h-[420px]">

                  <Image
                    src={
                      profile.avatar_url ||
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop"
                    }
                    alt={profile.full_name}
                    fill
                    className="object-cover"
                  />

                </div>

                <div className="p-8">

                  <div className="flex items-center gap-3">

                    <div className="h-3 w-3 rounded-full bg-[#FF5A1F]" />

                    <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">

                      Commissaire Motorsport

                    </p>

                  </div>

                  <h1 className="mt-5 text-4xl font-black leading-none">

                    {profile.full_name}

                  </h1>

                  <p className="mt-5 text-lg text-zinc-400">

                    {profile.country || "France"}

                  </p>

                  {profile.license_type && (

                    <div className="mt-6 rounded-3xl border border-[#FF5A1F]/20 bg-[#FF5A1F]/10 p-5">

                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">

                        Licence Motorsport

                      </p>

                      <p className="mt-3 text-xl font-black text-[#FF5A1F]">

                        🏁 {profile.license_type}

                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">

                        {profile.license_verified ? (

                          <div className="rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-green-400">

                            ✔ Licence Vérifiée

                          </div>

                        ) : (

                          <div className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-yellow-400">

                            ⏳ Vérification en attente

                          </div>

                        )}

                      </div>

                      {profile.license_url && (

                        <a
                          href={profile.license_url}
                          target="_blank"
                          className="mt-5 inline-flex rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:border-[#FF5A1F]/40 hover:bg-[#FF5A1F]/10"
                        >

                          📄 Voir la licence

                        </a>

                      )}

                    </div>

                  )}

                  <a
                    href={`/dashboard?message=${profile.id}`}
                    className="mt-6 inline-flex rounded-2xl bg-[#FF5A1F] px-6 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:scale-105"
                  >

                    Contacter

                  </a>

                  <div className="mt-3">
                    <InviteButton marshalId={profile.id} marshalName={profile.full_name} />
                  </div>

                </div>

              </div>

            </div>

            <div>

              <div className="grid gap-6 md:grid-cols-3">

                <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

                  <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">

                    Expérience

                  </p>

                  <h3 className="mt-4 text-5xl font-black text-[#FF5A1F]">

                    {profile.years_experience || "0"}

                  </h3>

                </div>

                {avgRating !== null && (
                  <div className="rounded-[32px] border border-yellow-500/20 bg-yellow-500/5 p-8 backdrop-blur-xl">
                    <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Note moyenne</p>
                    <h3 className="mt-4 text-5xl font-black text-yellow-400">{avgRating}/5</h3>
                    <div className="mt-2 flex gap-1">
                      {[1,2,3,4,5].map((i) => (
                        <span key={i} className={`text-xl ${i <= Math.round(avgRating) ? "text-yellow-400" : "text-zinc-700"}`}>★</span>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-zinc-500">{reviews?.length} évaluation(s)</p>
                  </div>
                )}

                <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

                  <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">

                    Discipline

                  </p>

                  <h3 className="mt-4 text-3xl font-black text-white">

                    Motorsport

                  </h3>

                </div>

                <div className={`rounded-[32px] border p-8 backdrop-blur-xl ${profile.available !== false ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5"}`}>

                  <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">

                    Statut

                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <span className={`h-3 w-3 rounded-full ${profile.available !== false ? "bg-green-400" : "bg-red-400"}`} />
                    <h3 className={`text-2xl font-black ${profile.available !== false ? "text-green-400" : "text-red-400"}`}>
                      {profile.available !== false ? "Disponible" : "Indisponible"}
                    </h3>
                  </div>

                </div>

              </div>

              {profile.badges &&
                profile.badges.length > 0 && (

                <div className="mt-10 rounded-[40px] border border-white/10 bg-[#0A0A0A] p-10">

                  <p className="text-sm uppercase tracking-[0.3em] text-[#FF5A1F]">

                    Badges Motorsport

                  </p>

                  <div className="mt-8 flex flex-wrap gap-4">

                    {profile.badges.map(
                      (badge: string) => (

                        <div
                          key={badge}
                          className="rounded-full border border-[#FF5A1F]/20 bg-[#FF5A1F]/10 px-5 py-3 text-sm font-bold uppercase tracking-[0.15em] text-[#FF5A1F]"
                        >

                          {badge}

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}

              <div className="mt-10 rounded-[40px] border border-white/10 bg-[#0A0A0A] p-10">

                <p className="text-sm uppercase tracking-[0.3em] text-[#FF5A1F]">

                  Biographie

                </p>

                <p className="mt-8 text-xl leading-relaxed text-zinc-300">

                  {profile.bio ||
                    "Aucune biographie disponible."}

                </p>

              </div>

              <div className="mt-10 rounded-[40px] border border-white/10 bg-[#0A0A0A] p-10">

                <p className="text-sm uppercase tracking-[0.3em] text-[#FF5A1F]">

                  Expérience Motorsport

                </p>

                <p className="mt-8 whitespace-pre-line text-xl leading-relaxed text-zinc-300">

                  {profile.experience ||
                    "Aucune expérience renseignée."}

                </p>

              </div>

              <div className="mt-10 rounded-[40px] border border-white/10 bg-[#0A0A0A] p-10">

                <p className="text-sm uppercase tracking-[0.3em] text-[#FF5A1F]">

                  Disciplines

                </p>

                <p className="mt-8 text-xl leading-relaxed text-zinc-300">

                  {profile.disciplines ||
                    "Aucune discipline renseignée."}

                </p>

              </div>

              {reviews && reviews.length > 0 && (
                <div className="mt-10 rounded-[40px] border border-white/10 bg-[#0A0A0A] p-10">
                  <p className="text-sm uppercase tracking-[0.3em] text-[#FF5A1F]">Évaluations organisateurs</p>
                  <div className="mt-6 space-y-5">
                    {reviews.filter((r) => r.comment).map((r, i) => (
                      <div key={i} className="rounded-[24px] border border-white/10 bg-white/[0.02] p-6">
                        <div className="flex items-center gap-2 mb-3">
                          {[1,2,3,4,5].map((s) => (
                            <span key={s} className={`text-lg ${s <= (r.rating || 0) ? "text-yellow-400" : "text-zinc-700"}`}>★</span>
                          ))}
                          <span className="text-xs text-zinc-500 ml-2">
                            {new Date(r.created_at).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                        <p className="text-zinc-300 leading-relaxed">"{r.comment}"</p>
                      </div>
                    ))}
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