import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";

const steps = [
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
    description: "Première licence officiel FFM pour les épreuves moto.",
    access: "Épreuves moto régionales",
  },
  {
    code: "OFF",
    name: "Officiel",
    federation: "FFM",
    color: "border-orange-200 bg-orange-50",
    badgeColor: "bg-orange-100 text-orange-700",
    description: "Licence officiel FFM confirmé, toutes épreuves moto.",
    access: "Toutes épreuves moto",
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
    a: "Oui. La combinaison en coton (orange ou rouge selon l'organisateur) est la tenue de référence sur circuit — elle protège du feu et identifie le commissaire. Sur épreuves route et karting, une chasuble facilement identifiable est souvent utilisée. L'organisateur précise la tenue attendue au briefing.",
  },
];

export default function DevenirCommissairePage() {
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

          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#FF5A1F]">Guide</p>
          <h1 className="mt-4 text-4xl font-black text-zinc-900 lg:text-6xl">Devenir commissaire</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-600">
            Le commissaire de piste est un acteur essentiel de la sécurité en compétition motorsport.
            Voici le chemin pour obtenir votre licence et rejoindre cette communauté.
          </p>

          {/* Étapes */}
          <div className="mt-16">
            <h2 className="text-2xl font-black text-zinc-900 lg:text-3xl">Les étapes</h2>
            <div className="mt-8 space-y-4">
              {steps.map((step) => (
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
            <p className="mt-3 text-zinc-600">FFSA pour l'automobile, FFM pour la moto — deux fédérations, deux parcours.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {licenses.map((lic) => (
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
                href="/apprendre/quiz/drapeaux"
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
