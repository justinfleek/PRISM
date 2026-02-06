#!/usr/bin/env node
/**
 * Render the entire gallery.html as a single full-page PNG.
 * Run from repo root: node scripts/render_gallery_png.js
 * Output: media/gallery_full.png
 *
 * Requires Chrome. If Puppeteer's browser isn't installed, run once:
 *   npx puppeteer browsers install chrome
 * Or install Chrome normally; the script will try the system Chrome path.
 */

const path = require("path");
const fs = require("fs");

const REPO_ROOT = path.resolve(__dirname, "..");
const GALLERY = path.join(REPO_ROOT, "gallery.html");
const OUT = path.join(REPO_ROOT, "media", "gallery_full.png");

const SYSTEM_CHROME_WIN =
  process.platform === "win32"
    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    : null;

async function main() {
  if (!fs.existsSync(GALLERY)) {
    console.error("gallery.html not found at", GALLERY);
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });

  const puppeteer = require("puppeteer");
  const launchOpts = { headless: "new" };
  if (SYSTEM_CHROME_WIN && fs.existsSync(SYSTEM_CHROME_WIN)) {
    launchOpts.executablePath = SYSTEM_CHROME_WIN;
  }

  const browser = await puppeteer.launch(launchOpts);
  const page = await browser.newPage();

  await page.setViewport({ width: 1200, height: 800 });
  await page.goto("file://" + GALLERY, { waitUntil: "networkidle0" });

  await page.screenshot({
    path: OUT,
    fullPage: true,
    type: "png",
  });

  await browser.close();
  console.log("Saved:", OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
