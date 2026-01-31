# Contributing to PRISM

Thank you for your interest in contributing to PRISM! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a feature branch from `main`

## Development Setup

### VSCode/Cursor Themes
```bash
cd cursor-prism
# Themes are in ./themes/*.json
# Test by copying to ~/.cursor/extensions/ or ~/.vscode/extensions/
```

### Terminal Themes
```bash
cd terminal-themes
# Themes organized by terminal: alacritty/, kitty/, wezterm/, windows-terminal/
```

### Color Core (Python tools)
```bash
cd prism-color-core/tools
python -m pip install -r requirements.txt  # if requirements exist
python create_theme.py --help
```

### Haskell Core
```bash
cd prism-color-core/haskell
cabal build
cabal test
```

## Adding a New Theme

1. Create theme definition in `prism-color-core/themes/`
2. Run the generator to produce platform-specific versions
3. Verify WCAG contrast compliance using `tools/contrast_checker.py`
4. Add theme to each platform's package manifest

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
3. Add changelog entry for user-facing changes
4. Request review from maintainers

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
