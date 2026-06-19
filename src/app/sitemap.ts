import { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase-admin";

const BASE = "https://www.trackmarshal.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE}/events`, priority: 0.9, changeFrequency: "daily" },
    { url: `${BASE}/commissaires`, priority: 0.8, changeFrequency: "daily" },
    // Espace pédagogique
    { url: `${BASE}/devenir-commissaire`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/devenir-commissaire/devenir-commissaire`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/devenir-commissaire/drapeaux`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/devenir-commissaire/procedures`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/devenir-commissaire/roles`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/devenir-commissaire/equipement`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/devenir-commissaire/epreuves`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/devenir-commissaire/lexique`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE}/devenir-commissaire/quiz`, priority: 0.6, changeFrequency: "monthly" },
    // Autres
    { url: `${BASE}/about`, priority: 0.5, changeFrequency: "monthly" },
    { url: `${BASE}/mentions-legales`, priority: 0.2, changeFrequency: "yearly" },
    { url: `${BASE}/confidentialite`, priority: 0.2, changeFrequency: "yearly" },
    { url: `${BASE}/cgu`, priority: 0.2, changeFrequency: "yearly" },
  ];

  const [{ data: events }, { data: marshals }] = await Promise.all([
    supabaseAdmin.from("events").select("slug, updated_at"),
    supabaseAdmin.from("profiles").select("slug, id, updated_at").eq("role", "marshal"),
  ]);

  const eventPages: MetadataRoute.Sitemap = (events || []).map((e) => ({
    url: `${BASE}/events/${e.slug}`,
    lastModified: e.updated_at ? new Date(e.updated_at) : new Date(),
    priority: 0.8,
    changeFrequency: "weekly",
  }));

  const marshalPages: MetadataRoute.Sitemap = (marshals || []).map((m) => ({
    url: `${BASE}/marshal/${m.slug || m.id}`,
    lastModified: m.updated_at ? new Date(m.updated_at) : new Date(),
    priority: 0.6,
    changeFrequency: "monthly",
  }));

  return [...staticPages, ...eventPages, ...marshalPages];
}
