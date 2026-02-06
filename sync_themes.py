#!/usr/bin/env python3
"""
Sync all 64 Prism themes from vscode/themes/ (source of truth) to all platforms.
Generates: Cursor, OpenCode, Core, Emacs, Neovim, Alacritty, Kitty, WezTerm, Windows Terminal, iTerm2, etc.
"""

import json
from pathlib import Path

PRISM_ROOT = Path(__file__).parent

def get_token_color(theme_data, scope):
    """Extract a specific token color from the theme."""
    for token in theme_data.get("tokenColors", []):
        scopes = token.get("scope", [])
        if isinstance(scopes, str):
            scopes = [scopes]
        if scope in scopes:
            return token.get("settings", {}).get("foreground", "")
    return ""

def extract_colors(vscode_theme):
    """Extract all colors from VSCode theme format."""
    c = vscode_theme.get("colors", {})
    
    # Get token colors
    comment = get_token_color(vscode_theme, "comment")
    keyword = get_token_color(vscode_theme, "keyword")
    string = get_token_color(vscode_theme, "string")
    function = get_token_color(vscode_theme, "entity.name.function")
    type_color = get_token_color(vscode_theme, "entity.name.type")
    variable = get_token_color(vscode_theme, "variable")
    constant = get_token_color(vscode_theme, "constant.numeric")
    tag = get_token_color(vscode_theme, "entity.name.tag")
    attribute = get_token_color(vscode_theme, "entity.other.attribute-name")
    
    return {
        "name": vscode_theme.get("name", "Unknown").replace("Prism ", ""),
        "type": vscode_theme.get("type", "dark"),
        "bg": c.get("editor.background", "#1a1a1a"),
        "fg": c.get("editor.foreground", "#e0e0e0"),
        "hl": c.get("editor.lineHighlightBackground", "#252525"),
        "accent": c.get("editorCursor.foreground", "#00bcd4"),
        "comment": comment or c.get("editorLineNumber.foreground", "#666666"),
        "keyword": keyword,
        "string": string,
        "function": function,
        "type": type_color,
        "variable": variable,
        "constant": constant,
        "tag": tag,
        "attribute": attribute,
        # Terminal colors
        "ansiBlack": c.get("terminal.ansiBlack", ""),
        "ansiRed": c.get("terminal.ansiRed", ""),
        "ansiGreen": c.get("terminal.ansiGreen", ""),
        "ansiYellow": c.get("terminal.ansiYellow", ""),
        "ansiBlue": c.get("terminal.ansiBlue", ""),
        "ansiMagenta": c.get("terminal.ansiMagenta", ""),
        "ansiCyan": c.get("terminal.ansiCyan", ""),
        "ansiWhite": c.get("terminal.ansiWhite", ""),
        "ansiBrightBlack": c.get("terminal.ansiBrightBlack", ""),
        "ansiBrightRed": c.get("terminal.ansiBrightRed", ""),
        "ansiBrightGreen": c.get("terminal.ansiBrightGreen", ""),
        "ansiBrightYellow": c.get("terminal.ansiBrightYellow", ""),
        "ansiBrightBlue": c.get("terminal.ansiBrightBlue", ""),
        "ansiBrightMagenta": c.get("terminal.ansiBrightMagenta", ""),
        "ansiBrightCyan": c.get("terminal.ansiBrightCyan", ""),
        "ansiBrightWhite": c.get("terminal.ansiBrightWhite", ""),
    }

def generate_emacs(slug, colors):
    """Generate Emacs theme with full syntax highlighting."""
    name = colors["name"]
    bg = colors["bg"]
    fg = colors["fg"]
    hl = colors["hl"]
    comment = colors["comment"]
    keyword = colors["keyword"] or colors["accent"]
    string = colors["string"] or keyword
    function = colors["function"] or fg
    type_color = colors["type"] or fg
    variable = colors["variable"] or fg
    constant = colors["constant"] or keyword
    
    return f''';;; {slug}-theme.el --- Prism {name} theme -*- lexical-binding: t; -*-
;;; Commentary:
;; Prism {name} color theme - Auto-generated from vscode/themes
;;; Code:

(deftheme {slug}
  "Prism {name} - A {colors["type"]} theme.")

(let ((class '((class color) (min-colors 89)))
      (bg "{bg}")
      (fg "{fg}")
      (hl "{hl}")
      (comment "{comment}")
      (keyword "{keyword}")
      (string "{string}")
      (func "{function}")
      (type "{type_color}")
      (variable "{variable}")
      (constant "{constant}"))

  (custom-theme-set-faces
   '{slug}
   `(default ((,class (:background ,bg :foreground ,fg))))
   `(cursor ((,class (:background ,keyword))))
   `(region ((,class (:background ,hl))))
   `(highlight ((,class (:background ,hl))))
   `(hl-line ((,class (:background ,hl))))
   `(fringe ((,class (:background ,bg))))
   `(line-number ((,class (:foreground ,comment))))
   `(line-number-current-line ((,class (:foreground ,fg))))
   `(font-lock-comment-face ((,class (:foreground ,comment :slant italic))))
   `(font-lock-keyword-face ((,class (:foreground ,keyword))))
   `(font-lock-string-face ((,class (:foreground ,string))))
   `(font-lock-function-name-face ((,class (:foreground ,func))))
   `(font-lock-variable-name-face ((,class (:foreground ,variable))))
   `(font-lock-type-face ((,class (:foreground ,type))))
   `(font-lock-constant-face ((,class (:foreground ,constant))))
   `(font-lock-builtin-face ((,class (:foreground ,keyword))))
   `(font-lock-preprocessor-face ((,class (:foreground ,keyword))))
   `(mode-line ((,class (:background ,hl :foreground ,fg))))
   `(mode-line-inactive ((,class (:background ,bg :foreground ,comment))))
   ;; Markdown/Org headings
   `(markdown-header-face-1 ((,class (:foreground ,keyword :weight bold))))
   `(markdown-header-face-2 ((,class (:foreground ,string :weight bold))))
   `(markdown-header-face-3 ((,class (:foreground ,func :weight bold))))
   `(markdown-bold-face ((,class (:foreground ,keyword :weight bold))))
   `(markdown-italic-face ((,class (:foreground ,string :slant italic))))
   `(org-level-1 ((,class (:foreground ,keyword :weight bold))))
   `(org-level-2 ((,class (:foreground ,string :weight bold))))
   `(org-level-3 ((,class (:foreground ,func :weight bold))))))

;;;###autoload
(when load-file-name
  (add-to-list 'custom-theme-load-path
               (file-name-as-directory (file-name-directory load-file-name))))

(provide-theme '{slug})
;;; {slug}-theme.el ends here
'''

def generate_alacritty(slug, colors):
    """Generate Alacritty theme."""
    name = colors["name"]
    return f'''# Prism {name} - Alacritty
[colors.primary]
background = "{colors["bg"]}"
foreground = "{colors["fg"]}"

[colors.cursor]
cursor = "{colors["accent"]}"
text = "{colors["bg"]}"

[colors.selection]
background = "{colors["hl"]}"
text = "{colors["fg"]}"

[colors.normal]
black = "{colors["ansiBlack"]}"
red = "{colors["ansiRed"]}"
green = "{colors["ansiGreen"]}"
yellow = "{colors["ansiYellow"]}"
blue = "{colors["ansiBlue"]}"
magenta = "{colors["ansiMagenta"]}"
cyan = "{colors["ansiCyan"]}"
white = "{colors["ansiWhite"]}"

[colors.bright]
black = "{colors["ansiBrightBlack"]}"
red = "{colors["ansiBrightRed"]}"
green = "{colors["ansiBrightGreen"]}"
yellow = "{colors["ansiBrightYellow"]}"
blue = "{colors["ansiBrightBlue"]}"
magenta = "{colors["ansiBrightMagenta"]}"
cyan = "{colors["ansiBrightCyan"]}"
white = "{colors["ansiBrightWhite"]}"
'''

def generate_kitty(slug, colors):
    """Generate Kitty theme."""
    name = colors["name"]
    return f'''# Prism {name} - Kitty
foreground {colors["fg"]}
background {colors["bg"]}
cursor {colors["accent"]}
selection_background {colors["hl"]}
selection_foreground {colors["fg"]}

color0 {colors["ansiBlack"]}
color1 {colors["ansiRed"]}
color2 {colors["ansiGreen"]}
color3 {colors["ansiYellow"]}
color4 {colors["ansiBlue"]}
color5 {colors["ansiMagenta"]}
color6 {colors["ansiCyan"]}
color7 {colors["ansiWhite"]}

color8 {colors["ansiBrightBlack"]}
color9 {colors["ansiBrightRed"]}
color10 {colors["ansiBrightGreen"]}
color11 {colors["ansiBrightYellow"]}
color12 {colors["ansiBrightBlue"]}
color13 {colors["ansiBrightMagenta"]}
color14 {colors["ansiBrightCyan"]}
color15 {colors["ansiBrightWhite"]}
'''

def generate_wezterm(slug, colors):
    """Generate WezTerm theme."""
    name = colors["name"]
    return f'''-- Prism {name} - WezTerm
return {{
  foreground = "{colors["fg"]}",
  background = "{colors["bg"]}",
  cursor_bg = "{colors["accent"]}",
  cursor_fg = "{colors["bg"]}",
  selection_bg = "{colors["hl"]}",
  selection_fg = "{colors["fg"]}",
  ansi = {{
    "{colors["ansiBlack"]}",
    "{colors["ansiRed"]}",
    "{colors["ansiGreen"]}",
    "{colors["ansiYellow"]}",
    "{colors["ansiBlue"]}",
    "{colors["ansiMagenta"]}",
    "{colors["ansiCyan"]}",
    "{colors["ansiWhite"]}",
  }},
  brights = {{
    "{colors["ansiBrightBlack"]}",
    "{colors["ansiBrightRed"]}",
    "{colors["ansiBrightGreen"]}",
    "{colors["ansiBrightYellow"]}",
    "{colors["ansiBrightBlue"]}",
    "{colors["ansiBrightMagenta"]}",
    "{colors["ansiBrightCyan"]}",
    "{colors["ansiBrightWhite"]}",
  }},
}}
'''

def generate_windows_terminal(slug, colors):
    """Generate Windows Terminal theme."""
    return {
        "name": f"Prism {colors['name']}",
        "background": colors["bg"],
        "foreground": colors["fg"],
        "cursorColor": colors["accent"],
        "selectionBackground": colors["hl"],
        "black": colors["ansiBlack"],
        "red": colors["ansiRed"],
        "green": colors["ansiGreen"],
        "yellow": colors["ansiYellow"],
        "blue": colors["ansiBlue"],
        "purple": colors["ansiMagenta"],
        "cyan": colors["ansiCyan"],
        "white": colors["ansiWhite"],
        "brightBlack": colors["ansiBrightBlack"],
        "brightRed": colors["ansiBrightRed"],
        "brightGreen": colors["ansiBrightGreen"],
        "brightYellow": colors["ansiBrightYellow"],
        "brightBlue": colors["ansiBrightBlue"],
        "brightPurple": colors["ansiBrightMagenta"],
        "brightCyan": colors["ansiBrightCyan"],
        "brightWhite": colors["ansiBrightWhite"],
    }

def generate_iterm2(slug, colors):
    """Generate iTerm2 color scheme."""
    def hex_to_rgb(h):
        h = h.lstrip('#')
        return tuple(int(h[i:i+2], 16) / 255.0 for i in (0, 2, 4))
    
    def color_entry(name, hex_color):
        r, g, b = hex_to_rgb(hex_color)
        return f'''    <key>{name}</key>
    <dict>
        <key>Color Space</key>
        <string>sRGB</string>
        <key>Red Component</key>
        <real>{r}</real>
        <key>Green Component</key>
        <real>{g}</real>
        <key>Blue Component</key>
        <real>{b}</real>
    </dict>'''
    
    entries = [
        color_entry("Background Color", colors["bg"]),
        color_entry("Foreground Color", colors["fg"]),
        color_entry("Cursor Color", colors["accent"]),
        color_entry("Selection Color", colors["hl"]),
        color_entry("Ansi 0 Color", colors["ansiBlack"]),
        color_entry("Ansi 1 Color", colors["ansiRed"]),
        color_entry("Ansi 2 Color", colors["ansiGreen"]),
        color_entry("Ansi 3 Color", colors["ansiYellow"]),
        color_entry("Ansi 4 Color", colors["ansiBlue"]),
        color_entry("Ansi 5 Color", colors["ansiMagenta"]),
        color_entry("Ansi 6 Color", colors["ansiCyan"]),
        color_entry("Ansi 7 Color", colors["ansiWhite"]),
        color_entry("Ansi 8 Color", colors["ansiBrightBlack"]),
        color_entry("Ansi 9 Color", colors["ansiBrightRed"]),
        color_entry("Ansi 10 Color", colors["ansiBrightGreen"]),
        color_entry("Ansi 11 Color", colors["ansiBrightYellow"]),
        color_entry("Ansi 12 Color", colors["ansiBrightBlue"]),
        color_entry("Ansi 13 Color", colors["ansiBrightMagenta"]),
        color_entry("Ansi 14 Color", colors["ansiBrightCyan"]),
        color_entry("Ansi 15 Color", colors["ansiBrightWhite"]),
    ]
    
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
{chr(10).join(entries)}
</dict>
</plist>
'''

def generate_helix(slug, colors):
    """Generate Helix theme."""
    name = colors["name"]
    return f'''# Prism {name} - Helix
# Place in ~/.config/helix/themes/{slug}.toml

"ui.background" = {{ bg = "{colors["bg"]}" }}
"ui.text" = "{colors["fg"]}"
"ui.text.focus" = "{colors["keyword"]}"
"ui.cursor" = {{ bg = "{colors["keyword"]}", fg = "{colors["bg"]}" }}
"ui.cursor.match" = {{ bg = "{colors["hl"]}" }}
"ui.selection" = {{ bg = "{colors["hl"]}" }}
"ui.linenr" = "{colors["comment"]}"
"ui.linenr.selected" = "{colors["fg"]}"
"ui.cursorline.primary" = {{ bg = "{colors["hl"]}" }}
"ui.statusline" = {{ fg = "{colors["fg"]}", bg = "{colors["bg"]}" }}
"ui.statusline.inactive" = {{ fg = "{colors["comment"]}", bg = "{colors["bg"]}" }}
"ui.popup" = {{ bg = "{colors["bg"]}" }}
"ui.menu" = {{ bg = "{colors["bg"]}" }}
"ui.menu.selected" = {{ bg = "{colors["hl"]}" }}
"ui.help" = {{ fg = "{colors["fg"]}", bg = "{colors["bg"]}" }}

"comment" = {{ fg = "{colors["comment"]}", modifiers = ["italic"] }}
"keyword" = {{ fg = "{colors["keyword"]}", modifiers = ["bold"] }}
"keyword.control" = "{colors["keyword"]}"
"keyword.function" = "{colors["keyword"]}"
"keyword.return" = "{colors["keyword"]}"
"keyword.exception" = "{colors["keyword"]}"
"keyword.operator" = "{colors["keyword"]}"

"string" = "{colors["string"]}"
"string.special" = "{colors["string"]}"

"function" = "{colors["function"]}"
"function.builtin" = "{colors["function"]}"
"function.method" = "{colors["function"]}"
"function.macro" = "{colors["function"]}"

"constant" = "{colors["constant"]}"
"constant.numeric" = "{colors["constant"]}"
"constant.character" = "{colors["string"]}"
"constant.builtin" = "{colors["constant"]}"

"type" = "{colors["type"]}"
"type.builtin" = "{colors["type"]}"

"variable" = "{colors["variable"]}"
"variable.builtin" = "{colors["keyword"]}"
"variable.parameter" = "{colors["variable"]}"

"attribute" = "{colors["attribute"]}"
"namespace" = "{colors["type"]}"

"operator" = "{colors["keyword"]}"
"punctuation" = "{colors["fg"]}"
"punctuation.delimiter" = "{colors["fg"]}"
"punctuation.bracket" = "{colors["fg"]}"

"label" = "{colors["keyword"]}"
"tag" = "{colors["tag"]}"

"markup.heading" = {{ fg = "{colors["keyword"]}", modifiers = ["bold"] }}
"markup.bold" = {{ modifiers = ["bold"] }}
"markup.italic" = {{ modifiers = ["italic"] }}
"markup.link.url" = "{colors["keyword"]}"
"markup.link.text" = "{colors["string"]}"
"markup.raw" = "{colors["string"]}"

"diff.plus" = "{colors["ansiGreen"]}"
"diff.minus" = "{colors["ansiRed"]}"
"diff.delta" = "{colors["ansiYellow"]}"

[palette]
background = "{colors["bg"]}"
foreground = "{colors["fg"]}"
accent = "{colors["accent"]}"
'''

def generate_zed(slug, colors):
    """Generate Zed theme."""
    name = colors["name"]
    theme_type = colors["type"]
    return json.dumps({
        "$schema": "https://zed.dev/schema/themes/v0.1.0.json",
        "name": f"Prism {name}",
        "author": "Prism Theme System",
        "themes": [{
            "name": f"Prism {name}",
            "appearance": theme_type,
            "style": {
                "background": colors["bg"],
                "editor.background": colors["bg"],
                "editor.foreground": colors["fg"],
                "editor.gutter.background": colors["bg"],
                "editor.line_highlight.background": colors["hl"],
                "editor.active_line_number": colors["fg"],
                "editor.wrap_guide": colors["comment"],
                "terminal.background": colors["bg"],
                "terminal.foreground": colors["fg"],
                "terminal.ansi.black": colors["ansiBlack"],
                "terminal.ansi.red": colors["ansiRed"],
                "terminal.ansi.green": colors["ansiGreen"],
                "terminal.ansi.yellow": colors["ansiYellow"],
                "terminal.ansi.blue": colors["ansiBlue"],
                "terminal.ansi.magenta": colors["ansiMagenta"],
                "terminal.ansi.cyan": colors["ansiCyan"],
                "terminal.ansi.white": colors["ansiWhite"],
                "syntax": {
                    "comment": {"color": colors["comment"], "font_style": "italic"},
                    "keyword": {"color": colors["keyword"], "font_weight": 600},
                    "string": {"color": colors["string"]},
                    "function": {"color": colors["function"]},
                    "number": {"color": colors["constant"]},
                    "type": {"color": colors["type"]},
                    "variable": {"color": colors["variable"]},
                    "constant": {"color": colors["constant"]},
                    "attribute": {"color": colors["attribute"]},
                    "property": {"color": colors["variable"]},
                    "punctuation": {"color": colors["fg"]},
                    "operator": {"color": colors["keyword"]},
                }
            }
        }]
    }, indent=2)

def generate_tmux(slug, colors):
    """Generate tmux theme."""
    name = colors["name"]
    return f'''# Prism {name} - tmux
# Add to ~/.tmux.conf or source this file

# Status bar
set -g status-style "bg={colors["bg"]},fg={colors["fg"]}"
set -g status-left-style "bg={colors["bg"]},fg={colors["keyword"]}"
set -g status-right-style "bg={colors["bg"]},fg={colors["comment"]}"

# Window status
set -g window-status-style "bg={colors["bg"]},fg={colors["comment"]}"
set -g window-status-current-style "bg={colors["hl"]},fg={colors["keyword"]}"

# Pane borders
set -g pane-border-style "fg={colors["comment"]}"
set -g pane-active-border-style "fg={colors["keyword"]}"

# Message styling
set -g message-style "bg={colors["hl"]},fg={colors["fg"]}"
set -g message-command-style "bg={colors["hl"]},fg={colors["fg"]}"

# Mode styling
set -g mode-style "bg={colors["hl"]},fg={colors["fg"]}"
'''

def generate_starship(slug, colors):
    """Generate Starship prompt theme."""
    name = colors["name"]
    return f'''# Prism {name} - Starship prompt colors
# Add to ~/.config/starship.toml

[palettes.prism_{slug}]
background = "{colors["bg"]}"
foreground = "{colors["fg"]}"
accent = "{colors["keyword"]}"
muted = "{colors["comment"]}"
success = "{colors["ansiGreen"]}"
warning = "{colors["ansiYellow"]}"
error = "{colors["ansiRed"]}"
info = "{colors["ansiBlue"]}"

# Example usage:
# palette = "prism_{slug}"
# 
# [character]
# success_symbol = "[❯](accent)"
# error_symbol = "[❯](error)"
'''

def main():
    vscode_dir = PRISM_ROOT / "vscode" / "themes"
    cursor_dir = PRISM_ROOT / "cursor" / "themes"
    opencode_dir = PRISM_ROOT / "opencode" / "themes"
    core_dir = PRISM_ROOT / "core" / "themes"
    emacs_dir = PRISM_ROOT / "emacs" / "themes"
    alacritty_dir = PRISM_ROOT / "terminal" / "alacritty"
    kitty_dir = PRISM_ROOT / "terminal" / "kitty"
    wezterm_dir = PRISM_ROOT / "terminal" / "wezterm"
    wt_dir = PRISM_ROOT / "terminal" / "windows-terminal"
    iterm_dir = PRISM_ROOT / "terminal" / "iterm2"
    helix_dir = PRISM_ROOT / "terminal" / "helix"
    zed_dir = PRISM_ROOT / "terminal" / "zed"
    tmux_dir = PRISM_ROOT / "terminal" / "tmux"
    starship_dir = PRISM_ROOT / "terminal" / "starship"
    neovim_presets_dir = PRISM_ROOT / "neovim" / "presets"
    
    # Ensure dirs exist
    for d in [cursor_dir, opencode_dir, emacs_dir, alacritty_dir, kitty_dir, 
              wezterm_dir, wt_dir, iterm_dir, helix_dir, zed_dir, tmux_dir,
              starship_dir, neovim_presets_dir]:
        d.mkdir(parents=True, exist_ok=True)
    
    neovim_presets = {}
    themes = sorted(vscode_dir.glob("*.json"))
    print(f"Found {len(themes)} VSCode themes (source of truth)")
    
    for theme_file in themes:
        slug = theme_file.stem
        
        with open(theme_file, encoding="utf-8") as f:
            vscode_data = json.load(f)
        
        colors = extract_colors(vscode_data)
        print(f"  {slug}: syncing...")
        
        # 1. Cursor (exact copy)
        with open(cursor_dir / f"{slug}.json", "w", encoding="utf-8") as f:
            json.dump(vscode_data, f, indent=2)
        
        # 2. OpenCode (exact copy)
        with open(opencode_dir / f"{slug}.json", "w", encoding="utf-8") as f:
            json.dump(vscode_data, f, indent=2)
        
        # 3. Core (with prism- prefix)
        with open(core_dir / f"prism-{slug}.json", "w", encoding="utf-8") as f:
            json.dump(vscode_data, f, indent=2)
        
        # 4. Emacs
        emacs_content = generate_emacs(slug, colors)
        with open(emacs_dir / f"{slug}-theme.el", "w", encoding="utf-8") as f:
            f.write(emacs_content)
        
        # 5. Alacritty
        alacritty_content = generate_alacritty(slug, colors)
        with open(alacritty_dir / f"{slug}.toml", "w", encoding="utf-8") as f:
            f.write(alacritty_content)
        
        # 6. Kitty
        kitty_content = generate_kitty(slug, colors)
        with open(kitty_dir / f"{slug}.conf", "w", encoding="utf-8") as f:
            f.write(kitty_content)
        
        # 7. WezTerm
        wezterm_content = generate_wezterm(slug, colors)
        with open(wezterm_dir / f"{slug}.lua", "w", encoding="utf-8") as f:
            f.write(wezterm_content)
        
        # 8. Windows Terminal
        wt_theme = generate_windows_terminal(slug, colors)
        with open(wt_dir / f"{slug}.json", "w", encoding="utf-8") as f:
            json.dump(wt_theme, f, indent=2)
        
        # 9. iTerm2
        iterm_content = generate_iterm2(slug, colors)
        with open(iterm_dir / f"{slug}.itermcolors", "wb") as f:
            f.write(iterm_content)
        
        # 10. Helix
        helix_content = generate_helix(slug, colors)
        with open(helix_dir / f"{slug}.toml", "w", encoding="utf-8") as f:
            f.write(helix_content)
        
        # 11. Zed
        zed_content = generate_zed(slug, colors)
        with open(zed_dir / f"{slug}.json", "w", encoding="utf-8") as f:
            f.write(zed_content)
        
        # 12. tmux
        tmux_content = generate_tmux(slug, colors)
        with open(tmux_dir / f"{slug}.conf", "w", encoding="utf-8") as f:
            f.write(tmux_content)
        
        # 13. Starship
        starship_content = generate_starship(slug, colors)
        with open(starship_dir / f"{slug}.toml", "w", encoding="utf-8") as f:
            f.write(starship_content)
        
        # 14. Neovim preset
        neovim_presets[slug] = {
            "name": colors["name"],
            "bg": colors["bg"],
            "fg": colors["fg"],
            "accent": colors["accent"],
            "comment": colors["comment"],
            "keyword": colors["keyword"],
            "string": colors["string"],
            "function": colors["function"],
            "type": colors["type"],
        }
    
    # Write Neovim presets.lua
    nvim_presets_path = PRISM_ROOT / "neovim" / "lua" / "prism" / "presets.lua"
    nvim_presets_path.parent.mkdir(parents=True, exist_ok=True)
    
    nvim_lines = [
        "-- PRISM Theme Presets for Neovim",
        f"-- Auto-generated from vscode/themes - {len(neovim_presets)} themes",
        "",
        "local M = {}",
        "",
        "M.presets = {"
    ]
    for slug, p in sorted(neovim_presets.items()):
        nvim_lines.append(f'  ["{slug}"] = {{')
        nvim_lines.append(f'    name = "{p["name"]}",')
        nvim_lines.append(f'    bg = "{p["bg"]}",')
        nvim_lines.append(f'    fg = "{p["fg"]}",')
        nvim_lines.append(f'    accent = "{p["accent"]}",')
        nvim_lines.append(f'    comment = "{p["comment"]}",')
        nvim_lines.append(f'    keyword = "{p["keyword"]}",')
        nvim_lines.append(f'    string = "{p["string"]}",')
        nvim_lines.append(f'    func = "{p["function"]}",')
        nvim_lines.append(f'    type = "{p["type"]}",')
        nvim_lines.append('  },')
    nvim_lines.append("}")
    nvim_lines.append("")
    nvim_lines.append("return M")
    nvim_lines.append("")
    
    with open(nvim_presets_path, "w", encoding="utf-8") as f:
        f.write("\n".join(nvim_lines))
    
    # Also write JSON presets for neovim
    with open(neovim_presets_dir / "all_themes.json", "w", encoding="utf-8") as f:
        json.dump(neovim_presets, f, indent=2)
    
    print(f"\n{'='*60}")
    print(f"SYNC COMPLETE - {len(themes)} themes")
    print(f"{'='*60}")
    print(f"  VSCode:           {vscode_dir} (source)")
    print(f"  Cursor:           {cursor_dir}")
    print(f"  OpenCode:         {opencode_dir}")
    print(f"  Core:             {core_dir}/prism-*.json")
    print(f"  Emacs:            {emacs_dir}")
    print(f"  Neovim:           {nvim_presets_path}")
    print(f"  Alacritty:        {alacritty_dir}")
    print(f"  Kitty:            {kitty_dir}")
    print(f"  WezTerm:          {wezterm_dir}")
    print(f"  Windows Terminal: {wt_dir}")
    print(f"  iTerm2:           {iterm_dir}")
    print(f"  Helix:            {helix_dir}")
    print(f"  Zed:              {zed_dir}")
    print(f"  tmux:             {tmux_dir}")
    print(f"  Starship:         {starship_dir}")

if __name__ == "__main__":
    main()
