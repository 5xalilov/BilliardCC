import { table, integer, text, boolean, index, sql } from 'sdk/db';

// One row per club owner (their Telegram user id). The Mini App keeps the till itself
// on the device; the server holds what the platform owner manages: who uses Orde and
// who has Premium.
export const clubs = table('clubs', {
  ownerId: integer('owner_id').primaryKey(),
  ownerName: text('owner_name'),
  username: text('username'),
  clubName: text('club_name'),
  tableCount: integer('table_count').default(3),
  premium: boolean('premium').default(false),
  premiumRequested: boolean('premium_requested').default(false),
  createdAt: integer('created_at').default(sql`(unixepoch())`),
  lastSeen: integer('last_seen').default(sql`(unixepoch())`),
}, (t) => ({
  lastSeenIdx: index('idx_clubs_last_seen').on(t.lastSeen),
}));
