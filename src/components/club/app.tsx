import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Delete, History, Lock, SlidersHorizontal } from "lucide-react";
import { Toaster } from "sonner";
import { ArrangeBar, useArrange, type ArrangeBind } from "@/components/club/arrange";
import { KeyMenu, rectOf, useLongPress, type KeyMenuTarget } from "@/components/club/key-menu";
import { NowProvider, useNow } from "@/components/club/now";
import { Onboarding } from "@/components/club/onboarding";
import { Tour } from "@/components/club/tour";
import { SheetHost } from "@/components/club/sheets";
import { useResolvedTheme } from "@/components/club/theme";
import { cn } from "@/lib/cn";
import { callCloud, cloudAvailable, type SyncResult } from "@/lib/club/cloud";
import {
  FREE_GRID,
  FREE_TABLE_LIMIT,
  activeTables,
  displayBucket,
  elapsedMs,
  formatClock,
  formatSom,
  quote,
} from "@/lib/club/logic";
import { useClub } from "@/lib/club/store";
import { usePlaceLabel, useT } from "@/lib/i18n/use-t";

// Inside Telegram, report the club to the server and take back Premium / admin access.
// Runs on open, when the club's name or size changes, and when the app comes back to front
// (so Premium switched on from the admin panel shows up without a restart).
function useCloudSync() {
  const setupDone = useClub((s) => s.settings.setupDone);
  const clubName = useClub((s) => s.settings.clubName);
  const tableCount = useClub((s) => s.settings.tableCount);

  useEffect(() => {
    if (!setupDone || !cloudAvailable()) return;
    const sync = () =>
      callCloud<SyncResult>("syncClub", { clubName, tableCount })
        .then((result) => useClub.getState().applyCloud(result))
        .catch(() => {});
    const timer = setTimeout(sync, 300);
    const onVisible = () => document.visibilityState === "visible" && sync();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [setupDone, clubName, tableCount]);
}

export function ClubApp() {
  const theme = useResolvedTheme();
  const setupDone = useClub((s) => s.settings.setupDone);
  useCloudSync();
  return (
    <NowProvider>
      {setupDone ? (
        <>
          <ClubScreen />
          <SheetHost />
          <Tour />
        </>
      ) : (
        <Onboarding />
      )}
      <Toaster
        theme={theme}
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--color-sheet)",
            color: "var(--color-fg)",
            border: "1px solid var(--color-line)",
          },
        }}
      />
    </NowProvider>
  );
}

function ClubScreen() {
  const now = useNow();
  const sessions = useClub((s) => s.sessions);
  const focusId = useClub((s) => s.focusId);
  const entry = useClub((s) => s.entry);
  const settings = useClub((s) => s.settings);
  const sheetsOpen = useClub((s) => s.sheets.length > 0);
  const t = useT();
  const placeName = usePlaceLabel();
  const arrange = useArrange();
  const arranging = arrange.arranging;
  const [menu, setMenu] = useState<KeyMenuTarget | null>(null);
  const closeMenu = useCallback(() => setMenu(null), []);
  const openUnitMenu = useCallback(
    (n: number, locked: boolean, el: HTMLElement) => setMenu({ kind: "unit", n, locked, rect: rectOf(el) }),
    [],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const api = useClub.getState();
      if (api.arranging) {
        if (event.key === "Escape" || event.key === "Enter") {
          event.preventDefault();
          api.stopArranging();
        }
        return;
      }
      if (api.sheets.length && event.key !== "Escape") return;
      if (event.key >= "1" && event.key <= "9") {
        event.preventDefault();
        api.pressTable(Number(event.key));
      } else if (event.key === "0") {
        event.preventDefault();
        api.pressWalkin();
      } else if (event.key === "Escape") {
        api.pressAC();
      } else if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        api.pressHisob();
      } else if (event.key === "Backspace") {
        event.preventDefault();
        api.pressUndo();
      } else if (event.key === "+") {
        api.pressAdd();
      } else if (event.key === "%") {
        api.pressDiscount();
      } else if (event.key === "-" || event.key === "_") {
        api.pressRemove();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const focused = sessions.find((s) => s.id === focusId) ?? null;
  const walkins = sessions.filter((s) => s.kind === "walkin").length;
  const typing = entry !== null;

  // The key menu and arrange mode only live on the plain keypad (no sheet, no amount typing).
  useEffect(() => {
    if (typing || sheetsOpen || arranging) setMenu(null);
  }, [typing, sheetsOpen, arranging]);

  useEffect(() => {
    if (typing && arranging) useClub.getState().stopArranging();
  }, [typing, arranging]);
  const openTotal = sessions.reduce(
    (sum, session) => sum + quote(session, now, settings.roundUp).total,
    0,
  );

  // Only data on the display — how the keys work is taught once, in onboarding.
  let label = t("display.open");
  let amount = formatSom(openTotal);
  let hint = sessions.length > 0 ? t("display.openCount", { n: sessions.length }) : "";

  if (typing && focused) {
    label = `${t("display.extra")} · ${placeName(focused, walkins).toUpperCase()}`;
    amount = formatSom(Number(entry.buffer));
    hint = "";
  } else if (focused) {
    const q = quote(focused, now, settings.roundUp);
    label = placeName(focused, walkins).toUpperCase();
    if (focused.vip) label += " · VIP";
    if (focused.pauseStartedAt) label += ` · ${t("key.pause")}`;
    amount = formatSom(q.total);
    if (focused.kind === "walkin") {
      hint = `${t("display.bar")} ${formatSom(q.bar)}`;
    } else {
      hint = `${formatClock(q.elapsed)} · ${t("display.time")} ${formatSom(q.time)} · ${t("display.bar")} ${formatSom(q.bar)}`;
    }
    if (focused.discountPct) hint += ` · −${focused.discountPct}%`;
  }
  if (arranging) hint = t("arrange.hint");

  const barQty = focused?.items.reduce((sum, item) => sum + item.qty, 0) ?? 0;
  const paused = Boolean(focused?.pauseStartedAt);

  // Grid slot of a non-unit key: CSS order follows the saved layout, so the keys keep their
  // place in the markup and the unit block (UNIT_BLOCK_ORDER) stays between slots 3 and 4.
  const slot = (id: string): KeySlot => {
    const index = arrange.order.indexOf(id);
    return {
      order: index < 4 ? index * 2 : index * 2 + 2,
      bind: arrange.bind(id, index),
      lifted: menu?.kind === "key" && menu.id === id,
      onLongPress: typing || arranging ? undefined : (el) => setMenu({ kind: "key", id, rect: rectOf(el) }),
    };
  };

  const onDisplay = () => {
    const api = useClub.getState();
    if (api.arranging) {
      api.stopArranging();
      return;
    }
    if (api.entry) return;
    if (api.focusId) api.pressHisob();
    else api.pushSheet({ kind: "history" });
  };

  return (
    <main className="mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-bg text-fg">
      <header
        className={cn("flex items-center justify-between px-4 pt-3", arranging && "invisible")}
        data-tour="header"
      >
        <button
          type="button"
          className="key flex size-12 items-center justify-center rounded-full bg-key text-fg"
          aria-label={t("aria.history")}
          onClick={() => useClub.getState().pushSheet({ kind: "history" })}
        >
          <History className="size-5" strokeWidth={1.75} />
        </button>
        <p className="max-w-40 truncate text-center text-sm text-muted">{settings.clubName}</p>
        <button
          type="button"
          className="key flex size-12 items-center justify-center rounded-full bg-key text-fg"
          aria-label={t("aria.settings")}
          onClick={() => useClub.getState().pushSheet({ kind: "settings" })}
        >
          <SlidersHorizontal className="size-5" strokeWidth={1.75} />
        </button>
      </header>

      <button
        type="button"
        aria-label={t(typing ? "aria.amount" : focused ? "aria.current" : "aria.openTotal")}
        onClick={onDisplay}
        className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-5 pb-4 text-right"
      >
        <span className="mb-2 flex items-baseline justify-between gap-3">
          <span className="text-sm font-medium tracking-widest text-muted">{label}</span>
          <span className="text-sm text-muted">{t("display.currency")}</span>
        </span>
        <span className="display-num text-fg" data-len={displayBucket(amount)}>
          {amount}
        </span>
        <span className="mt-3 block min-h-5 text-sm text-muted">{hint}</span>
      </button>

      <section className="pad-safe grid grid-cols-4 gap-3 px-3" aria-label={t("aria.keypad")}>
        <Key slot={slot("undo")} kind="symbol" tone="fn" tour="clear" ariaLabel={t("aria.undo")} onClick={() => useClub.getState().pressUndo()}>
          <Delete className="size-6" strokeWidth={1.75} />
        </Key>
        <Key slot={slot("ac")} kind="symbol" tone="fn" tour="clear" label="AC" ariaLabel={t("aria.clear")} onClick={() => useClub.getState().pressAC()} />
        <Key
          slot={slot("discount")}
          kind={focused && focused.discountPct && !typing ? "word" : "symbol"}
          tone="fn"
          active={Boolean(focused && focused.discountPct > 0 && !typing)}
          disabled={typing}
          label={focused && focused.discountPct && !typing ? `${focused.discountPct}%` : "%"}
          tour="discount"
          ariaLabel={t("aria.discount")}
          onClick={() => useClub.getState().pressDiscount()}
        />
        <Key
          slot={slot("bar")}
          kind="word"
          tone="op"
          label={t("key.bar")}
          badge={typing ? 0 : barQty}
          disabled={typing}
          tour="bar"
          ariaLabel={t("aria.bar")}
          onClick={() => useClub.getState().pressBar()}
        />

        <div
          className={cn("relative col-span-3 row-span-3 transition-opacity", arranging && "pointer-events-none opacity-35")}
          style={{ order: UNIT_BLOCK_ORDER }}
        >
          {typing ? (
            <DigitBlock />
          ) : (
            <TableGrid now={now} menuUnit={menu?.kind === "unit" ? menu.n : null} onMenu={arranging ? undefined : openUnitMenu} />
          )}
        </div>
        <Key
          slot={slot("pause")}
          kind="word"
          tone="op"
          active={paused && !typing}
          disabled={typing}
          label={t(paused && !typing ? "key.resume" : "key.pause")}
          tour="pause"
          ariaLabel={t(paused ? "aria.resume" : "aria.pause")}
          onClick={() => useClub.getState().pressPause()}
        />
        <Key
          slot={slot("remove")}
          kind="word"
          tone="op"
          label={t("key.remove")}
          disabled={typing}
          tour="addsub"
          ariaLabel={t("aria.remove")}
          onClick={() => useClub.getState().pressRemove()}
        />
        <Key
          slot={slot("add")}
          kind="word"
          tone="op"
          active={typing}
          label={t("key.add")}
          tour="addsub"
          ariaLabel={t("aria.add")}
          onClick={() => useClub.getState().pressAdd()}
        />

        <Key
          slot={slot("transfer")}
          kind="word"
          tone="fn"
          label={t("key.move")}
          disabled={typing}
          tour="bottom"
          ariaLabel={t("aria.move")}
          onClick={() => useClub.getState().pressTransfer()}
        />
        <Key
          slot={slot("walkin")}
          kind="digit"
          tone="num"
          label="0"
          sub={typing ? undefined : t("key.walkinSub")}
          active={!typing && focused?.kind === "walkin"}
          live={!typing && walkins > 0 && focused?.kind !== "walkin"}
          tour="bottom"
          ariaLabel={t("aria.walkin")}
          onClick={() => useClub.getState().pressWalkin()}
        />
        <Key
          slot={slot("vip")}
          kind={typing ? "symbol" : "word"}
          tone="fn"
          active={!typing && Boolean(focused?.vip)}
          label={typing ? "000" : "VIP"}
          tour="bottom"
          ariaLabel={t(typing ? "aria.thousand" : "aria.vip")}
          onClick={() => useClub.getState().pressVip()}
        />
        <Key slot={slot("hisob")} kind="word" tone="op" tour="hisob" label={t("key.bill")} ariaLabel={t("aria.bill")} onClick={() => useClub.getState().pressHisob()} />
      </section>
      {menu ? (
        <KeyMenu
          target={menu}
          onClose={closeMenu}
          onArrange={() => {
            setMenu(null);
            useClub.getState().startArranging();
          }}
        />
      ) : null}
      {arranging ? <ArrangeBar onReset={arrange.reset} canReset={!arrange.isDefault} /> : null}
    </main>
  );
}

const DIGIT_ROWS = [7, 8, 9, 4, 5, 6, 1, 2, 3];

function DigitBlock() {
  return (
    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-3">
      {DIGIT_ROWS.map((n) => (
        <Key
          key={n}
          kind="digit"
          tone="num"
          label={String(n)}
          ariaLabel={String(n)}
          onClick={() => useClub.getState().pressDigit(String(n))}
        />
      ))}
    </div>
  );
}

// Up to 9 tables keep full-size keys; bigger clubs get 4–5 columns and the block scrolls.
function gridColumns(count: number) {
  if (count <= 9) return 3;
  if (count <= 16) return 4;
  return 5;
}

type UnitMenuOpener = (n: number, locked: boolean, el: HTMLElement) => void;

function TableGrid({
  now,
  menuUnit,
  onMenu,
}: {
  now: number;
  menuUnit: number | null;
  onMenu?: UnitMenuOpener;
}) {
  const premium = useClub((s) => s.settings.premium);
  const tableCount = useClub((s) => s.settings.tableCount);
  // Free clubs see the whole 3×3 block, Premium clubs exactly their tables.
  const shown = premium ? tableCount : Math.max(tableCount, FREE_GRID);
  const usable = useClub((s) => activeTables(s.settings));
  const cols = gridColumns(shown);
  const compact = cols > 3;
  return (
    <div className="absolute inset-0" data-tour="tables">
      {/* 4px of bleed so a key lifted by the key menu isn't clipped by the scroll box. */}
      <div className="no-scrollbar absolute -inset-1 overflow-y-auto p-1">
        <div
          className={cn("grid", compact ? "gap-2" : "gap-3")}
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: shown }, (_, i) => (
            <TableKey
              key={i + 1}
              n={i + 1}
              now={now}
              compact={compact}
              locked={!premium && i + 1 > FREE_TABLE_LIMIT}
              off={i + 1 > usable}
              lifted={menuUnit === i + 1}
              onMenu={onMenu}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TableKey({
  n,
  now,
  compact,
  locked,
  off,
  lifted,
  onMenu,
}: {
  n: number;
  now: number;
  compact: boolean;
  locked: boolean;
  off: boolean;
  lifted: boolean;
  onMenu?: UnitMenuOpener;
}) {
  const session = useClub((s) => s.sessions.find((x) => x.kind === "table" && x.table === n));
  const t = useT();
  const place = usePlaceLabel()({ kind: "table", table: n, seq: 0 });
  const lockedPress = useLongPress(onMenu && locked && off && !session ? (el) => onMenu(n, true, el) : undefined);
  const focusId = useClub((s) => s.focusId);
  const focused = Boolean(session) && session?.id === focusId;
  const paused = Boolean(session?.pauseStartedAt);
  const sub = session ? (paused ? t("key.paused") : formatClock(elapsedMs(session, now))) : undefined;

  if (off && !session) {
    // Locked keys stay tappable (they open Premium); a free club's unused 1–3 keys are just off.
    return (
      <button
        type="button"
        aria-label={t(locked ? "aria.unitLocked" : "aria.unitOff", { place })}
        disabled={!locked}
        data-tour={n === FREE_TABLE_LIMIT + 1 ? "locked" : undefined}
        {...lockedPress.handlers}
        onClick={() => {
          if (lockedPress.consume()) return;
          useClub.getState().pressTable(n);
        }}
        style={keyStyle(lifted)}
        className="key relative flex aspect-square items-center justify-center rounded-full bg-key/40 text-fg/35"
      >
        <span className={cn(labelClass("digit", false, compact), "leading-none")}>{n}</span>
        {locked ? (
          <span className="absolute right-[12%] top-[12%] flex size-5 items-center justify-center rounded-full bg-fg text-bg">
            <Lock className="size-3" strokeWidth={2.5} />
          </span>
        ) : null}
      </button>
    );
  }

  return (
    <Key
      kind="digit"
      tone="num"
      label={String(n)}
      sub={sub}
      compact={compact}
      active={focused}
      live={Boolean(session) && !focused && !paused}
      paused={paused && !focused}
      ariaLabel={place}
      slot={{ lifted, onLongPress: onMenu ? (el) => onMenu(n, locked, el) : undefined }}
      onClick={() => useClub.getState().pressTable(n)}
    />
  );
}

// Where a key sits and how it behaves beyond a tap: grid order (non-unit keys), the key-menu
// lift, long-press, and arrange-mode drag handlers.
type KeySlot = {
  order?: number;
  bind?: ArrangeBind;
  lifted?: boolean;
  onLongPress?: (el: HTMLElement) => void;
};

// Grid order of the unit block: between non-unit slots 3 (order 6) and 4 (order 10).
const UNIT_BLOCK_ORDER = 7;

// A key held for its menu floats above the dimmed screen.
function keyStyle(lifted: boolean | undefined, order?: number): CSSProperties {
  const style: CSSProperties = { WebkitTouchCallout: "none", order };
  if (!lifted) return style;
  return { ...style, scale: "1.08", zIndex: 60, ["--key-shadow" as string]: "0 14px 36px rgb(0 0 0 / 0.45)" };
}

function toneClass(tone: "num" | "fn" | "op", active: boolean) {
  if (active) return "bg-fg text-bg";
  if (tone === "op") return "bg-op text-on-op";
  if (tone === "fn") return "bg-fn text-fg";
  return "bg-key text-fg";
}

function labelClass(kind: "digit" | "word" | "symbol", hasSub: boolean, compact: boolean) {
  if (kind === "digit" && compact) return hasSub ? "text-xl font-normal" : "text-2xl font-normal";
  if (kind === "digit") return hasSub ? "text-3xl font-normal" : "text-4xl font-normal";
  if (kind === "symbol") return "text-3xl font-normal";
  return "text-sm font-semibold tracking-wide";
}

function Key({
  label,
  sub,
  tone,
  kind,
  active,
  disabled,
  live,
  paused,
  badge,
  compact = false,
  tour,
  ariaLabel,
  slot,
  onClick,
  children,
}: {
  label?: string;
  sub?: string;
  tone: "num" | "fn" | "op";
  kind: "digit" | "word" | "symbol";
  active?: boolean;
  disabled?: boolean;
  live?: boolean;
  paused?: boolean;
  badge?: number;
  compact?: boolean;
  tour?: string;
  ariaLabel: string;
  slot?: KeySlot;
  onClick: () => void;
  children?: ReactNode;
}) {
  const press = useLongPress(slot?.onLongPress);
  const { className: arrangeClass, style: arrangeStyle, ...arrangeProps }: Partial<ArrangeBind> = slot?.bind ?? {};
  // While arranging, a key only drags: its tap does nothing.
  const arranging = Boolean(arrangeProps.onPointerDown);
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      data-tour={tour}
      {...(arranging ? null : press.handlers)}
      {...arrangeProps}
      onClick={() => {
        if (press.consume() || arranging) return;
        if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(8);
        onClick();
      }}
      style={{ ...keyStyle(slot?.lifted, slot?.order), ...arrangeStyle }}
      className={cn(
        "key relative flex aspect-square items-center justify-center rounded-full",
        toneClass(tone, Boolean(active)),
        live && "key-live",
        paused && "key-paused",
        arrangeClass,
      )}
    >
      {badge ? (
        <span className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-fg text-xs font-semibold text-bg">
          {badge > 9 ? "9+" : badge}
        </span>
      ) : null}
      {children ?? (
        <span className="flex flex-col items-center px-1">
          <span className={cn(labelClass(kind, Boolean(sub), compact), "leading-none")}>{label}</span>
          {sub ? (
            <span
              className={cn(
                "mt-1 font-medium leading-none tabular-nums",
                compact ? "text-[10px]" : "text-xs",
                active ? "text-bg/70" : live ? "text-live" : paused ? "text-op-ink" : "text-muted",
              )}
            >
              {sub}
            </span>
          ) : null}
        </span>
      )}
    </button>
  );
}
