import { useEffect, useState } from "react";
import { ChevronLeft, Minus, Plus } from "lucide-react";
import { useNow } from "@/components/club/now";
import { cn } from "@/lib/cn";
import {
  CATEGORIES,
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
} from "@/lib/club/logic";
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
      return { title: "Menyu", sub: "Ochiq hisobga ta'sir qilmaydi" };
    case "help":
      return { title: "Qanday ishlaydi", sub: "" };
    case "transfer":
      return { title: "Ko'chirish", sub: place };
    case "walkins":
      return { title: "Tashqi", sub: "Stolsiz mijozlar" };
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
                on ? "bg-op text-fg" : "bg-elev text-fg",
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
        <p className="px-4 pb-4 text-sm text-muted">
          Avval stol raqamini bosing yoki tashqi mijoz oching. Buyurtma shu joyga yoziladi.
        </p>
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
                    className="key flex size-9 items-center justify-center rounded-full bg-op text-lg text-fg"
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
          className="key h-12 w-full rounded-full bg-op text-base font-semibold text-fg"
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
              pct === value ? "bg-op text-fg" : "bg-elev text-fg",
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
        className="key mt-4 h-12 w-full rounded-full bg-op text-base font-semibold text-fg"
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
          className="key h-14 rounded-full bg-op text-base font-semibold text-fg"
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
        <p className="mt-1 text-center text-sm text-op">Naqd jami ichida bo'lsin</p>
      ) : null}
      <button
        type="button"
        disabled={!valid}
        className="key mt-4 h-12 w-full rounded-full bg-op text-base font-semibold text-fg disabled:opacity-40"
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
          className="key h-12 rounded-full bg-op text-base font-semibold text-fg"
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
          <p className="mt-2 text-center text-sm font-semibold tracking-widest text-op">BEKOR</p>
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
        className="key mt-4 h-12 w-full rounded-full bg-op text-base font-semibold text-fg"
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
          className={cn("key rounded-full py-2 text-sm", todayOnly ? "bg-op text-fg" : "text-muted")}
          onClick={() => setTodayOnly(true)}
        >
          Bugun
        </button>
        <button
          type="button"
          className={cn("key rounded-full py-2 text-sm", !todayOnly ? "bg-op text-fg" : "text-muted")}
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
  const [name, setName] = useState(settings.clubName);
  return (
    <div className="pad-safe space-y-4 px-4 pb-5">
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
                settings.roundUp === value ? "bg-op text-fg" : "bg-key text-fg",
              )}
              onClick={() => useClub.getState().patchSettings({ roundUp: value })}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-3xl bg-elev px-4 py-4">
        <p className="text-sm text-muted">Stollar</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {([6, 8, 9] as const).map((count) => (
            <button
              key={count}
              type="button"
              className={cn(
                "key rounded-full py-2 text-sm",
                settings.tableCount === count ? "bg-op text-fg" : "bg-key text-fg",
              )}
              onClick={() => useClub.getState().setTableCount(count)}
            >
              {count}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">VIP stollar — yangi hisob VIP narxda ochiladi</p>
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
                  on ? "bg-op text-fg" : "bg-key text-fg",
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
        onClick={() => useClub.getState().pushSheet({ kind: "menu" })}
      >
        Menyu narxlari
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
    </div>
  );
}

function Stepper({
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
    <div className="pad-safe px-4 pb-4">
      <ul className="divide-y divide-line">
        {menu.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3 py-3">
            <span>
              <span className="block text-base">{item.name}</span>
              <span className="text-sm tabular-nums text-muted">{formatSom(item.price)}</span>
            </span>
            <span className="flex items-center gap-2">
              <button
                type="button"
                className="key flex size-10 items-center justify-center rounded-full bg-elev text-fg"
                aria-label={`${item.name} narxini kamaytirish`}
                onClick={() => useClub.getState().setMenuPrice(item.id, item.price - 1000)}
              >
                <Minus className="size-4" />
              </button>
              <button
                type="button"
                className="key flex size-10 items-center justify-center rounded-full bg-elev text-fg"
                aria-label={`${item.name} narxini oshirish`}
                onClick={() => useClub.getState().setMenuPrice(item.id, item.price + 1000)}
              >
                <Plus className="size-4" />
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const HELP = [
  ["1–9", "Bo'sh stol ochiladi, vaqt yura boshlaydi."],
  ["Yana", "Ishlayotgan stolni bossangiz hisob ochiladi — naqd, karta yoki aralash."],
  ["0", "Tashqi mijoz. Vaqt yozilmaydi, faqat bar."],
  ["BAR", "Ichimlikni ochiq stolga yoki yangi tashqiga biriktirish."],
  ["%", "Chegirma. QO'SH — qo'shimcha summa. AYIR — oxirgi buyurtma."],
  ["PAUZA", "Vaqtni to'xtatadi. VIP — narxni almashtiradi. KO'CH — boshqa stol."],
  ["AC", "Ko'rinishni tozalaydi. Ochiq hisoblar o'chmaydi."],
];

function HelpSheet() {
  return (
    <div className="pad-safe space-y-3 px-4 pb-5">
      {HELP.map(([title, body]) => (
        <div key={title} className="rounded-3xl bg-elev px-4 py-3">
          <p className="text-sm font-semibold text-op">{title}</p>
          <p className="mt-1 text-sm text-pretty text-fg">{body}</p>
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
                !current && pick === n && "bg-op text-fg",
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
        className="key mt-4 h-12 w-full rounded-full bg-op text-base font-semibold text-fg disabled:opacity-40"
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
                className="key rounded-full bg-op px-4 py-2 text-sm font-semibold text-fg"
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
