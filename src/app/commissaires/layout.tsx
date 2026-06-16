import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Annuaire des commissaires de piste",
  description:
    "Trouvez des commissaires de piste FFSA disponibles en France. Filtrez par discipline (rallye, circuit, karting), localisation et disponibilité.",
  openGraph: {
    title: "Annuaire commissaires de piste — TrackMarshal",
    description:
      "Retrouvez les commissaires de piste FFSA disponibles et qualifiés pour vos événements motorsport.",
    url: "https://www.trackmarshal.app/commissaires",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Annuaire commissaires motorsport — TrackMarshal" }],
  },
  alternates: { canonical: "/commissaires" },
};

export default function CommissairesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
