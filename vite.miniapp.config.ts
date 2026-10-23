import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Static build of the club app for Telegram Mini App hosting (tgcloud).
// Separate from vite.config.ts, which builds the SSR web app for Vercel.
// Output: dist-miniapp/ — named as "static.source" in tgcloud.jsonc.
export default defineConfig({
  root: "mini-app",
  // public/ holds web-only platform files (__grok/, og.jpg); the favicon is imported from index.html.
  publicDir: false,
  base: "/",
  resolve: { tsconfigPaths: true },
  plugins: [tailwindcss(), viteReact()],
  build: {
    outDir: "../dist-miniapp",
    emptyOutDir: true,
  },
});
