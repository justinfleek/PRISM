/**
 * PRISM Theme Extension
 *
 * 64 curated color themes with optional visual effects
 *
 * Project: PRISM - When Color meets Math
 * Author: Omega
 */

import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

// Status bar item for quick access
let statusBarItem: vscode.StatusBarItem;
let extensionPath = "";

// Decoration types for syntax pulse only
let syntaxPulseDecorationType: vscode.TextEditorDecorationType | null = null;
let syntaxPulseDecorationTypeAlt: vscode.TextEditorDecorationType | null = null;
let pulseTimer: ReturnType<typeof setInterval> | null = null;
let applyEffectsRef: (() => Promise<void>) | null = null;

interface ThemeColors {
  errorBg: string;
  /** Current-line highlight: lightest theme color at low alpha for max readability */
  lineHighlightVisible: string;
  /** Bracket match background and border - more visible than default */
  bracketMatchBg: string;
  bracketMatchBorder: string;
}

function getThemeColors(): ThemeColors | null {
  const themeName = vscode.workspace.getConfiguration("workbench").get<string>("colorTheme", "");
  if (!themeName.startsWith("Prism ")) return null;
  if (!extensionPath) return null;
  const slug = themeName.replace(/^Prism\s+/, "").replace(/\s+/g, "_").toLowerCase().replace(/&/g, "and");
  const themePath = path.join(extensionPath, "themes", slug + ".json");
  try {
    const raw = fs.readFileSync(themePath, "utf8");
    const theme = JSON.parse(raw) as { colors?: Record<string, string>; type?: string };
    const colors = theme.colors;
    if (!colors) return null;
    const errorFg = colors["editorError.foreground"];
    const cursorHex = colors["editorCursor.foreground"] ?? colors["editor.foreground"] ?? "#81a1c1";
    const bracketBorder = colors["editorBracketMatch.border"] ?? cursorHex;
    const bracketBg = colors["editorBracketMatch.background"];
    // Use the theme's own line highlight if defined, otherwise derive from background
    // This respects each theme's intended "lightest" highlight for the current line
    const themeLineHighlight = colors["editor.lineHighlightBackground"];
    const bgHex = colors["editor.background"] ?? "#09090b";
    const isDark = (theme.type ?? "dark") === "dark";
    
    // For the line highlight, we want a subtle brightening/darkening of the background
    // Parse background and shift it slightly lighter (dark themes) or darker (light themes)
    let lineHighlightVisible: string;
    if (themeLineHighlight) {
      // Theme already defines a line highlight - use it directly
      lineHighlightVisible = themeLineHighlight;
    } else {
      // Derive from background: lighten for dark themes, darken for light themes
      const bgMatch = bgHex.match(/^#?([0-9a-f]{6})$/i);
      if (bgMatch) {
        const r = parseInt(bgMatch[1].slice(0, 2), 16);
        const g = parseInt(bgMatch[1].slice(2, 4), 16);
        const b = parseInt(bgMatch[1].slice(4, 6), 16);
        if (isDark) {
          // Lighten: add ~12 to each channel
          const lr = Math.min(255, r + 12);
          const lg = Math.min(255, g + 12);
          const lb = Math.min(255, b + 12);
          lineHighlightVisible = `#${lr.toString(16).padStart(2, "0")}${lg.toString(16).padStart(2, "0")}${lb.toString(16).padStart(2, "0")}`;
        } else {
          // Darken: subtract ~10 from each channel
          const lr = Math.max(0, r - 10);
          const lg = Math.max(0, g - 10);
          const lb = Math.max(0, b - 10);
          lineHighlightVisible = `#${lr.toString(16).padStart(2, "0")}${lg.toString(16).padStart(2, "0")}${lb.toString(16).padStart(2, "0")}`;
        }
      } else {
        lineHighlightVisible = isDark ? "#151515" : "#f0f0f0";
      }
    }
    return {
      errorBg: errorFg ? hexToRgba(errorFg, 0.25) : "rgba(239,68,68,0.2)",
      lineHighlightVisible,
      bracketMatchBg: bracketBg ?? hexToRgba(bracketBorder, 0.35),
      bracketMatchBorder: bracketBorder,
    };
  } catch {
    return null;
  }
}

/** Colors for the Effects panel UI so it matches the active Prism theme */
interface PanelThemeColors {
  bg: string;
  fg: string;
  surface: string;
  border: string;
  accent: string;
  accent2: string;
  buttonBg: string;
  buttonFg: string;
  toggleThumb: string;
}

function getPanelThemeColors(): PanelThemeColors {
  const themeName = vscode.workspace.getConfiguration("workbench").get<string>("colorTheme", "");
  if (!themeName.startsWith("Prism ") || !extensionPath) {
    return {
      bg: "#09090b",
      fg: "#e4e4e8",
      surface: "#0f0f12",
      border: "#1f1f25",
      accent: "#6366f1",
      accent2: "#818cf8",
      buttonBg: "#6366f1",
      buttonFg: "#fff",
      toggleThumb: "#fff",
    };
  }
  const slug = themeName.replace(/^Prism\s+/, "").replace(/\s+/g, "_").toLowerCase().replace(/&/g, "and");
  const themePath = path.join(extensionPath, "themes", slug + ".json");
  try {
    const raw = fs.readFileSync(themePath, "utf8");
    const theme = JSON.parse(raw) as { colors?: Record<string, string> };
    const c = theme.colors ?? {};
    const accent = c["editorCursor.foreground"] ?? c["focusBorder"] ?? c["tab.activeBorder"] ?? c["activityBar.activeBorder"] ?? "#81a1c1";
    const accent2 = c["button.hoverBackground"] ?? c["gitDecoration.modifiedResourceForeground"] ?? accent;
    return {
      bg: c["editor.background"] ?? "#09090b",
      fg: c["editor.foreground"] ?? "#e4e4e8",
      surface: c["sideBar.background"] ?? c["panel.background"] ?? "#0f0f12",
      border: c["panel.border"] ?? c["sideBar.border"] ?? "#1f1f25",
      accent,
      accent2,
      buttonBg: c["button.background"] ?? accent,
      buttonFg: c["button.foreground"] ?? c["editor.background"] ?? "#fff",
      toggleThumb: c["button.foreground"] ?? c["editor.background"] ?? "#fff",
    };
  } catch {
    return {
      bg: "#09090b",
      fg: "#e4e4e8",
      surface: "#0f0f12",
      border: "#1f1f25",
      accent: "#6366f1",
      accent2: "#818cf8",
      buttonBg: "#6366f1",
      buttonFg: "#fff",
      toggleThumb: "#fff",
    };
  }
}

function hexToRgba(hex: string, alpha: number): string {
  const m = hex.match(/^#?([0-9a-f]{3,8})$/i);
  if (!m) return `rgba(239,68,68,${alpha})`;
  let r = 0, g = 0, b = 0;
  const s = m[1];
  if (s.length === 3) {
    r = parseInt(s[0] + s[0], 16);
    g = parseInt(s[1] + s[1], 16);
    b = parseInt(s[2] + s[2], 16);
  } else if (s.length === 6) {
    r = parseInt(s.slice(0, 2), 16);
    g = parseInt(s.slice(2, 4), 16);
    b = parseInt(s.slice(4, 6), 16);
  } else if (s.length === 8) {
    r = parseInt(s.slice(0, 2), 16);
    g = parseInt(s.slice(2, 4), 16);
    b = parseInt(s.slice(4, 6), 16);
    alpha = parseInt(s.slice(6, 8), 16) / 255;
  }
  return `rgba(${r},${g},${b},${alpha})`;
}

// Effects configuration
interface PrismEffectsConfig {
  cursorGlow: boolean;
  bracketHighlight: boolean;
  smoothCaret: boolean;
  syntaxPulse: boolean;
  rainbowBrackets: boolean;
  glowIntensity: number;
}

function getEffectsConfig(): PrismEffectsConfig {
  const config = vscode.workspace.getConfiguration("prism.effects");
  return {
    cursorGlow: config.get("cursorGlow", true),
    bracketHighlight: config.get("bracketHighlight", true),
    smoothCaret: config.get("smoothCaret", true),
    syntaxPulse: config.get("syntaxPulse", false),
    rainbowBrackets: config.get("rainbowBrackets", false),
    glowIntensity: config.get("glowIntensity", 0.5),
  };
}

const PRISM_CUSTOMIZATION_KEYS = [
  "editor.lineHighlightBackground",
  "editorBracketMatch.background",
  "editorBracketMatch.border",
] as const;

async function applyColorCustomizations(effects: PrismEffectsConfig): Promise<void> {
  const workbench = vscode.workspace.getConfiguration("workbench");
  const current = workbench.get<Record<string, string>>("colorCustomizations") ?? {};
  const next = { ...current };

  for (const key of PRISM_CUSTOMIZATION_KEYS) {
    delete next[key];
  }

  const theme = getThemeColors();
  if (effects.cursorGlow) {
    next["editor.lineHighlightBackground"] =
      theme?.lineHighlightVisible ?? "rgba(255, 255, 255, 0.06)";
  }
  if (effects.bracketHighlight) {
    next["editorBracketMatch.background"] =
      theme?.bracketMatchBg ?? "rgba(129, 161, 193, 0.35)";
    next["editorBracketMatch.border"] =
      theme?.bracketMatchBorder ?? "rgba(129, 161, 193, 0.9)";
  }

  await workbench.update("colorCustomizations", next, vscode.ConfigurationTarget.Global);
}

function disposeSyntaxPulseDecorations(): void {
  if (syntaxPulseDecorationType) {
    syntaxPulseDecorationType.dispose();
    syntaxPulseDecorationType = null;
  }
  if (syntaxPulseDecorationTypeAlt) {
    syntaxPulseDecorationTypeAlt.dispose();
    syntaxPulseDecorationTypeAlt = null;
  }
}

function getSyntaxPulseDecorationTypes(): void {
  const theme = getThemeColors();
  const errorBg = theme?.errorBg ?? "rgba(239, 68, 68, 0.2)";
  const errorBgAlt = errorBg.replace(/[\d.]+\)\s*$/, "0.35)");
  disposeSyntaxPulseDecorations();
  syntaxPulseDecorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: errorBg,
    borderRadius: "2px",
  });
  syntaxPulseDecorationTypeAlt = vscode.window.createTextEditorDecorationType({
    backgroundColor: errorBgAlt,
    borderRadius: "2px",
  });
}

function updateSyntaxPulse(editor: vscode.TextEditor | undefined): void {
  const effects = getEffectsConfig();
  if (!effects.syntaxPulse || !editor) {
    if (editor && syntaxPulseDecorationType) editor.setDecorations(syntaxPulseDecorationType, []);
    if (editor && syntaxPulseDecorationTypeAlt) editor.setDecorations(syntaxPulseDecorationTypeAlt, []);
    return;
  }
  if (!syntaxPulseDecorationType || !syntaxPulseDecorationTypeAlt) {
    getSyntaxPulseDecorationTypes();
  }
  const type1 = syntaxPulseDecorationType;
  const type2 = syntaxPulseDecorationTypeAlt;
  if (!type1 || !type2) return;
  const uri = editor.document.uri;
  const diagnostics = vscode.languages.getDiagnostics(uri).filter((d) => d.severity === vscode.DiagnosticSeverity.Error);
  const ranges = diagnostics.map((d) => d.range);
  editor.setDecorations(type1, ranges);
  editor.setDecorations(type2, []);
}

function startSyntaxPulseTimer(): void {
  if (pulseTimer) return;
  pulseTimer = setInterval(() => {
    const editor = vscode.window.activeTextEditor;
    const effects = getEffectsConfig();
    if (!effects.syntaxPulse || !editor || !syntaxPulseDecorationType || !syntaxPulseDecorationTypeAlt) return;
    const uri = editor.document.uri;
    const diagnostics = vscode.languages.getDiagnostics(uri).filter((d) => d.severity === vscode.DiagnosticSeverity.Error);
    const ranges = diagnostics.map((d) => d.range);
    const useAlt = Date.now() % 1000 < 500;
    const t1 = syntaxPulseDecorationType;
    const t2 = syntaxPulseDecorationTypeAlt;
    if (t1 && t2) {
      editor.setDecorations(t1, useAlt ? [] : ranges);
      editor.setDecorations(t2, useAlt ? ranges : []);
    }
  }, 500);
}

function stopSyntaxPulseTimer(): void {
  if (pulseTimer) {
    clearInterval(pulseTimer);
    pulseTimer = null;
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log("PRISM Theme extension is now active");
  extensionPath = context.extensionPath;

  // =====================================================================
  // STATUS BAR: Always-visible prism icon
  // =====================================================================
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = "$(symbol-color) Prism";
  statusBarItem.tooltip = "PRISM - 64 Color Themes";
  statusBarItem.command = "prism.openEffectsPanel";
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  // =====================================================================
  // Effects Panel Command
  // =====================================================================
  const openEffectsPanel = vscode.commands.registerCommand(
    "prism.openEffectsPanel",
    () => {
      PrismEffectsPanel.createOrShow(context);
    }
  );
  context.subscriptions.push(openEffectsPanel);

  // =====================================================================
  // Toggle Effect Commands
  // =====================================================================
  const toggleCursorGlow = vscode.commands.registerCommand(
    "prism.toggleCursorGlow",
    async () => {
      const config = vscode.workspace.getConfiguration("prism.effects");
      const current = config.get("cursorGlow", true);
      await config.update("cursorGlow", !current, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(`Cursor glow ${!current ? "enabled" : "disabled"}`);
    }
  );
  context.subscriptions.push(toggleCursorGlow);

  const toggleRainbowBrackets = vscode.commands.registerCommand(
    "prism.toggleRainbowBrackets",
    async () => {
      const config = vscode.workspace.getConfiguration("prism.effects");
      const current = config.get("rainbowBrackets", false);
      await config.update("rainbowBrackets", !current, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(`Rainbow brackets ${!current ? "enabled" : "disabled"}`);
    }
  );
  context.subscriptions.push(toggleRainbowBrackets);

  // =====================================================================
  // Apply Effects Based on Config
  // =====================================================================
  const applyEffects = async () => {
    const effects = getEffectsConfig();
    const editorConfig = vscode.workspace.getConfiguration("editor");

    // Smooth caret animation (native setting) - turn ON or OFF
    await editorConfig.update(
      "cursorBlinking",
      effects.smoothCaret ? "smooth" : "blink",
      vscode.ConfigurationTarget.Global
    );
    await editorConfig.update(
      "cursorSmoothCaretAnimation",
      effects.smoothCaret ? "on" : "off",
      vscode.ConfigurationTarget.Global
    );

    // Rainbow bracket colors (native bracket pair colorization) - turn ON or OFF
    await editorConfig.update(
      "bracketPairColorization.enabled",
      effects.rainbowBrackets,
      vscode.ConfigurationTarget.Global
    );
    if (effects.rainbowBrackets) {
      await editorConfig.update(
        "bracketPairColorization.independentColorPoolPerBracketType",
        true,
        vscode.ConfigurationTarget.Global
      );
    }

    // Visible current-line and bracket colors (override theme so they're actually visible)
    await applyColorCustomizations(effects);

    // Cursor glow: turn on native current-line highlight (color from customizations above)
    await editorConfig.update(
      "renderLineHighlight",
      effects.cursorGlow ? "line" : "none",
      vscode.ConfigurationTarget.Global
    );

    // Bracket highlight: enable bracket pair guides and native match (colors from customizations)
    await editorConfig.update(
      "guides.bracketPairs",
      effects.bracketHighlight ? "active" : false,
      vscode.ConfigurationTarget.Global
    );

    // Syntax pulse (decoration-based; may not render in all hosts)
    disposeSyntaxPulseDecorations();
    if (!effects.syntaxPulse) {
      stopSyntaxPulseTimer();
    } else {
      getSyntaxPulseDecorationTypes();
      startSyntaxPulseTimer();
    }
    const editor = vscode.window.activeTextEditor;
    updateSyntaxPulse(editor);
  };

  // Store reference so panel can call it
  applyEffectsRef = applyEffects;

  // Apply effects on activation
  applyEffects();

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      updateSyntaxPulse(editor);
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("prism.effects") || e.affectsConfiguration("workbench.colorTheme")) {
        applyEffects();
        PrismEffectsPanel.currentPanel?.refresh();
      }
    })
  );

  context.subscriptions.push(
    vscode.languages.onDidChangeDiagnostics((e) => {
      const editor = vscode.window.activeTextEditor;
      if (editor && e.uris.some((u) => u.toString() === editor.document.uri.toString())) {
        updateSyntaxPulse(editor);
      }
    })
  );

  // =====================================================================
  // Theme Quick Picker
  // =====================================================================
  const quickPick = vscode.commands.registerCommand(
    "prism.quickPick",
    async () => {
      const themes = [
        { label: "$(paintcan) Prism Acid Rain", description: "Toxic greens and industrial grays" },
        { label: "$(paintcan) Prism Aurora Glass", description: "Northern lights through frosted glass" },
        { label: "$(paintcan) Prism Blood Moon", description: "Deep crimson eclipse" },
        { label: "$(paintcan) Prism Catppuccin Mocha", description: "Classic reimagined" },
        { label: "$(paintcan) Prism Cyber Noir", description: "Dark cyberpunk with cyan accents" },
        { label: "$(paintcan) Prism Dracula Pro", description: "Enhanced Dracula palette" },
        { label: "$(paintcan) Prism Gruvbox Material", description: "Warm retro Gruvbox" },
        { label: "$(paintcan) Prism Neon Nexus", description: "Cyberpunk neon brilliance" },
        { label: "$(paintcan) Prism Nord Aurora", description: "Nordic colors with aurora" },
        { label: "$(paintcan) Prism Tokyo Night Bento", description: "Tokyo Night with bento aesthetics" },
      ];

      const selection = await vscode.window.showQuickPick(themes, {
        placeHolder: "Select a PRISM theme",
        matchOnDescription: true,
      });

      if (selection) {
        const themeName = selection.label.replace("$(paintcan) ", "");
        await vscode.workspace.getConfiguration("workbench").update(
          "colorTheme",
          themeName,
          vscode.ConfigurationTarget.Global
        );
      }
    }
  );
  context.subscriptions.push(quickPick);

  // Show welcome message on first install
  const hasShownWelcome = context.globalState.get("prism.hasShownWelcome");
  if (!hasShownWelcome) {
    vscode.window.showInformationMessage(
      "PRISM installed! 64 curated themes with visual effects ready.",
      "Open Effects Panel",
      "Browse Themes"
    ).then(selection => {
      if (selection === "Open Effects Panel") {
        vscode.commands.executeCommand("prism.openEffectsPanel");
      } else if (selection === "Browse Themes") {
        vscode.commands.executeCommand("workbench.action.selectTheme");
      }
    });
    context.globalState.update("prism.hasShownWelcome", true);
  }
}

// ============================================================================
// Effects Panel
// ============================================================================

class PrismEffectsPanel {
  public static currentPanel: PrismEffectsPanel | undefined;
  public static readonly viewType = "prismEffects";

  private readonly _panel: vscode.WebviewPanel;
  private readonly _context: vscode.ExtensionContext;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(context: vscode.ExtensionContext) {
    const column = vscode.window.activeTextEditor?.viewColumn ?? vscode.ViewColumn.One;

    if (PrismEffectsPanel.currentPanel) {
      PrismEffectsPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      PrismEffectsPanel.viewType,
      "PRISM Effects",
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    PrismEffectsPanel.currentPanel = new PrismEffectsPanel(panel, context);
    const editor = vscode.window.activeTextEditor;
    updateSyntaxPulse(editor);
  }

  private constructor(panel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
    this._panel = panel;
    this._context = context;

    this._update();

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._panel.webview.onDidReceiveMessage(
      async (message) => {
        switch (message.command) {
          case "toggleEffect": {
            const config = vscode.workspace.getConfiguration("prism.effects");
            const current = config.get(message.effect, false);
            await config.update(message.effect, !current, vscode.ConfigurationTarget.Global);
            if (applyEffectsRef) await applyEffectsRef();
            this._update();
            const editor = vscode.window.activeTextEditor;
            updateSyntaxPulse(editor);
            break;
          }
          case "setIntensity": {
            const intensityConfig = vscode.workspace.getConfiguration("prism.effects");
            await intensityConfig.update("glowIntensity", message.value, vscode.ConfigurationTarget.Global);
            break;
          }
          case "openThemes":
            vscode.commands.executeCommand("workbench.action.selectTheme");
            break;
        }
      },
      null,
      this._disposables
    );
  }

  private _update() {
    this._panel.webview.html = this._getHtmlForWebview();
  }

  /** Call when theme or effects config changes so panel restyles to match loaded theme */
  public refresh() {
    this._update();
  }

  private _getHtmlForWebview(): string {
    const effects = getEffectsConfig();
    const theme = getPanelThemeColors();
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PRISM Effects</title>
  <style>
    :root {
      --bg: ${theme.bg};
      --fg: ${theme.fg};
      --surface: ${theme.surface};
      --border: ${theme.border};
      --accent: ${theme.accent};
      --accent2: ${theme.accent2};
      --accent3: ${theme.accent};
      --button-bg: ${theme.buttonBg};
      --button-fg: ${theme.buttonFg};
      --toggle-thumb: ${theme.toggleThumb};
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--vscode-font-family);
      background: var(--bg);
      color: var(--fg);
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.6;
    }
    
    .header {
      text-align: center;
      margin-bottom: 32px;
    }
    h1 {
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 8px;
      color: var(--accent);
    }
    .subtitle { opacity: 0.7; font-size: 0.9rem; color: var(--fg); }
    
    .effect-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    
    .effect-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .effect-card:hover {
      border-color: var(--accent);
      transform: translateY(-2px);
    }
    .effect-card.active {
      border-color: var(--accent);
      box-shadow: 0 0 20px color-mix(in srgb, var(--accent) 25%, transparent);
    }
    
    .effect-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .effect-name {
      font-weight: 600;
      font-size: 1rem;
    }
    .effect-toggle {
      width: 48px;
      height: 26px;
      border-radius: 13px;
      background: var(--border);
      position: relative;
      transition: background 0.2s;
    }
    .effect-toggle.on {
      background: var(--accent);
    }
    .effect-toggle::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--toggle-thumb);
      top: 3px;
      left: 3px;
      transition: transform 0.2s;
    }
    .effect-toggle.on::after {
      transform: translateX(22px);
      background: var(--toggle-thumb);
    }
    
    .effect-description {
      font-size: 0.85rem;
      opacity: 0.7;
    }
    
    .effect-preview {
      margin-top: 12px;
      height: 60px;
      border-radius: 8px;
      overflow: hidden;
      background: var(--bg);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: monospace;
      font-size: 0.8rem;
      color: var(--accent);
    }
    
    .section-title {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      opacity: 0.5;
      margin: 32px 0 16px;
    }
    
    .intensity-slider {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .intensity-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    input[type="range"] {
      width: 100%;
      height: 6px;
      -webkit-appearance: none;
      appearance: none;
      border-radius: 3px;
      background: linear-gradient(to right, var(--border), var(--accent));
    }
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--accent);
      cursor: pointer;
      box-shadow: 0 0 10px var(--accent);
    }
    
    .themes-btn {
      width: 100%;
      padding: 16px;
      background: var(--button-bg);
      color: var(--button-fg);
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .themes-btn:hover {
      transform: scale(1.02);
      filter: brightness(1.1);
    }
    
    .info-box {
      background: color-mix(in srgb, var(--accent) 12%, var(--surface));
      border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
      border-radius: 8px;
      padding: 16px;
      margin-top: 24px;
      font-size: 0.85rem;
      color: var(--fg);
    }
    
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 10px var(--accent); }
      50% { box-shadow: 0 0 20px var(--accent), 0 0 30px var(--accent2); }
    }
    @keyframes rainbow {
      0% { color: #ff6b6b; }
      33% { color: #54aeff; }
      66% { color: #9d65ff; }
      100% { color: #ff6b6b; }
    }
    .preview-glow { animation: glow 2s ease-in-out infinite; }
    .preview-rainbow span { animation: rainbow 3s linear infinite; }
  </style>
</head>
<body>
  <div class="header">
    <h1>PRISM Effects</h1>
    <p class="subtitle">Visual enhancements for your coding experience</p>
  </div>
  
  <div class="effect-grid">
    <div class="effect-card ${effects.smoothCaret ? 'active' : ''}" onclick="toggle('smoothCaret')">
      <div class="effect-header">
        <span class="effect-name">Smooth Caret</span>
        <div class="effect-toggle ${effects.smoothCaret ? 'on' : ''}"></div>
      </div>
      <p class="effect-description">Silky smooth cursor animation while typing</p>
      <div class="effect-preview">
        <span style="border-right: 2px solid var(--accent); padding-right: 2px;">const prism</span>
      </div>
    </div>
    
    <div class="effect-card ${effects.cursorGlow ? 'active' : ''}" onclick="toggle('cursorGlow')">
      <div class="effect-header">
        <span class="effect-name">Cursor Glow</span>
        <div class="effect-toggle ${effects.cursorGlow ? 'on' : ''}"></div>
      </div>
      <p class="effect-description">Highlight current line (uses theme color)</p>
      <div class="effect-preview preview-glow">
        <span>|</span>
      </div>
    </div>
    
    <div class="effect-card ${effects.rainbowBrackets ? 'active' : ''}" onclick="toggle('rainbowBrackets')">
      <div class="effect-header">
        <span class="effect-name">Rainbow Brackets</span>
        <div class="effect-toggle ${effects.rainbowBrackets ? 'on' : ''}"></div>
      </div>
      <p class="effect-description">Colorful bracket pairs for easy matching</p>
      <div class="effect-preview preview-rainbow">
        <span style="color:#ff6b6b">{</span><span style="color:#54aeff">[</span><span style="color:#9d65ff">(</span>code<span style="color:#9d65ff">)</span><span style="color:#54aeff">]</span><span style="color:#ff6b6b">}</span>
      </div>
    </div>
    
    <div class="effect-card ${effects.bracketHighlight ? 'active' : ''}" onclick="toggle('bracketHighlight')">
      <div class="effect-header">
        <span class="effect-name">Bracket Highlight</span>
        <div class="effect-toggle ${effects.bracketHighlight ? 'on' : ''}"></div>
      </div>
      <p class="effect-description">Bracket pair guides and native match highlight</p>
      <div class="effect-preview">
        <span style="background: rgba(255,107,157,0.2); padding: 2px 4px; border-radius: 3px;">{</span> ... <span style="background: rgba(255,107,157,0.2); padding: 2px 4px; border-radius: 3px;">}</span>
      </div>
    </div>
    
    <div class="effect-card ${effects.syntaxPulse ? 'active' : ''}" onclick="toggle('syntaxPulse')">
      <div class="effect-header">
        <span class="effect-name">Syntax Pulse</span>
        <div class="effect-toggle ${effects.syntaxPulse ? 'on' : ''}"></div>
      </div>
      <p class="effect-description">Subtle pulse on syntax errors (experimental)</p>
      <div class="effect-preview">
        <span style="text-decoration: wavy underline red;">undefined_var</span>
      </div>
    </div>
  </div>
  
  <div class="intensity-slider">
    <div class="intensity-header">
      <span>Effect Intensity</span>
      <span>${Math.round(effects.glowIntensity * 100)}%</span>
    </div>
    <input type="range" min="0" max="100" value="${effects.glowIntensity * 100}" 
           oninput="setIntensity(this.value)">
  </div>
  
  <button class="themes-btn" onclick="openThemes()">
    Browse 64 PRISM Themes
  </button>
  
  <div class="info-box">
    <strong>Tip:</strong> Use <strong>Ctrl+K Ctrl+T</strong> and pick a <strong>Prism</strong> theme so syntax and effects use the theme. Line and bracket highlights are boosted so they’re visible in the code window.
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    
    function toggle(effect) {
      vscode.postMessage({ command: 'toggleEffect', effect });
    }
    
    function setIntensity(value) {
      vscode.postMessage({ command: 'setIntensity', value: value / 100 });
    }
    
    function openThemes() {
      vscode.postMessage({ command: 'openThemes' });
    }
  </script>
</body>
</html>`;
  }

  public dispose() {
    PrismEffectsPanel.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) x.dispose();
    }
  }
}

export function deactivate() {
  stopSyntaxPulseTimer();
  if (syntaxPulseDecorationType) {
    syntaxPulseDecorationType.dispose();
    syntaxPulseDecorationType = null;
  }
  if (syntaxPulseDecorationTypeAlt) {
    syntaxPulseDecorationTypeAlt.dispose();
    syntaxPulseDecorationTypeAlt = null;
  }
  if (statusBarItem) {
    statusBarItem.dispose();
  }
}
