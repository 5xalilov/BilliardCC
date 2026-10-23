// Calls into the bot's tgcloud endpoints (tgcloud/endpoints/*). Only works inside Telegram:
// the official telegram-web-app.js signs each call with the Mini App's init data, and the
// platform verifies it before the endpoint runs. Outside Telegram the app stays local.

type CloudError = { message?: string; type?: string; parameters?: { code?: string } };

type WebApp = {
  initData?: string;
  Serverless?: {
    call: (name: string, input: object, cb: (err: CloudError | null, result: unknown) => void) => void;
  };
};

function webApp(): WebApp | null {
  if (typeof window === "undefined") return null;
  const tg = (window as { Telegram?: { WebApp?: WebApp } }).Telegram?.WebApp;
  return tg?.initData && tg.Serverless ? tg : null;
}

export function cloudAvailable() {
  return webApp() !== null;
}

export function callCloud<T>(name: string, input: object = {}): Promise<T> {
  const tg = webApp();
  if (!tg?.Serverless) return Promise.reject(new Error("Telegram tashqarisida"));
  return new Promise((resolve, reject) =>
    tg.Serverless!.call(name, input, (err, result) =>
      err ? reject(Object.assign(new Error(err.message ?? "Server xatosi"), err)) : resolve(result as T),
    ),
  );
}

export type SyncResult = { premium: boolean; premiumRequested: boolean; isAdmin: boolean };

export type CloudClub = {
  ownerId: number;
  ownerName: string | null;
  username: string | null;
  clubName: string | null;
  tableCount: number;
  premium: boolean;
  premiumRequested: boolean;
  createdAt: number;
  lastSeen: number;
};
