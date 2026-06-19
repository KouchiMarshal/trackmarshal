import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";

const flags = [
  {
    name: "Drapeau rouge",
    img: "/flags/rouge.svg",
    situation: "Arrêt immédiat de la séance",
    description: "La session est interrompue en raison d'un accident grave, d'une obstruction sur la piste ou de conditions météo dangereuses. Tous les concurrents doivent ralentir immédiatement et rejoindre les stands ou la grille. Dimensions : 100×80 cm (plus grand que les autres drapeaux).",
    reaction: "Agiter vigoureusement depuis la ligne de départ ET tous les postes sur ordre de la DC. Le commissaire reste en position jusqu'à ce qu'il n'y ait plus de voiture en piste.",
    category: "Danger extrême",
    categoryColor: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  {
    name: "Drapeau jaune (1 drapeau agité)",
    img: "/flags/jaune.svg",
    situation: "Danger sur le bord ou une partie de la piste — ralentir, ne pas dépasser",
    description: "Un danger est présent sur le bord ou sur une partie de la piste (véhicule accidenté, commissaire à proximité, débris). Les pilotes doivent réduire leur vitesse et être prêts à changer de direction. Tout dépassement est formellement interdit jusqu'à la fin de la zone de danger.",
    reaction: "Agiter vigoureusement au poste précédant le danger. Peut être présenté 2 tours consécutifs pour un obstacle non retiré.",
    category: "Danger",
    categoryColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  {
    name: "Double drapeau jaune (2 drapeaux agités)",
    img: "/flags/jaune.svg",
    situation: "Danger majeur sur la trajectoire — réduire considérablement la vitesse, prêt à s'arrêter",
    description: "Danger qui obstrue partiellement ou totalement la piste, ou des commissaires interviennent directement sur ou en bord de piste. Les deux drapeaux sont agités par le même commissaire au poste précédant immédiatement le danger. Tout dépassement est strictement interdit.",
    reaction: "Agiter les deux drapeaux simultanément. Présenté uniquement au poste immédiatement avant l'endroit dangereux.",
    category: "Danger majeur",
    categoryColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  {
    name: "Drapeau vert",
    img: "/flags/vert.svg",
    situation: "Voie libre — reprendre la vitesse normale",
    description: "La zone de danger est dégagée. Les concurrents peuvent reprendre leur rythme normal de course après une zone de drapeaux jaunes.",
    reaction: "Agiter à l'entrée de la zone dégagée, après la fin du danger.",
    category: "Autorisation",
    categoryColor: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  {
    name: "Drapeau damier",
    img: "/flags/damier.svg",
    situation: "Fin de course ou de session",
    description: "Présenté au vainqueur lors du passage sous le drapeau, puis à tous les concurrents suivants. Marque la fin officielle de l'épreuve.",
    reaction: "Agiter vigoureusement au passage du premier concurrent, puis des suivants.",
    category: "Fin de session",
    categoryColor: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
  },
  {
    name: "Drapeau bleu",
    img: "/flags/bleu.svg",
    situation: "Laisser passer un concurrent plus rapide",
    description: "Présenté à un concurrent qui est sur le point d'être doublé par un pilote plus rapide (généralement un leader en train de doubler). Le pilote doit laisser passage sans retarder le concurrent plus rapide.",
    reaction: "Agiter. Le pilote doit céder le passage à l'épreuve suivante.",
    category: "Information",
    categoryColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  {
    name: "Drapeau noir (avec numéro)",
    img: "/flags/noir.svg",
    situation: "Exclusion du concurrent désigné",
    description: "Présenté avec un panneau indiquant le numéro du concurrent exclu. Le pilote doit rejoindre immédiatement les stands. L'exclusion peut être due à une infraction au règlement sportif.",
    reaction: "Tenu fixe avec le panneau numéro. Ne concerne qu'un seul concurrent.",
    category: "Exclusion",
    categoryColor: "bg-zinc-800/50 text-zinc-300 border-zinc-600/30",
  },
  {
    name: "Drapeau noir et orange",
    img: "/flags/meatball.svg",
    situation: "Problème mécanique — rejoindre les stands",
    description: "Également appelé 'drapeau meatball'. Présenté avec le numéro du concurrent dont le véhicule présente un problème mécanique apparent susceptible de constituer un danger (fuite d'huile, pièce détachée...).",
    reaction: "Tenu fixe avec panneau numéro. Le pilote doit rejoindre les stands au tour suivant.",
    category: "Mécanique",
    categoryColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
  {
    name: "Drapeau jaune et rouge rayé",
    img: "/flags/jaune-rouge.svg",
    situation: "Piste glissante ou contaminée en aval du poste",
    description: "Avertit les concurrents d'une détérioration de l'adhérence sur la piste en aval du poste : huile, eau, débris ou autre substance glissante. Sur circuit asphalte, présenté au maximum durant 4 tours ; sur circuits tout-terrain, uniquement sur les parties revêtues. Accompagné d'une main levée vers le ciel pour signaler le début d'une averse.",
    reaction: "Tenir FIXE au poste. Aucun drapeau vert n'est présenté à la suite de ce drapeau.",
    category: "Avertissement",
    categoryColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  {
    name: "Drapeau blanc",
    img: "/flags/blanc.svg",
    situation: "Véhicule lent sur la piste",
    description: "Signale la présence d'un véhicule lent sur la piste : voiture de sécurité, véhicule de service, ambulance ou concurrent en difficulté roulant très lentement.",
    reaction: "Tenu fixe. Les concurrents doivent être vigilants au véhicule lent.",
    category: "Information",
    categoryColor: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
  },
  {
    name: "Drapeau noir et blanc diagonal",
    img: "/flags/noir-blanc.svg",
    situation: "Avertissement pour conduite antisportive",
    description: "Présenté avec le numéro du concurrent. Premier et unique avertissement pour comportement contraire à l'esprit sportif. La répétition de l'infraction entraîne le drapeau noir.",
    reaction: "Tenu fixe avec panneau numéro. Uniquement présenté une fois.",
    category: "Avertissement sportif",
    categoryColor: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
  },
  {
    name: "Drapeau Code 60 (violet)",
    img: "/flags/code60.svg",
    situation: "Limitation de vitesse à 60 km/h sur tout le circuit",
    description: "Drapeau violet avec un cercle blanc contenant le chiffre « 60 ». Imposé par le directeur de course lorsque deux drapeaux jaunes sont présentés. Limite la vitesse à 60 km/h sur l'ensemble du circuit. Chaque tour sous Code 60 compte comme un tour de course.",
    reaction: "Agiter sur la ligne de départ et à tous les postes simultanément, puis maintenir FIXE une fois les voitures ralenties. Retiré sur ordre DC et remplacé par le drapeau vert agité.",
    category: "Neutralisation",
    categoryColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
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
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 inline-flex flex-wrap gap-x-6 gap-y-1 text-sm text-zinc-400">
            <span><span className="font-bold text-white">Drapeau rouge :</span> 100 × 80 cm</span>
            <span><span className="font-bold text-white">Autres drapeaux :</span> 80 × 60 cm</span>
          </div>

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

                  {/* Flag image */}
                  <div className="shrink-0">
                    <img
                      src={flag.img}
                      alt={flag.name}
                      className="h-20 w-32 rounded-2xl border border-white/10 object-cover sm:h-24 sm:w-36"
                    />
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
