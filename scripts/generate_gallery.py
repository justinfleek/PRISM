#!/usr/bin/env python3
"""
Prism Theme Gallery - Shows ALL semantic tokens: Code + Markdown/Prose
"""

import json
from pathlib import Path

THEMES_DIR = Path(__file__).parent.parent / "vscode" / "themes"
OUTPUT_FILE = Path(__file__).parent.parent / "gallery.html"

def load_theme(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def get_token_color(theme, scope, default=None):
    if isinstance(scope, list):
        for s in scope:
            color = get_token_color(theme, s)
            if color:
                return color
        return default
    for token in theme.get("tokenColors", []):
        token_scope = token.get("scope", [])
        if isinstance(token_scope, str):
            token_scope = [token_scope]
        if scope in token_scope:
            return token.get("settings", {}).get("foreground", default)
    return default

def extract_colors(theme):
    colors = theme.get("colors", {})
    fg = colors.get("editor.foreground", "#ffffff")
    keyword = get_token_color(theme, ["keyword", "keyword.control", "storage.type"], "#ff79c6")
    string = get_token_color(theme, "string", "#a5d6a7")
    comment = get_token_color(theme, "comment", "#666666")
    function = get_token_color(theme, ["entity.name.function", "support.function"], keyword)
    constant = get_token_color(theme, ["constant.numeric", "constant.language"], "#82aaff")
    
    return {
        # UI
        'background': colors.get("editor.background", "#000"),
        'foreground': fg,
        'lineHighlight': colors.get("editor.lineHighlightBackground", "#111"),
        'lineNumber': colors.get("editorLineNumber.foreground", "#444"),
        'cursor': colors.get("editorCursor.foreground", "#fff"),
        'selection': colors.get("editor.selectionBackground", "#333"),
        'sidebarBg': colors.get("sideBar.background", "#111"),
        'statusBar': colors.get("statusBar.foreground", "#666"),
        # Code syntax
        'comment': comment,
        'keyword': keyword,
        'string': string,
        'constant': constant,
        'variable': get_token_color(theme, "variable", fg),
        'parameter': get_token_color(theme, "variable.parameter", fg),
        'function': function,
        'type': get_token_color(theme, ["entity.name.type", "entity.name.class"], fg),
        'tag': get_token_color(theme, "entity.name.tag", keyword),
        'attribute': get_token_color(theme, "entity.other.attribute-name", string),
        'punctuation': get_token_color(theme, "punctuation", comment),
        'decorator': get_token_color(theme, "meta.decorator", keyword),
        # Markdown/prose
        'heading1': get_token_color(theme, "markup.heading.1", keyword),
        'heading2': get_token_color(theme, "markup.heading.2", keyword),
        'heading3': get_token_color(theme, "markup.heading.3", function),
        'heading4': get_token_color(theme, "markup.heading.4", function),
        'heading5': get_token_color(theme, "markup.heading.5", string),
        'heading6': get_token_color(theme, "markup.heading.6", string),
        'bold': get_token_color(theme, "markup.bold", fg),
        'italic': get_token_color(theme, "markup.italic", fg),
        'strikethrough': get_token_color(theme, "markup.strikethrough", comment),
        'quote': get_token_color(theme, "markup.quote", comment),
        'listMarker': get_token_color(theme, ["markup.list", "punctuation.definition.list"], constant),
        'inlineCode': get_token_color(theme, ["markup.inline.raw", "markup.raw"], string),
        'link': get_token_color(theme, ["markup.underline.link", "string.other.link"], keyword),
    }

def generate_html(themes):
    dark_count = len([t for t in themes if t['type'] == 'dark'])
    light_count = len([t for t in themes if t['type'] == 'light'])
    
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prism Themes - Complete Semantic Preview (Code + Prose)</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono&display=swap');
    :root {{ --bg:#09090b; --surface:#0f0f12; --border:#1f1f25; --text:#e4e4e8; --muted:#6b6b75; --accent:#6366f1; }}
    * {{ box-sizing:border-box; margin:0; padding:0; }}
    body {{ font-family:'Inter',sans-serif; background:var(--bg); color:var(--text); line-height:1.5; }}
    header {{ text-align:center; padding:2.5rem 2rem; border-bottom:1px solid var(--border); }}
    h1 {{ font-size:2.25rem; font-weight:700; background:linear-gradient(135deg,#6366f1,#a855f7,#ec4899); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }}
    .subtitle {{ color:var(--muted); margin-top:0.5rem; font-size:0.95rem; }}
    .stats {{ display:flex; justify-content:center; gap:1.25rem; margin-top:1.25rem; flex-wrap:wrap; }}
    .stat {{ background:var(--surface); padding:0.6rem 1rem; border-radius:8px; border:1px solid var(--border); }}
    .stat-value {{ font-size:1.1rem; font-weight:600; color:var(--accent); }}
    .stat-label {{ font-size:0.75rem; color:var(--muted); }}
    nav {{ position:sticky; top:0; z-index:100; background:rgba(9,9,11,0.92); backdrop-filter:blur(12px); border-bottom:1px solid var(--border); padding:0.6rem 2rem; }}
    nav ul {{ display:flex; gap:0.75rem; justify-content:center; list-style:none; flex-wrap:wrap; }}
    nav a {{ color:var(--muted); text-decoration:none; font-size:0.8rem; padding:0.35rem 0.7rem; border-radius:5px; }}
    nav a:hover {{ color:var(--text); background:var(--surface); }}
    section {{ padding:2.5rem 2rem; max-width:2000px; margin:0 auto; }}
    .section-title {{ font-size:1.35rem; font-weight:600; margin-bottom:0.4rem; }}
    .section-desc {{ color:var(--muted); margin-bottom:1.25rem; font-size:0.9rem; }}
    .filter-bar {{ display:flex; gap:0.4rem; margin-bottom:1.25rem; flex-wrap:wrap; }}
    .filter-btn {{ background:var(--surface); border:1px solid var(--border); color:var(--muted); padding:0.35rem 0.9rem; border-radius:5px; cursor:pointer; font-size:0.8rem; font-family:inherit; }}
    .filter-btn:hover, .filter-btn.active {{ background:var(--accent); border-color:var(--accent); color:#fff; }}
    .themes-grid {{ display:grid; grid-template-columns:repeat(auto-fill,minmax(800px,1fr)); gap:1.25rem; }}
    .theme-card {{ background:var(--surface); border-radius:10px; overflow:hidden; border:1px solid var(--border); }}
    .theme-header {{ display:flex; justify-content:space-between; align-items:center; padding:0.6rem 1rem; background:rgba(0,0,0,0.3); border-bottom:1px solid var(--border); }}
    .theme-name {{ font-size:0.95rem; font-weight:600; }}
    .type-badge {{ font-size:0.55rem; padding:0.15rem 0.4rem; border-radius:3px; text-transform:uppercase; letter-spacing:0.03em; }}
    .type-badge.dark {{ background:rgba(0,0,0,0.5); color:rgba(255,255,255,0.65); }}
    .type-badge.light {{ background:rgba(255,255,255,0.75); color:rgba(0,0,0,0.55); }}
    
    .preview-container {{ display:grid; grid-template-columns:1fr 1fr; }}
    
    /* Code Preview */
    .code-preview {{ padding:1rem; font-family:'JetBrains Mono',monospace; font-size:10.5px; line-height:1.55; border-right:1px solid var(--border); overflow-x:auto; }}
    .code-preview .line {{ white-space:pre; }}
    .code-section-label {{ font-size:0.6rem; text-transform:uppercase; letter-spacing:0.04em; padding:0.3rem 0.6rem; background:rgba(0,0,0,0.3); color:var(--muted); }}
    
    /* Prose Preview */
    .prose-preview {{ padding:1rem; font-family:'Inter',sans-serif; font-size:11px; line-height:1.6; overflow-x:auto; }}
    .prose-preview .h1 {{ font-size:1.5em; font-weight:700; margin:0.5em 0 0.3em; }}
    .prose-preview .h2 {{ font-size:1.3em; font-weight:600; margin:0.5em 0 0.3em; }}
    .prose-preview .h3 {{ font-size:1.15em; font-weight:600; margin:0.4em 0 0.25em; }}
    .prose-preview .h4 {{ font-size:1.05em; font-weight:500; margin:0.4em 0 0.25em; }}
    .prose-preview .h5 {{ font-size:0.95em; font-weight:500; margin:0.3em 0 0.2em; }}
    .prose-preview .h6 {{ font-size:0.9em; font-weight:500; margin:0.3em 0 0.2em; }}
    .prose-preview .body {{ margin:0.4em 0; }}
    .prose-preview .quote {{ padding-left:0.8em; border-left:3px solid; margin:0.5em 0; font-style:italic; }}
    .prose-preview .list {{ margin:0.4em 0 0.4em 1.2em; }}
    .prose-preview .list-item {{ margin:0.15em 0; }}
    .prose-preview .code-inline {{ font-family:'JetBrains Mono',monospace; padding:0.1em 0.35em; border-radius:3px; font-size:0.9em; }}
    .prose-preview hr {{ border:none; border-top:1px solid; margin:0.6em 0; opacity:0.3; }}
    
    /* Color Legend */
    .color-legend {{ padding:0.8rem; border-top:1px solid var(--border); background:rgba(0,0,0,0.2); }}
    .legend-section {{ margin-bottom:0.6rem; }}
    .legend-section:last-child {{ margin-bottom:0; }}
    .legend-title {{ font-size:0.6rem; font-weight:600; text-transform:uppercase; letter-spacing:0.04em; color:var(--muted); margin-bottom:0.35rem; }}
    .legend-grid {{ display:grid; grid-template-columns:repeat(auto-fill,minmax(100px,1fr)); gap:0.3rem; }}
    .legend-item {{ display:flex; align-items:center; gap:0.3rem; padding:0.15rem 0.25rem; border-radius:3px; cursor:pointer; }}
    .legend-item:hover {{ background:rgba(255,255,255,0.05); }}
    .legend-swatch {{ width:14px; height:14px; border-radius:3px; border:1px solid rgba(255,255,255,0.12); flex-shrink:0; }}
    .legend-label {{ font-size:0.58rem; color:var(--muted); }}
    .legend-hex {{ font-family:'JetBrains Mono',monospace; font-size:0.52rem; color:var(--text); }}
    
    footer {{ text-align:center; padding:2.5rem 2rem; border-top:1px solid var(--border); color:var(--muted); font-size:0.8rem; }}
    footer a {{ color:var(--accent); text-decoration:none; }}
    .toast {{ position:fixed; bottom:1.25rem; left:50%; transform:translateX(-50%) translateY(70px); background:var(--surface); color:var(--text); padding:0.5rem 1rem; border-radius:5px; border:1px solid var(--border); font-size:0.75rem; opacity:0; transition:all 0.2s; z-index:1000; }}
    .toast.show {{ transform:translateX(-50%) translateY(0); opacity:1; }}
    @media (max-width:1600px) {{ .themes-grid {{ grid-template-columns:1fr; }} }}
    @media (max-width:900px) {{ .preview-container {{ grid-template-columns:1fr; }} .code-preview {{ border-right:none; border-bottom:1px solid var(--border); }} }}
  </style>
</head>
<body>
  <header>
    <h1>Prism Themes</h1>
    <p class="subtitle">64 OKLCH color science themes - Complete Code + Prose preview</p>
    <div class="stats">
      <div class="stat"><div class="stat-value">64</div><div class="stat-label">Themes</div></div>
      <div class="stat"><div class="stat-value">{dark_count}</div><div class="stat-label">Dark</div></div>
      <div class="stat"><div class="stat-value">{light_count}</div><div class="stat-label">Light</div></div>
      <div class="stat"><div class="stat-value">35+</div><div class="stat-label">Tokens</div></div>
    </div>
  </header>
  <nav><ul><li><a href="#themes">All Themes</a></li></ul></nav>
  
  <section id="themes">
    <h2 class="section-title">All 64 Themes - Code & Prose Preview</h2>
    <p class="section-desc">Left: Code syntax tokens. Right: Markdown/prose tokens (headings, body, bold, italic, links, lists, quotes, inline code)</p>
    <div class="filter-bar">
      <button class="filter-btn active" data-filter="all">All (64)</button>
      <button class="filter-btn" data-filter="dark">Dark ({dark_count})</button>
      <button class="filter-btn" data-filter="light">Light ({light_count})</button>
    </div>
    <div class="themes-grid">
'''
    
    for t in themes:
        c = t['colors']
        badge = 'dark' if t['type'] == 'dark' else 'light'
        
        html += f'''      <div class="theme-card" data-type="{t['type']}">
        <div class="theme-header">
          <div class="theme-name">{t['name']}</div>
          <span class="type-badge {badge}">{t['type']}</span>
        </div>
        <div class="preview-container">
          <div>
            <div class="code-section-label" style="background:{c['sidebarBg']}; color:{c['statusBar']}">Code Syntax</div>
            <div class="code-preview" style="background:{c['background']}">
              <div class="line"><span style="color:{c['comment']};font-style:italic">// {t['name']} - Code Preview</span></div>
              <div class="line"><span style="color:{c['keyword']}">import</span> <span style="color:{c['punctuation']}">{{</span> <span style="color:{c['type']}">Component</span><span style="color:{c['punctuation']}">,</span> <span style="color:{c['type']}">useState</span> <span style="color:{c['punctuation']}">}}</span> <span style="color:{c['keyword']}">from</span> <span style="color:{c['string']}">'react'</span><span style="color:{c['punctuation']}">;</span></div>
              <div class="line"></div>
              <div class="line"><span style="color:{c['decorator']}">@observable</span></div>
              <div class="line"><span style="color:{c['keyword']}">class</span> <span style="color:{c['type']}">UserService</span> <span style="color:{c['punctuation']}">{{</span></div>
              <div class="line">  <span style="color:{c['variable']}">count</span> <span style="color:{c['punctuation']}">=</span> <span style="color:{c['constant']}">42</span><span style="color:{c['punctuation']}">;</span></div>
              <div class="line">  <span style="color:{c['variable']}">active</span> <span style="color:{c['punctuation']}">=</span> <span style="color:{c['constant']}">true</span><span style="color:{c['punctuation']}">;</span></div>
              <div class="line"></div>
              <div class="line">  <span style="color:{c['keyword']}">async</span> <span style="color:{c['function']}">fetchData</span><span style="color:{c['punctuation']}">(</span><span style="color:{c['parameter']}">id</span><span style="color:{c['punctuation']}">:</span> <span style="color:{c['type']}">number</span><span style="color:{c['punctuation']}">)</span> <span style="color:{c['punctuation']}">{{</span></div>
              <div class="line">    <span style="color:{c['keyword']}">const</span> <span style="color:{c['variable']}">url</span> <span style="color:{c['punctuation']}">=</span> <span style="color:{c['string']}">`/api/${{</span><span style="color:{c['variable']}">id</span><span style="color:{c['string']}">}}`</span><span style="color:{c['punctuation']}">;</span></div>
              <div class="line">    <span style="color:{c['keyword']}">return</span> <span style="color:{c['keyword']}">await</span> <span style="color:{c['function']}">fetch</span><span style="color:{c['punctuation']}">(</span><span style="color:{c['variable']}">url</span><span style="color:{c['punctuation']}">)</span><span style="color:{c['punctuation']}">;</span></div>
              <div class="line">  <span style="color:{c['punctuation']}">}}</span></div>
              <div class="line"></div>
              <div class="line">  <span style="color:{c['function']}">render</span><span style="color:{c['punctuation']}">()</span> <span style="color:{c['punctuation']}">{{</span></div>
              <div class="line">    <span style="color:{c['keyword']}">return</span> <span style="color:{c['punctuation']}">(</span></div>
              <div class="line">      <span style="color:{c['tag']}">&lt;div</span> <span style="color:{c['attribute']}">className</span><span style="color:{c['punctuation']}">="</span><span style="color:{c['string']}">container</span><span style="color:{c['punctuation']}">"</span><span style="color:{c['tag']}">&gt;</span></div>
              <div class="line">        <span style="color:{c['tag']}">&lt;Button</span> <span style="color:{c['attribute']}">onClick</span><span style="color:{c['punctuation']}">={{</span><span style="color:{c['keyword']}">this</span><span style="color:{c['punctuation']}">.</span><span style="color:{c['function']}">fetchData</span><span style="color:{c['punctuation']}">}}</span><span style="color:{c['tag']}">&gt;</span></div>
              <div class="line">          <span style="color:{c['variable']}">Click</span> <span style="color:{c['punctuation']}">{{</span><span style="color:{c['keyword']}">this</span><span style="color:{c['punctuation']}">.</span><span style="color:{c['variable']}">count</span><span style="color:{c['punctuation']}">}}</span></div>
              <div class="line">        <span style="color:{c['tag']}">&lt;/Button&gt;</span></div>
              <div class="line">      <span style="color:{c['tag']}">&lt;/div&gt;</span></div>
              <div class="line">    <span style="color:{c['punctuation']}">);</span></div>
              <div class="line">  <span style="color:{c['punctuation']}">}}</span></div>
              <div class="line"><span style="color:{c['punctuation']}">}}</span></div>
            </div>
          </div>
          <div>
            <div class="code-section-label" style="background:{c['sidebarBg']}; color:{c['statusBar']}">Markdown / Prose</div>
            <div class="prose-preview" style="background:{c['background']}; color:{c['foreground']}">
              <div class="h1" style="color:{c['heading1']}; font-weight:700"># Heading 1 - Primary Title</div>
              <div class="h2" style="color:{c['heading2']}; font-weight:600">## Heading 2 - Section Header</div>
              <div class="h3" style="color:{c['heading3']}; font-weight:600">### Heading 3 - Subsection</div>
              <div class="h4" style="color:{c['heading4']}">#### Heading 4 - Minor Section</div>
              <div class="h5" style="color:{c['heading5']}">##### Heading 5 - Small Header</div>
              <div class="h6" style="color:{c['heading6']}; opacity:0.85">###### Heading 6 - Smallest</div>
              <hr style="border-color:{c['punctuation']}">
              <div class="body" style="color:{c['foreground']}">This is regular body text. It uses the default foreground color for readability.</div>
              <div class="body" style="color:{c['foreground']}">Here is <span style="color:{c['bold']}; font-weight:700">bold text</span> and <span style="color:{c['italic']}; font-style:italic">italic text</span> and <span style="font-weight:700; font-style:italic; color:{c['bold']}">bold italic combined</span>.</div>
              <div class="body" style="color:{c['foreground']}">This has <span style="color:{c['strikethrough']}; text-decoration:line-through">strikethrough text</span> for deletions.</div>
              <div class="body" style="color:{c['foreground']}">Click this <span style="color:{c['link']}; text-decoration:underline">hyperlink to somewhere</span> for more info.</div>
              <div class="body" style="color:{c['foreground']}">Use <span class="code-inline" style="color:{c['inlineCode']}; background:{c['lineHighlight']}">inline code</span> for technical terms.</div>
              <div class="quote" style="color:{c['quote']}; border-color:{c['quote']}">
                "This is a blockquote. It should be visually distinct from body text."
              </div>
              <div class="list">
                <div class="list-item"><span style="color:{c['listMarker']}">•</span> <span style="color:{c['foreground']}">First list item with body text</span></div>
                <div class="list-item"><span style="color:{c['listMarker']}">•</span> <span style="color:{c['foreground']}">Second item with</span> <span style="color:{c['bold']}; font-weight:700">bold</span></div>
                <div class="list-item"><span style="color:{c['listMarker']}">•</span> <span style="color:{c['foreground']}">Third with</span> <span class="code-inline" style="color:{c['inlineCode']}; background:{c['lineHighlight']}">code</span></div>
                <div class="list-item"><span style="color:{c['listMarker']}">1.</span> <span style="color:{c['foreground']}">Numbered list item</span></div>
                <div class="list-item"><span style="color:{c['listMarker']}">2.</span> <span style="color:{c['foreground']}">Another numbered item</span></div>
              </div>
            </div>
          </div>
        </div>
        <div class="color-legend">
          <div class="legend-section">
            <div class="legend-title">UI Colors</div>
            <div class="legend-grid">
              <div class="legend-item" data-hex="{c['background']}"><div class="legend-swatch" style="background:{c['background']}"></div><div><div class="legend-label">Background</div><div class="legend-hex">{c['background']}</div></div></div>
              <div class="legend-item" data-hex="{c['foreground']}"><div class="legend-swatch" style="background:{c['foreground']}"></div><div><div class="legend-label">Foreground</div><div class="legend-hex">{c['foreground']}</div></div></div>
              <div class="legend-item" data-hex="{c['lineHighlight']}"><div class="legend-swatch" style="background:{c['lineHighlight']}"></div><div><div class="legend-label">Line Highlight</div><div class="legend-hex">{c['lineHighlight']}</div></div></div>
              <div class="legend-item" data-hex="{c['lineNumber']}"><div class="legend-swatch" style="background:{c['lineNumber']}"></div><div><div class="legend-label">Line Numbers</div><div class="legend-hex">{c['lineNumber']}</div></div></div>
              <div class="legend-item" data-hex="{c['cursor']}"><div class="legend-swatch" style="background:{c['cursor']}"></div><div><div class="legend-label">Cursor</div><div class="legend-hex">{c['cursor']}</div></div></div>
              <div class="legend-item" data-hex="{c['selection']}"><div class="legend-swatch" style="background:{c['selection']}"></div><div><div class="legend-label">Selection</div><div class="legend-hex">{c['selection']}</div></div></div>
            </div>
          </div>
          <div class="legend-section">
            <div class="legend-title">Code Syntax</div>
            <div class="legend-grid">
              <div class="legend-item" data-hex="{c['comment']}"><div class="legend-swatch" style="background:{c['comment']}"></div><div><div class="legend-label">Comments</div><div class="legend-hex">{c['comment']}</div></div></div>
              <div class="legend-item" data-hex="{c['keyword']}"><div class="legend-swatch" style="background:{c['keyword']}"></div><div><div class="legend-label">Keywords</div><div class="legend-hex">{c['keyword']}</div></div></div>
              <div class="legend-item" data-hex="{c['string']}"><div class="legend-swatch" style="background:{c['string']}"></div><div><div class="legend-label">Strings</div><div class="legend-hex">{c['string']}</div></div></div>
              <div class="legend-item" data-hex="{c['constant']}"><div class="legend-swatch" style="background:{c['constant']}"></div><div><div class="legend-label">Constants</div><div class="legend-hex">{c['constant']}</div></div></div>
              <div class="legend-item" data-hex="{c['variable']}"><div class="legend-swatch" style="background:{c['variable']}"></div><div><div class="legend-label">Variables</div><div class="legend-hex">{c['variable']}</div></div></div>
              <div class="legend-item" data-hex="{c['parameter']}"><div class="legend-swatch" style="background:{c['parameter']}"></div><div><div class="legend-label">Parameters</div><div class="legend-hex">{c['parameter']}</div></div></div>
              <div class="legend-item" data-hex="{c['function']}"><div class="legend-swatch" style="background:{c['function']}"></div><div><div class="legend-label">Functions</div><div class="legend-hex">{c['function']}</div></div></div>
              <div class="legend-item" data-hex="{c['type']}"><div class="legend-swatch" style="background:{c['type']}"></div><div><div class="legend-label">Types</div><div class="legend-hex">{c['type']}</div></div></div>
              <div class="legend-item" data-hex="{c['tag']}"><div class="legend-swatch" style="background:{c['tag']}"></div><div><div class="legend-label">Tags</div><div class="legend-hex">{c['tag']}</div></div></div>
              <div class="legend-item" data-hex="{c['attribute']}"><div class="legend-swatch" style="background:{c['attribute']}"></div><div><div class="legend-label">Attributes</div><div class="legend-hex">{c['attribute']}</div></div></div>
              <div class="legend-item" data-hex="{c['punctuation']}"><div class="legend-swatch" style="background:{c['punctuation']}"></div><div><div class="legend-label">Punctuation</div><div class="legend-hex">{c['punctuation']}</div></div></div>
              <div class="legend-item" data-hex="{c['decorator']}"><div class="legend-swatch" style="background:{c['decorator']}"></div><div><div class="legend-label">Decorators</div><div class="legend-hex">{c['decorator']}</div></div></div>
            </div>
          </div>
          <div class="legend-section">
            <div class="legend-title">Markdown / Prose</div>
            <div class="legend-grid">
              <div class="legend-item" data-hex="{c['heading1']}"><div class="legend-swatch" style="background:{c['heading1']}"></div><div><div class="legend-label">Heading 1</div><div class="legend-hex">{c['heading1']}</div></div></div>
              <div class="legend-item" data-hex="{c['heading2']}"><div class="legend-swatch" style="background:{c['heading2']}"></div><div><div class="legend-label">Heading 2</div><div class="legend-hex">{c['heading2']}</div></div></div>
              <div class="legend-item" data-hex="{c['heading3']}"><div class="legend-swatch" style="background:{c['heading3']}"></div><div><div class="legend-label">Heading 3</div><div class="legend-hex">{c['heading3']}</div></div></div>
              <div class="legend-item" data-hex="{c['heading4']}"><div class="legend-swatch" style="background:{c['heading4']}"></div><div><div class="legend-label">Heading 4</div><div class="legend-hex">{c['heading4']}</div></div></div>
              <div class="legend-item" data-hex="{c['heading5']}"><div class="legend-swatch" style="background:{c['heading5']}"></div><div><div class="legend-label">Heading 5</div><div class="legend-hex">{c['heading5']}</div></div></div>
              <div class="legend-item" data-hex="{c['heading6']}"><div class="legend-swatch" style="background:{c['heading6']}"></div><div><div class="legend-label">Heading 6</div><div class="legend-hex">{c['heading6']}</div></div></div>
              <div class="legend-item" data-hex="{c['bold']}"><div class="legend-swatch" style="background:{c['bold']}"></div><div><div class="legend-label">Bold</div><div class="legend-hex">{c['bold']}</div></div></div>
              <div class="legend-item" data-hex="{c['italic']}"><div class="legend-swatch" style="background:{c['italic']}"></div><div><div class="legend-label">Italic</div><div class="legend-hex">{c['italic']}</div></div></div>
              <div class="legend-item" data-hex="{c['strikethrough']}"><div class="legend-swatch" style="background:{c['strikethrough']}"></div><div><div class="legend-label">Strikethrough</div><div class="legend-hex">{c['strikethrough']}</div></div></div>
              <div class="legend-item" data-hex="{c['link']}"><div class="legend-swatch" style="background:{c['link']}"></div><div><div class="legend-label">Links</div><div class="legend-hex">{c['link']}</div></div></div>
              <div class="legend-item" data-hex="{c['inlineCode']}"><div class="legend-swatch" style="background:{c['inlineCode']}"></div><div><div class="legend-label">Inline Code</div><div class="legend-hex">{c['inlineCode']}</div></div></div>
              <div class="legend-item" data-hex="{c['quote']}"><div class="legend-swatch" style="background:{c['quote']}"></div><div><div class="legend-label">Blockquote</div><div class="legend-hex">{c['quote']}</div></div></div>
              <div class="legend-item" data-hex="{c['listMarker']}"><div class="legend-swatch" style="background:{c['listMarker']}"></div><div><div class="legend-label">List Markers</div><div class="legend-hex">{c['listMarker']}</div></div></div>
            </div>
          </div>
        </div>
      </div>
'''
    
    html += '''    </div>
  </section>
  <footer><p><strong>Prism Themes</strong> - 64 OKLCH Color Science Themes - WCAG AA Verified</p></footer>
  <div class="toast" id="toast">Copied!</div>
  <script>
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.theme-card').forEach(card => {
          card.style.display = (filter === 'all' || card.dataset.type === filter) ? 'block' : 'none';
        });
      });
    });
    function showToast(msg) {
      const toast = document.getElementById('toast');
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 1500);
    }
    document.querySelectorAll('.legend-item').forEach(el => {
      el.addEventListener('click', () => {
        const hex = el.dataset.hex;
        if (hex) navigator.clipboard.writeText(hex).then(() => showToast('Copied ' + hex));
      });
    });
  </script>
</body>
</html>'''
    return html

def main():
    themes = []
    for f in sorted(THEMES_DIR.glob("*.json")):
        try:
            theme = load_theme(f)
            themes.append({
                'name': theme.get('name', f.stem.replace('_', ' ').title()),
                'type': theme.get('type', 'dark'),
                'colors': extract_colors(theme)
            })
            print(f"Loaded: {f.name}")
        except Exception as e:
            print(f"Error: {f.name}: {e}")
    
    html = generate_html(themes)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as out:
        out.write(html)
    print(f"\nGenerated gallery.html with {len(themes)} themes")
    print(f"Shows: Code syntax + Markdown/Prose (H1-H6, body, bold, italic, links, lists, quotes)")

if __name__ == "__main__":
    main()
