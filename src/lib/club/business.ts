// Timer-billed businesses Orde supports. A club picks one in setup; any single unit
// (table, court, console…) can override it, so mixed venues work too.
// Names and unit nouns are i18n keys: `biz.<id>` and `unit.<id>`.
export type BusinessKind =
  | "billiard"
  | "snooker"
  | "tableTennis"
  | "tennis"
  | "padel"
  | "badminton"
  | "football"
  | "playstation"
  | "computer"
  | "vr"
  | "bowling"
  | "karaoke"
  | "kids"
  | "sauna"
  | "other";

export type BusinessInfo = { id: BusinessKind; emoji: string; rate: number };

// Default hourly rates (so'm) are only a starting point offered during setup.
export const BUSINESSES: readonly BusinessInfo[] = [
  { id: "billiard", emoji: "🎱", rate: 60000 },
  { id: "snooker", emoji: "🔴", rate: 80000 },
  { id: "tableTennis", emoji: "🏓", rate: 40000 },
  { id: "tennis", emoji: "🎾", rate: 150000 },
  { id: "padel", emoji: "🎾", rate: 200000 },
  { id: "badminton", emoji: "🏸", rate: 80000 },
  { id: "football", emoji: "⚽", rate: 250000 },
  { id: "playstation", emoji: "🎮", rate: 30000 },
  { id: "computer", emoji: "🖥️", rate: 15000 },
  { id: "vr", emoji: "🥽", rate: 60000 },
  { id: "bowling", emoji: "🎳", rate: 120000 },
  { id: "karaoke", emoji: "🎤", rate: 150000 },
  { id: "kids", emoji: "🧸", rate: 40000 },
  { id: "sauna", emoji: "🧖", rate: 200000 },
  { id: "other", emoji: "⏱️", rate: 50000 },
];

export function businessInfo(id: BusinessKind): BusinessInfo {
  return BUSINESSES.find((b) => b.id === id) ?? BUSINESSES[0];
}
