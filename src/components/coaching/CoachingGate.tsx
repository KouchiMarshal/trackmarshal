"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Page privée (admin uniquement) : brouillon du futur site de coaching à
// domicile. Volontairement SANS le menu/logo TrackMarshal pour préfigurer le
// site final — tout le contenu est ici, dans un seul composant facile à
// exporter plus tard vers un nom de domaine dédié.
//
// ⚙️ À PERSONNALISER : remplace les champs de BRAND ci-dessous et les tarifs.
const BRAND = {
  name: "[Nom de ta marque]",
  coach: "[Ton nom]",
  tagline: "Coaching sportif à domicile",
  zone: "[Ta zone — ex. Paris & proche banlieue]",
  email: "[ton@email.fr]",
  phone: "[06 00 00 00 00]",
};

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
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Bandeau privé (admin) — n'apparaîtra pas sur le site final */}
      <div className="bg-amber-500 px-4 py-2 text-center text-sm font-bold text-zinc-900">
        🔒 Brouillon privé (toi seul) — ton futur site de coaching. On le transférera sur ton nom de domaine une fois prêt.
      </div>

      {/* En-tête */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <p className="text-xl font-black tracking-tight">{BRAND.name}</p>
          <nav className="hidden gap-7 text-sm font-semibold text-zinc-300 sm:flex">
            <a href="#offres" className="hover:text-white">Offres</a>
            <a href="#methode" className="hover:text-white">Méthode</a>
            <a href="#apropos" className="hover:text-white">À propos</a>
            <a href="#tarifs" className="hover:text-white">Tarifs</a>
          </nav>
          <a href="#contact" className="rounded-full bg-lime-400 px-5 py-2 text-sm font-black text-zinc-900 transition hover:bg-lime-300">
            Réserver
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -right-20 top-0 h-[460px] w-[460px] rounded-full bg-lime-400/10 blur-[120px]" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 lg:py-32">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-lime-400">{BRAND.tagline}</p>
          <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.95] tracking-tight lg:text-7xl">
            Ton coach sportif.<br />Chez toi. <span className="text-lime-400">Résultats réels.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-300">
            Des séances personnalisées à domicile, adaptées à ton niveau et à tes objectifs —
            remise en forme, perte de poids, renforcement, préparation physique. Sans salle, sans excuse.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href="#contact" className="flex h-14 items-center justify-center rounded-full bg-lime-400 px-8 text-base font-black text-zinc-900 transition hover:bg-lime-300">
              Réserver une séance découverte
            </a>
            <a href="#offres" className="flex h-14 items-center justify-center rounded-full border border-white/20 px-8 text-base font-black text-white transition hover:bg-white/5">
              Voir les offres
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-sm text-zinc-400">
            <span>📍 {BRAND.zone}</span>
            <span>🏠 À domicile ou en extérieur</span>
            <span>🎯 Programme sur-mesure</span>
          </div>
        </div>
      </section>

      {/* Offres */}
      <section id="offres" className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-black lg:text-4xl">Mes offres</h2>
          <p className="mt-3 max-w-xl text-zinc-400">Trois formules pour avancer à ton rythme. Chaque programme est adapté après un premier bilan.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { t: "Séance à l'unité", d: "Idéal pour tester ou pour un accompagnement ponctuel. Bilan, séance personnalisée, conseils.", f: ["1 séance à domicile", "Programme adapté", "Suivi des progrès"] },
              { t: "Pack 10 séances", d: "Le plus choisi. Un vrai suivi dans la durée pour installer des résultats concrets.", f: ["10 séances à domicile", "Plan nutrition de base", "Suivi entre les séances"], featured: true },
              { t: "Coaching mensuel", d: "Accompagnement complet et illimité en messagerie, pour une transformation durable.", f: ["Séances hebdomadaires", "Programme + nutrition", "Suivi illimité"] },
            ].map((o) => (
              <div key={o.t} className={`rounded-3xl border p-7 ${o.featured ? "border-lime-400 bg-lime-400/5" : "border-white/10 bg-white/[0.02]"}`}>
                {o.featured && <span className="mb-3 inline-block rounded-full bg-lime-400 px-3 py-1 text-xs font-black text-zinc-900">Le plus populaire</span>}
                <h3 className="text-xl font-black">{o.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{o.d}</p>
                <ul className="mt-5 space-y-2 text-sm text-zinc-300">
                  {o.f.map((x) => <li key={x} className="flex items-center gap-2"><span className="text-lime-400">✓</span> {x}</li>)}
                </ul>
                <a href="#contact" className="mt-7 block rounded-full bg-white/10 py-3 text-center text-sm font-bold transition hover:bg-white/20">En savoir plus</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Méthode */}
      <section id="methode" className="border-t border-white/10 bg-white/[0.02] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-black lg:text-4xl">Comment ça marche</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {[
              { n: "01", t: "Bilan gratuit", d: "On fait le point sur tes objectifs, ton niveau et tes contraintes." },
              { n: "02", t: "Programme sur-mesure", d: "Je conçois un plan adapté à toi, chez toi, avec le matériel dispo." },
              { n: "03", t: "Séances à domicile", d: "On s'entraîne ensemble, en sécurité, avec la bonne technique." },
              { n: "04", t: "Suivi & progrès", d: "On mesure, on ajuste, on garde le cap jusqu'aux résultats." },
            ].map((s) => (
              <div key={s.n}>
                <p className="text-4xl font-black text-lime-400/40">{s.n}</p>
                <h3 className="mt-3 text-lg font-black">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* À propos */}
      <section id="apropos" className="border-t border-white/10 py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
          <div className="aspect-[4/5] rounded-3xl border border-white/10 bg-gradient-to-br from-lime-400/10 to-transparent" >
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">[ Ta photo ici ]</div>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-lime-400">À propos</p>
            <h2 className="mt-4 text-3xl font-black lg:text-4xl">Moi, c&apos;est {BRAND.coach}</h2>
            <p className="mt-6 leading-relaxed text-zinc-300">
              [Présente-toi : ton parcours, tes diplômes/certifications de coach, ta philosophie, ce qui te
              différencie. Quelques phrases suffisent — c&apos;est ce qui crée la confiance.]
            </p>
            <p className="mt-4 leading-relaxed text-zinc-400">
              [Ex. « Coach sportif certifié depuis X ans, je me déplace chez toi pour des séances efficaces et
              motivantes, quel que soit ton point de départ. »]
            </p>
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section id="tarifs" className="border-t border-white/10 bg-white/[0.02] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-black lg:text-4xl">Tarifs</h2>
          <p className="mt-3 text-zinc-400">[À compléter avec tes vrais prix. Exemples ci-dessous.]</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { t: "Séance à l'unité", p: "[__ €]", u: "/ séance" },
              { t: "Pack 10 séances", p: "[__ €]", u: "soit [__ €]/séance" },
              { t: "Coaching mensuel", p: "[__ €]", u: "/ mois" },
            ].map((t) => (
              <div key={t.t} className="rounded-3xl border border-white/10 p-7 text-center">
                <p className="text-sm text-zinc-400">{t.t}</p>
                <p className="mt-3 text-4xl font-black text-lime-400">{t.p}</p>
                <p className="mt-1 text-xs text-zinc-500">{t.u}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-zinc-500">[Pense à mentionner : crédit d&apos;impôt service à la personne, déplacement inclus, zone couverte…]</p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-black lg:text-5xl">Prêt à t&apos;y mettre ?</h2>
          <p className="mt-4 text-lg text-zinc-300">Réserve ta séance découverte — on fait le bilan ensemble, sans engagement.</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href={`mailto:${BRAND.email}`} className="flex h-14 items-center justify-center rounded-full bg-lime-400 px-8 font-black text-zinc-900 transition hover:bg-lime-300">
              ✉️ {BRAND.email}
            </a>
            <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`} className="flex h-14 items-center justify-center rounded-full border border-white/20 px-8 font-black text-white transition hover:bg-white/5">
              📞 {BRAND.phone}
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-10 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} {BRAND.name} — {BRAND.tagline}. Tous droits réservés.
      </footer>
    </main>
  );
}
