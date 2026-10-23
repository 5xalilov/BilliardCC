import { useEffect, type ReactNode } from "react";
import { Delete, History, Plus, SlidersHorizontal } from "lucide-react";
import { Toaster } from "sonner";
import { NowProvider, useNow } from "@/components/club/now";
import { Onboarding } from "@/components/club/onboarding";
import { SheetHost } from "@/components/club/sheets";
import { useResolvedTheme } from "@/components/club/theme";
import { cn } from "@/lib/cn";
import {
  FREE_TABLE_LIMIT,
  displayBucket,
  elapsedMs,
  formatClock,
  formatSom,
  quote,
  sessionLabel,
} from "@/lib/club/logic";
import { useClub } from "@/lib/club/store";

export function ClubApp() {
  const theme = useResolvedTheme();
  const setupDone = useClub((s) => s.settings.setupDone);
  return (
    <NowProvider>
      {setupDone ? (
        <>
          <ClubScreen />
          <SheetHost />
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

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const api = useClub.getState();
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
  const openTotal = sessions.reduce(
    (sum, session) => sum + quote(session, now, settings.roundUp).total,
    0,
  );

  // Only data on the display — how the keys work is taught once, in onboarding.
  let label = "OCHIQ HISOB";
  let amount = formatSom(openTotal);
  let hint = sessions.length > 0 ? `${sessions.length} ta ochiq` : "";

  if (typing && focused) {
    label = `QO'SHIMCHA · ${sessionLabel(focused, walkins).toUpperCase()}`;
    amount = formatSom(Number(entry.buffer));
    hint = "";
  } else if (focused) {
    const q = quote(focused, now, settings.roundUp);
    label = sessionLabel(focused, walkins).toUpperCase();
    if (focused.vip) label += " · VIP";
    if (focused.pauseStartedAt) label += " · PAUZA";
    amount = formatSom(q.total);
    if (focused.kind === "walkin") {
      hint = `bar ${formatSom(q.bar)}`;
    } else {
      hint = `${formatClock(q.elapsed)} · vaqt ${formatSom(q.time)} · bar ${formatSom(q.bar)}`;
    }
    if (focused.discountPct) hint += ` · −${focused.discountPct}%`;
  }

  const barQty = focused?.items.reduce((sum, item) => sum + item.qty, 0) ?? 0;
  const paused = Boolean(focused?.pauseStartedAt);

  const onDisplay = () => {
    const api = useClub.getState();
    if (api.entry) return;
    if (api.focusId) api.pressHisob();
    else api.pushSheet({ kind: "history" });
  };

  return (
    <main className="mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-bg text-fg">
      <header className="flex items-center justify-between px-4 pt-3">
        <button
          type="button"
          className="key flex size-12 items-center justify-center rounded-full bg-key text-fg"
          aria-label="Tarix"
          onClick={() => useClub.getState().pushSheet({ kind: "history" })}
        >
          <History className="size-5" strokeWidth={1.75} />
        </button>
        <p className="max-w-40 truncate text-center text-sm text-muted">{settings.clubName}</p>
        <button
          type="button"
          className="key flex size-12 items-center justify-center rounded-full bg-key text-fg"
          aria-label="Sozlamalar"
          onClick={() => useClub.getState().pushSheet({ kind: "settings" })}
        >
          <SlidersHorizontal className="size-5" strokeWidth={1.75} />
        </button>
      </header>

      <button
        type="button"
        aria-label={typing ? "Qo'shimcha summa" : focused ? "Joriy hisob" : "Ochiq hisob"}
        onClick={onDisplay}
        className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-5 pb-4 text-right"
      >
        <span className="mb-2 flex items-baseline justify-between gap-3">
          <span className="text-sm font-medium tracking-widest text-muted">{label}</span>
          <span className="text-sm text-muted">so'm</span>
        </span>
        <span className="display-num text-fg" data-len={displayBucket(amount)}>
          {amount}
        </span>
        <span className="mt-3 block min-h-5 text-sm text-muted">{hint}</span>
      </button>

      <section className="pad-safe grid grid-cols-4 gap-3 px-3" aria-label="Boshqaruv">
        <Key kind="symbol" tone="fn" ariaLabel="Bekor qilish" onClick={() => useClub.getState().pressUndo()}>
          <Delete className="size-6" strokeWidth={1.75} />
        </Key>
        <Key kind="symbol" tone="fn" label="AC" ariaLabel="Tozalash" onClick={() => useClub.getState().pressAC()} />
        <Key
          kind={focused && focused.discountPct && !typing ? "word" : "symbol"}
          tone="fn"
          active={Boolean(focused && focused.discountPct > 0 && !typing)}
          disabled={typing}
          label={focused && focused.discountPct && !typing ? `${focused.discountPct}%` : "%"}
          ariaLabel="Chegirma"
          onClick={() => useClub.getState().pressDiscount()}
        />
        <Key
          kind="word"
          tone="op"
          label="BAR"
          badge={typing ? 0 : barQty}
          disabled={typing}
          ariaLabel="Bar"
          onClick={() => useClub.getState().pressBar()}
        />

        <div className="relative col-span-3 row-span-3">
          {typing ? <DigitBlock /> : <TableGrid now={now} />}
        </div>
        <Key
          kind="word"
          tone="op"
          active={paused && !typing}
          disabled={typing}
          label={paused && !typing ? "DAVOM" : "PAUZA"}
          ariaLabel={paused ? "Davom ettirish" : "Pauza"}
          onClick={() => useClub.getState().pressPause()}
        />
        <Key
          kind="word"
          tone="op"
          label="AYIR"
          disabled={typing}
          ariaLabel="Ayirish"
          onClick={() => useClub.getState().pressRemove()}
        />
        <Key
          kind="word"
          tone="op"
          active={typing}
          label="QO'SH"
          ariaLabel="Qo'shish"
          onClick={() => useClub.getState().pressAdd()}
        />

        <Key
          kind="word"
          tone="fn"
          label="KO'CH"
          disabled={typing}
          ariaLabel="Ko'chirish"
          onClick={() => useClub.getState().pressTransfer()}
        />
        <Key
          kind={typing ? "digit" : "digit"}
          tone="num"
          label="0"
          sub={typing ? undefined : "tashqi"}
          active={!typing && focused?.kind === "walkin"}
          live={!typing && walkins > 0 && focused?.kind !== "walkin"}
          ariaLabel="Tashqi"
          onClick={() => useClub.getState().pressWalkin()}
        />
        <Key
          kind={typing ? "symbol" : "word"}
          tone="fn"
          active={!typing && Boolean(focused?.vip)}
          label={typing ? "000" : "VIP"}
          ariaLabel={typing ? "Ming qo'shish" : "VIP narx"}
          onClick={() => useClub.getState().pressVip()}
        />
        <Key kind="word" tone="op" label="HISOB" ariaLabel="Hisob" onClick={() => useClub.getState().pressHisob()} />
      </section>
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

function TableGrid({ now }: { now: number }) {
  const tableCount = useClub((s) => s.settings.tableCount);
  const atFreeLimit = useClub((s) => !s.settings.premium && s.settings.tableCount >= FREE_TABLE_LIMIT);
  const cols = gridColumns(tableCount);
  const compact = cols > 3;
  return (
    <div className="no-scrollbar absolute inset-0 overflow-y-auto">
      <div
        className={cn("grid", compact ? "gap-2" : "gap-3")}
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
          {Array.from({ length: tableCount }, (_, i) => (
            <TableKey key={i + 1} n={i + 1} now={now} compact={compact} />
          ))}
          {atFreeLimit ? (
            <button
              type="button"
              aria-label="Stol qo'shish"
              onClick={() => useClub.getState().pushSheet({ kind: "premium" })}
              className="key flex aspect-square items-center justify-center rounded-full border-2 border-dashed border-line text-muted"
            >
              <Plus className="size-7" strokeWidth={1.5} />
            </button>
          ) : null}
      </div>
    </div>
  );
}

function TableKey({ n, now, compact }: { n: number; now: number; compact: boolean }) {
  const session = useClub((s) => s.sessions.find((x) => x.kind === "table" && x.table === n));
  const focusId = useClub((s) => s.focusId);
  const focused = Boolean(session) && session?.id === focusId;
  const paused = Boolean(session?.pauseStartedAt);
  const sub = session ? (paused ? "pauza" : formatClock(elapsedMs(session, now))) : undefined;

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
      ariaLabel={`Stol ${n}`}
      onClick={() => useClub.getState().pressTable(n)}
    />
  );
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
  ariaLabel,
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
  ariaLabel: string;
  onClick: () => void;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => {
        if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(8);
        onClick();
      }}
      className={cn(
        "key relative flex aspect-square items-center justify-center rounded-full",
        toneClass(tone, Boolean(active)),
        live && "key-live",
        paused && "key-paused",
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
