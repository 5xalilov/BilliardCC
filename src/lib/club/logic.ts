import type { BusinessKind } from "@/lib/club/business";
import type { Lang } from "@/lib/i18n";

export type MenuCategory = "ichimlik" | "issiq" | "pivo" | "gazak";

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: MenuCategory;
};

export type LineItem = {
  id: string;
  menuId: string;
  name: string;
  price: number;
  qty: number;
};

export type Session = {
  id: string;
  kind: "table" | "walkin";
  table: number | null;
  seq: number;
  startedAt: number;
  pausedMs: number;
  pauseStartedAt: number | null;
  ratePerHour: number;
  vip: boolean;
  items: LineItem[];
  discountPct: number;
};

export type Bill = {
  id: string;
  kind: "table" | "walkin";
  table: number | null;
  seq: number;
  label: string;
  startedAt: number;
  closedAt: number;
  elapsedMs: number;
  billedMinutes: number;
  ratePerHour: number;
  vip: boolean;
  items: LineItem[];
  discountPct: number;
  timeCharge: number;
  barTotal: number;
  discountAmt: number;
  total: number;
  cash: number;
  card: number;
  voided: boolean;
};

export type ThemeMode = "auto" | "light" | "dark";

export const FREE_TABLE_LIMIT = 3;
export const MAX_TABLES = 30;
// The free keypad always shows a full 3×3 block: the first FREE_TABLE_LIMIT keys work,
// the rest are locked and open the Premium sheet.
export const FREE_GRID = 9;

// Optional per-unit overrides (key = unit number). Anything unset uses the club defaults.
export type UnitConfig = { name?: string; rate?: number; vipRate?: number; kind?: BusinessKind };

export type Settings = {
  clubName: string;
  rate: number;
  vipRate: number;
  tableCount: number;
  vipTables: number[];
  roundUp: 1 | 15;
  theme: ThemeMode;
  premium: boolean;
  setupDone: boolean;
  tourDone: boolean;
  lang: Lang;
  business: BusinessKind;
  units: Record<string, UnitConfig>;
  // Non-unit keypad keys in slot order (ids from DEFAULT_SETTINGS.keyLayout); set in arrange mode.
  keyLayout: string[];
};

export const DEFAULT_SETTINGS: Settings = {
  clubName: "Bilyard klub",
  rate: 60000,
  vipRate: 120000,
  tableCount: FREE_TABLE_LIMIT,
  vipTables: [],
  roundUp: 1,
  theme: "auto",
  premium: false,
  setupDone: false,
  tourDone: false,
  lang: "uz",
  business: "billiard",
  units: {},
  keyLayout: ["undo", "ac", "discount", "bar", "pause", "remove", "add", "transfer", "walkin", "vip", "hisob"],
};

export function tableLimit(settings: Pick<Settings, "premium">) {
  return settings.premium ? MAX_TABLES : FREE_TABLE_LIMIT;
}

export function unitConfig(settings: Pick<Settings, "units">, n: number): UnitConfig {
  return settings.units[String(n)] ?? {};
}

export function unitKind(settings: Pick<Settings, "units" | "business">, n: number): BusinessKind {
  return unitConfig(settings, n).kind ?? settings.business;
}

// Hourly rate a new session on unit n starts with.
export function unitRate(settings: Pick<Settings, "units" | "rate" | "vipRate">, n: number, vip: boolean) {
  const unit = unitConfig(settings, n);
  return vip ? (unit.vipRate ?? settings.vipRate) : (unit.rate ?? settings.rate);
}

// Tables that can be opened right now (a club that lost Premium keeps its count but not its keys).
export function activeTables(settings: Pick<Settings, "premium" | "tableCount">) {
  return Math.min(settings.tableCount, tableLimit(settings));
}

// Offered once during club setup ("Namuna menyu"); a new club starts with an empty menu.
export const SAMPLE_MENU: MenuItem[] = [
  { id: "suv", name: "Suv", price: 5000, category: "ichimlik" },
  { id: "cola", name: "Cola", price: 12000, category: "ichimlik" },
  { id: "fanta", name: "Fanta", price: 12000, category: "ichimlik" },
  { id: "limonad", name: "Limonad", price: 14000, category: "ichimlik" },
  { id: "energetik", name: "Energetik", price: 18000, category: "ichimlik" },
  { id: "choy", name: "Choy", price: 8000, category: "issiq" },
  { id: "qahva", name: "Qahva", price: 15000, category: "issiq" },
  { id: "kapuchino", name: "Kapuchino", price: 20000, category: "issiq" },
  { id: "pivo", name: "Pivo", price: 18000, category: "pivo" },
  { id: "pivo-l", name: "Pivo 0.5", price: 25000, category: "pivo" },
  { id: "chips", name: "Chips", price: 12000, category: "gazak" },
  { id: "pista", name: "Pista", price: 30000, category: "gazak" },
  { id: "shokolad", name: "Shokolad", price: 10000, category: "gazak" },
  { id: "yongoq", name: "Yong'oq", price: 20000, category: "gazak" },
];

export const MENU_CATEGORIES: { id: MenuCategory; label: string }[] = [
  { id: "ichimlik", label: "Ichimlik" },
  { id: "issiq", label: "Issiq" },
  { id: "pivo", label: "Pivo" },
  { id: "gazak", label: "Gazak" },
];

export const CATEGORIES: { id: MenuCategory | "all"; label: string }[] = [
  { id: "all", label: "Hammasi" },
  { id: "ichimlik", label: "Ichimlik" },
  { id: "issiq", label: "Issiq" },
  { id: "pivo", label: "Pivo" },
  { id: "gazak", label: "Gazak" },
];

const TASHKENT = "Asia/Tashkent";

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function formatSom(value: number) {
  const n = Math.round(value);
  const sign = n < 0 ? "−" : "";
  return sign + Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
}

export function formatClock(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const p = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${p(m)}:${p(s)}` : `${p(m)}:${p(s)}`;
}

export function formatWhen(ts: number) {
  return new Intl.DateTimeFormat("uz-UZ", {
    timeZone: TASHKENT,
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}

export function tashkentDay(ts: number) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TASHKENT,
    year: "numeric",
    month: "2-digit",
    day: "numeric",
  }).format(new Date(ts));
}

export function elapsedMs(
  s: Pick<Session, "startedAt" | "pausedMs" | "pauseStartedAt">,
  now: number,
) {
  const live = s.pauseStartedAt ? Math.max(0, now - s.pauseStartedAt) : 0;
  return Math.max(0, now - s.startedAt - s.pausedMs - live);
}

export function billedMinutes(elapsed: number, roundUp: number) {
  if (elapsed <= 0) return 0;
  const minutes = elapsed / 60000;
  if (roundUp <= 1) return Math.ceil(minutes);
  return Math.ceil(minutes / roundUp) * roundUp;
}

export type Quote = {
  elapsed: number;
  minutes: number;
  time: number;
  bar: number;
  discountAmt: number;
  total: number;
};

export function quote(s: Session, now: number, roundUp: number): Quote {
  const elapsed = elapsedMs(s, now);
  const minutes = s.kind === "walkin" ? 0 : billedMinutes(elapsed, roundUp);
  const time = s.kind === "walkin" ? 0 : Math.round((s.ratePerHour * minutes) / 60);
  const bar = s.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const gross = time + bar;
  const discountAmt = Math.min(gross, Math.round((gross * s.discountPct) / 100));
  return { elapsed, minutes, time, bar, discountAmt, total: gross - discountAmt };
}

export function displayBucket(text: string) {
  const len = text.replace(/\s/g, "").length;
  if (len <= 6) return "s";
  if (len <= 8) return "m";
  return "l";
}

export function itemQty(items: LineItem[], menuId: string) {
  return items.find((item) => item.menuId === menuId)?.qty ?? 0;
}
