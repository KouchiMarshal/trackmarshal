import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "TrackMarshal est la plateforme qui connecte commissaires de piste et organisateurs d'événements motorsport en France. Découvrez notre mission.",
  openGraph: {
    title: "À propos de TrackMarshal",
    description:
      "Découvrez la plateforme qui simplifie le recrutement de commissaires de piste pour le motorsport français.",
    url: "https://www.trackmarshal.app/about",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "À propos de TrackMarshal" }],
  },
  alternates: { canonical: "/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
