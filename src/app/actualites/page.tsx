import type { Metadata } from "next";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";
import ActualitesClient from "@/components/actualites/ActualitesClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Actualités motorsport",
  robots: { index: false, follow: false },
};

export interface Article {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  image?: string;
  category: "auto" | "moto";
}

function extractText(xml: string, tag: string): string {
  const cdata = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i"));
  if (cdata) return cdata[1].trim();
  const plain = xml.match(new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`, "i"));
  return plain ? plain[1].trim() : "";
}

function extractImage(item: string): string | undefined {
  return (
    item.match(/media:content[^>]*url="([^"]+)"/)?.[1] ||
    item.match(/media:thumbnail[^>]*url="([^"]+)"/)?.[1] ||
    item.match(/enclosure[^>]*type="image[^"]*"\s+url="([^"]+)"/)?.[1] ||
    item.match(/enclosure[^>]*url="([^"]+)"[^>]*type="image/)?.[1] ||
    undefined
  );
}

// Pour Google News RSS, le <source> de chaque item donne le vrai média
function extractItemSource(item: string, fallback: string): string {
  return item.match(/<source[^>]*>([^<]+)<\/source>/)?.[1]?.trim() || fallback;
}

async function fetchFeed(
  url: string,
  source: string,
  category: "auto" | "moto",
  useItemSource = false
): Promise<Article[]> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        "Accept": "application/rss+xml, application/xml, text/xml, */*",
      },
    });
    if (!res.ok) return [];
    const text = await res.text();
    const items = text.match(/<item>([\s\S]*?)<\/item>/g) ?? [];
    return items.slice(0, 10).map((item) => {
      const itemSource = useItemSource ? extractItemSource(item, source) : source;
      let title = extractText(item, "title");
      // Google News appende " - Nom du média" dans le titre, on le retire
      if (useItemSource) title = title.replace(/\s*[-–]\s*[^-–]{2,40}$/, "").trim();
      return {
        title,
        link: extractText(item, "link") || item.match(/<link\s+href="([^"]+)"/)?.[1] || "",
        description: extractText(item, "description").replace(/<[^>]+>/g, "").trim().slice(0, 220),
        pubDate: extractText(item, "pubDate"),
        source: itemSource,
        image: extractImage(item),
        category,
      };
    }).filter((a) => a.title && a.link);
  } catch {
    return [];
  }
}

export default async function ActualitesPage() {
  const results = await Promise.allSettled([
    // Auto — Google News agrège L'Équipe, Le Monde, Motorsport, Autohebdo, etc.
    fetchFeed(
      "https://news.google.com/rss/search?q=sport+automobile+motorsport+formule+rallye&hl=fr&gl=FR&ceid=FR:fr",
      "Google News",
      "auto",
      true
    ),
    fetchFeed(
      "https://news.google.com/rss/search?q=Formule+1+F1+GP&hl=fr&gl=FR&ceid=FR:fr",
      "Google News",
      "auto",
      true
    ),
    fetchFeed("https://www.automobile-magazine.fr/toute-l-actualite/rss.xml", "Automobile Magazine", "auto"),
    fetchFeed("https://moteur-actu.fr/feed/", "Moteur Actu", "auto"),
    // Moto — Motomag confirmé fonctionnel + Google News moto + Repaire des Motards
    fetchFeed("https://www.motomag.com/feed/", "Moto Mag", "moto"),
    fetchFeed(
      "https://news.google.com/rss/search?q=sport+moto+motocyclisme+superbike+motogp+enduro&hl=fr&gl=FR&ceid=FR:fr",
      "Google News",
      "moto",
      true
    ),
    fetchFeed("https://www.lerepairedesmotards.com/actualites/rss.php", "Le Repaire des Motards", "moto"),
  ]);

  const threeMonthsAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;

  const all: Article[] = results
    .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
    .filter((a) => !a.pubDate || new Date(a.pubDate).getTime() >= threeMonthsAgo)
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const autoArticles = all.filter((a) => a.category === "auto");
  const motoArticles = all.filter((a) => a.category === "moto");

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicNavbar />
      <ActualitesClient autoArticles={autoArticles} motoArticles={motoArticles} />
      <PublicFooter />
    </main>
  );
}
