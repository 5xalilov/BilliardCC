// Orde UI strings. uz (Uzbek, Latin) is the source of truth: every key lives in uz.ts,
// other languages may lag and fall back to it key by key.
// React components use useT() (./use-t.ts); non-React code calls translate() directly.
import { uz, type Dict, type TKey } from "@/lib/i18n/uz";

export type { TKey } from "@/lib/i18n/uz";

export const LANGS = [
  { id: "uz", label: "O'zbekcha" },
  { id: "uz-Cyrl", label: "Ўзбекча" },
  { id: "kaa", label: "Qaraqalpaqsha" },
  { id: "ru", label: "Русский" },
  { id: "en", label: "English" },
  { id: "kk", label: "Қазақша" },
  { id: "ky", label: "Кыргызча" },
  { id: "tg", label: "Тоҷикӣ" },
  { id: "tk", label: "Türkmençe" },
  { id: "tr", label: "Türkçe" },
] as const;

export type Lang = (typeof LANGS)[number]["id"];

const DICTS: Partial<Record<Lang, Partial<Dict>>> = { uz };

export function registerDict(lang: Lang, dict: Partial<Dict>) {
  DICTS[lang] = dict;
}

export type TVars = Record<string, string | number>;

export function translate(lang: Lang, key: TKey, vars?: TVars): string {
  const text = DICTS[lang]?.[key] ?? uz[key] ?? key;
  return vars ? text.replace(/\{(\w+)\}/g, (m, name: string) => String(vars[name] ?? m)) : text;
}
