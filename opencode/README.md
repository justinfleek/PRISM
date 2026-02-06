# Prism Themes for OpenCode

**64 Curated Themes** for [OpenCode](https://opencode.ai) - the AI coding assistant for your terminal.

![Prism Themes](https://img.shields.io/badge/themes-64-brightgreen)
![WCAG AA](https://img.shields.io/badge/contrast-WCAG%20AA-green)

## Installation

**Linux / macOS (or Git Bash on Windows):**
```bash
mkdir -p ~/.config/opencode/themes
cp themes/*.json ~/.config/opencode/themes/
# Or run: ./install.sh
```

**Windows (PowerShell):**
```powershell
New-Item -ItemType Directory -Force $env:USERPROFILE\.config\opencode\themes
Copy-Item themes\*.json $env:USERPROFILE\.config\opencode\themes\
```

## Using Themes in OpenCode

1. Run `/theme` command in OpenCode
2. Select your theme from the list

Or add to your project's `opencode.json`:

```json
{
  "tui": {
    "theme": "catppuccin_mocha"
  }
}
```

## Theme Gallery

### Luxury Collection
| Theme | Description |
|-------|-------------|
| `nero_marquina` | Italian black marble with subtle gold veining |
| `midnight_sapphire` | Deep blue with silver accents |
| `obsidian_rose_gold` | Volcanic black with warm metallic highlights |
| `champagne_noir` | Sophisticated dark champagne palette |
| `emerald_velvet` | Rich emerald with cream accents |
| `diamond_dust` | Crystalline clarity with prismatic highlights |

### Glass Collection
| Theme | Description |
|-------|-------------|
| `aurora_glass` | Northern lights through frosted glass |
| `zen_garden` | Tranquil stone and moss tones |
| `tide_pool` | Coastal aquamarine and sand |
| `soft_charcoal` | Warm neutral charcoal |

### Harmonious Collection
| Theme | Description |
|-------|-------------|
| `ocean_depths` | Deep sea blues and aquamarine |
| `forest_canopy` | Woodland greens and earth tones |
| `lavender_dusk` | Soft purples and sunset pinks |
| `slate_and_gold` | Professional slate with gold accents |
| `ember_hearth` | Warm fire and ember tones |
| `constellation_map` | Night sky navigation charts |

### Wild Collection
| Theme | Description |
|-------|-------------|
| `neon_nexus` | Cyberpunk neon brilliance |
| `blood_moon` | Deep crimson eclipse |
| `vaporwave_sunset` | Retro synthwave gradients |
| `acid_rain` | Toxic greens and industrial grays |
| `ultraviolet` | Deep purple UV glow |
| `holographic` | Iridescent rainbow shimmer |
| `cyber_noir` | Dark cyberpunk with cyan accents |
| `synthwave_84` | Retro '80s synthwave |

### Classic Reimagined
| Theme | Description |
|-------|-------------|
| `catppuccin_mocha` | Catppuccin Mocha refined |
| `gruvbox_material` | Warm retro Gruvbox |
| `moonlight_ii` | Moonlight theme refined |
| `nord_aurora` | Nordic colors with aurora |
| `one_dark_pro` | Atom One Dark enhanced |
| `ayu_mirage` | Ayu Mirage refined |
| `night_owl` | Sarah Drasner's Night Owl |
| `cobalt2` | Wes Bos's Cobalt2 refined |
| `palenight` | Material Palenight |
| `vesper` | Calm minimal dark |
| `tokyo_night_bento` | Tokyo Night with bento aesthetics |

### Nature Collection
| Theme | Description |
|-------|-------------|
| `forest` | Deep forest greens |
| `ocean` | Ocean blues |
| `sunset` | Warm sunset tones |
| `tropical` | Vibrant tropical palette |
| `arctic` | Cool arctic blues |
| `coastal` | Beach and sea tones |

### Accent Themes
| Theme | Description |
|-------|-------------|
| `rose` | Soft rose accent |
| `rose_gold` | Elegant rose gold |
| `mint` | Fresh mint green |
| `grape` | Deep grape purple |
| `golden_haze` | Warm golden tones |

### Additional Themes
| Theme | Description |
|-------|-------------|
| `minimal` | Clean minimal aesthetic |
| `ghost` | Subtle ghostly palette |
| `tuned` | Carefully tuned colors |
| `biopic` | Cinematic color grading |
| `memphis` | Bold Memphis design |
| `faded_glory` | Vintage faded aesthetic |
| `neoform` | Modern neoform style |
| `tessier` | Corporate dark aesthetic |
| `twilight_lagoon` | Twilight water tones |
| `vaporwave` | Classic vaporwave |
| `synthwave` | Synthwave aesthetic |
| `inferno` | Hot inferno colors |
| `verde` | Green-focused theme |
| `verde_light` | Light green variant |
| `github` | GitHub-inspired colors |
| `fleek_gradient` | Gradient accent theme |
| `fleek_gold` | Gold accent theme |

## Color Science

- **WCAG 2.1 AA**: >=4.5:1 contrast for normal text
- **OLED safe**: Minimum L=11% to prevent smearing
- **Harmonious palettes**: Hand-tuned for visual coherence

## Credits

**Developer:** j-pyxal | **Organization:** [Omega Agentic](https://omega.ms)

Part of the **PRISM Theme System** - also available for:
- [VS Code / Cursor](../vscode)
- [Neovim](../neovim)
- [Emacs](../emacs)
- [Terminal Emulators](../terminal)

## License

MIT License - see [LICENSE](LICENSE)
