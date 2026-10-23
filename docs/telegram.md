# Orde — Telegram'ga joylash (Telegram Serverless / tgcloud)

Ilova Telegram Mini App sifatida `https://app8805316759.tgcloud.ai/` manzilida
ochiladi. Bot doimiy tugmalar bilan ishlaydi: **🎱 Kassani ochish**, **⭐ Premium**,
**❓ Yordam**. `/start` chatning menyu tugmasini ham ilovaga bog'laydi.

## Admin (platforma egasi)

1. Botga `/myid` yozing — u Telegram ID'ingizni qaytaradi.
2. ID'ni `tgcloud/lib/app.js` dagi `ADMIN_IDS` ro'yxatiga qo'shing va push qiling.
3. Shundan keyin premium so'rovlari sizga keladi. `/botsetup` buyrug'i esa bot
   tavsifi va buyruqlarini `tgcloud/lib/texts.js` dan o'rnatadi.

## Tuzilma

| Yo'l | Nima |
|---|---|
| `mini-app/` | Mini App kirish nuqtasi (`index.html`, `main.tsx`) — `src/components/club` ni ishlatadi |
| `vite.miniapp.config.ts` | Statik build → `dist-miniapp/` |
| `tgcloud.jsonc` | `"static": { "source": "dist-miniapp", "spa": true }` |
| `tgcloud/handlers/message.js` | Bot: tugmali menyu, premium so'rovi, yordam, `/myid`, `/botsetup` |
| `tgcloud/lib/app.js` | Mini App manzili, tugmalar, `ADMIN_IDS` |
| `tgcloud/lib/texts.js` | Bot matnlari va BotFather tavsiflari |
| `.tgcloud/` | CLI holati va token — **git'ga kirmaydi** |

## Joylash — GitHub Actions orqali (tavsiya)

`.github/workflows/telegram-deploy.yml` build qiladi va Telegram'ga yuklaydi.

1. Bir marta: GitHub → repo → **Settings → Secrets and variables → Actions →
   New repository secret**. Nomi `TGCLOUD_TOKEN`, qiymati — @BotFather → bot →
   Serverless → CLI Access → Access token.
2. Shundan keyin `mini-app/`, `src/`, `public/`, `tgcloud/` yoki `tgcloud.jsonc`
   o'zgargan har bir push (`main` yoki shu branch) avtomatik joylanadi.
3. Qo'lda: **Actions → Telegram deploy → Run workflow** (tugma workflow `main`
   branchga tushgandan keyin chiqadi). Oldingi ishni qayta yurgizish uchun —
   ish sahifasida **Re-run jobs**.

Ish ketma-ketligi: install → typecheck → build → `tgcloud fetch` (bulut holatini
oladi) → `tgcloud push` → Mini App manzili javob berishini tekshirish →
webhook holati.

## Joylash — qo'lda

```sh
npm run tg -- login        # token: @BotFather → bot → Serverless → CLI Access → Access token
npm run miniapp:deploy     # build + push
npm run tg -- status       # bulutdagi holat
```

CI yoki bir martalik ishga tushirish uchun tokenni muhit o'zgaruvchisi orqali
berish mumkin: `TGCLOUD_TOKEN=app…:… npm run miniapp:deploy`. Tokenni hech
qachon faylga yozib commit qilmang.

## Eslatma

Ma'lumotlar (stollar, bar, tarix) hozircha har bir qurilmaning brauzer
xotirasida (localStorage) saqlanadi — xuddi veb versiyadagidek. Bir nechta
kassir bitta ma'lumotni ko'rishi kerak bo'lsa, tgcloud bazasi (`tgcloud/schema.js`)
va endpointlar orqali sinxronlash qo'shiladi.
