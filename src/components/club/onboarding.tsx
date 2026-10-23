import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { OrdeWordmark } from "@/components/club/logo";
import { Stepper } from "@/components/club/sheets";
import { cn } from "@/lib/cn";
import { FREE_TABLE_LIMIT, MAX_TABLES, SAMPLE_MENU, tableLimit } from "@/lib/club/logic";
import { GUIDE } from "@/lib/club/guide";
import { useClub } from "@/lib/club/store";

type Step = "welcome" | "guide" | "setup";
const STEPS: Step[] = ["welcome", "guide", "setup"];

// Optional artwork per step, one file per mode (public/onboarding/<step>-tun.webp / -kun.webp,
// prompts in docs/brand/gemini-prompts.md). Leave null until the files exist —
// the screens are complete without them.
const ART: Record<Step, { tun: string; kun: string } | null> = {
  welcome: null,
  guide: null,
  setup: null,
};

function telegramFirstName() {
  if (typeof window === "undefined") return null;
  const tg = (window as { Telegram?: { WebApp?: { initDataUnsafe?: { user?: { first_name?: string } } } } })
    .Telegram?.WebApp;
  return tg?.initDataUnsafe?.user?.first_name ?? null;
}

export function Onboarding() {
  const [step, setStep] = useState<Step>("welcome");
  const index = STEPS.indexOf(step);
  const back = index > 0 ? () => setStep(STEPS[index - 1]) : null;

  return (
    <main className="mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-bg text-fg">
      <header className="flex h-16 shrink-0 items-center justify-between px-4">
        {back ? (
          <button
            type="button"
            onClick={back}
            aria-label="Orqaga"
            className="key flex size-11 items-center justify-center rounded-full bg-key text-fg"
          >
            <ChevronLeft className="size-5" />
          </button>
        ) : (
          <span className="size-11" />
        )}
        <div className="flex gap-1.5" aria-hidden="true">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={cn("h-1.5 rounded-full transition-all", i === index ? "w-6 bg-op" : "w-1.5 bg-line")}
            />
          ))}
        </div>
        <span className="size-11" />
      </header>

      {step === "welcome" ? <Welcome onNext={() => setStep("guide")} /> : null}
      {step === "guide" ? <Guide onNext={() => setStep("setup")} /> : null}
      {step === "setup" ? <Setup /> : null}
    </main>
  );
}

function Art({ step }: { step: Step }) {
  const art = ART[step];
  if (!art) return null;
  const cls = "mx-auto aspect-[4/3] w-full max-w-80 rounded-3xl object-cover";
  return (
    <>
      <img src={art.tun} alt="" className={cn(cls, "only-tun")} />
      <img src={art.kun} alt="" className={cn(cls, "only-kun")} />
    </>
  );
}

function PrimaryButton({ children, onClick }: { children: string; onClick: () => void }) {
  return (
    <div className="pad-safe shrink-0 px-4 pt-3">
      <button
        type="button"
        onClick={onClick}
        className="key h-14 w-full rounded-full bg-op text-base font-semibold text-on-op"
      >
        {children}
      </button>
    </div>
  );
}

function Welcome({ onNext }: { onNext: () => void }) {
  const name = telegramFirstName();
  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
        <Art step="welcome" />
        <KeypadArt />
        <div className="flex flex-col items-center gap-3">
          <OrdeWordmark className="h-12 text-fg" />
          <p className="text-base text-balance text-muted">
            {name ? `Salom, ${name}! ` : ""}Bilyard klub kassasi — vaqt, bar va hisob bitta joyda.
          </p>
        </div>
      </div>
      <PrimaryButton onClick={onNext}>Boshlash</PrimaryButton>
    </>
  );
}

// The keypad in miniature: function row, a running table (ring), the selected one (ball), actions in orange.
function KeypadArt() {
  const cell = (tone: string, extra = "") => <span className={cn("key size-11 rounded-full", tone, extra)} />;
  return (
    <div className="grid grid-cols-4 gap-2.5" aria-hidden="true">
      {cell("bg-fn")}
      {cell("bg-fn")}
      {cell("bg-fn")}
      {cell("bg-op")}
      {cell("bg-key")}
      {cell("bg-key", "key-live")}
      {cell("bg-key")}
      {cell("bg-op")}
      {cell("bg-key")}
      {cell("bg-key")}
      {cell("bg-fg")}
      {cell("bg-op")}
    </div>
  );
}

function Guide({ onNext }: { onNext: () => void }) {
  return (
    <>
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4">
        <Art step="guide" />
        <h1 className="px-1 pb-4 text-2xl font-semibold">Qanday ishlaydi</h1>
        <ul className="space-y-2">
          {GUIDE.map(([key, text]) => (
            <li key={key} className="flex items-center gap-3 rounded-3xl bg-elev px-4 py-3">
              <span className="min-w-16 shrink-0 text-sm font-semibold text-op-ink">{key}</span>
              <span className="text-sm text-pretty">{text}</span>
            </li>
          ))}
        </ul>
      </div>
      <PrimaryButton onClick={onNext}>Tushunarli</PrimaryButton>
    </>
  );
}

function Setup() {
  const settings = useClub((s) => s.settings);
  const limit = tableLimit(settings);
  const [clubName, setClubName] = useState("");
  const [tableCount, setTableCount] = useState(Math.min(settings.tableCount, limit));
  const [rate, setRate] = useState(settings.rate);
  const [vipRate, setVipRate] = useState(settings.vipRate);
  const [sampleMenu, setSampleMenu] = useState(false);

  const finish = () =>
    useClub.getState().completeSetup({ clubName, tableCount, rate, vipRate, sampleMenu });

  return (
    <>
      <div className="no-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-2">
        <Art step="setup" />
        <h1 className="px-1 text-2xl font-semibold">Klubingiz</h1>
        <div className="overflow-hidden rounded-3xl bg-elev">
          <label className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="text-sm text-muted">Nomi</span>
            <input
              value={clubName}
              maxLength={32}
              aria-label="Klub nomi"
              placeholder="Bilyard klub"
              onChange={(event) => setClubName(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-right text-base text-fg outline-none placeholder:text-muted/60"
            />
          </label>
        </div>
        <div className="rounded-3xl bg-elev px-4 py-4">
          <Stepper label="Stollar" value={tableCount} min={1} max={limit} step={1} onChange={setTableCount} />
          {!settings.premium ? (
            <p className="mt-2 text-sm text-muted">
              Bepul: {FREE_TABLE_LIMIT} ta. Premium: {MAX_TABLES} tagacha.
            </p>
          ) : null}
        </div>
        <div className="space-y-4 rounded-3xl bg-elev px-4 py-4">
          <Stepper label="Soat narxi" value={rate} min={5000} max={500000} step={5000} onChange={setRate} />
          <Stepper label="VIP soat" value={vipRate} min={5000} max={800000} step={5000} onChange={setVipRate} />
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={sampleMenu}
          onClick={() => setSampleMenu(!sampleMenu)}
          className="key flex w-full items-center justify-between gap-3 rounded-3xl bg-elev px-4 py-4 text-left"
        >
          <span>
            <span className="block text-base">Namuna menyu</span>
            <span className="text-sm text-muted">{SAMPLE_MENU.length} ta ichimlik va gazak, keyin o'zgartirasiz</span>
          </span>
          <span
            className={cn(
              "flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors",
              sampleMenu ? "bg-op" : "bg-fn",
            )}
          >
            <span
              className={cn(
                "size-6 rounded-full bg-fg shadow transition-transform",
                sampleMenu ? "translate-x-5 bg-on-op" : "translate-x-0",
              )}
            />
          </span>
        </button>
      </div>
      <PrimaryButton onClick={finish}>Tayyor</PrimaryButton>
    </>
  );
}
