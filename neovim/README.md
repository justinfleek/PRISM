# PRISM - Where every color has purpose. (Neovim)

64 curated color themes with OKLCH color science.

**Developer:** j-pyxal | **Organization:** [Omega Agentic](https://omega.ms)

## Features

- **64 Pre-built Themes** - From Catppuccin to Nord to custom PRISM originals
- **WCAG AA Verified** - Accessibility-compliant contrast ratios
- **Treesitter Support** - Full semantic highlighting
- **Plugin Integrations** - Telescope, nvim-cmp, gitsigns, and more

## Installation

### lazy.nvim

```lua
{
  "justinfleek/PRISM",
  dir = "neovim",  -- plugin lives in neovim/ subfolder
  lazy = false,
  priority = 1000,
  config = function()
    require("prism").setup({
      preset = "nord_aurora", -- or any of 64 themes
      transparent = false,
      styles = {
        comments = { italic = true },
      },
    })
    vim.cmd("colorscheme prism")
  end,
}
```

### packer.nvim

```lua
use {
  "justinfleek/PRISM",
  dir = "neovim",
  config = function()
    require("prism").setup({ preset = "nord_aurora" })
    vim.cmd("colorscheme prism")
  end,
}
```

### vim-plug

```vim
Plug 'justinfleek/PRISM', { 'dir': 'neovim' }
lua require("prism").setup({ preset = "nord_aurora" })
colorscheme prism
```

## Available Themes (64)

### PRISM Originals
- `github` - GitHub Dark inspired
- `memphis` - Pure black OLED
- `tuned` - Balanced LCD

### Popular Ports
- `catppuccin_mocha` - Catppuccin Mocha
- `gruvbox_material` - Gruvbox Material
- `nord_aurora` - Nord Aurora
- `one_dark_pro` - One Dark Pro
- `night_owl` - Night Owl
- `tokyo_night_bento` - Tokyo Night

### Aesthetic Themes
- `vaporwave` - Retro pink/cyan
- `synthwave_84` - 80s neon
- `cyber_noir` - Cyberpunk
- `aurora_glass` - Purple glass
- `blood_moon` - Deep red
- `acid_rain` - Matrix green
- `ocean_depths` - Deep blue
- `forest_canopy` - Natural green

### Light Themes
- `biopic`
- `ghost`
- `minimal`
- `tessier`
- `neoform`

Run `:PrismList` to see all available themes.

## Commands

### Theme Selection
| Command | Description |
|---------|-------------|
| `:Prism <name>` | Switch to a theme |
| `:PrismList` | List all available themes |

## Configuration

```lua
require("prism").setup({
  -- Theme preset (required)
  preset = "nord_aurora",
  
  -- Transparent background
  transparent = false,
  
  -- Enable terminal colors
  terminal_colors = true,
  
  -- Syntax styles
  styles = {
    comments = { italic = true },
    keywords = { bold = false },
    functions = {},
    variables = {},
  },
  
  -- Plugin integrations
  integrations = {
    treesitter = true,
    native_lsp = true,
    telescope = true,
    cmp = true,
    gitsigns = true,
    indent_blankline = true,
    mini = true,
    nvim_tree = true,
    neo_tree = true,
    which_key = true,
    lazy = true,
    notify = true,
  },
})
```

## Mathematical Foundation

PRISM uses formally verified color science:

- **OKLCH**: Perceptually uniform color space (L=lightness, C=chroma, H=hue)
- **Golden Angle**: 137.5077640500378° for maximum hue separation
- **WCAG Contrast**: Proven ≥4.5:1 for text, ≥3:1 for large text

All math matches Lean4 proofs in `core/lean4/PrismColor/`.

## License

MIT
