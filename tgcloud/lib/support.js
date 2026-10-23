// Help-center requests: stored for the admins and delivered to them in Telegram,
// with the user's screenshot attached when there is one.

import { api, db, InputFile } from 'sdk';
import { sql } from 'sdk/db';
import { ADMIN_IDS } from './app.js';
import { displayName, touchClub } from './clubs.js';

export const SUPPORT_DAILY_LIMIT = 5;
export const SUPPORT_TEXT_MAX = 2000;
export const SUPPORT_IMAGE_MAX = 600_000; // base64 characters (~450 KB JPEG)

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const B64_INDEX = new Map([...B64].map((c, i) => [c, i]));

// The runtime has no Buffer (and atob isn't documented), so base64 is decoded by hand.
export function decodeBase64(text) {
  const clean = text.replace(/[^A-Za-z0-9+/]/g, '');
  const out = new Uint8Array(Math.floor((clean.length * 3) / 4));
  let bits = 0;
  let value = 0;
  let n = 0;
  for (const c of clean) {
    value = (value << 6) | B64_INDEX.get(c);
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out[n++] = (value >> bits) & 0xff;
    }
  }
  return out.subarray(0, n);
}

export async function requestsToday(ownerId) {
  const row = await db.get(sql`
    SELECT count(*) AS n FROM support_requests WHERE owner_id = ${ownerId} AND created_at > unixepoch() - 86400
  `);
  return Number(row?.n ?? 0);
}

// Saves the request and sends it to every admin. Returns the request id.
export async function createSupportRequest(user, { topic, text, lang, image }) {
  const club = await touchClub(user);
  await db.run(sql`
    INSERT INTO support_requests (owner_id, topic, text, lang, has_image)
    VALUES (${user.id}, ${topic}, ${text}, ${lang}, ${image ? 1 : 0})
  `);
  const row = await db.get(sql`SELECT id FROM support_requests WHERE owner_id = ${user.id} ORDER BY id DESC LIMIT 1`);
  const id = row?.id ?? 0;
  const handle = user.username ? ` @${user.username}` : '';
  const place = club?.clubName ? `\nKlub: ${club.clubName}` : '';
  const message =
    `🆘 Yordam so'rovi #${id}\n` +
    `${displayName(user)}${handle} (id ${user.id})${place}\n` +
    `Bo'lim: ${topic || '—'} · til: ${lang || '—'}\n\n${text}`;
  const photo = image ? decodeBase64(image) : null;
  for (const admin of ADMIN_IDS) {
    await api.sendMessage({ chat_id: admin, text: message.slice(0, 4000) });
    if (photo) {
      await api.sendPhoto({
        chat_id: admin,
        photo: new InputFile(photo, `sorov-${id}.jpg`, { type: 'image/jpeg' }),
        caption: `#${id} skrinshot`,
      });
    }
  }
  return id;
}
