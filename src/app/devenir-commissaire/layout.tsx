import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devenir commissaire de piste FFSA",
  description:
    "Guide complet pour devenir commissaire de piste en France : licences FFSA grades C, B et A, formation e-learning officielle, âge minimum 16 ans, étapes pour obtenir votre première mission.",
  keywords: [
    "devenir commissaire de piste",
    "licence commissaire FFSA",
    "grade C commissaire",
    "formation e-learning FFSA",
    "commissaire piste débutant",
    "comment devenir commissaire motorsport",
  ],
  openGraph: {
    title: "Devenir commissaire de piste FFSA — TrackMarshal",
    description:
      "Tout savoir sur les licences FFSA C, B, A, la formation e-learning officielle et les étapes pour devenir commissaire de piste en France.",
    url: "https://www.trackmarshal.app/devenir-commissaire",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Devenir commissaire motorsport — TrackMarshal" }],
  },
  alternates: { canonical: "/devenir-commissaire" },
};

export default function DevenirCommissaireLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
