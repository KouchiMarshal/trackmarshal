import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description: "Conditions générales d'utilisation de la plateforme TrackMarshal — droits et obligations des utilisateurs.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/cgu" },
};

export default function CguLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
