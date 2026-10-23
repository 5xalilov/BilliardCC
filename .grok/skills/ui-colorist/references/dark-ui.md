# Dark UI colour craft

- **Canvas**: #000 is fine on OLED phones for the very back layer (it saves
  power and makes keys float), but anything that elevates — sheets, cards,
  modals — must be lighter: step L by ~0.04–0.06 per level in OKLCH.
- **Tinted neutrals**: give greys a whisper of the brand hue (C ≈ 0.01–0.02).
  A green-tinted charcoal next to a felt-green accent reads as one family.
- **Accents vibrate** on black when saturated: keep OKLCH C ≤ ~0.17 for large
  fills, and L 0.65–0.80 so dark-on-accent labels pass.
- **Text**: pure white on pure black is harsh for long reading; use
  #F2F2EE-ish ivory for body, keep pure white for the hero numeral if you
  want punch.
- **Muted text** fails most often — verify ≥ 4.5:1 on the *lightest* surface
  it appears on, not just the canvas.
- **State rings** (live/paused): 2px inset rings need ≥ 3:1 vs the key fill.
- **Greyscale test**: screenshot → desaturate. Primary actions must still be
  the most prominent element; number keys mid; function keys distinct.
