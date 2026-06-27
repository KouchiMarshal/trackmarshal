import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez l'équipe TrackMarshal pour toute question sur la plateforme commissaires motorsport.",
  openGraph: {
    title: "Contact — TrackMarshal",
    description:
      "Contactez l'équipe TrackMarshal pour toute question sur la plateforme commissaires motorsport.",
    url: "https://www.trackmarshal.app/contact",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "TrackMarshal — Contact" }],
  },
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
