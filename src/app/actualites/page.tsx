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

async function fetchFeed(url: string, source: string, category: "auto" | "moto"): Promise<Article[]> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "TrackMarshal/1.0 (+https://www.trackmarshal.app)" },
    });
    if (!res.ok) return [];
    const text = await res.text();
    const items = text.match(/<item>([\s\S]*?)<\/item>/g) ?? [];
    return items.slice(0, 8).map((item) => ({
      title: extractText(item, "title"),
      link: extractText(item, "link") || item.match(/<link\s+href="([^"]+)"/)?.[1] || "",
      description: extractText(item, "description").replace(/<[^>]+>/g, "").trim().slice(0, 220),
      pubDate: extractText(item, "pubDate"),
      source,
      image: extractImage(item),
      category,
    })).filter((a) => a.title && a.link);
  } catch {
    return [];
  }
}

export default async function ActualitesPage() {
  const results = await Promise.allSettled([
    fetchFeed("https://fr.motorsport.com/rss/news/", "Motorsport.com", "auto"),
    fetchFeed("https://www.autohebdo.fr/rss.xml", "Auto Hebdo", "auto"),
    fetchFeed("https://www.moto-journal.fr/feed/", "Moto Journal", "moto"),
    fetchFeed("https://www.motomag.com/feed/", "Moto Mag", "moto"),
  ]);

  const all: Article[] = results
    .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
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
