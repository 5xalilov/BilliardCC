# BilliardCC colour palette — "Felt & Brass"

Chosen with the `ui-colorist` skill (`.grok/skills/ui-colorist/`).
Figma palette board + `BilliardCC · Color` variable collection:
https://www.figma.com/design/di3aN1oHFHyiTAda9RUnoJ

## Brief

- **Product:** cashier keypad for a billiard club — start/stop tables, add bar
  items, close the bill. Tapped hundreds of times a night.
- **Environment:** dim hall, phone or tablet on the counter, glanced at between
  shots → dark UI, high text contrast, one loud action colour.
- **Brand words:** classic, premium, calm.
- **Hue families:** baize green (surfaces), brass fittings (action), ivory cue
  ball (text).

## Roles

| Token | Hex | Role | Figma source (Material 3 Design Kit) |
|---|---|---|---|
| `--color-bg` | `#0b0f0b` | Canvas | Green DT · Schemes/Surface Container Lowest |
| `--color-key` | `#272b26` | Number keys | Green DT · Schemes/Surface Container High |
| `--color-fn` | `#3a4b3a` | Function keys, unselected chips in cards | Green DT · Schemes/Secondary Container |
| `--color-sheet` | `#1c211c` | Bottom sheets | Green DT · Schemes/Surface Container |
| `--color-elev` | `#313630` | Cards and rows on sheets | Green DT · Schemes/Surface Container Highest |
| `--color-line` | `#424940` | Dividers, sheet handle | Green DT · Schemes/Outline Variant |
| `--color-fg` | `#f1f4ec` | Text, hero numeral | Green DT · Schemes/On Surface `#e0e4db`, lightened |
| `--color-muted` | `#c1c9be` | Secondary text | Green DT · Schemes/On Surface Variant |
| `--color-op` | `#e9c16c` | Primary action (brass): BAR, PAUZA, HISOB, confirm buttons | Yellow DT · Schemes/Primary |
| `--color-on-op` | `#3f2e00` | Text/icons on brass | Yellow DT · Schemes/On Primary |
| `--color-live` | `#9cd49f` | Running-table ring and timer | Green DT · Schemes/Primary |

**Adjustments:** `fg` lifted from `#e0e4db` to `#f1f4ec` so primary text stands
clearly above `muted` (17.4:1 vs 11.4:1 on canvas). Everything else is the
library value unchanged.

## Contrast (`node .grok/skills/ui-colorist/scripts/contrast.mjs docs/color-palette.json`)

All 22 pairs pass. Key results:

| Pair | WCAG | APCA Lc |
|---|---|---|
| fg on bg | 17.37:1 | −99.5 |
| muted on elev (worst muted case) | 7.27:1 | −66.2 |
| on-op on op (labels on brass keys) | 7.68:1 | 66.6 |
| op on elev (brass text on cards) | 7.24:1 | −66.0 |
| live ring on key | 8.45:1 | — |
| key vs bg (surface separation) | 1.34:1 | — |

The previous iOS-calculator palette failed 11 of the same checks — most
importantly white text on the orange keys (`#fff` on `#ff9f0a`, 2.06:1).

## Colour-blind note

Brass (`op`) and green (`live`) have near-identical luminance, so they are never
the only cue: brass is always a filled key in the right-hand column, live is a
2px ring plus a ticking timer on a number key, and paused tables use a grey ring
plus the "PAUZA" label.

## Runners-up

- **Tournament Green** — same surfaces, green `#9cd49f` as the action colour
  with `#003913` labels. Calmer, but loses the warm/cool split between "do
  something" and "running", so live tables would need brass instead.
- **iOS calculator (previous)** — familiar, but fails AA on every brass/orange
  key label and on muted text in APCA.
