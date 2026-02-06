-- PRISM Color Core - Neovim Implementation
-- Formally verified color science matching Lean4 proofs
--
-- Features:
-- - OKLCH perceptual color space
-- - WCAG 2.1 contrast verification
-- - Monochromatic and Golden Angle generation modes
-- - All calculations use RADIANS internally
--
-- Mathematical Constants:
-- - PI = 3.14159265358979...
-- - PHI (golden ratio) = 1.6180339887498948...
-- - GOLDEN_ANGLE_RAD = 2*PI / PHI^2 = 2.399963229728653...
-- - GOLDEN_ANGLE_DEG = 137.5077640500378...

local M = {}

-- ============================================================================
-- MATHEMATICAL CONSTANTS
-- ============================================================================

M.PI = math.pi
M.TAU = 2 * M.PI
M.PHI = (1 + math.sqrt(5)) / 2
M.GOLDEN_ANGLE_RAD = M.TAU / (M.PHI * M.PHI)  -- ~2.3999632297 radians
M.GOLDEN_ANGLE_DEG = M.GOLDEN_ANGLE_RAD * (180 / M.PI)  -- ~137.5077640500378 degrees
M.PERFECT_BLUE = 211  -- The default hero hue

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

--- Convert degrees to radians
---@param deg number Angle in degrees
---@return number Angle in radians
function M.to_radians(deg)
  return deg * (M.PI / 180)
end

--- Convert radians to degrees
---@param rad number Angle in radians
---@return number Angle in degrees
function M.to_degrees(rad)
  return rad * (180 / M.PI)
end

--- Normalize angle to [0, 360)
---@param deg number Angle in degrees
---@return number Normalized angle in [0, 360)
function M.normalize_hue(deg)
  local normalized = deg % 360
  return normalized < 0 and normalized + 360 or normalized
end

--- Clamp value to [min, max]
---@param value number Value to clamp
---@param min number Minimum
---@param max number Maximum
---@return number Clamped value
function M.clamp(value, min, max)
  return math.max(min, math.min(max, value))
end

-- ============================================================================
-- GOLDEN ANGLE HUE GENERATION
-- ============================================================================

--- Generate the nth hue using golden angle rotation
--- All calculations performed in RADIANS for precision
---@param base_hue number Starting hue in degrees
---@param n number Index in sequence (0-indexed)
---@return number Hue in degrees [0, 360)
function M.nth_golden_hue(base_hue, n)
  local base_rad = M.to_radians(base_hue)
  local rotation_rad = n * M.GOLDEN_ANGLE_RAD
  local result_rad = base_rad + rotation_rad
  -- Normalize to [0, 2*PI)
  local normalized_rad = result_rad % M.TAU
  if normalized_rad < 0 then
    normalized_rad = normalized_rad + M.TAU
  end
  return M.to_degrees(normalized_rad)
end

--- Generate n hues distributed by golden angle
---@param base_hue number Starting hue in degrees
---@param count number Number of hues to generate
---@return table Array of hues in degrees
function M.generate_golden_hues(base_hue, count)
  local hues = {}
  for i = 0, count - 1 do
    hues[i + 1] = M.nth_golden_hue(base_hue, i)
  end
  return hues
end

-- ============================================================================
-- COLOR SPACE CONVERSIONS (matches Lean4 proofs)
-- ============================================================================

--- sRGB gamma expansion (sRGB -> Linear)
--- Proven bijective in Lean4: srgb_linear_roundtrip
---@param c number sRGB component [0,1]
---@return number Linear RGB component
function M.srgb_to_linear(c)
  if c <= 0.04045 then
    return c / 12.92
  else
    return math.pow((c + 0.055) / 1.055, 2.4)
  end
end

--- Linear to sRGB gamma compression
---@param c number Linear RGB component
---@return number sRGB component [0,1]
function M.linear_to_srgb(c)
  if c <= 0.0031308 then
    return c * 12.92
  else
    return 1.055 * math.pow(c, 1 / 2.4) - 0.055
  end
end

--- sRGB to OKLAB conversion
--- Uses published OKLAB matrix (Bjorn Ottosson, 2020)
---@param r number Red [0,1]
---@param g number Green [0,1]
---@param b number Blue [0,1]
---@return number, number, number L, a, b (OKLAB)
function M.srgb_to_oklab(r, g, b)
  -- sRGB to linear
  local rl = M.srgb_to_linear(r)
  local gl = M.srgb_to_linear(g)
  local bl = M.srgb_to_linear(b)
  
  -- Linear RGB to LMS
  local l = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl
  local m = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl
  local s = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl
  
  -- Cube root (perceptual linearization)
  local l_ = M.cbrt(l)
  local m_ = M.cbrt(m)
  local s_ = M.cbrt(s)
  
  -- LMS to OKLAB
  local L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
  local a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
  local b_val = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
  
  return L, a, b_val
end

--- Cube root function
---@param x number
---@return number
function M.cbrt(x)
  if x >= 0 then
    return math.pow(x, 1/3)
  else
    return -math.pow(-x, 1/3)
  end
end

--- OKLAB to sRGB conversion
---@param L number Lightness [0,1]
---@param a number Green-red axis
---@param b number Blue-yellow axis
---@return number, number, number r, g, b (sRGB [0,1])
function M.oklab_to_srgb(L, a, b)
  -- OKLAB to LMS'
  local l_ = L + 0.3963377774 * a + 0.2158037573 * b
  local m_ = L - 0.1055613458 * a - 0.0638541728 * b
  local s_ = L - 0.0894841775 * a - 1.2914855480 * b
  
  -- Cube (inverse of cube root)
  local l = l_ * l_ * l_
  local m = m_ * m_ * m_
  local s = s_ * s_ * s_
  
  -- LMS to linear RGB
  local rl = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  local gl = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  local bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
  
  -- Apply gamma and clamp to gamut
  local r = M.clamp(M.linear_to_srgb(math.max(0, rl)), 0, 1)
  local g = M.clamp(M.linear_to_srgb(math.max(0, gl)), 0, 1)
  local b_val = M.clamp(M.linear_to_srgb(math.max(0, bl)), 0, 1)
  
  return r, g, b_val
end

--- OKLCH to OKLAB conversion (cylindrical to cartesian)
--- Uses RADIANS internally
---@param L number Lightness [0,1]
---@param C number Chroma
---@param H number Hue in degrees
---@return number, number, number L, a, b (OKLAB)
function M.oklch_to_oklab(L, C, H)
  local h_rad = M.to_radians(H)  -- Convert to radians for trig
  local a = C * math.cos(h_rad)
  local b = C * math.sin(h_rad)
  return L, a, b
end

--- OKLAB to OKLCH conversion (cartesian to cylindrical)
---@param L number Lightness
---@param a number Green-red axis
---@param b number Blue-yellow axis
---@return number, number, number L, C, H (OKLCH, hue in degrees)
function M.oklab_to_oklch(L, a, b)
  local C = math.sqrt(a * a + b * b)
  local H = M.to_degrees(math.atan2(b, a))  -- Convert result to degrees
  if H < 0 then
    H = H + 360
  end
  return L, C, H
end

-- ============================================================================
-- PUBLIC COLOR API
-- ============================================================================

--- Convert OKLCH to sRGB
---@param L number Lightness [0,1]
---@param C number Chroma
---@param H number Hue in degrees
---@return number, number, number r, g, b (sRGB [0,1])
function M.oklch_to_srgb(L, C, H)
  local okL, a, b = M.oklch_to_oklab(L, C, H)
  return M.oklab_to_srgb(okL, a, b)
end

--- Convert sRGB to OKLCH
---@param r number Red [0,1]
---@param g number Green [0,1]
---@param b number Blue [0,1]
---@return number, number, number L, C, H (OKLCH, hue in degrees)
function M.srgb_to_oklch(r, g, b)
  local L, a, b_val = M.srgb_to_oklab(r, g, b)
  return M.oklab_to_oklch(L, a, b_val)
end

--- Convert sRGB to hex string
---@param r number Red [0,1]
---@param g number Green [0,1]
---@param b number Blue [0,1]
---@return string Hex color string (#RRGGBB)
function M.srgb_to_hex(r, g, b)
  local ri = math.floor(r * 255 + 0.5)
  local gi = math.floor(g * 255 + 0.5)
  local bi = math.floor(b * 255 + 0.5)
  return string.format("#%02x%02x%02x", ri, gi, bi)
end

--- Convert hex string to sRGB
---@param hex string Hex color string (#RRGGBB or RRGGBB)
---@return number, number, number r, g, b (sRGB [0,1])
function M.hex_to_srgb(hex)
  hex = hex:gsub("^#", "")
  local r = tonumber(hex:sub(1, 2), 16) / 255
  local g = tonumber(hex:sub(3, 4), 16) / 255
  local b = tonumber(hex:sub(5, 6), 16) / 255
  return r, g, b
end

--- Convert OKLCH to hex string
---@param L number Lightness [0,1]
---@param C number Chroma
---@param H number Hue in degrees
---@return string Hex color string
function M.oklch_to_hex(L, C, H)
  local r, g, b = M.oklch_to_srgb(L, C, H)
  return M.srgb_to_hex(r, g, b)
end

-- ============================================================================
-- WCAG CONTRAST (matches Lean4 proofs)
-- ============================================================================

--- Calculate relative luminance per WCAG 2.1
--- Proven bounded in [0,1] in Lean4
---@param r number Red [0,1]
---@param g number Green [0,1]
---@param b number Blue [0,1]
---@return number Relative luminance [0,1]
function M.relative_luminance(r, g, b)
  local rl = M.srgb_to_linear(r)
  local gl = M.srgb_to_linear(g)
  local bl = M.srgb_to_linear(b)
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl
end

--- Calculate WCAG contrast ratio
--- Proven properties in Lean4:
--- - Result >= 1 (contrastRatio_ge_one)
--- - Symmetric (contrastRatio_symm)
--- - Maximum is 21:1 (contrastRatio_max)
---@param fg_r number Foreground red [0,1]
---@param fg_g number Foreground green [0,1]
---@param fg_b number Foreground blue [0,1]
---@param bg_r number Background red [0,1]
---@param bg_g number Background green [0,1]
---@param bg_b number Background blue [0,1]
---@return number Contrast ratio (1-21)
function M.contrast_ratio(fg_r, fg_g, fg_b, bg_r, bg_g, bg_b)
  local l1 = M.relative_luminance(fg_r, fg_g, fg_b)
  local l2 = M.relative_luminance(bg_r, bg_g, bg_b)
  local lighter = math.max(l1, l2)
  local darker = math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
end

--- Calculate contrast ratio from hex colors
---@param fg string Foreground hex
---@param bg string Background hex
---@return number Contrast ratio
function M.contrast_ratio_hex(fg, bg)
  local fg_r, fg_g, fg_b = M.hex_to_srgb(fg)
  local bg_r, bg_g, bg_b = M.hex_to_srgb(bg)
  return M.contrast_ratio(fg_r, fg_g, fg_b, bg_r, bg_g, bg_b)
end

--- Check WCAG AA compliance (4.5:1 for normal text)
---@param cr number Contrast ratio
---@return boolean
function M.wcag_aa(cr)
  return cr >= 4.5
end

--- Check WCAG AA compliance for large text (3:1)
---@param cr number Contrast ratio
---@return boolean
function M.wcag_aa_large(cr)
  return cr >= 3.0
end

--- Check WCAG AAA compliance (7:1)
---@param cr number Contrast ratio
---@return boolean
function M.wcag_aaa(cr)
  return cr >= 7.0
end

-- ============================================================================
-- PALETTE GENERATION
-- ============================================================================

--- Generation modes
M.MODE = {
  MONOCHROMATIC = "monochromatic",  -- All colors share hero hue
  GOLDEN = "golden",                 -- Golden angle distribution
  HYBRID = "hybrid",                 -- Backgrounds mono, accents golden
}

--- Default configuration
M.default_config = {
  mode = M.MODE.HYBRID,
  hero_hue = M.PERFECT_BLUE,
  chroma_intensity = 1.0,
  monitor = "oled",  -- "oled" or "lcd"
  theme = "dark",    -- "dark" or "light"
}

--- Lightness targets for dark mode
M.DARK_LIGHTNESS = {
  base00 = 0.00, base01 = 0.12, base02 = 0.18, base03 = 0.45,
  base04 = 0.55, base05 = 0.80, base06 = 0.90, base07 = 0.97,
  base08 = 0.55, base09 = 0.62, base0A = 0.70, base0B = 0.75,
  base0C = 0.78, base0D = 0.82, base0E = 0.85, base0F = 0.50,
}

--- Lightness targets for light mode
M.LIGHT_LIGHTNESS = {
  base00 = 0.98, base01 = 0.94, base02 = 0.88, base03 = 0.55,
  base04 = 0.45, base05 = 0.25, base06 = 0.18, base07 = 0.10,
  base08 = 0.50, base09 = 0.45, base0A = 0.40, base0B = 0.38,
  base0C = 0.35, base0D = 0.32, base0E = 0.30, base0F = 0.55,
}

--- Chroma multipliers
M.CHROMA_MULT = {
  base00 = 0.08, base01 = 0.10, base02 = 0.12, base03 = 0.15,
  base04 = 0.08, base05 = 0.06, base06 = 0.04, base07 = 0.02,
  base08 = 1.00, base09 = 0.95, base0A = 1.00, base0B = 0.90,
  base0C = 0.85, base0D = 0.88, base0E = 0.92, base0F = 0.40,
}

--- Generate a Base16 palette
--- Merge tables (pure Lua, no vim dependency)
local function tbl_extend(base, override)
  local result = {}
  for k, v in pairs(base) do result[k] = v end
  if override then
    for k, v in pairs(override) do result[k] = v end
  end
  return result
end

---@param config table|nil Optional configuration
---@return table Palette with base00-base0F hex values
function M.generate_palette(config)
  config = tbl_extend(M.default_config, config or {})
  
  local lightness = config.theme == "dark" and M.DARK_LIGHTNESS or M.LIGHT_LIGHTNESS
  local max_chroma = 0.18 * config.chroma_intensity
  
  -- Adjust for OLED
  if config.theme == "dark" and config.monitor == "oled" then
    lightness = tbl_extend(lightness, {
      base00 = 0.0,
      base01 = math.max(0, lightness.base01 - 0.04),
      base02 = math.max(0, lightness.base02 - 0.03),
    })
  end
  
  -- Generate golden hues for accents
  local golden_hues = M.generate_golden_hues(config.hero_hue, 8)
  
  local palette = {}
  local slots = {
    "base00", "base01", "base02", "base03",
    "base04", "base05", "base06", "base07",
    "base08", "base09", "base0A", "base0B",
    "base0C", "base0D", "base0E", "base0F",
  }
  
  for _, slot in ipairs(slots) do
    local L = lightness[slot]
    local chroma_mult = M.CHROMA_MULT[slot]
    
    -- Determine hue based on mode
    local H
    local accent_index = tonumber(slot:sub(-1), 16) - 8  -- 0-7 for accents
    local is_accent = accent_index >= 0 and accent_index <= 7
    
    if config.mode == M.MODE.MONOCHROMATIC then
      H = config.hero_hue
    elseif config.mode == M.MODE.GOLDEN then
      H = is_accent and golden_hues[accent_index + 1] or golden_hues[1]
    else  -- hybrid
      H = is_accent and golden_hues[accent_index + 1] or config.hero_hue
    end
    
    local C = max_chroma * chroma_mult
    palette[slot] = M.oklch_to_hex(M.clamp(L, 0, 1), C, H)
  end
  
  return palette
end

return M
