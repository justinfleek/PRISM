# PRISM - Where every color has purpose. (Emacs)

**64 curated color themes** with WCAG AA compliant contrast.

**Developer:** j-pyxal | **Organization:** [Omega Agentic](https://omega.ms)

## Installation

### Manual Installation

1. Clone or download this repository (you get a folder e.g. `PRISM/` with an `emacs/` subfolder).
2. Add to your config (replace with your path):

```elisp
(add-to-list 'load-path "/path/to/PRISM/emacs")
(add-to-list 'custom-theme-load-path "/path/to/PRISM/emacs/themes")
(require 'prism-themes)
(load-theme 'fleek_gold t)
```

### Straight.el

```elisp
(straight-use-package
 '(prism-themes :type git :host github :repo "justinfleek/PRISM"
                :files ("emacs/prism-themes.el" "emacs/themes/*.el")))
(load-theme 'fleek_gold t)
```

### Doom Emacs

In `packages.el`:
```elisp
(package! prism-themes :recipe (:host github :repo "justinfleek/PRISM"
                              :files ("emacs/prism-themes.el" "emacs/themes/*.el")))
```

In `config.el`:
```elisp
(setq doom-theme 'fleek_gold)
```

## Usage

```elisp
;; Load a theme
(load-theme 'fleek_gold t)

;; Or use the interactive selector
M-x prism-themes-load
```

## Available Themes (64)

### Flagship
`fleek`, `fleek_light`, `fleek_gold`, `fleek_gradient`, `tessier`

### Luxury Collection
`nero_marquina`, `midnight_sapphire`, `obsidian_rose_gold`, `champagne_noir`, `emerald_velvet`, `diamond_dust`

### Glass Collection
`aurora_glass`, `zen_garden`, `tide_pool`, `porcelain_moon`, `soft_charcoal`

### Harmonious Collection
`ocean_depths`, `forest_canopy`, `lavender_dusk`, `slate_and_gold`, `ember_hearth`, `constellation_map`

### Wild Collection
`neon_nexus`, `blood_moon`, `vaporwave_sunset`, `acid_rain`, `ultraviolet`, `holographic`, `cyber_noir`, `synthwave_84`

### Classic Reimagined
`catppuccin_mocha`, `dracula_pro`, `gruvbox_material`, `moonlight_ii`, `nord_aurora`, `one_dark_pro`, `ayu_mirage`, `rose_pine`, `night_owl`, `cobalt2`, `palenight`, `vesper`, `tokyo_night_bento`

### Core
`tuned`, `memphis`, `github`, `neoform`, `biopic`, `ghost`, `minimal`, `rose_gold`

### Gradient Palettes
`arctic`, `coastal`, `faded_glory`, `forest`, `grape`, `inferno`, `mint`, `ocean`, `rose`, `sunset`, `synthwave`, `tropical`, `vaporwave`

## Supported Packages

- Font Lock (built-in syntax)
- Org Mode
- Markdown Mode
- Company
- Magit
- Which-key
- Ivy/Counsel
- Flycheck
- LSP Mode
- Treemacs
- Rainbow Delimiters

## License

MIT License - Built by [Omega Agentic](https://omega.ms)
