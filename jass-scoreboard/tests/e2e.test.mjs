// e2e.test.mjs — Playwright end-to-end tests for the Jass scoreboard.
//
// Run:
//   cd jass-scoreboard/tests && npm install && node e2e.test.mjs
//
// Spawns its own static server (python3 -m http.server) for the app and
// drives real flows in Chromium. Exits non-zero if any check fails.
// Screenshots land in tests/screenshots/ (gitignored).

import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdirSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const TESTS_DIR = dirname(fileURLToPath(import.meta.url));
const APP_DIR = join(TESTS_DIR, "..");
const SHOTS_DIR = join(TESTS_DIR, "screenshots");
const PORT = 8461;
const URL = `http://localhost:${PORT}/index.html`;

// Pre-installed Chromium (e.g. Claude Code remote env); falls back to
// Playwright's own browser resolution.
const CHROMIUM = process.env.CHROMIUM_PATH
  || (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);

let failures = 0;
function check(name, condition, detail = "") {
  const ok = Boolean(condition);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : ` — ${detail}`}`);
  if (!ok) failures++;
}

// ── Cache-busting version consistency ───────────────────────────────
// Every local asset reference (index.html + inter-module imports) must
// carry the same ?v= — a partial bump would serve mixed stale/new files.
{
  const sources = [
    ["index.html", readFileSync(join(APP_DIR, "index.html"), "utf8")],
    ...readdirSync(join(APP_DIR, "js"))
      .filter(f => f.endsWith(".js"))
      .map(f => [`js/${f}`, readFileSync(join(APP_DIR, "js", f), "utf8")])
  ];
  const versions = new Set();
  let unversioned = [];
  for (const [file, text] of sources) {
    for (const m of text.matchAll(/(?:href="css\/[^"]+|src="js\/[^"]+|from "\.\/[^"]+)"/g)) {
      const v = m[0].match(/\?v=([\w.]+)/);
      if (v) versions.add(v[1]);
      else unversioned.push(`${file}: ${m[0]}`);
    }
  }
  check("all asset URLs carry a ?v= version", unversioned.length === 0, unversioned.join(" | "));
  check("cache-busting version is identical everywhere", versions.size === 1, [...versions].join(", "));
}

mkdirSync(SHOTS_DIR, { recursive: true });
const server = spawn("python3", ["-m", "http.server", String(PORT)], {
  cwd: APP_DIR,
  stdio: "ignore"
});
await new Promise(r => setTimeout(r, 800));

const browser = await chromium.launch({ executablePath: CHROMIUM });
try {
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
  const consoleErrors = [];
  page.on("pageerror", e => consoleErrors.push("pageerror: " + e.message));
  page.on("console", m => {
    if (m.type() === "error" && !m.text().includes("favicon")) {
      consoleErrors.push("console: " + m.text());
    }
  });
  page.on("dialog", d => d.accept());

  const add = async (team, pts) => {
    await page.click(team === "A" ? "#btn-team-a" : "#btn-team-b");
    await page.fill("#input-points", String(pts));
    await page.click("#btn-add");
  };
  const half = async index =>
    await page.evaluate(i => {
      const g = document.querySelectorAll("#board svg > g")[i];
      return {
        marks: g.querySelectorAll("line.mark").length,
        rest: g.querySelector("text.rest-num")?.textContent ?? null,
        name: g.querySelector("text.team-name")?.textContent ?? null,
        total: g.querySelector("text.team-total")?.textContent ?? null,
        markXs: [...g.querySelectorAll("line.mark")].map(l => Math.round(+l.getAttribute("x1")))
      };
    }, index);
  const FAR = 0, NEAR = 1;

  await page.goto(URL);
  await page.waitForSelector("#board svg");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector("#board svg");

  // ── Team A faces the device holder (near/bottom half) ─────────────
  check("Team A sits at the near half by default", (await half(NEAR)).name === "Team A");

  // ── Free entry + per-round chalk decomposition ────────────────────
  await add("A", 157); // 1×100 + 1×50 + rest 7
  await add("A", 257); // 2×100 + 1×50 + rest 7
  let nearA = await half(NEAR);
  check("free entry: total 157+257=414", nearA.total === "414", `got ${nearA.total}`);
  check("marks per round: 3×100 + 2×50 = 5 strokes", nearA.marks === 5, `got ${nearA.marks}`);
  check("rests accumulate: + 14", nearA.rest === "+ 14", `got ${nearA.rest}`);

  // ── Validation ────────────────────────────────────────────────────
  await page.fill("#input-points", "501");
  await page.click("#btn-add");
  const err = await page.locator("#error-msg").textContent();
  check("validation: 501 rejected", err.includes("Maximal 500"), `got "${err}"`);

  // ── Chalk semantics: no conversion, right-aligned 20s ─────────────
  for (let i = 0; i < 5; i++) await add("B", 20);
  let farB = await half(FAR);
  // 5×20 (total 100) must stay on the 20-line as one complete bundle:
  // 4 uprights + 1 slash = 5 stroke lines, and no 100-mark appears
  check("no conversion: 5×20 → one ||||\\ bundle (5 lines)", farB.marks === 5, `got ${farB.marks}`);
  const rightMost = Math.max(...farB.markXs); // local coords, unaffected by the half's rotation
  check("20s align right (near x=564)", rightMost > 540, `rightmost x=${rightMost}`);

  // ── Bundling on all lines ─────────────────────────────────────────
  for (let i = 0; i < 7; i++) await add("B", 50); // one bundle + 2 = 7 lines on diagonal
  for (let i = 0; i < 4; i++) await add("A", 100); // A now 7×100: bundle(5) + 2 = 7 lines
  farB = await half(FAR);
  nearA = await half(NEAR);
  check("50s bundle in fives (7×50 → 7 lines incl. slash)", farB.marks === 5 + 7, `got ${farB.marks}`);
  check("100s bundle in fives (7×100 → 7 lines incl. slash)", nearA.marks === 7 + 2, `A lines ${nearA.marks} (7×100 + 2×50)`);
  await page.screenshot({ path: join(SHOTS_DIR, "board.png"), fullPage: true });

  // ── Undo removes exactly the last round's marks ───────────────────
  const before = (await half(FAR)).marks;
  await add("B", 90); // writes 1×50 + 2×20
  await page.click("#btn-undo");
  farB = await half(FAR);
  check("undo wipes only the last round's marks", farB.marks === before, `got ${farB.marks}, want ${before}`);

  // ── Flip swaps halves, data unchanged ─────────────────────────────
  const farNameBefore = (await half(FAR)).name;
  await page.click("#btn-flip");
  const farNameAfter = (await half(FAR)).name;
  check("flip swaps far team", farNameBefore !== farNameAfter, `still ${farNameAfter}`);
  await page.click("#btn-flip");

  // ── Persistence across reload ─────────────────────────────────────
  const totalBefore = (await half(FAR)).total;
  await page.reload();
  await page.waitForSelector("#board svg");
  check("state survives reload", (await half(FAR)).total === totalBefore);

  // ── Win: exceed target, entry disabled, undo revives ──────────────
  // A is at 814, B at 450. Target 850 → adding 100 to A gives 914 > 850.
  await page.fill("#input-target", "850");
  await page.locator("#input-target").blur();
  await add("A", 100);
  const winVisible = await page.locator("#win-overlay.active").isVisible();
  check("win overlay shows when total exceeds target", winVisible);
  check("entry disabled after win", await page.locator("#btn-add").isDisabled());
  await page.screenshot({ path: join(SHOTS_DIR, "win.png"), fullPage: true });
  if (winVisible) await page.click("#win-overlay");
  await page.click("#btn-undo"); // back to 814 < 850
  check("undo revives a finished game", !(await page.locator("#btn-add").isDisabled()));

  // ── Reset keeps names + target ────────────────────────────────────
  await page.fill("#edit-name-a", "Huber & Meier");
  await page.locator("#edit-name-a").blur();
  await page.click("#btn-reset");
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("jassScoreboardState")));
  check("reset clears entries", stored.entries.length === 0);
  check("reset keeps team name", stored.teams[0].name === "Huber & Meier");
  check("reset keeps target", stored.targetScore === 850, `got ${stored.targetScore}`);

  // ── Rest number never reaches 20: carries into a 20-mark ──────────
  await add("B", 19);
  await add("B", 19); // rests 19+19=38 → one 20-mark + rest 18
  farB = await half(FAR);
  check("rest carries into a 20-mark at 20", farB.marks === 1, `got ${farB.marks} marks`);
  check("rest number stays below 20", farB.rest === "+ 18", `got ${farB.rest}`);
  await page.screenshot({ path: join(SHOTS_DIR, "rest-carry.png"), fullPage: true });
  await page.click("#btn-undo");
  await page.click("#btn-undo");

  // ── Corrections: negative points wipe marks highest → lowest ──────
  await add("A", 180); // marks {1×100, 1×50, 1×20, +10}
  await add("A", -120); // wipes the 100 and the 20 → {1×50, +10}, total 60
  nearA = await half(NEAR);
  check("correction removes highest→lowest (180−120 → 1×50 + 10)",
    nearA.total === "60" && nearA.marks === 1 && nearA.rest === "+ 10",
    `total ${nearA.total}, marks ${nearA.marks}, rest ${nearA.rest}`);
  await add("A", -30); // 60−30: wipes the 50, rewrites 1×20 + 10
  nearA = await half(NEAR);
  check("correction borrows from a higher mark and rewrites",
    nearA.total === "30" && nearA.marks === 1 && nearA.rest === "+ 10",
    `total ${nearA.total}, marks ${nearA.marks}, rest ${nearA.rest}`);
  await page.screenshot({ path: join(SHOTS_DIR, "correction.png"), fullPage: true });

  // ── JPG export of the board (both Z's, no controls) ───────────────
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.click("#btn-export")
  ]);
  check("export downloads jasstafel-YYYY-MM-DD.jpg",
    /^jasstafel-\d{4}-\d{2}-\d{2}\.jpg$/.test(download.suggestedFilename()),
    `got ${download.suggestedFilename()}`);
  await download.saveAs(join(SHOTS_DIR, "export.jpg"));
  const jpg = readFileSync(join(SHOTS_DIR, "export.jpg"));
  check("export is a real JPEG with content",
    jpg.length > 20000 && jpg[0] === 0xff && jpg[1] === 0xd8,
    `${jpg.length} bytes, magic ${jpg[0]?.toString(16)}${jpg[1]?.toString(16)}`);
  await add("A", -100); // more than the current total → rejected
  const corrErr = await page.locator("#error-msg").textContent();
  check("correction larger than total is rejected", corrErr.includes("Korrektur"), `got "${corrErr}"`);
  check("rejected correction changes nothing", (await half(NEAR)).total === "30");
  await page.click("#btn-undo");
  await page.click("#btn-undo");
  await page.click("#btn-undo");

  // ── Injection-safe team names ─────────────────────────────────────
  await page.fill("#edit-name-a", "<img src=x onerror=alert(1)>");
  await page.locator("#edit-name-a").blur();
  const injected = await page.locator("#board svg image, #board svg img").count();
  check("team names are escaped in SVG", injected === 0);

  check("no console errors", consoleErrors.length === 0, consoleErrors.join(" | "));
} finally {
  await browser.close();
  server.kill();
}

console.log(failures === 0 ? "\nAll tests passed." : `\n${failures} test(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
