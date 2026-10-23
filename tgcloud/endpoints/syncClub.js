// Mini App → server on open and after club settings change. Returns what the server
// decides: Premium and admin access are never taken from the client.

import { EndpointError } from 'sdk';
import { isAdmin, touchClub } from '../lib/clubs.js';

export default async function (input, ctx) {
  const user = ctx.initData.user;
  if (!user) throw new EndpointError('No user', { code: 'NO_USER' });
  const clubName = typeof input.clubName === 'string' ? input.clubName.slice(0, 64) : null;
  const tableCount = Number.isInteger(input.tableCount) ? Math.min(Math.max(input.tableCount, 1), 30) : null;
  const club = await touchClub(user, { clubName, tableCount });
  return { premium: club.premium, premiumRequested: club.premiumRequested, isAdmin: isAdmin(user.id) };
}
