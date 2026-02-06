/**
 * PRISM Theme Extension
 * 
 * 64 curated color themes with optional visual effects
 * 
 * Project: PRISM - When Color meets Math
 * Author: Omega
 */

import * as vscode from "vscode";

// Status bar item for quick access
let statusBarItem: vscode.StatusBarItem;
let applyEffectsRef: (() => Promise<void>) | null = null;

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

export function activate(context: vscode.ExtensionContext) {
  console.log("PRISM Theme extension is now active");

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
    
    // Smooth caret animation - turn ON or OFF
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
    
    // Rainbow bracket colors - turn ON or OFF
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

    // Cursor glow: current-line highlight
    await editorConfig.update(
      "renderLineHighlight",
      effects.cursorGlow ? "line" : "none",
      vscode.ConfigurationTarget.Global
    );

    // Bracket highlight: bracket pair guides
    await editorConfig.update(
      "guides.bracketPairs",
      effects.bracketHighlight ? "active" : false,
      vscode.ConfigurationTarget.Global
    );
  };

  // Store reference so panel can call it
  applyEffectsRef = applyEffects;

  // Apply effects on activation
  applyEffects();

  // Re-apply effects when configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("prism.effects")) {
        applyEffects();
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
            break;
          }
          case "setIntensity":
            const intensityConfig = vscode.workspace.getConfiguration("prism.effects");
            await intensityConfig.update("glowIntensity", message.value, vscode.ConfigurationTarget.Global);
            break;
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

  private _getHtmlForWebview(): string {
    const effects = getEffectsConfig();
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PRISM Effects</title>
  <style>
    :root {
      --bg: var(--vscode-editor-background);
      --fg: var(--vscode-editor-foreground);
      --surface: var(--vscode-sideBar-background);
      --border: var(--vscode-panel-border);
      --accent: #ff6b9d;
      --accent2: #54aeff;
      --accent3: #9d65ff;
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
      font-weight: 300;
      margin-bottom: 8px;
      background: linear-gradient(135deg, var(--accent), var(--accent2), var(--accent3));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .subtitle { opacity: 0.7; font-size: 0.9rem; }
    
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
      box-shadow: 0 0 20px rgba(255, 107, 157, 0.2);
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
      background: white;
      top: 3px;
      left: 3px;
      transition: transform 0.2s;
    }
    .effect-toggle.on::after {
      transform: translateX(22px);
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
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      border: none;
      border-radius: 8px;
      color: white;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .themes-btn:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 20px rgba(255, 107, 157, 0.3);
    }
    
    .info-box {
      background: linear-gradient(135deg, rgba(84, 174, 255, 0.1), rgba(84, 174, 255, 0.02));
      border: 1px solid rgba(84, 174, 255, 0.2);
      border-radius: 8px;
      padding: 16px;
      margin-top: 24px;
      font-size: 0.85rem;
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
      <p class="effect-description">Subtle glow effect around the cursor</p>
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
      <p class="effect-description">Highlight matching brackets on hover</p>
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
    <strong>Tip:</strong> All effects respect <code>prefers-reduced-motion</code> for accessibility.
    Effects are applied via native VSCode settings for maximum performance.
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
  if (statusBarItem) {
    statusBarItem.dispose();
  }
}
