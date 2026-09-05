import type { Metadata } from "next";
import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { DEFAULT_EQUIPMENT } from "@/lib/equipment";

export const metadata: Metadata = {
  title: "Notre sélection de matériel — équiper son poste de commissaire",
  description:
    "Notre sélection de matériel pour le commissaire de piste : combinaison ignifugée, gants, veste de pluie, chaise pliante, sac et petits plus. Des repères pour bien s'équiper.",
  alternates: { canonical: "/devenir-commissaire/boutique" },
  openGraph: {
    title: "Notre sélection de matériel pour commissaires de piste",
    description:
      "Nos repères pour t'équiper au bon niveau : tenue, protections et essentiels à emporter sur chaque épreuve.",
  },
};

// La liste est gérée en base (admin) ; si la table est vide, on affiche la
// liste par défaut (DEFAULT_EQUIPMENT).
export const dynamic = "force-dynamic";

export default async function BoutiquePage() {
  let shopItems: { title: string; tip: string | null; url: string | null }[] = DEFAULT_EQUIPMENT;
  try {
    const { data } = await supabaseAdmin.from("equipment").select("title, tip, url, position").order("position").order("created_at");
    if (data && data.length > 0) shopItems = data;
  } catch {
    /* garde la liste par défaut */
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicNavbar />

      <section className="relative pt-36 pb-24">
        <div className="relative z-10 mx-auto max-w-[1100px] px-6 lg:px-10">

          <div className="mb-4">
            <Link href="/devenir-commissaire/equipement" className="text-sm text-zinc-500 transition hover:text-zinc-900">
              ← L&apos;équipement (guide)
            </Link>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#FF5A1F]">Notre sélection</p>
          <h1 className="mt-4 text-4xl font-black text-zinc-900 lg:text-6xl">Bien s&apos;équiper</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-600">
            Nos repères pour t&apos;équiper au bon niveau, poste par poste. Vérifie toujours les
            exigences de l&apos;organisateur au briefing — le règlement de l&apos;épreuve fait foi.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {shopItems.map((item) => (
              <div key={item.title} className="flex flex-col rounded-[24px] border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-black text-zinc-900">{item.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">{item.tip}</p>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="sponsored nofollow noopener"
                    className="mt-4 inline-flex w-fit items-center gap-2 rounded-xl bg-[#FF5A1F] px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
                  >
                    Voir sur Amazon →
                  </a>
                )}
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs leading-relaxed text-zinc-400">
            <strong className="font-semibold text-zinc-500">En tant que Partenaire Amazon, je réalise un bénéfice sur les achats remplissant les conditions requises.</strong>{" "}
            Les liens ci-dessus sont des liens partenaires : un achat effectué via ces liens peut nous
            reverser une commission, sans surcoût pour toi. Cela soutient le contenu gratuit du site, et
            TrackMarshal reste indépendant dans ses recommandations.
          </p>

          {/* CTA */}
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/devenir-commissaire/equipement"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#FF5A1F] px-6 py-3 font-bold text-white transition hover:opacity-90"
            >
              Voir le guide de l&apos;équipement →
            </Link>
            <Link
              href="/devenir-commissaire/drapeaux"
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-6 py-3 font-bold text-zinc-700 transition hover:bg-zinc-50"
            >
              Réviser les drapeaux →
            </Link>
          </div>

        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
