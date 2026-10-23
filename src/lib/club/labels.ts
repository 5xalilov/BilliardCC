import { translate, type Lang } from "@/lib/i18n";
import { unitConfig, unitKind, type Settings } from "@/lib/club/logic";

type Place = { kind: "table" | "walkin"; table: number | null; seq: number };

// Display name of a place in the current language: the unit's own name if set,
// otherwise "<noun of its business kind> <n>" (Stol 3, Kort 2, Konsol 5…);
// walk-ins are numbered only when more than one is open.
export function placeLabel(
  settings: Pick<Settings, "units" | "business">,
  lang: Lang,
  place: Place,
  walkinCount = 1,
) {
  if (place.kind === "table" && place.table !== null) {
    const custom = unitConfig(settings, place.table).name;
    if (custom) return custom;
    return `${translate(lang, `unit.${unitKind(settings, place.table)}`)} ${place.table}`;
  }
  return walkinCount > 1 ? translate(lang, "walkin.n", { n: place.seq }) : translate(lang, "walkin");
}
