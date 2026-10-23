import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_SETTINGS,
  MAX_TABLES,
  FREE_TABLE_LIMIT,
  SAMPLE_MENU,
  activeTables,
  formatSom,
  unitRate,
  quote,
  tableLimit,
  uid,
  type Bill,
  type LineItem,
  type MenuItem,
  type Session,
  type Settings,
  type UnitConfig,
} from "@/lib/club/logic";
import type { SyncResult } from "@/lib/club/cloud";
import { placeLabel } from "@/lib/club/labels";
import { translate, type TKey, type TVars } from "@/lib/i18n";

export type Sheet =
  | { id: string; kind: "bar" }
  | { id: string; kind: "discount"; sessionId: string }
  | { id: string; kind: "close"; sessionId: string }
  | { id: string; kind: "split"; sessionId: string }
  | { id: string; kind: "void"; sessionId: string }
  | { id: string; kind: "receipt"; billId: string }
  | { id: string; kind: "history" }
  | { id: string; kind: "bill"; billId: string }
  | { id: string; kind: "settings" }
  | { id: string; kind: "menu" }
  | { id: string; kind: "help" }
  | { id: string; kind: "transfer"; sessionId: string }
  | { id: string; kind: "walkins" }
  | { id: string; kind: "premium" }
  | { id: string; kind: "admin" }
  | { id: string; kind: "unit"; n: number }
  | { id: string; kind: "product"; itemId: string | null }
  | { id: string; kind: "pick"; field: PickField; n?: number }
  | { id: string; kind: "settingsPage"; page: SettingsPage };

export type SheetInput =
  | { kind: "bar" }
  | { kind: "discount"; sessionId: string }
  | { kind: "close"; sessionId: string }
  | { kind: "split"; sessionId: string }
  | { kind: "void"; sessionId: string }
  | { kind: "receipt"; billId: string }
  | { kind: "history" }
  | { kind: "bill"; billId: string }
  | { kind: "settings" }
  | { kind: "menu" }
  | { kind: "help" }
  | { kind: "transfer"; sessionId: string }
  | { kind: "walkins" }
  | { kind: "premium" }
  | { kind: "admin" }
  | { kind: "unit"; n: number }
  | { kind: "product"; itemId: string | null }
  | { kind: "pick"; field: PickField; n?: number }
  | { kind: "settingsPage"; page: SettingsPage };

// Single-choice picker sheets opened from settings (iOS-style list with a check mark).
export type PickField = "lang" | "business" | "unitKind";

// Settings category pages opened from the settings home.
export type SettingsPage = "general" | "units" | "prices" | "appearance";

export type SetupInput = Pick<Settings, "clubName" | "tableCount" | "rate" | "vipRate"> & {
  sampleMenu: boolean;
};

type Undo = { type: "delete"; id: string } | { type: "restore"; session: Session };

type State = {
  settings: Settings;
  // Server view (not persisted): refreshed from syncClub each time the Mini App opens.
  cloud: { isAdmin: boolean; premiumRequested: boolean };
  menu: MenuItem[];
  sessions: Session[];
  bills: Bill[];
  walkinSeq: number;
  focusId: string | null;
  sheets: Sheet[];
  entry: { buffer: string } | null;
  undo: Undo[];
  // Keypad arrange mode (not persisted): keys wiggle and can be dragged onto each other.
  arranging: boolean;
  pressTable: (n: number) => void;
  pressWalkin: () => void;
  pressAC: () => void;
  pressUndo: () => void;
  pressBar: () => void;
  pressPause: () => void;
  pressRemove: () => void;
  pressAdd: () => void;
  pressDiscount: () => void;
  pressTransfer: () => void;
  pressVip: () => void;
  pressHisob: () => void;
  pressDigit: (d: string) => void;
  pressZeros: () => void;
  confirmEntry: () => void;
  pushSheet: (sheet: SheetInput) => void;
  popSheet: () => void;
  focusSession: (id: string) => void;
  createWalkin: () => string;
  addMenu: (menuId: string) => void;
  decMenu: (menuId: string) => void;
  setDiscount: (sessionId: string, pct: number) => void;
  transferTo: (sessionId: string, table: number) => void;
  closeBill: (sessionId: string, cash: number, card: number) => void;
  voidBill: (sessionId: string) => void;
  patchSettings: (partial: Partial<Settings>) => void;
  setTableCount: (count: number) => void;
  completeSetup: (input: SetupInput) => void;
  saveMenuItem: (item: Omit<MenuItem, "id"> & { id?: string }) => void;
  removeMenuItem: (id: string) => void;
  applyCloud: (result: SyncResult) => void;
  // Merge per-unit overrides; null (or an empty result) resets the unit to club defaults.
  setUnit: (n: number, patch: UnitConfig | null) => void;
  markPremiumRequested: () => void;
  toggleVipTable: (table: number) => void;
  setClubName: (name: string) => void;
  setKeyLayout: (order: string[]) => void;
  resetKeyLayout: () => void;
  startArranging: () => void;
  stopArranging: () => void;
};

// Toasts and bill labels follow the club's language; the store isn't a component, so it
// reads the language straight from state.
function say(key: TKey, vars?: TVars) {
  toast(translate(useClub.getState().settings.lang, key, vars));
}

function needFocus() {
  say("toast.pickFirst");
}

function labelOf(settings: Settings, place: Pick<Session, "kind" | "table" | "seq">, walkins?: number) {
  return placeLabel(settings, settings.lang, place, walkins);
}

function walkinCount(sessions: Session[]) {
  return sessions.filter((s) => s.kind === "walkin").length;
}

export const useClub = create<State>()(
  persist(
    (set, get) => {
      const focused = () => get().sessions.find((s) => s.id === get().focusId) ?? null;

      const pushUndo = (session: Session, undo: Undo[]) =>
        [...undo, { type: "restore" as const, session: structuredClone(session) }].slice(-30);

      const pushDelete = (undo: Undo[], id: string): Undo[] => {
        const next: Undo[] = [...undo, { type: "delete", id }];
        return next.slice(-30);
      };

      const replaceSession = (next: Session, snapshot: Session) => {
        const st = get();
        set({
          undo: pushUndo(snapshot, st.undo),
          sessions: st.sessions.map((s) => (s.id === next.id ? next : s)),
        });
      };

      const makeTable = (n: number): Session => {
        const { settings } = get();
        const vip = settings.vipTables.includes(n);
        return {
          id: uid(),
          kind: "table",
          table: n,
          seq: 0,
          startedAt: Date.now(),
          pausedMs: 0,
          pauseStartedAt: null,
          ratePerHour: unitRate(settings, n, vip),
          vip,
          items: [],
          discountPct: 0,
        };
      };

      const makeWalkin = (): Session => {
        const st = get();
        return {
          id: uid(),
          kind: "walkin",
          table: null,
          seq: st.walkinSeq + 1,
          startedAt: Date.now(),
          pausedMs: 0,
          pauseStartedAt: null,
          ratePerHour: st.settings.rate,
          vip: false,
          items: [],
          discountPct: 0,
        };
      };

      const openClose = () => {
        const id = get().focusId;
        if (!id) {
          needFocus();
          return;
        }
        const top = get().sheets.at(-1);
        if (top && (top.kind === "close" || top.kind === "split" || top.kind === "void")) return;
        get().pushSheet({ kind: "close", sessionId: id });
      };

      const finish = (sessionId: string, voided: boolean, cash: number, card: number) => {
        const st = get();
        const session = st.sessions.find((s) => s.id === sessionId);
        if (!session) {
          set({ sheets: st.sheets.slice(0, -1) });
          return;
        }
        const now = Date.now();
        const q = quote(session, now, st.settings.roundUp);
        const bill: Bill = {
          id: uid(),
          kind: session.kind,
          table: session.table,
          seq: session.seq,
          label: labelOf(st.settings, session, walkinCount(st.sessions)),
          startedAt: session.startedAt,
          closedAt: now,
          elapsedMs: q.elapsed,
          billedMinutes: q.minutes,
          ratePerHour: session.ratePerHour,
          vip: session.vip,
          items: session.items,
          discountPct: session.discountPct,
          timeCharge: q.time,
          barTotal: q.bar,
          discountAmt: q.discountAmt,
          total: q.total,
          cash: voided ? 0 : cash,
          card: voided ? 0 : card,
          voided,
        };
        set({
          sessions: st.sessions.filter((s) => s.id !== session.id),
          bills: [bill, ...st.bills].slice(0, 300),
          focusId: null,
          entry: null,
          undo: [],
          sheets: [{ id: uid(), kind: "receipt", billId: bill.id }],
        });
        if (voided) say("toast.voided");
        else say("toast.closed", { total: formatSom(q.total) });
      };

      return {
        settings: DEFAULT_SETTINGS,
        cloud: { isAdmin: false, premiumRequested: false },
        menu: [],
        sessions: [],
        bills: [],
        walkinSeq: 0,
        focusId: null,
        sheets: [],
        entry: null,
        undo: [],
        arranging: false,

        pressTable: (n) => {
          const st = get();
          if (st.entry) {
            get().pressDigit(String(n));
            return;
          }
          const existing = st.sessions.find((s) => s.kind === "table" && s.table === n);
          // A table already running stays reachable even if Premium lapsed, so its bill can close.
          if (!existing && n > activeTables(st.settings)) {
            if (!st.settings.premium && n > FREE_TABLE_LIMIT) get().pushSheet({ kind: "premium" });
            return;
          }
          if (!existing) {
            const session = makeTable(n);
            set({
              sessions: [...st.sessions, session],
              focusId: session.id,
              undo: pushDelete(st.undo, session.id),
            });
            return;
          }
          set({ focusId: existing.id });
          openClose();
        },

        pressWalkin: () => {
          const st = get();
          if (st.entry) {
            get().pressDigit("0");
            return;
          }
          const open = st.sessions.filter((s) => s.kind === "walkin");
          if (open.length >= 2) {
            get().pushSheet({ kind: "walkins" });
            return;
          }
          if (open.length === 1) {
            set({ focusId: open[0].id });
            openClose();
            return;
          }
          const session = makeWalkin();
          set({
            sessions: [...st.sessions, session],
            walkinSeq: session.seq,
            focusId: session.id,
            undo: pushDelete(st.undo, session.id),
          });
        },

        pressAC: () => {
          const st = get();
          if (st.entry) {
            set({ entry: null });
            return;
          }
          if (st.sheets.length) {
            set({ sheets: st.sheets.slice(0, -1) });
            return;
          }
          set({ focusId: null });
        },

        pressUndo: () => {
          const st = get();
          if (st.entry) {
            const buffer = st.entry.buffer;
            set({ entry: { buffer: buffer.length <= 1 ? "0" : buffer.slice(0, -1) } });
            return;
          }
          const last = st.undo[st.undo.length - 1];
          if (!last) {
            say("toast.nothingToUndo");
            return;
          }
          const undo = st.undo.slice(0, -1);
          if (last.type === "delete") {
            const victim = st.sessions.find((s) => s.id === last.id);
            set({
              undo,
              sessions: st.sessions.filter((s) => s.id !== last.id),
              focusId: st.focusId === last.id ? null : st.focusId,
              walkinSeq:
                victim?.kind === "walkin" && victim.seq === st.walkinSeq
                  ? Math.max(0, st.walkinSeq - 1)
                  : st.walkinSeq,
            });
            return;
          }
          const exists = st.sessions.some((s) => s.id === last.session.id);
          set({
            undo,
            focusId: last.session.id,
            sessions: exists
              ? st.sessions.map((s) => (s.id === last.session.id ? last.session : s))
              : [...st.sessions, last.session],
          });
        },

        pressBar: () => {
          const st = get();
          const top = st.sheets.at(-1);
          if (top?.kind === "bar") {
            set({ sheets: st.sheets.slice(0, -1) });
            return;
          }
          const focusId =
            st.focusId ?? (st.sessions.length ? st.sessions[st.sessions.length - 1].id : null);
          set({
            focusId,
            entry: null,
            sheets: [...st.sheets, { id: uid(), kind: "bar" }],
          });
        },

        pressPause: () => {
          const session = focused();
          if (!session) {
            needFocus();
            return;
          }
          if (session.kind === "walkin") {
            say("toast.walkinNoTime");
            return;
          }
          const now = Date.now();
          const next: Session = session.pauseStartedAt
            ? {
                ...session,
                pausedMs: session.pausedMs + (now - session.pauseStartedAt),
                pauseStartedAt: null,
              }
            : { ...session, pauseStartedAt: now };
          replaceSession(next, session);
        },

        pressRemove: () => {
          const session = focused();
          if (!session) {
            needFocus();
            return;
          }
          if (session.items.length === 0) {
            say("toast.nothingToRemove");
            return;
          }
          const items = session.items.map((item) => ({ ...item }));
          const last = items[items.length - 1];
          if (last.qty > 1) last.qty -= 1;
          else items.pop();
          replaceSession({ ...session, items }, session);
        },

        pressAdd: () => {
          if (get().entry) {
            get().confirmEntry();
            return;
          }
          if (!focused()) {
            needFocus();
            return;
          }
          set({ entry: { buffer: "0" } });
        },

        pressDiscount: () => {
          if (get().entry) return;
          const session = focused();
          if (!session) {
            needFocus();
            return;
          }
          get().pushSheet({ kind: "discount", sessionId: session.id });
        },

        pressTransfer: () => {
          if (get().entry) return;
          const session = focused();
          if (!session) {
            needFocus();
            return;
          }
          get().pushSheet({ kind: "transfer", sessionId: session.id });
        },

        pressVip: () => {
          if (get().entry) {
            get().pressZeros();
            return;
          }
          const session = focused();
          if (!session) {
            needFocus();
            return;
          }
          if (session.kind === "walkin") {
            say("toast.walkinNoVip");
            return;
          }
          const { settings } = get();
          const vip = !session.vip;
          replaceSession(
            {
              ...session,
              vip,
              // A walk-in has no unit: it uses the club rates.
              ratePerHour:
                session.kind === "table" && session.table !== null
                  ? unitRate(settings, session.table, vip)
                  : vip
                    ? settings.vipRate
                    : settings.rate,
            },
            session,
          );
        },

        pressHisob: () => {
          if (get().entry) {
            get().confirmEntry();
            return;
          }
          openClose();
        },

        pressDigit: (d) => {
          const entry = get().entry;
          if (!entry) return;
          const next = entry.buffer === "0" ? d : entry.buffer + d;
          if (next.length > 7) return;
          set({ entry: { buffer: next } });
        },

        pressZeros: () => {
          const entry = get().entry;
          if (!entry || entry.buffer === "0") return;
          const next = entry.buffer + "000";
          if (next.length > 7) return;
          set({ entry: { buffer: next } });
        },

        confirmEntry: () => {
          const st = get();
          const session = focused();
          const amount = Number(st.entry?.buffer ?? "0");
          if (!session || !st.entry) return;
          if (!Number.isFinite(amount) || amount <= 0) {
            say("toast.enterAmount");
            return;
          }
          const line: LineItem = {
            id: uid(),
            menuId: "custom",
            name: translate(st.settings.lang, "item.extra"),
            price: Math.round(amount),
            qty: 1,
          };
          set({
            entry: null,
            undo: pushUndo(session, st.undo),
            sessions: st.sessions.map((s) =>
              s.id === session.id ? { ...s, items: [...s.items, line] } : s,
            ),
          });
        },

        pushSheet: (sheet) => {
          set((st) => ({
            entry: null,
            sheets: [...st.sheets, { ...sheet, id: uid() } as Sheet],
          }));
        },

        popSheet: () => set((st) => ({ sheets: st.sheets.slice(0, -1) })),

        focusSession: (id) => {
          if (!get().sessions.some((s) => s.id === id)) return;
          set({ focusId: id });
        },

        createWalkin: () => {
          const st = get();
          const session = makeWalkin();
          set({
            sessions: [...st.sessions, session],
            walkinSeq: session.seq,
            focusId: session.id,
            undo: pushDelete(st.undo, session.id),
          });
          return session.id;
        },

        addMenu: (menuId) => {
          const st = get();
          const session = focused();
          const menu = st.menu.find((item) => item.id === menuId);
          if (!session || !menu) {
            needFocus();
            return;
          }
          const items = session.items.some((item) => item.menuId === menuId)
            ? session.items.map((item) =>
                item.menuId === menuId ? { ...item, qty: item.qty + 1 } : item,
              )
            : [
                ...session.items,
                { id: uid(), menuId, name: menu.name, price: menu.price, qty: 1 },
              ];
          replaceSession({ ...session, items }, session);
        },

        decMenu: (menuId) => {
          const session = focused();
          if (!session) return;
          const line = session.items.find((item) => item.menuId === menuId);
          if (!line) return;
          const items =
            line.qty <= 1
              ? session.items.filter((item) => item.menuId !== menuId)
              : session.items.map((item) =>
                  item.menuId === menuId ? { ...item, qty: item.qty - 1 } : item,
                );
          replaceSession({ ...session, items }, session);
        },

        setDiscount: (sessionId, pct) => {
          const st = get();
          const session = st.sessions.find((s) => s.id === sessionId);
          if (!session) return;
          const discountPct = Math.max(0, Math.min(100, Math.round(pct)));
          set({
            undo: pushUndo(session, st.undo),
            sessions: st.sessions.map((s) => (s.id === session.id ? { ...s, discountPct } : s)),
            sheets: st.sheets.slice(0, -1),
          });
        },

        transferTo: (sessionId, table) => {
          const st = get();
          const session = st.sessions.find((s) => s.id === sessionId);
          if (!session) return;
          if (session.kind === "table" && session.table === table) return;
          if (st.sessions.some((s) => s.kind === "table" && s.table === table)) {
            say("toast.busy", { place: labelOf(st.settings, { kind: "table", table, seq: 0 }) });
            return;
          }
          const vip = st.settings.vipTables.includes(table);
          const next: Session =
            session.kind === "walkin"
              ? {
                  ...session,
                  kind: "table",
                  table,
                  startedAt: Date.now(),
                  pausedMs: 0,
                  pauseStartedAt: null,
                  vip,
                  ratePerHour: unitRate(st.settings, table, vip),
                }
              : { ...session, table };
          set({
            undo: pushUndo(session, st.undo),
            sessions: st.sessions.map((s) => (s.id === session.id ? next : s)),
            focusId: session.id,
            sheets: st.sheets.slice(0, -1),
          });
          const place = labelOf(st.settings, { kind: "table", table, seq: 0 });
          say(session.kind === "walkin" ? "toast.movedStart" : "toast.moved", { place });
        },

        closeBill: (sessionId, cash, card) => finish(sessionId, false, cash, card),
        voidBill: (sessionId) => finish(sessionId, true, 0, 0),

        patchSettings: (partial) =>
          set((st) => ({ settings: { ...st.settings, ...partial } })),

        setTableCount: (count) => {
          const st = get();
          const next = Math.max(1, Math.min(MAX_TABLES, Math.round(count)));
          if (next > tableLimit(st.settings)) {
            get().pushSheet({ kind: "premium" });
            return;
          }
          const blocking = st.sessions.some(
            (s) => s.kind === "table" && s.table !== null && s.table > next,
          );
          if (blocking) {
            say("toast.closeHigherFirst");
            return;
          }
          set({
            settings: {
              ...st.settings,
              tableCount: next,
              vipTables: st.settings.vipTables.filter((n) => n <= next),
            },
          });
        },

        completeSetup: ({ clubName, tableCount, rate, vipRate, sampleMenu }) =>
          set((st) => ({
            settings: {
              ...st.settings,
              clubName: clubName.trim() || DEFAULT_SETTINGS.clubName,
              tableCount: Math.max(1, Math.min(tableLimit(st.settings), Math.round(tableCount))),
              rate: Math.max(0, Math.round(rate)),
              vipRate: Math.max(0, Math.round(vipRate)),
              setupDone: true,
            },
            menu: sampleMenu ? SAMPLE_MENU.map((item) => ({ ...item, id: uid() })) : st.menu,
          })),

        saveMenuItem: ({ id, name, price, category }) =>
          set((st) => {
            const clean = { name: name.trim(), price: Math.max(0, Math.round(price)), category };
            if (!clean.name) return {};
            return {
              menu: id
                ? st.menu.map((item) => (item.id === id ? { ...item, ...clean } : item))
                : [...st.menu, { id: uid(), ...clean }],
            };
          }),

        removeMenuItem: (id) => set((st) => ({ menu: st.menu.filter((item) => item.id !== id) })),

        // The server decides Premium; the local flag only mirrors it for offline use.
        applyCloud: ({ premium, premiumRequested, isAdmin }) =>
          set((st) => ({
            settings: { ...st.settings, premium },
            cloud: { isAdmin, premiumRequested },
          })),

        setUnit: (n, patch) =>
          set((st) => {
            const units = { ...st.settings.units };
            const next = patch ? { ...units[String(n)], ...patch } : {};
            for (const key of Object.keys(next) as (keyof UnitConfig)[]) {
              if (next[key] === undefined || next[key] === "") delete next[key];
            }
            if (Object.keys(next).length) units[String(n)] = next;
            else delete units[String(n)];
            return { settings: { ...st.settings, units } };
          }),

        markPremiumRequested: () =>
          set((st) => ({ cloud: { ...st.cloud, premiumRequested: true } })),

        toggleVipTable: (table) =>
          set((st) => {
            const has = st.settings.vipTables.includes(table);
            return {
              settings: {
                ...st.settings,
                vipTables: has
                  ? st.settings.vipTables.filter((n) => n !== table)
                  : [...st.settings.vipTables, table].sort((a, b) => a - b),
              },
            };
          }),

        setClubName: (name) =>
          set((st) => ({
            settings: { ...st.settings, clubName: name.trim() || translate(st.settings.lang, "onb.namePh") },
          })),

        setKeyLayout: (order) => set((st) => ({ settings: { ...st.settings, keyLayout: [...order] } })),

        resetKeyLayout: () =>
          set((st) => ({ settings: { ...st.settings, keyLayout: [...DEFAULT_SETTINGS.keyLayout] } })),

        // Not while an amount is being typed: the keys are digits then.
        startArranging: () => {
          if (get().entry) return;
          set({ arranging: true, sheets: [] });
        },

        stopArranging: () => set({ arranging: false }),
      };
    },
    {
      name: "stol-club-v1",
      version: 2,
      // v1 had no setup step and a fixed 9-table keypad: those clubs are already set up.
      migrate: (persisted, version) => {
        const saved = (persisted ?? {}) as Partial<State>;
        if (version < 2 && saved.settings) {
          saved.settings = { ...saved.settings, setupDone: true };
        }
        return saved as State;
      },
      partialize: (state) => ({
        settings: state.settings,
        menu: state.menu,
        sessions: state.sessions,
        bills: state.bills,
        walkinSeq: state.walkinSeq,
        focusId: state.focusId,
      }),
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<State>;
        return { ...current, ...saved, settings: { ...current.settings, ...saved.settings } };
      },
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (state.focusId && !state.sessions.some((s) => s.id === state.focusId)) {
          state.focusId = null;
        }
      },
    },
  ),
);
