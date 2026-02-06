# PRISM - Where every color has purpose.

**64 curated color themes** with visual effects for VS Code, Cursor, Neovim, Emacs, OpenCode, and terminal emulators.

Every theme is hand-crafted with WCAG AA verified contrast ratios and carefully balanced color harmonies.

![Themes](https://img.shields.io/badge/themes-64-brightgreen)
![WCAG AA](https://img.shields.io/badge/contrast-WCAG%20AA-green)
![Platforms](https://img.shields.io/badge/platforms-6-blue)

## Theme previews

| Nord Aurora | Nero Marquina | Catppuccin Mocha |
| :---: | :---: | :---: |
| ![Nord Aurora](media/previews/nord_aurora.png) | ![Nero Marquina](media/previews/nero_marquina.png) | ![Catppuccin Mocha](media/previews/catppuccin_mocha.png) |

| Neon Nexus | Aurora Glass | Ghost |
| :---: | :---: | :---: |
| ![Neon Nexus](media/previews/neon_nexus.png) | ![Aurora Glass](media/previews/aurora_glass.png) | ![Ghost](media/previews/ghost.png) |

*Browse all 64 themes in the [Theme Gallery](gallery.html).* To regenerate these previews from the gallery: `npm install puppeteer && node scripts/generate_readme_previews.js` (from repo root).

## Features

- **64 Curated Themes** - Hand-crafted color palettes, not auto-generated
- **Visual Effects** - Smooth caret, cursor glow, rainbow brackets
- **Cross-Platform** - One theme collection, consistent everywhere
- **WCAG AA Compliant** - >=4.5:1 contrast for all text
- **OLED Safe** - Minimum L=11% backgrounds to prevent smearing

## Installation

### VS Code / Cursor

1. Open the Extensions view (`Ctrl+Shift+X`), search **Prism Themes**, install **PRISM - Where every color has purpose.**
2. Or install from VSIX: `code --install-extension prism-themes-2.0.0.vsix` (or Cursor’s equivalent).

See [vscode/README.md](vscode/README.md) and [cursor/README.md](cursor/README.md) for details.

### Neovim

```lua
-- Using lazy.nvim (plugin is in neovim/ subfolder)
{ "justinfleek/PRISM", dir = "neovim", config = function()
  require("prism").setup({ preset = "nord_aurora" })
  vim.cmd("colorscheme prism")
end }
```

### Emacs

```elisp
(use-package prism-themes
  :config
  (load-theme 'prism-nord-aurora t))
```

### OpenCode

```bash
cp opencode/themes/*.json ~/.config/opencode/themes/
```

### Terminal Emulators

Alacritty, Kitty, WezTerm, Windows Terminal, Zed, and more. See [terminal/README.md](terminal/README.md).

## Theme Collections

### Luxury Collection
| Theme | Description |
|-------|-------------|
| Nero Marquina | Italian black marble with subtle gold veining |
| Midnight Sapphire | Deep blue with silver accents |
| Obsidian Rose Gold | Volcanic black with warm metallic highlights |
| Champagne Noir | Sophisticated dark champagne palette |
| Emerald Velvet | Rich emerald with cream accents |
| Diamond Dust | Crystalline clarity with prismatic highlights |

### Glass Collection
| Theme | Description |
|-------|-------------|
| Aurora Glass | Northern lights through frosted glass |
| Zen Garden | Tranquil stone and moss tones |
| Tide Pool | Coastal aquamarine and sand |
| Soft Charcoal | Warm neutral charcoal |

### Wild Collection
| Theme | Description |
|-------|-------------|
| Neon Nexus | Cyberpunk neon brilliance |
| Blood Moon | Deep crimson eclipse |
| Vaporwave Sunset | Retro synthwave gradients |
| Acid Rain | Toxic greens and industrial grays |
| Ultraviolet | Deep purple UV glow |
| Holographic | Iridescent rainbow shimmer |
| Cyber Noir | Dark cyberpunk with cyan accents |
| Synthwave 84 | Retro '80s synthwave |

### Classic Reimagined
| Theme | Description |
|-------|-------------|
| Catppuccin Mocha | Catppuccin Mocha refined |
| Gruvbox Material | Warm retro Gruvbox |
| Moonlight II | Moonlight theme refined |
| Nord Aurora | Nordic colors with aurora |
| One Dark Pro | Atom One Dark enhanced |
| Night Owl | Sarah Drasner's Night Owl |
| Tokyo Night Bento | Tokyo Night with bento aesthetics |

## Visual Effects

The VS Code/Cursor extensions include optional visual enhancements:

- **Smooth Caret** - Silky cursor animation
- **Cursor Glow** - Subtle glow around the cursor
- **Rainbow Brackets** - Colorful bracket pairs
- **Bracket Highlight** - Highlight matching brackets

Access via: `Ctrl+Alt+P` → "Prism: Open Effects Panel"

## Color Science

All themes follow these principles:

- **WCAG 2.1 AA Compliance** - >=4.5:1 contrast for normal text
- **OLED Black Balance** - Minimum L=11% to prevent smearing
- **Harmonious Palettes** - Mathematical color relationships
- **Syntax Differentiation** - Clear visual distinction between token types

## Platforms

| Platform | Docs | Themes |
|----------|------|--------|
| VS Code | [vscode/README.md](vscode/README.md) | 64 |
| Cursor | [cursor/README.md](cursor/README.md) | 64 |
| OpenCode | [opencode/README.md](opencode/README.md) | 64 |
| Neovim | [neovim/README.md](neovim/README.md) | 64 |
| Emacs | [emacs/README.md](emacs/README.md) | 64 |
| Terminals | [terminal/README.md](terminal/README.md) | Alacritty, Kitty, WezTerm, Windows Terminal, Zed |

## License

MIT. See [LICENSE](LICENSE).

**j-pyxal** · [Omega Agentic](https://omega.ms) · [GitHub](https://github.com/justinfleek/PRISM)
