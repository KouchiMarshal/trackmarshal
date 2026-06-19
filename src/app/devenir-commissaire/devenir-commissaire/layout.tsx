import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comment devenir commissaire de piste motorsport — FFSA et FFM",
  description:
    "Les étapes pour devenir commissaire de piste en France : rejoindre une ASA ou un club FFM, formation e-learning, épreuves en observateur, licence ENCOC (FFSA) ou OFS (FFM). Guide complet 2026.",
  alternates: { canonical: "/devenir-commissaire/devenir-commissaire" },
  openGraph: {
    title: "Comment devenir commissaire de piste motorsport — FFSA et FFM",
    description:
      "Guide complet pour devenir commissaire motorsport en France : étapes, formations, licences FFSA (circuit, rallye, karting) et FFM (moto).",
  },
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Comment devenir commissaire de piste motorsport",
  description:
    "Les étapes officielles pour obtenir une licence de commissaire de piste en France (FFSA pour l'automobile, FFM pour la moto).",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Rejoindre une ASA ou un club FFM",
      text: "L'ASA (Association Sportive Automobile) est le club local affilié à la FFSA. Pour la moto, rejoignez un club FFM affilié près de chez vous. Ces clubs sont votre point d'entrée obligatoire pour obtenir votre licence.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Suivre la formation initiale",
      text: "La FFSA propose une plateforme e-learning sur ffsa.org pour les primo-licenciés. La FFM propose des formations via les Ligues régionales. Les modules couvrent les drapeaux, procédures de sécurité et le rôle du commissaire.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Participer à des épreuves en observateur",
      text: "Avant d'officier seul, accompagnez des commissaires expérimentés sur 2 à 3 épreuves. Vous apprenez les gestes, positionnements et procédures réelles sur le terrain.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Obtenir votre première licence",
      text: "FFSA : licence ENCOC (Commissaire C), qui permet d'officier sur les épreuves nationales. FFM : licence OFS (Officiel Stagiaire), pour officier sous supervision d'un officiel expérimenté.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Progresser vers les grades supérieurs",
      text: "FFSA : évolution vers EICOB (international B) puis Chef de Poste (EICOACPC circuit ou EICOACPR route). FFM : licence OFF pour officier en autonomie sur toutes les épreuves moto.",
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      {children}
    </>
  );
}
