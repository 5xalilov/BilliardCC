#!/usr/bin/env python3
"""Uzbek Latin -> Cyrillic for the Orde UI dictionary.

uz-Cyrl.ts was generated from uz.ts with these rules and then fixed by hand, so this
script never rewrites existing lines: it adds only the keys that uz.ts has and
uz-Cyrl.ts lacks (admin.* stays Latin, it is owner-only). Review what it adds.

    python3 tools/uz-cyrl.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UZ = ROOT / "src/lib/i18n/uz.ts"
CYRL = ROOT / "src/lib/i18n/uz-Cyrl.ts"

APOS = "'ʻ’‘"
MAP = {
    "a": "а", "b": "б", "d": "д", "f": "ф", "g": "г", "h": "ҳ", "i": "и", "j": "ж",
    "k": "к", "l": "л", "m": "м", "n": "н", "o": "о", "p": "п", "q": "қ", "r": "р",
    "s": "с", "t": "т", "u": "у", "v": "в", "x": "х", "y": "й", "z": "з", "c": "с",
}
# Brand names, placeholders and keys that must stay as they are.
KEEP = r"\{\w+\}|PlayStation / Xbox|«⭐ Premium»|Premium|VIP|Orde|AC|@username"
# Fixes for spellings the letter rules get wrong.
FIXES = [("Ёъ", "Йў"), ("ёъ", "йў"), ("ЁЪ", "ЙЎ"), ("омпютер", "омпьютер")]
PAIR = re.compile(r'^  "([^"]+)": "((?:[^"\\]|\\.)*)",$', re.M)


def word(w: str) -> str:
    letters = [ch for ch in w if ch.isalpha()]
    allcaps = len(letters) > 1 and w.upper() == w
    out, i = [], 0
    while i < len(w):
        c = w[i]
        nxt = w[i + 1] if i + 1 < len(w) else ""
        lc, ln, up, step = c.lower(), nxt.lower(), c.isupper(), 1
        if lc in "og" and nxt and nxt in APOS:
            s, step = {"o": "ў", "g": "ғ"}[lc], 2
        elif lc == "s" and ln == "h":
            s, step = "ш", 2
        elif lc == "c" and ln == "h":
            s, step = "ч", 2
        elif lc == "y" and ln and ln in "oaue":
            s, step = {"o": "ё", "a": "я", "u": "ю", "e": "е"}[ln], 2
        elif lc == "e":
            s = "э" if i == 0 or not w[i - 1].isalpha() else "е"
        elif c in APOS:
            s = "ъ"
        elif lc in MAP:
            s = MAP[lc]
        else:
            s, up = c, False
        out.append(s.upper() if allcaps or up else s)
        i += step
    return "".join(out)


def to_cyrl(text: str) -> str:
    parts = []
    for p in re.split(f"({KEEP})", text):
        if not p:
            continue
        if re.fullmatch(KEEP, p):
            parts.append(p)
        else:
            parts.append(re.sub(f"[A-Za-z{APOS}]+", lambda m: word(m.group(0)), p))
    s = "".join(parts)
    for a, b in FIXES:
        s = s.replace(a, b)
    return s


def main() -> None:
    cyrl = CYRL.read_text(encoding="utf-8")
    have = {k for k, _ in PAIR.findall(cyrl)}
    added = [
        f"  \"{k}\": {json.dumps(to_cyrl(json.loads(f'\"{v}\"')), ensure_ascii=False)},"
        for k, v in PAIR.findall(UZ.read_text(encoding="utf-8"))
        if k not in have and not k.startswith("admin.")
    ]
    if not added:
        print("uz-Cyrl.ts is up to date")
        return
    end = cyrl.rstrip().rfind("};")
    CYRL.write_text(cyrl[:end] + "\n".join(added) + "\n};\n", encoding="utf-8")
    print("\n".join(added))
    print(f"added {len(added)} keys — review them")


if __name__ == "__main__":
    main()
