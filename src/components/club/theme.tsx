import { useEffect, useState } from "react";
import type { ThemeMode } from "@/lib/club/logic";
import { useClub } from "@/lib/club/store";

export const THEME_COLORS = { dark: "#000000", light: "#f7f6f4" } as const;

// Runs in <head> before first paint so a saved "Kun"/"Tun" choice never flashes the other mode.
export const THEME_BOOT_SCRIPT = `try{var t=JSON.parse(localStorage.getItem("stol-club-v1")||"{}").state.settings.theme;if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

const systemQuery = "(prefers-color-scheme: light)";

export function useResolvedTheme(): "light" | "dark" {
  const mode: ThemeMode = useClub((s) => s.settings.theme) ?? "auto";
  const [systemLight, setSystemLight] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(systemQuery);
    setSystemLight(media.matches);
    const onChange = (event: MediaQueryListEvent) => setSystemLight(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const resolved = mode === "auto" ? (systemLight ? "light" : "dark") : mode;

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "auto") delete root.dataset.theme;
    else root.dataset.theme = mode;
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((meta) => meta.setAttribute("content", THEME_COLORS[resolved]));
  }, [mode, resolved]);

  return resolved;
}
