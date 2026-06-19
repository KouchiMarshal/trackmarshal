import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";

const circuitItems = [
  {
    emoji: "🦺",
    name: "Combinaison en coton",
    description:
      "La combinaison en coton est votre premier élément de protection sur circuit (Art. 2.6 Annexe H). Sa couleur orange ou rouge permet aux pilotes de vous identifier immédiatement. Pour votre sécurité : manches baissées, zip fermé tant que les voitures évoluent. Pour les épreuves nocturnes, deux bandes de visibilité d'au moins 5 cm doivent être cousues au bas des jambes.",
  },
  {
    emoji: "👟",
    name: "Chaussures de sécurité montantes",
    description:
      "Elles maintiennent bien la cheville et sont idéalement des chaussures de sécurité. Préférez des bottes lors des épreuves se déroulant sous la pluie. Les talons ouverts sont proscrits sur circuit.",
  },
  {
    emoji: "🧤",
    name: "Gants type soudeur",
    description:
      "À enfiler tant que les voitures évoluent sur la piste. Des pièces de véhicule peuvent être brûlantes et/ou coupantes lors d'une intervention. Des gants diélectriques ou composites sont recommandés si des véhicules électriques ou hybrides participent.",
  },
  {
    emoji: "🎽",
    name: "Chasuble réfléchissante (nuit)",
    description:
      "Lors des épreuves nocturnes, une chasuble réfléchissante est obligatoire pour être identifié rapidement par les pilotes en cas d'intervention sur la piste. Des plaques réfléchissantes remplacent les drapeaux dans l'obscurité.",
  },
];

const routeItems = [
  {
    emoji: "🦺",
    name: "Combinaison en coton ou chasuble",
    description:
      "Sur les épreuves de route (rallye, course de côte), la combinaison en coton reste l'équipement de référence. Certains organisateurs fournissent une chasuble facilement identifiable. Vérifiez toujours au briefing le type attendu.",
  },
  {
    emoji: "👟",
    name: "Chaussures de sécurité montantes",
    description:
      "En forêt ou sur route ouverte, privilégiez des chaussures imperméables avec un bon maintien de cheville. Des bottes s'imposent par temps pluvieux.",
  },
  {
    emoji: "🌧️",
    name: "Vêtements de pluie",
    description:
      "En deux parties (veste + pantalon) pour plus de confort. La météo peut évoluer rapidement sur une épreuve de route. Prévoyez systématiquement imperméable léger et bonnet.",
  },
  {
    emoji: "🧤",
    name: "Gants de travail",
    description:
      "Pour manipuler les barrières, la signalisation ou les véhicules accidentés sans risque de brûlure ou de coupure.",
  },
];

const essentielsItems = [
  {
    emoji: "🪪",
    name: "Licence FFSA ou FFM valide",
    description:
      "À avoir sur soi à tout moment et à présenter à toute demande. Sans licence, vous ne pouvez pas officier. Renouvelez-la chaque saison.",
  },
  {
    emoji: "📢",
    name: "Sifflet",
    description:
      "Pour se faire entendre lors d'une intervention ou pour signaler la venue d'une voiture à vos co-équipiers. Indispensable en poste, en complément de la radio.",
  },
  {
    emoji: "✂️",
    name: "Coupe-sangle",
    description:
      "Outil de sécurité permettant de couper rapidement les sangles ou ceintures d'un pilote coincé dans son véhicule. À emporter systématiquement en poste.",
  },
  {
    emoji: "💧",
    name: "Eau et alimentation",
    description:
      "Les postes peuvent être isolés plusieurs heures. Prévoyez 1,5L d'eau minimum par journée et des biscuits. Les organisateurs offrent souvent les repas — vérifiez au briefing.",
  },
  {
    emoji: "☀️",
    name: "Protection solaire",
    description:
      "Journées en extérieur, souvent sans abri. SPF 50+ et lunettes de soleil sont indispensables en été.",
  },
  {
    emoji: "🔦",
    name: "Lampe torche",
    description:
      "Pour les épreuves nocturnes ou les fins de journée. Privilégiez un modèle frontal pour garder les mains libres.",
  },
  {
    emoji: "📻",
    name: "Radio / oreillette",
    description:
      "Fournie par l'organisateur sur la plupart des épreuves. Vérifiez la procédure de check radio au briefing.",
  },
  {
    emoji: "📋",
    name: "Carnet et stylo",
    description:
      "Pour noter le passage des voitures (numéros, incidents) et remplir les fiches de poste si demandé. Une montre synchronisée sur l'heure donnée par la DC est aussi précieuse.",
  },
];

export default function EquipementPage() {
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

          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#FF5A1F]">Matériel</p>
          <h1 className="mt-4 text-4xl font-black lg:text-6xl">L&apos;équipement</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Tout ce qu&apos;il faut prévoir avant de vous présenter sur une épreuve — du matériel
            obligatoire aux petits plus qui changent tout.
          </p>

          {/* Section 1 : Circuit */}
          <div className="mt-16">
            <h2 className="text-2xl font-black lg:text-3xl">Sur circuit — obligatoire</h2>
            <div className="mt-8 space-y-4">
              {circuitItems.map((item) => (
                <div
                  key={item.name}
                  className="rounded-[28px] border border-[#FF5A1F]/30 bg-white/[0.02] p-6 lg:p-8"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <span className="shrink-0 text-4xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-black">{item.name}</h3>
                        <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400">
                          Obligatoire
                        </span>
                      </div>
                      <p className="mt-2 leading-relaxed text-zinc-400">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2 : Route */}
          <div className="mt-16">
            <h2 className="text-2xl font-black lg:text-3xl">Sur épreuves route — rallye, course de côte</h2>
            <div className="mt-8 space-y-4">
              {routeItems.map((item) => (
                <div
                  key={item.name}
                  className="rounded-[28px] border border-blue-500/30 bg-white/[0.02] p-6 lg:p-8"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <span className="shrink-0 text-4xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-black">{item.name}</h3>
                        <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400">
                          Obligatoire
                        </span>
                      </div>
                      <p className="mt-2 leading-relaxed text-zinc-400">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3 : Essentiels */}
          <div className="mt-16">
            <h2 className="text-2xl font-black lg:text-3xl">Dans tous les cas — les essentiels</h2>
            <div className="mt-8 space-y-4">
              {essentielsItems.map((item) => (
                <div
                  key={item.name}
                  className="rounded-[28px] border border-green-500/30 bg-white/[0.02] p-6 lg:p-8"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <span className="shrink-0 text-4xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-black">{item.name}</h3>
                        <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">
                          Toujours
                        </span>
                      </div>
                      <p className="mt-2 leading-relaxed text-zinc-400">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conseil pro */}
          <div className="mt-12 rounded-[28px] border border-[#FF5A1F]/20 bg-[#FF5A1F]/5 p-6 lg:p-8">
            <p className="text-base font-black text-[#FF5A1F]">💡 Conseil pro</p>
            <p className="mt-2 leading-relaxed text-zinc-300">
              Préparez un sac dédié commissaire avec tout ce matériel, prêt à emporter dès la veille.
              Vous gagnerez en sérénité le jour J.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/apprendre/devenir-commissaire"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#FF5A1F] px-6 py-3 font-bold transition hover:opacity-90"
            >
              Voir les licences requises →
            </Link>
            <Link
              href="/apprendre/drapeaux"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-6 py-3 font-bold transition hover:bg-white/5"
            >
              Réviser les drapeaux →
            </Link>
          </div>

        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
