import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Annuaire des commissaires motorsport",
  description:
    "Trouvez des commissaires auto (FFSA) et moto (FFM) disponibles en France. Filtrez par discipline (rallye, circuit, karting, moto cross, enduro…), localisation et disponibilité.",
  openGraph: {
    title: "Annuaire commissaires auto et moto — TrackMarshal",
    description:
      "Retrouvez les commissaires FFSA (auto) et FFM (moto) disponibles et qualifiés pour vos événements motorsport.",
    url: "https://www.trackmarshal.app/commissaires",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Annuaire commissaires motorsport — TrackMarshal" }],
  },
  alternates: { canonical: "/commissaires" },
};

export default function CommissairesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
