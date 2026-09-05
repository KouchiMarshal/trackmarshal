import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Procédures de course : Safety Car, VSC, FCY, Code 60",
  description:
    "Les neutralisations expliquées pas à pas : Safety Car, Virtual Safety Car, Full Course Yellow, Code 60/80, drapeau rouge, procédures de départ. Repères essentiels du commissaire de piste.",
  keywords: [
    "safety car procédure",
    "virtual safety car",
    "full course yellow",
    "code 60 course",
    "neutralisation course",
    "procédures commissaire",
  ],
  alternates: { canonical: "/devenir-commissaire/procedures" },
  openGraph: {
    title: "Procédures de course : Safety Car, VSC, FCY, Code 60 | TrackMarshal",
    description:
      "Comprendre les neutralisations en course automobile : SC, VSC, FCY, Code 60, drapeau rouge et départs.",
    url: "https://www.trackmarshal.app/devenir-commissaire/procedures",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LearningResource",
      name: "Procédures et neutralisations de course",
      description:
        "Guide des procédures de course (Safety Car, VSC, FCY, Code 60) pour commissaires de piste.",
      url: "https://www.trackmarshal.app/devenir-commissaire/procedures",
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
        { "@type": "ListItem", position: 2, name: "Les procédures", item: "https://www.trackmarshal.app/devenir-commissaire/procedures" },
      ],
    },
  ],
};

export default function ProceduresLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
