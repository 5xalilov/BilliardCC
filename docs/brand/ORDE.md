# Orde — brend kitobi

Orde — bilyard klub kassasi. Bu hujjat ilovaning **o'ziga xos ko'rinishini**
belgilaydi: qaysi rang, qaysi shakl, qaysi qoida. Har bir ekran, ijtimoiy
tarmoq posti, video va reklama shu qoidalarga amal qilsa, Orde qayerda
ko'rinsa ham tanib olinadi.

Figma: https://www.figma.com/design/di3aN1oHFHyiTAda9RUnoJ (palitra doskasi +
`STOL · Tun` va `STOL · Kun` o'zgaruvchi to'plamlari — eski nom bilan)

## 1. Brend uchligi

| Nomi | HEX | Ma'nosi |
|---|---|---|
| **Stol Orange** | `#FF7D0A` | Brendning imzosi. Harakat tugmalari, logotip chizig'i, favicon shari. |
| **Sakkizlik qora** | `#000000` / `#151311` | 8-shar. Tun rejimi foni, Kun rejimi matni. |
| **Kiy shari oqi** | `#F7F6F4` | Oq kiy shari. Tun rejimi matni, Kun rejimi foni. |

Stol Orange OG rasmdagi (`public/og.jpg`) to'q sariqdan olingan va **ikkala
rejimda bir xil**. Ilgari ishlatilgan `#FF9F0A` Apple iOS'ning standart
to'q sarig'i edi. U har bir iPhone kalkulyatori klonida bor, shuning uchun
endi ishlatilmaydi.

## 2. Ikki rejim

Tanlov: **Sozlamalar → Ko'rinish → Avto / Kun / Tun**. "Avto" telefon
sozlamasiga ergashadi. Tanlov saqlanadi va sahifa ochilishidayoq (oq chaqnashsiz)
qo'llanadi.

| Token | Tun | Kun | Qayerda |
|---|---|---|---|
| `bg` | `#000000` | `#F7F6F4` | Asosiy fon |
| `sheet` | `#171514` | `#FFFFFF` | Pastdan chiquvchi oynalar |
| `key` | `#322F2C` | `#E1DCD4` | Stol (raqam) tugmalari |
| `elev` | `#2E2B28` | `#E9E4DC` | Oyna ichidagi kartalar |
| `fn` | `#5A554F` | `#C9C1B6` | AC, %, VIP, KO'CH; tanlanmagan tugmalar |
| `line` | `#3D3936` | `#D2CCC2` | Ajratgichlar |
| `fg` | `#F7F6F4` | `#151311` | Asosiy matn |
| `muted` | `#C2BCB4` | `#5C5650` | Ikkinchi darajali matn |
| `op` | `#FF7D0A` | `#FF7D0A` | Harakat tugmalari (BAR, PAUZA, HISOB…) |
| `on-op` | `#160A00` | `#160A00` | To'q sariq ustidagi yozuv |
| `op-ink` | `#FF9A3D` | `#A84400` | Oddiy fondagi to'q sariq matn |
| `live` | `#FF7D0A` | `#A84400` | Ishlayotgan stol halqasi va taymeri |

Neytral kulranglar sof kulrang emas, **iliq ko'mir** tusida (biroz qizg'ish-
jigarrang). Bu to'q sariq bilan bitta oila bo'lib ko'rinadi va iOS
kalkulyatorining sovuq kulranglaridan farq qiladi.

## 3. Imzo qoidalari (Ordeni Orde qiladigan narsalar)

1. **To'q sariq ustida doim qora yozuv.** Hech qachon oq emas. Favicon'dagi
   to'q sariq shar ustidagi qora "8" — shu qoidaning o'zi.
2. **Hamma narsa yumaloq** — shar kabi. Tugmalar doira, kartalar katta
   radiusli (24px), chiplar to'liq yumaloq.
3. **Tanlangan stol — shar.** Tun rejimida tanlangan stol oq **kiy shari**ga,
   Kun rejimida qora **8-shar**ga aylanadi.
4. **Ishlayotgan stol — to'q sariq halqa** va ichida taymer.
5. **To'q sariq — faqat harakat uchun.** Ekranning ~10% idan oshmaydi:
   o'ng ustun, tasdiqlash tugmasi, tanlangan variant. Bezak uchun ishlatilmaydi.
6. **Shrift — Outfit.** Katta summa yengil (300), tugma yozuvlari qalin, katta
   harf, keng oraliq bilan.
7. **Logotip — `orde` so'zi, birinchi "o" — to'q sariq shar.** Geometrik kichik
   harflar, shriftsiz chizilgan (SVG). Shar ichidagi oq doira — bilyard sharidagi
   raqam doirasi. Fayllar: `docs/brand/logo/` (tun, kun, shaffof, ikonka).
   Ilovada: `src/components/club/logo.tsx`. Favicon va ikonka — qora fon ustida shar.

## 4. Qilmang

- To'q sariq ustiga oq matn qo'ymang (2:1 — o'qilmaydi).
- Boshqa to'q sariq tusini ishlatmang (`#FF9F0A`, `#FFA500`…). Faqat `#FF7D0A`.
- Kun rejimida to'q sariqni **matn** sifatida ishlatmang — buning uchun
  `op-ink` (`#A84400`) bor.
- Yangi urg'u rangi (ko'k, yashil…) qo'shmang. Holatlar halqa, yozuv va
  joylashuv bilan farqlanadi.

## 5. Kontrast

`node .grok/skills/ui-colorist/scripts/contrast.mjs docs/brand/orde-palette.json`

Ikkala rejimda **42/42 juftlik WCAG 2 AA dan o'tadi**. Asosiy matn 17–19:1,
to'q sariq ustidagi yozuv 7.6:1 (AAA). APCA bo'yicha to'q sariq ustidagi
yozuv Lc 54. Bu o'rta yorqinlikdagi to'q sariqning tabiiy chegarasi (sof qora
bilan ham ~55), shuning uchun tugma yozuvlari qalin va katta harfda.

## 6. Egalik haqida

Ranglar va uslub Ordeni **tanib olinadigan** qiladi, lekin rangni qonun
himoya qilmaydi. Klonlarga qarshi haqiqiy himoya — **nom va logotip**:
"Orde" va logotipni savdo belgisi sifatida ro'yxatdan o'tkazish (O'zbekistonda
Intellektual mulk agentligi). Shuningdek, har bir post va videoda bir xil
uchlik va logotipdan foydalanish kerak. Shunda nusxa ko'chirgan har qanday
ilova "Ordega o'xshab qolibdi" deb ko'rinadi.
