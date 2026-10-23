import { useCallback } from "react";
import { translate, type TKey, type TVars } from "@/lib/i18n";
import { useClub } from "@/lib/club/store";

// t("key", { n: 3 }) in the club's chosen language.
export function useT() {
  const lang = useClub((s) => s.settings.lang);
  return useCallback((key: TKey, vars?: TVars) => translate(lang, key, vars), [lang]);
}
