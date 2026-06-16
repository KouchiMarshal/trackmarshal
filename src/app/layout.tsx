import type { Metadata } from "next";

import "./globals.css";

import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "TrackMarshal — La plateforme des commissaires motorsport",
    template: "%s | TrackMarshal",
  },
  description:
    "TrackMarshal connecte les commissaires auto (FFSA) et moto (FFM) avec les organisateurs d'événements motorsport en France. Trouvez des missions, gérez vos candidatures, valorisez votre licence.",
  keywords: [
    "commissaire motorsport",
    "commissaire auto",
    "commissaire moto",
    "FFSA",
    "FFM",
    "rallye",
    "circuit",
    "karting",
    "moto cross",
    "enduro",
    "licence commissaire",
    "événements motorsport France",
  ],
  authors: [{ name: "TrackMarshal" }],
  creator: "TrackMarshal",
  metadataBase: new URL("https://www.trackmarshal.app"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.trackmarshal.app",
    siteName: "TrackMarshal",
    title: "TrackMarshal — La plateforme des commissaires motorsport",
    description:
      "Connectez-vous avec des organisateurs motorsport, trouvez des missions de commissaire de piste et gérez votre licence FFSA.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TrackMarshal — Plateforme commissaires motorsport",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrackMarshal — La plateforme des commissaires motorsport",
    description:
      "Trouvez des missions de commissaire de piste motorsport en France.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="fr">

      <body>

        {children}

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0A0A0A",
              color: "#fff",
              border:
                "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              padding: "18px",
            },
          }}
        />

      </body>

    </html>
  );
}