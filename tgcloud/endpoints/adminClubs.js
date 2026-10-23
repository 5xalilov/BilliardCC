// Admin panel: every club, Premium requests first.

import { EndpointError } from 'sdk';
import { isAdmin, listClubs } from '../lib/clubs.js';

export default async function (input, ctx) {
  if (!isAdmin(ctx.initData.user?.id)) throw new EndpointError('Forbidden', { code: 'FORBIDDEN' });
  return { clubs: await listClubs() };
}
