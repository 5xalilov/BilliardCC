// Private chat: a persistent button keyboard (open the Mini App, Premium, Help) so the
// bot works with taps alone. /start also pins the Mini App as the chat menu button.

import { api } from 'sdk';
import { ADMIN_IDS, BUTTONS, MINI_APP_URL, mainKeyboard, openAppButton } from '../lib/app.js';
import { BOT_PROFILE, TEXT } from '../lib/texts.js';

export default async function (message) {
  if (message.chat.type !== 'private') return;
  const chat_id = message.chat.id;
  const text = (message.text ?? '').trim();
  const command = text.startsWith('/') ? text.split(/[\s@]/)[0].toLowerCase() : null;
  const isAdmin = ADMIN_IDS.includes(message.from?.id);

  if (command === '/start') {
    await api.setChatMenuButton({
      chat_id,
      menu_button: { type: 'web_app', text: 'Orde', web_app: { url: MINI_APP_URL } },
    });
    await api.sendMessage({ chat_id, text: TEXT.welcome, reply_markup: mainKeyboard });
    return;
  }

  if (command === '/help' || text === BUTTONS.help) {
    await api.sendMessage({ chat_id, text: TEXT.help, reply_markup: mainKeyboard });
    return;
  }

  if (command === '/premium' || text === BUTTONS.premium) {
    await api.sendMessage({ chat_id, text: TEXT.premium });
    if (ADMIN_IDS.length === 0) {
      await api.sendMessage({ chat_id, text: TEXT.premiumClosed, reply_markup: mainKeyboard });
      return;
    }
    const who = message.from;
    const name = [who?.first_name, who?.last_name].filter(Boolean).join(' ');
    const handle = who?.username ? ` @${who.username}` : '';
    for (const admin of ADMIN_IDS) {
      await api.sendMessage({ chat_id: admin, text: `⭐ Premium so'rovi: ${name}${handle} (id ${who?.id})` });
    }
    await api.sendMessage({ chat_id, text: TEXT.premiumSent, reply_markup: mainKeyboard });
    return;
  }

  if (command === '/myid') {
    await api.sendMessage({ chat_id, text: `Telegram ID: ${message.from?.id}` });
    return;
  }

  if (command === '/botsetup' && isAdmin) {
    await api.setMyShortDescription({ short_description: BOT_PROFILE.short_description });
    await api.setMyDescription({ description: BOT_PROFILE.description });
    await api.setMyCommands({ commands: BOT_PROFILE.commands });
    await api.sendMessage({ chat_id, text: 'Bot tavsifi va buyruqlari yangilandi.' });
    return;
  }

  await api.sendMessage({
    chat_id,
    text: TEXT.fallback,
    reply_markup: { inline_keyboard: [[openAppButton]] },
  });
}
