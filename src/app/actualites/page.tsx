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

// Images de secours motorsport (Unsplash, libres de droits)
const AUTO_FALLBACKS = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541889413457-4aec57bcdc4c?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&auto=format&fit=crop",
];

const MOTO_FALLBACKS = [
  "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558981285-501cd373af7b?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop",
];

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function extractText(xml: string, tag: string): string {
  const cdata = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i"));
  if (cdata) return cdata[1].trim();
  const plain = xml.match(new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`, "i"));
  return plain ? decodeHtmlEntities(plain[1].trim()) : "";
}

function extractDescription(item: string): string {
  const raw = extractText(item, "description");
  return decodeHtmlEntities(raw)
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);
}

function extractImage(item: string): string | undefined {
  const url =
    item.match(/media:content[^>]*url="([^"]+)"/)?.[1] ||
    item.match(/media:thumbnail[^>]*url="([^"]+)"/)?.[1] ||
    item.match(/enclosure[^>]*type="image[^"]*"\s+url="([^"]+)"/)?.[1] ||
    item.match(/enclosure[^>]*url="([^"]+)"[^>]*type="image/)?.[1];

  // Exclure les logos/icônes Google ou génériques
  if (!url) return undefined;
  if (url.includes("googleusercontent.com") || url.includes("news.google.com")) return undefined;
  if (url.includes("favicon") || url.includes("logo") || url.includes("icon")) return undefined;
  return url;
}

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
    return items.slice(0, 12).map((item) => {
      const itemSource = useItemSource ? extractItemSource(item, source) : source;
      let title = extractText(item, "title");
      if (useItemSource) title = title.replace(/\s*[-–]\s*[^-–]{2,40}$/, "").trim();
      return {
        title,
        link: extractText(item, "link") || item.match(/<link\s+href="([^"]+)"/)?.[1] || "",
        description: extractDescription(item),
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
  "Norris", "Sainz", "Alonso", "Piastri", "Pérez", "SafetyCar", "sport-prototype",
];

const MOTO_KEYWORDS = [
  "MotoGP", "Moto GP", "Superbike", "WSBK", "motocross", "MXGP", "enduro",
  "trial", "Supersport", "SSP", "Moto2", "Moto3", "championnat moto",
  "course moto", "pilote moto", "GP moto", "podium moto", "Marquez", "Bagnaia",
  "Quartararo", "Bastianini", "Espargaro", "supermotard", "Bol d'Or",
];

function isAutoSport(a: { title: string; description: string }): boolean {
  const text = (a.title + " " + a.description).toLowerCase();
  return AUTO_KEYWORDS.some((kw) => text.includes(kw.toLowerCase()));
}

function isMotoSport(a: { title: string; description: string }): boolean {
  const text = (a.title + " " + a.description).toLowerCase();
  return MOTO_KEYWORDS.some((kw) => text.includes(kw.toLowerCase()));
}

function assignFallbackImages(articles: Article[], fallbacks: string[]): Article[] {
  let idx = 0;
  return articles.map((a) => {
    if (a.image) return a;
    const img = fallbacks[idx % fallbacks.length];
    idx++;
    return { ...a, image: img };
  });
}

export default async function ActualitesPage() {
  const results = await Promise.allSettled([
    // Motorsport.com FR — flux avec images natives
    fetchFeed("https://fr.motorsport.com/rss/f1/news/", "Motorsport.com", "auto"),
    fetchFeed("https://fr.motorsport.com/rss/wrc/news/", "Motorsport.com", "auto"),
    fetchFeed("https://fr.motorsport.com/rss/wec/news/", "Motorsport.com", "auto"),
    fetchFeed("https://fr.motorsport.com/rss/motogp/news/", "Motorsport.com", "moto"),
    fetchFeed("https://fr.motorsport.com/rss/motocross/news/", "Motorsport.com", "moto"),
    fetchFeed("https://fr.motorsport.com/rss/superbike/news/", "Motorsport.com", "moto"),
    // Google News en complément pour la couverture
    fetchFeed(
      "https://news.google.com/rss/search?q=Formule+1+F1+Grand+Prix+course+pilote&hl=fr&gl=FR&ceid=FR:fr",
      "Google News", "auto", true
    ),
    fetchFeed(
      "https://news.google.com/rss/search?q=WEC+WRC+rallye+sport+automobile+championnat&hl=fr&gl=FR&ceid=FR:fr",
      "Google News", "auto", true
    ),
    fetchFeed(
      "https://news.google.com/rss/search?q=MotoGP+Grand+Prix+moto+championnat+pilote&hl=fr&gl=FR&ceid=FR:fr",
      "Google News", "moto", true
    ),
    fetchFeed(
      "https://news.google.com/rss/search?q=Superbike+WSBK+Moto2+Moto3+motocross+MXGP&hl=fr&gl=FR&ceid=FR:fr",
      "Google News", "moto", true
    ),
  ]);

  const threeMonthsAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;

  // Dédoublonner par titre
  const seen = new Set<string>();
  const all: Article[] = results
    .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
    .filter((a) => {
      if (!a.pubDate || new Date(a.pubDate).getTime() < threeMonthsAgo) return false;
      const key = a.title.toLowerCase().slice(0, 60);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const autoFiltered = all.filter((a) => a.category === "auto" && isAutoSport(a));
  const motoFiltered = all.filter((a) => a.category === "moto" && isMotoSport(a));

  // Assigner des images de secours aux articles sans photo
  const autoArticles = assignFallbackImages(autoFiltered, AUTO_FALLBACKS);
  const motoArticles = assignFallbackImages(motoFiltered, MOTO_FALLBACKS);

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicNavbar />
      <ActualitesClient autoArticles={autoArticles} motoArticles={motoArticles} />
      <PublicFooter />
    </main>
  );
}
