import { useEffect, useState } from "react";
import { ChevronLeft, Crown, Minus, Moon, Plus, ShieldCheck, Sun, SunMoon, Trash2 } from "lucide-react";
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
  sessionLabel,
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
import { BUSINESSES } from "@/lib/club/business";
import { callCloud, cloudAvailable, type CloudClub } from "@/lib/club/cloud";
import { useT } from "@/lib/i18n/use-t";
import { GUIDE } from "@/lib/club/guide";
import { useClub, type Sheet } from "@/lib/club/store";

export function SheetHost() {
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
        className="absolute inset-0 bg-bg/60"
        aria-label="Orqaga"
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

function sheetTitle(sheet: Sheet, sessions: Session[]) {
  const session = "sessionId" in sheet ? sessions.find((s) => s.id === sheet.sessionId) : undefined;
  const walkins = sessions.filter((s) => s.kind === "walkin").length;
  const place = session ? sessionLabel(session, walkins) : "";
  switch (sheet.kind) {
    case "bar":
      return { title: "Bar", sub: place || "Joy tanlang" };
    case "discount":
      return { title: "Chegirma", sub: place };
    case "close":
      return { title: "Hisob", sub: place };
    case "split":
      return { title: "Aralash to'lov", sub: place };
    case "void":
      return { title: "Bekor qilish", sub: place };
    case "receipt":
      return { title: "Chek", sub: "" };
    case "history":
      return { title: "Tarix", sub: "" };
    case "bill":
      return { title: "Chek", sub: "" };
    case "settings":
      return { title: "Klub", sub: "" };
    case "menu":
      return { title: "Menyu", sub: "" };
    case "help":
      return { title: "Qanday ishlaydi", sub: "" };
    case "transfer":
      return { title: "Ko'chirish", sub: place };
    case "walkins":
      return { title: "Tashqi", sub: "Stolsiz mijozlar" };
    case "premium":
      return { title: "Premium", sub: "" };
    case "admin":
      return { title: "Admin panel", sub: "Klublar va Premium" };
    case "unit":
      return { title: `#${sheet.n}`, sub: "" };
    case "product":
      return { title: sheet.itemId ? "Mahsulot" : "Yangi mahsulot", sub: "" };
    default:
      return { title: "", sub: "" };
  }
}

function SheetHeader({ sheet, stacked }: { sheet: Sheet; stacked: boolean }) {
  const sessions = useClub((s) => s.sessions);
  const pop = useClub((s) => s.popSheet);
  const { title, sub } = sheetTitle(sheet, sessions);
  return (
    <div className="shrink-0 px-4 pb-2 pt-3">
      <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-line" />
      <div className="flex items-center">
        {stacked ? (
          <button
            type="button"
            onClick={pop}
            className="key flex size-9 items-center justify-center rounded-full bg-elev text-fg"
            aria-label="Orqaga"
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
                on ? "bg-op text-on-op" : "bg-elev text-fg",
              )}
            >
              <span className="block text-sm font-semibold">{sessionLabel(session, walkins)}</span>
              <span className={cn("block text-xs tabular-nums", on ? "text-fg/80" : "text-muted")}>
                {session.kind === "table" ? formatClock(quote(session, now, roundUp).elapsed) : "bar"}
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
          + Tashqi
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
              category === item.id ? "bg-fg text-bg" : "bg-elev text-fg",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {sessions.length === 0 ? (
        <p className="px-4 pb-4 text-sm text-muted">Avval stol yoki tashqi oching.</p>
      ) : null}

      {menu.length === 0 ? (
        <div className="px-4 pb-4">
          <button
            type="button"
            className="key flex h-12 w-full items-center justify-center gap-2 rounded-full bg-op text-base font-semibold text-on-op"
            onClick={() => useClub.getState().pushSheet({ kind: "product", itemId: null })}
          >
            <Plus className="size-5" />
            Mahsulot qo'shish
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
                    aria-label={`${item.name}ni ayirish`}
                    onClick={() => useClub.getState().decMenu(item.id)}
                  >
                    −
                  </button>
                  <span className="w-5 text-center font-semibold tabular-nums">{qty}</span>
                  <button
                    type="button"
                    className="key flex size-9 items-center justify-center rounded-full bg-op text-lg text-on-op"
                    aria-label={`${item.name} qo'shish`}
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
            ? `Tayyor · ${sessionLabel(focused, walkins)} · ${formatSom(cart.total)}`
            : "Tayyor"}
        </button>
      </div>
    </div>
  );
}

const DISCOUNTS = [0, 5, 10, 15, 20, 30, 50, 100];

function DiscountSheet({ sessionId }: { sessionId: string }) {
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
              pct === value ? "bg-op text-on-op" : "bg-elev text-fg",
            )}
          >
            {value === 0 ? "Yo'q" : value === 100 ? "Bepul" : `${value}%`}
          </button>
        ))}
      </div>
      <p className="mt-4 text-center text-sm text-muted">
        Yangi jami <span className="text-base font-semibold text-fg tabular-nums">{formatSom(preview.total)}</span>
      </p>
      <button
        type="button"
        className="key mt-4 h-12 w-full rounded-full bg-op text-base font-semibold text-on-op"
        onClick={() => useClub.getState().setDiscount(sessionId, pct)}
      >
        Qo'llash
      </button>
    </div>
  );
}

function CloseSheet({ sessionId }: { sessionId: string }) {
  const session = useSession(sessionId);
  const now = useNow();
  const roundUp = useClub((s) => s.settings.roundUp);
  if (!session) return <Missing />;
  const q = quote(session, now, roundUp);
  return (
    <div className="pad-safe px-4 pb-4">
      <p className="text-center text-sm text-muted">
        {session.kind === "table"
          ? `${formatClock(q.elapsed)} · ${q.minutes} daq`
          : "Faqat bar"}
        {session.pauseStartedAt ? " · pauza" : ""}
      </p>
      <p className="mt-1 text-center text-5xl font-light tabular-nums text-fg">{formatSom(q.total)}</p>
      <div className="mt-3 divide-y divide-line">
        {session.kind === "table" ? (
          <MoneyLine
            label="Vaqt"
            detail={`${q.minutes} daq × ${formatSom(session.ratePerHour)}/soat${session.vip ? " · VIP" : ""}`}
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
          <MoneyLine label={`Chegirma ${session.discountPct}%`} amount={q.discountAmt} negative />
        ) : null}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          className="key h-14 rounded-full bg-op text-base font-semibold text-on-op"
          onClick={() => useClub.getState().closeBill(sessionId, q.total, 0)}
        >
          Naqd
        </button>
        <button
          type="button"
          className="key h-14 rounded-full bg-fn text-base font-semibold text-fg"
          onClick={() => useClub.getState().closeBill(sessionId, 0, q.total)}
        >
          Karta
        </button>
      </div>
      <button
        type="button"
        className="key mt-3 h-12 w-full rounded-full bg-elev text-base font-medium text-fg"
        onClick={() => useClub.getState().pushSheet({ kind: "split", sessionId })}
      >
        Aralash
      </button>
      <button
        type="button"
        className="mt-3 w-full py-3 text-sm text-muted"
        onClick={() => useClub.getState().pushSheet({ kind: "void", sessionId })}
      >
        Hisobni bekor qilish
      </button>
    </div>
  );
}

function SplitSheet({ sessionId }: { sessionId: string }) {
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
      <p className="text-center text-sm text-muted">Jami {formatSom(total)}</p>
      <input
        inputMode="numeric"
        value={raw ? formatSom(cash) : ""}
        placeholder="Naqd summa"
        aria-label="Naqd summa"
        onChange={(event) => setRaw(event.target.value.replace(/\D/g, "").slice(0, 7))}
        className="mt-3 w-full rounded-2xl bg-bg px-4 py-4 text-2xl text-fg outline-none tabular-nums"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="key rounded-full bg-elev px-4 py-2 text-sm text-fg"
          onClick={() => setRaw(String(Math.floor(total / 2)))}
        >
          Yarmi
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
        Kartaga <span className="font-semibold text-fg tabular-nums">{formatSom(Math.max(0, card))}</span>
      </p>
      {!valid && cash > 0 ? (
        <p className="mt-1 text-center text-sm text-op-ink">Naqd jami ichida bo'lsin</p>
      ) : null}
      <button
        type="button"
        disabled={!valid}
        className="key mt-4 h-12 w-full rounded-full bg-op text-base font-semibold text-on-op disabled:opacity-40"
        onClick={() => useClub.getState().closeBill(sessionId, cash, total - cash)}
      >
        Yopish
      </button>
    </div>
  );
}

function VoidSheet({ sessionId }: { sessionId: string }) {
  return (
    <div className="pad-safe px-4 pb-5">
      <p className="text-center text-base text-pretty">
        Hisob yopiladi, lekin pul tushumga kirmaydi. Tasodifiy ochilgan stol uchun.
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          className="key h-12 rounded-full bg-elev text-base font-medium text-fg"
          onClick={() => useClub.getState().popSheet()}
        >
          Qoldirish
        </button>
        <button
          type="button"
          className="key h-12 rounded-full bg-op text-base font-semibold text-on-op"
          onClick={() => useClub.getState().voidBill(sessionId)}
        >
          Bekor qilish
        </button>
      </div>
    </div>
  );
}

function ReceiptSheet({ billId }: { billId: string }) {
  const bill = useClub((s) => s.bills.find((item) => item.id === billId) ?? null);
  const clubName = useClub((s) => s.settings.clubName);
  if (!bill) return <Missing />;
  return (
    <div className="pad-safe px-4 pb-4">
      <div className="rounded-3xl bg-elev px-4 py-5">
        <p className="text-center text-sm font-semibold tracking-widest text-muted">
          {clubName.toUpperCase()}
        </p>
        <p className="mt-1 text-center text-lg font-semibold">{bill.label}</p>
        <p className="text-center text-sm text-muted">{formatWhen(bill.closedAt)}</p>
        {bill.voided ? (
          <p className="mt-2 text-center text-sm font-semibold tracking-widest text-op-ink">BEKOR</p>
        ) : null}
        <div className="mt-4 divide-y divide-line">
          {bill.kind === "table" ? (
            <MoneyLine
              label="Vaqt"
              detail={`${bill.billedMinutes} daq × ${formatSom(bill.ratePerHour)}/soat`}
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
            <MoneyLine label={`Chegirma ${bill.discountPct}%`} amount={bill.discountAmt} negative />
          ) : null}
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-sm text-muted">Jami</span>
          <span className="text-2xl font-medium tabular-nums">{formatSom(bill.total)}</span>
        </div>
        {!bill.voided ? (
          <p className="mt-2 text-right text-sm text-muted">
            {bill.card > 0 && bill.cash > 0
              ? `Naqd ${formatSom(bill.cash)} · karta ${formatSom(bill.card)}`
              : bill.card > 0
                ? "Karta"
                : "Naqd"}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        className="key mt-4 h-12 w-full rounded-full bg-op text-base font-semibold text-on-op"
        onClick={() => useClub.getState().popSheet()}
      >
        Tayyor
      </button>
    </div>
  );
}

function HistorySheet() {
  const bills = useClub((s) => s.bills);
  const now = useNow();
  const [todayOnly, setTodayOnly] = useState(true);
  const today = tashkentDay(now || Date.now());
  const shown = bills.filter((bill) => !todayOnly || tashkentDay(bill.closedAt) === today);
  const paid = shown.filter((bill) => !bill.voided);
  const revenue = paid.reduce((sum, bill) => sum + bill.total, 0);
  const cash = paid.reduce((sum, bill) => sum + bill.cash, 0);
  const card = paid.reduce((sum, bill) => sum + bill.card, 0);
  return (
    <div className="pad-safe px-4 pb-4">
      <div className="mb-4 grid grid-cols-2 gap-2 rounded-full bg-elev p-1">
        <button
          type="button"
          className={cn("key rounded-full py-2 text-sm", todayOnly ? "bg-op text-on-op" : "text-muted")}
          onClick={() => setTodayOnly(true)}
        >
          Bugun
        </button>
        <button
          type="button"
          className={cn("key rounded-full py-2 text-sm", !todayOnly ? "bg-op text-on-op" : "text-muted")}
          onClick={() => setTodayOnly(false)}
        >
          Hammasi
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Tushum" value={formatSom(revenue)} />
        <Stat label="Naqd" value={formatSom(cash)} />
        <Stat label="Karta" value={formatSom(card)} />
      </div>
      {shown.length === 0 ? (
        <p className="px-2 py-10 text-center text-sm text-muted">Hali yopilgan hisob yo'q.</p>
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
                    {bill.label}
                  </span>
                  <span className="block text-sm text-muted">
                    {formatWhen(bill.closedAt)}
                    {bill.voided ? " · bekor" : ""}
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
  const settings = useClub((s) => s.settings);
  const isAdmin = useClub((s) => s.cloud.isAdmin);
  const [name, setName] = useState(settings.clubName);
  const theme = settings.theme ?? "auto";
  return (
    <div className="pad-safe space-y-4 px-4 pb-5">
      {isAdmin ? (
        <button
          type="button"
          className="key flex h-12 w-full items-center justify-between rounded-full bg-op px-5 text-base font-semibold text-on-op"
          onClick={() => useClub.getState().pushSheet({ kind: "admin" })}
        >
          <span className="flex items-center gap-2">
            <ShieldCheck className="size-4" />
            Admin panel
          </span>
          <ChevronLeft className="size-4 rotate-180" />
        </button>
      ) : null}
      <div className="rounded-3xl bg-elev px-4 py-4">
        <p className="text-sm text-muted">Ko'rinish</p>
        <div className="mt-3 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Ko'rinish">
          {(
            [
              ["auto", "Avto", SunMoon],
              ["light", "Kun", Sun],
              ["dark", "Tun", Moon],
            ] as const satisfies readonly (readonly [ThemeMode, string, typeof Sun])[]
          ).map(([value, label, Icon]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={theme === value}
              className={cn(
                "key flex items-center justify-center gap-1.5 rounded-full py-2 text-sm",
                theme === value ? "bg-op text-on-op" : "bg-fn text-fg",
              )}
              onClick={() => useClub.getState().patchSettings({ theme: value })}
            >
              <Icon className="size-4" strokeWidth={1.75} />
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-hidden rounded-3xl bg-elev">
        <label className="flex items-center justify-between gap-3 px-4 py-3">
          <span className="text-sm text-muted">Nomi</span>
          <input
            value={name}
            maxLength={32}
            aria-label="Klub nomi"
            onChange={(event) => setName(event.target.value)}
            onBlur={() => useClub.getState().setClubName(name)}
            className="w-40 bg-transparent text-right text-base text-fg outline-none"
          />
        </label>
      </div>
      <div className="space-y-4 rounded-3xl bg-elev px-4 py-4">
        <Stepper
          label="Oddiy soat"
          value={settings.rate}
          min={5000}
          max={500000}
          step={5000}
          onChange={(rate) => useClub.getState().patchSettings({ rate })}
        />
        <Stepper
          label="VIP soat"
          value={settings.vipRate}
          min={5000}
          max={800000}
          step={5000}
          onChange={(vipRate) => useClub.getState().patchSettings({ vipRate })}
        />
        <p className="text-sm text-muted">Ochiq stollarga yangi narx qo'yilmaydi.</p>
      </div>
      <div className="rounded-3xl bg-elev px-4 py-4">
        <p className="text-sm text-muted">Vaqt yaxlitlash</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {(
            [
              [1, "1 daqiqa"],
              [15, "15 daqiqa"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={cn(
                "key rounded-full py-2 text-sm",
                settings.roundUp === value ? "bg-op text-on-op" : "bg-fn text-fg",
              )}
              onClick={() => useClub.getState().patchSettings({ roundUp: value })}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-3xl bg-elev px-4 py-4">
        <Stepper
          label="Stollar"
          value={settings.tableCount}
          min={1}
          max={MAX_TABLES}
          step={1}
          onChange={(count) => useClub.getState().setTableCount(count)}
        />
        {!settings.premium ? (
          <p className="mt-2 text-sm text-muted">Bepul: {FREE_TABLE_LIMIT} tagacha stol</p>
        ) : null}
        <p className="mt-4 text-sm text-muted">VIP stollar</p>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {Array.from({ length: settings.tableCount }, (_, i) => i + 1).map((n) => {
            const on = settings.vipTables.includes(n);
            return (
              <button
                key={n}
                type="button"
                aria-pressed={on}
                className={cn(
                  "key aspect-square rounded-full text-sm font-semibold",
                  on ? "bg-op text-on-op" : "bg-fn text-fg",
                )}
                onClick={() => useClub.getState().toggleVipTable(n)}
              >
                {n}
              </button>
            );
          })}
        </div>
      </div>
      <button
        type="button"
        className="key flex h-12 w-full items-center justify-between rounded-full bg-elev px-5 text-base text-fg"
        onClick={() => useClub.getState().pushSheet({ kind: "premium" })}
      >
        <span className="flex items-center gap-2">
          <Crown className="size-4 text-op-ink" />
          {settings.premium ? "Premium faol" : "Premium"}
        </span>
        <ChevronLeft className="size-4 rotate-180" />
      </button>
      <button
        type="button"
        className="key flex h-12 w-full items-center justify-between rounded-full bg-elev px-5 text-base text-fg"
        onClick={() => useClub.getState().pushSheet({ kind: "menu" })}
      >
        Menyu
        <ChevronLeft className="size-4 rotate-180" />
      </button>
      <button
        type="button"
        className="key flex h-12 w-full items-center justify-between rounded-full bg-elev px-5 text-base text-fg"
        onClick={() => useClub.getState().pushSheet({ kind: "help" })}
      >
        Qanday ishlaydi
        <ChevronLeft className="size-4 rotate-180" />
      </button>
      <BrandFooter />
    </div>
  );
}

function BrandFooter() {
  return (
    <div className="flex flex-col items-center gap-2 pt-4 pb-1">
      <OrdeWordmark className="h-7 text-fg" />
      <span className="text-xs text-muted">Bilyard klub kassasi</span>
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
  return (
    <div>
      <p className="text-sm text-muted">{label}</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <button
          type="button"
          className="key flex size-11 items-center justify-center rounded-full bg-key text-fg"
          aria-label={`${label} kamaytirish`}
          onClick={() => onChange(Math.max(min, value - step))}
        >
          <Minus className="size-4" />
        </button>
        <span className="text-lg font-medium tabular-nums">{formatSom(value)}</span>
        <button
          type="button"
          className="key flex size-11 items-center justify-center rounded-full bg-key text-fg"
          aria-label={`${label} oshirish`}
          onClick={() => onChange(Math.min(max, value + step))}
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}

function MenuSheet() {
  const menu = useClub((s) => s.menu);
  return (
    <div className="pad-safe space-y-3 px-4 pb-5">
      <button
        type="button"
        className="key flex h-12 w-full items-center justify-center gap-2 rounded-full bg-op text-base font-semibold text-on-op"
        onClick={() => useClub.getState().pushSheet({ kind: "product", itemId: null })}
      >
        <Plus className="size-5" />
        Mahsulot qo'shish
      </button>
      {menu.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">Menyu bo'sh</p>
      ) : (
        <ul className="overflow-hidden rounded-3xl bg-elev">
          {menu.map((item) => (
            <li key={item.id} className="border-b border-line last:border-b-0">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                onClick={() => useClub.getState().pushSheet({ kind: "product", itemId: item.id })}
              >
                <span className="min-w-0">
                  <span className="block truncate text-base">{item.name}</span>
                  <span className="text-sm text-muted">
                    {MENU_CATEGORIES.find((c) => c.id === item.category)?.label}
                  </span>
                </span>
                <span className="shrink-0 text-base tabular-nums">{formatSom(item.price)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProductSheet({ itemId }: { itemId: string | null }) {
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
      <div className="overflow-hidden rounded-3xl bg-elev">
        <label className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <span className="text-sm text-muted">Nomi</span>
          <input
            value={name}
            maxLength={40}
            autoFocus={!existing}
            aria-label="Mahsulot nomi"
            placeholder="Cola"
            onChange={(event) => setName(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-right text-base text-fg outline-none placeholder:text-muted/60"
          />
        </label>
        <label className="flex items-center justify-between gap-3 px-4 py-3">
          <span className="text-sm text-muted">Narxi</span>
          <input
            value={price ? formatSom(amount) : ""}
            inputMode="numeric"
            aria-label="Narxi"
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
              category === c.id ? "bg-op text-on-op" : "bg-fn text-fg",
            )}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={!valid}
        className="key h-12 w-full rounded-full bg-op text-base font-semibold text-on-op disabled:opacity-40"
        onClick={save}
      >
        Saqlash
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
          O'chirish
        </button>
      ) : null}
    </div>
  );
}

const PREMIUM_PERKS = [
  [`${MAX_TABLES} tagacha stol`, `Bepul tarifda ${FREE_TABLE_LIMIT} ta stol.`],
  ["VIP stollar va narxlar", "Har bir stol uchun alohida narx."],
] as const;

function PremiumSheet() {
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
        toast("So'rov yuborildi");
      } else if (status === "active") {
        toast("Premium faol");
      } else {
        toast("Premium ulash tez orada ochiladi");
      }
    } catch {
      toast("Yuborilmadi — internetni tekshiring");
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
        <p className="text-sm text-muted">{premium ? "Klubingizda Premium faol" : "Katta klublar uchun"}</p>
      </div>
      {PREMIUM_PERKS.map(([title, body]) => (
        <div key={title} className="rounded-3xl bg-elev px-4 py-3">
          <p className="text-base font-semibold">{title}</p>
          <p className="mt-1 text-sm text-muted">{body}</p>
        </div>
      ))}
      {premium ? null : online ? (
        <button
          type="button"
          disabled={busy || requested}
          className="key h-12 w-full rounded-full bg-op text-base font-semibold text-on-op disabled:opacity-50"
          onClick={request}
        >
          {requested ? "So'rov yuborilgan" : "Premium so'rash"}
        </button>
      ) : (
        <p className="pt-2 text-center text-sm text-muted">Orde botida «⭐ Premium» tugmasini bosing.</p>
      )}
    </div>
  );
}

// One unit's own settings: name, business type, rates, VIP. Unset fields follow the club.
function UnitSheet({ n }: { n: number }) {
  const t = useT();
  const settings = useClub((s) => s.settings);
  const unit = unitConfig(settings, n);
  const kind = unitKind(settings, n);
  const vip = settings.vipTables.includes(n);
  const set = (patch: UnitConfig) => useClub.getState().setUnit(n, patch);
  const custom = Object.keys(unit).length > 0;
  const placeholder = `${t(`unit.${kind}`)} ${n}`;

  return (
    <div className="pad-safe space-y-4 px-4 pb-5">
      <div className="overflow-hidden rounded-3xl bg-elev">
        <label className="flex items-center justify-between gap-3 px-4 py-3">
          <span className="text-sm text-muted">{t("unitSheet.name")}</span>
          <input
            value={unit.name ?? ""}
            maxLength={24}
            placeholder={placeholder}
            aria-label={t("unitSheet.name")}
            onChange={(event) => set({ name: event.target.value })}
            className="min-w-0 flex-1 bg-transparent text-right text-base text-fg outline-none placeholder:text-muted/60"
          />
        </label>
      </div>

      <div>
        <p className="px-1 pb-2 text-sm text-muted">{t("unitSheet.type")}</p>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          <button
            type="button"
            aria-pressed={!unit.kind}
            onClick={() => set({ kind: undefined })}
            className={cn("key shrink-0 rounded-full px-4 py-2 text-sm", !unit.kind ? "bg-op text-on-op" : "bg-fn text-fg")}
          >
            {t("unitSheet.clubType")}
          </button>
          {BUSINESSES.map((b) => (
            <button
              key={b.id}
              type="button"
              aria-pressed={unit.kind === b.id}
              onClick={() => set({ kind: b.id })}
              className={cn(
                "key shrink-0 rounded-full px-4 py-2 text-sm",
                unit.kind === b.id ? "bg-op text-on-op" : "bg-fn text-fg",
              )}
            >
              {b.emoji} {t(`biz.${b.id}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 rounded-3xl bg-elev px-4 py-4">
        <Stepper
          label={t("unitSheet.rate") + (unit.rate !== undefined ? ` · ${t("unitSheet.custom")}` : "")}
          value={unit.rate ?? settings.rate}
          min={0}
          max={2000000}
          step={5000}
          onChange={(rate) => set({ rate })}
        />
        <Stepper
          label={t("unitSheet.vipRate") + (unit.vipRate !== undefined ? ` · ${t("unitSheet.custom")}` : "")}
          value={unit.vipRate ?? settings.vipRate}
          min={0}
          max={2000000}
          step={5000}
          onChange={(vipRate) => set({ vipRate })}
        />
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={vip}
        onClick={() => useClub.getState().toggleVipTable(n)}
        className="key flex w-full items-center justify-between rounded-3xl bg-elev px-4 py-4 text-left"
      >
        <span className="text-base">{t("unitSheet.vip")}</span>
        <span className={cn("flex h-7 w-12 items-center rounded-full p-0.5", vip ? "bg-op" : "bg-fn")}>
          <span className={cn("size-6 rounded-full shadow transition-transform", vip ? "translate-x-5 bg-on-op" : "bg-fg")} />
        </span>
      </button>

      {custom ? (
        <button
          type="button"
          className="key h-12 w-full rounded-full bg-elev text-base text-fg"
          onClick={() => useClub.getState().setUnit(n, null)}
        >
          {t("unitSheet.reset")}
        </button>
      ) : null}
    </div>
  );
}

function AdminSheet() {
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
      toast(next.premium ? "Premium yoqildi" : "Premium o'chirildi");
    } catch {
      toast("Saqlanmadi");
    } finally {
      setPending(null);
    }
  };

  if (error) return <p className="pad-safe px-4 py-8 text-center text-sm text-muted">Ro'yxat yuklanmadi.</p>;
  if (!clubs) return <p className="pad-safe px-4 py-8 text-center text-sm text-muted">Yuklanmoqda…</p>;

  const q = query.trim().toLowerCase();
  const shown = q
    ? clubs.filter((c) =>
        [c.clubName, c.ownerName, c.username, String(c.ownerId)].some((v) => v?.toLowerCase().includes(q)),
      )
    : clubs;

  return (
    <div className="pad-safe space-y-3 px-4 pb-5">
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Klublar" value={String(clubs.length)} />
        <Stat label="Premium" value={String(clubs.filter((c) => c.premium).length)} />
        <Stat label="So'rovlar" value={String(clubs.filter((c) => c.premiumRequested).length)} />
      </div>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Qidirish: klub, ism, @username, id"
        aria-label="Qidirish"
        className="h-11 w-full rounded-full bg-elev px-4 text-base text-fg outline-none placeholder:text-muted/70"
      />
      {shown.length === 0 ? <p className="py-6 text-center text-sm text-muted">Hech narsa topilmadi</p> : null}
      <ul className="space-y-2">
        {shown.map((club) => (
          <li key={club.ownerId} className="flex items-center gap-3 rounded-3xl bg-elev px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 truncate text-base font-semibold">
                <span className="truncate">{club.clubName || "Sozlanmagan"}</span>
                {club.premiumRequested ? (
                  <span className="shrink-0 rounded-full bg-op px-2 py-0.5 text-xs font-semibold text-on-op">So'rov</span>
                ) : null}
              </p>
              <p className="truncate text-sm text-muted">
                {club.ownerName || "—"}
                {club.username ? ` · @${club.username}` : ""}
              </p>
              <p className="text-xs text-muted tabular-nums">
                {club.tableCount} stol · {formatWhen(club.lastSeen * 1000)}
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
        Ko'rsatmani qayta ko'rish
      </button>
      {GUIDE.map(({ title, text }) => (
        <div key={title} className="rounded-3xl bg-elev px-4 py-3">
          <p className="text-sm font-semibold text-op-ink">{title}</p>
          <p className="mt-1 text-sm text-pretty text-fg">{text}</p>
        </div>
      ))}
    </div>
  );
}

function TransferSheet({ sessionId }: { sessionId: string }) {
  const session = useSession(sessionId);
  const sessions = useClub((s) => s.sessions);
  const tableCount = useClub((s) => s.settings.tableCount);
  const [pick, setPick] = useState<number | null>(null);
  if (!session) return <Missing />;
  return (
    <div className="pad-safe px-4 pb-4">
      <p className="mb-3 text-sm text-muted">
        {session.kind === "walkin"
          ? "Bo'sh stolga o'tkazilsa, vaqt hozirdan boshlanadi. Bar buyurtmalari saqlanadi."
          : "Hisob boshqa bo'sh stolga o'tadi. Narx o'zgarmaydi."}
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
                !current && pick === n && "bg-op text-on-op",
                !current && pick !== n && "bg-key text-fg",
              )}
            >
              {current ? "shu" : busy ? "band" : n}
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
        Ko'chirish
      </button>
    </div>
  );
}

function WalkinSheet() {
  const now = useNow();
  const sessions = useClub((s) => s.sessions.filter((s) => s.kind === "walkin"));
  const roundUp = useClub((s) => s.settings.roundUp);
  const all = useClub((s) => s.sessions);
  const count = all.filter((s) => s.kind === "walkin").length;
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
                <span className="block text-base font-medium">{sessionLabel(session, count)}</span>
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
                Hisob
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
        + Yangi tashqi
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
  return <p className="px-4 pb-6 text-center text-sm text-muted">Bu hisob allaqachon yopilgan.</p>;
}
