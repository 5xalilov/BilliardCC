import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";
import { DEFAULT_SETTINGS } from "@/lib/club/logic";
import { useClub } from "@/lib/club/store";
import { useT } from "@/lib/i18n/use-t";

// Arrange mode (iOS Control Center style): the 11 non-unit keys wiggle and a key dragged onto
// another swaps places with it. The unit block never moves. Order lives in settings.keyLayout.

const KEY_IDS: readonly string[] = DEFAULT_SETTINGS.keyLayout;

// Saved order cleaned up: unknown or repeated ids dropped, missing ones appended in default order.
function resolveKeyLayout(saved: readonly string[] | undefined) {
  const out = (saved ?? []).filter((id, i, all) => KEY_IDS.includes(id) && all.indexOf(id) === i);
  for (const id of KEY_IDS) if (!out.includes(id)) out.push(id);
  return out;
}

export type ArrangeBind = {
  "data-arrange-id": string;
  className?: string;
  style?: CSSProperties;
  onPointerDown?: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerMove?: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp?: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerCancel?: (event: ReactPointerEvent<HTMLElement>) => void;
};

type Drag = { id: string; pointerId: number; x: number; y: number; dx: number; dy: number; over: string | null };

function slotAt(x: number, y: number, self: string) {
  for (const el of document.elementsFromPoint(x, y)) {
    const host = el.closest<HTMLElement>("[data-arrange-id]");
    const id = host?.dataset.arrangeId;
    if (id && id !== self) return id;
  }
  return null;
}

function centers() {
  const map = new Map<string, { x: number; y: number }>();
  document.querySelectorAll<HTMLElement>("[data-arrange-id]").forEach((el) => {
    const r = el.getBoundingClientRect();
    map.set(el.dataset.arrangeId ?? "", { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  });
  return map;
}

export function useArrange() {
  const saved = useClub((s) => s.settings.keyLayout);
  const arranging = useClub((s) => s.arranging);
  const order = useMemo(() => resolveKeyLayout(saved), [saved]);
  const [drag, setDrag] = useState<Drag | null>(null);
  const before = useRef<Map<string, { x: number; y: number }> | null>(null);
  const orderKey = order.join(",");

  // FLIP: keys glide from where they were to their new slot after a swap or a reset.
  useLayoutEffect(() => {
    const prev = before.current;
    before.current = null;
    if (!prev || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const next = centers();
    document.querySelectorAll<HTMLElement>("[data-arrange-id]").forEach((el) => {
      const id = el.dataset.arrangeId ?? "";
      const from = prev.get(id);
      const to = next.get(id);
      if (!from || !to) return;
      const dx = from.x - to.x;
      const dy = from.y - to.y;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      el.animate([{ translate: `${dx}px ${dy}px` }, { translate: "0px 0px" }], {
        duration: 300,
        easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      });
    });
  }, [orderKey]);

  const swap = (a: string, b: string) => {
    const next = [...order];
    const i = next.indexOf(a);
    const j = next.indexOf(b);
    if (i < 0 || j < 0) return;
    [next[i], next[j]] = [next[j], next[i]];
    before.current = centers();
    useClub.getState().setKeyLayout(next);
  };

  const reset = () => {
    before.current = centers();
    useClub.getState().resetKeyLayout();
  };

  const bind = (id: string, index: number): ArrangeBind => {
    if (!arranging) return { "data-arrange-id": id };
    const dragging = drag?.id === id;
    return {
      "data-arrange-id": id,
      className: cn(
        "arrange-key",
        dragging ? "arrange-drag" : index % 2 ? "arrange-wiggle-b" : "arrange-wiggle-a",
        drag?.over === id && "arrange-target",
      ),
      style: {
        touchAction: "none",
        animationDelay: `${-((index * 97) % 300)}ms`,
        ...(dragging ? { translate: `${drag.dx}px ${drag.dy}px`, scale: "1.12", zIndex: 30 } : null),
      },
      onPointerDown: (event) => {
        if (drag || (event.pointerType === "mouse" && event.button !== 0)) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        setDrag({ id, pointerId: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, dy: 0, over: null });
      },
      onPointerMove: (event) => {
        if (!drag || drag.id !== id || drag.pointerId !== event.pointerId) return;
        setDrag({
          ...drag,
          dx: event.clientX - drag.x,
          dy: event.clientY - drag.y,
          over: slotAt(event.clientX, event.clientY, id),
        });
      },
      onPointerUp: (event) => {
        if (!drag || drag.id !== id || drag.pointerId !== event.pointerId) return;
        const over = slotAt(event.clientX, event.clientY, id);
        if (over) swap(id, over);
        setDrag(null);
      },
      onPointerCancel: () => setDrag(null),
    };
  };

  return {
    arranging,
    order,
    bind,
    reset,
    isDefault: orderKey === KEY_IDS.join(","),
  };
}

// Floating Reset / Done over the header while arranging.
export function ArrangeBar({ onReset, canReset }: { onReset: () => void; canReset: boolean }) {
  const t = useT();
  return (
    <>
      <style href="orde-arrange" precedence="default">
        {ARRANGE_CSS}
      </style>
      <div className="arrange-bar fixed inset-x-0 top-0 z-30 mx-auto flex max-w-md items-center justify-between px-4 pt-3">
        <button
          type="button"
          disabled={!canReset}
          onClick={onReset}
          className="key flex h-12 items-center gap-2 rounded-full bg-fn px-5 text-sm font-semibold text-fg"
        >
          <RotateCcw className="size-4" strokeWidth={2} />
          {t("arrange.reset")}
        </button>
        <button
          type="button"
          onClick={() => useClub.getState().stopArranging()}
          className="key flex h-12 items-center gap-2 rounded-full bg-op px-6 text-sm font-semibold text-on-op"
        >
          <Check className="size-4" strokeWidth={2.5} />
          {t("arrange.done")}
        </button>
      </div>
    </>
  );
}

const ARRANGE_CSS = `
.arrange-key {
  cursor: grab;
}
.arrange-wiggle-a,
.arrange-wiggle-b {
  animation: arrange-wiggle 280ms ease-in-out infinite;
}
.arrange-wiggle-b {
  animation-direction: reverse;
}
.key.arrange-drag {
  cursor: grabbing;
  --key-shadow: 0 18px 40px rgb(0 0 0 / 0.45);
}
.key.arrange-target {
  scale: 0.9;
  --key-ring: 0 0 0 3px var(--color-fg);
}
.arrange-bar {
  animation: arrange-bar-in 220ms ease-out both;
}
@keyframes arrange-wiggle {
  0%, 100% { rotate: -1.5deg; }
  50% { rotate: 1.5deg; }
}
@keyframes arrange-bar-in {
  from { opacity: 0; transform: translateY(-8px); }
}
@media (prefers-reduced-motion: reduce) {
  .arrange-wiggle-a,
  .arrange-wiggle-b,
  .arrange-bar {
    animation: none;
  }
}
`;
