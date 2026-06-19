import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";

const roles = [
  {
    title: "Directeur de course",
    code: "DC",
    color: "border-[#FF5A1F]/30 bg-orange-50",
    badgeColor: "bg-orange-100 text-orange-700",
    icon: "👑",
    license: "Grade international",
    description: "Autorité suprême sur la compétition. Le DC prend toutes les décisions relatives au déroulement de l'épreuve : déploiement du Safety Car, drapeaux rouges, interruptions, reprises. Il est en communication permanente avec tous les postes.",
    missions: [
      "Décider du déploiement du Safety Car, FCY ou Code 60",
      "Ordonner l'arrêt de séance (drapeau rouge)",
      "Valider les procédures de départ et de reprise",
      "Coordonner les équipes d'intervention médicale et technique",
      "Répondre aux demandes des équipes et des stewards",
    ],
    tip: "Le DC n'est généralement pas visible depuis les postes. Toute communication passe par radio. Exécutez ses ordres immédiatement.",
  },
  {
    title: "Chef de poste",
    code: "EICOACPC / EICOACPR",
    color: "border-purple-200 bg-purple-50",
    badgeColor: "bg-purple-100 text-purple-700",
    icon: "📡",
    license: "EICOACPC (circuit) / EICOACPR (route)",
    description: "Responsable d'un poste de commissaires. Il encadre son équipe, maintient la liaison radio avec la direction de course, décide des interventions sur son secteur et rend compte de tous les incidents.",
    missions: [
      "Encadrer et positionner les commissaires de son poste",
      "Maintenir la communication radio avec le DC",
      "Décider du type de drapeau à présenter selon la situation",
      "Remplir les fiches d'incident et de présence",
      "Coordonner les interventions sur son secteur de piste",
    ],
    tip: "En cas de doute sur le type de signal à présenter, privilégiez toujours la sécurité — drapeau jaune d'abord, puis rendez compte à la direction.",
  },
  {
    title: "Commissaire de piste",
    code: "ENCOC / EICOB",
    color: "border-blue-200 bg-blue-50",
    badgeColor: "bg-blue-100 text-blue-700",
    icon: "🚩",
    license: "ENCOC (débutant) → EICOB (confirmé)",
    description: "Officier de base positionné en bord de piste. Il présente les signaux réglementaires, surveille sa zone de responsabilité et intervient physiquement en cas d'incident sous les ordres du chef de poste.",
    missions: [
      "Présenter les drapeaux réglementaires selon les consignes",
      "Surveiller la piste et les zones de dégagement",
      "Assister à l'évacuation des véhicules accidentés",
      "Signaler tout incident au chef de poste",
      "Maintenir sa position et rester attentif en permanence",
    ],
    tip: "Votre rôle principal est d'être les yeux de la direction de course sur votre secteur. Signalez tout, même ce qui semble anodin.",
  },
  {
    title: "Commissaire au départ",
    code: "Spécialiste départ",
    color: "border-green-200 bg-green-50",
    badgeColor: "bg-green-100 text-green-700",
    icon: "🚦",
    license: "ENCOC minimum",
    description: "Responsable des procédures de grille et de départ. Il s'assure que les concurrents sont correctement positionnés, que la grille est dégagée avant l'extinction des feux, et gère les incidents de départ.",
    missions: [
      "Placer et aligner les concurrents sur la grille",
      "Vérifier les marquages de grille et la conformité des véhicules",
      "Signaler les voitures non prêtes au départ",
      "Évacuer la grille avant l'extinction des feux",
      "Gérer les faux départs et les procédures associées",
    ],
    tip: "Soyez sur la grille tôt. Les 5 minutes avant le départ sont les plus intenses — chaque seconde compte pour vider la piste en sécurité.",
  },
  {
    title: "Commissaire au pesage",
    code: "Pesage",
    color: "border-yellow-200 bg-yellow-50",
    badgeColor: "bg-yellow-100 text-yellow-700",
    icon: "⚖️",
    license: "ENCOC minimum",
    description: "Contrôle le poids des véhicules et de l'équipage avant, pendant ou après l'épreuve. Travaille en étroite collaboration avec les délégués techniques pour valider la conformité réglementaire.",
    missions: [
      "Peser les véhicules aux moments définis par le règlement",
      "Consigner les résultats de pesée sur les fiches officielles",
      "Signaler les non-conformités aux stewards",
      "Gérer les flux de véhicules vers et depuis la balance",
      "Maintenir la zone de pesage sécurisée et organisée",
    ],
    tip: "La précision et la rigueur sont essentielles au pesage. Un écart de quelques grammes peut entraîner une exclusion — notez tout avec soin.",
  },
  {
    title: "Commissaire au parc fermé",
    code: "Parc fermé",
    color: "border-orange-200 bg-orange-50",
    badgeColor: "bg-orange-100 text-orange-700",
    icon: "🔒",
    license: "ENCOC minimum",
    description: "Contrôle l'accès au parc fermé après la course ou les qualifications. Aucune intervention mécanique n'est autorisée sans accord des commissaires techniques. Il garantit l'intégrité des véhicules pour les contrôles.",
    missions: [
      "Filtrer les accès au parc fermé (seules les personnes autorisées entrent)",
      "Surveiller que les équipes n'interviennent pas sur les véhicules",
      "Noter les entrées et sorties des véhicules",
      "Orienter les délégués techniques lors des contrôles",
      "Maintenir l'ordre et la sécurité dans la zone",
    ],
    tip: "Soyez ferme mais courtois. Des équipes sous pression peuvent être tentées d'outrepasser les règles — votre présence et votre rigueur sont la garantie d'une compétition équitable.",
  },
  {
    title: "Délégué technique",
    code: "DT",
    color: "border-red-200 bg-red-50",
    badgeColor: "bg-red-100 text-red-700",
    icon: "🔧",
    license: "Formation technique spécifique",
    description: "Contrôle la conformité technique des véhicules au règlement sportif et technique. Intervient avant, pendant et après l'épreuve pour vérifier les jauges de carburant, les dimensions, les équipements de sécurité.",
    missions: [
      "Vérifier la conformité technique des véhicules avant l'épreuve",
      "Contrôler les véhicules après la course (parc fermé)",
      "Rédiger les rapports d'infraction technique",
      "Collaborer avec les stewards pour les décisions de pénalité",
      "Vérifier les équipements de sécurité des pilotes (casque, combinaison, HANS)",
    ],
    tip: "Rôle distinct du commissaire de piste. La formation technique est spécifique à chaque discipline. Consultez la FFSA pour les formations disponibles.",
  },
  {
    title: "Médecin de course",
    code: "Medical",
    color: "border-pink-200 bg-pink-50",
    badgeColor: "bg-pink-100 text-pink-700",
    icon: "🏥",
    license: "Docteur en médecine + formation FIA/FFSA",
    description: "Responsable médical de l'épreuve. Il est présent dès l'arrivée en piste et reste disponible pendant toute la durée de la compétition. Intervient sur tout incident impliquant un pilote blessé ou potentiellement blessé.",
    missions: [
      "Assurer la couverture médicale permanente de l'épreuve",
      "Intervenir immédiatement sur tout incident avec blessé",
      "Décider du déclenchement du protocole d'extraction d'un pilote",
      "Coordonner avec le SAMU et les hôpitaux en cas d'évacuation",
      "Valider l'aptitude médicale des concurrents si nécessaire",
    ],
    tip: "En cas d'accident avec blessé : NE PAS déplacer le pilote avant l'arrivée du médecin. Protégez la zone et signalez immédiatement à la direction de course.",
  },
];

export default function RolesPage() {
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

          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#FF5A1F]">Organisation</p>
          <h1 className="mt-4 text-4xl font-black text-zinc-900 lg:text-6xl">Les rôles</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-600">
            Sur une épreuve motorsport, chaque officiel a un rôle précis. Comprendre
            la hiérarchie et les missions de chacun est essentiel pour travailler efficacement en équipe.
          </p>

          {/* Hierarchy banner */}
          <div className="mt-10 overflow-x-auto">
            <div className="flex min-w-max items-center gap-3 rounded-[24px] border border-zinc-200 bg-white shadow-sm px-6 py-4">
              <div className="text-center">
                <p className="text-lg">👑</p>
                <p className="mt-1 text-xs font-black text-[#FF5A1F]">Directeur</p>
                <p className="text-xs text-zinc-500">de course</p>
              </div>
              <div className="h-px w-6 bg-zinc-300" />
              <div className="text-center">
                <p className="text-lg">📡</p>
                <p className="mt-1 text-xs font-black text-purple-600">Chef</p>
                <p className="text-xs text-zinc-500">de poste</p>
              </div>
              <div className="h-px w-6 bg-zinc-300" />
              <div className="text-center">
                <p className="text-lg">🚩</p>
                <p className="mt-1 text-xs font-black text-blue-600">Commissaire</p>
                <p className="text-xs text-zinc-500">de piste</p>
              </div>
              <div className="mx-2 h-8 w-px bg-zinc-200" />
              <div className="text-center">
                <p className="text-lg">⚖️</p>
                <p className="mt-1 text-xs font-black text-yellow-600">Pesage</p>
                <p className="text-xs text-zinc-500">/ Parc fermé</p>
              </div>
              <div className="h-px w-6 bg-zinc-300" />
              <div className="text-center">
                <p className="text-lg">🔧</p>
                <p className="mt-1 text-xs font-black text-red-600">Délégué</p>
                <p className="text-xs text-zinc-500">technique</p>
              </div>
              <div className="h-px w-6 bg-zinc-300" />
              <div className="text-center">
                <p className="text-lg">🏥</p>
                <p className="mt-1 text-xs font-black text-pink-600">Médecin</p>
                <p className="text-xs text-zinc-500">de course</p>
              </div>
            </div>
          </div>

          {/* Role cards */}
          <div className="mt-10 space-y-5">
            {roles.map((role) => (
              <div key={role.title} className={`rounded-[28px] border p-6 lg:p-8 ${role.color}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{role.icon}</span>
                    <div>
                      <h2 className="text-xl font-black text-zinc-900 lg:text-2xl">{role.title}</h2>
                      <p className="mt-0.5 text-sm text-zinc-500">{role.license}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.1em] ${role.badgeColor}`}>
                    {role.code}
                  </span>
                </div>

                <p className="mt-4 leading-relaxed text-zinc-600">{role.description}</p>

                <div className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">Missions principales</p>
                  <ul className="mt-3 space-y-2">
                    {role.missions.map((m) => (
                      <li key={m} className="flex items-start gap-2 text-sm text-zinc-700">
                        <span className="mt-1 shrink-0 text-[#FF5A1F]">→</span>
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 flex items-start gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3">
                  <span className="shrink-0 text-sm">💡</span>
                  <p className="text-sm text-zinc-600">{role.tip}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Sources */}
          <div className="mt-14 flex items-start gap-3 rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm">
            <span className="shrink-0 text-lg">📄</span>
            <p className="text-sm leading-relaxed text-zinc-500">
              <span className="font-bold text-zinc-700">Sources :</span>{" "}
              Règlement Général des Épreuves Automobile FFSA — Généralités 2024 (Art. 3 — Organisation et rôles des officiels) · Règlement Sportif FFSA 2025 · Dossier Candidat Commissaire de Piste FFM — Version janvier 2023.
              Ces contenus sont fournis à titre pédagogique — les attributions peuvent varier selon les règlements particuliers de chaque épreuve.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-14 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/devenir-commissaire/procedures"
              className="flex-1 rounded-2xl border border-zinc-200 bg-white px-6 py-4 text-center font-bold text-zinc-700 transition hover:bg-zinc-50"
            >
              📋 Les procédures →
            </Link>
            <Link
              href="/devenir-commissaire/devenir-commissaire"
              className="flex-1 rounded-2xl bg-[#FF5A1F] px-6 py-4 text-center font-bold text-white transition hover:opacity-90"
            >
              Obtenir ma licence →
            </Link>
          </div>

        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
