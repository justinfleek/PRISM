# PRISM Terminal & Editor Themes

64 curated color themes for terminals, editors, and CLI tools.

## Supported Platforms

### Terminal Emulators
| Terminal | Format | Location | Installation |
|----------|--------|----------|--------------|
| **Alacritty** | TOML | `alacritty/` | `~/.config/alacritty/themes/` |
| **Kitty** | conf | `kitty/` | `include` in kitty.conf |
| **WezTerm** | TOML | `wezterm/` | `~/.config/wezterm/colors/` |
| **iTerm2** | itermcolors | `iterm2/` | Import via Preferences |
| **Windows Terminal** | JSON | `windows-terminal/` | Add to settings.json |

### Editors
| Editor | Format | Location | Installation |
|--------|--------|----------|--------------|
| **JetBrains** | ICLS | `jetbrains/` | File → Import Settings |
| **Zed** | JSON | `zed/` | `~/.config/zed/themes/` |
| **Helix** | TOML | `helix/` | `~/.config/helix/themes/` |

### CLI Tools
| Tool | Format | Location | Installation |
|------|--------|----------|--------------|
| **tmux** | conf | `tmux/` | `source` in .tmux.conf |
| **bat/delta** | JSON | `bat/` | `--theme` flag |
| **Starship** | TOML | `starship/` | Color palette reference |

## Quick Install

### Alacritty

```bash
# Copy theme to config
cp alacritty/nord_aurora.toml ~/.config/alacritty/themes/

# Add to alacritty.toml
echo 'import = ["~/.config/alacritty/themes/nord_aurora.toml"]' >> ~/.config/alacritty/alacritty.toml
```

### Kitty

```bash
# Copy theme
cp kitty/nord_aurora.conf ~/.config/kitty/themes/

# Add to kitty.conf
echo 'include themes/nord_aurora.conf' >> ~/.config/kitty/kitty.conf

# Or use kitty's built-in theme switcher
kitty +kitten themes --reload-in=all
```

### WezTerm

```bash
# Copy theme
mkdir -p ~/.config/wezterm/colors
cp wezterm/nord_aurora.toml ~/.config/wezterm/colors/

# Add to wezterm.lua
cat >> ~/.config/wezterm/wezterm.lua << 'EOF'
local config = {}
config.color_scheme = 'Prism nord_aurora'
return config
EOF
```

### iTerm2

1. Open iTerm2 → Preferences → Profiles → Colors
2. Click "Color Presets..." dropdown
3. Select "Import..."
4. Choose `iterm2/nord_aurora.itermcolors`
5. Select the imported theme from the dropdown

## Theme Collections

### Luxury
Dark, sophisticated themes with metallic accents:
- nero-marquina, midnight-sapphire, obsidian-rose-gold
- champagne-noir, emerald-velvet, diamond-dust

### Glass
Translucent, ethereal aesthetics:
- aurora-glass, zen-garden, tide-pool
- soft-charcoal

### Harmonious
Natural, balanced palettes:
- ocean-depths, forest-canopy, lavender-dusk
- slate-and-gold, ember-hearth, constellation-map

### Wild
High energy, vibrant themes:
- neon-nexus, blood-moon, vaporwave-sunset
- acid-rain, ultraviolet, holographic
- cyber-noir, synthwave-84

### Classic
Refined versions of beloved themes:
- catppuccin-mocha, gruvbox-material
- nord-aurora, one-dark-pro, ayu-mirage
- night-owl, cobalt2
- palenight, vesper, tokyo-night-bento, moonlight-ii

## Color Science

All themes are designed with:
- **WCAG 2.1 AA Compliance** - >=4.5:1 contrast for normal text
- **OLED Safe** - Minimum L=11% to prevent smearing
- **Harmonious Palettes** - Mathematical color relationships

## Syncing terminal configs from source (maintainers)

To update terminal configs from the source theme JSONs (e.g. after adding or editing themes in `vscode/themes/`):

```bash
cd core/tools
python generate_terminal_themes.py
```

## License

MIT License - Created by [Omega Agentic](https://omega.ms)

---

*Part of the [PRISM Theme System](https://github.com/justinfleek/PRISM)*
