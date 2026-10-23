// "Premium so'rash" from the Mini App: records the request and notifies the admins.

import { EndpointError } from 'sdk';
import { requestPremium } from '../lib/clubs.js';

export default async function (input, ctx) {
  const user = ctx.initData.user;
  if (!user) throw new EndpointError('No user', { code: 'NO_USER' });
  return { status: await requestPremium(user) };
}
