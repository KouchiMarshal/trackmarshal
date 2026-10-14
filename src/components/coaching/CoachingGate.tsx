"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Page privée (admin uniquement) : site K-Coaching (coaching sportif à domicile).
// Volontairement SANS le menu/logo TrackMarshal — tout le contenu est ici, dans
// un seul composant facile à exporter plus tard vers le nom de domaine K-Coaching.
//
// ⚙️ À COMPLÉTER : les champs [entre crochets] (ton nom, zone, contact, tarifs).
const BRAND = {
  name: "K-Coaching",
  coach: "Kevin Foussard",
  tagline: "Ensemble, vous irez plus loin",
  zone: "[Ta zone — ex. Rouen & alentours]",
  email: "[ton@email.fr]",
  phone: "[06 00 00 00 00]",
};

const O = "#F18A2B"; // orange K-Coaching

// Formations & certifications (fournies par le coach).
const CERTIFS = [
  "Coach diplômé depuis 2017",
  "TRX Suspension Training (TRX-STC)",
  "Kettlebell — StrongFirst",
  "Pilates Matwork — niveau 1",
  "Nutrition",
];

export default function CoachingGate() {
  const [status, setStatus] = useState<"checking" | "denied" | "allowed">("checking");

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { setStatus("denied"); return; }
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
      setStatus(profile?.role === "admin" ? "allowed" : "denied");
    })();
  }, []);

  if (status !== "allowed") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-100">
        <div className="max-w-md text-center">
          <p className="text-5xl">🔒</p>
          <h1 className="mt-6 text-2xl font-black">Page privée</h1>
          <p className="mt-3 text-zinc-400">Cette page est en préparation et n&apos;est pas accessible publiquement.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      {/* Bandeau privé (admin) — n'apparaîtra pas sur le site final */}
      <div className="px-4 py-2 text-center text-sm font-bold text-white" style={{ backgroundColor: O }}>
        🔒 Brouillon privé (toi seul) — ton futur site K-Coaching. On le transférera sur ton nom de domaine une fois prêt.
      </div>

      {/* En-tête */}
      <header className="sticky top-0 z-20 border-b border-zinc-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/k-coaching-logo.png" alt="K-Coaching" className="h-12 w-auto" />
          <nav className="hidden gap-7 text-sm font-bold text-zinc-600 sm:flex">
            <a href="#offres" className="hover:text-zinc-900">Offres</a>
            <a href="#methode" className="hover:text-zinc-900">Méthode</a>
            <a href="#apropos" className="hover:text-zinc-900">À propos</a>
            <a href="#tarifs" className="hover:text-zinc-900">Tarifs</a>
          </nav>
          <a href="#contact" className="rounded-full px-5 py-2 text-sm font-black text-white transition hover:opacity-90" style={{ backgroundColor: O }}>
            Réserver
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -right-24 -top-10 h-[460px] w-[460px] rounded-full blur-[120px]" style={{ backgroundColor: `${O}22` }} />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <p className="text-sm font-black uppercase tracking-[0.3em]" style={{ color: O }}>Coaching sportif à domicile</p>
          <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.95] tracking-tight text-zinc-900 lg:text-7xl">
            Ensemble,<br />vous irez <span style={{ color: O }}>plus loin</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600">
            Des séances personnalisées, chez vous, adaptées à votre niveau et à vos objectifs —
            remise en forme, perte de poids, renforcement, préparation physique. Sans salle, sans excuse.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href="#contact" className="flex h-14 items-center justify-center rounded-full px-8 text-base font-black text-white transition hover:opacity-90" style={{ backgroundColor: O }}>
              Réserver une séance découverte
            </a>
            <a href="#offres" className="flex h-14 items-center justify-center rounded-full border-2 border-zinc-200 px-8 text-base font-black text-zinc-900 transition hover:border-zinc-300">
              Voir les offres
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-sm font-semibold text-zinc-500">
            <span>📍 {BRAND.zone}</span>
            <span>🏠 À domicile ou en extérieur</span>
            <span>🎯 Programme sur-mesure</span>
          </div>
        </div>
      </section>

      {/* Offres */}
      <section id="offres" className="border-t border-zinc-100 bg-zinc-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-black lg:text-4xl">Mes offres</h2>
          <p className="mt-3 max-w-xl text-zinc-600">Trois formules pour avancer à votre rythme. Chaque programme est adapté après un premier bilan.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { t: "Séance à l'unité", d: "Idéal pour tester ou pour un accompagnement ponctuel. Bilan, séance personnalisée, conseils.", f: ["1 séance à domicile", "Programme adapté", "Suivi des progrès"] },
              { t: "Pack 10 séances", d: "Le plus choisi. Un vrai suivi dans la durée pour installer des résultats concrets.", f: ["10 séances à domicile", "Plan nutrition de base", "Suivi entre les séances"], featured: true },
              { t: "Coaching mensuel", d: "Accompagnement complet et illimité en messagerie, pour une transformation durable.", f: ["Séances hebdomadaires", "Programme + nutrition", "Suivi illimité"] },
            ].map((o) => (
              <div key={o.t} className="rounded-3xl border bg-white p-7 shadow-sm" style={o.featured ? { borderColor: O, boxShadow: `0 0 0 1px ${O}` } : { borderColor: "#e4e4e7" }}>
                {o.featured && <span className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-black text-white" style={{ backgroundColor: O }}>Le plus populaire</span>}
                <h3 className="text-xl font-black">{o.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{o.d}</p>
                <ul className="mt-5 space-y-2 text-sm text-zinc-700">
                  {o.f.map((x) => <li key={x} className="flex items-center gap-2"><span style={{ color: O }}>✓</span> {x}</li>)}
                </ul>
                <a href="#contact" className="mt-7 block rounded-full py-3 text-center text-sm font-bold text-white transition hover:opacity-90" style={{ backgroundColor: o.featured ? O : "#18181b" }}>En savoir plus</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Méthode */}
      <section id="methode" className="border-t border-zinc-100 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-black lg:text-4xl">Comment ça marche</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {[
              { n: "01", t: "Bilan gratuit", d: "On fait le point sur vos objectifs, votre niveau et vos contraintes." },
              { n: "02", t: "Programme sur-mesure", d: "Je conçois un plan adapté à vous, chez vous, avec le matériel dispo." },
              { n: "03", t: "Séances à domicile", d: "On s'entraîne ensemble, en sécurité, avec la bonne technique." },
              { n: "04", t: "Suivi & progrès", d: "On mesure, on ajuste, on garde le cap jusqu'aux résultats." },
            ].map((s) => (
              <div key={s.n}>
                <p className="text-4xl font-black" style={{ color: `${O}66` }}>{s.n}</p>
                <h3 className="mt-3 text-lg font-black">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* À propos */}
      <section id="apropos" className="border-t border-zinc-100 bg-zinc-50 py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
          <div className="aspect-[4/5] overflow-hidden rounded-3xl border border-zinc-200 bg-white">
            <div className="flex h-full items-center justify-center text-sm text-zinc-400">[ Ta photo ici ]</div>
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em]" style={{ color: O }}>À propos</p>
            <h2 className="mt-4 text-3xl font-black lg:text-4xl">Moi, c&apos;est {BRAND.coach}</h2>
            <p className="mt-6 leading-relaxed text-zinc-700">
              Coach sportif <strong>diplômé depuis 2017</strong> et fort d&apos;une expérience en salle de sport,
              je vous accompagne désormais à domicile avec des séances efficaces et motivantes, construites
              autour de vos objectifs — quel que soit votre point de départ.
            </p>
            <p className="mt-4 leading-relaxed text-zinc-500">
              Je me forme en continu pour varier les approches et vous proposer un entraînement complet :
              suspension, kettlebell, renforcement, mobilité et nutrition.
            </p>
            <div className="mt-6">
              <p className="text-xs font-black uppercase tracking-wider text-zinc-400">Formations &amp; certifications</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {CERTIFS.map((c) => (
                  <span key={c} className="rounded-full border px-3 py-1.5 text-xs font-bold" style={{ borderColor: `${O}55`, backgroundColor: `${O}14`, color: "#9a5a14" }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section id="tarifs" className="border-t border-zinc-100 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-black lg:text-4xl">Tarifs</h2>
          <p className="mt-3 text-zinc-600">[À compléter avec vos vrais prix. Exemples ci-dessous.]</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { t: "Séance à l'unité", p: "[__ €]", u: "/ séance" },
              { t: "Pack 10 séances", p: "[__ €]", u: "soit [__ €]/séance" },
              { t: "Coaching mensuel", p: "[__ €]", u: "/ mois" },
            ].map((t) => (
              <div key={t.t} className="rounded-3xl border border-zinc-200 p-7 text-center">
                <p className="text-sm text-zinc-500">{t.t}</p>
                <p className="mt-3 text-4xl font-black" style={{ color: O }}>{t.p}</p>
                <p className="mt-1 text-xs text-zinc-400">{t.u}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-zinc-400">[Pensez à mentionner : crédit d&apos;impôt service à la personne, déplacement inclus, zone couverte…]</p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-zinc-100 py-24" style={{ backgroundColor: "#18181b" }}>
        <div className="mx-auto max-w-2xl px-6 text-center text-white">
          <h2 className="text-3xl font-black lg:text-5xl">Prêt à vous y mettre ?</h2>
          <p className="mt-4 text-lg text-zinc-300">Réservez votre séance découverte — on fait le bilan ensemble, sans engagement.</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href={`mailto:${BRAND.email}`} className="flex h-14 items-center justify-center rounded-full px-8 font-black text-white transition hover:opacity-90" style={{ backgroundColor: O }}>
              ✉️ {BRAND.email}
            </a>
            <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`} className="flex h-14 items-center justify-center rounded-full border border-white/25 px-8 font-black text-white transition hover:bg-white/10">
              📞 {BRAND.phone}
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-zinc-950 py-10 text-center text-sm text-zinc-500">
        <p className="font-black text-zinc-300">{BRAND.name}</p>
        <p className="mt-1" style={{ color: O }}>{BRAND.tagline}</p>
        <p className="mt-3">© {new Date().getFullYear()} {BRAND.name}. Tous droits réservés.</p>
      </footer>
    </main>
  );
}
