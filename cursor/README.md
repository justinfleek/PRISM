# PRISM - 64 Color Themes for Cursor

**64 curated color themes** for [Cursor](https://cursor.sh) - the AI-first code editor.

Every theme is hand-crafted with WCAG AA verified contrast ratios.

## Installation

### From VSIX
1. Download `prism-themes-cursor-2.0.0.vsix` from releases (or build with `npm run package` in this folder).
2. In Cursor: **`Ctrl+Shift+P`** → **Extensions: Install from VSIX** → select the `.vsix` file.
3. **`Ctrl+K Ctrl+T`** to open the theme picker and choose a **Prism** theme (e.g. Prism Nord Aurora). The editor and effects panel use the selected theme’s colors.

## Visual Effects

Access via `Ctrl+Alt+P` → "Prism: Open Effects Panel"

- **Smooth Caret** - Silky cursor animation (native)
- **Cursor Glow** - Current-line highlight using the theme’s color (native `editor.renderLineHighlight`)
- **Rainbow Brackets** - Colorful bracket pairs (native)
- **Bracket Highlight** - Bracket pair guides and native matching-bracket highlight (theme colors)
- **Syntax Pulse** – Error ranges highlighted (decoration; may not render in all hosts)

Effects use native editor settings. The effects panel (toggles, button, headings) is styled from the **currently selected Prism theme**.

## 64 Themes

### Luxury
Nero Marquina, Midnight Sapphire, Obsidian Rose Gold, Champagne Noir, Emerald Velvet, Diamond Dust

### Glass
Aurora Glass, Zen Garden, Tide Pool, Soft Charcoal

### Harmonious
Ocean Depths, Forest Canopy, Lavender Dusk, Slate & Gold, Ember Hearth, Constellation Map

### Wild
Neon Nexus, Blood Moon, Vaporwave Sunset, Acid Rain, Ultraviolet, Holographic, Cyber Noir, Synthwave 84

### Classic Reimagined
Catppuccin Mocha, Gruvbox Material, Moonlight II, Nord Aurora, One Dark Pro, Night Owl, Tokyo Night Bento

### Nature
Forest, Ocean, Coastal, Tropical, Arctic, Sunset, Inferno, Mint, Grape, Rose, Rose Gold

### Light
Biopic, Ghost, Tessier, Neoform, Minimal, Faded Glory, Memphis, Github

## Color Science

- **WCAG 2.1 AA Compliance** - >=4.5:1 contrast for normal text
- **OLED Safe** - Minimum L=11% to prevent smearing
- **Harmonious Palettes** - Mathematical color relationships

## License

MIT - Created by j-pyxal | [Omega Agentic](https://omega.ms)
