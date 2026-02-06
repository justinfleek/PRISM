#!/usr/bin/env python3
"""
Generate Neovim presets from VSCode themes.

Extracts colors from VSCode JSON themes and generates lua/prism/presets.lua
"""

import json
import os
from pathlib import Path

VSCODE_THEMES_DIR = Path(__file__).parent.parent / "vscode" / "themes"
NEOVIM_PRESETS_FILE = Path(__file__).parent.parent / "neovim" / "lua" / "prism" / "presets.lua"

def extract_base16_from_vscode(theme_path: Path) -> dict:
    """Extract base16-style colors from a VSCode theme."""
    with open(theme_path) as f:
        theme = json.load(f)
    
    colors = theme.get("colors", {})
    tokens = theme.get("tokenColors", [])
    
    # Extract key colors
    bg = colors.get("editor.background", "#000000")
    fg = colors.get("editor.foreground", "#ffffff")
    comment = colors.get("editorLineNumber.foreground", "#666666")
    accent = colors.get("editorCursor.foreground", "#ffffff")
    
    # Get surface color (sidebar bg or slightly lighter than bg)
    surface = colors.get("sideBar.background", bg)
    
    # Get selection
    selection = colors.get("editor.selectionBackground", "#444444").replace("40", "")[:7]
    
    # Extract token colors
    keyword = accent
    string = fg
    number = fg
    func = fg
    tag = accent
    
    for token in tokens:
        scope = token.get("scope", [])
        if isinstance(scope, str):
            scope = [scope]
        settings = token.get("settings", {})
        color = settings.get("foreground")
        if not color:
            continue
            
        if "keyword" in scope or "storage.type" in scope:
            keyword = color
        elif "string" in scope:
            string = color
        elif "constant.numeric" in scope:
            number = color
        elif "entity.name.function" in scope or "support.function" in scope:
            func = color
        elif "entity.name.tag" in scope:
            tag = color
    
    # Build base16 palette
    # Try to create a reasonable gradient
    return {
        "base00": bg,
        "base01": surface,
        "base02": selection if len(selection) == 7 else surface,
        "base03": comment,
        "base04": comment,  # slightly brighter comment
        "base05": fg,
        "base06": fg,
        "base07": fg,
        "base08": tag,      # errors/tags
        "base09": number,   # numbers/warnings
        "base0A": accent,   # hero/accent
        "base0B": string,   # strings/success
        "base0C": func,     # info/support
        "base0D": func,     # links/functions
        "base0E": keyword,  # keywords/special
        "base0F": comment,  # deprecated
    }

def theme_name_to_lua_key(name: str) -> str:
    """Convert theme filename to Lua table key."""
    return name.replace(".json", "").replace("-", "_").replace(" ", "_")

def generate_presets_lua():
    """Generate the presets.lua file from all VSCode themes."""
    
    themes = {}
    
    for theme_file in sorted(VSCODE_THEMES_DIR.glob("*.json")):
        try:
            key = theme_name_to_lua_key(theme_file.name)
            palette = extract_base16_from_vscode(theme_file)
            
            # Determine mode from theme type
            with open(theme_file) as f:
                theme_data = json.load(f)
            mode = "light" if theme_data.get("type") == "light" else "dark"
            
            themes[key] = {
                "mode": mode,
                "palette": palette
            }
        except Exception as e:
            print(f"Error processing {theme_file}: {e}")
    
    # Generate Lua code
    lua_code = '''-- PRISM Theme Presets for Neovim
-- Auto-generated from VSCode themes - DO NOT EDIT MANUALLY
-- Run: python scripts/generate_neovim_presets.py
--
-- 64 themes with OKLCH color science and WCAG verification

local M = {}

-- ============================================================================
-- HELPER: Build preset structure from palette
-- ============================================================================

local function make_preset(name, mode, palette)
  return {
    name = name,
    mode = mode,
    palette = palette,
    syntax = {
      comment = palette.base03,
      string = palette.base0B,
      number = palette.base09,
      keyword = palette.base0E,
      func = palette.base0D,
      type = palette.base0A,
      variable = palette.base05,
      property = palette.base05,
      operator = palette.base04,
      punctuation = palette.base04,
      tag = palette.base08,
      attribute = palette.base09,
    },
    ui = {
      bg = palette.base00,
      fg = palette.base05,
      accent = palette.base0A,
      error = palette.base08,
      warning = palette.base09,
      success = palette.base0B,
      info = palette.base0D,
    },
  }
end

-- ============================================================================
-- THEME PRESETS (64 themes)
-- ============================================================================

'''
    
    for key, data in sorted(themes.items()):
        palette = data["palette"]
        mode = data["mode"]
        
        lua_code += f'M.{key} = make_preset("{key}", "{mode}", {{\n'
        lua_code += f'  base00 = "{palette["base00"]}", base01 = "{palette["base01"]}", base02 = "{palette["base02"]}", base03 = "{palette["base03"]}",\n'
        lua_code += f'  base04 = "{palette["base04"]}", base05 = "{palette["base05"]}", base06 = "{palette["base06"]}", base07 = "{palette["base07"]}",\n'
        lua_code += f'  base08 = "{palette["base08"]}", base09 = "{palette["base09"]}", base0A = "{palette["base0A"]}", base0B = "{palette["base0B"]}",\n'
        lua_code += f'  base0C = "{palette["base0C"]}", base0D = "{palette["base0D"]}", base0E = "{palette["base0E"]}", base0F = "{palette["base0F"]}",\n'
        lua_code += '})\n\n'
    
    lua_code += '''-- ============================================================================
-- DYNAMIC GENERATION (lazy load colors.lua only when needed)
-- ============================================================================

--- Generate a custom preset dynamically
--- @param name string Preset name
--- @param config table Configuration for colors.generate_palette
--- @return table Preset structure
function M.generate(name, config)
  local colors = require("prism.colors")
  local palette = colors.generate_palette(config)
  return make_preset(name, config.theme or "dark", palette)
end

return M
'''
    
    # Write the file
    NEOVIM_PRESETS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(NEOVIM_PRESETS_FILE, 'w') as f:
        f.write(lua_code)
    
    print(f"Generated {len(themes)} theme presets to {NEOVIM_PRESETS_FILE}")

if __name__ == "__main__":
    generate_presets_lua()
