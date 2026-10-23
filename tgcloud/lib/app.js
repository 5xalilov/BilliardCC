// Where tgcloud serves the Mini App (dist-miniapp/, see tgcloud.jsonc).
// `npx tgcloud push` prints this URL; the app id is the public part of the CLI token.
export const MINI_APP_URL = 'https://app8805316759.tgcloud.ai/';

// Telegram user ids of the platform owner(s): they get the admin panel, receive premium
// requests and may run /botsetup. Send /myid to the bot to learn an id.
export const ADMIN_IDS = [8480714616];

export const BUTTONS = {
  open: '🎱 Kassani ochish',
  premium: '⭐ Premium',
  help: '❓ Yordam',
};

export const openAppButton = {
  text: BUTTONS.open,
  web_app: { url: MINI_APP_URL },
};

// Persistent keyboard under the input field, so the bot works with buttons alone.
export const mainKeyboard = {
  keyboard: [[openAppButton], [{ text: BUTTONS.premium }, { text: BUTTONS.help }]],
  resize_keyboard: true,
  is_persistent: true,
};
