"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Confirmation en cours...");
  const [error, setError] = useState(false);

  useEffect(() => {
    async function handle() {
      // PKCE flow: code dans l'URL
      const code = searchParams.get("code");
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setMessage("Lien invalide ou expiré. Veuillez refaire la demande.");
          setError(true);
          return;
        }
      }

      // Hash fragment flow ou après PKCE : écouter le changement de session
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if ((event === "USER_UPDATED" || event === "SIGNED_IN") && session) {
          subscription.unsubscribe();

          // Mettre à jour profiles.email avec le nouvel email confirmé
          await supabase
            .from("profiles")
            .update({ email: session.user.email })
            .eq("id", session.user.id);

          setMessage("Adresse email confirmée ! Redirection...");

          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();

          setTimeout(() => {
            if (profile?.role === "organizer") router.push("/organizer/settings");
            else router.push("/dashboard/settings");
          }, 1500);
        }
      });

      // Vérifier si session déjà active (hash fragment traité automatiquement)
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        subscription.unsubscribe();

        await supabase
          .from("profiles")
          .update({ email: session.user.email })
          .eq("id", session.user.id);

        setMessage("Adresse email confirmée ! Redirection...");

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        setTimeout(() => {
          if (profile?.role === "organizer") router.push("/organizer/settings");
          else router.push("/dashboard/settings");
        }, 1500);

        return;
      }
    }

    handle();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="text-center">
        {!error && (
          <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[#FF5A1F]" />
        )}
        <p className={`text-lg font-semibold ${error ? "text-red-400" : "text-zinc-300"}`}>
          {message}
        </p>
        {error && (
          <button
            onClick={() => router.push("/")}
            className="mt-6 rounded-2xl bg-[#FF5A1F] px-6 py-3 font-bold"
          >
            Retour à l&apos;accueil
          </button>
        )}
      </div>
    </main>
  );
}
