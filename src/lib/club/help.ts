// Help center data model: categories of common problems with short solutions.
// Texts live in help-content.ts (uz, uz-Cyrl, ru, en); other UI languages read the
// closest of those (helpFor). Search matches the question and the answer lines.
import type { Lang } from "@/lib/i18n";
import { HELP_CONTENT } from "@/lib/club/help-content";

export type HelpCategoryId = "start" | "time" | "bar" | "bills" | "data" | "premium" | "settings";
export type HelpLang = "uz" | "uz-Cyrl" | "ru" | "en";
export type HelpArticle = { id: string; q: string; a: readonly string[] };
export type HelpCategory = { id: HelpCategoryId; title: string; articles: readonly HelpArticle[] };

// Which written language each UI language falls back to.
const FALLBACK: Record<Lang, HelpLang> = {
  uz: "uz",
  "uz-Cyrl": "uz-Cyrl",
  xorazm: "uz",
  kaa: "uz",
  ru: "ru",
  en: "en",
  kk: "ru",
  ky: "ru",
  tg: "ru",
  tk: "ru",
  tr: "en",
};

export function helpFor(lang: Lang): readonly HelpCategory[] {
  return HELP_CONTENT[FALLBACK[lang] ?? "uz"];
}

export function findCategory(lang: Lang, id: string) {
  return helpFor(lang).find((c) => c.id === id) ?? null;
}

export function findArticle(lang: Lang, category: string, article: string) {
  return findCategory(lang, category)?.articles.find((a) => a.id === article) ?? null;
}

// Case- and apostrophe-insensitive search over questions and answers; every word must match.
const norm = (s: string) => s.toLocaleLowerCase().replace(/[ʻʼ’‘`']/g, "'");

export function searchHelp(lang: Lang, query: string) {
  const words = norm(query).split(/\s+/).filter((w) => w.length > 1);
  if (!words.length) return [];
  const hits: { category: HelpCategory; article: HelpArticle }[] = [];
  for (const category of helpFor(lang)) {
    for (const article of category.articles) {
      const hay = norm([article.q, ...article.a, category.title].join(" "));
      if (words.every((w) => hay.includes(w))) hits.push({ category, article });
    }
  }
  return hits;
}
