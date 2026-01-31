# prism.nvim

**40 formally verified color themes for Neovim** with OKLCH color science.

## ✨ Features

- 🎨 **40 curated themes** across 5 collections
- 🔬 **OKLCH perceptual uniformity** - colors look correct
- ♿ **WCAG AA compliant** contrast ratios
- 🖥️ **OLED optimized** dark themes
- 🔌 **Full integration** - Treesitter, LSP, Telescope, nvim-cmp, and more

## 📦 Installation

### lazy.nvim
```lua
{
  "weyl-ai/prism.nvim",
  lazy = false,
  priority = 1000,
  config = function()
    require("prism").setup({
      preset = "fleek",
      transparent = false,
    })
  end,
}
```

### packer.nvim
```lua
use {
  "weyl-ai/prism.nvim",
  config = function()
    require("prism").setup({ preset = "fleek" })
  end
}
```

### vim-plug
```vim
Plug 'weyl-ai/prism.nvim'
lua require('prism').setup({ preset = 'fleek' })
```

## 🚀 Usage

```lua
-- Setup with options
require("prism").setup({
  preset = "fleek",           -- Default theme
  transparent = false,        -- Transparent background
  terminal_colors = true,     -- Apply terminal colors
  styles = {
    comments = { italic = true },
    keywords = {},
    functions = {},
    variables = {},
  },
  integrations = {
    treesitter = true,
    native_lsp = true,
    telescope = true,
    cmp = true,
    gitsigns = true,
  },
})

-- Or use colorscheme command
vim.cmd("colorscheme prism")
```

### Commands
- `:Prism <theme>` - Apply a theme
- `:PrismList` - List all available themes

## 🎨 Available Themes (40)

### Flagship
`fleek`, `fleek_light`

### Luxury Collection
`nero_marquina`, `midnight_sapphire`, `obsidian_rose_gold`, `champagne_noir`, `emerald_velvet`, `diamond_dust`

### Glass Collection
`aurora_glass`, `zen_garden`, `tide_pool`, `porcelain_moon`, `soft_charcoal`

### Harmonious Collection
`ocean_depths`, `forest_canopy`, `lavender_dusk`, `slate_and_gold`, `ember_hearth`, `constellation_map`

### Wild Collection
`neon_nexus`, `blood_moon`, `vaporwave_sunset`, `acid_rain`, `ultraviolet`, `holographic`, `cyber_noir`, `synthwave_84`

### Classic Collection
`catppuccin_mocha`, `dracula_pro`, `gruvbox_material`, `moonlight_ii`, `nord_aurora`, `one_dark_pro`, `ayu_mirage`, `rose_pine`, `night_owl`, `cobalt2`, `palenight`, `vesper`, `tokyo_night_bento`

## 🔌 Supported Plugins

- **Treesitter** - Full syntax highlighting
- **Native LSP** - Diagnostics, references, hover
- **Telescope** - Picker UI
- **nvim-cmp** - Completion menu
- **Gitsigns** - Git decorations
- **indent-blankline** - Indent guides
- **lazy.nvim** - Plugin manager UI
- **nvim-notify** - Notifications
- **mini.nvim** - Various utilities
- **nvim-tree / neo-tree** - File explorers
- **which-key** - Keybind hints

## 📄 License

MIT License - Built by [Fleek](https://fleek.sh)
