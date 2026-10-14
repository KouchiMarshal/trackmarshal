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
  zone: "Alençon, Sées, Mortagne-au-Perche, L'Aigle et leurs environs",
  email: "foussardk@gmail.com",
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

// Pour qui — lève les freins, sans survendre.
const POURQUI = [
  { e: "🌱", t: "Reprise en douceur", d: "Après une longue pause, une grossesse ou un souci de santé ? On démarre progressivement et en sécurité, à votre rythme." },
  { e: "🏠", t: "Sans salle, sans gêne", d: "Pas à l'aise à l'idée d'aller en salle ? On s'entraîne chez vous, sans regard et sans jugement." },
  { e: "⏱️", t: "Peu de temps", d: "Je me déplace, les séances sont efficaces et calées sur votre emploi du temps. Zéro trajet pour vous." },
  { e: "🎯", t: "Besoin d'être suivi", d: "De la régularité et un vrai suivi : c'est souvent ce qui manque pour tenir dans la durée et voir des résultats." },
];

// Ma philosophie — ton bienveillant, accessible (pas "salle de muscu").
const VALEURS = [
  { e: "🤝", t: "Bienveillance", d: "Zéro jugement, zéro pression. On s'adapte à vous, pas l'inverse." },
  { e: "📈", t: "Progressivité", d: "On commence en douceur et on augmente petit à petit, en sécurité." },
  { e: "😊", t: "Plaisir", d: "Bouger doit rester un plaisir : des séances variées, jamais punitives." },
  { e: "👂", t: "À l'écoute", d: "Un programme construit autour de vos envies, votre corps et votre vie." },
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
            <a href="#credit-impot" className="hover:text-zinc-900">Crédit d&apos;impôt</a>
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
          <p className="text-sm font-black uppercase tracking-[0.3em]" style={{ color: O }}>Coaching sportif à domicile · accessible à tous</p>
          <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.95] tracking-tight text-zinc-900 lg:text-7xl">
            Ensemble,<br />vous irez <span style={{ color: O }}>plus loin</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600">
            Remise en forme, perte de poids, renforcement, retour au sport en douceur : je conçois chaque
            séance selon votre niveau, vos objectifs et votre emploi du temps, directement chez vous.
            Pas de promesses miracles — un accompagnement sérieux, régulier et motivant, pour des
            résultats qui durent.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href="#contact" className="flex h-14 items-center justify-center rounded-full px-8 text-base font-black text-white transition hover:opacity-90" style={{ backgroundColor: O }}>
              Réserver une séance découverte
            </a>
            <a href="#offres" className="flex h-14 items-center justify-center rounded-full border-2 border-zinc-200 px-8 text-base font-black text-zinc-900 transition hover:border-zinc-300">
              Voir les offres
            </a>
          </div>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-black" style={{ borderColor: `${O}55`, backgroundColor: `${O}14`, color: "#9a5a14" }}>
            💶 Éligible au crédit d&apos;impôt de 50% — Service à la personne
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Tous niveaux", "Tous âges", "Débutants bienvenus", "À votre rythme", "Sans jugement"].map((c) => (
              <span key={c} className="rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-bold text-zinc-600">{c}</span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 text-sm font-semibold text-zinc-500">
            <span>📍 {BRAND.zone}</span>
            <span>🏠 À domicile ou en extérieur</span>
            <span>🎯 Programme sur-mesure</span>
          </div>
        </div>
      </section>

      {/* Ma philosophie */}
      <section className="py-20" style={{ backgroundColor: `${O}0d` }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.3em]" style={{ color: O }}>Ma philosophie</p>
            <h2 className="mt-4 text-3xl font-black lg:text-4xl">Un sport accessible, pour se sentir bien</h2>
            <p className="mt-4 leading-relaxed text-zinc-600">
              Ici, pas de culture du « toujours plus » ni de corps parfait. Juste l&apos;envie de vous aider à
              bouger, à vous sentir mieux dans votre corps et à prendre soin de votre santé — quel que soit
              votre point de départ.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALEURS.map((v) => (
              <div key={v.t} className="flex gap-4">
                <span className="text-2xl">{v.e}</span>
                <div>
                  <h3 className="font-black text-zinc-900">{v.t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-600">{v.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pour qui */}
      <section className="border-t border-zinc-100 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-black lg:text-4xl">Pour qui ?</h2>
          <p className="mt-3 max-w-2xl text-zinc-600">
            Pas besoin d&apos;être sportif pour commencer. On part de là où vous en êtes réellement —
            quel que soit votre âge ou votre niveau — et on construit ensemble, étape par étape.
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {POURQUI.map((p) => (
              <div key={p.t} className="rounded-3xl border border-zinc-200 bg-white p-6">
                <span className="text-3xl">{p.e}</span>
                <h3 className="mt-4 text-lg font-black">{p.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offres */}
      <section id="offres" className="border-t border-zinc-100 bg-zinc-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-black lg:text-4xl">Mes offres</h2>
          <p className="mt-3 max-w-xl text-zinc-600">Deux formules simples pour avancer à votre rythme. Chaque programme est adapté après un premier bilan.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              { t: "Séance à l'unité", d: "Idéal pour tester ou pour un accompagnement ponctuel. Bilan, séance personnalisée, conseils.", f: ["1 séance à domicile", "Programme adapté", "Suivi des progrès"] },
              { t: "Pack 10 séances", d: "Le plus choisi. Un vrai suivi dans la durée pour installer des résultats concrets.", f: ["10 séances à domicile", "Plan nutrition de base", "Suivi entre les séances"], featured: true },
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
          <div className="aspect-[4/5] overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/kevin-coach.jpg" alt="Kevin Foussard, coach sportif à domicile" className="h-full w-full object-cover object-center" />
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
          <p className="mt-3 text-zinc-600">Des tarifs simples et transparents, sans engagement.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              { t: "Séance à l'unité", p: "65 €", u: "/ séance" },
              { t: "Pack 10 séances", p: "600 €", u: "soit 60 €/séance" },
            ].map((t) => (
              <div key={t.t} className="rounded-3xl border border-zinc-200 p-7 text-center">
                <p className="text-sm text-zinc-500">{t.t}</p>
                <p className="mt-3 text-4xl font-black" style={{ color: O }}>{t.p}</p>
                <p className="mt-1 text-xs text-zinc-400">{t.u}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-zinc-400">[Déplacement inclus ? Zone couverte ? Précisez-le ici.]</p>
          <p className="mt-6 text-sm font-black" style={{ color: "#9a5a14" }}>
            💶 Grâce au crédit d&apos;impôt, ces montants sont réduits de 50% — voir le détail juste en dessous.
          </p>
        </div>
      </section>

      {/* Crédit d'impôt */}
      <section id="credit-impot" className="border-t border-zinc-100 bg-zinc-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-black uppercase tracking-[0.3em]" style={{ color: O }}>Avantage fiscal</p>
          <h2 className="mt-4 text-3xl font-black lg:text-4xl">Le crédit d&apos;impôt, comment ça marche&nbsp;?</h2>
          <p className="mt-3 max-w-2xl text-zinc-600">
            Mes prestations à domicile relèvent du <strong>Service à la personne</strong>. Concrètement, une bonne
            partie de ce que vous payez vous est rendue — que vous soyez imposable ou non.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {/* Particuliers */}
            <div className="rounded-3xl border bg-white p-7 shadow-sm" style={{ borderColor: O }}>
              <span className="inline-block rounded-full px-3 py-1 text-xs font-black text-white" style={{ backgroundColor: O }}>Particuliers</span>
              <p className="mt-4 text-5xl font-black" style={{ color: O }}>−50%</p>
              <p className="mt-1 font-bold text-zinc-800">de crédit d&apos;impôt sur vos séances</p>
              <div className="mt-5 rounded-2xl bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-700">
                <strong>Concrètement :</strong> une séance à <strong>65 €</strong> ne vous revient qu&apos;à
                <strong> 32,50 €</strong>, et le pack 10 séances à <strong>600 €</strong> qu&apos;à <strong>300 €</strong>
                après crédit d&apos;impôt.
              </div>
              <div className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-zinc-700">
                <span className="text-lg">⚡</span>
                <p><strong>Avance immédiate :</strong> grâce au dispositif URSSAF, vous ne réglez que la <strong>moitié</strong> de la somme sur le moment — sans attendre votre déclaration d&apos;impôt.</p>
              </div>
            </div>

            {/* Professionnels */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
              <span className="inline-block rounded-full bg-zinc-900 px-3 py-1 text-xs font-black text-white">Professionnels</span>
              <p className="mt-4 text-5xl font-black text-zinc-900">−25%</p>
              <p className="mt-1 font-bold text-zinc-800">pour les professions libérales &amp; chefs d&apos;entreprise</p>
              <p className="mt-5 text-sm leading-relaxed text-zinc-600">
                Vous pouvez intégrer <strong>légalement</strong> vos séances à domicile dans vos <strong>frais
                professionnels</strong>, tout en bénéficiant d&apos;un <strong>crédit d&apos;impôt de 25%</strong>.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                Un double avantage encore peu connu, idéal pour les médecins, avocats, indépendants et dirigeants
                qui veulent prendre soin de leur forme sans alourdir leur budget.
              </p>
            </div>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-zinc-400">
            Dispositif Service à la personne. Le montant et l&apos;éligibilité dépendent de votre situation
            personnelle ou professionnelle, dans la limite des plafonds légaux. N&apos;hésitez pas à m&apos;en parler
            pour votre cas précis.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24" style={{ background: `linear-gradient(135deg, ${O}, #e07a18)` }}>
        <div className="mx-auto max-w-2xl px-6 text-center text-white">
          <h2 className="text-3xl font-black lg:text-5xl">On commence quand vous voulez</h2>
          <p className="mt-4 text-lg text-white/90">Réservez votre séance découverte — on fait le bilan ensemble, en toute simplicité et sans engagement.</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href={`mailto:${BRAND.email}`} className="flex h-14 items-center justify-center rounded-full bg-white px-8 font-black transition hover:bg-white/90" style={{ color: "#c2650f" }}>
              ✉️ {BRAND.email}
            </a>
            <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`} className="flex h-14 items-center justify-center rounded-full border-2 border-white/70 px-8 font-black text-white transition hover:bg-white/10">
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
