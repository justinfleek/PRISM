#!/usr/bin/env python3
"""
Validate WCAG AA contrast for all VS Code/Cursor theme JSONs.
Uses editor.background and editor.foreground.
Run from repo root: python scripts/validate_vscode_wcag.py
"""

import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
THEMES_DIR = REPO_ROOT / "vscode" / "themes"


def hex_to_rgb(hex_color: str) -> tuple[float, float, float]:
    hex_color = hex_color.lstrip("#")
    if len(hex_color) == 8:
        hex_color = hex_color[:6]
    r = int(hex_color[0:2], 16) / 255
    g = int(hex_color[2:4], 16) / 255
    b = int(hex_color[4:6], 16) / 255
    return (r, g, b)


def srgb_to_linear(c: float) -> float:
    if c <= 0.04045:
        return c / 12.92
    return ((c + 0.055) / 1.055) ** 2.4


def relative_luminance(r: float, g: float, b: float) -> float:
    rl = srgb_to_linear(r)
    gl = srgb_to_linear(g)
    bl = srgb_to_linear(b)
    return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl


def contrast_ratio(l1: float, l2: float) -> float:
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)


def check_theme(path: Path) -> tuple[float, bool]:
    with open(path, encoding="utf-8") as f:
        theme = json.load(f)
    colors = theme.get("colors", {})
    bg = colors.get("editor.background", "")
    fg = colors.get("editor.foreground", "")
    if not bg or not fg or not bg.startswith("#") or not fg.startswith("#"):
        return 0.0, False
    bg_rgb = hex_to_rgb(bg)
    fg_rgb = hex_to_rgb(fg)
    bg_lum = relative_luminance(*bg_rgb)
    fg_lum = relative_luminance(*fg_rgb)
    ratio = contrast_ratio(fg_lum, bg_lum)
    return ratio, ratio >= 4.5


def main() -> int:
    if not THEMES_DIR.exists():
        print("vscode/themes/ not found", file=sys.stderr)
        return 1
    results = {}
    failed = []
    for f in sorted(THEMES_DIR.glob("*.json")):
        ratio, passes = check_theme(f)
        slug = f.stem
        results[slug] = {"ratio": round(ratio, 2), "wcag_aa": passes}
        if not passes:
            failed.append((slug, ratio))
    out = REPO_ROOT / "media" / "wcag_results.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print(f"Wrote {out}")
    if failed:
        print("WCAG AA (4.5:1) failures:", file=sys.stderr)
        for slug, ratio in failed:
            print(f"  {slug}: {ratio:.2f}:1", file=sys.stderr)
        return 1
    print("All 64 themes pass WCAG AA (editor.foreground vs editor.background >= 4.5:1)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
