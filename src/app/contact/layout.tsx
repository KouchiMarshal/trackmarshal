import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Une question sur la formation au commissariat de piste, une suggestion ou un partenariat club/ASA ? Contactez l'équipe TrackMarshal.",
  openGraph: {
    title: "Contact — TrackMarshal",
    description:
      "Une question sur la formation au commissariat de piste ou un partenariat club/ASA ? Contactez l'équipe TrackMarshal.",
    url: "https://www.trackmarshal.app/contact",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "TrackMarshal — Contact" }],
  },
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
