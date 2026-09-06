import { MetadataRoute } from "next";

// On accueille explicitement les robots d'IA (ChatGPT, Claude, Perplexity,
// Gemini/AI Overviews...) : ils peuvent lire et citer le contenu pédagogique
// et l'annuaire. Seuls les espaces privés (admin, dashboard, API) sont exclus.
const AI_BOTS = [
  "GPTBot", // OpenAI (entraînement)
  "OAI-SearchBot", // ChatGPT Search
  "ChatGPT-User", // navigation ChatGPT
  "ClaudeBot", // Anthropic
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot", // Perplexity (index)
  "Perplexity-User", // Perplexity (navigation en direct)
  "Google-Extended", // grounding Gemini / AI Overviews
  "Applebot-Extended",
  "CCBot", // Common Crawl (source de nombreux modèles)
];

const DISALLOW = ["/dashboard/", "/admin/", "/api/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: AI_BOTS, allow: "/", disallow: DISALLOW },
      { userAgent: "*", allow: "/", disallow: DISALLOW },
    ],
    sitemap: "https://www.trackmarshal.app/sitemap.xml",
    host: "https://www.trackmarshal.app",
  };
}
