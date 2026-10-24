// Help-center requests: stored for the admins and delivered to them in Telegram,
// with the user's screenshot attached when there is one.

import { api, db, InputFile } from 'sdk';
import { sql } from 'sdk/db';
import { ADMIN_IDS } from './app.js';
import { displayName, touchClub } from './clubs.js';

export const SUPPORT_DAILY_LIMIT = 5;
export const SUPPORT_TEXT_MAX = 2000;
// base64 characters (~210 KB JPEG). Serverless calls with much larger bodies were seen to fail
// before the endpoint ran, so the Mini App compresses below this.
export const SUPPORT_IMAGE_MAX = 300_000;

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
  // A copy, not a view: the upload must not carry the unused tail of the buffer.
  return out.slice(0, n);
}

export async function requestsToday(ownerId) {
  const row = await db.get(sql`
    SELECT count(*) AS n FROM support_requests
    WHERE owner_id = ${ownerId} AND created_at > unixepoch() - 86400 AND status = 'sent'
  `);
  return Number(row?.n ?? 0);
}

// Sends the screenshot as a photo; if Telegram refuses it as a photo, as a file.
async function sendScreenshot(chat_id, bytes, id) {
  const file = () => new InputFile(bytes, `sorov-${id}.jpg`, { type: 'image/jpeg' });
  const caption = `#${id} skrinshot`;
  try {
    await api.sendPhoto({ chat_id, photo: file(), caption });
  } catch (err) {
    console.warn(`support #${id}: sendPhoto failed, sending as a document`, err);
    await api.sendDocument({ chat_id, document: file(), caption });
  }
}

// Saves the request and sends it to every admin. Each send is tried on its own, so a failed
// screenshot never loses the text. Returns the request id and how many admins got the text.
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
  let photo = null;
  try {
    photo = image ? decodeBase64(image) : null;
  } catch (err) {
    console.error(`support #${id}: screenshot could not be decoded`, err);
  }
  const lost = image && !photo ? "\n\n⚠️ Skrinshot o'qilmadi." : '';
  const body =
    `🆘 Yordam so'rovi #${id}\n` +
    `${displayName(user)}${handle} (id ${user.id})${place}\n` +
    `Bo'lim: ${topic || '—'} · til: ${lang || '—'}\n\n${text}`;
  const message = body.slice(0, 3900) + lost;

  let delivered = 0;
  for (const admin of ADMIN_IDS) {
    try {
      await api.sendMessage({ chat_id: admin, text: message });
      delivered++;
    } catch (err) {
      console.error(`support #${id}: message to admin ${admin} failed`, err);
      continue;
    }
    if (!photo) continue;
    try {
      await sendScreenshot(admin, photo, id);
    } catch (err) {
      console.error(`support #${id}: screenshot to admin ${admin} failed`, err);
      await api
        .sendMessage({ chat_id: admin, text: `#${id}: skrinshotni yuborib bo'lmadi.` })
        .catch(() => {});
    }
  }
  const status = delivered > 0 ? 'sent' : 'undelivered';
  await db.run(sql`UPDATE support_requests SET status = ${status} WHERE id = ${id}`);
  return { id, delivered };
}
