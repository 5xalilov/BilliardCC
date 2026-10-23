#!/usr/bin/env node
// WCAG 2.x contrast + APCA Lc for colour role pairs.
// Usage:
//   node contrast.mjs "#fff" "#000"                  one pair
//   node contrast.mjs palette.json                   {"pairs":[["fg","bg","text"],...],"colors":{...}}
// Pair kinds: text (>=4.5, |Lc|>=60), large (>=3, |Lc|>=45), ui (>=3, sole
// identifier: outline-only control, focus/state ring), sep (>=1.25, filled
// surface vs neighbour when a label already identifies the control).

import { readFileSync } from "node:fs";

const hexToRgb = (hex) => {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  const n = parseInt(h.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const lin = (c) => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex) => {
  const [r, g, b] = hexToRgb(hex).map(lin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const wcag = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// APCA 0.0.98G-4g (text on background)
export const apca = (text, bg) => {
  const y = (hex) => {
    const [r, g, b] = hexToRgb(hex).map((c) => (c / 255) ** 2.4);
    const v = 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
    return v > 0.022 ? v : v + (0.022 - v) ** 1.414;
  };
  const yt = y(text);
  const yb = y(bg);
  if (Math.abs(yb - yt) < 0.0005) return 0;
  let sapc;
  if (yb > yt) {
    sapc = (yb ** 0.56 - yt ** 0.57) * 1.14;
    return sapc < 0.1 ? 0 : (sapc - 0.027) * 100;
  }
  sapc = (yb ** 0.65 - yt ** 0.62) * 1.14;
  return sapc > -0.1 ? 0 : (sapc + 0.027) * 100;
};

const rules = {
  text: { wcag: 4.5, apca: 60 },
  large: { wcag: 3, apca: 45 },
  ui: { wcag: 3, apca: 0 },
  sep: { wcag: 1.25, apca: 0 },
};

const check = (fgHex, bgHex, kind = "text") => {
  const ratio = wcag(fgHex, bgHex);
  const lc = apca(fgHex, bgHex);
  const rule = rules[kind];
  const pass = ratio >= rule.wcag && Math.abs(lc) >= rule.apca;
  return { ratio: ratio.toFixed(2), lc: lc.toFixed(1), pass };
};

const args = process.argv.slice(2);
if (args.length >= 2 && args[0].startsWith("#")) {
  const r = check(args[0], args[1], args[2] ?? "text");
  console.log(`${args[0]} on ${args[1]}: ${r.ratio}:1  Lc ${r.lc}  ${r.pass ? "PASS" : "FAIL"}`);
} else if (args.length === 1) {
  const spec = JSON.parse(readFileSync(args[0], "utf8"));
  let failed = 0;
  for (const [fg, bg, kind = "text"] of spec.pairs) {
    const r = check(spec.colors[fg], spec.colors[bg], kind);
    if (!r.pass) failed++;
    console.log(
      `${r.pass ? "PASS" : "FAIL"}  ${fg.padEnd(10)} on ${bg.padEnd(10)} ${kind.padEnd(5)} ${r.ratio.padStart(5)}:1  Lc ${r.lc.padStart(6)}`,
    );
  }
  process.exitCode = failed ? 1 : 0;
} else {
  console.log('usage: contrast.mjs "#fg" "#bg" [text|large|ui|sep]  |  contrast.mjs palette.json');
}
