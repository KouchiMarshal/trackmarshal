import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";

const flags = [
  {
    name: "Drapeau rouge",
    visual: "bg-red-600",
    situation: "Arrêt immédiat de la séance",
    description: "La session est interrompue en raison d'un accident grave, d'une obstruction sur la piste ou de conditions météo dangereuses. Tous les concurrents doivent ralentir immédiatement et rejoindre les stands ou la grille.",
    reaction: "Agiter vigoureusement. Le commissaire reste en position jusqu'à la reprise ou la fin de session.",
    category: "Danger extrême",
    categoryColor: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  {
    name: "Drapeau jaune (agité)",
    visual: "bg-yellow-400",
    situation: "Danger immédiat — ralentir, ne pas dépasser",
    description: "Un danger direct est présent sur la piste ou à ses abords immédiats : véhicule accidenté, commissaire sur la piste, débris importants. Les pilotes doivent ralentir et se tenir prêts à s'arrêter.",
    reaction: "Agiter vigoureusement. Positionné sur la trajectoire du danger.",
    category: "Danger",
    categoryColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  {
    name: "Drapeau jaune (fixe)",
    visual: "bg-yellow-400",
    situation: "Danger — ralentir, se préparer",
    description: "Un danger est présent mais moins immédiat que le jaune agité. Présente en amont du danger pour avertir les concurrents de la zone à risque.",
    reaction: "Tenir fixe, bras tendu. Annonce le jaune agité qui suit.",
    category: "Avertissement",
    categoryColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  {
    name: "Drapeau vert",
    visual: "bg-green-500",
    situation: "Voie libre — reprendre la vitesse normale",
    description: "La zone de danger est dégagée. Les concurrents peuvent reprendre leur rythme normal de course après une zone de drapeaux jaunes.",
    reaction: "Agiter à l'entrée de la zone dégagée, après la fin du danger.",
    category: "Autorisation",
    categoryColor: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  {
    name: "Drapeau damier",
    visual: "bg-[length:20px_20px]",
    visualClass: "bg-[conic-gradient(#000_90deg,#fff_90deg_180deg,#000_180deg_270deg,#fff_270deg)]",
    situation: "Fin de course ou de session",
    description: "Présenté au vainqueur lors du passage sous le drapeau, puis à tous les concurrents suivants. Marque la fin officielle de l'épreuve.",
    reaction: "Agiter vigoureusement au passage du premier concurrent, puis des suivants.",
    category: "Fin de session",
    categoryColor: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
  },
  {
    name: "Drapeau bleu",
    visual: "bg-blue-600",
    situation: "Laisser passer un concurrent plus rapide",
    description: "Présenté à un concurrent qui est sur le point d'être doublé par un pilote plus rapide (généralement un leader en train de doubler). Le pilote doit laisser passage sans retarder le concurrent plus rapide.",
    reaction: "Agiter. Le pilote doit céder le passage à l'épreuve suivante.",
    category: "Information",
    categoryColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  {
    name: "Drapeau noir (avec numéro)",
    visual: "bg-black border border-white/20",
    situation: "Exclusion du concurrent désigné",
    description: "Présenté avec un panneau indiquant le numéro du concurrent exclu. Le pilote doit rejoindre immédiatement les stands. L'exclusion peut être due à une infraction au règlement sportif.",
    reaction: "Tenu fixe avec le panneau numéro. Ne concerne qu'un seul concurrent.",
    category: "Exclusion",
    categoryColor: "bg-zinc-800/50 text-zinc-300 border-zinc-600/30",
  },
  {
    name: "Drapeau noir et orange",
    visual: "from-black to-orange-500 bg-gradient-to-r",
    situation: "Problème mécanique — rejoindre les stands",
    description: "Également appelé 'drapeau meatball'. Présenté avec le numéro du concurrent dont le véhicule présente un problème mécanique apparent susceptible de constituer un danger (fuite d'huile, pièce détachée...).",
    reaction: "Tenu fixe avec panneau numéro. Le pilote doit rejoindre les stands au tour suivant.",
    category: "Mécanique",
    categoryColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
  {
    name: "Drapeau jaune et rouge rayé",
    visual: "from-yellow-400 to-red-600 bg-gradient-to-b",
    situation: "Piste glissante ou contaminée",
    description: "Indique que la piste est rendue glissante par de l'huile, de l'eau, des débris ou tout autre substance. Les concurrents doivent adapter leur conduite en conséquence.",
    reaction: "Agiter. Présenté dans les zones concernées par la contamination.",
    category: "Avertissement",
    categoryColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  {
    name: "Drapeau blanc",
    visual: "bg-white",
    situation: "Véhicule lent sur la piste",
    description: "Signale la présence d'un véhicule lent sur la piste : voiture de sécurité, véhicule de service, ambulance ou concurrent en difficulté roulant très lentement.",
    reaction: "Tenu fixe. Les concurrents doivent être vigilants au véhicule lent.",
    category: "Information",
    categoryColor: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
  },
  {
    name: "Drapeau noir et blanc diagonal",
    visual: "from-white to-black bg-gradient-to-br",
    situation: "Avertissement pour conduite antisportive",
    description: "Présenté avec le numéro du concurrent. Premier et unique avertissement pour comportement contraire à l'esprit sportif. La répétition de l'infraction entraîne le drapeau noir.",
    reaction: "Tenu fixe avec panneau numéro. Uniquement présenté une fois.",
    category: "Avertissement sportif",
    categoryColor: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
  },
];

export default function DrapeauxPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <PublicNavbar />

      <section className="relative pt-36 pb-24">
        <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-[#FF5A1F]/8 blur-[160px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-[1100px] px-6 lg:px-10">

          <div className="mb-4">
            <Link href="/apprendre" className="text-sm text-zinc-500 transition hover:text-white">
              ← Espace pédagogique
            </Link>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#FF5A1F]">Lexique</p>
          <h1 className="mt-4 text-4xl font-black lg:text-6xl">Les drapeaux</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Chaque drapeau a une signification précise. Un commissaire doit les connaître
            par cœur — réagir au mauvais moment peut coûter des vies.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <Link
              href="/apprendre/quiz/drapeaux"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#FF5A1F] px-5 py-3 text-sm font-bold transition hover:opacity-90"
            >
              🎯 Tester mes connaissances
            </Link>
          </div>

          <div className="mt-14 space-y-5">
            {flags.map((flag) => (
              <div
                key={flag.name}
                className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.02] transition hover:border-white/20"
              >
                <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start lg:p-8">

                  {/* Flag visual */}
                  <div className="shrink-0">
                    <div className={`h-20 w-32 rounded-2xl border border-white/10 ${flag.visualClass || flag.visual} sm:h-24 sm:w-36`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start gap-3">
                      <h2 className="text-xl font-black lg:text-2xl">{flag.name}</h2>
                      <span className={`rounded-full border px-3 py-1 text-xs font-bold ${flag.categoryColor}`}>
                        {flag.category}
                      </span>
                    </div>

                    <p className="mt-2 text-base font-bold text-[#FF5A1F]">{flag.situation}</p>
                    <p className="mt-3 leading-relaxed text-zinc-400">{flag.description}</p>

                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">Geste du commissaire</p>
                      <p className="mt-1 text-sm text-zinc-300">{flag.reaction}</p>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
