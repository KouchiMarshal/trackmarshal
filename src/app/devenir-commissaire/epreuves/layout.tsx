import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Les épreuves motorsport : circuit, rallye, côte, karting",
  description:
    "Circuit, rallye, course de côte, karting, rallycross, drift… Les spécificités de chaque discipline du sport automobile et le rôle du commissaire de piste dans chacune.",
  keywords: [
    "disciplines sport automobile",
    "épreuves motorsport",
    "course de côte",
    "rallye commissaire",
    "karting commissaire",
    "types de courses automobiles",
  ],
  alternates: { canonical: "/devenir-commissaire/epreuves" },
  openGraph: {
    title: "Les épreuves motorsport : circuit, rallye, côte, karting | TrackMarshal",
    description:
      "Découvrez les disciplines du sport automobile et le rôle du commissaire de piste dans chacune.",
    url: "https://www.trackmarshal.app/devenir-commissaire/epreuves",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LearningResource",
      name: "Les épreuves motorsport",
      description: "Les disciplines du sport automobile et le rôle du commissaire de piste.",
      url: "https://www.trackmarshal.app/devenir-commissaire/epreuves",
      learningResourceType: "Guide",
      educationalLevel: "Intermédiaire",
      inLanguage: "fr",
      isAccessibleForFree: true,
      provider: { "@type": "Organization", name: "TrackMarshal", url: "https://www.trackmarshal.app" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Espace pédagogique", item: "https://www.trackmarshal.app/devenir-commissaire" },
        { "@type": "ListItem", position: 2, name: "Les épreuves", item: "https://www.trackmarshal.app/devenir-commissaire/epreuves" },
      ],
    },
  ],
};

export default function EpreuvesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
