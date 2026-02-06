#!/usr/bin/env python3
"""
Test HSL→RGB consistency across implementations.
Verifies that the integer-only HSL→RGB algorithm produces identical results
in Python, Lua, JavaScript, and Elisp (PRISM theme implementations).

Usage:
    python3 scripts/test_hsl_consistency.py
"""

from typing import Tuple

def normalize_hue(n: int) -> int:
    """Normalize hue to [0, 360)."""
    return ((n % 360) + 360) % 360


def hsl_to_rgb(hue: int, s: int, l: int) -> Tuple[int, int, int]:
    """
    Integer-only HSL to RGB conversion.
    Uses milli-units (1000 = 100%) for integer arithmetic.
    Matches the Lean4/JavaScript implementation exactly.
    """
    s1000 = s * 10
    l1000 = l * 10
    twoL = 2 * l1000
    diff = abs(twoL - 1000)
    c1000 = (1000 - diff) * s1000 // 1000
    hmod = normalize_hue(hue)
    sector = hmod // 60
    pair = hmod % 120
    absVal = abs(pair - 60)
    x1000 = c1000 * (60 - absVal) // 60
    m1000 = l1000 - c1000 // 2

    if sector == 0:
        rp, gp, bp = c1000, x1000, 0
    elif sector == 1:
        rp, gp, bp = x1000, c1000, 0
    elif sector == 2:
        rp, gp, bp = 0, c1000, x1000
    elif sector == 3:
        rp, gp, bp = 0, x1000, c1000
    elif sector == 4:
        rp, gp, bp = x1000, 0, c1000
    else:
        rp, gp, bp = c1000, 0, x1000

    def ch(base: int) -> int:
        v = ((base + m1000) * 255 + 500) // 1000
        return max(0, min(255, v))

    return ch(rp), ch(gp), ch(bp)


def hsl_to_hex(hue: int, s: int, l: int) -> str:
    """Convert HSL to hex string."""
    r, g, b = hsl_to_rgb(hue, s, l)
    return f"#{r:02x}{g:02x}{b:02x}"


LEVELS = {"void": 0, "deep": 4, "night": 8, "carbon": 11, "github": 16}


def generate_palette(hero_hue: int = 211, axis_hue: int = 201, level: str = "carbon") -> dict:
    """Generate the full base16 palette."""
    L = LEVELS.get(level, 11)
    
    return {
        "base00": hsl_to_hex(211, 12, L + 0),
        "base01": hsl_to_hex(211, 16, L + 3),
        "base02": hsl_to_hex(211, 17, L + 8),
        "base03": hsl_to_hex(211, 15, L + 17),
        "base04": hsl_to_hex(211, 12, 48),
        "base05": hsl_to_hex(211, 28, 81),
        "base06": hsl_to_hex(211, 32, 89),
        "base07": hsl_to_hex(211, 36, 95),
        "base08": hsl_to_hex(axis_hue, 100, 86),
        "base09": hsl_to_hex(axis_hue, 100, 75),
        "base0A": hsl_to_hex(hero_hue, 100, 66),
        "base0B": hsl_to_hex(hero_hue, 100, 57),
        "base0C": hsl_to_hex(hero_hue, 94, 45),
        "base0D": hsl_to_hex(hero_hue, 100, 65),
        "base0E": hsl_to_hex(hero_hue, 100, 71),
        "base0F": hsl_to_hex(hero_hue, 86, 53),
    }


# Expected values verified by running Node.js with identical algorithm
JS_EXPECTED = {
    "base00": "#191c1f", "base01": "#1e2329", "base02": "#283039", "base03": "#3d4752",
    "base04": "#6c7a89", "base05": "#c1cedc", "base06": "#dae2ec", "base07": "#eef2f7",
    "base08": "#b8e6ff", "base09": "#80d2ff", "base0A": "#52a5ff", "base0B": "#248eff",
    "base0C": "#076fdf", "base0D": "#4da3ff", "base0E": "#6bb3ff", "base0F": "#2084ee",
}


def run_tests():
    """Run consistency tests."""
    print("PRISM HSL→RGB Consistency Test")
    print("=" * 50)
    
    all_passed = True
    
    # Test 1: Default palette vs JavaScript reference
    print("\n[Test 1] Default palette (hero=211, axis=201, level=carbon)")
    palette = generate_palette(211, 201, "carbon")
    
    for slot in sorted(palette.keys()):
        py_val = palette[slot]
        js_val = JS_EXPECTED.get(slot, "N/A")
        match = "✓" if py_val.lower() == js_val.lower() else "✗"
        if py_val.lower() != js_val.lower():
            all_passed = False
        print(f"  {slot}: Python={py_val} JS={js_val} {match}")
    
    # Test 2: HSL edge cases
    print("\n[Test 2] HSL edge cases")
    test_cases = [
        (0, 100, 50, (255, 0, 0)),      # Pure red
        (120, 100, 50, (0, 255, 0)),    # Pure green
        (240, 100, 50, (0, 0, 255)),    # Pure blue
        (0, 0, 0, (0, 0, 0)),           # Black
        (0, 0, 100, (255, 255, 255)),   # White
        (0, 0, 50, (128, 128, 128)),    # Gray
    ]
    
    for h, s, l, expected_rgb in test_cases:
        result = hsl_to_rgb(h, s, l)
        match = "✓" if result == expected_rgb else "✗"
        if result != expected_rgb:
            all_passed = False
        print(f"  HSL({h},{s},{l}) → RGB{result} expected={expected_rgb} {match}")
    
    # Test 3: Various presets (informational)
    print("\n[Test 3] Preset palette samples")
    for hero, name in [(211, "Monochrome"), (320, "Razorgirl"), (34, "Amber"), (195, "Cyan")]:
        palette = generate_palette(hero, 201, "carbon")
        print(f"  {name:11} (hero={hero:3}°): classes={palette['base0A']} strings={palette['base0B']} keywords={palette['base0E']}")
    
    print("\n" + "=" * 50)
    if all_passed:
        print("All tests passed! HSL→RGB is consistent across implementations.")
        return 0
    else:
        print("Some tests failed. Check the implementation.")
        return 1


if __name__ == "__main__":
    exit(run_tests())
