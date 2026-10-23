// Every private message gets the button that opens the STOL Mini App.
// /start also pins that button as the chat's menu button (next to the input field).

import { api } from 'sdk';
import { MINI_APP_URL, openAppButton } from '../lib/app.js';

export default async function (message) {
  if (message.chat.type !== 'private') return;

  const isStart = message.text?.startsWith('/start');
  if (isStart) {
    await api.setChatMenuButton({
      chat_id: message.chat.id,
      menu_button: { type: 'web_app', text: 'Stol', web_app: { url: MINI_APP_URL } },
    });
  }

  await api.sendMessage({
    chat_id: message.chat.id,
    text: isStart
      ? 'STOL — bilyard klub kassasi.\nStollar vaqti, bar va hisob bitta oynada.'
      : 'Kassani ochish uchun pastdagi tugmani bosing.',
    reply_markup: { inline_keyboard: [[openAppButton]] },
  });
}
