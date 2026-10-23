// How the keypad works — one entry per key group. The tour floats each one over its real
// keys (matched by data-tour) right after setup; Klub → Qanday ishlaydi lists them again.
// Texts are i18n keys guide.<target>.title / guide.<target>.text, with {units} (the
// business kind's plural noun) and {free} (free unit limit) as placeholders.
export type GuideTarget =
  | "tables"
  | "hold"
  | "locked"
  | "bar"
  | "pause"
  | "addsub"
  | "discount"
  | "bottom"
  | "hisob"
  | "clear"
  | "header";

// spot: which data-tour element to light up when it isn't the target itself.
export const GUIDE: readonly { target: GuideTarget; spot?: string }[] = [
  { target: "tables" },
  { target: "hold", spot: "tables" },
  { target: "locked" },
  { target: "bar" },
  { target: "pause" },
  { target: "addsub" },
  { target: "discount" },
  { target: "bottom" },
  { target: "hisob" },
  { target: "clear" },
  { target: "header" },
];
