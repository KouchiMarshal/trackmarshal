import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TrackMarshal",
    short_name: "TrackMarshal",
    description: "La plateforme des commissaires motorsport",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#FF5A1F",
    orientation: "portrait",
    categories: ["sports", "productivity"],
    icons: [
      { src: "/logo.png", sizes: "192x192", type: "image/png" },
      { src: "/logo.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
    screenshots: [],
  };
}
