import { MetadataRoute } from "next";

const BASE = "https://www.trackmarshal.app";

// Le sitemap se concentre sur l'espace pédagogique et l'annuaire — le cœur
// actuel du site. Les pages issues de l'ancienne marketplace (events,
// commissaires, profils) restent accessibles mais ne sont plus poussées ici,
// pour donner à Google une identité claire : formation + annuaire.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, priority: 1.0, changeFrequency: "weekly" },
    // Espace pédagogique
    { url: `${BASE}/devenir-commissaire`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/devenir-commissaire/devenir-commissaire`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/devenir-commissaire/drapeaux`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/devenir-commissaire/procedures`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/devenir-commissaire/roles`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/devenir-commissaire/equipement`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/devenir-commissaire/boutique`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE}/devenir-commissaire/epreuves`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/devenir-commissaire/lexique`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE}/devenir-commissaire/quiz`, priority: 0.6, changeFrequency: "monthly" },
    // Annuaire
    { url: `${BASE}/devenir-commissaire/clubs`, priority: 0.9, changeFrequency: "weekly" },
    // Autres
    { url: `${BASE}/about`, priority: 0.5, changeFrequency: "monthly" },
    { url: `${BASE}/partenaires`, priority: 0.5, changeFrequency: "monthly" },
    { url: `${BASE}/contact`, priority: 0.4, changeFrequency: "yearly" },
    { url: `${BASE}/mentions-legales`, priority: 0.2, changeFrequency: "yearly" },
    { url: `${BASE}/confidentialite`, priority: 0.2, changeFrequency: "yearly" },
    { url: `${BASE}/cgu`, priority: 0.2, changeFrequency: "yearly" },
  ];
}
