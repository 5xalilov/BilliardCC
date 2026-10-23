// Bot copy. BOT_PROFILE is applied by /botsetup (admins) — or paste it into @BotFather.

export const BOT_PROFILE = {
  // @BotFather → Edit Bot → Edit About (≤120)
  short_description: "Bilyard klub kassasi: stollar vaqti, bar va hisob — bitta oynada. Bepul 3 stolgacha.",
  // @BotFather → Edit Bot → Edit Description (≤512), shown before the first /start
  description:
    "Orde — bilyard klub uchun kassa.\n\n" +
    "• Stolni bosing — vaqt boshlanadi, yana bosing — hisob\n" +
    "• Bar buyurtmalari, chegirma, pauza, VIP narx\n" +
    "• Naqd, karta yoki aralash to'lov, kunlik tarix\n" +
    "• Kun va tun rejimi\n\n" +
    "Bepul: 3 tagacha stol. Premium: 30 tagacha.",
  commands: [
    { command: 'start', description: 'Kassani ochish' },
    { command: 'premium', description: 'Premium haqida' },
    { command: 'help', description: 'Qanday ishlaydi' },
  ],
};

export const TEXT = {
  welcome:
    'Orde — bilyard klub kassasi.\nStollar vaqti, bar va hisob bitta oynada.\n\nKassani ochish uchun pastdagi tugmani bosing.',
  fallback: 'Kassani ochish uchun pastdagi tugmani bosing.',
  help:
    'Qanday ishlaydi\n\n' +
    'Stol — bosing, vaqt boshlanadi. Yana bosing — hisob.\n' +
    '0 — tashqi mijoz: stolsiz, faqat bar.\n' +
    'BAR — buyurtmani tanlangan stolga yozish.\n' +
    'PAUZA — vaqtni to\'xtatish.\n' +
    'QO\'SH · AYIR — qo\'shimcha summa · oxirgi buyurtmani olib tashlash.\n' +
    '% · VIP · KO\'CH — chegirma · VIP narx · boshqa stolga o\'tkazish.\n' +
    'AC — ekranni tozalash, ochiq hisoblar saqlanadi.',
  premium:
    'Premium\n\n• 30 tagacha stol (bepul tarifda 3 ta)\n• VIP stollar va alohida narxlar',
  premiumActive: 'Premium faol ✅',
  premiumSent: 'So\'rovingiz adminga yuborildi — tez orada bog\'lanamiz.',
  premiumClosed: 'Premium ulash tez orada ochiladi.',
};
