# Colorist process — full version

## 1. Brief (5 minutes, write it down)

| Question | Why it matters |
|---|---|
| What does the product do, in one line? | Decides which roles exist. |
| Who touches it, how often, how fast? | A cashier tapping 200×/night needs calm surfaces and one loud action colour. |
| Where is it used? (light level, device, distance) | Dim venue → dark UI, higher text contrast, no pure-white glare blocks. |
| 3 brand words | Converts taste into checkable criteria ("premium, calm, classic"). |
| Existing tokens & their roles | Keep the names; re-skin values. |
| Hard constraints | Platform chrome, logos, legacy screens, print. |

## 2. Hue families from the domain

Translate brand words + domain objects into 2–3 hue families before searching.
Write them as OKLCH hue ranges so the search stays focused:

- felt / baize green — h ≈ 150–165
- tournament cloth blue — h ≈ 230–250
- walnut, leather, cue wood — h ≈ 45–60, low chroma
- brass / gold fittings — h ≈ 75–90
- chalk blue — h ≈ 220, mid L
- ivory cue ball — h ≈ 90, very low chroma, L ≈ 0.95
- 8-ball black — neutral, slight cool tint

## 3. Role map (fill every row)

| Role | Token (Tailwind v4) | Rule |
|---|---|---|
| Canvas | `--color-bg` | Darkest (dark UI) / lightest (light UI). |
| Surface 1 | `--color-key` | Default control fill. ≥ 1.2:1 vs canvas so shapes read. |
| Surface 2 | `--color-fn` | Secondary controls; visibly different from surface 1. |
| Sheet / elevated | `--color-sheet`, `--color-elev` | Each step lighter in dark mode. |
| Line | `--color-line` | Dividers; ≥ 1.3:1 vs the surface it sits on. |
| Text | `--color-fg` | ≥ 7:1 on canvas ideally, ≥ 4.5:1 on every surface. |
| Muted text | `--color-muted` | ≥ 4.5:1 on canvas and sheet. |
| Primary action | `--color-op` | ≤ 10 % of pixels. Its *on-colour* must pass ≥ 4.5:1 (small bold labels) — choose dark-on-accent if white fails. |
| On-primary | `--color-on-op` | Text/icons on the primary action. |
| Live / running | `--color-live` | Distinct from primary *and* from danger in deuteranopia sim. |
| Warning / paused | `--color-warn` | |
| Danger | `--color-danger` | |
| Focus ring | `--color-ring` | ≥ 3:1 vs both canvas and the control. |

## 4. Scoring rubric (100)

- **Contrast (30)** — every text pair ≥ AA, every component boundary ≥ 3:1.
  Lose 5 per failing pair that cannot be fixed by an L-nudge ≤ 0.05.
- **Context fit & semantics (25)** — does it feel like the place? Do status
  colours mean what users expect (green = running/paid, amber = paused,
  red = overdue/delete)?
- **Hierarchy (15)** — can you tell primary vs secondary vs number keys at a
  glance in a greyscale screenshot?
- **Colour-blind safety (15)** — live vs danger vs primary still separable
  under deuteranopia/protanopia (check luminance difference ≥ 1.5:1 or a
  non-colour cue exists).
- **Mood / brand (15)** — matches the 3 brand words.

Anything < 70 is not proposed. Ties → pick the calmer palette.

## 5. Tuning rules

- Fix contrast by moving **OKLCH L** first, then **C**, never hue.
- On dark canvases drop accent chroma 10–20 % vs the light-mode value.
- If white text on the accent fails, switch the on-colour to the canvas
  colour (dark-on-accent) rather than darkening the accent into mud.
- Keep surfaces on one hue (tinted neutrals) — mixed-temperature greys look
  dirty.

## 6. Ship

1. `src/styles.css` → `@theme` values (keep token names).
2. Palette doc with role table, contrast table, sources, adjustments.
3. Optional: Figma swatch frame + local variable collection so design and
   code share one source of truth.
4. Screenshot desktop + mobile, check in greyscale too.
