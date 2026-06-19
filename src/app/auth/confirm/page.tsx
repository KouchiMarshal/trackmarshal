"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthConfirmPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Confirmation en cours...");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function handle() {
      const hash = window.location.hash;

      // Erreur dans le hash (ex: otp_expired)
      if (hash.includes("error=")) {
        const params = new URLSearchParams(hash.replace("#", ""));
        const desc = params.get("error_description") || "Lien invalide ou expiré.";
        setMessage(decodeURIComponent(desc.replace(/\+/g, " ")));
        setIsError(true);
        return;
      }

      // Hash fragment avec access_token (flux implicite Supabase)
      if (hash.includes("access_token")) {
        // Le client Supabase détecte automatiquement le hash et met à jour la session
        // On attend le changement d'état
      }

      // PKCE : code dans les query params
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setMessage("Lien invalide ou expiré. Veuillez refaire la demande.");
          setIsError(true);
          return;
        }
      }

      // Écouter le changement de session déclenché par Supabase
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if ((event === "USER_UPDATED" || event === "SIGNED_IN") && session) {
          subscription.unsubscribe();

          // Synchroniser profiles.email avec le nouvel email confirmé
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

      // Vérifier la session existante (cas où le client a déjà traité le hash)
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
      }
    }

    handle();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 text-zinc-900">
      <div className="text-center px-6">
        {!isError ? (
          <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-2 border-zinc-200 border-t-[#FF5A1F]" />
        ) : (
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-red-200 bg-red-50">
            <span className="text-2xl text-red-500">✕</span>
          </div>
        )}
        <p className={`text-lg font-semibold ${isError ? "text-red-500" : "text-zinc-600"}`}>
          {message}
        </p>
        {isError && (
          <div className="mt-6 space-y-3">
            <p className="text-sm text-zinc-500">Le lien a expiré. Fais une nouvelle demande depuis tes paramètres.</p>
            <button
              onClick={() => router.push("/")}
              className="rounded-2xl bg-[#FF5A1F] px-6 py-3 font-bold transition hover:scale-105"
            >
              Retour à l&apos;accueil
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
