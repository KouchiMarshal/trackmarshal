import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lexique du sport automobile : tous les termes expliqués",
  description:
    "Le vocabulaire du sport automobile et du commissariat de piste expliqué simplement : PC course, ES, grille, paddock, warm-up, formation lap et bien plus. Idéal pour débuter.",
  keywords: [
    "lexique sport automobile",
    "vocabulaire course automobile",
    "termes rallye",
    "glossaire motorsport",
    "définition commissaire de piste",
  ],
  alternates: { canonical: "/devenir-commissaire/lexique" },
  openGraph: {
    title: "Lexique du sport automobile : tous les termes expliqués | TrackMarshal",
    description:
      "Le glossaire du sport automobile pour comprendre le vocabulaire de la course et du commissariat de piste.",
    url: "https://www.trackmarshal.app/devenir-commissaire/lexique",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LearningResource",
      name: "Lexique du sport automobile",
      description: "Glossaire des termes du sport automobile et du commissariat de piste.",
      url: "https://www.trackmarshal.app/devenir-commissaire/lexique",
      learningResourceType: "Glossaire",
      educationalLevel: "Débutant",
      inLanguage: "fr",
      isAccessibleForFree: true,
      provider: { "@type": "Organization", name: "TrackMarshal", url: "https://www.trackmarshal.app" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Espace pédagogique", item: "https://www.trackmarshal.app/devenir-commissaire" },
        { "@type": "ListItem", position: 2, name: "Lexique", item: "https://www.trackmarshal.app/devenir-commissaire/lexique" },
      ],
    },
  ],
};

export default function LexiqueLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
