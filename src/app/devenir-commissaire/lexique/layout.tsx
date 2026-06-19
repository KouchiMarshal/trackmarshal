import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lexique motorsport — Glossaire commissaire de A à Z",
  description:
    "Safety Car, FCY, Code 60, parc fermé, steward, scratch, pit lane... Le glossaire complet des termes motorsport indispensables pour comprendre les briefings FFSA et FFM.",
  alternates: { canonical: "/devenir-commissaire/lexique" },
  openGraph: {
    title: "Lexique motorsport — Glossaire de A à Z",
    description:
      "Tous les termes du sport automobile et moto expliqués : Safety Car, FCY, Code 60, parc fermé, steward et plus. Guide pour commissaires de piste.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
