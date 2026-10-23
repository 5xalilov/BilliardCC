# Orde — Gemini uchun rasm promptlari

Kirish ekranlari rasmsiz ham to'liq ishlaydi. Rasmlar tayyor bo'lsa, ularni
yuboring: `public/onboarding/` ga joylab, `src/components/club/onboarding.tsx`
dagi `ART` ro'yxatiga ulayman.

**Umumiy qoidalar:**
- Promptlarni ingliz tilida bering — Gemini rasmni aniqroq chizadi.
- Har bir rasmni 2 xil fonda yarating: **Tun** (sof qora) va **Kun** (fil suyagi rangi).
- Rasmda **matn bo'lmasin**: matn ilovaning o'zida yoziladi, rasmdagi harflar esa
  odatda buzilib chiqadi.

## Umumiy uslub (har bir promptning oxiriga qo'shing)

```
Style: minimal, premium product illustration, soft studio lighting, clean
geometric shapes, plenty of empty space. Strict palette: pure black #000000
background (or ivory #F7F6F4 for the light version), signature orange #FF7D0A,
ivory #F7F6F4, warm charcoal #322F2C. No text, no letters, no numbers, no logos,
no people's faces. Matte finish, subtle soft shadows, high detail, 4:3 aspect ratio.
```

## 1. Salomlashuv — `public/onboarding/welcome-tun.webp` / `welcome-kun.webp` (4:3)

```
A single glossy orange billiard ball (#FF7D0A) with a small ivory number circle
on its front (the circle is empty, no digit), resting on the edge of a dark
billiard table at night, a soft warm light from above, the ball casting a gentle
shadow. Calm, premium, cinematic, minimal composition, the ball slightly left of
center, lots of negative space.
```

## 2. Qanday ishlaydi — `public/onboarding/guide-tun.webp` / `guide-kun.webp` (4:3)

```
Top-down view of a smartphone lying on a dark billiard table next to a cue and a
cube of blue chalk. The phone screen shows an abstract calculator-style keypad of
round buttons: charcoal circles, one circle with a thin orange ring, one ivory
circle, and a column of orange circles on the right. No digits or text on the
buttons. Soft overhead light, minimal, premium.
```

## 3. Klubni sozlash — `public/onboarding/setup-tun.webp` / `setup-kun.webp` (4:3)

```
An isometric miniature of a cozy modern billiard club interior: three billiard
tables in a row under warm pendant lamps, an orange ball and an ivory ball on the
nearest table, a small bar counter in the corner. Clean geometric low-detail 3D
style, dark ambience with orange accents, no people, no signage, no text.
```

## 4. Bot profili (ixtiyoriy) — 640×640

Avatar allaqachon tayyor: `docs/brand/logo/orde-bot-avatar.png`. U logotip bilan
bir xil, shuning uchun Gemini shart emas. Uni @BotFather → Edit Bot → Edit
Botpic orqali yuklang.
