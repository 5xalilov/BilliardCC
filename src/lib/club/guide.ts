// How the keypad works — one entry per key group. The tour floats each one over its real
// keys (matched by data-tour) right after setup; Klub → Qanday ishlaydi lists them again.
// The main screen carries no instructions, so this is the single place they live.
export type GuideStep = { target: string; title: string; text: string };

export const GUIDE: readonly GuideStep[] = [
  { target: "tables", title: "Stollar", text: "Stolni bosing — vaqt boshlanadi. Ishlayotgan stolni yana bosing — hisob ochiladi." },
  { target: "locked", title: "Qulfli stollar", text: "Bepul tarifda 3 ta stol. Qolganlari Premium bilan ochiladi." },
  { target: "bar", title: "BAR", text: "Ichimlik va gazakni tanlangan stol hisobiga yozadi." },
  { target: "pause", title: "PAUZA", text: "Vaqtni to'xtatadi. Yana bosing — davom etadi." },
  { target: "addsub", title: "QO'SH · AYIR", text: "QO'SH — qo'shimcha summa. AYIR — oxirgi buyurtmani olib tashlaydi." },
  { target: "discount", title: "%", text: "Tanlangan hisobga chegirma." },
  { target: "bottom", title: "KO'CH · 0 · VIP", text: "KO'CH — boshqa stolga o'tkazish. 0 — stolsiz tashqi mijoz. VIP — VIP narx." },
  { target: "hisob", title: "HISOB", text: "Hisobni yopish: naqd, karta yoki aralash." },
  { target: "clear", title: "⌫ · AC", text: "⌫ — oxirgi amalni bekor qiladi. AC — ekranni tozalaydi, hisoblar saqlanadi." },
  { target: "header", title: "Tarix · Sozlamalar", text: "Chapda — kunlik tarix. O'ngda — klub, menyu va Premium." },
];
