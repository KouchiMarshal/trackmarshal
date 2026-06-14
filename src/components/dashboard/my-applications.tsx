"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

export default function MyApplications() {

  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("applications")
      .select(`
        *,
        events (
          title,
          location,
          event_date,
          discipline
        )
      `)
      .eq("marshal_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (data) {
      setApplications(data);
    }
  }

  return (
    <section className="rounded-[40px] border border-white/10 bg-[#0A0A0A] p-10">

      <div>

        <p className="text-sm uppercase tracking-[0.3em] text-[#FF5A1F]">

          Candidatures

        </p>

        <h2 className="mt-4 text-5xl font-black">

          Mes Demandes

        </h2>

        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400">

          Suivez l’état de vos candidatures et consultez
          les événements auxquels vous avez postulé.

        </p>

      </div>

      <div className="mt-10 space-y-6">

        {applications.length === 0 && (

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-zinc-400">

            Vous n’avez encore postulé à aucun événement.

          </div>

        )}

        {applications.map((application) => (

          <div
            key={application.id}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
          >

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <div className="flex flex-wrap items-center gap-3">

                  <div className="rounded-full bg-[#FF5A1F]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5A1F]">

                    {application.events?.discipline || "Motorsport"}

                  </div>

                </div>

                <h3 className="mt-5 text-4xl font-black">

                  {application.events?.title}

                </h3>

                <div className="mt-6 flex flex-wrap gap-6 text-zinc-300">

                  <p>
                    📍 {application.events?.location}
                  </p>

                  <p>
                    📅 {application.events?.event_date}
                  </p>

                </div>

              </div>

              <div>

                <div
                  className={`rounded-full px-6 py-4 text-sm font-bold uppercase tracking-[0.15em] ${
                    application.status === "accepted"
                      ? "bg-green-500/20 text-green-400"
                      : application.status === "rejected"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >

                  {application.status === "accepted"
                    ? "Accepté"
                    : application.status === "rejected"
                    ? "Refusé"
                    : "En attente"}

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}