import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Les drapeaux motorsport — Guide complet commissaire",
  description:
    "Signification de chaque drapeau en auto et moto : rouge, jaune, vert, bleu, damier, Code 60, FCY... Usage détaillé par discipline (circuit, rallye, karting, motocross, enduro).",
  alternates: { canonical: "/devenir-commissaire/drapeaux" },
  openGraph: {
    title: "Les drapeaux motorsport — Guide complet commissaire",
    description:
      "Tous les drapeaux utilisés en compétition motorsport France, avec leur usage par discipline. Auto (FFSA) et moto (FFM).",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
