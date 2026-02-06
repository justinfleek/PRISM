/**
 * PRISM Color Core - Mathematically Perfect Color Theme Generation
 * 
 * This module implements the formally verified color science from the Lean4 proofs.
 * All calculations use RADIANS internally for mathematical precision.
 * 
 * Two generation modes:
 * 1. MONOCHROMATIC: All colors share one hue, vary by Lightness and Chroma
 *    - Best for: Cohesive, calm themes where semantic hierarchy comes from brightness
 *    - The "211 system" - named after 211 degrees, the "perfect blue"
 * 
 * 2. GOLDEN ANGLE: Colors distributed by the golden angle (137.5077640500378 degrees)
 *    - Best for: Maximum visual separation between accent colors
 *    - Mathematically proven optimal distribution (Three-Distance Theorem)
 * 
 * @author PRISM Team
 * @license MIT
 */

// ============================================================================
// MATHEMATICAL CONSTANTS (all angles in RADIANS)
// ============================================================================

/** The ratio of a circle's circumference to its diameter */
export const PI = Math.PI;

/** Two times PI (full circle in radians) */
export const TAU = 2 * PI;

/** The golden ratio: (1 + sqrt(5)) / 2 = 1.6180339887498948... */
export const PHI = (1 + Math.sqrt(5)) / 2;

/** 
 * The golden angle in RADIANS: 2*PI / PHI^2
 * Approximately 2.399963229728653 radians
 */
export const GOLDEN_ANGLE_RAD = TAU / (PHI * PHI);

/**
 * The golden angle in DEGREES: approximately 137.5077640500378
 * This is the "magic number" that ensures optimal color distribution
 */
export const GOLDEN_ANGLE_DEG = GOLDEN_ANGLE_RAD * (180 / PI);

/** The "perfect blue" - default hero hue in degrees */
export const PERFECT_BLUE_DEG = 211;

/** The "perfect blue" in radians */
export const PERFECT_BLUE_RAD = PERFECT_BLUE_DEG * (PI / 180);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/** Convert degrees to radians */
export function toRadians(degrees: number): number {
  return degrees * (PI / 180);
}

/** Convert radians to degrees */
export function toDegrees(radians: number): number {
  return radians * (180 / PI);
}

/** Normalize an angle to [0, 2*PI) radians */
export function normalizeRadians(rad: number): number {
  const normalized = rad % TAU;
  return normalized < 0 ? normalized + TAU : normalized;
}

/** Normalize an angle to [0, 360) degrees */
export function normalizeDegrees(deg: number): number {
  const normalized = deg % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

/** Clamp a value to [min, max] */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// ============================================================================
// COLOR TYPES
// ============================================================================

/** sRGB color space (gamma-corrected, device space) */
export interface SRGB {
  r: number;  // [0, 1]
  g: number;  // [0, 1]
  b: number;  // [0, 1]
}

/** OKLCH perceptually uniform color space */
export interface OKLCH {
  L: number;  // Lightness [0, 1]
  C: number;  // Chroma [0, ~0.4]
  H: number;  // Hue [0, 360) degrees
}

/** OKLAB cartesian color space (internal use) */
export interface OKLAB {
  L: number;  // Lightness
  a: number;  // Green-Red axis
  b: number;  // Blue-Yellow axis
}

/** Base16 palette structure */
export interface Base16Palette {
  base00: string;  // Background (deepest)
  base01: string;  // Lighter background
  base02: string;  // Selection
  base03: string;  // Comments
  base04: string;  // Dark foreground
  base05: string;  // Default foreground
  base06: string;  // Light foreground
  base07: string;  // Brightest
  base08: string;  // Accent 1 (Error/Red)
  base09: string;  // Accent 2 (Warning/Orange)
  base0A: string;  // Accent 3 (Hero - your main color)
  base0B: string;  // Accent 4 (Success/Green)
  base0C: string;  // Accent 5 (Info/Cyan)
  base0D: string;  // Accent 6 (Link/Blue)
  base0E: string;  // Accent 7 (Special/Purple)
  base0F: string;  // Accent 8 (Deprecated)
}

// ============================================================================
// COLOR SPACE CONVERSIONS (matches Lean4 proofs)
// ============================================================================

/** 
 * sRGB gamma expansion (sRGB -> Linear)
 * Proven bijective in Lean4: srgb_linear_roundtrip
 */
function srgbToLinear(c: number): number {
  if (c <= 0.04045) {
    return c / 12.92;
  }
  return Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * sRGB gamma compression (Linear -> sRGB)
 * Inverse of srgbToLinear
 */
function linearToSrgb(c: number): number {
  if (c <= 0.0031308) {
    return c * 12.92;
  }
  return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

/**
 * sRGB to OKLAB conversion
 * Uses the published OKLAB matrix (Bjorn Ottosson, 2020)
 */
function srgbToOklab(rgb: SRGB): OKLAB {
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);

  // sRGB to LMS (cone response)
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  // Cube root (perceptual linearization)
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  // LMS to OKLAB
  return {
    L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
  };
}

/**
 * OKLAB to sRGB conversion
 * Inverse of srgbToOklab
 */
function oklabToSrgb(lab: OKLAB): SRGB {
  // OKLAB to LMS'
  const l_ = lab.L + 0.3963377774 * lab.a + 0.2158037573 * lab.b;
  const m_ = lab.L - 0.1055613458 * lab.a - 0.0638541728 * lab.b;
  const s_ = lab.L - 0.0894841775 * lab.a - 1.2914855480 * lab.b;

  // Cube (inverse of cube root)
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  // LMS to sRGB
  let r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let b = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  // Clamp to gamut and apply gamma
  return {
    r: clamp(linearToSrgb(Math.max(0, r)), 0, 1),
    g: clamp(linearToSrgb(Math.max(0, g)), 0, 1),
    b: clamp(linearToSrgb(Math.max(0, b)), 0, 1)
  };
}

/**
 * OKLCH to OKLAB conversion (cylindrical to cartesian)
 * Uses RADIANS internally for precision
 * Proven bijective in Lean4: oklab_oklch_roundtrip
 */
function oklchToOklab(oklch: OKLCH): OKLAB {
  const hRad = toRadians(oklch.H);  // Convert to radians for trig
  return {
    L: oklch.L,
    a: oklch.C * Math.cos(hRad),
    b: oklch.C * Math.sin(hRad)
  };
}

/**
 * OKLAB to OKLCH conversion (cartesian to cylindrical)
 * Uses atan2 for correct quadrant handling
 */
function oklabToOklch(lab: OKLAB): OKLCH {
  const C = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
  let H = toDegrees(Math.atan2(lab.b, lab.a));  // Convert result to degrees
  if (H < 0) H += 360;
  return { L: lab.L, C, H };
}

// ============================================================================
// PUBLIC COLOR CONVERSION API
// ============================================================================

/** Convert OKLCH to sRGB */
export function oklchToSrgb(oklch: OKLCH): SRGB {
  return oklabToSrgb(oklchToOklab(oklch));
}

/** Convert sRGB to OKLCH */
export function srgbToOklch(rgb: SRGB): OKLCH {
  return oklabToOklch(srgbToOklab(rgb));
}

/** Convert sRGB to hex string */
export function srgbToHex(rgb: SRGB): string {
  const r = Math.round(rgb.r * 255);
  const g = Math.round(rgb.g * 255);
  const b = Math.round(rgb.b * 255);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/** Convert hex string to sRGB */
export function hexToSrgb(hex: string): SRGB {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16) / 255,
    g: parseInt(h.substring(2, 4), 16) / 255,
    b: parseInt(h.substring(4, 6), 16) / 255
  };
}

// ============================================================================
// WCAG CONTRAST (matches Lean4 proofs)
// ============================================================================

/**
 * Calculate relative luminance per WCAG 2.1
 * Proven bounded in [0,1]: relativeLuminance_nonneg, relativeLuminance_le_one
 */
export function relativeLuminance(rgb: SRGB): number {
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate WCAG contrast ratio
 * Proven properties:
 * - Result >= 1 (contrastRatio_ge_one)
 * - Symmetric (contrastRatio_symm)
 * - Maximum is 21:1 (contrastRatio_max)
 */
export function contrastRatio(fg: SRGB, bg: SRGB): number {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Check WCAG AA compliance (4.5:1 for normal text) */
export function wcagAA(cr: number): boolean {
  return cr >= 4.5;
}

/** Check WCAG AA compliance for large text (3:1) */
export function wcagAALarge(cr: number): boolean {
  return cr >= 3.0;
}

/** Check WCAG AAA compliance (7:1 for normal text) */
export function wcagAAA(cr: number): boolean {
  return cr >= 7.0;
}

// ============================================================================
// GOLDEN ANGLE HUE GENERATION
// ============================================================================

/**
 * Generate the nth hue using golden angle rotation.
 * All calculations done in RADIANS for precision.
 * 
 * @param baseHue - Starting hue in DEGREES
 * @param n - Which color in the sequence (0-indexed)
 * @returns Hue in DEGREES [0, 360)
 * 
 * Mathematical basis: The golden angle ensures no two generated hues
 * are ever "too close" regardless of how many colors you generate.
 * This is proven optimal by the Three-Distance Theorem.
 */
export function nthGoldenHue(baseHue: number, n: number): number {
  const baseRad = toRadians(baseHue);
  const rotationRad = n * GOLDEN_ANGLE_RAD;
  const resultRad = normalizeRadians(baseRad + rotationRad);
  return toDegrees(resultRad);
}

/**
 * Generate n hues distributed by the golden angle.
 * 
 * @param baseHue - Starting hue in degrees
 * @param count - Number of hues to generate
 * @returns Array of hues in degrees
 */
export function generateGoldenHues(baseHue: number, count: number): number[] {
  return Array.from({ length: count }, (_, i) => nthGoldenHue(baseHue, i));
}

// ============================================================================
// PALETTE GENERATION MODES
// ============================================================================

/** Generation mode for the palette */
export type GenerationMode = 'monochromatic' | 'golden' | 'hybrid';

/** Monitor type affects optimal black levels */
export type MonitorType = 'oled' | 'lcd';

/** Theme mode */
export type ThemeMode = 'dark' | 'light';

/** Configuration for palette generation */
export interface PaletteConfig {
  /** Generation mode: monochromatic, golden, or hybrid */
  mode: GenerationMode;
  
  /** Hero hue in degrees (default: 211 "perfect blue") */
  heroHue: number;
  
  /** Chroma intensity [0, 1] (default: 1.0) */
  chromaIntensity: number;
  
  /** Monitor type: oled or lcd */
  monitor: MonitorType;
  
  /** Theme mode: dark or light */
  theme: ThemeMode;
  
  /** Theme name */
  name: string;
}

/** Default configuration */
export const DEFAULT_CONFIG: PaletteConfig = {
  mode: 'hybrid',
  heroHue: PERFECT_BLUE_DEG,
  chromaIntensity: 1.0,
  monitor: 'oled',
  theme: 'dark',
  name: 'PRISM'
};

// ============================================================================
// SEMANTIC LIGHTNESS AND CHROMA SCALES
// ============================================================================

/**
 * Semantic lightness targets for dark mode.
 * Each value is the target L in OKLCH [0, 1].
 */
const DARK_LIGHTNESS: Record<string, number> = {
  base00: 0.00,   // Maximum depth
  base01: 0.12,   // Subtle elevation
  base02: 0.18,   // Selection visibility
  base03: 0.45,   // Comments (WCAG AA-large)
  base04: 0.55,   // Muted foreground
  base05: 0.80,   // Primary text (WCAG AA)
  base06: 0.90,   // Emphasized
  base07: 0.97,   // Maximum brightness
  // Accents
  base08: 0.55,   // Deepest accent
  base09: 0.62,   // Rich accent
  base0A: 0.70,   // Hero (most visible)
  base0B: 0.75,   // Vibrant
  base0C: 0.78,   // Bright
  base0D: 0.82,   // Vivid
  base0E: 0.85,   // Luminous
  base0F: 0.50    // Subtle/deprecated
};

/**
 * Semantic lightness targets for light mode.
 */
const LIGHT_LIGHTNESS: Record<string, number> = {
  base00: 0.98,   // Bright background
  base01: 0.94,   // Subtle shadow
  base02: 0.88,   // Selection
  base03: 0.55,   // Comments
  base04: 0.45,   // Muted foreground
  base05: 0.25,   // Primary text
  base06: 0.18,   // Emphasized
  base07: 0.10,   // Maximum darkness
  // Accents (inverted for readability)
  base08: 0.50,
  base09: 0.45,
  base0A: 0.40,
  base0B: 0.38,
  base0C: 0.35,
  base0D: 0.32,
  base0E: 0.30,
  base0F: 0.55
};

/**
 * Chroma multipliers for semantic roles.
 * Backgrounds/foregrounds are near-gray; accents are saturated.
 */
const CHROMA_MULTIPLIERS: Record<string, number> = {
  base00: 0.08,   // Background: minimal color
  base01: 0.10,
  base02: 0.12,
  base03: 0.15,   // Comments: subtle color
  base04: 0.08,
  base05: 0.06,   // Text: nearly neutral
  base06: 0.04,
  base07: 0.02,   // Brightest: almost white
  // Accents: full saturation
  base08: 1.00,
  base09: 0.95,
  base0A: 1.00,   // Hero: maximum intensity
  base0B: 0.90,
  base0C: 0.85,
  base0D: 0.88,
  base0E: 0.92,
  base0F: 0.40    // Deprecated: desaturated
};

// ============================================================================
// PALETTE GENERATION
// ============================================================================

/**
 * Adjust lightness to achieve target contrast ratio using binary search.
 * This is the key accessibility function.
 */
export function adjustLightnessForContrast(
  color: OKLCH,
  bg: SRGB,
  targetCR: number,
  makeLighter: boolean
): OKLCH | null {
  let lo = makeLighter ? color.L : 0;
  let hi = makeLighter ? 1 : color.L;
  
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    const candidate: OKLCH = { L: mid, C: color.C, H: color.H };
    const candidateRgb = oklchToSrgb(candidate);
    const cr = contrastRatio(candidateRgb, bg);
    
    if (Math.abs(cr - targetCR) < 0.01) {
      return candidate;
    }
    
    if (cr < targetCR) {
      if (makeLighter) lo = mid;
      else hi = mid;
    } else {
      if (makeLighter) hi = mid;
      else lo = mid;
    }
  }
  
  // Return best effort
  return { L: (lo + hi) / 2, C: color.C, H: color.H };
}

/**
 * Generate a complete Base16 palette.
 * 
 * Mode effects:
 * - 'monochromatic': All 16 colors share the hero hue
 * - 'golden': 8 accent colors use golden angle distribution
 * - 'hybrid': Backgrounds/foregrounds monochromatic, accents golden
 */
export function generatePalette(config: Partial<PaletteConfig> = {}): Base16Palette {
  const cfg: PaletteConfig = { ...DEFAULT_CONFIG, ...config };
  const lightness = cfg.theme === 'dark' ? DARK_LIGHTNESS : LIGHT_LIGHTNESS;
  const maxChroma = 0.18 * cfg.chromaIntensity;  // OKLCH practical max
  
  // Adjust base lightness for monitor type
  const baseLightness = { ...lightness };
  if (cfg.theme === 'dark' && cfg.monitor === 'oled') {
    // Push backgrounds darker for OLED
    baseLightness.base00 = 0.0;
    baseLightness.base01 = Math.max(0, baseLightness.base01 - 0.04);
    baseLightness.base02 = Math.max(0, baseLightness.base02 - 0.03);
  }
  
  // Generate golden hues for accents (8 colors starting from hero)
  const goldenHues = generateGoldenHues(cfg.heroHue, 8);
  
  const colors: Record<string, string> = {};
  const slots = ['base00', 'base01', 'base02', 'base03', 'base04', 'base05', 'base06', 'base07',
                 'base08', 'base09', 'base0A', 'base0B', 'base0C', 'base0D', 'base0E', 'base0F'];
  
  // First pass: generate all colors
  for (const slot of slots) {
    const L = baseLightness[slot];
    const chromaMult = CHROMA_MULTIPLIERS[slot];
    
    // Determine hue based on mode
    let H: number;
    const accentIndex = parseInt(slot.slice(-1), 16) - 8;  // 0-7 for accents
    const isAccent = accentIndex >= 0 && accentIndex <= 7;
    
    if (cfg.mode === 'monochromatic') {
      // All colors share hero hue
      H = cfg.heroHue;
    } else if (cfg.mode === 'golden') {
      // All colors use golden distribution
      H = isAccent ? goldenHues[accentIndex] : goldenHues[0];
    } else {
      // Hybrid: backgrounds/foregrounds mono, accents golden
      H = isAccent ? goldenHues[accentIndex] : cfg.heroHue;
    }
    
    // Chroma based on role
    const C = maxChroma * chromaMult;
    
    const oklch: OKLCH = { L: clamp(L, 0, 1), C, H };
    colors[slot] = srgbToHex(oklchToSrgb(oklch));
  }
  
  // Second pass: ensure contrast compliance
  const bg = hexToSrgb(colors.base00);
  const isDark = cfg.theme === 'dark';
  
  // Adjust foreground colors for WCAG AA (4.5:1)
  for (const slot of ['base05', 'base06', 'base07']) {
    const fg = hexToSrgb(colors[slot]);
    const cr = contrastRatio(fg, bg);
    if (cr < 4.5) {
      const oklch = srgbToOklch(fg);
      const adjusted = adjustLightnessForContrast(oklch, bg, 4.5, isDark);
      if (adjusted) {
        colors[slot] = srgbToHex(oklchToSrgb(adjusted));
      }
    }
  }
  
  // Adjust accents for WCAG AA-large (3:1)
  for (const slot of ['base08', 'base09', 'base0A', 'base0B', 'base0C', 'base0D', 'base0E']) {
    const fg = hexToSrgb(colors[slot]);
    const cr = contrastRatio(fg, bg);
    if (cr < 3.0) {
      const oklch = srgbToOklch(fg);
      const adjusted = adjustLightnessForContrast(oklch, bg, 3.0, isDark);
      if (adjusted) {
        colors[slot] = srgbToHex(oklchToSrgb(adjusted));
      }
    }
  }
  
  return colors as Base16Palette;
}

// ============================================================================
// CONTRAST VERIFICATION
// ============================================================================

export interface ContrastReport {
  text: number;       // base05 vs base00
  comment: number;    // base03 vs base00
  accent: number;     // base0A vs base00
  wcagVerified: boolean;
}

/** Generate a contrast report for a palette */
export function verifyContrast(palette: Base16Palette): ContrastReport {
  const bg = hexToSrgb(palette.base00);
  const text = hexToSrgb(palette.base05);
  const comment = hexToSrgb(palette.base03);
  const accent = hexToSrgb(palette.base0A);
  
  const crText = contrastRatio(text, bg);
  const crComment = contrastRatio(comment, bg);
  const crAccent = contrastRatio(accent, bg);
  
  return {
    text: Math.round(crText * 100) / 100,
    comment: Math.round(crComment * 100) / 100,
    accent: Math.round(crAccent * 100) / 100,
    wcagVerified: wcagAA(crText) && wcagAALarge(crComment) && wcagAALarge(crAccent)
  };
}

// ============================================================================
// EXPORTS FOR PLUGIN USE
// ============================================================================

export {
  srgbToLinear,
  linearToSrgb,
  oklchToOklab,
  oklabToOklch
};
