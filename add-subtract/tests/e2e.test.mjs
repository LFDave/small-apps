// e2e.test.mjs — Playwright end-to-end tests for the Mathe-Trainer.
//
// Run:
//   cd add-subtract/tests && npm install && node e2e.test.mjs
//
// Spawns its own static server (python3 -m http.server) for the app and
// drives real flows in Chromium. Exits non-zero if any check fails.
// Screenshots land in tests/screenshots/ (gitignored).

import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdirSync, existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const TESTS_DIR = dirname(fileURLToPath(import.meta.url));
const APP_DIR = join(TESTS_DIR, "..");
const SHOTS_DIR = join(TESTS_DIR, "screenshots");
const PORT = 8473;
const URL = `http://localhost:${PORT}/index.html`;

const CHROMIUM = process.env.CHROMIUM_PATH
  || (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);

let failures = 0;
function check(name, condition, detail = "") {
  const ok = Boolean(condition);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : ` — ${detail}`}`);
  if (!ok) failures++;
}

// ── Cache-busting version consistency ───────────────────────────────
{
  const html = readFileSync(join(APP_DIR, "index.html"), "utf8");
  const refs = [...html.matchAll(/(?:href|src)="(?!https?:|data:|#)([^"]+)"/g)].map(m => m[1]);
  const versions = new Set();
  const unversioned = [];
  for (const ref of refs) {
    const v = ref.match(/\?v=([\w.]+)/);
    if (v) versions.add(v[1]);
    else unversioned.push(ref);
  }
  check("all local asset URLs carry a ?v= version", unversioned.length === 0, unversioned.join(" | "));
  check("cache-busting version is identical everywhere", versions.size <= 1, [...versions].join(", "));
}

mkdirSync(SHOTS_DIR, { recursive: true });
const server = spawn("python3", ["-m", "http.server", String(PORT)], {
  cwd: APP_DIR,
  stdio: "ignore"
});
await new Promise(r => setTimeout(r, 800));

const browser = await chromium.launch({ executablePath: CHROMIUM });
const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
const consoleErrors = [];
page.on("console", msg => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
page.on("pageerror", err => consoleErrors.push(String(err)));

try {
  await page.goto(URL);

  // ── Setup screen ──────────────────────────────────────────────────
  check("page language is German", await page.getAttribute("html", "lang") === "de");
  check("dark app background token", await page.evaluate(() =>
    getComputedStyle(document.body).backgroundColor) === "rgb(14, 20, 29)");
  await page.screenshot({ path: join(SHOTS_DIR, "01-setup.png") });

  await page.click('#op-chips button[data-op="+"]');
  await page.click('#range-chips button[data-min="0"][data-max="10"]');
  await page.click("#start");
  check("quiz visible after start", await page.isVisible("#quiz"));
  check("advisory text announces auto-check (WCAG 3.2.2)",
    (await page.textContent(".advisory")).includes("Bei der letzten Ziffer"));
  check("feedback element is a status region (WCAG 4.1.3)",
    await page.getAttribute("#feedback", "role") === "status");
  check("no confirm button in the quiz",
    await page.evaluate(() =>
      ![...document.querySelectorAll("#quiz button")].some(b =>
        /ok|prüfen|absenden|submit/i.test(b.textContent))));

  const readProblem = () => page.evaluate(() => {
    const m = document.getElementById("problem").textContent.match(/(\d+)\s*([+−])\s*(\d+)/);
    const a = Number(m[1]), b = Number(m[3]);
    return { answer: m[2] === "+" ? a + b : a - b };
  });
  const typeAnswer = async str => {
    for (const d of str) await page.click(`#keypad button[data-digit="${d}"]`);
  };

  // ── Correct answer locks in on the last digit ─────────────────────
  let { answer } = await readProblem();
  await typeAnswer(String(answer));
  check("correct answer auto-checks without confirm",
    (await page.textContent("#feedback")).startsWith("Richtig."));
  check("slots show success state",
    await page.evaluate(() => [...document.querySelectorAll(".slot")].every(s => s.classList.contains("ok"))));
  check("Weiter appears after success", await page.isVisible("#next"));
  check("Weiter has focus", await page.evaluate(() => document.activeElement.id === "next"));
  check("stats counted the solve", (await page.textContent("#stats")).includes("Richtig: 1"));
  await page.screenshot({ path: join(SHOTS_DIR, "02-correct.png") });

  // ── No auto-advance: feedback stays until Weiter ──────────────────
  await new Promise(r => setTimeout(r, 1200));
  check("no hidden auto-advance timer (WCAG 2.2.1)",
    (await page.textContent("#feedback")).startsWith("Richtig."));
  await page.click("#next");
  check("Weiter loads the next problem", (await page.textContent("#feedback")).trim() === "");

  // ── Wrong answer: supportive, retry via backspace ─────────────────
  ({ answer } = await readProblem());
  const right = String(answer);
  const wrong = right.slice(0, -1) + String((Number(right.at(-1)) + 1) % 10);
  await typeAnswer(wrong);
  check("wrong answer evaluated immediately and supportively",
    (await page.textContent("#feedback")).startsWith("Fast."));
  check("wrong position marked",
    await page.evaluate(() => document.querySelectorAll(".slot.wrong").length >= 1));
  check("no Weiter after wrong answer", !(await page.isVisible("#next")));
  await page.screenshot({ path: join(SHOTS_DIR, "03-wrong.png") });

  await page.click("#backspace");
  check("backspace clears the wrong mark",
    await page.evaluate(() => document.querySelectorAll(".slot.wrong").length === 0));
  await page.click(`#keypad button[data-digit="${right.at(-1)}"]`);
  check("retry with corrected digit succeeds",
    (await page.textContent("#feedback")).startsWith("Richtig."));

  // ── Third miss reveals the solution, streak resets ────────────────
  await page.click("#next");
  ({ answer } = await readProblem());
  const miss = String(answer).slice(0, -1) + String((Number(String(answer).at(-1)) + 1) % 10);
  for (let i = 0; i < 3; i++) {
    await typeAnswer(miss);
    if (i < 2) for (const _ of miss) await page.click("#backspace");
  }
  check("third miss reveals the solution",
    (await page.textContent("#feedback")).startsWith("Die Lösung ist"));
  check("streak reset after reveal", (await page.textContent("#stats")).includes("Serie: 0"));
  check("Weiter appears after reveal", await page.isVisible("#next"));

  // ── Keyboard input and persistence ────────────────────────────────
  await page.click("#next");
  ({ answer } = await readProblem());
  await page.keyboard.type(String(answer));
  check("physical keyboard digits auto-check too",
    (await page.textContent("#feedback")).startsWith("Richtig."));

  await page.reload();
  check("settings persisted across reload",
    await page.evaluate(() => JSON.parse(localStorage.getItem("add-subtract.settings")).max === 10));
  check("stats persisted across reload",
    await page.evaluate(() => JSON.parse(localStorage.getItem("add-subtract.stats")).solved >= 2));

  // ── Range bounds the result, not just the operands ────────────────
  await page.click("#start");
  let outOfRange = [];
  for (let i = 0; i < 8; i++) {
    const p = await page.evaluate(() => {
      const m = document.getElementById("problem").textContent.match(/(\d+)\s*([+−])\s*(\d+)/);
      return { a: Number(m[1]), op: m[2], b: Number(m[3]) };
    });
    const res = p.op === "+" ? p.a + p.b : p.a - p.b;
    if (res < 0 || res > 10 || p.a > 10 || p.b > 10) outOfRange.push(`${p.a} ${p.op} ${p.b}`);
    await typeAnswer(String(res));
    await page.click("#next");
  }
  check("results and operands stay within the chosen range", outOfRange.length === 0, outOfRange.join(" | "));

  check("no console errors", consoleErrors.length === 0, consoleErrors.join(" | "));
} finally {
  await browser.close();
  server.kill();
}

console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
