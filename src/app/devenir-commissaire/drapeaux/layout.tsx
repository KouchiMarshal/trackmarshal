import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Les drapeaux en course : signification et présentation",
  description:
    "Tous les drapeaux du sport automobile expliqués : rouge, jaune (fixe/agité), bleu, vert, blanc, damier, drapeaux noirs. Signification, mode de présentation et rôle du commissaire de piste.",
  keywords: [
    "drapeaux course",
    "drapeau jaune signification",
    "drapeau bleu course",
    "drapeaux commissaire de piste",
    "signalisation piste",
    "drapeau rouge course",
  ],
  alternates: { canonical: "/devenir-commissaire/drapeaux" },
  openGraph: {
    title: "Les drapeaux en course : signification et présentation | TrackMarshal",
    description:
      "Le guide complet des drapeaux du sport automobile : couleurs, modes de présentation et consignes pour le commissaire de piste.",
    url: "https://www.trackmarshal.app/devenir-commissaire/drapeaux",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LearningResource",
      name: "Les drapeaux en course",
      description:
        "Guide des drapeaux du sport automobile pour commissaires de piste : signification et présentation.",
      url: "https://www.trackmarshal.app/devenir-commissaire/drapeaux",
      learningResourceType: "Guide",
      educationalLevel: "Débutant",
      inLanguage: "fr",
      isAccessibleForFree: true,
      provider: { "@type": "Organization", name: "TrackMarshal", url: "https://www.trackmarshal.app" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Espace pédagogique", item: "https://www.trackmarshal.app/devenir-commissaire" },
        { "@type": "ListItem", position: 2, name: "Les drapeaux", item: "https://www.trackmarshal.app/devenir-commissaire/drapeaux" },
      ],
    },
  ],
};

export default function DrapeauxLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
