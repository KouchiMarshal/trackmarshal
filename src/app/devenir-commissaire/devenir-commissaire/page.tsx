"use client";

import { useState } from "react";
import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";

const stepsFFSA = [
  {
    num: "01",
    title: "Rejoindre une ASA ou une ASK",
    description: "L'ASA (Association Sportive Automobile) est le club local affilié à la FFSA pour les épreuves auto. Pour le karting, rejoignez une ASK (Association Sportive Karting) affiliée à une Ligue de Karting. Ces clubs sont votre point d'entrée obligatoire pour obtenir votre licence et participer aux épreuves.",
    tip: "Trouvez l'ASA ou l'ASK la plus proche sur le site de la FFSA (ffsa.org). La plupart proposent des journées portes ouvertes ou des réunions d'information.",
  },
  {
    num: "02",
    title: "Suivre la formation initiale",
    description: "La FFSA propose désormais une plateforme e-learning accessible sur ffsa.org pour les primo-licenciés (commissaire C). Les modules abordent les institutions du sport auto, les drapeaux, les procédures de sécurité et le rôle du commissaire. Des regroupements régionaux en présentiel complètent la formation théorique.",
    tip: "La formation peut être suivie en ligne avant votre première épreuve. Consultez ffsa.org/divers/commissaires pour accéder aux ressources.",
  },
  {
    num: "03",
    title: "Participer à des épreuves en observateur",
    description: "Avant d'officier seul, vous participez à plusieurs épreuves en tant qu'observateur aux côtés de commissaires expérimentés. C'est la phase pratique indispensable : vous apprenez les gestes, les positionnements et les procédures réelles.",
    tip: "Comptez 2 à 3 épreuves minimum en observation avant de pouvoir postuler à une licence.",
  },
  {
    num: "04",
    title: "Obtenir la licence ENCOC",
    description: "L'ENCOC (Commissaire C) est la première licence FFSA. Elle vous permet d'officier sur les épreuves nationales sous la supervision d'un commissaire de grade supérieur. C'est le point de départ de votre carrière.",
    tip: "La licence est annuelle et se renouvelle chaque saison. Son coût est modique, souvent inclus dans la cotisation ASA.",
  },
  {
    num: "05",
    title: "Évoluer vers les grades supérieurs",
    description: "Avec l'expérience et les formations complémentaires, vous pouvez progresser vers l'EICOB (Commissaire international B), puis les grades de Chef de Poste (EICOACPC pour le circuit, EICOACPR pour la route).",
    tip: "Chaque grade ouvre de nouvelles épreuves et responsabilités. Le niveau international B permet d'officier sur des courses FIA.",
  },
];

const stepsFFM = [
  {
    num: "01",
    title: "Rejoindre un club FFM affilié",
    description: "La FFM (Fédération Française de Motocyclisme) fédère les clubs moto en France. Votre premier pas est de rejoindre un club FFM proche de chez vous. Ces clubs organisent des épreuves locales et sont votre point d'entrée obligatoire pour accéder aux formations et aux licences officiels.",
    tip: "Trouvez votre club FFM sur ffmoto.org. Beaucoup de clubs organisent des journées d'initiation sur leurs épreuves — l'occasion parfaite pour découvrir le rôle de commissaire.",
  },
  {
    num: "02",
    title: "Se former aux bases FFM",
    description: "La FFM propose des formations pour ses officiels via les Ligues régionales. Les modules couvrent les drapeaux FFM, les procédures de sécurité, le règlement sportif FFM et les spécificités de chaque discipline (motocross, vitesse, enduro, endurance TT, trial, supermoto).",
    tip: "Les sessions de formation sont organisées par les Ligues FFM de chaque région. Renseignez-vous auprès de votre club pour les dates et les modalités d'inscription.",
  },
  {
    num: "03",
    title: "Participer en observateur",
    description: "Avant d'officier seul, vous accompagnez des officiels expérimentés sur 2 à 3 épreuves. Vous apprenez les positionnements sur chaque discipline, les gestes spécifiques (drapeaux FFM) et les réflexes de sécurité propres aux épreuves moto (PAS DE SAUT en zone jaune, croix rouge…).",
    tip: "Chaque discipline moto a ses particularités. Si possible, participez à différents types d'épreuves (motocross, vitesse, enduro) pour avoir une vision complète du métier.",
  },
  {
    num: "04",
    title: "Obtenir la licence OFS",
    description: "L'OFS (Officiel Stagiaire FFM) est la première licence officiel moto. Elle vous permet d'officier sur les épreuves moto sous supervision d'un officiel expérimenté. La licence est annuelle et se renouvelle chaque saison.",
    tip: "La demande de licence se fait via votre club FFM affilié. Comptez une saison complète entre la formation initiale et l'obtention de la licence OFS.",
  },
  {
    num: "05",
    title: "Évoluer vers la licence OFF",
    description: "Avec l'expérience accumulée et les formations complémentaires, vous accédez à la licence OFF (Officiel FFM). Cette licence vous permet d'officier en autonomie sur toutes les épreuves FFM, quelle que soit la discipline, et d'encadrer des officiels stagiaires.",
    tip: "Chaque épreuve validée renforce votre dossier. Notez vos participations pour faciliter la demande de promotion vers la licence OFF.",
  },
];

const licenses = [
  {
    code: "ENCOC",
    name: "Commissaire C",
    federation: "FFSA",
    color: "border-[#FF5A1F]/30 bg-orange-50",
    badgeColor: "bg-orange-100 text-orange-700",
    description: "Première licence commissaire. Permet d'officier sur les épreuves nationales.",
    access: "Épreuves régionales et nationales",
  },
  {
    code: "EICOB",
    name: "Commissaire international B",
    federation: "FFSA",
    color: "border-blue-200 bg-blue-50",
    badgeColor: "bg-blue-100 text-blue-700",
    description: "Grade intermédiaire permettant d'officier sur des épreuves de niveau international.",
    access: "Épreuves nationales et internationales",
  },
  {
    code: "EICOACPC",
    name: "Chef de Poste Circuit",
    federation: "FFSA",
    color: "border-purple-200 bg-purple-50",
    badgeColor: "bg-purple-100 text-purple-700",
    description: "Responsable d'un poste de commissaires sur les épreuves de circuit.",
    access: "Toutes épreuves de circuit",
  },
  {
    code: "EICOACPR",
    name: "Chef de Poste Route",
    federation: "FFSA",
    color: "border-green-200 bg-green-50",
    badgeColor: "bg-green-100 text-green-700",
    description: "Responsable d'un poste sur les épreuves de route (rallye, course de côte).",
    access: "Toutes épreuves sur route",
  },
  {
    code: "OFS",
    name: "Officiel Stagiaire",
    federation: "FFM",
    color: "border-yellow-200 bg-yellow-50",
    badgeColor: "bg-yellow-100 text-yellow-700",
    description: "Première étape : permet d'officier sous supervision d'un Officiel expérimenté. Licence d'entrée dans le parcours FFM.",
    access: "Épreuves moto régionales (sous supervision)",
  },
  {
    code: "OFF",
    name: "Officiel",
    federation: "FFM",
    color: "border-orange-200 bg-orange-50",
    badgeColor: "bg-orange-100 text-orange-700",
    description: "Licence requise pour officier en autonomie. Selon le Dossier Candidat FFM, le commissaire de piste doit être titulaire d'une licence OFF ou d'une licence pilote de l'année en cours.",
    access: "Toutes épreuves moto — en autonomie",
  },
];

const faqs = [
  {
    q: "Quel âge minimum pour être commissaire ?",
    a: "16 ans pour commencer en tant qu'observateur, 18 ans pour officier avec une licence.",
  },
  {
    q: "Faut-il avoir un permis de conduire ?",
    a: "Non, le permis de conduire n'est pas obligatoire pour être commissaire de piste.",
  },
  {
    q: "Est-ce que c'est payant ?",
    a: "La formation initiale et la licence ont un coût modique (cotisation ASA + licence FFSA, généralement entre 50 et 150€/an). Sur les épreuves, les organisateurs prennent en charge les repas et parfois l'hébergement.",
  },
  {
    q: "Combien de temps faut-il pour obtenir sa première licence ?",
    a: "Comptez une saison complète : formation théorique, participations en observateur, puis demande de licence. La majorité des commissaires obtiennent leur ENCOC dans leur première année.",
  },
  {
    q: "Peut-on officier sur plusieurs disciplines ?",
    a: "Oui. Avec une licence FFSA, vous pouvez officier sur circuit, rallye, course de côte et karting. Pour les épreuves moto, il faut une licence FFM distincte.",
  },
  {
    q: "Y a-t-il une tenue vestimentaire obligatoire ?",
    a: "Oui. La combinaison en coton orange est la tenue de référence sur circuit — elle protège du feu et identifie le commissaire. Le rouge et le jaune sont explicitement proscrits par la réglementation FFSA (risque de confusion avec la signalisation). Sur épreuves route et karting, une chasuble facilement identifiable est souvent utilisée. L'organisateur précise la tenue attendue au briefing.",
  },
];

export default function DevenirCommissairePage() {
  const [sportMode, setSportMode] = useState<"auto" | "moto">("auto");

  const currentSteps = sportMode === "auto" ? stepsFFSA : stepsFFM;
  const currentLicenses = licenses.filter((lic) => lic.federation === (sportMode === "auto" ? "FFSA" : "FFM"));
  const licensesSubtitle =
    sportMode === "auto"
      ? "FFSA — cinq grades du commissaire C au Chef de Poste."
      : "FFM — deux niveaux pour officier sur toutes les épreuves moto.";

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicNavbar />

      <section className="relative pt-36 pb-24">
        <div className="relative z-10 mx-auto max-w-[1100px] px-6 lg:px-10">

          <div className="mb-4">
            <Link href="/devenir-commissaire" className="text-sm text-zinc-500 transition hover:text-zinc-900">
              ← Espace pédagogique
            </Link>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#FF5A1F]">Guide</p>
          <h1 className="mt-4 text-4xl font-black text-zinc-900 lg:text-6xl">Comment devenir commissaire de piste</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-600">
            FFSA pour l&apos;automobile, FFM pour la moto — deux parcours pour rejoindre la communauté.
          </p>

          {/* Sport mode toggle */}
          <div className="mt-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Sport</p>
            <div className="flex gap-2">
              <button
                onClick={() => setSportMode("auto")}
                className={`rounded-xl px-4 py-2.5 text-sm font-black uppercase tracking-[0.06em] transition ${
                  sportMode === "auto"
                    ? "bg-[#FF5A1F] text-white shadow-sm"
                    : "border border-zinc-300 bg-white text-zinc-500 hover:border-zinc-400 hover:text-zinc-700"
                }`}
              >
                🏎 Auto
              </button>
              <button
                onClick={() => setSportMode("moto")}
                className={`rounded-xl px-4 py-2.5 text-sm font-black uppercase tracking-[0.06em] transition ${
                  sportMode === "moto"
                    ? "bg-[#FF5A1F] text-white shadow-sm"
                    : "border border-zinc-300 bg-white text-zinc-500 hover:border-zinc-400 hover:text-zinc-700"
                }`}
              >
                🏍 Moto
              </button>
            </div>
          </div>

          {/* Étapes */}
          <div className="mt-16">
            <h2 className="text-2xl font-black text-zinc-900 lg:text-3xl">Les étapes</h2>
            <div className="mt-8 space-y-4">
              {currentSteps.map((step) => (
                <div key={step.num} className="flex gap-5 rounded-[28px] border border-zinc-200 bg-white shadow-sm p-6 lg:gap-8 lg:p-8">
                  <div className="shrink-0">
                    <span className="text-4xl font-black text-[#FF5A1F]/30 lg:text-5xl">{step.num}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-black text-zinc-900">{step.title}</h3>
                    <p className="mt-2 leading-relaxed text-zinc-600">{step.description}</p>
                    <div className="mt-4 flex items-start gap-2 rounded-2xl border border-[#FF5A1F]/20 bg-orange-50 px-4 py-3">
                      <span className="shrink-0 text-sm">💡</span>
                      <p className="text-sm text-zinc-700">{step.tip}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Licences */}
          <div className="mt-20">
            <h2 className="text-2xl font-black text-zinc-900 lg:text-3xl">Les types de licences</h2>
            <p className="mt-3 text-zinc-600">{licensesSubtitle}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {currentLicenses.map((lic) => (
                <div key={lic.code} className={`rounded-[24px] border p-6 ${lic.color}`}>
                  <div className="flex items-center justify-between">
                    <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.1em] ${lic.badgeColor}`}>
                      {lic.federation}
                    </span>
                    <span className="text-xs text-zinc-500">{lic.code}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-black text-zinc-900">{lic.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">{lic.description}</p>
                  <div className="mt-4 rounded-xl border border-zinc-200 bg-white px-3 py-2">
                    <p className="text-xs text-zinc-500">Accès</p>
                    <p className="mt-0.5 text-sm font-bold text-zinc-900">{lic.access}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20">
            <h2 className="text-2xl font-black text-zinc-900 lg:text-3xl">Questions fréquentes</h2>
            <div className="mt-8 space-y-3">
              {faqs.map((faq) => (
                <div key={faq.q} className="rounded-[24px] border border-zinc-200 bg-white shadow-sm p-6">
                  <p className="font-black text-zinc-900">{faq.q}</p>
                  <p className="mt-2 leading-relaxed text-zinc-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Source */}
          <div className="mt-12 flex items-start gap-3 rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm">
            <span className="shrink-0 text-lg">📄</span>
            <p className="text-sm leading-relaxed text-zinc-500">
              <span className="font-bold text-zinc-700">Sources :</span>{" "}
              {sportMode === "moto"
                ? "Dossier Candidat Commissaire de Piste FFM — Version janvier 2023 (Formation des Officiels, Fédération Française de Motocyclisme) · Règlement Sportif FFM 2025."
                : "Devenir Commissaire — Les étapes clés (FFSA, 2025) · Règlement Général des Épreuves Automobile FFSA — Généralités 2024 (Art. 3 — Licences et grades des officiels) · Règlement Sportif FFSA 2025."}
              {" "}Ces contenus sont fournis à titre pédagogique — les règlements peuvent évoluer chaque saison.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-[32px] border border-[#FF5A1F]/20 bg-orange-50 p-8 text-center lg:p-12">
            <h2 className="text-2xl font-black text-zinc-900 lg:text-3xl">Prêt à vous lancer ?</h2>
            <p className="mt-3 text-zinc-600">Inscrivez-vous sur TrackMarshal et rejoignez la communauté des commissaires motorsport.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="rounded-2xl bg-[#FF5A1F] px-8 py-4 font-bold text-white transition hover:opacity-90"
              >
                Créer mon compte
              </Link>
              <Link
                href="/devenir-commissaire/quiz/drapeaux"
                className="rounded-2xl border border-zinc-200 bg-white px-8 py-4 font-bold text-zinc-700 transition hover:bg-zinc-50"
              >
                🎯 Tester mes connaissances
              </Link>
            </div>
          </div>

        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
