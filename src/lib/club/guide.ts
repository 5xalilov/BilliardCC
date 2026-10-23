// How the keypad works — one entry per key group. The tour floats each one over its real
// keys (matched by data-tour) right after setup; Klub → Qanday ishlaydi lists them again.
// Texts are i18n keys guide.<target>.title / guide.<target>.text, with {units} (the
// business kind's plural noun) and {free} (free unit limit) as placeholders.
export type GuideTarget =
  | "tables"
  | "locked"
  | "bar"
  | "pause"
  | "addsub"
  | "discount"
  | "bottom"
  | "hisob"
  | "clear"
  | "header";

export const GUIDE: readonly { target: GuideTarget }[] = [
  { target: "tables" },
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
