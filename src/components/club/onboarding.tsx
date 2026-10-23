import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { OrdeWordmark } from "@/components/club/logo";
import { Stepper } from "@/components/club/sheets";
import { cn } from "@/lib/cn";
import { BUSINESSES, businessInfo } from "@/lib/club/business";
import { FREE_TABLE_LIMIT, MAX_TABLES, SAMPLE_MENU, tableLimit } from "@/lib/club/logic";
import { LANGS, type Lang } from "@/lib/i18n";
import { useT } from "@/lib/i18n/use-t";
import { useClub } from "@/lib/club/store";
import setupKun from "@/assets/onboarding/setup-kun.webp";
import setupTun from "@/assets/onboarding/setup-tun.webp";
import welcomeKun from "@/assets/onboarding/welcome-kun.webp";
import welcomeTun from "@/assets/onboarding/welcome-tun.webp";

// How the keys work is taught afterwards, by the tour over the real keypad.
type Step = "welcome" | "business" | "setup";
const STEPS: Step[] = ["welcome", "business", "setup"];

// Artwork per step, one image per mode (prompts in docs/brand/gemini-prompts.md).
// Imported, not served from public/, so both the web and the Mini App builds bundle them.
const ART: Record<Step, { tun: string; kun: string } | null> = {
  welcome: { tun: welcomeTun, kun: welcomeKun },
  business: null,
  setup: { tun: setupTun, kun: setupKun },
};

type TgUser = { first_name?: string; language_code?: string };

function telegramUser(): TgUser | null {
  if (typeof window === "undefined") return null;
  const tg = (window as { Telegram?: { WebApp?: { initDataUnsafe?: { user?: TgUser } } } }).Telegram?.WebApp;
  return tg?.initDataUnsafe?.user ?? null;
}

// First guess at the language: Telegram's, else the device's; Uzbek when unsupported.
function detectLang(): Lang {
  const code = (telegramUser()?.language_code ?? navigator.language ?? "").toLowerCase();
  if (code.startsWith("uz") && code.includes("cyrl")) return "uz-Cyrl";
  const base = code.split(/[-_]/)[0];
  return LANGS.some((l) => l.id === base) ? (base as Lang) : "uz";
}

export function Onboarding() {
  const [step, setStep] = useState<Step>("welcome");
  const t = useT();

  useEffect(() => {
    const lang = detectLang();
    if (lang !== "uz") useClub.getState().patchSettings({ lang });
  }, []);
  const index = STEPS.indexOf(step);
  const back = index > 0 ? () => setStep(STEPS[index - 1]) : null;

  return (
    <main className="mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-bg text-fg">
      <header className="flex h-16 shrink-0 items-center justify-between px-4">
        {back ? (
          <button
            type="button"
            onClick={back}
            aria-label={t("common.back")}
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

      {step === "welcome" ? <Welcome onNext={() => setStep("business")} /> : null}
      {step === "business" ? <Business onNext={() => setStep("setup")} /> : null}
      {step === "setup" ? <Setup /> : null}
    </main>
  );
}

function Art({ step, className }: { step: Step; className?: string }) {
  const art = ART[step];
  if (!art) return null;
  const cls = cn("mx-auto aspect-[4/3] w-full rounded-3xl object-cover", className ?? "max-w-80");
  return (
    <>
      <img src={art.tun} alt="" decoding="async" className={cn(cls, "only-tun")} />
      <img src={art.kun} alt="" decoding="async" className={cn(cls, "only-kun")} />
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
  const t = useT();
  const lang = useClub((s) => s.settings.lang);
  const name = telegramUser()?.first_name;
  return (
    <>
      <div className="no-scrollbar -mt-2 flex shrink-0 gap-2 overflow-x-auto px-4 pb-2" role="radiogroup" aria-label={t("sheet.language")}>
        {LANGS.map((l) => (
          <button
            key={l.id}
            type="button"
            role="radio"
            aria-checked={lang === l.id}
            onClick={() => useClub.getState().patchSettings({ lang: l.id })}
            className={cn(
              "key shrink-0 rounded-full px-3 py-1.5 text-sm",
              lang === l.id ? "bg-op-tint text-op-ink key-sel" : "bg-key text-fg",
            )}
          >
            {l.label}
          </button>
        ))}
      </div>
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
        {ART.welcome ? <Art step="welcome" /> : <KeypadArt />}
        <div className="flex flex-col items-center gap-3">
          <OrdeWordmark className="h-12 text-fg" />
          <p className="text-base text-balance text-muted">
            {name ? `${t("onb.hello", { name })} ` : ""}
            {t("onb.tagline")}
          </p>
        </div>
      </div>
      <PrimaryButton onClick={onNext}>{t("onb.start")}</PrimaryButton>
    </>
  );
}

function Business({ onNext }: { onNext: () => void }) {
  const t = useT();
  const business = useClub((s) => s.settings.business);
  return (
    <>
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-2">
        <h1 className="px-1 text-2xl font-semibold">{t("onb.business")}</h1>
        <p className="px-1 pt-1 pb-4 text-sm text-muted">{t("onb.businessSub")}</p>
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={t("onb.business")}>
          {BUSINESSES.map((b) => (
            <button
              key={b.id}
              type="button"
              role="radio"
              aria-checked={business === b.id}
              onClick={() => useClub.getState().patchSettings({ business: b.id })}
              className={cn(
                "key flex aspect-square flex-col items-center justify-center gap-2 rounded-3xl px-2 text-center",
                business === b.id ? "bg-op-tint text-op-ink key-sel" : "bg-elev text-fg",
              )}
            >
              <span className="text-3xl leading-none">{b.emoji}</span>
              <span className="text-xs font-medium leading-tight text-balance">{t(`biz.${b.id}`)}</span>
            </button>
          ))}
        </div>
      </div>
      <PrimaryButton onClick={onNext}>{t("tour.next")}</PrimaryButton>
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

function Setup() {
  const t = useT();
  const settings = useClub((s) => s.settings);
  const defaultRate = businessInfo(settings.business).rate;
  const limit = tableLimit(settings);
  const [clubName, setClubName] = useState("");
  const [tableCount, setTableCount] = useState(Math.min(settings.tableCount, limit));
  const [rate, setRate] = useState(defaultRate);
  const [vipRate, setVipRate] = useState(defaultRate * 2);
  const [sampleMenu, setSampleMenu] = useState(false);

  const finish = () =>
    useClub.getState().completeSetup({ clubName, tableCount, rate, vipRate, sampleMenu });

  return (
    <>
      <div className="no-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-2">
        <Art step="setup" className="max-w-60" />
        <h1 className="px-1 text-2xl font-semibold">{t("onb.club")}</h1>
        <div className="overflow-hidden rounded-3xl bg-elev">
          <label className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="text-sm text-muted">{t("settings.name")}</span>
            <input
              value={clubName}
              maxLength={32}
              aria-label={t("settings.clubName")}
              placeholder={t("onb.namePh")}
              onChange={(event) => setClubName(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-right text-base text-fg outline-none placeholder:text-muted/60"
            />
          </label>
        </div>
        <div className="rounded-3xl bg-elev px-4 py-4">
          <Stepper label={t(`units.${settings.business}`)} value={tableCount} min={1} max={limit} step={1} onChange={setTableCount} />
          {!settings.premium ? (
            <p className="mt-2 text-sm text-muted">
              {t("onb.freeNote", { free: FREE_TABLE_LIMIT, max: MAX_TABLES })}
            </p>
          ) : null}
        </div>
        <div className="space-y-4 rounded-3xl bg-elev px-4 py-4">
          <Stepper label={t("settings.rate")} value={rate} min={5000} max={2000000} step={5000} onChange={setRate} />
          <Stepper label={t("settings.vipRate")} value={vipRate} min={5000} max={4000000} step={5000} onChange={setVipRate} />
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={sampleMenu}
          onClick={() => setSampleMenu(!sampleMenu)}
          className="key flex w-full items-center justify-between gap-3 rounded-3xl bg-elev px-4 py-4 text-left"
        >
          <span>
            <span className="block text-base">{t("onb.sample")}</span>
            <span className="text-sm text-muted">{t("onb.sampleSub", { n: SAMPLE_MENU.length })}</span>
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
      <PrimaryButton onClick={finish}>{t("common.done")}</PrimaryButton>
    </>
  );
}
