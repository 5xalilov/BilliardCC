import { useCallback } from "react";
import { translate, type TKey, type TVars } from "@/lib/i18n";
import { placeLabel } from "@/lib/club/labels";
import { useClub } from "@/lib/club/store";

// t("key", { n: 3 }) in the club's chosen language.
export function useT() {
  const lang = useClub((s) => s.settings.lang);
  return useCallback((key: TKey, vars?: TVars) => translate(lang, key, vars), [lang]);
}

// Place names ("Stol 3", "Kort 2", "Tashqi") in the club's language and business kind.
export function usePlaceLabel() {
  const lang = useClub((s) => s.settings.lang);
  const units = useClub((s) => s.settings.units);
  const business = useClub((s) => s.settings.business);
  return useCallback(
    (place: Parameters<typeof placeLabel>[2], walkins?: number) =>
      placeLabel({ units, business }, lang, place, walkins),
    [lang, units, business],
  );
}
