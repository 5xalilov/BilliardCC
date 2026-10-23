import { useEffect, useState } from "react";
import {
  Check,
  ChevronLeft,
  CircleHelp,
  Clock,
  Crown,
  CupSoda,
  Hash,
  Languages,
  LayoutGrid,
  Minus,
  Moon,
  Plus,
  Shapes,
  ShieldCheck,
  Store,
  Sun,
  SunMoon,
  Timer,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useNow } from "@/components/club/now";
import { cn } from "@/lib/cn";
import {
  CATEGORIES,
  FREE_TABLE_LIMIT,
  MAX_TABLES,
  MENU_CATEGORIES,
  formatClock,
  formatSom,
  formatWhen,
  itemQty,
  quote,
  tashkentDay,
  type Bill,
  type MenuCategory,
  type Session,
  type ThemeMode,
  type UnitConfig,
  unitConfig,
  unitKind,
} from "@/lib/club/logic";
import { OrdeWordmark } from "@/components/club/logo";
import guideKun from "@/assets/onboarding/guide-kun.webp";
import guideTun from "@/assets/onboarding/guide-tun.webp";
import { BUSINESSES, type BusinessKind } from "@/lib/club/business";
import { Group, MiniStepper, Row, RowIcon, Segmented, StackRow, Switch } from "@/components/club/settings-ui";
import { callCloud, cloudAvailable, type CloudClub } from "@/lib/club/cloud";
import { LANGS, translate, type Lang } from "@/lib/i18n";
import { usePlaceLabel, useT } from "@/lib/i18n/use-t";
import { GUIDE } from "@/lib/club/guide";
import { useClub, type PickField, type Sheet } from "@/lib/club/store";

export function SheetHost() {
  const t = useT();
  const sheets = useClub((s) => s.sheets);
  const pop = useClub((s) => s.popSheet);

  useEffect(() => {
    if (!sheets.length) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sheets.length]);

  if (!sheets.length) return null;

  return (
    <div className="fixed inset-0 z-40">
      <button
        type="button"
        className="absolute inset-0 bg-scrim"
        aria-label={t("common.back")}
        onClick={pop}
      />
      <div className="pointer-events-none relative z-10 mx-auto h-full w-full max-w-md">
        {sheets.map((sheet, index) => (
          <SheetFrame key={sheet.id} sheet={sheet} index={index} count={sheets.length} />
        ))}
      </div>
    </div>
  );
}

function SheetFrame({ sheet, index, count }: { sheet: Sheet; index: number; count: number }) {
  const top = index === count - 1;
  const depth = count - 1 - index;
  const [shown, setShown] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches || !top;
  });

  useEffect(() => {
    if (!top || shown) return;
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, [shown, top]);

  const shift = top ? 0 : -16 * depth;
  const scale = top ? 1 : 1 - Math.min(depth, 3) * 0.045;

  return (
    <section
      className="sheet-panel sheet-move absolute inset-x-0 bottom-0 bg-sheet text-fg"
      style={{
        zIndex: index,
        transformOrigin: "bottom center",
        pointerEvents: top ? "auto" : "none",
        transform: shown || !top ? `translateY(${shift}px) scale(${scale})` : "translateY(110%)",
      }}
      role={top ? "dialog" : undefined}
      aria-modal={top ? true : undefined}
      aria-hidden={!top}
    >
      <SheetHeader sheet={sheet} stacked={count > 1 && top} />
      {top ? (
        <div className="sheet-body">
          <SheetBody sheet={sheet} />
        </div>
      ) : null}
    </section>
  );
}

function sheetTitle(
  sheet: Sheet,
  sessions: Session[],
  t: ReturnType<typeof useT>,
  label: ReturnType<typeof usePlaceLabel>,
) {
  const session = "sessionId" in sheet ? sessions.find((s) => s.id === sheet.sessionId) : undefined;
  const walkins = sessions.filter((s) => s.kind === "walkin").length;
  const place = session ? label(session, walkins) : "";
  switch (sheet.kind) {
    case "bar":
      return { title: t("sheet.bar"), sub: place || t("sheet.pickPlace") };
    case "discount":
      return { title: t("sheet.discount"), sub: place };
    case "close":
      return { title: t("sheet.close"), sub: place };
    case "split":
      return { title: t("sheet.split"), sub: place };
    case "void":
      return { title: t("sheet.void"), sub: place };
    case "receipt":
    case "bill":
      return { title: t("sheet.receipt"), sub: "" };
    case "history":
      return { title: t("sheet.history"), sub: "" };
    case "settings":
      return { title: t("sheet.settings"), sub: "" };
    case "menu":
      return { title: t("sheet.menu"), sub: "" };
    case "help":
      return { title: t("sheet.help"), sub: "" };
    case "transfer":
      return { title: t("sheet.transfer"), sub: place };
    case "walkins":
      return { title: t("walkin"), sub: t("walkin.sub") };
    case "premium":
      return { title: t("sheet.premium"), sub: "" };
    case "admin":
      return { title: t("sheet.admin"), sub: t("sheet.adminSub") };
    case "unit":
      return { title: label({ kind: "table", table: sheet.n, seq: 0 }), sub: "" };
    case "product":
      return { title: sheet.itemId ? t("sheet.product") : t("sheet.productNew"), sub: "" };
    case "pick":
      return {
        title: t(sheet.field === "lang" ? "sheet.language" : sheet.field === "business" ? "sheet.business" : "unitSheet.type"),
        sub: sheet.field === "unitKind" && sheet.n ? label({ kind: "table", table: sheet.n, seq: 0 }) : "",
      };
    default:
      return { title: "", sub: "" };
  }
}

function SheetHeader({ sheet, stacked }: { sheet: Sheet; stacked: boolean }) {
  const sessions = useClub((s) => s.sessions);
  const pop = useClub((s) => s.popSheet);
  const t = useT();
  const label = usePlaceLabel();
  const { title, sub } = sheetTitle(sheet, sessions, t, label);
  return (
    <div className="shrink-0 px-4 pb-2 pt-3">
      <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-line" />
      <div className="flex items-center">
        {stacked ? (
          <button
            type="button"
            onClick={pop}
            className="key flex size-9 items-center justify-center rounded-full bg-elev text-fg"
            aria-label={t("common.back")}
          >
            <ChevronLeft className="size-5" />
          </button>
        ) : (
          <span className="size-9" />
        )}
        <div className="min-w-0 flex-1 text-center">
          <h2 className="text-base font-semibold text-balance">{title}</h2>
          {sub ? <p className="truncate text-sm text-muted">{sub}</p> : null}
        </div>
        <span className="size-9" />
      </div>
    </div>
  );
}

function SheetBody({ sheet }: { sheet: Sheet }) {
  switch (sheet.kind) {
    case "bar":
      return <BarSheet />;
    case "discount":
      return <DiscountSheet sessionId={sheet.sessionId} />;
    case "close":
      return <CloseSheet sessionId={sheet.sessionId} />;
    case "split":
      return <SplitSheet sessionId={sheet.sessionId} />;
    case "void":
      return <VoidSheet sessionId={sheet.sessionId} />;
    case "receipt":
      return <ReceiptSheet billId={sheet.billId} />;
    case "history":
      return <HistorySheet />;
    case "bill":
      return <ReceiptSheet billId={sheet.billId} />;
    case "settings":
      return <SettingsSheet />;
    case "menu":
      return <MenuSheet />;
    case "help":
      return <HelpSheet />;
    case "transfer":
      return <TransferSheet sessionId={sheet.sessionId} />;
    case "walkins":
      return <WalkinSheet />;
    case "premium":
      return <PremiumSheet />;
    case "admin":
      return <AdminSheet />;
    case "unit":
      return <UnitSheet n={sheet.n} />;
    case "product":
      return <ProductSheet itemId={sheet.itemId} />;
    case "pick":
      return <PickSheet field={sheet.field} n={sheet.n} />;
    default: {
      const neverSheet: never = sheet;
      return neverSheet;
    }
  }
}

function useSession(sessionId: string | null) {
  return useClub((s) => (sessionId ? s.sessions.find((item) => item.id === sessionId) ?? null : null));
}

function BarSheet() {
  const t = useT();
  const now = useNow();
  const sessions = useClub((s) => s.sessions);
  const focusId = useClub((s) => s.focusId);
  const menu = useClub((s) => s.menu);
  const roundUp = useClub((s) => s.settings.roundUp);
  const [category, setCategory] = useState<MenuCategory | "all">("all");
  const focused = sessions.find((s) => s.id === focusId) ?? null;
  const walkins = sessions.filter((s) => s.kind === "walkin").length;
  const items = menu.filter((item) => category === "all" || item.category === category);
  const cart = focused ? quote(focused, now, roundUp) : null;
  const label = usePlaceLabel();

  return (
    <div className="flex flex-col">
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
        {sessions.map((session) => {
          const on = session.id === focusId;
          return (
            <button
              key={session.id}
              type="button"
              onClick={() => useClub.getState().focusSession(session.id)}
              className={cn(
                "key shrink-0 rounded-full px-4 py-2 text-left",
                on ? "bg-op-tint text-op-ink key-sel" : "bg-elev text-fg",
              )}
            >
              <span className="block text-sm font-semibold">{label(session, walkins)}</span>
              <span className={cn("block text-xs tabular-nums", on ? "text-op-ink/80" : "text-muted")}>
                {session.kind === "table" ? formatClock(quote(session, now, roundUp).elapsed) : t("bar.only")}
                {" · "}
                {formatSom(quote(session, now, roundUp).total)}
              </span>
            </button>
          );
        })}
        <button
          type="button"
          className="key shrink-0 rounded-full bg-elev px-4 py-2 text-sm font-semibold text-fg"
          onClick={() => useClub.getState().createWalkin()}
        >
          {t("walkin.add")}
        </button>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
        {CATEGORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCategory(item.id)}
            className={cn(
              "key shrink-0 rounded-full px-4 py-2 text-sm",
              category === item.id ? "bg-op-tint text-op-ink key-sel" : "bg-elev text-fg",
            )}
          >
            {t(`cat.${item.id}`)}
          </button>
        ))}
      </div>

      {sessions.length === 0 ? (
        <p className="px-4 pb-4 text-sm text-muted">{t("bar.openFirst")}</p>
      ) : null}

      {menu.length === 0 ? (
        <div className="px-4 pb-4">
          <button
            type="button"
            className="key flex h-12 w-full items-center justify-center gap-2 rounded-full bg-op text-base font-semibold text-on-op"
            onClick={() => useClub.getState().pushSheet({ kind: "product", itemId: null })}
          >
            <Plus className="size-5" />
            {t("product.add")}
          </button>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 px-4 pb-4">
        {items.map((item) => {
          const qty = focused ? itemQty(focused.items, item.id) : 0;
          return (
            <div key={item.id} className="rounded-3xl bg-elev p-4">
              <button
                type="button"
                className="w-full text-left"
                disabled={!focused}
                onClick={() => useClub.getState().addMenu(item.id)}
              >
                <span className="block text-base font-medium">{item.name}</span>
                <span className="mt-1 block text-sm tabular-nums text-muted">{formatSom(item.price)}</span>
              </button>
              {qty > 0 ? (
                <div className="mt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    className="key flex size-9 items-center justify-center rounded-full bg-fn text-lg text-fg"
                    aria-label={t("product.less", { name: item.name })}
                    onClick={() => useClub.getState().decMenu(item.id)}
                  >
                    −
                  </button>
                  <span className="w-5 text-center font-semibold tabular-nums">{qty}</span>
                  <button
                    type="button"
                    className="key flex size-9 items-center justify-center rounded-full bg-op text-lg text-on-op"
                    aria-label={t("product.more", { name: item.name })}
                    onClick={() => useClub.getState().addMenu(item.id)}
                  >
                    +
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="pad-safe sticky bottom-0 border-t border-line bg-sheet px-4 py-3">
        <button
          type="button"
          className="key h-12 w-full rounded-full bg-op text-base font-semibold text-on-op"
          onClick={() => useClub.getState().popSheet()}
        >
          {cart && focused
            ? t("common.doneWith", { place: label(focused, walkins), total: formatSom(cart.total) })
            : t("common.done")}
        </button>
      </div>
    </div>
  );
}

const DISCOUNTS = [0, 5, 10, 15, 20, 30, 50, 100];

function DiscountSheet({ sessionId }: { sessionId: string }) {
  const t = useT();
  const session = useSession(sessionId);
  const now = useNow();
  const roundUp = useClub((s) => s.settings.roundUp);
  const [pct, setPct] = useState(session?.discountPct ?? 0);
  if (!session) return <Missing />;
  const preview = quote({ ...session, discountPct: pct }, now, roundUp);
  return (
    <div className="pad-safe px-4 pb-4">
      <div className="grid grid-cols-4 gap-3">
        {DISCOUNTS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setPct(value)}
            className={cn(
              "key aspect-square rounded-full text-sm font-semibold",
              pct === value ? "bg-op-tint text-op-ink key-sel" : "bg-elev text-fg",
            )}
          >
            {value === 0 ? t("discount.none") : value === 100 ? t("discount.free") : `${value}%`}
          </button>
        ))}
      </div>
      <p className="mt-4 text-center text-sm text-muted">
        {t("discount.newTotal")} <span className="text-base font-semibold text-fg tabular-nums">{formatSom(preview.total)}</span>
      </p>
      <button
        type="button"
        className="key mt-4 h-12 w-full rounded-full bg-op text-base font-semibold text-on-op"
        onClick={() => useClub.getState().setDiscount(sessionId, pct)}
      >
        {t("common.apply")}
      </button>
    </div>
  );
}

function CloseSheet({ sessionId }: { sessionId: string }) {
  const t = useT();
  const session = useSession(sessionId);
  const now = useNow();
  const roundUp = useClub((s) => s.settings.roundUp);
  if (!session) return <Missing />;
  const q = quote(session, now, roundUp);
  return (
    <div className="pad-safe px-4 pb-4">
      <p className="text-center text-sm text-muted">
        {session.kind === "table"
          ? `${formatClock(q.elapsed)} · ${t("close.minutes", { min: q.minutes })}`
          : t("close.barOnly")}
        {session.pauseStartedAt ? ` · ${t("close.paused")}` : ""}
      </p>
      <p className="mt-1 text-center text-5xl font-light tabular-nums text-fg">{formatSom(q.total)}</p>
      <div className="mt-3 divide-y divide-line">
        {session.kind === "table" ? (
          <MoneyLine
            label={t("close.time")}
            detail={`${t("close.timeDetail", { min: q.minutes, rate: formatSom(session.ratePerHour) })}${session.vip ? " · VIP" : ""}`}
            amount={q.time}
          />
        ) : null}
        {session.items.map((item) => (
          <MoneyLine
            key={item.id}
            label={item.qty > 1 ? `${item.name} × ${item.qty}` : item.name}
            amount={item.price * item.qty}
          />
        ))}
        {q.discountAmt > 0 ? (
          <MoneyLine label={t("close.discount", { pct: session.discountPct })} amount={q.discountAmt} negative />
        ) : null}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          className="key h-14 rounded-full bg-op text-base font-semibold text-on-op"
          onClick={() => useClub.getState().closeBill(sessionId, q.total, 0)}
        >
          {t("common.cash")}
        </button>
        <button
          type="button"
          className="key h-14 rounded-full bg-fn text-base font-semibold text-fg"
          onClick={() => useClub.getState().closeBill(sessionId, 0, q.total)}
        >
          {t("common.card")}
        </button>
      </div>
      <button
        type="button"
        className="key mt-3 h-12 w-full rounded-full bg-elev text-base font-medium text-fg"
        onClick={() => useClub.getState().pushSheet({ kind: "split", sessionId })}
      >
        {t("close.mixed")}
      </button>
      <button
        type="button"
        className="mt-3 w-full py-3 text-sm text-danger"
        onClick={() => useClub.getState().pushSheet({ kind: "void", sessionId })}
      >
        {t("close.void")}
      </button>
    </div>
  );
}

function SplitSheet({ sessionId }: { sessionId: string }) {
  const t = useT();
  const session = useSession(sessionId);
  const now = useNow();
  const roundUp = useClub((s) => s.settings.roundUp);
  const [raw, setRaw] = useState("");
  if (!session) return <Missing />;
  const total = quote(session, now, roundUp).total;
  const cash = Number(raw || "0");
  const card = total - cash;
  const valid = cash > 0 && cash < total;
  const chips = [10000, 20000, 50000, 100000];
  return (
    <div className="pad-safe px-4 pb-4">
      <p className="text-center text-sm text-muted">{t("split.total", { total: formatSom(total) })}</p>
      <input
        inputMode="numeric"
        value={raw ? formatSom(cash) : ""}
        placeholder={t("split.cash")}
        aria-label={t("split.cash")}
        onChange={(event) => setRaw(event.target.value.replace(/\D/g, "").slice(0, 7))}
        className="mt-3 w-full rounded-2xl bg-bg px-4 py-4 text-2xl text-fg outline-none tabular-nums"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="key rounded-full bg-elev px-4 py-2 text-sm text-fg"
          onClick={() => setRaw(String(Math.floor(total / 2)))}
        >
          {t("split.half")}
        </button>
        {chips.map((chip) => (
          <button
            key={chip}
            type="button"
            className="key rounded-full bg-elev px-4 py-2 text-sm tabular-nums text-fg"
            onClick={() => setRaw(String(Math.min(total - 1, cash + chip)))}
          >
            +{formatSom(chip)}
          </button>
        ))}
      </div>
      <p className="mt-4 text-center text-sm text-muted">
        {t("split.toCard")} <span className="font-semibold text-fg tabular-nums">{formatSom(Math.max(0, card))}</span>
      </p>
      {!valid && cash > 0 ? (
        <p className="mt-1 text-center text-sm text-op-ink">{t("split.invalid")}</p>
      ) : null}
      <button
        type="button"
        disabled={!valid}
        className="key mt-4 h-12 w-full rounded-full bg-op text-base font-semibold text-on-op disabled:opacity-40"
        onClick={() => useClub.getState().closeBill(sessionId, cash, total - cash)}
      >
        {t("common.close")}
      </button>
    </div>
  );
}

function VoidSheet({ sessionId }: { sessionId: string }) {
  const t = useT();
  return (
    <div className="pad-safe px-4 pb-5">
      <p className="text-center text-base text-pretty">
        {t("void.text")}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          className="key h-12 rounded-full bg-elev text-base font-medium text-fg"
          onClick={() => useClub.getState().popSheet()}
        >
          {t("void.keep")}
        </button>
        <button
          type="button"
          className="key h-12 rounded-full bg-danger-fill text-base font-semibold text-on-danger"
          onClick={() => useClub.getState().voidBill(sessionId)}
        >
          {t("void.confirm")}
        </button>
      </div>
    </div>
  );
}

function ReceiptSheet({ billId }: { billId: string }) {
  const t = useT();
  const bill = useClub((s) => s.bills.find((item) => item.id === billId) ?? null);
  const clubName = useClub((s) => s.settings.clubName);
  const label = usePlaceLabel();
  if (!bill) return <Missing />;
  return (
    <div className="pad-safe px-4 pb-4">
      <div className="rounded-3xl bg-elev px-4 py-5">
        <p className="text-center text-sm font-semibold tracking-widest text-muted">
          {clubName.toUpperCase()}
        </p>
        <p className="mt-1 text-center text-lg font-semibold">{label(bill)}</p>
        <p className="text-center text-sm text-muted">{formatWhen(bill.closedAt)}</p>
        {bill.voided ? (
          <p className="mt-2 text-center text-sm font-semibold tracking-widest text-danger">{t("receipt.voided")}</p>
        ) : null}
        <div className="mt-4 divide-y divide-line">
          {bill.kind === "table" ? (
            <MoneyLine
              label={t("close.time")}
              detail={t("close.timeDetail", { min: bill.billedMinutes, rate: formatSom(bill.ratePerHour) })}
              amount={bill.timeCharge}
            />
          ) : null}
          {bill.items.map((item) => (
            <MoneyLine
              key={item.id}
              label={item.qty > 1 ? `${item.name} × ${item.qty}` : item.name}
              amount={item.price * item.qty}
            />
          ))}
          {bill.discountAmt > 0 ? (
            <MoneyLine label={t("close.discount", { pct: bill.discountPct })} amount={bill.discountAmt} negative />
          ) : null}
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-sm text-muted">{t("common.total")}</span>
          <span className="text-2xl font-medium tabular-nums">{formatSom(bill.total)}</span>
        </div>
        {!bill.voided ? (
          <p className="mt-2 text-right text-sm text-muted">
            {bill.card > 0 && bill.cash > 0
              ? t("receipt.split", { cash: formatSom(bill.cash), card: formatSom(bill.card) })
              : bill.card > 0
                ? t("common.card")
                : t("common.cash")}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        className="key mt-4 h-12 w-full rounded-full bg-op text-base font-semibold text-on-op"
        onClick={() => useClub.getState().popSheet()}
      >
        {t("common.done")}
      </button>
    </div>
  );
}

function HistorySheet() {
  const t = useT();
  const bills = useClub((s) => s.bills);
  const now = useNow();
  const [todayOnly, setTodayOnly] = useState(true);
  const today = tashkentDay(now || Date.now());
  const shown = bills.filter((bill) => !todayOnly || tashkentDay(bill.closedAt) === today);
  const paid = shown.filter((bill) => !bill.voided);
  const revenue = paid.reduce((sum, bill) => sum + bill.total, 0);
  const cash = paid.reduce((sum, bill) => sum + bill.cash, 0);
  const card = paid.reduce((sum, bill) => sum + bill.card, 0);
  const label = usePlaceLabel();
  return (
    <div className="pad-safe px-4 pb-4">
      <div className="mb-4 grid grid-cols-2 gap-2 rounded-full bg-elev p-1">
        <button
          type="button"
          className={cn("key rounded-full py-2 text-sm", todayOnly ? "bg-seg text-fg" : "text-muted")}
          onClick={() => setTodayOnly(true)}
        >
          {t("common.today")}
        </button>
        <button
          type="button"
          className={cn("key rounded-full py-2 text-sm", !todayOnly ? "bg-seg text-fg" : "text-muted")}
          onClick={() => setTodayOnly(false)}
        >
          {t("common.all")}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Stat label={t("history.revenue")} value={formatSom(revenue)} />
        <Stat label={t("common.cash")} value={formatSom(cash)} />
        <Stat label={t("common.card")} value={formatSom(card)} />
      </div>
      {shown.length === 0 ? (
        <p className="px-2 py-10 text-center text-sm text-muted">{t("history.empty")}</p>
      ) : (
        <ul className="mt-4 divide-y divide-line">
          {shown.map((bill) => (
            <li key={bill.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 py-3 text-left"
                onClick={() => useClub.getState().pushSheet({ kind: "bill", billId: bill.id })}
              >
                <span>
                  <span className={cn("block text-base", bill.voided && "text-muted line-through")}>
                    {label(bill)}
                  </span>
                  <span className="block text-sm text-muted">
                    {formatWhen(bill.closedAt)}
                    {bill.voided ? ` · ${t("history.voided")}` : ""}
                  </span>
                </span>
                <span className={cn("tabular-nums", bill.voided ? "text-muted" : "text-fg")}>
                  {formatSom(bill.total)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-elev px-2 py-3 text-center">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function SettingsSheet() {
  const t = useT();
  const settings = useClub((s) => s.settings);
  const isAdmin = useClub((s) => s.cloud.isAdmin);
  const menuCount = useClub((s) => s.menu.length);
  const [name, setName] = useState(settings.clubName);
  const theme = settings.theme ?? "auto";
  const label = usePlaceLabel();
  const steps = (text: string) => ({
    decLabel: translate(settings.lang, "common.dec", { label: text }),
    incLabel: translate(settings.lang, "common.inc", { label: text }),
  });
  const push = useClub.getState().pushSheet;
  const patch = useClub.getState().patchSettings;
  return (
    <div className="pad-safe space-y-6 px-4 pt-1 pb-5">
      {isAdmin ? (
        <Group>
          <Row icon={ShieldCheck} label={t("sheet.admin")} chevron onClick={() => push({ kind: "admin" })} />
        </Group>
      ) : null}

      <Group>
        <label className="ios-row flex items-center gap-3 pl-4">
          <RowIcon icon={Store} />
          <span className="ios-row-body flex min-h-12 min-w-0 flex-1 items-center gap-3 py-2.5 pr-4">
            <span className="shrink-0 text-base">{t("settings.name")}</span>
            <input
              value={name}
              maxLength={32}
              aria-label={t("settings.clubName")}
              onChange={(event) => setName(event.target.value)}
              onBlur={() => useClub.getState().setClubName(name)}
              className="min-w-0 flex-1 bg-transparent text-right text-base text-muted outline-none focus:text-fg"
            />
          </span>
        </label>
        <Row
          icon={Shapes}
          label={t("sheet.business")}
          value={t(`biz.${settings.business}`)}
          chevron
          onClick={() => push({ kind: "pick", field: "business" })}
        />
      </Group>

      <Group
        header={t(`units.${settings.business}`)}
        footer={settings.premium ? undefined : t("settings.freeLimit", { n: FREE_TABLE_LIMIT })}
      >
        <Row
          icon={Hash}
          label={t("settings.count")}
          accessory={
            <MiniStepper
              value={settings.tableCount}
              min={1}
              max={MAX_TABLES}
              step={1}
              onChange={(count) => useClub.getState().setTableCount(count)}
              {...steps(t(`units.${settings.business}`))}
            />
          }
        />
        {Array.from({ length: settings.tableCount }, (_, i) => i + 1).map((n) => {
          const unit = unitConfig(settings, n);
          const vip = settings.vipTables.includes(n);
          const rate = vip ? (unit.vipRate ?? settings.vipRate) : (unit.rate ?? settings.rate);
          const place = label({ kind: "table", table: n, seq: 0 });
          return (
            <Row
              key={n}
              label={place}
              value={
                <>
                  {vip ? (
                    <span className="rounded-full bg-op-tint px-2 py-0.5 text-xs font-semibold text-op-ink">VIP</span>
                  ) : null}
                  <span className={Object.keys(unit).length ? "text-op-ink" : undefined}>{formatSom(rate)}</span>
                </>
              }
              chevron
              ariaLabel={place}
              onClick={() => push({ kind: "unit", n })}
            />
          );
        })}
      </Group>

      <Group header={t("settings.prices")} footer={t("settings.ratesNote")}>
        <Row
          icon={Clock}
          label={t("settings.rate")}
          accessory={
            <MiniStepper
              value={settings.rate}
              min={5000}
              max={500000}
              step={5000}
              format={formatSom}
              onChange={(rate) => patch({ rate })}
              {...steps(t("settings.rate"))}
            />
          }
        />
        <Row
          icon={Crown}
          label={t("settings.vipRate")}
          accessory={
            <MiniStepper
              value={settings.vipRate}
              min={5000}
              max={800000}
              step={5000}
              format={formatSom}
              onChange={(vipRate) => patch({ vipRate })}
              {...steps(t("settings.vipRate"))}
            />
          }
        />
        <StackRow icon={Timer} label={t("settings.rounding")}>
          <Segmented
            label={t("settings.rounding")}
            value={settings.roundUp}
            onChange={(roundUp) => patch({ roundUp })}
            options={[
              { id: 1, label: t("settings.round1") },
              { id: 15, label: t("settings.round15") },
            ]}
          />
        </StackRow>
      </Group>

      <Group header={t("settings.appearance")}>
        <StackRow>
          <Segmented<ThemeMode>
            label={t("settings.appearance")}
            value={theme}
            onChange={(value) => patch({ theme: value })}
            options={[
              { id: "auto", label: t("theme.auto"), icon: SunMoon },
              { id: "light", label: t("theme.light"), icon: Sun },
              { id: "dark", label: t("theme.dark"), icon: Moon },
            ]}
          />
        </StackRow>
        <Row
          icon={Languages}
          label={t("sheet.language")}
          value={LANGS.find((l) => l.id === settings.lang)?.label}
          chevron
          onClick={() => push({ kind: "pick", field: "lang" })}
        />
      </Group>

      <Group>
        <Row icon={CupSoda} label={t("settings.menu")} value={menuCount} chevron onClick={() => push({ kind: "menu" })} />
        <Row icon={LayoutGrid} label={t("keyMenu.arrange")} chevron onClick={() => useClub.getState().startArranging()} />
      </Group>

      <Group>
        <Row
          icon={Crown}
          label={t("sheet.premium")}
          accessory={settings.premium ? <Check className="size-5 text-op-ink" aria-label={t("premium.already")} /> : null}
          chevron
          onClick={() => push({ kind: "premium" })}
        />
        <Row icon={CircleHelp} label={t("settings.help")} chevron onClick={() => push({ kind: "help" })} />
      </Group>
      <BrandFooter />
    </div>
  );
}

// Single choice from a list (language, business kind, a unit's kind): a check marks the
// current value; picking applies it and returns to the previous sheet.
function PickSheet({ field, n }: { field: PickField; n?: number }) {
  const t = useT();
  const settings = useClub((s) => s.settings);
  const kinds = BUSINESSES.map((b) => ({ id: b.id as string, label: `${b.emoji} ${t(`biz.${b.id}`)}` }));
  let options: { id: string; label: string }[];
  let value: string;
  let apply: (id: string) => void;
  if (field === "lang") {
    options = LANGS.map((l) => ({ id: l.id as string, label: l.label }));
    value = settings.lang;
    apply = (id) => useClub.getState().patchSettings({ lang: id as Lang });
  } else if (field === "business") {
    options = kinds;
    value = settings.business;
    apply = (id) => useClub.getState().patchSettings({ business: id as BusinessKind });
  } else {
    const unit = n ?? 1;
    options = [{ id: "", label: t("unitSheet.clubType") }, ...kinds];
    value = unitConfig(settings, unit).kind ?? "";
    apply = (id) => useClub.getState().setUnit(unit, { kind: (id || undefined) as BusinessKind | undefined });
  }
  return (
    <div className="pad-safe px-4 pt-1 pb-5">
      <Group>
        {options.map((option) => (
          <Row
            key={option.id || "default"}
            label={option.label}
            accessory={value === option.id ? <Check className="size-5 text-op-ink" /> : null}
            onClick={() => {
              apply(option.id);
              useClub.getState().popSheet();
            }}
          />
        ))}
      </Group>
    </div>
  );
}

function BrandFooter() {
  const t = useT();
  return (
    <div className="flex flex-col items-center gap-2 pt-4 pb-1">
      <OrdeWordmark className="h-7 text-fg" />
      <span className="text-xs text-muted">{t("brand.tagline")}</span>
    </div>
  );
}

export function Stepper({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  const lang = useClub((s) => s.settings.lang);
  return (
    <div>
      <p className="text-sm text-muted">{label}</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <button
          type="button"
          className="key flex size-11 items-center justify-center rounded-full bg-key text-fg"
          aria-label={translate(lang, "common.dec", { label })}
          onClick={() => onChange(Math.max(min, value - step))}
        >
          <Minus className="size-4" />
        </button>
        <span className="text-lg font-medium tabular-nums">{formatSom(value)}</span>
        <button
          type="button"
          className="key flex size-11 items-center justify-center rounded-full bg-key text-fg"
          aria-label={translate(lang, "common.inc", { label })}
          onClick={() => onChange(Math.min(max, value + step))}
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}

function MenuSheet() {
  const t = useT();
  const menu = useClub((s) => s.menu);
  return (
    <div className="pad-safe space-y-4 px-4 pt-1 pb-5">
      <button
        type="button"
        className="key flex h-12 w-full items-center justify-center gap-2 rounded-full bg-op text-base font-semibold text-on-op"
        onClick={() => useClub.getState().pushSheet({ kind: "product", itemId: null })}
      >
        <Plus className="size-5" />
        {t("product.add")}
      </button>
      {menu.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">{t("menu.empty")}</p>
      ) : (
        <Group>
          {menu.map((item) => (
            <Row
              key={item.id}
              label={item.name}
              sub={t(`cat.${item.category}`)}
              value={formatSom(item.price)}
              chevron
              onClick={() => useClub.getState().pushSheet({ kind: "product", itemId: item.id })}
            />
          ))}
        </Group>
      )}
    </div>
  );
}

function ProductSheet({ itemId }: { itemId: string | null }) {
  const t = useT();
  const existing = useClub((s) => (itemId ? s.menu.find((item) => item.id === itemId) ?? null : null));
  const [name, setName] = useState(existing?.name ?? "");
  const [price, setPrice] = useState(existing ? String(existing.price) : "");
  const [category, setCategory] = useState<MenuCategory>(existing?.category ?? "ichimlik");
  const amount = Number(price.replace(/\D/g, "")) || 0;
  const valid = name.trim().length > 0 && amount > 0;

  const save = () => {
    if (!valid) return;
    useClub.getState().saveMenuItem({ id: existing?.id, name, price: amount, category });
    useClub.getState().popSheet();
  };

  return (
    <div className="pad-safe space-y-4 px-4 pb-5">
      <div className="overflow-hidden rounded-2xl bg-elev">
        <label className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <span className="shrink-0 text-base">{t("product.name")}</span>
          <input
            value={name}
            maxLength={40}
            autoFocus={!existing}
            aria-label={t("product.nameLabel")}
            placeholder={t("product.namePh")}
            onChange={(event) => setName(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-right text-base text-fg outline-none placeholder:text-muted/60"
          />
        </label>
        <label className="flex items-center justify-between gap-3 px-4 py-3">
          <span className="shrink-0 text-base">{t("product.price")}</span>
          <input
            value={price ? formatSom(amount) : ""}
            inputMode="numeric"
            aria-label={t("product.price")}
            placeholder="12 000"
            onChange={(event) => setPrice(event.target.value.replace(/\D/g, "").slice(0, 9))}
            className="min-w-0 flex-1 bg-transparent text-right text-base tabular-nums text-fg outline-none placeholder:text-muted/60"
          />
        </label>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {MENU_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={category === c.id}
            className={cn(
              "key rounded-full py-2 text-sm",
              category === c.id ? "bg-op-tint text-op-ink key-sel" : "bg-fn text-fg",
            )}
            onClick={() => setCategory(c.id)}
          >
            {t(`cat.${c.id}`)}
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={!valid}
        className="key h-12 w-full rounded-full bg-op text-base font-semibold text-on-op disabled:opacity-40"
        onClick={save}
      >
        {t("common.save")}
      </button>
      {existing ? (
        <button
          type="button"
          className="key flex h-12 w-full items-center justify-center gap-2 rounded-full bg-elev text-base text-fg"
          onClick={() => {
            useClub.getState().removeMenuItem(existing.id);
            useClub.getState().popSheet();
          }}
        >
          <Trash2 className="size-4" />
          {t("common.delete")}
        </button>
      ) : null}
    </div>
  );
}

function PremiumSheet() {
  const t = useT();
  const premium = useClub((s) => s.settings.premium);
  const requested = useClub((s) => s.cloud.premiumRequested);
  const [busy, setBusy] = useState(false);
  const online = cloudAvailable();

  const request = async () => {
    setBusy(true);
    try {
      const { status } = await callCloud<{ status: "active" | "sent" | "closed" }>("requestPremium");
      if (status === "sent") {
        useClub.getState().markPremiumRequested();
        toast(t("premium.sent"));
      } else if (status === "active") {
        toast(t("premium.already"));
      } else {
        toast(t("premium.soon"));
      }
    } catch {
      toast(t("premium.failed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pad-safe space-y-3 px-4 pb-5">
      <div className="flex flex-col items-center gap-2 py-2 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-op text-on-op">
          <Crown className="size-7" strokeWidth={1.75} />
        </span>
        <p className="text-sm text-muted">{premium ? t("premium.active") : t("premium.for")}</p>
      </div>
      <div className="rounded-3xl bg-elev px-4 py-3">
        <p className="text-base font-semibold">{t("premium.perkUnits", { n: MAX_TABLES })}</p>
        <p className="mt-1 text-sm text-muted">{t("premium.perkUnitsSub", { free: FREE_TABLE_LIMIT })}</p>
      </div>
      {premium ? null : online ? (
        <button
          type="button"
          disabled={busy || requested}
          className="key h-12 w-full rounded-full bg-op text-base font-semibold text-on-op disabled:opacity-50"
          onClick={request}
        >
          {requested ? t("premium.requested") : t("premium.request")}
        </button>
      ) : (
        <p className="pt-2 text-center text-sm text-muted">{t("premium.inBot")}</p>
      )}
    </div>
  );
}

// One unit's own settings: name, business type, rates, VIP. Unset fields follow the club;
// a value set for this unit alone is shown in the accent ink.
function UnitSheet({ n }: { n: number }) {
  const t = useT();
  const settings = useClub((s) => s.settings);
  const unit = unitConfig(settings, n);
  const kind = unitKind(settings, n);
  const vip = settings.vipTables.includes(n);
  const set = (patch: UnitConfig) => useClub.getState().setUnit(n, patch);
  const custom = Object.keys(unit).length > 0;
  const placeholder = `${t(`unit.${kind}`)} ${n}`;
  const steps = (text: string) => ({
    decLabel: translate(settings.lang, "common.dec", { label: text }),
    incLabel: translate(settings.lang, "common.inc", { label: text }),
  });

  return (
    <div className="pad-safe space-y-6 px-4 pt-1 pb-5">
      <Group>
        <label className="ios-row flex items-center gap-3 pl-4">
          <span className="ios-row-body flex min-h-12 min-w-0 flex-1 items-center gap-3 py-2.5 pr-4">
            <span className="shrink-0 text-base">{t("unitSheet.name")}</span>
            <input
              value={unit.name ?? ""}
              maxLength={24}
              placeholder={placeholder}
              aria-label={t("unitSheet.name")}
              onChange={(event) => set({ name: event.target.value })}
              className="min-w-0 flex-1 bg-transparent text-right text-base text-fg outline-none placeholder:text-muted"
            />
          </span>
        </label>
        <Row
          label={t("unitSheet.type")}
          value={<span className={unit.kind ? "text-op-ink" : undefined}>{unit.kind ? t(`biz.${unit.kind}`) : t("unitSheet.clubType")}</span>}
          chevron
          onClick={() => useClub.getState().pushSheet({ kind: "pick", field: "unitKind", n })}
        />
      </Group>

      <Group header={t("settings.prices")}>
        <Row
          label={t("unitSheet.rate")}
          accessory={
            <MiniStepper
              value={unit.rate ?? settings.rate}
              min={0}
              max={2000000}
              step={5000}
              format={formatSom}
              highlight={unit.rate !== undefined}
              onChange={(rate) => set({ rate })}
              {...steps(t("unitSheet.rate"))}
            />
          }
        />
        <Row
          label={t("unitSheet.vipRate")}
          accessory={
            <MiniStepper
              value={unit.vipRate ?? settings.vipRate}
              min={0}
              max={2000000}
              step={5000}
              format={formatSom}
              highlight={unit.vipRate !== undefined}
              onChange={(vipRate) => set({ vipRate })}
              {...steps(t("unitSheet.vipRate"))}
            />
          }
        />
        <Row
          label={t("unitSheet.vip")}
          accessory={<Switch on={vip} label={t("unitSheet.vip")} onChange={() => useClub.getState().toggleVipTable(n)} />}
        />
      </Group>

      {custom ? (
        <Group>
          <Row label={t("unitSheet.reset")} tone="accent" onClick={() => useClub.getState().setUnit(n, null)} />
        </Group>
      ) : null}
    </div>
  );
}

function AdminSheet() {
  const t = useT();
  const [clubs, setClubs] = useState<CloudClub[] | null>(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState<number | null>(null);

  useEffect(() => {
    callCloud<{ clubs: CloudClub[] }>("adminClubs")
      .then((result) => setClubs(result.clubs))
      .catch(() => setError(true));
  }, []);

  const toggle = async (club: CloudClub) => {
    setPending(club.ownerId);
    try {
      const { club: next } = await callCloud<{ club: CloudClub }>("adminSetPremium", {
        ownerId: club.ownerId,
        premium: !club.premium,
      });
      setClubs((list) => list?.map((c) => (c.ownerId === next.ownerId ? next : c)) ?? null);
      toast(next.premium ? t("admin.enabled") : t("admin.disabled"));
    } catch {
      toast(t("admin.saveFailed"));
    } finally {
      setPending(null);
    }
  };

  if (error) return <p className="pad-safe px-4 py-8 text-center text-sm text-muted">{t("admin.loadFailed")}</p>;
  if (!clubs) return <p className="pad-safe px-4 py-8 text-center text-sm text-muted">{t("admin.loading")}</p>;

  const q = query.trim().toLowerCase();
  const shown = q
    ? clubs.filter((c) =>
        [c.clubName, c.ownerName, c.username, String(c.ownerId)].some((v) => v?.toLowerCase().includes(q)),
      )
    : clubs;

  return (
    <div className="pad-safe space-y-3 px-4 pb-5">
      <div className="grid grid-cols-3 gap-2">
        <Stat label={t("admin.clubs")} value={String(clubs.length)} />
        <Stat label={t("sheet.premium")} value={String(clubs.filter((c) => c.premium).length)} />
        <Stat label={t("admin.requests")} value={String(clubs.filter((c) => c.premiumRequested).length)} />
      </div>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t("admin.search")}
        aria-label={t("admin.searchLabel")}
        className="h-11 w-full rounded-full bg-elev px-4 text-base text-fg outline-none placeholder:text-muted/70"
      />
      {shown.length === 0 ? <p className="py-6 text-center text-sm text-muted">{t("admin.notFound")}</p> : null}
      <ul className="space-y-2">
        {shown.map((club) => (
          <li key={club.ownerId} className="flex items-center gap-3 rounded-3xl bg-elev px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 truncate text-base font-semibold">
                <span className="truncate">{club.clubName || t("admin.notSetUp")}</span>
                {club.premiumRequested ? (
                  <span className="shrink-0 rounded-full bg-op px-2 py-0.5 text-xs font-semibold text-on-op">{t("admin.request")}</span>
                ) : null}
              </p>
              <p className="truncate text-sm text-muted">
                {club.ownerName || "—"}
                {club.username ? ` · @${club.username}` : ""}
              </p>
              <p className="text-xs text-muted tabular-nums">
                {t("admin.units", { n: club.tableCount })} · {formatWhen(club.lastSeen * 1000)}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={club.premium}
              aria-label={`${club.clubName || club.ownerName} Premium`}
              disabled={pending === club.ownerId}
              onClick={() => toggle(club)}
              className={cn(
                "flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors disabled:opacity-50",
                club.premium ? "bg-op" : "bg-fn",
              )}
            >
              <span
                className={cn(
                  "size-6 rounded-full shadow transition-transform",
                  club.premium ? "translate-x-5 bg-on-op" : "translate-x-0 bg-fg",
                )}
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HelpSheet() {
  const t = useT();
  const business = useClub((s) => s.settings.business);
  const guideVars = { units: t(`units.${business}`), free: FREE_TABLE_LIMIT };
  const replay = () => {
    useClub.getState().patchSettings({ tourDone: false });
    useClub.setState({ sheets: [] });
  };
  return (
    <div className="pad-safe space-y-3 px-4 pb-5">
      <img src={guideTun} alt="" className="only-tun mx-auto aspect-[4/3] w-full max-w-60 rounded-3xl object-cover" />
      <img src={guideKun} alt="" className="only-kun mx-auto aspect-[4/3] w-full max-w-60 rounded-3xl object-cover" />
      <button
        type="button"
        className="key h-12 w-full rounded-full bg-op text-base font-semibold text-on-op"
        onClick={replay}
      >
        {t("help.replay")}
      </button>
      <Group>
        {GUIDE.map(({ target }) => (
          <div key={target} className="ios-row pl-4">
            <div className="ios-row-body py-3 pr-4">
              <p className="text-base font-semibold text-op-ink">{t(`guide.${target}.title`, guideVars)}</p>
              <p className="mt-0.5 text-sm text-pretty text-muted">{t(`guide.${target}.text`, guideVars)}</p>
            </div>
          </div>
        ))}
      </Group>
    </div>
  );
}

function TransferSheet({ sessionId }: { sessionId: string }) {
  const t = useT();
  const session = useSession(sessionId);
  const sessions = useClub((s) => s.sessions);
  const tableCount = useClub((s) => s.settings.tableCount);
  const [pick, setPick] = useState<number | null>(null);
  if (!session) return <Missing />;
  return (
    <div className="pad-safe px-4 pb-4">
      <p className="mb-3 text-sm text-muted">
        {session.kind === "walkin" ? t("transfer.walkin") : t("transfer.table")}
      </p>
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: tableCount }, (_, i) => i + 1).map((n) => {
          const busy = sessions.some((s) => s.kind === "table" && s.table === n);
          const current = session.kind === "table" && session.table === n;
          return (
            <button
              key={n}
              type="button"
              disabled={busy}
              onClick={() => setPick(n)}
              className={cn(
                "key aspect-square rounded-full text-xl",
                current && "bg-fg text-bg",
                !current && pick === n && "bg-op-tint text-op-ink key-sel",
                !current && pick !== n && "bg-key text-fg",
              )}
            >
              {current ? t("transfer.current") : busy ? t("transfer.busy") : n}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        disabled={pick === null}
        className="key mt-4 h-12 w-full rounded-full bg-op text-base font-semibold text-on-op disabled:opacity-40"
        onClick={() => pick !== null && useClub.getState().transferTo(sessionId, pick)}
      >
        {t("transfer.go")}
      </button>
    </div>
  );
}

function WalkinSheet() {
  const t = useT();
  const now = useNow();
  const sessions = useClub((s) => s.sessions.filter((s) => s.kind === "walkin"));
  const roundUp = useClub((s) => s.settings.roundUp);
  const all = useClub((s) => s.sessions);
  const count = all.filter((s) => s.kind === "walkin").length;
  const label = usePlaceLabel();
  return (
    <div className="pad-safe px-4 pb-4">
      <ul className="divide-y divide-line">
        {sessions.map((session) => {
          const q = quote(session, now, roundUp);
          return (
            <li key={session.id} className="flex items-center justify-between gap-3 py-3">
              <button
                type="button"
                className="min-w-0 flex-1 text-left"
                onClick={() => {
                  useClub.getState().focusSession(session.id);
                  useClub.getState().popSheet();
                }}
              >
                <span className="block text-base font-medium">{label(session, count)}</span>
                <span className="block text-sm tabular-nums text-muted">{formatSom(q.total)}</span>
              </button>
              <button
                type="button"
                className="key rounded-full bg-op px-4 py-2 text-sm font-semibold text-on-op"
                onClick={() => {
                  useClub.getState().focusSession(session.id);
                  useClub.getState().pushSheet({ kind: "close", sessionId: session.id });
                }}
              >
                {t("walkins.bill")}
              </button>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        className="key mt-4 h-12 w-full rounded-full bg-elev text-base font-semibold text-fg"
        onClick={() => useClub.getState().createWalkin()}
      >
        {t("walkin.new")}
      </button>
    </div>
  );
}

function MoneyLine({
  label,
  detail,
  amount,
  negative,
}: {
  label: string;
  detail?: string;
  amount: number;
  negative?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2">
      <div className="min-w-0">
        <p className="text-base">{label}</p>
        {detail ? <p className="text-sm text-muted">{detail}</p> : null}
      </div>
      <p className="shrink-0 text-base tabular-nums">
        {negative ? `−${formatSom(amount)}` : formatSom(amount)}
      </p>
    </div>
  );
}

function Missing() {
  const t = useT();
  return <p className="px-4 pb-6 text-center text-sm text-muted">{t("missing")}</p>;
}
