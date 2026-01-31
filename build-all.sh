#!/bin/bash
#
# PRISM - Build All Plugins
# ==========================
# Builds and packages all editor plugins for distribution.
#
# Prerequisites:
#   - Node.js 20+
#   - npm
#
# Output:
#   - dist/prism-themes-vscode.vsix        (static theme pack)
#   - dist/prism-generator-1.0.0.vsix      (211 generator)
#   - dist/prism-themes-cursor.vsix        (Cursor IDE)
#   - nvim-prism/                          (ready to install)
#   - prism-emacs/                         (ready to install)
#   - opencode-prism/                      (ready to install)

set -e

echo "=================================================================="
echo "                    PRISM Build System                            "
echo "         Formally Verified Color Themes for Every Editor          "
echo "=================================================================="
echo ""

# Detect if running in WSL
if grep -qi microsoft /proc/version 2>/dev/null; then
    IS_WSL=true
    echo "[info] Detected WSL environment"
else
    IS_WSL=false
fi

# Create dist directory
mkdir -p dist

# Helper function to run npm/node commands
run_npm() {
    if [ "$IS_WSL" = true ]; then
        cmd.exe /c "cd /d $(wslpath -w "$PWD") && $*" 2>&1
    else
        "$@"
    fi
}

# Helper function to run vsce
run_vsce() {
    local output_path="$1"
    if [ "$IS_WSL" = true ]; then
        cmd.exe /c "cd /d $(wslpath -w "$PWD") && node node_modules\\@vscode\\vsce\\vsce package -o $(wslpath -w "$output_path") --no-dependencies" 2>&1
    else
        npx vsce package -o "$output_path" --no-dependencies
    fi
}

# ============================================================================
# 1. VSCode Static Themes (prism-vscode-final)
# ============================================================================
echo ""
echo "------------------------------------------------------------------"
echo "[1/3] Building: VSCode Static Themes"
echo "------------------------------------------------------------------"

cd prism-vscode-final

# Verify icon exists
if [ ! -f "media/icon.png" ]; then
    echo "[ERROR] media/icon.png missing!"
    exit 1
fi

# Count themes
THEME_COUNT=$(ls themes/*.json 2>/dev/null | wc -l)
echo "[ok] Found $THEME_COUNT themes"

# Package
run_vsce "../dist/prism-themes-vscode.vsix"
echo "[ok] Created: dist/prism-themes-vscode.vsix"

cd ..

# ============================================================================
# 2. VSCode 211 Generator (vscode-prism-theme-generator)
# ============================================================================
echo ""
echo "------------------------------------------------------------------"
echo "[2/3] Building: VSCode 211 Generator"
echo "------------------------------------------------------------------"

cd vscode-prism/vscode-prism-theme-generator

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "[info] Installing dependencies..."
    if [ "$IS_WSL" = true ]; then
        cmd.exe /c "cd /d $(wslpath -w "$PWD") && npm install" 2>&1
    else
        npm install
    fi
fi

# Compile TypeScript
echo "[info] Compiling TypeScript..."
if [ "$IS_WSL" = true ]; then
    cmd.exe /c "cd /d $(wslpath -w "$PWD") && node node_modules\\typescript\\bin\\tsc -p ./" 2>&1
else
    npx tsc -p ./
fi

# Verify icon exists
if [ ! -f "media/icon.png" ]; then
    echo "[ERROR] media/icon.png missing!"
    exit 1
fi

# Package
run_vsce "../../dist/prism-generator-1.0.0.vsix"
echo "[ok] Created: dist/prism-generator-1.0.0.vsix"

cd ../..

# ============================================================================
# 3. Cursor IDE (cursor-prism)
# ============================================================================
echo ""
echo "------------------------------------------------------------------"
echo "[3/3] Building: Cursor IDE Themes"
echo "------------------------------------------------------------------"

cd cursor-prism

# Verify icon exists
if [ ! -f "media/icon.png" ]; then
    echo "[ERROR] media/icon.png missing!"
    exit 1
fi

# Count themes
THEME_COUNT=$(ls themes/*.json 2>/dev/null | wc -l)
echo "[ok] Found $THEME_COUNT themes"

# Package
run_vsce "../dist/prism-themes-cursor.vsix"
echo "[ok] Created: dist/prism-themes-cursor.vsix"

cd ..

# ============================================================================
# 4. Neovim (nvim-prism) - No build needed, just verify
# ============================================================================
echo ""
echo "------------------------------------------------------------------"
echo "[ok] Neovim Plugin: nvim-prism/"
echo "------------------------------------------------------------------"
echo "  Ready for installation via lazy.nvim, packer, or vim-plug"
NVIM_PRESETS=$(grep -c '= { bg =' nvim-prism/lua/prism/presets.lua 2>/dev/null || echo 0)
echo "  Presets: $NVIM_PRESETS"

# ============================================================================
# 5. Emacs (prism-emacs) - No build needed, just verify
# ============================================================================
echo ""
echo "------------------------------------------------------------------"
echo "[ok] Emacs Package: prism-emacs/"
echo "------------------------------------------------------------------"
echo "  Ready for installation via use-package or straight.el"
EMACS_THEMES=$(ls prism-emacs/themes/*.el 2>/dev/null | wc -l)
echo "  Themes: $EMACS_THEMES"

# ============================================================================
# 6. OpenCode (opencode-prism) - No build needed, just verify
# ============================================================================
echo ""
echo "------------------------------------------------------------------"
echo "[ok] OpenCode Themes: opencode-prism/"
echo "------------------------------------------------------------------"
echo "  Run: cd opencode-prism && ./install.sh"
OPENCODE_THEMES=$(ls opencode-prism/themes/*.json 2>/dev/null | wc -l)
echo "  Themes: $OPENCODE_THEMES"

# ============================================================================
# Summary
# ============================================================================
echo ""
echo "=================================================================="
echo "                      BUILD COMPLETE                              "
echo "=================================================================="
echo ""
echo "VSCode Extensions (dist/):"
ls -la dist/*.vsix 2>/dev/null | awk '{print "   " $NF " (" $5 " bytes)"}'
echo ""
echo "Ready for Installation:"
echo "   nvim-prism/       - Neovim (lazy.nvim, packer)"
echo "   prism-emacs/      - Emacs (use-package, straight.el)"
echo "   opencode-prism/   - OpenCode (./install.sh)"
echo "   terminal-themes/  - Alacritty, Kitty, WezTerm, iTerm2, etc."
echo ""
echo "To install VSCode extension locally:"
echo "   code --install-extension dist/prism-themes-vscode.vsix"
echo "   code --install-extension dist/prism-generator-1.0.0.vsix"
echo ""
echo "To install in Cursor:"
echo "   cursor --install-extension dist/prism-themes-cursor.vsix"
echo ""
