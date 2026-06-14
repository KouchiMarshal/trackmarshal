import type { Metadata } from "next";

import "./globals.css";

import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "TrackMarshal",
  description: "Plateforme Motorsport Premium",
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