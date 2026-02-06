# Contributing to PRISM

Thank you for your interest in contributing to PRISM! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a feature branch from `main`

## Development Setup

Run all commands from the **project root** (the directory containing `README.md`).

### Building VS Code / Cursor extensions
```bash
cd cursor
npm install
npm run compile
# Package: npx vsce package
cd ../vscode
npm install
npm run compile
npx vsce package
```

### Theme and terminal configs
- **VS Code/Cursor:** Themes live in `cursor/themes/*.json` and `vscode/themes/*.json`. Test by loading the extension from the `cursor/` or `vscode/` folder.
- **Terminal:** Configs in `terminal/` (alacritty/, kitty/, wezterm/, etc.).

### Contrast verification (optional)
```bash
cd core/tools
python contrast_checker.py
```

## Adding a new theme

1. Add theme JSON to `vscode/themes/` (and `cursor/themes/` if needed)
2. Run the sync script to produce terminal/other platform configs: `python sync_themes.py` from repo root (or `core/tools/generate_terminal_themes.py` for terminal only)
3. Verify WCAG contrast using `core/tools/contrast_checker.py`
4. Update each platform's manifest/README as needed

## Code Style

- **TypeScript/JavaScript**: Use Prettier formatting
- **Python**: Follow PEP 8, use `ruff format`
- **Haskell**: Use `ormolu` or `fourmolu`
- **JSON**: 2-space indentation

## Commit Messages

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Formatting, no code change
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance tasks

Example: `feat: add Ocean Depths theme with WCAG AA verification`

## Pull Request Process

1. Ensure all themes pass contrast verification
2. Update relevant READMEs if adding features
3. Request review from maintainers

## Reporting Issues

When reporting bugs, include:
- Platform (VSCode, Cursor, Neovim, etc.)
- Theme name
- Screenshot if visual issue
- Steps to reproduce

## Color Science

PRISM uses OKLCH perceptual color space with WCAG 2.1 verification. When creating themes:

- All foreground text must meet **4.5:1** contrast ratio (WCAG AA)
- Comments must meet **3.0:1** minimum (WCAG AA Large)
- Use the verification tools before submitting

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Open an issue for any questions about contributing.
