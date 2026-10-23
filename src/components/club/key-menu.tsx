import { useCallback, useEffect, useLayoutEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import {
  ArrowRightLeft,
  Crown,
  GlassWater,
  LayoutGrid,
  Lock,
  Pause,
  Percent,
  Play,
  Receipt,
  Settings2,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { useNow } from "@/components/club/now";
import { cn } from "@/lib/cn";
import { formatClock, formatSom, quote, unitConfig, unitKind, unitRate, type Settings } from "@/lib/club/logic";
import { useClub } from "@/lib/club/store";
import { useT } from "@/lib/i18n/use-t";

// Long-press context menu for keypad keys (iOS style): the held key lifts, the rest of the
// screen dims, and a compact menu floats next to the key.

export type KeyMenuRect = { left: number; top: number; width: number; height: number };

export type KeyMenuTarget =
  | { kind: "unit"; n: number; locked: boolean; rect: KeyMenuRect }
  | { kind: "key"; id: string; rect: KeyMenuRect };

const HOLD_MS = 450;
const SLOP_PX = 10;

// Press-and-hold (and right-click) detection for a key. Spread `handlers` on the button and
// call `consume()` first thing in its onClick: it is true for the click that ends a long press.
export function useLongPress(onLongPress?: (el: HTMLElement) => void) {
  const timer = useRef<number | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const fired = useRef(false);
  const callback = useRef(onLongPress);

  useEffect(() => {
    callback.current = onLongPress;
  });

  const cancel = useCallback(() => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
    start.current = null;
  }, []);

  useEffect(() => cancel, [cancel]);

  const open = (el: HTMLElement) => {
    cancel();
    if (!callback.current) return;
    fired.current = true;
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
    callback.current(el);
  };

  const handlers = onLongPress
    ? {
        onPointerDown: (event: ReactPointerEvent<HTMLElement>) => {
          fired.current = false;
          cancel();
          if (event.pointerType === "mouse" && event.button !== 0) return;
          const el = event.currentTarget;
          start.current = { x: event.clientX, y: event.clientY };
          timer.current = window.setTimeout(() => open(el), HOLD_MS);
        },
        onPointerMove: (event: ReactPointerEvent<HTMLElement>) => {
          const from = start.current;
          if (from && Math.hypot(event.clientX - from.x, event.clientY - from.y) > SLOP_PX) cancel();
        },
        onPointerUp: cancel,
        onPointerCancel: cancel,
        onPointerLeave: cancel,
        onContextMenu: (event: React.MouseEvent<HTMLElement>) => {
          event.preventDefault();
          if (!fired.current) open(event.currentTarget);
        },
      }
    : {};

  const consume = () => {
    if (!fired.current) return false;
    fired.current = false;
    return true;
  };

  return { handlers, consume };
}

export function rectOf(el: HTMLElement): KeyMenuRect {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

const EDGE = 12;
const GAP = 12;

export function KeyMenu({
  target,
  onClose,
  onArrange,
}: {
  target: KeyMenuTarget;
  onClose: () => void;
  onArrange: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Escape closes; while open, keypad shortcuts are off (capture runs before the keypad's listener).
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Tab") return;
      event.stopImmediatePropagation();
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("resize", onClose);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("resize", onClose);
    };
  }, [onClose]);

  // Next to the key: aligned to its outer edge, below it when there is room, else above.
  useLayoutEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const r = target.rect;
    const lift = r.height * 0.04;
    const alignRight = r.left + r.width / 2 > vw / 2;
    const left = Math.min(Math.max(alignRight ? r.left + r.width - w : r.left, EDGE), vw - w - EDGE);
    const below = r.top + r.height + lift + GAP;
    const above = r.top - lift - GAP - h;
    let top: number;
    let fromTop = true;
    if (below + h <= vh - EDGE) top = below;
    else if (above >= EDGE) {
      top = above;
      fromTop = false;
    } else top = Math.min(Math.max(below, EDGE), vh - h - EDGE);
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
    el.style.transformOrigin = `${alignRight ? "right" : "left"} ${fromTop ? "top" : "bottom"}`;
    el.dataset.ready = "true";
    el.focus({ preventScroll: true });
  }, [target]);

  return createPortal(
    <>
      <style href="orde-key-menu" precedence="default">
        {KEY_MENU_CSS}
      </style>
      <div className="key-menu-dim fixed inset-0 z-50" aria-hidden="true" onClick={onClose} />
      <div
        ref={menuRef}
        role="menu"
        tabIndex={-1}
        className="key-menu no-scrollbar fixed z-[70] max-h-[calc(100dvh-24px)] w-64 overflow-y-auto rounded-3xl border border-line bg-sheet text-fg shadow-2xl outline-none"
        style={{ left: 0, top: 0 }}
      >
        {target.kind === "unit" ? (
          <UnitMenu n={target.n} locked={target.locked} onClose={onClose} />
        ) : (
          <KeysMenu onArrange={onArrange} />
        )}
      </div>
    </>,
    document.body,
  );
}

function unitTitle(settings: Settings, n: number, t: ReturnType<typeof useT>) {
  return unitConfig(settings, n).name || `${t(`unit.${unitKind(settings, n)}`)} ${n}`;
}

function UnitMenu({ n, locked, onClose }: { n: number; locked: boolean; onClose: () => void }) {
  const t = useT();
  const now = useNow();
  const settings = useClub((s) => s.settings);
  const session = useClub((s) => s.sessions.find((x) => x.kind === "table" && x.table === n));
  const title = unitTitle(settings, n, t);

  // Every action is an existing keypad action on the focused session — no logic of its own.
  const run = (action: (api: ReturnType<typeof useClub.getState>) => void) => () => {
    onClose();
    const api = useClub.getState();
    if (session) api.focusSession(session.id);
    action(api);
  };

  if (!session && locked) {
    return (
      <>
        <Header title={title} sub={t("keyMenu.locked")} icon={Lock} />
        <Item icon={Crown} label={t("keyMenu.premium")} strong onSelect={run((api) => api.pushSheet({ kind: "premium" }))} />
      </>
    );
  }

  if (!session) {
    const vipUnit = settings.vipTables.includes(n);
    const rate = unitRate(settings, n, vipUnit);
    return (
      <>
        <Header
          title={title}
          sub={`${t("keyMenu.idle")} · ${t("keyMenu.perHour", { price: formatSom(rate) })}`}
          vip={vipUnit}
        />
        <Item icon={Play} label={t("keyMenu.start")} strong onSelect={run((api) => api.pressTable(n))} />
        <Item
          icon={Crown}
          label={t(vipUnit ? "keyMenu.startRegular" : "keyMenu.startVip")}
          onSelect={run((api) => {
            api.pressTable(n);
            api.pressVip();
          })}
        />
        <Divider />
        <Item icon={Settings2} label={t("keyMenu.unitSettings")} onSelect={run((api) => api.pushSheet({ kind: "unit", n }))} />
      </>
    );
  }

  const q = quote(session, now, settings.roundUp);
  const paused = Boolean(session.pauseStartedAt);
  let sub = `${formatClock(q.elapsed)} · ${t("keyMenu.sum", { sum: formatSom(q.total) })}`;
  if (paused) sub += ` · ${t("keyMenu.paused")}`;

  return (
    <>
      <Header title={title} sub={sub} vip={session.vip} />
      <Item icon={Receipt} label={t("keyMenu.close")} strong onSelect={run((api) => api.pressHisob())} />
      <Item icon={GlassWater} label={t("keyMenu.bar")} onSelect={run((api) => api.pressBar())} />
      <Divider />
      <Item
        icon={paused ? Play : Pause}
        label={t(paused ? "keyMenu.resume" : "keyMenu.pause")}
        onSelect={run((api) => api.pressPause())}
      />
      <Item
        icon={Crown}
        label={t(session.vip ? "keyMenu.vipOff" : "keyMenu.vipOn")}
        onSelect={run((api) => api.pressVip())}
      />
      <Item icon={ArrowRightLeft} label={t("keyMenu.move")} onSelect={run((api) => api.pressTransfer())} />
      <Item icon={Percent} label={t("keyMenu.discount")} onSelect={run((api) => api.pressDiscount())} />
      <Divider />
      <Item icon={Tag} label={t("keyMenu.price")} onSelect={run((api) => api.pushSheet({ kind: "unit", n }))} />
    </>
  );
}

function KeysMenu({ onArrange }: { onArrange: () => void }) {
  const t = useT();
  return <Item icon={LayoutGrid} label={t("keyMenu.arrange")} onSelect={onArrange} />;
}

function Header({ title, sub, vip, icon: Icon }: { title: string; sub: string; vip?: boolean; icon?: LucideIcon }) {
  return (
    <div className="flex items-start gap-3 border-b border-line px-4 pb-3 pt-3.5">
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-base font-semibold leading-tight">
          <span className="truncate">{title}</span>
          {vip ? (
            <span className="shrink-0 rounded-full bg-op px-2 py-0.5 text-[11px] font-semibold leading-none text-on-op">VIP</span>
          ) : null}
        </p>
        <p className="mt-1 truncate text-sm tabular-nums text-muted">{sub}</p>
      </div>
      {Icon ? <Icon className="mt-0.5 size-5 shrink-0 text-muted" strokeWidth={1.75} /> : null}
    </div>
  );
}

function Divider() {
  return <div className="h-1.5 bg-bg/50" role="separator" />;
}

function Item({
  icon: Icon,
  label,
  strong,
  onSelect,
}: {
  icon: LucideIcon;
  label: string;
  strong?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onSelect}
      className={cn(
        "key-menu-item flex h-12 w-full items-center justify-between gap-4 px-4 text-left text-base outline-none",
        strong ? "font-semibold text-op-ink" : "text-fg",
      )}
    >
      <span className="truncate">{label}</span>
      <Icon className={cn("size-5 shrink-0", strong ? "text-op-ink" : "text-muted")} strokeWidth={1.75} />
    </button>
  );
}

const KEY_MENU_CSS = `
.key-menu-dim {
  background: color-mix(in srgb, var(--color-bg) 55%, transparent);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  animation: key-menu-fade 180ms ease-out both;
}
.key-menu {
  opacity: 0;
}
.key-menu[data-ready] {
  opacity: 1;
  animation: key-menu-pop 220ms cubic-bezier(0.2, 0.9, 0.3, 1.2) both;
}
.key-menu-item + .key-menu-item {
  box-shadow: inset 0 1px 0 var(--color-line);
}
.key-menu-item:hover,
.key-menu-item:focus-visible {
  background: color-mix(in srgb, var(--color-fg) 6%, transparent);
}
.key-menu-item:active {
  background: color-mix(in srgb, var(--color-fg) 12%, transparent);
}
@keyframes key-menu-fade {
  from { opacity: 0; }
}
@keyframes key-menu-pop {
  from { opacity: 0; transform: scale(0.85); }
}
@media (prefers-reduced-motion: reduce) {
  .key-menu-dim,
  .key-menu[data-ready] {
    animation: none;
  }
}
`;
