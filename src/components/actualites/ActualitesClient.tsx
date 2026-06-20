"use client";

import { useState } from "react";
import type { Article } from "@/app/actualites/page";

interface Props {
  autoArticles: Article[];
  motoArticles: Article[];
}

function formatDate(raw: string): string {
  try {
    return new Date(raw).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return raw;
  }
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-[24px] border border-zinc-200 bg-white overflow-hidden transition hover:border-[#FF5A1F]/40 hover:shadow-md"
    >
      {article.image && (
        <div className="h-44 w-full overflow-hidden bg-zinc-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-700">
            {article.source}
          </span>
          {article.pubDate && (
            <span className="text-xs text-zinc-400">{formatDate(article.pubDate)}</span>
          )}
        </div>
        <h3 className="text-sm font-black leading-snug text-zinc-900 group-hover:text-[#FF5A1F] line-clamp-3">
          {article.title}
        </h3>
        {article.description && (
          <p className="mt-2 text-xs leading-relaxed text-zinc-500 line-clamp-3">
            {article.description}
          </p>
        )}
        <p className="mt-auto pt-4 text-xs font-bold text-zinc-400 transition group-hover:text-[#FF5A1F]">
          Lire l'article →
        </p>
      </div>
    </a>
  );
}

export default function ActualitesClient({ autoArticles, motoArticles }: Props) {
  const [tab, setTab] = useState<"auto" | "moto">("auto");
  const articles = tab === "auto" ? autoArticles : motoArticles;

  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pt-32">
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F]">Auto-mis à jour toutes les heures</p>
        <h1 className="mt-3 text-4xl font-black lg:text-6xl">Actualités motorsport</h1>
        <p className="mt-3 text-zinc-500">Dernières nouvelles auto et moto agrégées depuis les médias spécialisés.</p>
      </div>

      <div className="mb-8 flex gap-3">
        <button
          onClick={() => setTab("auto")}
          className={`flex h-10 items-center rounded-xl px-6 text-sm font-black transition ${
            tab === "auto"
              ? "bg-[#FF5A1F] text-white"
              : "border border-zinc-300 text-zinc-600 hover:border-[#FF5A1F]/50 hover:text-[#FF5A1F]"
          }`}
        >
          Automobile ({autoArticles.length})
        </button>
        <button
          onClick={() => setTab("moto")}
          className={`flex h-10 items-center rounded-xl px-6 text-sm font-black transition ${
            tab === "moto"
              ? "bg-[#FF5A1F] text-white"
              : "border border-zinc-300 text-zinc-600 hover:border-[#FF5A1F]/50 hover:text-[#FF5A1F]"
          }`}
        >
          Moto ({motoArticles.length})
        </button>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-[24px] border border-zinc-200 bg-white p-12 text-center text-zinc-400">
          Aucun article disponible pour le moment. Les flux RSS sont peut-être temporairement indisponibles.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {articles.map((article, i) => (
            <ArticleCard key={`${article.link}-${i}`} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
