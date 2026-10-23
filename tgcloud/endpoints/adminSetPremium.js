// Admin panel: switch Premium for one club and tell its owner.

import { api, BotApiError, EndpointError } from 'sdk';
import { isAdmin, setPremium } from '../lib/clubs.js';

export default async function (input, ctx) {
  if (!isAdmin(ctx.initData.user?.id)) throw new EndpointError('Forbidden', { code: 'FORBIDDEN' });
  if (!Number.isInteger(input.ownerId) || typeof input.premium !== 'boolean') {
    throw new EndpointError('Bad input', { code: 'BAD_INPUT' });
  }
  const club = await setPremium(input.ownerId, input.premium);
  if (!club) throw new EndpointError('Club not found', { code: 'NOT_FOUND' });
  try {
    await api.sendMessage({
      chat_id: club.ownerId,
      text: club.premium
        ? '⭐ Premium yoqildi! Endi 30 tagacha stol ochishingiz mumkin. Ilovani qayta oching.'
        : 'Premium o\'chirildi. Bepul tarif: 3 ta stol.',
    });
  } catch (err) {
    // 403: the owner never started a private chat with the bot or blocked it.
    if (!(err instanceof BotApiError) || err.code !== 403) throw err;
  }
  return { club };
}
