// e2e.test.mjs — Playwright end-to-end tests for Wortwerkstatt.
//
// Run:
//   cd wortwerkstatt/tests && npm install && node e2e.test.mjs
//
// Spawns its own static server (node, no external deps) and drives the
// real flows in Chromium: a rule round with a miss and a reveal, a
// memory word written from memory, mixed practice, the cycle
// suggestion, settings, persistence and reset. Exits non-zero if any
// check fails. Screenshots land in tests/screenshots/ (gitignored).
//
// The expected answers are derived from the content pack through
// round.js, the same module the app renders from, so the tests cannot
// drift from the engine.

import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { mkdirSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { CONTENT_LANGUAGES, CYCLES, topicsForCycle, topicKey } from "../js/data.js?v=1";
import { TABLES } from "../js/i18n.js?v=1";
import { fillTask, expectedAnswer, solutionText, ROUND_SIZE } from "../js/round.js?v=1";
import { MEDALS, xpForRound, levelFor } from "../js/game.js?v=1";

const TESTS_DIR = dirname(fileURLToPath(import.meta.url));
const APP_DIR = join(TESTS_DIR, "..");
const SHOTS_DIR = join(TESTS_DIR, "screenshots");
const PORT = 8474;
const URL = `http://localhost:${PORT}/index.html`;
const BLANK = "\u00b7\u00b7\u00b7";

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

const CONTENT = CONTENT_LANGUAGES[0];

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

/* ── Content pack ─────────────────────────────────────────────────── */
{
  const problems = [];
  const ids = new Set();
  const shown = new Map();
  for (const topic of CONTENT.topics) {
    if (ids.has(topic.id)) problems.push(`${topic.id} duplicate topic id`);
    ids.add(topic.id);
    if (!CYCLES.includes(topic.cycle)) problems.push(`${topic.id} unknown cycle`);
    for (const table of Object.values(TABLES)) {
      if (!table["topic" + topicKey(topic.id) + "Title"]) problems.push(`${topic.id} has no title`);
      if (!table["topic" + topicKey(topic.id) + "Rule"]) problems.push(`${topic.id} has no rule`);
    }
    if (topic.items.length < ROUND_SIZE) problems.push(`${topic.id} has fewer items than a round`);
    for (const item of topic.items) {
      const task = { topicId: topic.id, kind: topic.kind, item };
      if (topic.kind === "memory") {
        if (!item.word || !item.clue) problems.push(`${topic.id} incomplete memory item`);
        continue;
      }
      // Exactly one option may be right, and the answer has to be
      // among them, or the task is unanswerable.
      if (!item.options.includes(item.answer)) problems.push(`${topic.id}: ${item.answer} not offered`);
      if (new Set(item.options).size !== item.options.length) problems.push(`${topic.id} repeats an option`);
      if (item.options.length < 2) problems.push(`${topic.id} has a single option`);
      if (item.answer === "" && !topic.emptyOptionKey) problems.push(`${topic.id} has no label for the empty option`);
      // Two tasks that read identically would make the practice
      // ambiguous and the tests unable to tell them apart.
      const key = fillTask(task, BLANK);
      if (shown.has(key)) problems.push(`${topic.id} reads the same as ${shown.get(key)}`);
      shown.set(key, topic.id);
    }
  }
  check(`all ${CONTENT.topics.length} rules are usable`, problems.length === 0, problems.slice(0, 8).join(" | "));

  const perCycle = CYCLES.map((c) => topicsForCycle(CONTENT.code, c).length);
  check("every cycle has rules to practise", perCycle.every((n) => n > 0), perCycle.join("/"));
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

// Every choice task, keyed by the text the app shows while the blank is
// still open. Lets the test recognise the task on screen and answer it
// the same way a child who knows the rule would.
const CHOICE_INDEX = new Map();
for (const topic of CONTENT.topics) {
  if (topic.kind === "memory") continue;
  for (const item of topic.items) {
    const task = { topicId: topic.id, kind: topic.kind, item };
    CHOICE_INDEX.set(fillTask(task, BLANK), task);
  }
}

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

  const shot = (name) => page.screenshot({
    path: join(SHOTS_DIR, name + ".png"), fullPage: true, animations: "disabled"
  });
  const text = async (sel) => ((await page.locator(sel).first().textContent()) || "").trim();

  // Answers the task currently on screen. `wrong: true` picks an option
  // that is not the answer, so the miss path can be driven on purpose.
  const answerTask = async ({ wrong = false } = {}) => {
    if (await page.locator('[data-action="study-done"]').count()) {
      // Memory task: read the word while it is shown, then write it.
      const word = await text(".memory-word");
      await page.click('[data-action="study-done"]');
      const typed = wrong ? scramble(word) : word;
      await page.fill("#answer", "");
      await page.type("#answer", typed);
      return { kind: "memory", task: null, answer: word };
    }
    const shownText = (await page.locator(".task-text").first().innerText()).trim();
    const task = CHOICE_INDEX.get(shownText);
    if (!task) throw new Error("unknown task on screen: " + JSON.stringify(shownText));
    const answer = expectedAnswer(task);
    const values = await page.$$eval(".choice-option", (els) => els.map((el) => el.dataset.value));
    const pick = wrong ? values.find((v) => v !== answer) : answer;
    await page.click(`.choice-option[data-value="${cssEscape(pick)}"]`);
    return { kind: task.kind, task, answer, picked: pick };
  };

  // Plays a whole round cleanly and lands on the completion panel.
  const playRound = async () => {
    for (let i = 0; i < ROUND_SIZE; i++) {
      await answerTask();
      await page.waitForSelector(".feedback-success");
      await page.click('[data-action="next"]');
    }
    await page.waitForSelector(".done-panel");
  };

  /* ── Home ──────────────────────────────────────────────────────── */
  await page.goto(URL);
  await page.waitForSelector(".topic-card");
  check("app title renders", (await text("h1")) === "Wortwerkstatt");
  check("cycle 2 is the default", (await text(".panel .hint")).includes("Zyklus 2"));
  check("home lists the rules of the cycle",
    await page.locator(".topic-card").count() === topicsForCycle("de", 2).length);
  check("every rule starts as Neu",
    (await page.$$eval(".pill", (els) => els.map((e) => e.textContent.trim()))).every((p) => p === "Neu"));
  check("storage note visible", (await text(".app-footer .hint")).includes("auf diesem Gerät"));
  check("stats strip starts at level 1", (await text(".stats-title")).includes("Level 1"));
  check("stats strip shows 0 XP", (await text(".stats-xp")) === "0 von 30 XP");
  check("no medals unlocked yet", (await text(".stats-medals")) === `0/${MEDALS.length}`);
  await shot("01-home");

  /* ── One rule round: miss, rule, reveal, recovery ───────────────── */
  await page.click('.topic-card[data-id="sp-st"]');
  check("round shows one dot per task", await page.locator(".dot").count() === ROUND_SIZE);
  check("instruction names the task", (await text(".instruction")) === "Welche Buchstaben fehlen?");
  check("the blank is open before an answer", (await text(".blank")) === BLANK);
  check("the open blank is announced as a gap, not as three dots",
    (await page.getAttribute(".blank", "aria-label")) === "Lücke");
  check("the rule stays hidden while thinking", await page.locator(".rule").count() === 0);
  check("no confirm button, the options are the answer",
    await page.locator('[data-action="ok"], [data-action="confirm"]').count() === 0);
  await shot("02-round-word");

  await answerTask({ wrong: true });
  check("a wrong choice is answered at once", await page.locator(".feedback-warn").count() === 1);
  check("the wrong choice stays visible in the blank",
    await page.locator(".blank-miss").count() === 1);
  check("the rule appears once the answer is in", await page.locator(".rule-text").count() === 1);
  check("no reveal after the first miss", await page.locator('[data-action="reveal"]').count() === 0);
  check("feedback is supportive, never wrong", !(await text(".feedback-warn")).includes("Falsch"));
  await shot("03-round-miss");

  await page.click('[data-action="retry"]');
  check("retry reopens the blank", (await text(".blank")) === BLANK);
  await answerTask({ wrong: true });
  check("reveal offered after the second miss",
    await page.locator('[data-action="reveal"]').count() === 1);
  await page.click('[data-action="reveal"]');
  check("reveal shows the solution in the blank", await page.locator(".blank-ok").count() === 1);
  await shot("04-round-reveal");
  await page.click('[data-action="reveal-done"]');
  const first = await answerTask();
  check("the right choice locks in at once", await page.locator(".feedback-success").count() === 1);
  check("the solution fills the blank", (await text(".blank-ok")) === first.answer);
  await shot("05-round-correct");
  await page.click('[data-action="next"]');

  // The remaining five tasks, all right first time.
  for (let i = 1; i < ROUND_SIZE; i++) {
    await answerTask();
    await page.waitForSelector(".feedback-success");
    await page.click('[data-action="next"]');
  }
  await page.waitForSelector(".done-panel");
  check("round completion panel", (await text(".done-panel .feedback")).includes("Runde geschafft"));
  check("summary counts the first-try answers",
    (await text(".done-panel .feedback")).includes("5 von 6"));
  check("summary lists every task", await page.locator(".result-row").count() === ROUND_SIZE);
  check("the corrected task is tagged as practised",
    await page.locator(".result-row:not(.known)").count() === 1);
  // 5 first try, 1 corrected, cycle 2.
  check(`round rewards +${xpForRound(2, 5, 1)} XP`, (await text(".reward-xp")) === `+${xpForRound(2, 5, 1)} XP`);
  check("first medal in the reward block", (await text(".reward-block")).includes("Erste Runde"));
  check("no level-up suggestion after a round with a miss",
    await page.locator('[data-action="accept-cycle"]').count() === 0);
  await shot("06-round-done");

  await page.click('[data-action="nav-home"]');
  check("the practised rule moved to Geübt",
    (await text('.topic-card[data-id="sp-st"] .pill')) === "Geübt");
  check("the rule card counts the round",
    (await text('.topic-card[data-id="sp-st"] .topic-sub')) === "1 Runden geübt");
  check("untouched rules stay Neu",
    (await text('.topic-card[data-id="sch"] .pill')) === "Neu");

  /* ── Memory word: study, write, miss, write again ───────────────── */
  await page.click('.topic-card[data-id="merkwort-2"]');
  check("a memory task starts with the word shown",
    await page.locator(".memory-word").count() === 1);
  check("study step names what to do",
    (await text(".instruction")) === "Schau dir das Wort gut an.");
  const memWord = await text(".memory-word");
  await shot("07-memory-study");
  await page.click('[data-action="study-done"]');
  check("the word is hidden once writing starts",
    await page.locator(".memory-word").count() === 0);
  check("the letter count is stated", (await text(".answer-field .hint")).includes(`${memWord.length} Buchstaben`));
  check("auto-check advisory line shown",
    (await page.locator(".answer-field .hint").nth(1).textContent()).includes("letzten Buchstaben"));
  check("the input is focused for typing",
    await page.evaluate(() => document.activeElement && document.activeElement.id === "answer"));
  check("the input cannot take more letters than the word",
    Number(await page.getAttribute("#answer", "maxlength")) === memWord.length);
  await shot("08-memory-write");

  await page.type("#answer", scramble(memWord));
  check("the last letter auto-evaluates a wrong word",
    await page.locator(".feedback-warn").count() === 1);
  check("the written letters are shown back",
    await page.locator(".letter").count() === memWord.length);
  check("the missed letters are marked", await page.locator(".letter.miss").count() > 0);
  await shot("09-memory-miss");
  await page.click('[data-action="retry"]');
  await page.type("#answer", memWord);
  check("the last letter auto-locks the right word",
    await page.locator(".feedback-success").count() === 1);
  check("memory rounds count the word", await page.evaluate(() =>
    JSON.parse(localStorage.getItem("wortwerkstatt.state")).game.memoryWords === 1));
  await shot("10-memory-correct");
  await page.click('[data-action="next"]');
  for (let i = 1; i < ROUND_SIZE; i++) {
    await answerTask();
    await page.waitForSelector(".feedback-success");
    await page.click('[data-action="next"]');
  }
  await page.waitForSelector(".done-panel");
  check("memory round finishes", (await text(".done-panel .feedback")).includes("Runde geschafft"));
  await page.click('[data-action="nav-home"]');

  /* ── Mixed practice spreads over the rules ─────────────────────── */
  await page.click('[data-action="start-mixed"]');
  check("mixed round is titled as such", (await text("h1")) === "Gemischte Übung");
  const seen = new Set();
  for (let i = 0; i < ROUND_SIZE; i++) {
    const done = await answerTask();
    seen.add(done.kind);
    await page.waitForSelector(".feedback-success");
    await page.click('[data-action="next"]');
  }
  await page.waitForSelector(".done-panel");
  check("mixed practice draws from more than one kind of task", seen.size > 1, [...seen].join(","));
  await shot("11-mixed-done");
  await page.click('[data-action="nav-home"]');
  const touched = await page.evaluate(() =>
    Object.keys(JSON.parse(localStorage.getItem("wortwerkstatt.state")).topics).length);
  check("a mixed round credits every rule it drew from", touched > 2, String(touched));

  /* ── Persistence ───────────────────────────────────────────────── */
  const xpBefore = await text(".stats-xp");
  await page.reload();
  await page.waitForSelector(".topic-card");
  check("progress survives a reload", (await text(".stats-xp")) === xpBefore, xpBefore);
  check("rule status survives a reload",
    (await text('.topic-card[data-id="sp-st"] .pill')) === "Geübt");
  await shot("12-home-practised");

  /* ── Medal gallery ─────────────────────────────────────────────── */
  await page.click(".stats-strip");
  check("medal gallery opens", (await text("h1")) === "Medaillen");
  check("gallery lists all medals", await page.locator(".medal-card").count() === MEDALS.length);
  check("some medals are unlocked", await page.locator(".medal-card:not(.locked)").count() > 0);
  check("locked medals keep their description visible",
    (await text(".medal-card.locked .medal-desc")).length > 0);
  await shot("13-medals");
  await page.click('[data-action="nav-home"]');

  /* ── Cycle suggestion after five clean rounds ──────────────────── */
  // A clean round is one finished without a single wrong answer. The
  // streak carries over from the rounds played above, so the test asks
  // the app where the streak stands and plays the rest: the step up may
  // be offered on the fifth clean round and on no earlier one.
  const streak = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("wortwerkstatt.state")).game.cleanCount);
  check("clean rounds so far are counted", streak >= 0 && streak < 5, String(streak));
  for (let run = streak + 1; run <= 5; run++) {
    await page.click('.topic-card[data-id="sch"]');
    await playRound();
    const offered = await page.locator('[data-action="accept-cycle"]').count();
    check(`clean run ${run}: suggestion ${run < 5 ? "not yet" : "offered"}`,
      offered === (run < 5 ? 0 : 1));
    if (run < 5) await page.click('[data-action="nav-home"]');
  }
  check("the suggestion names the next cycle",
    (await text(".feedback-info")).includes("Zyklus 3"));
  await shot("14-cycle-suggestion");
  await page.click('[data-action="accept-cycle"]');
  check("accepting the suggestion starts a round at once",
    await page.locator(".step-dots").count() === 1);
  await page.click('[data-action="nav-home"]');
  check("the accepted cycle is now the setting",
    (await text(".panel .hint")).includes("Zyklus 3"));
  check("cycle 3 shows its own rules",
    await page.locator(".topic-card").count() === topicsForCycle("de", 3).length);
  await shot("15-home-cycle3");

  /* ── Cycle 3: a task where the right answer is no mark at all ──── */
  await page.click('.topic-card[data-id="komma"]');
  check("the comma rule offers a no-comma option",
    (await page.$$eval(".choice-option", (els) => els.map((el) => el.dataset.value))).includes(""));
  check("the empty option is labelled, not blank",
    (await text('.choice-option[data-value=""] .choice-title')) === "kein Komma");
  await shot("16-round-comma");
  const comma = await answerTask();
  await page.waitForSelector(".feedback-success");
  // The solved sentence must read exactly as the engine spells it out,
  // spacing included: a comma glued to the word before it, and no
  // stray gap where the answer is "no comma at all".
  check("the solved sentence matches the engine, spacing included",
    (await text(".task-text")) === solutionText(comma.task),
    `${await text(".task-text")} vs ${solutionText(comma.task)}`);
  check("an answer of no comma still shows the slot it filled",
    comma.answer !== "" || (await page.locator(".blank-none").count()) === 1);
  await shot("16b-round-comma-correct");
  await page.click('[data-action="nav-home"]');

  /* ── Desktop layout ────────────────────────────────────────────── */
  await page.setViewportSize({ width: 1280, height: 900 });
  await shot("17-home-desktop");
  await page.click('.topic-card[data-id="das-dass"]');
  await shot("18-round-desktop");
  await page.click('[data-action="nav-home"]');
  await page.setViewportSize({ width: 390, height: 844 });

  /* ── Settings ──────────────────────────────────────────────────── */
  check("home has a settings button", await page.locator('[data-action="nav-settings"]').count() === 1);
  await page.click('[data-action="nav-settings"]');
  check("settings view opens", (await text("h1")) === "Einstellungen");
  check("language is the first panel", (await text(".section h2")) === "Sprache");
  check("both languages offered", await page.locator('[data-action="set-lang"]').count() === 2);
  check("all three cycles offered", await page.locator('[data-action="set-cycle"]').count() === CYCLES.length);
  check("the current cycle is marked",
    (await page.getAttribute('[data-cycle="3"]', "aria-pressed")) === "true");
  check("no save button in settings",
    await page.locator('[data-action="settings-save"]').count() === 0);
  check("the learning language panel stays hidden with one content pack",
    await page.locator('[data-action="set-content"]').count() === (CONTENT_LANGUAGES.length > 1 ? CONTENT_LANGUAGES.length : 0));
  await shot("19-settings");

  await page.click('[data-action="set-cycle"][data-cycle="1"]');
  check("a cycle change applies without a confirm step",
    (await page.getAttribute('[data-cycle="1"]', "aria-pressed")) === "true");
  await page.click('[data-action="nav-home"]');
  check("cycle 1 shows its own rules",
    await page.locator(".topic-card").count() === topicsForCycle("de", 1).length);
  check("cycle 1 names the school years", (await text(".panel .hint")).includes("1. und 2. Klasse"));
  await shot("20-home-cycle1");

  /* ── Language ──────────────────────────────────────────────────── */
  await page.click('[data-action="nav-settings"]');
  await page.click('[data-action="set-lang"][data-lang="en"]');
  check("language applies at once", (await text("h1")) === "Settings");
  check("document language follows the setting",
    (await page.locator("html").getAttribute("lang")) === "en");
  await page.click('[data-action="nav-home"]');
  check("home renders in English", (await text(".section h2")) === "Practise");
  const xpNow = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("wortwerkstatt.state")).game.xp);
  const levelTitle = TABLES.en[levelFor(xpNow).titleKey];
  check("the level title is translated",
    (await text(".stats-title")).includes(levelTitle), levelTitle);
  await shot("21-home-english");

  // The practice material stays in the language it teaches, and says so.
  await page.click('.topic-card[data-id="satzanfang"]');
  check("English interface, German practice material",
    (await page.locator(".task-text").getAttribute("lang")) === "de-CH");
  check("the rule is explained in the interface language",
    (await text(".instruction")) === "Which word fits?");
  await shot("22-round-english");
  await page.click('[data-action="nav-home"]');

  // Both languages on the narrowest supported width: nothing may spill
  // sideways, and no key may fall through to its raw id.
  for (const lang of ["de", "en"]) {
    await page.click('[data-action="nav-settings"]');
    await page.click(`[data-action="set-lang"][data-lang="${lang}"]`);
    for (const cycle of CYCLES) {
      await page.click(`[data-action="set-cycle"][data-cycle="${cycle}"]`);
      await page.click('[data-action="nav-home"]');
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      check(`${lang}, cycle ${cycle}: home fits the narrow viewport`, overflow <= 0, `${overflow}px wider`);
      const body = await text(".shell");
      const rawIds = Object.keys(TABLES.de).filter((k) => body.includes(k));
      check(`${lang}, cycle ${cycle}: no untranslated key leaks into the page`,
        rawIds.length === 0, rawIds.join(","));
      if (cycle !== CYCLES[CYCLES.length - 1]) await page.click('[data-action="nav-settings"]');
    }
  }

  /* ── Reset keeps settings, clears progress ─────────────────────── */
  await page.click('[data-action="reset-all"]');
  await page.waitForSelector(".topic-card");
  check("reset clears XP and level", (await text(".stats-xp")) === "0 of 30 XP");
  check("reset clears the rule progress",
    (await page.$$eval(".pill", (els) => els.map((e) => e.textContent.trim()))).every((p) => p === "New"));
  check("reset keeps the chosen language", (await text(".section h2")) === "Practise");
  check("reset keeps the chosen cycle", (await text(".panel .hint")).includes("Cycle 3"));
  await page.reload();
  await page.waitForSelector(".topic-card");
  check("reset persists", (await text(".stats-xp")) === "0 of 30 XP");
  check("settings still set after reset and reload",
    (await text(".section h2")) === "Practise");

  /* ── A save from an unknown shape must not break the app ───────── */
  await page.evaluate(() => {
    localStorage.setItem("wortwerkstatt.state", JSON.stringify({
      settings: { language: "xx", cycle: 99 },
      topics: { "sp-st": { rounds: 4, clean: 3 }, "gone-rule": { rounds: 2, clean: 1 } },
      game: { xp: 120, rounds: 6, medals: ["erste-runde"] }
    }));
  });
  await page.reload();
  await page.waitForSelector(".topic-card");
  check("an unusable language falls back to German",
    (await text(".section h2")) === "Üben", await text(".section h2"));
  check("an unusable cycle falls back to the default",
    (await text(".panel .hint")).includes("Zyklus 2"));
  check("stored XP survives", (await text(".stats-xp")) === "120 von 160 XP");
  check("progress for a rule that still exists survives",
    (await text('.topic-card[data-id="sp-st"] .pill')) === "Sitzt!");
  check("progress for a rule that is gone does no harm",
    await page.locator(".topic-card").count() === topicsForCycle("de", 2).length);
  await shot("23-home-migrated");

  check("no console errors", consoleErrors.length === 0, consoleErrors.join(" | "));
} finally {
  await browser.close();
  server.close();
}

// A wrong word of exactly the same length, so the auto-check fires.
function scramble(word) {
  const shift = (ch) => {
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const i = lower.indexOf(ch.toLowerCase());
    if (i < 0) return "x";
    const next = lower[(i + 1) % lower.length];
    return ch === ch.toUpperCase() ? next.toUpperCase() : next;
  };
  return word.split("").map(shift).join("");
}

function cssEscape(value) {
  return String(value).replace(/["\\]/g, "\\$&");
}

console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
