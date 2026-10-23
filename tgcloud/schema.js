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

// Help-center requests from the Mini App ("So'rov qoldirish"). The screenshot itself is not
// stored: it goes straight to the admins in Telegram; the row keeps the text for 12 months.
export const supportRequests = table('support_requests', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ownerId: integer('owner_id'),
  topic: text('topic'),
  text: text('text'),
  lang: text('lang'),
  hasImage: boolean('has_image').default(false),
  status: text('status').default('new'),
  createdAt: integer('created_at').default(sql`(unixepoch())`),
}, (t) => ({
  ownerIdx: index('idx_support_owner_time').on(t.ownerId, t.createdAt),
}));
