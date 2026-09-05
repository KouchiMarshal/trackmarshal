import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos — la mission de TrackMarshal",
  description:
    "TrackMarshal rend l'apprentissage du métier de commissaire de piste accessible à tous : fiches, quiz et assistant IA, gratuitement. Projet indépendant, sans lien officiel avec la FFSA ou la FFM.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "À propos — la mission de TrackMarshal",
    description:
      "Un espace pédagogique gratuit pour apprendre le commissariat de piste. Projet indépendant au service de la communauté motorsport.",
    url: "https://www.trackmarshal.app/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
