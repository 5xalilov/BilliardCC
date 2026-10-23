import { useRef, useState } from "react";
import {
  BookOpen,
  Clock,
  Crown,
  CupSoda,
  FileText,
  ImagePlus,
  Keyboard,
  MessageCircleQuestion,
  Play,
  ReceiptText,
  Search,
  Settings2,
  ShieldCheck,
  Smartphone,
  X,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Group, Row } from "@/components/club/settings-ui";
import guideKun from "@/assets/onboarding/guide-kun.webp";
import guideTun from "@/assets/onboarding/guide-tun.webp";
import { cn } from "@/lib/cn";
import { FREE_TABLE_LIMIT } from "@/lib/club/logic";
import { GUIDE } from "@/lib/club/guide";
import { findArticle, findCategory, helpFor, searchHelp, type HelpCategoryId } from "@/lib/club/help";
import { LEGAL_UPDATED, legalDoc, type LegalDoc } from "@/lib/club/legal";
import { callCloud, cloudAvailable } from "@/lib/club/cloud";
import { useClub } from "@/lib/club/store";
import { useT } from "@/lib/i18n/use-t";

const CATEGORY_ICON: Record<HelpCategoryId, LucideIcon> = {
  start: Play,
  time: Clock,
  bar: CupSoda,
  bills: ReceiptText,
  data: Smartphone,
  premium: Crown,
  settings: Settings2,
};

const push = (...args: Parameters<ReturnType<typeof useClub.getState>["pushSheet"]>) =>
  useClub.getState().pushSheet(...args);

// Help center: search, problem categories, the keypad guide, "leave a request" and documents.
export function HelpCenterSheet() {
  const t = useT();
  const lang = useClub((s) => s.settings.lang);
  const [query, setQuery] = useState("");
  const categories = helpFor(lang);
  const hits = query.trim() ? searchHelp(lang, query) : null;

  return (
    <div className="pad-safe space-y-6 px-4 pt-1 pb-5">
      <label className="flex items-center gap-2 rounded-2xl bg-elev px-4">
        <Search className="size-4 shrink-0 text-muted" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("help.search")}
          aria-label={t("help.search")}
          className="h-11 min-w-0 flex-1 bg-transparent text-base text-fg outline-none placeholder:text-muted"
        />
        {query ? (
          <button type="button" aria-label={t("support.remove")} onClick={() => setQuery("")} className="text-muted">
            <X className="size-4" />
          </button>
        ) : null}
      </label>

      {hits ? (
        hits.length ? (
          <Group>
            {hits.map(({ category, article }) => (
              <Row
                key={`${category.id}/${article.id}`}
                label={article.q}
                sub={category.title}
                chevron
                onClick={() => push({ kind: "helpArticle", cat: category.id, article: article.id })}
              />
            ))}
          </Group>
        ) : (
          <p className="py-4 text-center text-sm text-muted">{t("help.notFound")}</p>
        )
      ) : (
        <>
          <Group>
            {categories.map((c) => (
              <Row
                key={c.id}
                icon={CATEGORY_ICON[c.id]}
                label={c.title}
                value={c.articles.length}
                chevron
                onClick={() => push({ kind: "helpCat", cat: c.id })}
              />
            ))}
          </Group>
          <Group>
            <Row icon={Keyboard} label={t("help.keys")} chevron onClick={() => push({ kind: "helpKeys" })} />
          </Group>
        </>
      )}

      <ContactCard />

      <Group header={t("help.docs")}>
        <Row icon={ShieldCheck} label={t("legal.privacy")} chevron onClick={() => push({ kind: "legal", doc: "privacy" })} />
        <Row icon={FileText} label={t("legal.offer")} chevron onClick={() => push({ kind: "legal", doc: "offer" })} />
      </Group>
    </div>
  );
}

function ContactCard({ topic }: { topic?: string }) {
  const t = useT();
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-elev px-4 py-4 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-op-tint text-op-ink">
        <MessageCircleQuestion className="size-5" />
      </span>
      <p className="text-sm text-muted">{t("help.contactSub")}</p>
      <button
        type="button"
        className="key h-11 w-full rounded-full bg-op text-base font-semibold text-on-op"
        onClick={() => push({ kind: "support", topic })}
      >
        {t("help.contact")}
      </button>
    </div>
  );
}

export function HelpCategorySheet({ cat }: { cat: string }) {
  const lang = useClub((s) => s.settings.lang);
  const category = findCategory(lang, cat);
  if (!category) return null;
  return (
    <div className="pad-safe space-y-6 px-4 pt-1 pb-5">
      <Group>
        {category.articles.map((a) => (
          <Row key={a.id} label={a.q} chevron onClick={() => push({ kind: "helpArticle", cat, article: a.id })} />
        ))}
      </Group>
      <ContactCard topic={category.title} />
    </div>
  );
}

export function HelpArticleSheet({ cat, article }: { cat: string; article: string }) {
  const lang = useClub((s) => s.settings.lang);
  const item = findArticle(lang, cat, article);
  const category = findCategory(lang, cat);
  if (!item) return null;
  const steps = item.a.length > 1;
  return (
    <div className="pad-safe space-y-6 px-4 pt-1 pb-5">
      <h3 className="px-1 text-xl font-semibold text-balance">{item.q}</h3>
      <Group>
        {item.a.map((line, i) => (
          <div key={i} className="ios-row flex items-start gap-3 pl-4">
            {steps ? (
              <span className="mt-3 flex size-6 shrink-0 items-center justify-center rounded-full bg-op-tint text-xs font-semibold text-op-ink">
                {i + 1}
              </span>
            ) : null}
            <p className="ios-row-body flex-1 py-3 pr-4 text-base text-pretty">{line}</p>
          </div>
        ))}
      </Group>
      <ContactCard topic={category?.title} />
    </div>
  );
}

// The keypad guide (same texts as the first-run tour) and a button to replay the tour.
export function HelpKeysSheet() {
  const t = useT();
  const business = useClub((s) => s.settings.business);
  const guideVars = { units: t(`units.${business}`), free: FREE_TABLE_LIMIT };
  const replay = () => {
    useClub.getState().patchSettings({ tourDone: false });
    useClub.setState({ sheets: [] });
  };
  return (
    <div className="pad-safe space-y-4 px-4 pt-1 pb-5">
      <img src={guideTun} alt="" className="only-tun mx-auto aspect-[4/3] w-full max-w-60 rounded-3xl object-cover" />
      <img src={guideKun} alt="" className="only-kun mx-auto aspect-[4/3] w-full max-w-60 rounded-3xl object-cover" />
      <button type="button" className="key h-12 w-full rounded-full bg-op text-base font-semibold text-on-op" onClick={replay}>
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

// Screenshots are re-encoded on the device: JPEG, longest side ≤ 1280 px, so a request
// stays small enough for the Telegram Serverless call.
const IMAGE_LIMIT = 600_000; // base64 characters

async function compressImage(file: File): Promise<string | null> {
  const bitmap = await createImageBitmap(file);
  for (const [side, quality] of [
    [1280, 0.72],
    [960, 0.6],
    [720, 0.5],
  ] as const) {
    const scale = Math.min(1, side / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL("image/jpeg", quality).split(",")[1] ?? "";
    if (data.length <= IMAGE_LIMIT) return data;
  }
  return null;
}

export function SupportSheet({ topic }: { topic?: string }) {
  const t = useT();
  const lang = useClub((s) => s.settings.lang);
  const topics = [...helpFor(lang).map((c) => c.title), t("support.topicOther")];
  const [picked, setPicked] = useState(topic && topics.includes(topic) ? topic : topics[topics.length - 1]);
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const online = cloudAvailable();
  const valid = text.trim().length >= 5;

  const attach = async (file: File | undefined) => {
    if (!file) return;
    try {
      const data = await compressImage(file);
      if (!data) return void toast(t("support.imageBig"));
      setImage(data);
    } catch {
      toast(t("support.imageBig"));
    }
  };

  const send = async () => {
    if (!valid || busy) return;
    setBusy(true);
    try {
      await callCloud("supportRequest", { topic: picked, text: text.trim(), image, lang });
      toast(t("support.sent"));
      useClub.getState().popSheet();
    } catch (err) {
      const code = (err as { parameters?: { code?: string } }).parameters?.code;
      toast(t(code === "RATE_LIMIT" ? "support.tooMany" : code === "IMAGE_TOO_BIG" ? "support.imageBig" : "support.failed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pad-safe space-y-4 px-4 pt-1 pb-5">
      <div>
        <p className="px-1 pb-2 text-xs font-medium tracking-wider text-muted uppercase">{t("support.topic")}</p>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4" role="radiogroup" aria-label={t("support.topic")}>
          {topics.map((name) => (
            <button
              key={name}
              type="button"
              role="radio"
              aria-checked={picked === name}
              onClick={() => setPicked(name)}
              className={cn(
                "key shrink-0 rounded-full px-4 py-2 text-sm",
                picked === name ? "bg-op-tint text-op-ink key-sel" : "bg-elev text-fg",
              )}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={text}
        maxLength={2000}
        rows={5}
        onChange={(event) => setText(event.target.value)}
        placeholder={t("support.textPh")}
        aria-label={t("support.text")}
        className="w-full resize-none rounded-2xl bg-elev px-4 py-3 text-base text-fg outline-none placeholder:text-muted"
      />

      {image ? (
        <div className="relative w-28">
          <img src={`data:image/jpeg;base64,${image}`} alt="" className="h-40 w-28 rounded-2xl object-cover" />
          <button
            type="button"
            aria-label={t("support.remove")}
            onClick={() => setImage(null)}
            className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full bg-fg text-bg"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="key flex h-12 w-full items-center justify-center gap-2 rounded-full bg-elev text-base text-fg"
        >
          <ImagePlus className="size-5 text-op-ink" />
          {t("support.attach")}
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          void attach(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      <button
        type="button"
        disabled={!valid || busy || !online}
        onClick={send}
        className="key h-12 w-full rounded-full bg-op text-base font-semibold text-on-op disabled:opacity-40"
      >
        {t("support.send")}
      </button>
      <p className="text-center text-xs text-muted">{online ? t("support.reply") : t("support.inBot")}</p>
    </div>
  );
}

export function LegalSheet({ doc }: { doc: LegalDoc }) {
  const t = useT();
  const lang = useClub((s) => s.settings.lang);
  const sections = legalDoc(doc, lang);
  return (
    <div className="pad-safe space-y-5 px-5 pt-1 pb-6">
      <p className="flex items-center gap-2 text-xs text-muted">
        <BookOpen className="size-4" />
        {t("legal.updated", { date: LEGAL_UPDATED })}
      </p>
      {sections.map((s) => (
        <section key={s.title} className="space-y-2">
          <h3 className="text-base font-semibold">{s.title}</h3>
          {s.body.map((p, i) =>
            p.startsWith("• ") ? (
              <p key={i} className="flex gap-2 text-sm text-pretty text-fg">
                <span className="text-op-ink">•</span>
                <span>{p.slice(2)}</span>
              </p>
            ) : (
              <p key={i} className="text-sm whitespace-pre-line text-pretty text-fg">
                {p}
              </p>
            ),
          )}
        </section>
      ))}
    </div>
  );
}
