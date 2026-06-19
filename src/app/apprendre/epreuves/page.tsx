import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";

const disciplines = [
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
    tenueBadge: "bg-red-100 text-red-700 border-red-200",
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
    borderColor: "border-red-200",
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
    tenueBadge: "bg-red-100 text-red-700 border-red-200",
  },
];

const saviez = [
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
];

export default function EpreuvesPage() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicNavbar />

      <section className="relative pt-36 pb-24">
        <div className="relative z-10 mx-auto max-w-[1100px] px-6 lg:px-10">

          <div className="mb-4">
            <Link href="/apprendre" className="text-sm text-zinc-500 transition hover:text-zinc-900">
              ← Espace pédagogique
            </Link>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#FF5A1F]">Disciplines</p>
          <h1 className="mt-4 text-4xl font-black text-zinc-900 lg:text-6xl">Les types d&apos;épreuves</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-600">
            Circuit, rallye, côte, karting... Chaque discipline a ses propres codes, procédures et
            exigences pour le commissaire.
          </p>

          {/* Discipline grid */}
          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
              {saviez.map((s) => (
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

        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
