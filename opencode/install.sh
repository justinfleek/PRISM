#!/bin/bash
# Prism Themes for OpenCode - Installation Script
# https://github.com/justinfleek/PRISM

set -e

THEMES_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/opencode/themes"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "  // PRISM // 64 Curated Themes //"
echo "  by Omega Agentic | omega.ms"
echo ""
echo "========================================"
echo ""

# Create themes directory
mkdir -p "$THEMES_DIR"

# Copy themes
echo "Installing curated themes to $THEMES_DIR..."
cp "$SCRIPT_DIR/themes/"*.json "$THEMES_DIR/"

# Count installed
COUNT=$(ls "$THEMES_DIR"/*.json 2>/dev/null | wc -l)

echo ""
echo "Installed $COUNT curated Prism themes."
echo ""

echo "To use a theme:"
echo "  1. Run /theme in OpenCode"
echo "  2. Select your theme"
echo ""
echo "Or add to opencode.json:"
echo '  {'
echo '    "tui": {'
echo '      "theme": "catppuccin_mocha"'
echo '    }'
echo '  }'
echo ""
echo "Featured themes:"
echo "  nero_marquina      Luxury Italian marble"
echo "  neon_nexus         Cyberpunk neon"
echo "  catppuccin_mocha   Classic reimagined"
echo "  nord_aurora        Nordic colors"
echo "  gruvbox_material   Warm retro"
echo "  moonlight_ii       Moonlight refined"
echo ""
