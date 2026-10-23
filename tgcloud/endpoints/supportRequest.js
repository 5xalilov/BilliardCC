// "So'rov qoldirish" from the Mini App help center: text, topic and an optional screenshot
// (JPEG, base64, already compressed on the device). Limited to a few requests per day.

import { EndpointError } from 'sdk';
import {
  SUPPORT_DAILY_LIMIT,
  SUPPORT_IMAGE_MAX,
  SUPPORT_TEXT_MAX,
  createSupportRequest,
  requestsToday,
} from '../lib/support.js';

export default async function (input, ctx) {
  const user = ctx.initData.user;
  if (!user) throw new EndpointError('No user', { code: 'NO_USER' });
  const text = typeof input.text === 'string' ? input.text.trim().slice(0, SUPPORT_TEXT_MAX) : '';
  if (text.length < 5) throw new EndpointError('Text too short', { code: 'TOO_SHORT' });
  const topic = typeof input.topic === 'string' ? input.topic.slice(0, 60) : '';
  const lang = typeof input.lang === 'string' ? input.lang.slice(0, 10) : '';
  const image = typeof input.image === 'string' && input.image.length > 0 ? input.image : null;
  if (image && (image.length > SUPPORT_IMAGE_MAX || !/^[A-Za-z0-9+/]+=*$/.test(image))) {
    throw new EndpointError('Image too big', { code: 'IMAGE_TOO_BIG' });
  }
  if ((await requestsToday(user.id)) >= SUPPORT_DAILY_LIMIT) {
    throw new EndpointError('Too many requests', { code: 'RATE_LIMIT' });
  }
  const id = await createSupportRequest(user, { topic, text, lang, image });
  return { id };
}
