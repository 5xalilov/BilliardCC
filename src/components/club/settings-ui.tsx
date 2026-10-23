import type { ReactNode } from "react";
import { ChevronRight, Minus, Plus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

// iOS-style settings building blocks: a group (header · rows · footer), one row shape
// (icon · label · value · accessory · chevron) and compact in-row controls.
// Rows inside a group get an inset hairline (see .ios-row in styles.css).

export function Group({ header, footer, children }: { header?: ReactNode; footer?: ReactNode; children: ReactNode }) {
  return (
    <section>
      {header ? <h3 className="px-4 pb-1.5 text-xs font-medium tracking-wider text-muted uppercase">{header}</h3> : null}
      <div className="overflow-hidden rounded-2xl bg-elev">{children}</div>
      {footer ? <p className="px-4 pt-1.5 text-xs text-muted">{footer}</p> : null}
    </section>
  );
}

export function RowIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-op-tint text-op-ink">
      <Icon className="size-4" strokeWidth={2} />
    </span>
  );
}

export function Row({
  icon,
  label,
  sub,
  value,
  accessory,
  chevron,
  tone,
  ariaLabel,
  onClick,
}: {
  icon?: LucideIcon;
  label: ReactNode;
  sub?: ReactNode;
  value?: ReactNode;
  accessory?: ReactNode;
  chevron?: boolean;
  tone?: "accent";
  ariaLabel?: string;
  onClick?: () => void;
}) {
  const body = (
    <>
      {icon ? <RowIcon icon={icon} /> : null}
      <span className="ios-row-body flex min-h-12 min-w-0 flex-1 items-center gap-3 py-2.5 pr-4">
        <span className="min-w-0 flex-1">
          <span className={cn("block truncate text-base", tone === "accent" && "text-op-ink")}>{label}</span>
          {sub ? <span className="block truncate text-sm text-muted">{sub}</span> : null}
        </span>
        {value !== undefined && value !== null ? (
          <span className="flex shrink-0 items-center gap-2 text-base text-muted tabular-nums">{value}</span>
        ) : null}
        {accessory}
        {chevron ? <ChevronRight className="size-4 shrink-0 text-muted" /> : null}
      </span>
    </>
  );
  if (!onClick) return <div className="ios-row flex items-center gap-3 pl-4">{body}</div>;
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="ios-row flex w-full items-center gap-3 pl-4 text-left transition-colors active:bg-fn/40"
    >
      {body}
    </button>
  );
}

// A row whose control sits under the label (segmented choices that need the full width).
export function StackRow({ icon, label, children }: { icon?: LucideIcon; label?: ReactNode; children: ReactNode }) {
  return (
    <div className="ios-row flex items-start gap-3 pl-4">
      {icon ? (
        <span className="pt-2.5">
          <RowIcon icon={icon} />
        </span>
      ) : null}
      <div className="ios-row-body min-w-0 flex-1 space-y-2 py-2.5 pr-4">
        {label ? <p className="text-base">{label}</p> : null}
        {children}
      </div>
    </div>
  );
}

export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly { id: T; label: ReactNode; icon?: LucideIcon }[];
  value: T;
  onChange: (id: T) => void;
  label: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="grid gap-1 rounded-full bg-key p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map(({ id, label: text, icon: Icon }) => (
        <button
          key={String(id)}
          type="button"
          role="radio"
          aria-checked={value === id}
          onClick={() => onChange(id)}
          className={cn(
            "key flex items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-sm",
            value === id ? "bg-seg font-medium text-fg" : "text-muted",
          )}
        >
          {Icon ? <Icon className="size-4" strokeWidth={1.75} /> : null}
          <span className="truncate">{text}</span>
        </button>
      ))}
    </div>
  );
}

export function MiniStepper({
  value,
  min,
  max,
  step,
  onChange,
  format = String,
  decLabel,
  incLabel,
  highlight,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  decLabel: string;
  incLabel: string;
  highlight?: boolean;
}) {
  return (
    <span className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        aria-label={decLabel}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - step))}
        className="key flex size-8 items-center justify-center rounded-full bg-key text-fg"
      >
        <Minus className="size-4" />
      </button>
      <span className={cn("min-w-16 text-center text-base tabular-nums", highlight ? "text-op-ink" : "text-fg")}>
        {format(value)}
      </span>
      <button
        type="button"
        aria-label={incLabel}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + step))}
        className="key flex size-8 items-center justify-center rounded-full bg-key text-fg"
      >
        <Plus className="size-4" />
      </button>
    </span>
  );
}

export function Switch({ on, label, onChange }: { on: boolean; label: string; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={cn("flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors", on ? "bg-op" : "bg-fn")}
    >
      <span className={cn("size-6 rounded-full bg-knob shadow transition-transform", on && "translate-x-5")} />
    </button>
  );
}
