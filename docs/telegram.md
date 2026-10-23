# STOL — Telegram'ga joylash (Telegram Serverless / tgcloud)

Ilova Telegram Mini App sifatida `https://app8805316759.tgcloud.ai/` manzilida
ochiladi. Bot `/start` yoki istalgan xabarga "🎱 Stolni ochish" tugmasi bilan
javob beradi va chatning menyu tugmasini ham shu ilovaga bog'laydi.

## Tuzilma

| Yo'l | Nima |
|---|---|
| `mini-app/` | Mini App kirish nuqtasi (`index.html`, `main.tsx`) — `src/components/club` ni ishlatadi |
| `vite.miniapp.config.ts` | Statik build → `dist-miniapp/` |
| `tgcloud.jsonc` | `"static": { "source": "dist-miniapp", "spa": true }` |
| `tgcloud/handlers/message.js` | Bot: xabarga Mini App tugmasi bilan javob |
| `tgcloud/lib/app.js` | Mini App manzili |
| `.tgcloud/` | CLI holati va token — **git'ga kirmaydi** |

## Joylash

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
