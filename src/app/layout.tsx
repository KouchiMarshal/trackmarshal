import type { Metadata } from "next";
import Script from "next/script";

import "./globals.css";

import { Toaster } from "react-hot-toast";
import RegisterSW from "@/components/pwa/register-sw";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const GA_ID = "G-0035L7HCJK";

export const metadata: Metadata = {
  title: {
    default: "TrackMarshal — Apprendre le métier de commissaire de piste",
    template: "%s | TrackMarshal",
  },
  description:
    "Apprenez le métier de commissaire de piste : drapeaux, procédures, sécurité, quiz d'entraînement et assistant IA. Gratuit et sans inscription — auto, moto, karting.",
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
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "TrackMarshal",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.trackmarshal.app",
    siteName: "TrackMarshal",
    title: "TrackMarshal — Apprendre le métier de commissaire de piste",
    description:
      "Drapeaux, procédures, sécurité, quiz d'entraînement et assistant IA pour apprendre le commissariat de piste. Gratuit, sans inscription.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "TrackMarshal — Plateforme commissaires motorsport",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrackMarshal — Apprendre le métier de commissaire de piste",
    description:
      "Apprenez le commissariat de piste : drapeaux, procédures, quiz et assistant IA. Gratuit.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TrackMarshal",
  url: "https://www.trackmarshal.app",
  logo: "https://www.trackmarshal.app/logo.png",
  description: "Plateforme qui connecte commissaires motorsport (FFSA/FFM) et organisateurs d'événements en France.",
  sameAs: ["https://www.instagram.com/trackmarshal.app"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="fr">

      <head>
        <meta name="theme-color" content="#FF5A1F" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>

      <body>

        {/* Google Analytics 4 */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { page_path: window.location.pathname });
        `}</Script>

        <RegisterSW />

        {children}

        <Analytics />
        <SpeedInsights />

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