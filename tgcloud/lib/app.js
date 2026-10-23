// Where tgcloud serves the Mini App (dist-miniapp/, see tgcloud.jsonc).
// `npx tgcloud push` prints this URL; the app id is the public part of the CLI token.
export const MINI_APP_URL = 'https://app8805316759.tgcloud.ai/';

export const openAppButton = {
  text: '🎱 Stolni ochish',
  web_app: { url: MINI_APP_URL },
};
