"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ApplyButtonProps = {
  eventId: string;
};

export default function ApplyButton({
  eventId,
}: ApplyButtonProps) {
  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [alreadyApplied, setAlreadyApplied] =
    useState(false);

  const [profile, setProfile] =
    useState<any>(null);

  useEffect(() => {
    checkApplication();
  }, []);

  async function checkApplication() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: profileData } =
      await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    setProfile(profileData);

    const { data } =
      await supabase
        .from("applications")
        .select("id")
        .eq("event_id", eventId)
        .eq("marshal_id", user.id)
        .maybeSingle();

    if (data) {
      setAlreadyApplied(true);
      setSuccess(true);
    }
  }

  async function handleApply() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Vous devez être connecté.");
      setLoading(false);
      return;
    }

    const { data: profileData } =
      await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (profileData?.role !== "marshal") {
      alert(
        "Seuls les commissaires peuvent postuler."
      );
      setLoading(false);
      return;
    }

    const { data: existing } =
      await supabase
        .from("applications")
        .select("id")
        .eq("event_id", eventId)
        .eq("marshal_id", user.id)
        .maybeSingle();

    if (existing) {
      alert(
        "Vous avez déjà postulé à cet événement."
      );
      setAlreadyApplied(true);
      setSuccess(true);
      setLoading(false);
      return;
    }

    const { error } =
      await supabase
        .from("applications")
        .insert({
          event_id: eventId,
          marshal_id: user.id,
          status: "pending",
        });

    if (error) {
      console.error(error);
      alert(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setAlreadyApplied(true);
    setLoading(false);

    alert(
      "Votre candidature a bien été envoyée."
    );
  }

  if (
    profile &&
    profile.role === "organizer"
  ) {
    return null;
  }

  return (
    <button
      onClick={handleApply}
      disabled={
        loading ||
        success ||
        alreadyApplied
      }
      className={`mt-10 h-16 w-full rounded-2xl text-lg font-bold text-white transition duration-300 ${
        success
          ? "bg-green-600"
          : "bg-[#FF5A1F] hover:scale-[1.02] hover:opacity-90"
      }`}
    >
      {loading
        ? "Envoi..."
        : success
        ? "✓ Candidature envoyée"
        : "Postuler comme commissaire"}
    </button>
  );
}