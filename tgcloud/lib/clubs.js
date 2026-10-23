// Club records and premium requests, shared by the bot handler and the endpoints.
// Raw SQL keeps the statements explicit; booleans come back as 0/1 and are normalised here.

import { api, db } from 'sdk';
import { sql } from 'sdk/db';
import { ADMIN_IDS } from './app.js';

const toClub = (row) =>
  row && {
    ownerId: row.owner_id,
    ownerName: row.owner_name,
    username: row.username,
    clubName: row.club_name,
    tableCount: row.table_count,
    premium: Boolean(row.premium),
    premiumRequested: Boolean(row.premium_requested),
    createdAt: row.created_at,
    lastSeen: row.last_seen,
  };

export const isAdmin = (userId) => ADMIN_IDS.includes(userId);

export function displayName(user) {
  return [user?.first_name, user?.last_name].filter(Boolean).join(' ');
}

// Insert on first contact, refresh identity and last_seen afterwards. clubName/tableCount
// are only overwritten when the caller knows them (the Mini App does; the bot does not).
export async function touchClub(user, { clubName = null, tableCount = null } = {}) {
  await db.run(sql`
    INSERT INTO clubs (owner_id, owner_name, username, club_name, table_count, last_seen)
    VALUES (${user.id}, ${displayName(user)}, ${user.username ?? null}, ${clubName}, ${tableCount ?? 3}, unixepoch())
    ON CONFLICT(owner_id) DO UPDATE SET
      owner_name = excluded.owner_name,
      username = excluded.username,
      club_name = COALESCE(${clubName}, clubs.club_name),
      table_count = COALESCE(${tableCount}, clubs.table_count),
      last_seen = unixepoch()
  `);
  return getClub(user.id);
}

export async function getClub(ownerId) {
  return toClub(await db.get(sql`SELECT * FROM clubs WHERE owner_id = ${ownerId}`));
}

export async function listClubs() {
  const rows = await db.all(sql`
    SELECT * FROM clubs ORDER BY premium_requested DESC, last_seen DESC LIMIT 300
  `);
  return rows.map(toClub);
}

export async function setPremium(ownerId, premium) {
  await db.run(sql`
    UPDATE clubs SET premium = ${premium ? 1 : 0}, premium_requested = 0 WHERE owner_id = ${ownerId}
  `);
  return getClub(ownerId);
}

// Marks the request and tells every admin.
// Returns 'active' (already Premium), 'sent', or 'closed' (no admin configured).
export async function requestPremium(user) {
  const club = await touchClub(user);
  if (club.premium) return 'active';
  await db.run(sql`UPDATE clubs SET premium_requested = 1 WHERE owner_id = ${user.id}`);
  if (ADMIN_IDS.length === 0) return 'closed';
  const handle = user.username ? ` @${user.username}` : '';
  const place = club.clubName ? ` — ${club.clubName}` : '';
  for (const admin of ADMIN_IDS) {
    await api.sendMessage({
      chat_id: admin,
      text: `⭐ Premium so'rovi: ${displayName(user)}${handle}${place} (id ${user.id})\nAdmin panel: Mini App → Klub → Admin panel`,
    });
  }
  return 'sent';
}
