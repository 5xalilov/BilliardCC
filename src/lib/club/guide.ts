// How the keypad works — shown once in onboarding and again under Klub → Qanday ishlaydi.
// The main screen carries no instructions, so this is the single place they live.
export const GUIDE: readonly (readonly [key: string, text: string])[] = [
  ["Stol", "Bosing — vaqt boshlanadi. Yana bosing — hisob."],
  ["0", "Tashqi mijoz: stolsiz, faqat bar."],
  ["BAR", "Buyurtmani tanlangan stolga yozish."],
  ["PAUZA", "Vaqtni to'xtatish va davom ettirish."],
  ["QO'SH · AYIR", "Qo'shimcha summa · oxirgi buyurtmani olib tashlash."],
  ["% · VIP · KO'CH", "Chegirma · VIP narx · boshqa stolga o'tkazish."],
  ["AC", "Ekranni tozalash. Ochiq hisoblar saqlanadi."],
];
