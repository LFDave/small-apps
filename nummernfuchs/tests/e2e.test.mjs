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
import { dirname, join, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { buildLadder, expectedChars } from "../js/practice.js?v=7";
import { autoChunk } from "../js/util.js?v=7";
import { COUNTRIES, countryByCode } from "../js/data.js?v=7";
import { TABLES, t, setLanguage, keyPart } from "../js/i18n.js?v=7";

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
const jsFiles = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? jsFiles(join(dir, e.name))
    : e.name.endsWith(".js") ? [join(dir, e.name)] : []);

{
  const sources = [
    ["index.html", readFileSync(join(APP_DIR, "index.html"), "utf8")],
    ["css/styles.css", readFileSync(join(APP_DIR, "css", "styles.css"), "utf8")],
    ...jsFiles(join(APP_DIR, "js"))
      .map((f) => [relative(APP_DIR, f), readFileSync(f, "utf8")])
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

/* ── String tables ──────────────────────────────────────────────────
   German is the reference. Every other language must carry exactly the
   same keys with the same placeholders, or a screen silently falls
   back to German mid-sentence. */
{
  const base = Object.keys(TABLES.de);
  const holes = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");
  const problems = [];
  for (const [code, table] of Object.entries(TABLES)) {
    for (const key of base) {
      if (typeof table[key] !== "string" || !table[key].trim()) problems.push(`${code}.${key} missing`);
      else if (holes(table[key]) !== holes(TABLES.de[key])) problems.push(`${code}.${key} placeholders`);
      else if (table[key].includes("ß")) problems.push(`${code}.${key} uses sharp s`);
    }
    for (const key of Object.keys(table)) {
      if (!base.includes(key)) problems.push(`${code}.${key} not in German`);
    }
  }
  check(`all ${Object.keys(TABLES).length} languages carry the same ${base.length} keys`,
    problems.length === 0, problems.slice(0, 8).join(" | "));
}

/* ── Country packs ────────────────────────────────────────────────── */
{
  const problems = [];
  for (const country of COUNTRIES) {
    const situations = new Set();
    for (const svc of country.numbers) {
      // A quiz round is a situation, so two numbers in one pack may
      // never share one, or the question has two right answers.
      const situation = TABLES.de["emgSituation" + keyPart(svc.key)];
      if (!situation) problems.push(`${country.code}:${svc.key} has no strings`);
      if (situations.has(situation)) problems.push(`${country.code}:${svc.key} duplicate situation`);
      situations.add(situation);
      if (!/^\d+$/.test(svc.number)) problems.push(`${country.code}:${svc.number} not digits`);
    }
    for (const gap of country.gaps) {
      if (!TABLES.de[gap]) problems.push(`${country.code} gap ${gap} has no text`);
    }
    if (!/^\d{1,3}$/.test(country.cc)) problems.push(`${country.code} dialling code`);
  }
  check(`all ${COUNTRIES.length} country packs are usable`, problems.length === 0, problems.join(" | "));
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
  // flagcdn is the one allowed external request and the only thing that
  // needs the network, so a sandbox without egress must not fail the
  // run. The flag fallback is checked explicitly further down instead.
  page.on("console", (m) => {
    const url = m.location() ? m.location().url : "";
    if (m.type() === "error" && !m.text().includes("favicon") && !url.includes("flagcdn.com")) {
      consoleErrors.push("console: " + m.text() + (url ? ` (${url})` : ""));
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
  // Rounds are matched by their situation text, resolved through the
  // same string table the app renders from, so the test cannot drift.
  setLanguage("de");
  const situationOf = (svc) => t("emgSituation" + keyPart(svc.key));
  const packOf = (code) => countryByCode(code).numbers;
  const findRound = (pack, situation) => pack.find((s) => situationOf(s) === situation);

  const swiss = packOf("ch");
  await page.click('[data-action="quiz-start"]');
  check("quiz progress starts at 1", (await text(".quiz-progress")).startsWith("Nummer 1"));
  await shot("09-quiz-ask");
  for (let round = 0; round < swiss.length; round++) {
    const situation = await text(".quiz-situation");
    const svc = findRound(swiss, situation);
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

  // Five clean runs in a row trigger the suggestion to add a digit.
  for (let run = 1; run <= 4; run++) {
    await page.click('[data-action="train-again"]');
    await solveTraining(false, 5);
    check(`no suggestion after ${run} clean run(s)`,
      await page.locator('[data-action="train-up"]').count() === 0);
  }
  await page.click('[data-action="train-again"]');
  await solveTraining(false, 5);
  check("suggestion after five clean runs",
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
  // Totals: 48 (door) + 25 (Mami) + 21 (quiz) + 6 x 15 (training) = 184;
  // exercises passed 8 during training, unlocking the fifth medal.
  check("home shows level 4", (await text(".stats-title")).includes("Merkfuchs"));
  check("home shows 184 XP", (await text(".stats-xp")) === "184 von 280 XP");
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

  /* ── Settings: language ────────────────────────────────────────── */
  check("home has a settings button", await page.locator('[data-action="nav-settings"]').count() === 1);
  await page.click('[data-action="nav-settings"]');
  check("settings view opens", (await text("h1")) === "Einstellungen");
  check("five languages offered", await page.locator('[data-action="set-lang"]').count() === 5);
  check("six countries offered", await page.locator('[data-action="set-country"]').count() === 6);
  check("current language is marked",
    (await page.getAttribute('[data-lang="de"]', "aria-pressed")) === "true");
  check("no save button in settings",
    await page.locator('[data-action="settings-save"]').count() === 0);
  check("every country choice carries a flag", await page.locator(".choice-country .flag").count() === 6);
  // Offline, or with flagcdn unreachable, no broken image may remain.
  await page.waitForFunction(() =>
    [...document.querySelectorAll(".flag")].every((el) => el.complete));
  const flagState = await page.$$eval(".flag", (els) =>
    els.map((el) => ({ loaded: el.naturalWidth > 0, hidden: el.hidden })));
  check("flags either load or hide themselves",
    flagState.every((f) => f.loaded || f.hidden),
    JSON.stringify(flagState));
  await shot("17-settings");

  await page.click('[data-action="set-lang"][data-lang="en"]');
  check("language applies without a confirm step", (await text("h1")) === "Settings");
  check("document language follows the setting",
    (await page.locator("html").getAttribute("lang")) === "en");
  await page.click('[data-action="nav-home"]');
  check("home renders in English", (await text(".section h2")) === "My numbers");
  check("stats strip is translated", (await text(".stats-xp")).includes("of"));
  check("level title is translated", (await text(".stats-title")).includes("Memory Fox"));
  await shot("18-home-english");
  await page.reload();
  check("language survives a reload", (await text(".section h2")) === "My numbers");

  // Every language on the narrowest supported width: nothing may spill
  // sideways, and no key may fall through to its raw id.
  for (const lang of ["de", "fr", "it", "rm", "en"]) {
    await page.click('[data-action="nav-settings"]');
    await page.click(`[data-action="set-lang"][data-lang="${lang}"]`);
    await page.click('[data-action="nav-home"]');
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(`${lang}: home fits the narrow viewport`, overflow <= 0, `${overflow}px wider`);
    const body = await text(".shell");
    const rawIds = Object.keys(TABLES.de).filter((k) => body.includes(k));
    check(`${lang}: no untranslated key leaks into the page`, rawIds.length === 0, rawIds.join(","));
    await shot(`18-home-${lang}`);
  }
  check("last language selection is English", (await text(".section h2")) === "My numbers");

  /* ── Settings: country ─────────────────────────────────────────── */
  await page.click('[data-action="nav-settings"]');
  await page.click('[data-action="set-country"][data-country="de"]');
  check("country choice is marked",
    (await page.getAttribute('[data-country="de"]', "aria-pressed")) === "true");
  await page.click('[data-action="nav-home"]');
  const german = packOf("de");
  check("German pack replaces the Swiss one",
    await page.locator(".emg-item").count() === german.length);
  check("German pack lists the police number",
    (await text(".emg-grid")).includes("110"));
  check("Swiss-only numbers are gone", !(await text(".emg-grid")).includes("1414"));
  check("missing services are named, not blank",
    await page.locator(".emg-gaps li").count() === countryByCode("de").gaps.length);
  check("the poison gap says what to do instead",
    (await text(".emg-gaps")).includes("112"));
  await shot("19-home-country-de");

  // A quiz on the German pack must not touch the Swiss streaks: 118 is
  // the fire brigade in Switzerland and the ambulance in Italy.
  setLanguage("en");
  await page.click('[data-action="quiz-start"]');
  for (let round = 0; round < german.length; round++) {
    const situation = await text(".quiz-situation");
    const svc = findRound(german, situation);
    check(`German round ${round + 1} shows a known situation`, Boolean(svc), situation);
    await page.keyboard.type(svc.number);
    await page.waitForSelector(".feedback-success");
    await page.click('[data-action="quiz-next"]');
  }
  check("German quiz summary is complete and English",
    (await text(".done-panel .feedback")).includes("every number"));
  await shot("20-quiz-done-de");
  await page.click('[data-action="nav-home"]');

  const streakKeys = await page.evaluate(() =>
    Object.keys(JSON.parse(localStorage.getItem("nummernfuchs.state")).emergency));
  check("emergency streaks are country-scoped",
    streakKeys.every((k) => k.includes(":")), streakKeys.join(","));
  check("the same digits stay separate per country",
    streakKeys.includes("ch:112") && streakKeys.includes("de:112"), streakKeys.join(","));

  await page.click('[data-action="nav-settings"]');
  await page.click('[data-action="set-country"][data-country="ch"]');
  await page.click('[data-action="nav-home"]');
  check("switching back restores the Swiss pack",
    await page.locator(".emg-item").count() === swiss.length);
  check("Switzerland has no gaps to report",
    await page.locator(".emg-gaps").count() === 0);
  check("German practice did not mark Swiss numbers as known",
    await page.locator(".emg-known").count() === 0);

  // Every pack rendered once: the numbers a country has, and the ones
  // it has no short number for.
  for (const country of COUNTRIES) {
    await page.click('[data-action="nav-settings"]');
    await page.click(`[data-action="set-country"][data-country="${country.code}"]`);
    await page.click('[data-action="nav-home"]');
    check(`${country.code}: pack size matches the data`,
      await page.locator(".emg-item").count() === country.numbers.length);
    check(`${country.code}: gaps match the data`,
      await page.locator(".emg-gaps li").count() === country.gaps.length);
    await page.locator(".emg-grid").scrollIntoViewIfNeeded();
    await page.locator(".section:last-of-type").screenshot({
      path: join(SHOTS_DIR, `21-pack-${country.code}.png`)
    });
  }
  await page.click('[data-action="nav-settings"]');
  await page.click('[data-action="set-country"][data-country="ch"]');
  await page.click('[data-action="nav-home"]');

  /* ── Reset keeps settings, clears progress ─────────────────────── */
  await page.click('[data-action="reset-all"]');
  check("reset clears entries", await page.locator(".empty-panel").count() === 1);
  check("reset clears XP and level", (await text(".stats-xp")) === "0 of 30 XP");
  check("reset keeps the chosen language", (await text(".section h2")) === "My numbers");
  await page.reload();
  check("reset persists", await page.locator(".empty-panel").count() === 1);
  check("language still set after reset and reload",
    (await text(".section h2")) === "My numbers");

  /* ── Migration of pre-country saves ────────────────────────────── */
  // Before the country setting, streaks were bare numbers from the
  // Swiss pack. They must be read as Swiss, not dropped.
  await page.evaluate((numbers) => {
    localStorage.setItem("nummernfuchs.state", JSON.stringify({
      entries: [], trainingLength: 6,
      emergency: Object.fromEntries(numbers.map((n) => [n, 3])),
      game: { xp: 120, exercises: 6, digitsTyped: 200, bestTraining: 8, medals: ["erste-uebung"] }
    }));
  }, swiss.map((s) => s.number));
  await page.reload();
  check("an old save still opens", await page.locator(".empty-panel").count() === 1);
  check("old saves default back to German", (await text(".section h2")) === "Meine Nummern");
  check("old emergency streaks survive as Swiss",
    await page.locator(".emg-known").count() === swiss.length);
  check("old XP survives", (await text(".stats-xp")) === "120 von 160 XP");
  const migrated = await page.evaluate(() =>
    Object.keys(JSON.parse(localStorage.getItem("nummernfuchs.state")).emergency));
  check("migrated keys are country-scoped",
    migrated.every((k) => k.startsWith("ch:")), migrated.join(","));

  check("no console errors", consoleErrors.length === 0, consoleErrors.join(" | "));
} finally {
  await browser.close();
  server.close();
}

console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
