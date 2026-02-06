#!/usr/bin/env node
/**
 * Capture theme preview images from gallery.html for the README.
 * Run from repo root: node scripts/generate_readme_previews.js
 * Requires: npm install puppeteer (one-time)
 */

const path = require("path");
const fs = require("fs");

const REPO_ROOT = path.resolve(__dirname, "..");
const GALLERY = path.join(REPO_ROOT, "gallery.html");
const OUT_DIR = path.join(REPO_ROOT, "media", "previews");

// Theme display name (in gallery) -> output filename (no extension)
const THEMES = [
  "Prism Nord Aurora",
  "Prism Nero Marquina",
  "Prism Catppuccin Mocha",
  "Prism Neon Nexus",
  "Prism Aurora Glass",
  "Prism Ghost",
];

async function main() {
  if (!fs.existsSync(GALLERY)) {
    console.error("gallery.html not found at", GALLERY);
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let puppeteer;
  try {
    puppeteer = require("puppeteer");
  } catch (e) {
    console.error("Puppeteer not found. Run: npm install puppeteer");
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 900, height: 520 });
  await page.goto("file://" + GALLERY, { waitUntil: "networkidle0" });

  const cards = await page.$$(".theme-card");
  let captured = 0;

  for (let i = 0; i < cards.length; i++) {
    const nameEl = await cards[i].$(".theme-name");
    const name = nameEl ? (await nameEl.evaluate((n) => n.textContent)).trim() : "";
    const slug = name.replace(/^Prism\s+/, "").replace(/\s+/g, "_").toLowerCase().replace(/&/g, "and");
    const want = THEMES.find((t) => t === name);
    if (!want) continue;

    const file = path.join(OUT_DIR, slug + ".png");
    await cards[i].screenshot({ path: file });
    console.log("Saved:", file);
    captured++;
  }

  await browser.close();
  console.log("\nCaptured", captured, "preview(s) to media/previews/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
