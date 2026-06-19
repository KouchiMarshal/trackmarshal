import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";

const circuitItems = [
  {
    emoji: "🦺",
    name: "Combinaison ignifugée",
    description:
      "Homologuée FIA ou FFSA. Orange ou rouge selon l'organisateur. En aramide (Nomex). Protection contre les projections de carburant et d'huile enflammés. Certains organisateurs la fournissent ; renseignez-vous avant.",
  },
  {
    emoji: "👟",
    name: "Chaussures de sécurité montantes",
    description:
      "Semelles antidérapantes, protection de la cheville. Les talons ouverts sont interdits sur circuit. Préférez des chaussures ignifugées.",
  },
  {
    emoji: "🧤",
    name: "Gants de protection",
    description:
      "Résistants à la chaleur et aux projections. Les gants de jardinage ne suffisent pas. Des gants ignifugés fins permettent de garder de la dextérité.",
  },
  {
    emoji: "🩳",
    name: "Sous-vêtements ignifugés",
    description:
      "Recommandés sous la combinaison. Chaussettes, cagoule, t-shirt en Nomex réduisent considérablement les brûlures en cas d'incident.",
  },
];

const routeItems = [
  {
    emoji: "🦺",
    name: "Gilet haute visibilité",
    description:
      "Généralement fourni par l'organisateur. Obligatoire sur les épreuves route. Vérifiez toujours au briefing la couleur et le type attendu.",
  },
  {
    emoji: "👟",
    name: "Chaussures de sécurité",
    description:
      "Même exigence qu'en circuit. En forêt ou sur route ouverte, privilégiez des chaussures imperméables avec maintien de cheville.",
  },
  {
    emoji: "🌧️",
    name: "Vêtements de pluie",
    description:
      "Une météo capricieuse peut transformer une journée en course de survie. Imperméable léger, pantalon de pluie, et bonnet font partie du kit de base.",
  },
  {
    emoji: "🧤",
    name: "Gants de travail",
    description:
      "Pour manipuler les barrières, la signalisation ou les véhicules accidentés sans risque.",
  },
];

const essentielsItems = [
  {
    emoji: "🪪",
    name: "Licence FFSA ou FFM valide",
    description:
      "À avoir sur soi à tout moment. Sans licence, vous ne pouvez pas officier. Renouvelez-la chaque saison avant janvier.",
  },
  {
    emoji: "💧",
    name: "Eau et alimentation",
    description:
      "Les postes peuvent être isolés. Prévoyez 1,5L d'eau minimum par journée, plus des barres énergétiques. Les organisateurs offrent souvent les repas, mais pas toujours les en-cas.",
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
      "Pour les épreuves nocturnes ou les fins de journée. Privilégiez un modèle à clip frontal pour garder les mains libres.",
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
      "Pour noter le passage des voitures (numéros, incidents) et remplir les fiches de poste si demandé.",
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
