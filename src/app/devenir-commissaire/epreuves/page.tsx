"use client";

import { useState } from "react";
import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";

const autoDisc = [
  {
    emoji: "🏁",
    name: "Circuit",
    borderColor: "border-[#FF5A1F]/30",
    commissaires: "60 à 150 selon le circuit",
    duree: "1 jour à 24h (endurance)",
    specificites: [
      "Postes fixes répartis tout autour du circuit.",
      "Communication radio permanente avec la direction de course.",
      "Cadence élevée de passage des voitures.",
      "Interventions rapides en cas d'incident.",
      "Rotation des équipes sur les longues épreuves.",
    ],
    tenue: "Combinaison en coton obligatoire",
    tenueBadge: "bg-orange-100 text-orange-700 border-orange-200",
  },
  {
    emoji: "🌲",
    name: "Rallye",
    borderColor: "border-green-200",
    commissaires: "20 à 60 par spéciale",
    duree: "1 à 3 jours",
    specificites: [
      "Postes isolés en forêt ou sur route.",
      "Les voitures passent une à une à intervalles.",
      "Longues périodes d'attente entre les groupes.",
      "Pas toujours de liaison radio directe.",
      "Connaissance du carnet de route recommandée.",
    ],
    tenue: "Combinaison en coton ou chasuble selon organisateur",
    tenueBadge: "bg-green-100 text-green-700 border-green-200",
  },
  {
    emoji: "⛰️",
    name: "Course de côte",
    borderColor: "border-blue-200",
    commissaires: "30 à 80",
    duree: "1 à 2 jours",
    specificites: [
      "Voitures en montée une par une.",
      "Postes sur la route montante avec dénivelé.",
      "Risques de sortie de route sans garde-fou.",
      "Visibilité parfois limitée par les virages serrés.",
      "Descente des véhicules parfois à gérer.",
    ],
    tenue: "Combinaison en coton ou chasuble selon organisateur",
    tenueBadge: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    emoji: "🏎️",
    name: "Karting",
    borderColor: "border-yellow-200",
    commissaires: "20 à 40",
    duree: "1 jour",
    specificites: [
      "Cadence très élevée de passage (peloton serré).",
      "Incidents fréquents à gérer rapidement.",
      "Postes à l'intérieur et à l'extérieur du circuit.",
      "Karts plus légers, interventions facilitées.",
      "Bonne condition physique recommandée.",
    ],
    tenue: "Combinaison recommandée",
    tenueBadge: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  {
    emoji: "🌪️",
    name: "Autocross / Rallycross",
    borderColor: "border-purple-200",
    commissaires: "15 à 30",
    duree: "1 jour",
    specificites: [
      "Piste en terre, gravier ou mixte.",
      "Plusieurs voitures simultanément sur des circuits courts.",
      "Projections importantes de graviers et de boue.",
      "Visibilité réduite par la poussière.",
      "Interventions fréquentes entre les manches.",
    ],
    tenue: "Combinaison recommandée, protection des yeux conseillée",
    tenueBadge: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    emoji: "💨",
    name: "Drift",
    borderColor: "border-zinc-300",
    commissaires: "15 à 25",
    duree: "1 jour",
    specificites: [
      "Fumée de pneus permanente — masque recommandé.",
      "Trajectoires larges et imprévisibles.",
      "Discipline en forte croissance.",
      "Public parfois très proche de la piste.",
      "Vigilance accrue sur les zones de sécurité.",
    ],
    tenue: "Combinaison recommandée",
    tenueBadge: "bg-zinc-100 text-zinc-700 border-zinc-300",
  },
];

const motoDisc = [
  {
    emoji: "🏍️",
    name: "Vitesse",
    borderColor: "border-[#FF5A1F]/30",
    commissaires: "40 à 120 selon le circuit",
    duree: "1 à 2 jours (weekends d'épreuves)",
    specificites: [
      "Postes fixes tout autour du circuit, espacés selon la longueur.",
      "Vitesses très élevées — réactivité maximale exigée.",
      "Communication radio permanente avec le directeur de course.",
      "Les drapeaux sont présentés simultanément à tous les postes.",
      "Licence OFF (Officiel de Piste) FFM requise pour officier seul.",
    ],
    tenue: "Combinaison en coton obligatoire",
    tenueBadge: "bg-orange-100 text-orange-700 border-orange-200",
  },
  {
    emoji: "🌿",
    name: "Motocross",
    borderColor: "border-yellow-200",
    commissaires: "15 à 40",
    duree: "1 jour (manches)",
    specificites: [
      "Piste en terre avec bosses, virages relevés et sauts.",
      "Plusieurs pilotes simultanément sur la piste.",
      "Chutes fréquentes — interventions rapides entre les vagues.",
      "Projections importantes de terre et de boue.",
      "Bonne mobilité physique indispensable.",
    ],
    tenue: "Combinaison ou tenue adaptée à la boue",
    tenueBadge: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  {
    emoji: "🌲",
    name: "Enduro",
    borderColor: "border-green-200",
    commissaires: "20 à 60 selon le parcours",
    duree: "1 à 2 jours",
    specificites: [
      "Postes isolés en forêt, parfois sans radio.",
      "Les pilotes passent un à un à intervalles réguliers.",
      "Terrain accidenté, accès parfois difficile.",
      "Longues périodes d'attente entre les passages.",
      "Connaissance du terrain et autonomie essentielles.",
    ],
    tenue: "Tenue robuste, bottes imperméables recommandées",
    tenueBadge: "bg-green-100 text-green-700 border-green-200",
  },
  {
    emoji: "🔄",
    name: "Supermotard",
    borderColor: "border-blue-200",
    commissaires: "20 à 50",
    duree: "1 jour",
    specificites: [
      "Circuit mixte asphalte et section en terre.",
      "Changement de surface rapide — vigilance sur les zones de transition.",
      "Cadence élevée, pilotes très groupés.",
      "La section terre génère des projections sur l'asphalte.",
      "Drapeau jaune-rouge bandes utilisé pour signaler la piste glissante.",
    ],
    tenue: "Combinaison en coton recommandée",
    tenueBadge: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    emoji: "⏱️",
    name: "Endurance TT",
    borderColor: "border-purple-200",
    commissaires: "50 à 150 (Bol d'Or, etc.)",
    duree: "8h à 24h en continu",
    specificites: [
      "Rotation des équipes de commissaires toutes les 2 à 4h.",
      "Épreuves nocturnes — lampe frontale et chasuble réfléchissante obligatoires.",
      "Fatigue accumulée — vigilance maintenue sur la durée.",
      "Communication radio continue avec la salle de contrôle.",
      "Les stands d'assistance sont intégrés au dispositif de sécurité.",
    ],
    tenue: "Combinaison en coton + chasuble réfléchissante (nuit)",
    tenueBadge: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    emoji: "🏜️",
    name: "Rallye-Raid",
    borderColor: "border-zinc-300",
    commissaires: "10 à 30 par zone de contrôle",
    duree: "Plusieurs jours à plusieurs semaines",
    specificites: [
      "Postes très isolés, parfois en zones reculées.",
      "Autonomie totale en eau, nourriture et matériel.",
      "Les pilotes passent en navigation autonome.",
      "Liaison radio souvent par satellite.",
      "Formation secourisme recommandée.",
    ],
    tenue: "Tenue adaptée au terrain (désert, montagne, forêt)",
    tenueBadge: "bg-zinc-100 text-zinc-700 border-zinc-300",
  },
  {
    emoji: "🪨",
    name: "Trial",
    borderColor: "border-orange-200",
    commissaires: "10 à 25",
    duree: "1 jour",
    specificites: [
      "Discipline technique sans vitesse — juges de zones.",
      "Chaque pilote réalise des sections balisées (zones).",
      "Les commissaires comptent les pénalités (pieds à terre).",
      "Terrain naturel ou artificiel avec obstacles.",
      "Aucun contact avec le sol, sauf les pneus.",
    ],
    tenue: "Tenue confortable, chaussures de sécurité",
    tenueBadge: "bg-orange-100 text-orange-700 border-orange-200",
  },
];

const saviez = {
  auto: [
    {
      emoji: "📊",
      text: "Les 24 Heures du Mans 2026 ont mobilisé 2 053 commissaires de piste issus de 23 pays différents.",
    },
    {
      emoji: "🗓️",
      text: "Un commissaire actif participe en moyenne à 8 à 15 épreuves par saison.",
    },
    {
      emoji: "🌍",
      text: "Avec une licence EICOB, vous pouvez officier sur des épreuves FIA dans toute l'Europe.",
    },
  ],
  moto: [
    {
      emoji: "📊",
      text: "Le Bol d'Or (24h Moto) mobilise plus de 400 commissaires de piste sur le circuit de Nevers Magny-Cours.",
    },
    {
      emoji: "🗓️",
      text: "En motocross, une journée d'épreuve peut voir 6 à 8 manches se succéder — le commissaire intervient entre chaque passage.",
    },
    {
      emoji: "🪪",
      text: "La licence OFF (Officiel de Piste) FFM est requise pour officier en autonomie sur une épreuve de vitesse moto.",
    },
  ],
};

export default function EpreuvesPage() {
  const [sportMode, setSportMode] = useState<"auto" | "moto">("auto");

  const disciplines = sportMode === "auto" ? autoDisc : motoDisc;
  const facts = saviez[sportMode];

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

          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#FF5A1F]">Disciplines</p>
          <h1 className="mt-4 text-4xl font-black text-zinc-900 lg:text-6xl">Les types d&apos;épreuves</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-600">
            Circuit, rallye, côte, motocross... Chaque discipline a ses propres codes, procédures et
            exigences pour le commissaire.
          </p>

          {/* Toggle Auto / Moto */}
          <div className="mt-8 inline-flex rounded-2xl border border-zinc-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setSportMode("auto")}
              className={`rounded-xl px-6 py-2.5 text-sm font-black transition ${
                sportMode === "auto"
                  ? "bg-[#FF5A1F] text-white shadow"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              🚗 Auto
            </button>
            <button
              onClick={() => setSportMode("moto")}
              className={`rounded-xl px-6 py-2.5 text-sm font-black transition ${
                sportMode === "moto"
                  ? "bg-[#FF5A1F] text-white shadow"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              🏍️ Moto
            </button>
          </div>

          {/* Discipline grid */}
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {disciplines.map((d) => (
              <div
                key={d.name}
                className={`rounded-[24px] border bg-white shadow-sm p-6 ${d.borderColor}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{d.emoji}</span>
                  <h2 className="text-xl font-black text-zinc-900">{d.name}</h2>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-zinc-500">
                      Commissaires nécessaires
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-zinc-900">{d.commissaires}</p>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-zinc-500">
                      Durée type
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-zinc-900">{d.duree}</p>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-zinc-500">
                    Spécificités
                  </p>
                  <ul className="mt-3 space-y-2">
                    {d.specificites.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-sm text-zinc-600">
                        <span className="mt-1 shrink-0 text-[#FF5A1F]">›</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5">
                  <span
                    className={`inline-block rounded-full border px-3 py-1 text-xs font-bold ${d.tenueBadge}`}
                  >
                    {d.tenue}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Le saviez-vous */}
          <div className="mt-20">
            <h2 className="text-2xl font-black text-zinc-900 lg:text-3xl">Le saviez-vous ?</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {facts.map((s) => (
                <div
                  key={s.emoji}
                  className="rounded-[24px] border border-zinc-200 bg-white shadow-sm p-6"
                >
                  <span className="text-3xl">{s.emoji}</span>
                  <p className="mt-4 leading-relaxed text-zinc-600">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sources */}
          <div className="mt-12 flex items-start gap-3 rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm">
            <span className="shrink-0 text-lg">📄</span>
            <p className="text-sm leading-relaxed text-zinc-500">
              <span className="font-bold text-zinc-700">Sources auto :</span>{" "}
              Règlement Sportif FFSA 2025 (circuit asphalte, tout-terrain, rallye, course de côte, karting) · FFSA Généralités 2024.{" "}
              <span className="font-bold text-zinc-700">Sources moto :</span>{" "}
              Règlement Sportif FFM 2025 · Dossier Candidat Commissaire de Piste FFM — Version janvier 2023.
              Ces contenus sont fournis à titre pédagogique — consultez toujours le règlement particulier de l&apos;épreuve.
            </p>
          </div>

        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
