"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

export default function ApplicationsPanel() {

  const [applications, setApplications] =
    useState<any[]>([]);

  const [verifyProfileId, setVerifyProfileId] =
    useState<string | null>(null);

  const [isAdmin, setIsAdmin] =
    useState(false);

  useEffect(() => {

    loadApplications();

    checkAdmin();

  }, []);

  async function checkAdmin() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } =
      await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

    if (data?.is_admin) {

      setIsAdmin(true);

    }
  }

  async function loadApplications() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: events } =
      await supabase
        .from("events")
        .select("*")
        .eq(
          "organizer_id",
          user.id
        );

    if (
      !events ||
      events.length === 0
    ) {
      return;
    }

    const eventIds = events.map(
      (event) => event.id
    );

    const {
      data: applicationsData,
    } = await supabase
      .from("applications")
      .select("*")
      .in("event_id", eventIds)
      .order("created_at", {
        ascending: false,
      });

    if (!applicationsData) return;

    const marshalIds =
      applicationsData.map(
        (application) =>
          application.marshal_id
      );

    const { data: profiles } =
      await supabase
        .from("profiles")
        .select("*")
        .in("id", marshalIds);

    const mergedApplications =
      applicationsData.map(
        (application) => {

          const marshalProfile =
            profiles?.find(
              (profile) =>
                profile.id ===
                application.marshal_id
            );

          const event = events.find(
            (event) =>
              event.id ===
              application.event_id
          );

          return {
            ...application,
            marshalProfile,
            event,
          };
        }
      );

    setApplications(
      mergedApplications
    );
  }

  async function verifyLicense(
    profileId: string
  ) {

    const { error } =
      await supabase
        .from("profiles")
        .update({
          license_verified: true,
        })
        .eq("id", profileId);

    if (error) {

      alert(error.message);

      return;
    }

    loadApplications();

    alert(
      "Licence vérifiée."
    );
  }

  async function updateStatus(
    applicationId: string,
    status: string
  ) {

    const { error } =
      await supabase
        .from("applications")
        .update({
          status,
        })
        .eq("id", applicationId);

    if (error) {

      alert(error.message);

      return;
    }

    loadApplications();
  }

  return (
    <section className="rounded-[40px] border border-white/10 bg-[#0A0A0A] p-10">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm uppercase tracking-[0.3em] text-[#FF5A1F]">

            Candidatures

          </p>

          <h2 className="mt-4 text-5xl font-black">

            Demandes Commissaires

          </h2>

        </div>

      </div>

      <div className="mt-10 space-y-8">

        {applications.length === 0 && (

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-zinc-400">

            Aucune candidature pour le moment.

          </div>

        )}

        {applications.map(
          (application) => (

            <div
              key={application.id}
              className="overflow-hidden rounded-[36px] border border-white/10 bg-white/5 backdrop-blur-xl"
            >

              <div className="grid gap-8 lg:grid-cols-[1fr_320px]">

                <div className="p-8">

                  <div className="flex flex-wrap items-center gap-4">

                    <div className="rounded-full bg-[#FF5A1F]/10 px-5 py-3 text-sm font-bold uppercase tracking-[0.15em] text-[#FF5A1F]">

                      {application.event
                        ?.discipline ||
                        "Motorsport"}

                    </div>

                    <div
                      className={`rounded-full px-5 py-3 text-sm font-bold uppercase tracking-[0.15em] ${
                        application.status ===
                        "accepted"
                          ? "bg-green-500/20 text-green-400"
                          : application.status ===
                            "rejected"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >

                      {application.status ===
                      "accepted"
                        ? "Accepté"
                        : application.status ===
                          "rejected"
                        ? "Refusé"
                        : "En attente"}

                    </div>

                  </div>

                  <div className="mt-6 flex items-center gap-5">

                    <img
                      src={
                        application
                          .marshalProfile
                          ?.avatar_url ||
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop"
                      }
                      alt="Avatar"
                      className="h-20 w-20 rounded-2xl object-cover"
                    />

                    <div>

                      <h3 className="text-4xl font-black">

                        {application
                          .marshalProfile
                          ?.full_name ||
                          "Commissaire"}

                      </h3>

                    </div>

                  </div>

                  {application
                    .marshalProfile
                    ?.license_type && (

                    <div className="mt-8 rounded-3xl border border-[#FF5A1F]/20 bg-[#FF5A1F]/10 p-6">

                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">

                        Licence Motorsport

                      </p>

                      <p className="mt-3 text-2xl font-black text-[#FF5A1F]">

                        🏁 {
                          application
                            .marshalProfile
                            ?.license_type
                        }

                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">

                        {application
                          .marshalProfile
                          ?.license_verified ? (

                          <div className="rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-green-400">

                            ✔ Licence Vérifiée

                          </div>

                        ) : (

                          <div className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-yellow-400">

                            ⏳ Vérification en attente

                          </div>

                        )}

                        {isAdmin &&
                         !application
                          .marshalProfile
                          ?.license_verified && (

                          <button
                            onClick={() =>
                              setVerifyProfileId(
                                application
                                  .marshalProfile.id
                              )
                            }
                            className="rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-green-400 transition hover:bg-green-500/20"
                          >

                            ✔ Vérifier la Licence

                          </button>

                        )}

                      </div>

                      {application
                        .marshalProfile
                        ?.license_file && (

                        <a
                          href={
                            application
                              .marshalProfile
                              ?.license_file
                          }
                          target="_blank"
                          className="mt-5 inline-flex rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:border-[#FF5A1F]/40 hover:bg-[#FF5A1F]/10"
                        >

                          📄 Voir la licence

                        </a>

                      )}

                    </div>

                  )}

                </div>

              </div>

            </div>

          )
        )}

      </div>

      {verifyProfileId && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-6 backdrop-blur-md">

          <div className="w-full max-w-2xl rounded-[40px] border border-white/10 bg-[#0A0A0A] p-10">

            <p className="text-sm uppercase tracking-[0.3em] text-[#FF5A1F]">

              Vérification Licence

            </p>

            <h3 className="mt-4 text-4xl font-black text-white">

              Vérifiez la licence FFSA/FIA

            </h3>

            {applications
              .find(
                (app) =>
                  app.marshalProfile.id ===
                  verifyProfileId
              )
              ?.marshalProfile
              ?.license_file && (

              <div className="mt-8 overflow-hidden rounded-[32px] border border-white/10 bg-black/30">

                <div className="p-6">

                  <img
                    src={
                      applications.find(
                        (app) =>
                          app.marshalProfile.id ===
                          verifyProfileId
                      )?.marshalProfile
                        ?.license_file
                    }
                    alt="Licence"
                    className="max-h-[500px] w-full rounded-2xl object-contain"
                  />

                </div>

              </div>

            )}

            <div className="mt-10 flex gap-4">

              <button
                onClick={() =>
                  setVerifyProfileId(null)
                }
                className="h-14 flex-1 rounded-2xl border border-white/10 bg-white/5 font-bold text-white transition hover:bg-white/10"
              >

                Annuler

              </button>

              <button
                onClick={async () => {

                  await verifyLicense(
                    verifyProfileId
                  );

                  setVerifyProfileId(
                    null
                  );

                }}
                className="h-14 flex-1 rounded-2xl bg-green-600 font-black text-white transition hover:opacity-90"
              >

                ✔ Confirmer la Vérification

              </button>

            </div>

          </div>

        </div>

      )}

    </section>
  );
}