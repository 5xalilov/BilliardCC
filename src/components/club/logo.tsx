import { cn } from "@/lib/cn";

// Orde wordmark: geometric lowercase "orde" drawn as strokes (no font needed),
// whose first "o" is the brand ball — Stol Orange with an ivory number circle.
// Letters use currentColor so the mark follows Kun/Tun text colour.
export const BALL_ORANGE = "#ff7d0a";
export const BALL_IVORY = "#f7f6f4";

export function OrdeWordmark({ className, title = "Orde" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 392 140" role="img" aria-label={title} className={cn("h-8 w-auto", className)}>
      <circle cx="50" cy="90" r="50" fill={BALL_ORANGE} />
      <circle cx="50" cy="90" r="22" fill={BALL_IVORY} />
      <g fill="none" stroke="currentColor" strokeWidth="20">
        <path d="M124 140V40M124 90A40 40 0 0 1 164 50" />
        <circle cx="228" cy="90" r="40" />
        <path d="M268 0V140" />
        <path d="M302 90H382A40 40 0 1 0 370.28 118.28" />
      </g>
    </svg>
  );
}

export function OrdeBall({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <circle cx="50" cy="50" r="50" fill={BALL_ORANGE} />
      <circle cx="50" cy="50" r="22" fill={BALL_IVORY} />
    </svg>
  );
}
