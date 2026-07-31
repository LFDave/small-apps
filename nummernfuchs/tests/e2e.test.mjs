// e2e.test.mjs — Playwright end-to-end tests for Nummernfuchs.
//
// Run:
//   cd nummernfuchs/tests && npm install && node e2e.test.mjs
//
// Spawns its own static server (node, no external deps) and drives the
// real flows in Chromium: adding a code, the full learning ladder with
// mistakes, a phone number with the international step, the emergency
// quiz, persistence and reset. Exits non-zero if any check fails.
// Screenshots land in tests/screenshots/ (gitignored).

import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { mkdirSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildLadder, expectedChars } from "../js/practice.js?v=5";
import { autoChunk } from "../js/util.js?v=5";
import { EMERGENCY } from "../js/data.js?v=5";

const TESTS_DIR = dirname(fileURLToPath(import.meta.url));
const APP_DIR = join(TESTS_DIR, "..");
const SHOTS_DIR = join(TESTS_DIR, "screenshots");
const PORT = 8473;
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

/* ── Cache-busting version consistency ──────────────────────────────
   Every local asset reference (index.html, inter-module imports and
   css url()s) must carry the same ?v= — a partial bump would serve
   mixed stale/new files. */
{
  const sources = [
    ["index.html", readFileSync(join(APP_DIR, "index.html"), "utf8")],
    ["css/styles.css", readFileSync(join(APP_DIR, "css", "styles.css"), "utf8")],
    ...readdirSync(join(APP_DIR, "js"))
      .filter((f) => f.endsWith(".js"))
      .map((f) => [`js/${f}`, readFileSync(join(APP_DIR, "js", f), "utf8")])
  ];
  const versions = new Set();
  const unversioned = [];
  for (const [file, text] of sources) {
    const refs = [
      ...text.matchAll(/(?:href="css\/[^"]+|src="js\/[^"]+|from "\.\/[^"]+)"/g),
      ...text.matchAll(/url\("\.\.\/fonts\/[^"]+"\)/g)
    ];
    for (const m of refs) {
      const v = m[0].match(/\?v=([\w.]+)/);
      if (v) versions.add(v[1]);
      else unversioned.push(`${file}: ${m[0]}`);
    }
  }
  check("all asset URLs carry a ?v= version", unversioned.length === 0, unversioned.join(" | "));
  check("cache-busting version is identical everywhere", versions.size === 1, [...versions].join(", "));
}

/* ── Static server (no python dependency) ─────────────────────────── */

const MIME = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".woff2": "font/woff2", ".json": "application/json", ".svg": "image/svg+xml"
};
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new globalThis.URL(req.url, "http://x").pathname);
    const file = join(APP_DIR, path === "/" ? "index.html" : path.slice(1));
    const data = await readFile(file);
    res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((r) => server.listen(PORT, r));

mkdirSync(SHOTS_DIR, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROMIUM });

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const consoleErrors = [];
  page.on("pageerror", (e) => consoleErrors.push("pageerror: " + e.message));
  page.on("console", (m) => {
    if (m.type() === "error" && !m.text().includes("favicon")) {
      consoleErrors.push("console: " + m.text());
    }
  });
  page.on("dialog", (d) => d.accept());

  const shot = (name) => page.screenshot({ path: join(SHOTS_DIR, name + ".png"), fullPage: true });
  const text = async (sel) => ((await page.locator(sel).first().textContent()) || "").trim();
  const pressPad = async (ch) => page.click(`[data-key="${ch}"]`);
  const typePad = async (chars) => { for (const ch of chars) await pressPad(ch); };

  // Drives one full ladder run for an entry, mirroring the app's own
  // step builder so the test always types the right answer.
  const solveLadder = async (entry) => {
    const steps = buildLadder(entry);
    for (const step of steps) {
      if (step.hidden.length === 0) {
        await page.click('[data-action="step-next"]');
      } else {
        await typePad(expectedChars(step));
        await page.waitForSelector(".feedback-success");
        await page.click('[data-action="step-next"]');
      }
    }
    entry.completions += 1;
  };

  /* ── Home, empty state ─────────────────────────────────────────── */
  await page.goto(URL);
  check("app title renders", (await text("h1")) === "Nummernfuchs");
  check("empty state shown", await page.locator(".empty-panel").count() === 1);
  check("six emergency numbers listed", await page.locator(".emg-item").count() === 6);
  check("storage note visible", (await text(".app-footer .hint")).includes("auf diesem Gerät"));
  check("stats strip starts at level 1", (await text(".stats-title")).includes("Level 1"));
  check("stats strip shows 0 XP", (await text(".stats-xp")) === "0 von 30 XP");
  check("no medals unlocked yet", (await text(".stats-medals")) === "0/9");
  await shot("01-home-empty");

  /* ── Add a door code ───────────────────────────────────────────── */
  await page.click('[data-action="nav-add"]');
  await page.fill("#f-label", "Haustür");
  await page.fill("#f-number", "640 132");
  check("code form has no international block", await page.locator(".intl-block").count() === 0);
  await shot("02-form-code");
  await page.click('[data-action="form-save"]');
  check("entry card shows chunked number", (await text(".entry-number")) === "640 132");
  check("new entry starts as Neu", (await text(".pill")) === "Neu");

  /* ── Ladder: view step, mistakes, reveal, completion ───────────── */
  const door = { type: "code", chunks: ["640", "132"], intl: false, cc: "41", completions: 0 };
  await page.click(".entry-card");
  check("ladder has 4 steps for a two-chunk code", await page.locator(".dot").count() === 4);
  check("view step shows all digits", await page.locator(".cell.shown").count() === 6);
  await shot("03-ladder-view");
  await page.click('[data-action="step-next"]');

  // PIN-pad pattern: no confirm button, the last digit evaluates.
  check("no confirm button on the pad", await page.locator('[data-action="ok"], .btn-ok').count() === 0);
  check("auto-check advisory line shown", (await text(".pad-hint")).includes("letzten Ziffer"));

  // Cloze step hides the first chunk (completions = 0). Get it wrong
  // twice: supportive feedback, then the reveal option.
  check("cloze hides three digits", await page.locator(".cell.empty").count() === 3);
  await typePad("999");
  check("last digit auto-evaluates a wrong answer", await page.locator(".feedback-warn").count() === 1);
  check("wrong cells marked", await page.locator(".cell.wrong").count() === 3);
  check("no reveal option after first miss", await page.locator('[data-action="reveal"]').count() === 0);
  await shot("04-ladder-wrong");
  await page.click('[data-action="retry"]');
  await typePad("111");
  check("reveal offered after second miss", await page.locator('[data-action="reveal"]').count() === 1);
  await page.click('[data-action="reveal"]');
  check("reveal shows the digits", await page.locator(".cell.reveal").count() === 3);
  await shot("05-ladder-reveal");
  await page.click('[data-action="reveal-done"]');
  await typePad("640");
  check("last digit auto-locks a correct answer", await page.locator(".feedback-success").count() === 1);
  await shot("06-ladder-locked");
  await page.click('[data-action="step-next"]');

  // Tail step ("132") via physical keyboard, full step via pad; both
  // evaluate on the last digit without Enter.
  await page.keyboard.type("132");
  await page.waitForSelector(".feedback-success");
  check("keyboard input auto-evaluates", true);
  await page.click('[data-action="step-next"]');
  await typePad("640132");
  await page.waitForSelector(".feedback-success");
  await page.click('[data-action="step-next"]');
  check("ladder completion panel", (await text(".done-panel .feedback")).includes("Geschafft"));
  // XP: 10 base + 6 digits = 16; first exercise unlocks the first medal.
  check("reward shows +16 XP", (await text(".reward-xp")) === "+16 XP");
  check("first medal in reward block", (await text(".reward-block")).includes("Erste Übung"));
  await shot("06-ladder-done");
  door.completions = 1;
  await page.click('[data-action="nav-home"]');
  check("entry now Geübt", (await text(".pill")) === "Geübt");

  /* ── Two more runs: rotation, dedup, Sitzt status ──────────────── */
  await page.click(".entry-card");
  check("second run skips duplicate tail step", await page.locator(".dot").count() === 3);
  await solveLadder(door);
  // 32 XP crosses the level 2 threshold (30).
  check("level up announced quietly", (await text(".reward-block")).includes("Schlaufuchs"));
  await page.click('[data-action="nav-home"]');
  await page.click(".entry-card");
  await solveLadder(door);
  // Third exercise and third completion: two medals at once.
  check("effort medal at 3 exercises", (await text(".reward-block")).includes("Fleissiger Fuchs"));
  check("Sitzt medal at 3 completions", (await text(".reward-block")).includes("Sitzt!"));
  await page.click('[data-action="nav-home"]');
  check("entry Sitzt after three runs", (await text(".pill")) === "Sitzt!");
  check("home shows level 2", (await text(".stats-title")).includes("Schlaufuchs"));
  check("home shows 48 XP", (await text(".stats-xp")) === "48 von 80 XP");

  /* ── Phone number with international form ──────────────────────── */
  await page.click('[data-action="nav-add"]');
  await page.click('[data-type="phone"]');
  await page.fill("#f-label", "Mami");
  await page.fill("#f-number", "079 640 13 21");
  check("international on by default", await page.locator("#f-intl").isChecked());
  check("country code prefilled", (await page.locator("#f-cc").inputValue()) === "41");
  check("live international preview",
    (await text("#intl-preview")).includes("+41 79 640 13 21"));
  await shot("07-form-phone");
  await page.click('[data-action="form-save"]');
  const mamiRow = page.locator(".entry-row", { hasText: "Mami" });
  check("card shows international line",
    ((await mamiRow.locator(".entry-intl").textContent()) || "").trim() === "+41 79 640 13 21");

  /* ── Phone ladder incl. + key on the international step ────────── */
  const mami = { type: "phone", chunks: ["079", "640", "13", "21"], intl: true, cc: "41", completions: 0 };
  await mamiRow.locator(".entry-card").click();
  check("phone ladder has 6 steps", await page.locator(".dot").count() === 6);
  const steps = buildLadder(mami);
  for (const [i, step] of steps.entries()) {
    if (step.kind === "cloze") {
      check("no + key on national steps", await page.locator('[data-key="+"]').count() === 0);
    }
    if (step.kind === "intl-view") {
      check("international step shows +41",
        (await text(".cells")).startsWith("+41"));
      await shot("08-ladder-intl");
    }
    if (step.kind === "intl-full") {
      check("+ key available on international step", await page.locator('[data-key="+"]').count() === 1);
    }
    if (step.hidden.length === 0) {
      await page.click('[data-action="step-next"]');
    } else {
      await typePad(expectedChars(step));
      await page.waitForSelector(".feedback-success");
      await page.click('[data-action="step-next"]');
    }
  }
  check("phone ladder completed", (await text(".done-panel .feedback")).includes("Mami"));
  // XP: 10 + 10 digits + 5 international = 25 (total 73).
  check("international ladder rewards +25 XP", (await text(".reward-xp")) === "+25 XP");
  check("International medal unlocked", (await text(".reward-block")).includes("International"));
  await page.click('[data-action="nav-home"]');

  /* ── Emergency quiz: one wrong first, rest correct ─────────────── */
  await page.click('[data-action="quiz-start"]');
  check("quiz progress starts at 1", (await text(".quiz-progress")).startsWith("Nummer 1"));
  await shot("09-quiz-ask");
  for (let round = 0; round < 6; round++) {
    const situation = await text(".quiz-situation");
    const svc = EMERGENCY.find((s) => s.situation === situation);
    check(`round ${round + 1} shows a known situation`, Boolean(svc), situation);
    if (round === 0) {
      const wrong = svc.number.split("").map((d) => String((Number(d) + 1) % 10)).join("");
      await page.keyboard.type(wrong);
      check("wrong quiz answer explains the number",
        (await text(".feedback-warn")).includes(svc.number));
    }
    await page.keyboard.type(svc.number);
    await page.waitForSelector(".feedback-success");
    check(`round ${round + 1} correct feedback names the service`,
      (await text(".feedback-success")).includes(svc.number));
    await page.click('[data-action="quiz-next"]');
  }
  check("quiz summary counts first-try answers",
    (await text(".done-panel .feedback")).includes("5 von 6"));
  check("five numbers tagged as known", await page.locator(".quiz-result.known").count() === 5);
  // XP: 5 first-try x 3 + 1 corrected + 5 session = 21 (total 94, level 3).
  check("quiz rewards +21 XP", (await text(".reward-xp")) === "+21 XP");
  await shot("10-quiz-done");
  await page.click('[data-action="nav-home"]');
  await shot("11-home-filled");

  /* ── Persistence across reload ─────────────────────────────────── */
  await page.reload();
  check("entries survive a reload", await page.locator(".entry-row").count() === 2);
  check("progress survives a reload", (await text(".pill")) === "Sitzt!");

  /* ── Random-number training ────────────────────────────────────── */
  check("training length defaults to 6", (await text(".train-len-value")) === "6 Ziffern");
  await page.click('[data-action="train-len"][data-delta="-1"]');
  check("length stepper decreases", (await text(".train-len-value")) === "5 Ziffern");
  for (let i = 0; i < 5; i++) await page.click('[data-action="train-len"][data-delta="-1"]');
  check("length clamps at 3", (await text(".train-len-value")) === "3 Ziffern");
  for (let i = 0; i < 2; i++) await page.click('[data-action="train-len"][data-delta="1"]');
  check("length stepper increases", (await text(".train-len-value")) === "5 Ziffern");

  // Solves the currently shown training ladder (must be on the view
  // step). With withMistake, the first input step is answered wrong
  // once — the clean-run streak must reset, XP must not change.
  const solveTraining = async (withMistake, expectLen) => {
    const digits = await page.$$eval(".cell.shown", (els) => els.map((el) => el.textContent).join(""));
    check("random number has the chosen length", digits.length === expectLen, digits);
    const steps = buildLadder({ type: "code", chunks: autoChunk(digits, "code"), completions: 0 });
    let mistakeDone = !withMistake;
    for (const step of steps) {
      if (step.hidden.length === 0) {
        await page.click('[data-action="step-next"]');
        continue;
      }
      const expected = expectedChars(step);
      if (!mistakeDone) {
        await typePad(expected.map((d) => String((Number(d) + 1) % 10)));
        await page.waitForSelector(".feedback-warn");
        await page.click('[data-action="retry"]');
        mistakeDone = true;
      }
      await typePad(expected);
      await page.waitForSelector(".feedback-success");
      await page.click('[data-action="step-next"]');
    }
  };

  await page.click('[data-action="train-start"]');
  check("training uses the normal ladder", await page.locator(".dot").count() > 0);
  await shot("13-training-view");
  await solveTraining(true, 5);
  check("training completion offers a new random number",
    await page.locator('[data-action="train-again"]').count() === 1);
  // XP: 10 + 5 digits = 15 (total 109) — the mistake costs nothing.
  check("training rewards +15 XP despite a mistake", (await text(".reward-xp")) === "+15 XP");
  check("no level-up suggestion after a run with mistakes",
    await page.locator('[data-action="train-up"]').count() === 0);
  await shot("14-training-done");

  // Two clean runs in a row trigger the suggestion to add a digit.
  await page.click('[data-action="train-again"]');
  await solveTraining(false, 5);
  check("no suggestion after one clean run",
    await page.locator('[data-action="train-up"]').count() === 0);
  await page.click('[data-action="train-again"]');
  await solveTraining(false, 5);
  check("suggestion after two clean runs",
    await page.locator('[data-action="train-up"]').count() === 1);
  check("suggestion names the next length",
    (await text(".feedback-info")).includes("6 Ziffern"));
  await shot("16-training-suggest");
  await page.click('[data-action="train-up"]');
  const upDigits = await page.$$eval(".cell.shown", (els) => els.map((el) => el.textContent).join(""));
  check("accepted suggestion starts a longer number", upDigits.length === 6, upDigits);
  await page.click('[data-action="nav-home"]');
  check("nothing was stored for training", await page.locator(".entry-row").count() === 2);
  check("stepper follows the accepted suggestion", (await text(".train-len-value")) === "6 Ziffern");
  await page.reload();
  check("chosen training length persists", (await text(".train-len-value")) === "6 Ziffern");

  /* ── Level, XP and medal gallery ───────────────────────────────── */
  // Totals: 48 (door) + 25 (Mami) + 21 (quiz) + 3 x 15 (training) = 139;
  // exercises reached 8 during training, unlocking the fifth medal.
  check("home shows level 3", (await text(".stats-title")).includes("Zahlenfuchs"));
  check("home shows 139 XP", (await text(".stats-xp")) === "139 von 160 XP");
  check("five medals unlocked", (await text(".stats-medals")) === "5/9");
  await page.click(".stats-strip");
  check("medal gallery opens", (await text("h1")) === "Medaillen");
  check("gallery lists all medals", await page.locator(".medal-card").count() === 9);
  check("gallery shows five unlocked", await page.locator(".medal-card:not(.locked)").count() === 5);
  check("locked medals keep their description visible",
    (await text(".medal-card.locked .medal-desc")).length > 0);
  await shot("15-medals");
  await page.click('[data-action="nav-home"]');

  /* ── Desktop layout ────────────────────────────────────────────── */
  await page.setViewportSize({ width: 1280, height: 800 });
  await shot("12-home-desktop");
  await page.setViewportSize({ width: 390, height: 844 });

  /* ── Reset ─────────────────────────────────────────────────────── */
  await page.click('[data-action="reset-all"]');
  check("reset clears entries", await page.locator(".empty-panel").count() === 1);
  check("reset clears XP and level", (await text(".stats-xp")) === "0 von 30 XP");
  await page.reload();
  check("reset persists", await page.locator(".empty-panel").count() === 1);

  check("no console errors", consoleErrors.length === 0, consoleErrors.join(" | "));
} finally {
  await browser.close();
  server.close();
}

console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
