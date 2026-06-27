"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import PublicNavbar from "@/components/layout/public-navbar";

export default function CheckinPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventId = searchParams.get("event");
  const date = searchParams.get("date");

  const [status, setStatus] = useState<"loading" | "ready" | "checking" | "success" | "already" | "error" | "auth">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (!eventId || !date) { setStatus("error"); setErrorMsg("Lien invalide."); return; }
    init();
  }, [eventId, date]);

  async function init() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Save destination and redirect to login
      const dest = `/checkin?event=${eventId}&date=${date}`;
      router.push(`/login?redirect=${encodeURIComponent(dest)}`);
      return;
    }

    const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
    setUserName(profile?.full_name || user.email || "");

    const { data: event } = await supabase.from("events").select("title").eq("id", eventId).single();
    setEventTitle(event?.title || "Événement");

    setStatus("ready");
  }

  async function doCheckin() {
    setStatus("checking");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ eventId, date }),
      });
      const json = await res.json();
      if (!res.ok) { setStatus("error"); setErrorMsg(json.error || "Erreur"); return; }
      if (json.alreadyDone) { setStatus("already"); return; }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Erreur réseau.");
    }
  }

  const formattedDate = date
    ? new Date(date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicNavbar />

      <div className="flex min-h-screen items-center justify-center px-4 pt-20">
        <div className="w-full max-w-md">

          {status === "loading" && (
            <div className="text-center text-zinc-400">Chargement...</div>
          )}

          {status === "ready" && (
            <div className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm">
              <div className="border-b border-zinc-200 bg-[#FF5A1F] p-8 text-center">
                <span className="text-5xl">🏁</span>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-white/70">Check-in</p>
                <h1 className="mt-1 text-2xl font-black text-white">{eventTitle}</h1>
              </div>
              <div className="p-8 text-center">
                <p className="text-sm text-zinc-500">Date</p>
                <p className="mt-1 text-lg font-bold capitalize text-zinc-900">{formattedDate}</p>
                <p className="mt-4 text-sm text-zinc-500">Commissaire</p>
                <p className="mt-1 font-bold text-zinc-900">{userName}</p>
                <button
                  onClick={doCheckin}
                  className="mt-8 flex h-14 w-full items-center justify-center rounded-2xl bg-[#FF5A1F] text-base font-black text-white transition hover:scale-[1.02]"
                >
                  Confirmer ma présence
                </button>
                <p className="mt-4 text-xs text-zinc-400">
                  En confirmant, votre présence est enregistrée automatiquement.
                </p>
              </div>
            </div>
          )}

          {status === "checking" && (
            <div className="rounded-[32px] border border-zinc-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-[#FF5A1F]" />
              <p className="mt-6 font-bold text-zinc-600">Enregistrement en cours...</p>
            </div>
          )}

          {status === "success" && (
            <div className="overflow-hidden rounded-[32px] border border-green-200 bg-white shadow-sm">
              <div className="border-b border-green-100 bg-green-500 p-8 text-center">
                <span className="text-5xl">✅</span>
                <h1 className="mt-3 text-2xl font-black text-white">Présence confirmée !</h1>
              </div>
              <div className="p-8 text-center">
                <p className="text-zinc-600">
                  Votre présence au <strong>{eventTitle}</strong> le <strong className="capitalize">{formattedDate}</strong> a bien été enregistrée.
                </p>
                <Link
                  href="/dashboard"
                  className="mt-8 flex h-12 w-full items-center justify-center rounded-2xl bg-zinc-900 text-sm font-black text-white transition hover:bg-zinc-700"
                >
                  Retour au dashboard
                </Link>
              </div>
            </div>
          )}

          {status === "already" && (
            <div className="overflow-hidden rounded-[32px] border border-blue-200 bg-white shadow-sm">
              <div className="border-b border-blue-100 bg-blue-500 p-8 text-center">
                <span className="text-5xl">👍</span>
                <h1 className="mt-3 text-2xl font-black text-white">Déjà enregistré !</h1>
              </div>
              <div className="p-8 text-center">
                <p className="text-zinc-600">Votre présence pour ce jour était déjà enregistrée.</p>
                <Link
                  href="/dashboard"
                  className="mt-8 flex h-12 w-full items-center justify-center rounded-2xl bg-zinc-900 text-sm font-black text-white transition hover:bg-zinc-700"
                >
                  Retour au dashboard
                </Link>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="overflow-hidden rounded-[32px] border border-red-200 bg-white shadow-sm">
              <div className="border-b border-red-100 bg-red-500 p-8 text-center">
                <span className="text-5xl">❌</span>
                <h1 className="mt-3 text-2xl font-black text-white">Erreur</h1>
              </div>
              <div className="p-8 text-center">
                <p className="text-zinc-600">{errorMsg || "Une erreur est survenue."}</p>
                <Link
                  href="/dashboard"
                  className="mt-8 flex h-12 w-full items-center justify-center rounded-2xl bg-zinc-900 text-sm font-black text-white transition hover:bg-zinc-700"
                >
                  Retour au dashboard
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
