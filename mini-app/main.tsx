import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClubApp } from "@/components/club/app";
import { THEME_COLORS } from "@/components/club/theme";
import "./styles.css";

type TelegramWebApp = {
  ready: () => void;
  expand: () => void;
  disableVerticalSwipes?: () => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  setBottomBarColor?: (color: string) => void;
};

const tg = (window as { Telegram?: { WebApp?: TelegramWebApp } }).Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
  // Sheets close with a downward swipe; keep Telegram from minimizing the app instead.
  tg.disableVerticalSwipes?.();

  // Telegram's header and background follow the app's Kun/Tun mode.
  const systemLight = window.matchMedia("(prefers-color-scheme: light)");
  const paintChrome = () => {
    const mode = document.documentElement.dataset.theme;
    const resolved = mode === "light" || mode === "dark" ? mode : systemLight.matches ? "light" : "dark";
    const color = THEME_COLORS[resolved];
    tg.setHeaderColor?.(color);
    tg.setBackgroundColor?.(color);
    tg.setBottomBarColor?.(color);
  };
  paintChrome();
  new MutationObserver(paintChrome).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  systemLight.addEventListener("change", paintChrome);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClubApp />
  </StrictMode>,
);
