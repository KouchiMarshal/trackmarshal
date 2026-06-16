import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devenir commissaire motorsport (FFSA / FFM)",
  description:
    "Guide complet pour devenir commissaire auto (FFSA) ou moto (FFM) en France : licences, formations officielles, étapes pour débuter et trouver vos premières missions.",
  keywords: [
    "devenir commissaire motorsport",
    "licence commissaire FFSA",
    "licence commissaire FFM",
    "commissaire auto",
    "commissaire moto",
    "OFS FFM",
    "OFF FFM",
    "formation commissaire",
    "commissaire débutant",
  ],
  openGraph: {
    title: "Devenir commissaire auto ou moto — TrackMarshal",
    description:
      "Tout savoir sur les licences FFSA (auto) et FFM (moto), les formations officielles et les étapes pour débuter le commissariat motorsport en France.",
    url: "https://www.trackmarshal.app/devenir-commissaire",
  },
  alternates: { canonical: "/devenir-commissaire" },
};

export default function DevenirCommissaireLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
