import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { GUIDE, type GuideStep } from "@/lib/club/guide";
import { useClub } from "@/lib/club/store";

type Rect = { left: number; top: number; width: number; height: number };

const PAD = 6;

// Union of every element tagged with the step's target, padded for the spotlight.
function measure(target: string): Rect | null {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>(`[data-tour="${target}"]`));
  const boxes = nodes.map((n) => n.getBoundingClientRect()).filter((r) => r.width > 0 && r.height > 0);
  if (boxes.length === 0) return null;
  const left = Math.min(...boxes.map((r) => r.left)) - PAD;
  const top = Math.min(...boxes.map((r) => r.top)) - PAD;
  const right = Math.max(...boxes.map((r) => r.right)) + PAD;
  const bottom = Math.max(...boxes.map((r) => r.bottom)) + PAD;
  return { left, top, width: right - left, height: bottom - top };
}

// First run on the keypad: a spotlight walks over the real keys with a floating card.
// Replayed from Klub → Qanday ishlaydi.
export function Tour() {
  const active = useClub((s) => s.settings.setupDone && !s.settings.tourDone && s.sheets.length === 0);
  const [steps, setSteps] = useState<GuideStep[]>([]);
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  // Only steps whose keys are on screen (e.g. no "locked" step for a Premium club).
  useLayoutEffect(() => {
    if (!active) return;
    setSteps(GUIDE.filter((step) => measure(step.target)));
    setIndex(0);
  }, [active]);

  const step = steps[index];

  const place = useCallback(() => {
    setViewport({ w: window.innerWidth, h: window.innerHeight });
    setRect(step ? measure(step.target) : null);
  }, [step]);

  useLayoutEffect(() => {
    if (active) place();
  }, [active, place]);

  useEffect(() => {
    if (!active) return;
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active, place]);

  if (!active || !step || !rect) return null;

  const finish = () => useClub.getState().patchSettings({ tourDone: true });
  const last = index === steps.length - 1;
  const next = () => (last ? finish() : setIndex(index + 1));
  const below = rect.top + rect.height / 2 < viewport.h / 2;
  const round = rect.width < 120 && Math.abs(rect.width - rect.height) < 12;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Ko'rsatma">
      <div className="absolute inset-0" onClick={next} />
      <div
        className="tour-spot pointer-events-none fixed"
        style={{
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          borderRadius: round ? 9999 : 28,
        }}
      />
      <div
        key={index}
        className="tour-card fixed inset-x-4 mx-auto max-w-sm rounded-3xl border border-line bg-sheet p-4 text-fg shadow-2xl"
        style={below ? { top: rect.top + rect.height + 12 } : { bottom: viewport.h - rect.top + 12 }}
      >
        <p className="text-sm font-semibold text-op-ink">{step.title}</p>
        <p className="mt-1 text-base text-pretty">{step.text}</p>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm tabular-nums text-muted">
            {index + 1}/{steps.length}
          </span>
          <span className="flex-1" />
          {!last ? (
            <button type="button" onClick={finish} className="px-2 py-2 text-sm text-muted">
              O'tkazib yuborish
            </button>
          ) : null}
          <button
            type="button"
            onClick={next}
            className="key h-10 rounded-full bg-op px-5 text-sm font-semibold text-on-op"
          >
            {last ? "Boshladik" : "Keyingi"}
          </button>
        </div>
      </div>
    </div>
  );
}
