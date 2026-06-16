import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de TrackMarshal — éditeur, hébergeur, propriété intellectuelle et responsabilités.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
