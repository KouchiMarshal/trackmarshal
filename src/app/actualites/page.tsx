import type { Metadata } from "next";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";
import ActualitesClient from "@/components/actualites/ActualitesClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Actualités motorsport — Auto et Moto",
  description: "Les dernières actualités motorsport auto et moto en France : Formule 1, rallye, MotoGP, superbike, enduro — mis à jour toutes les heures.",
  alternates: { canonical: "/actualites" },
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

const AUTO_KEYWORDS = [
  "F1", "Formule 1", "Formula 1", "Grand Prix", "GP", "WEC", "WRC", "WTCR", "DTM",
  "rallye", "circuit", "pilote", "écurie", "championnat", "podium", "course automobile",
  "Le Mans", "24 Heures", "IndyCar", "NASCAR", "IMSA", "Formule E", "pole position",
  "qualification", "Ferrari", "Red Bull", "Mercedes AMG", "McLaren", "Alpine F1",
  "Aston Martin F1", "Williams F1", "Haas F1", "Verstappen", "Hamilton", "Leclerc",
  "Norris", "Sainz", "Alonso", "Piastri", "Pérez", "SafetyCar", "endurance auto",
  "touring car", "sport-prototype", "monoplaces",
];

const MOTO_KEYWORDS = [
  "MotoGP", "Moto GP", "Superbike", "WSBK", "motocross", "MXGP", "enduro",
  "trial", "Supersport", "SSP", "Moto2", "Moto3", "championnat moto",
  "course moto", "pilote moto", "GP moto", "podium moto", "Marquez", "Bagnaia",
  "Quartararo", "Bastianini", "Martin moto", "Espargaro", "rallye moto",
  "supermotard", "Paris-Dakar moto", "Bol d'Or", "8 heures de Suzuka",
];

function isMotoSport(article: { title: string; description: string }): boolean {
  const text = (article.title + " " + article.description).toLowerCase();
  return MOTO_KEYWORDS.some((kw) => text.includes(kw.toLowerCase()));
}

function isAutoSport(article: { title: string; description: string }): boolean {
  const text = (article.title + " " + article.description).toLowerCase();
  return AUTO_KEYWORDS.some((kw) => text.includes(kw.toLowerCase()));
}

export default async function ActualitesPage() {
  const results = await Promise.allSettled([
    // Auto — requêtes ciblées sport automobile uniquement
    fetchFeed(
      "https://news.google.com/rss/search?q=Formule+1+F1+Grand+Prix+course&hl=fr&gl=FR&ceid=FR:fr",
      "Google News",
      "auto",
      true
    ),
    fetchFeed(
      "https://news.google.com/rss/search?q=WEC+WRC+rallye+championnat+sport+automobile&hl=fr&gl=FR&ceid=FR:fr",
      "Google News",
      "auto",
      true
    ),
    fetchFeed(
      "https://news.google.com/rss/search?q=24+heures+Le+Mans+endurance+DTM+WTCR+pilote&hl=fr&gl=FR&ceid=FR:fr",
      "Google News",
      "auto",
      true
    ),
    fetchFeed(
      "https://news.google.com/rss/search?q=IndyCar+NASCAR+Formule+E+circuit+course+auto&hl=fr&gl=FR&ceid=FR:fr",
      "Google News",
      "auto",
      true
    ),
    // Moto — requêtes ciblées sport moto uniquement
    fetchFeed(
      "https://news.google.com/rss/search?q=MotoGP+Grand+Prix+moto+championnat+pilote&hl=fr&gl=FR&ceid=FR:fr",
      "Google News",
      "moto",
      true
    ),
    fetchFeed(
      "https://news.google.com/rss/search?q=Superbike+WSBK+Moto2+Moto3+SSP+course+moto&hl=fr&gl=FR&ceid=FR:fr",
      "Google News",
      "moto",
      true
    ),
    fetchFeed(
      "https://news.google.com/rss/search?q=motocross+MXGP+enduro+trial+supermotard+sport+moto&hl=fr&gl=FR&ceid=FR:fr",
      "Google News",
      "moto",
      true
    ),
  ]);

  const threeMonthsAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;

  const all: Article[] = results
    .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
    .filter((a) => !a.pubDate || new Date(a.pubDate).getTime() >= threeMonthsAgo)
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const autoArticles = all.filter((a) => a.category === "auto" && isAutoSport(a));
  const motoArticles = all.filter((a) => a.category === "moto" && isMotoSport(a));

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicNavbar />
      <ActualitesClient autoArticles={autoArticles} motoArticles={motoArticles} />
      <PublicFooter />
    </main>
  );
}
