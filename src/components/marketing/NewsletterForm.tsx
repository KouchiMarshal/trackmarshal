"use client";

import { useState } from "react";
import { Download, Mail } from "lucide-react";

// Capture d'email + livre le guide PDF debutant a l'inscription.
// `source` permet de savoir depuis quelle page l'inscription vient.
export default function NewsletterForm({ source = "home" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, website }),
      });
      const data = await res.json();
      if (res.ok) setState("done");
      else { setError(data.error || "Une erreur est survenue."); setState("error"); }
    } catch {
      setError("Connexion impossible. Réessaie dans un instant.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-lg font-black text-green-800">Merci, c&apos;est noté ! 🎉</p>
        <p className="mt-1 text-sm text-green-700">Voici ton guide du débutant, comme promis :</p>
        <a
          href="/guide-commissaire-debutant.pdf"
          target="_blank"
          rel="noopener"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#FF5A1F] px-6 py-3 font-bold text-white transition hover:opacity-90"
        >
          <Download size={18} /> Télécharger le guide (PDF)
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-xl">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ton@email.fr"
            className="h-14 w-full rounded-2xl border border-zinc-300 bg-white pl-11 pr-4 text-base text-zinc-900 outline-none transition focus:border-[#FF5A1F] focus:ring-2 focus:ring-[#FF5A1F]/20"
          />
        </div>
        {/* Honeypot : invisible pour un humain, souvent rempli par les bots. */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="hidden"
          aria-hidden="true"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="h-14 shrink-0 rounded-2xl bg-[#FF5A1F] px-8 text-base font-black text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {state === "loading" ? "..." : "Recevoir le guide"}
        </button>
      </div>
      {state === "error" && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
      <p className="mt-3 text-xs text-zinc-500">
        Gratuit. Pas de spam — juste les nouveautés du site et quelques conseils. Désinscription à tout moment.
      </p>
    </form>
  );
}
