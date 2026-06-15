import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Événements motorsport",
  description:
    "Parcourez tous les événements motorsport en France recherchant des commissaires de piste : rallyes, circuits, karting, drift. Postulez en un clic.",
  openGraph: {
    title: "Événements motorsport — TrackMarshal",
    description:
      "Tous les événements motorsport qui cherchent des commissaires de piste en France.",
    url: "https://www.trackmarshal.app/events",
  },
  alternates: { canonical: "/events" },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
