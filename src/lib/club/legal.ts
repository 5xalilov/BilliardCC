// Privacy policy and public offer. Texts are in legal-content.ts; the operator's details
// below fill {operator}, {contact} and {requisites}. Fill LEGAL_OPERATOR before publishing:
// an empty field shows the "to be filled" marker of the reader's language.
import type { Lang } from "@/lib/i18n";
import { OFFER, PRIVACY } from "@/lib/club/legal-content";

export type LegalDoc = "privacy" | "offer";
export type LegalLang = "uz" | "uz-Cyrl" | "ru" | "en";
export type LegalSection = { title: string; body: readonly string[] };

export const LEGAL_UPDATED = "24.10.2026";

export const LEGAL_OPERATOR = {
  // Yakka tartibdagi tadbirkor yoki yuridik shaxs nomi
  name: "",
  // STIR (INN)
  tin: "",
  address: "",
  // Qo'llab-quvvatlash Telegram manzili, masalan "@username"; bo'sh bo'lsa — Orde boti
  telegram: "",
};

const FALLBACK: Record<Lang, LegalLang> = {
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

const LABELS: Record<LegalLang, { operator: string; tin: string; address: string; telegram: string; todo: string; service: string; bot: string }> = {
  uz: { operator: "Ijrochi", tin: "STIR", address: "Manzil", telegram: "Telegram", todo: "to'ldiriladi", service: "Orde xizmati", bot: "Orde boti" },
  "uz-Cyrl": { operator: "Ижрочи", tin: "СТИР", address: "Манзил", telegram: "Telegram", todo: "тўлдирилади", service: "Orde хизмати", bot: "Orde боти" },
  ru: { operator: "Исполнитель", tin: "ИНН", address: "Адрес", telegram: "Telegram", todo: "заполняется", service: "сервиса Orde", bot: "бот Orde" },
  en: { operator: "Provider", tin: "TIN", address: "Address", telegram: "Telegram", todo: "to be filled", service: "the Orde service", bot: "the Orde bot" },
};

export function legalDoc(doc: LegalDoc, lang: Lang): readonly LegalSection[] {
  const l = FALLBACK[lang] ?? "uz";
  const words = LABELS[l];
  const op = LEGAL_OPERATOR;
  const fill = (v: string) => v || words.todo;
  const vars: Record<string, string> = {
    operator: op.name || words.service,
    contact: op.telegram ? `Telegram ${op.telegram}` : words.bot,
    requisites: [
      `${words.operator}: ${fill(op.name)}`,
      `${words.tin}: ${fill(op.tin)}`,
      `${words.address}: ${fill(op.address)}`,
      `${words.telegram}: ${op.telegram || words.bot}`,
    ].join("\n"),
  };
  const sections = (doc === "privacy" ? PRIVACY : OFFER)[l];
  return sections.map((s) => ({
    title: s.title,
    body: s.body.map((p) => p.replace(/\{(\w+)\}/g, (m, k: string) => vars[k] ?? m)),
  }));
}
