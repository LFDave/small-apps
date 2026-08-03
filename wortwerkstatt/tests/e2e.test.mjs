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
import {
  CONTENT_LANGUAGES, CYCLES, topicsForCycle, topicKey, LEHRPLAN_VERSION
} from "../js/data.js?v=2";
import { TABLES } from "../js/i18n.js?v=2";
import {
  fillTask, expectedAnswer, solutionText, isTyped, ROUND_SIZE
} from "../js/round.js?v=2";
import { MEDALS, xpForRound, levelFor } from "../js/game.js?v=2";

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
  const topicIds = new Set();
  const chapterIds = new Set();
  const shown = new Map();
  let itemCount = 0;
  let chapterCount = 0;

  for (const topic of CONTENT.topics) {
    if (topicIds.has(topic.id)) problems.push(`${topic.id} duplicate rule id`);
    topicIds.add(topic.id);
    if (!Array.isArray(topic.cycles) || topic.cycles.length === 0) problems.push(`${topic.id} has no cycles`);
    else if (!topic.cycles.every((c) => CYCLES.includes(c))) problems.push(`${topic.id} unknown cycle`);
    // A rule either names the competency step it comes from, or says
    // nothing. It may never claim a step that does not exist.
    if (topic.step !== null && !/^D\.4\.F\.1\.[a-g]( und \.[a-g])?$/.test(topic.step)) {
      problems.push(`${topic.id} has an odd step reference: ${topic.step}`);
    }
    for (const table of Object.values(TABLES)) {
      if (!table["topic" + topicKey(topic.id) + "Title"]) problems.push(`${topic.id} has no title`);
      if (!table["topic" + topicKey(topic.id) + "Rule"]) problems.push(`${topic.id} has no rule`);
    }

    // Every rule ends in a chapter the child writes rather than taps.
    if (!topic.chapters.some((c) => isTyped(c.kind))) problems.push(`${topic.id} has no writing chapter`);

    for (const chapter of topic.chapters) {
      chapterCount += 1;
      if (chapterIds.has(chapter.id)) problems.push(`${chapter.id} duplicate chapter id`);
      chapterIds.add(chapter.id);
      if (chapter.items.length < ROUND_SIZE) problems.push(`${chapter.id} has fewer items than a round`);
      for (const item of chapter.items) {
        itemCount += 1;
        const task = { topicId: topic.id, chapterId: chapter.id, kind: chapter.kind, item };
        if (item.answer === undefined || item.answer === null) problems.push(`${chapter.id} item without an answer`);
        if (isTyped(chapter.kind)) {
          // A written answer has to be reachable: a copy task shows the
          // sentence, everything else needs a clue naming the word.
          if (chapter.kind === "copy" && !item.prompt) problems.push(`${chapter.id} copy item without a prompt`);
          if (chapter.kind !== "copy" && !item.clue) problems.push(`${chapter.id} typed item without a clue`);
          if (!item.answer) problems.push(`${chapter.id} typed item with an empty answer`);
          continue;
        }
        // Exactly one option may be right, and the answer has to be
        // among them, or the task is unanswerable.
        if (!item.options.includes(item.answer)) problems.push(`${chapter.id}: ${item.answer} not offered`);
        if (new Set(item.options).size !== item.options.length) problems.push(`${chapter.id} repeats an option`);
        if (item.options.length < 2) problems.push(`${chapter.id} has a single option`);
        if (item.answer === "" && !chapter.emptyOptionKey) problems.push(`${chapter.id} has no label for the empty option`);
        // Two tasks that read identically would make the practice
        // ambiguous and the tests unable to tell them apart.
        const key = fillTask(task, BLANK);
        if (shown.has(key)) problems.push(`${chapter.id} reads the same as ${shown.get(key)}`);
        shown.set(key, chapter.id);
      }
    }
  }
  check(`all ${CONTENT.topics.length} rules and ${chapterCount} chapters are usable`,
    problems.length === 0, problems.slice(0, 8).join(" | "));
  check(`the pack carries ${itemCount} tasks`, itemCount > 400, String(itemCount));

  const perCycle = CYCLES.map((c) => topicsForCycle(CONTENT.code, c).length);
  check("every cycle has rules to practise", perCycle.every((n) => n > 0), perCycle.join("/"));

  // Step b straddles the cycle boundary in the source table, so its
  // rules have to appear in both cycle 1 and cycle 2.
  const spanning = CONTENT.topics.filter((t) => t.cycles.length > 1);
  check("the rules of step b span cycles 1 and 2",
    spanning.length > 0 && spanning.every((t) => t.step && t.step.includes("b")
      && t.cycles.includes(1) && t.cycles.includes(2)),
    spanning.map((t) => `${t.id}:${t.cycles}`).join(" "));

  check("the Lehrplan edition is recorded", /\d{2}\.\d{2}\.\d{4}/.test(LEHRPLAN_VERSION), LEHRPLAN_VERSION);
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

// Every task the app can put on screen, keyed by what the child sees
// before answering. Lets the test recognise the task and answer it the
// way someone who knows the rule would. Choice and write tasks are
// keyed by the text around the open blank, copy tasks by their prompt.
const GAP_INDEX = new Map();
const COPY_INDEX = new Map();
for (const topic of CONTENT.topics) {
  for (const chapter of topic.chapters) {
    for (const item of chapter.items) {
      const task = { topicId: topic.id, chapterId: chapter.id, kind: chapter.kind, item };
      if (chapter.kind === "memory") continue;
      if (chapter.kind === "copy") COPY_INDEX.set(item.prompt, task);
      else GAP_INDEX.set(fillTask(task, BLANK), task);
    }
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
  const count = (sel) => page.locator(sel).count();

  // Answers whatever task is on screen, choice or written. `wrong: true`
  // gives a wrong answer on purpose, so the miss path can be driven.
  const answerTask = async ({ wrong = false } = {}) => {
    // Memory: the word is shown, then hidden, then written.
    if (await count('[data-action="study-done"]')) {
      const word = await text(".memory-word");
      await page.click('[data-action="study-done"]');
      await page.fill("#answer", "");
      await page.type("#answer", wrong ? scramble(word) : word);
      return { kind: "memory", answer: word, task: null };
    }
    // Copy: the sentence to write out stays on screen.
    if (await count(".copy-prompt")) {
      const prompt = await text(".copy-prompt");
      const task = COPY_INDEX.get(prompt);
      if (!task) throw new Error("unknown copy prompt: " + JSON.stringify(prompt));
      const answer = expectedAnswer(task);
      await page.fill("#answer", "");
      await page.type("#answer", wrong ? scramble(answer) : answer);
      return { kind: "copy", answer, task };
    }
    const shownText = (await page.locator(".task-text").first().innerText()).trim();
    const task = GAP_INDEX.get(shownText);
    if (!task) throw new Error("unknown task on screen: " + JSON.stringify(shownText));
    const answer = expectedAnswer(task);
    // Write: the same frame as a choice task, but typed.
    if (await count("#answer")) {
      await page.fill("#answer", "");
      await page.type("#answer", wrong ? scramble(answer) : answer);
      return { kind: "write", answer, task };
    }
    const values = await page.$$eval(".choice-option", (els) => els.map((el) => el.dataset.value));
    const pick = wrong ? values.find((v) => v !== answer) : answer;
    await page.click(`.choice-option[data-value="${cssEscape(pick)}"]`);
    return { kind: task.kind, answer, picked: pick, task };
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

  // Walks back to the overview from wherever the test is. Mid-round the
  // header offers "back" (one step up the path), the completion panel
  // offers "home" directly.
  const backHome = async () => {
    for (let i = 0; i < 4 && !(await count(".stats-strip")); i++) {
      const direct = await count('[data-action="nav-home"]');
      await page.click(direct ? '[data-action="nav-home"]' : '[data-action="nav-back"]');
    }
    await page.waitForSelector(".stats-strip");
  };

  const openRule = async (id) => {
    await page.click(`.topic-card[data-id="${id}"]`);
    await page.waitForSelector('[data-action="start-chapter"]');
  };

  /* ── Home ──────────────────────────────────────────────────────── */
  await page.goto(URL);
  await page.waitForSelector(".topic-card");
  check("app title renders", (await text("h1")) === "Wortwerkstatt");
  check("cycle 1 is the default", (await text(".panel .hint")).includes("Zyklus 1"));
  check("home lists the rules of the cycle",
    (await count(".topic-card")) === topicsForCycle("de", 1).length);
  check("every rule starts as Neu",
    (await page.$$eval(".pill", (els) => els.map((e) => e.textContent.trim()))).every((p) => p === "Neu"));
  check("rule cards count their chapters", (await text(".topic-sub")) === "0 von 3 Kapiteln geübt");
  check("storage note visible", (await text(".app-footer .hint")).includes("auf diesem Gerät"));
  check("stats strip starts at level 1", (await text(".stats-title")).includes("Level 1"));
  check("no medals unlocked yet", (await text(".stats-medals")) === `0/${MEDALS.length}`);
  await shot("01-home");

  /* ── Rule view: rule text, its source, its chapters ────────────── */
  await openRule("sp-st");
  check("the rule view names the rule", (await text("h1")) === "sp und st");
  check("the rule text is available before practising",
    (await text(".rule-text")).includes("schp und scht"));
  check("the rule names the competency step it comes from",
    (await text(".rule-source")).includes("D.4.F.1.b"));
  check("the rule names the Lehrplan edition",
    (await text(".rule-source")).includes("23.06.2016"));
  check("a rule that spans two cycles says so",
    (await text(".rule-source")).includes("Zyklus 1") && (await text(".rule-source")).includes("Zyklus 2"));
  check("the rule offers three chapters", (await count('[data-action="start-chapter"]')) === 3);
  check("the chapters are named, not just numbered",
    (await text(".topic-title")) === "Zum Aufwärmen");
  check("the last chapter is marked as a writing chapter",
    (await count(".tag-write")) === 1);
  check("the whole rule can be practised mixed",
    (await count('[data-action="start-topic-mixed"]')) === 1);
  await shot("02-rule-view");

  /* ── Chapter 1: miss, rule, reveal, recovery ───────────────────── */
  await page.click('[data-action="start-chapter"][data-id="sp-st-1"]');
  check("a round is one dot per task", (await count(".dot")) === ROUND_SIZE);
  check("instruction names the task", (await text(".instruction")) === "Welche Buchstaben fehlen?");
  check("the blank is open before an answer", (await text(".blank")) === BLANK);
  check("the open blank is announced as a gap, not as three dots",
    (await page.getAttribute(".blank", "aria-label")) === "Lücke");
  check("the rule stays hidden while thinking", (await count(".rule")) === 0);
  check("no confirm button, the options are the answer",
    (await count('[data-action="ok"], [data-action="confirm"]')) === 0);
  await shot("03-round-word");

  await answerTask({ wrong: true });
  check("a wrong choice is answered at once", (await count(".feedback-warn")) === 1);
  check("the wrong choice stays visible in the blank", (await count(".blank-miss")) === 1);
  check("the rule appears once the answer is in", (await count(".rule-text")) === 1);
  check("no reveal after the first miss", (await count('[data-action="reveal"]')) === 0);
  check("feedback is supportive, never wrong", !(await text(".feedback-warn")).includes("Falsch"));
  await shot("04-round-miss");

  await page.click('[data-action="retry"]');
  await answerTask({ wrong: true });
  check("reveal offered after the second miss", (await count('[data-action="reveal"]')) === 1);
  await page.click('[data-action="reveal"]');
  check("reveal shows the solution in the blank", (await count(".blank-ok")) === 1);
  await shot("05-round-reveal");
  await page.click('[data-action="reveal-done"]');
  const first = await answerTask();
  check("the right choice locks in at once", (await count(".feedback-success")) === 1);
  check("the solution fills the blank", (await text(".blank-ok")) === first.answer);
  await page.click('[data-action="next"]');

  for (let i = 1; i < ROUND_SIZE; i++) {
    await answerTask();
    await page.waitForSelector(".feedback-success");
    await page.click('[data-action="next"]');
  }
  await page.waitForSelector(".done-panel");
  check("round completion panel", (await text(".done-panel .feedback")).includes("Runde geschafft"));
  check("summary counts the first-try answers",
    (await text(".done-panel .feedback")).includes("5 von 6"));
  check("summary lists every task", (await count(".result-row")) === ROUND_SIZE);
  // 5 first try, 1 corrected, cycle 1, not a writing chapter.
  check(`round rewards +${xpForRound(1, 5, 1, false)} XP`,
    (await text(".reward-xp")) === `+${xpForRound(1, 5, 1, false)} XP`);
  check("first medal in the reward block", (await text(".reward-block")).includes("Erste Runde"));
  check("the completion panel points at the next chapter",
    (await text('[data-action="start-chapter"]')).includes("Schon schwieriger"));
  await shot("06-round-done");

  /* ── Chapter 2 straight from the completion panel ──────────────── */
  await page.click('[data-action="start-chapter"]');
  check("the next chapter starts from the completion panel", (await count(".dot")) === ROUND_SIZE);
  await playRound();
  check("the second chapter points at the writing chapter",
    (await text('[data-action="start-chapter"]')).includes("Selber schreiben"));

  /* ── Chapter 3: the writing chapter ────────────────────────────── */
  await page.click('[data-action="start-chapter"]');
  check("the writing chapter asks for a written answer", (await count("#answer")) === 1);
  check("the writing chapter names what to do",
    (await text(".instruction")) === "Schreib das passende Wort.");
  check("the writing chapter still shows the sentence frame", (await count(".task-text")) === 1);
  check("a clue points at the word", (await count(".task-clue")) === 1);
  check("the input is focused for typing",
    await page.evaluate(() => document.activeElement && document.activeElement.id === "answer"));
  check("no confirm button on a written answer",
    (await count('[data-action="ok"], [data-action="confirm"]')) === 0);
  check("the character count is stated", (await text(".answer-field .hint")).includes("Zeichen"));
  check("auto-check advisory line shown",
    (await page.locator(".answer-field .hint").nth(1).textContent()).includes("letzten Zeichen"));
  await shot("07-round-write");

  // Read while the field is on screen: a wrong answer replaces it
  // with the letter-by-letter comparison.
  const writeMaxLength = Number(await page.getAttribute("#answer", "maxlength"));
  const write = await answerTask({ wrong: true });
  check("the last character auto-evaluates a wrong word", (await count(".feedback-warn")) === 1);
  check("the written characters are shown back",
    (await count(".letter")) === write.answer.length);
  check("the missed characters are marked", (await count(".letter.miss")) > 0);
  check("the input is capped at the answer length", writeMaxLength === write.answer.length);
  await shot("08-round-write-miss");
  await page.click('[data-action="retry"]');
  await page.type("#answer", write.answer);
  check("the last character auto-locks the right word", (await count(".feedback-success")) === 1);
  check("a written answer is counted", await page.evaluate(() =>
    JSON.parse(localStorage.getItem("wortwerkstatt.state")).game.written === 1));
  await shot("09-round-write-correct");
  await page.click('[data-action="next"]');
  for (let i = 1; i < ROUND_SIZE; i++) {
    await answerTask();
    await page.waitForSelector(".feedback-success");
    await page.click('[data-action="next"]');
  }
  await page.waitForSelector(".done-panel");
  // A writing chapter is worth more than tapping options.
  check(`the writing chapter rewards +${xpForRound(1, 5, 1, true)} XP`,
    (await text(".reward-xp")) === `+${xpForRound(1, 5, 1, true)} XP`);
  check("finishing every chapter of a rule earns a medal",
    (await text(".reward-block")).includes("Kapitelmeister"));
  check("the last chapter offers no next chapter",
    (await count('[data-action="start-chapter"]')) === 0);
  await shot("10-write-done");

  await page.click('[data-action="nav-back"]');
  check("back from a round returns to the rule", (await text("h1")) === "sp und st");
  check("all three chapters now show progress",
    (await page.$$eval(".pill", (els) => els.map((e) => e.textContent.trim())))
      .every((p) => p !== "Neu"));
  await shot("11-rule-practised");
  await page.click('[data-action="nav-back"]');
  check("back from a rule returns home", (await count(".stats-strip")) === 1);
  check("the rule card counts the practised chapters",
    (await text('.topic-card[data-id="sp-st"] .topic-sub')) === "3 von 3 Kapiteln geübt");

  /* ── A copy chapter: write the whole sentence ──────────────────── */
  await openRule("satzanfang");
  await page.click('[data-action="start-chapter"][data-id="satzanfang-3"]');
  check("a copy chapter shows the sentence to write out", (await count(".copy-prompt")) === 1);
  check("the copy chapter names what to do",
    (await text(".instruction")) === "Schreib den Satz richtig auf.");
  await shot("12-round-copy");
  const copy = await answerTask();
  check("a written sentence locks in on the last character",
    (await count(".feedback-success")) === 1);
  check("the solved sentence is the one the engine expects",
    (await text(".memory-word")) === solutionText(copy.task),
    `${await text(".memory-word")} vs ${solutionText(copy.task)}`);
  await shot("13-round-copy-correct");
  await backHome();

  /* ── Mixed practice ────────────────────────────────────────────── */
  await openRule("sch");
  await page.click('[data-action="start-topic-mixed"]');
  check("a rule can be practised across its chapters", (await count(".dot")) === ROUND_SIZE);
  const ruleChapters = new Set();
  for (let i = 0; i < ROUND_SIZE; i++) {
    const done = await answerTask();
    if (done.task) ruleChapters.add(done.task.chapterId);
    await page.waitForSelector(".feedback-success");
    await page.click('[data-action="next"]');
  }
  await page.waitForSelector(".done-panel");
  check("mixed rule practice draws from more than one chapter",
    ruleChapters.size > 1, [...ruleChapters].join(","));
  await backHome();

  await page.click('[data-action="start-cycle-mixed"]');
  check("mixed cycle practice is titled as such", (await text("h1")) === "Gemischte Übung");
  const seenRules = new Set();
  for (let i = 0; i < ROUND_SIZE; i++) {
    const done = await answerTask();
    if (done.task) seenRules.add(done.task.topicId);
    await page.waitForSelector(".feedback-success");
    await page.click('[data-action="next"]');
  }
  await page.waitForSelector(".done-panel");
  check("mixed cycle practice draws from more than one rule",
    seenRules.size > 1, [...seenRules].join(","));
  await shot("14-mixed-done");
  await backHome();

  /* ── Persistence ───────────────────────────────────────────────── */
  const xpBefore = await text(".stats-xp");
  await page.reload();
  await page.waitForSelector(".topic-card");
  check("progress survives a reload", (await text(".stats-xp")) === xpBefore, xpBefore);
  check("rule status survives a reload",
    (await text('.topic-card[data-id="sp-st"] .topic-sub')) === "3 von 3 Kapiteln geübt");
  await shot("15-home-practised");

  /* ── Medal gallery ─────────────────────────────────────────────── */
  await page.click(".stats-strip");
  check("medal gallery opens", (await text("h1")) === "Medaillen");
  check("gallery lists all medals", (await count(".medal-card")) === MEDALS.length);
  check("some medals are unlocked", (await count(".medal-card:not(.locked)")) > 0);
  check("locked medals keep their description visible",
    (await text(".medal-card.locked .medal-desc")).length > 0);
  await shot("16-medals");
  await page.click('[data-action="nav-back"]');

  /* ── Cycle suggestion after five clean rounds ──────────────────── */
  const streak = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("wortwerkstatt.state")).game.cleanCount);
  check("clean rounds so far are counted", streak >= 0 && streak < 5, String(streak));
  for (let run = streak + 1; run <= 5; run++) {
    await openRule("ng-nk");
    await page.click('[data-action="start-chapter"][data-id="ng-nk-1"]');
    await playRound();
    const offered = await count('[data-action="accept-cycle"]');
    check(`clean run ${run}: suggestion ${run < 5 ? "not yet" : "offered"}`,
      offered === (run < 5 ? 0 : 1));
    if (run < 5) await backHome();
  }
  check("the suggestion names the next cycle",
    (await text(".feedback-info")).includes("Zyklus 2"));
  await shot("17-cycle-suggestion");
  await page.click('[data-action="accept-cycle"]');
  check("accepting the suggestion starts a round at once", (await count(".step-dots")) === 1);
  await backHome();
  check("the accepted cycle is now the setting",
    (await text(".panel .hint")).includes("Zyklus 2"));

  /* ── A rule that spans two cycles is on both lists ─────────────── */
  check("cycle 2 lists its own rules",
    (await count(".topic-card")) === topicsForCycle("de", 2).length);
  check("the step b rules are on the cycle 2 list too",
    (await count('.topic-card[data-id="sp-st"]')) === 1);
  check("progress made in cycle 1 is the same progress in cycle 2",
    (await text('.topic-card[data-id="sp-st"] .topic-sub')) === "3 von 3 Kapiteln geübt");
  check("a cycle 2 only rule is not on the cycle 1 list",
    topicsForCycle("de", 1).every((t) => t.id !== "wortstamm"));
  await shot("18-home-cycle2");

  /* ── Desktop layout ────────────────────────────────────────────── */
  await page.setViewportSize({ width: 1280, height: 900 });
  await shot("19-home-desktop");
  await openRule("komma-teilsatz");
  await shot("20-rule-desktop");
  await page.click('[data-action="start-chapter"][data-id="komma-teilsatz-1"]');
  check("the comma rule offers a no-comma option",
    (await page.$$eval(".choice-option", (els) => els.map((el) => el.dataset.value))).includes(""));
  check("the empty option is labelled, not blank",
    (await text('.choice-option[data-value=""] .choice-title')) === "kein Komma");
  await shot("21-round-comma-desktop");
  const comma = await answerTask();
  await page.waitForSelector(".feedback-success");
  check("the solved sentence matches the engine, spacing included",
    (await text(".task-text")) === solutionText(comma.task),
    `${await text(".task-text")} vs ${solutionText(comma.task)}`);
  await backHome();
  await page.setViewportSize({ width: 390, height: 844 });

  /* ── Settings ──────────────────────────────────────────────────── */
  await page.click('[data-action="nav-settings"]');
  check("settings view opens", (await text("h1")) === "Einstellungen");
  check("language is the first panel", (await text(".section h2")) === "Sprache");
  check("both languages offered", (await count('[data-action="set-lang"]')) === 2);
  check("all three cycles offered", (await count('[data-action="set-cycle"]')) === CYCLES.length);
  check("the current cycle is marked",
    (await page.getAttribute('[data-cycle="2"]', "aria-pressed")) === "true");
  check("each cycle states how many rules it holds",
    (await text('[data-cycle="1"] .choice-hint:last-child'))
      === `${topicsForCycle("de", 1).length} Regeln`);
  check("no save button in settings", (await count('[data-action="settings-save"]')) === 0);
  check("the learning language panel stays hidden with one content pack",
    (await count('[data-action="set-content"]'))
      === (CONTENT_LANGUAGES.length > 1 ? CONTENT_LANGUAGES.length : 0));
  await shot("22-settings");

  /* ── Language ──────────────────────────────────────────────────── */
  await page.click('[data-action="set-lang"][data-lang="en"]');
  check("language applies at once", (await text("h1")) === "Settings");
  check("document language follows the setting",
    (await page.locator("html").getAttribute("lang")) === "en");
  await page.click('[data-action="nav-back"]');
  check("home renders in English", (await text(".section h2")) === "Practise");
  const xpNow = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("wortwerkstatt.state")).game.xp);
  const levelTitle = TABLES.en[levelFor(xpNow).titleKey];
  check("the level title is translated",
    (await text(".stats-title")).includes(levelTitle), levelTitle);
  await shot("23-home-english");

  await openRule("sch");
  check("the rule is explained in the interface language",
    (await text(".rule-text")).includes("three letters"));
  check("the chapter names are translated", (await text(".topic-title")) === "Warming up");
  await page.click('[data-action="start-chapter"][data-id="sch-3"]');
  check("English interface, German practice material",
    (await page.locator(".task-text").getAttribute("lang")) === "de-CH");
  check("the instruction is in the interface language",
    (await text(".instruction")) === "Write the word that fits.");
  await shot("24-round-english");
  await backHome();

  // Both languages on the narrowest supported width: nothing may spill
  // sideways, and no key may fall through to its raw id.
  for (const lang of ["de", "en"]) {
    await page.click('[data-action="nav-settings"]');
    await page.click(`[data-action="set-lang"][data-lang="${lang}"]`);
    for (const cycle of CYCLES) {
      await page.click(`[data-action="set-cycle"][data-cycle="${cycle}"]`);
      await page.click('[data-action="nav-back"]');
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

  // A rule view is the widest thing to lay out: rule text, source line,
  // three chapter rows with a writing tag and a status pill.
  for (const lang of ["de", "en"]) {
    await page.click('[data-action="nav-settings"]');
    await page.click(`[data-action="set-lang"][data-lang="${lang}"]`);
    await page.click('[data-action="set-cycle"][data-cycle="2"]');
    await page.click('[data-action="nav-back"]');
    await openRule("nachmorpheme");
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(`${lang}: the rule view fits the narrow viewport`, overflow <= 0, `${overflow}px wider`);
    await shot(`25-rule-view-${lang}`);
    await page.click('[data-action="nav-back"]');
  }

  /* ── Reset keeps settings, clears progress ─────────────────────── */
  const cycleBeforeReset = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("wortwerkstatt.state")).settings.cycle);
  await page.click('[data-action="reset-all"]');
  await page.waitForSelector(".topic-card");
  check("reset clears XP and level", (await text(".stats-xp")) === "0 of 30 XP");
  check("reset clears the rule progress",
    (await page.$$eval(".pill", (els) => els.map((e) => e.textContent.trim()))).every((p) => p === "New"));
  check("reset keeps the chosen language", (await text(".section h2")) === "Practise");
  check("reset keeps the chosen cycle",
    (await page.evaluate(() =>
      JSON.parse(localStorage.getItem("wortwerkstatt.state")).settings.cycle)) === cycleBeforeReset,
    String(cycleBeforeReset));
  await page.reload();
  await page.waitForSelector(".topic-card");
  check("reset persists", (await text(".stats-xp")) === "0 of 30 XP");

  /* ── A save from an older or broken version ────────────────────── */
  // Progress used to be stored per rule under `topics`; those keys do
  // not map onto chapters, so they are dropped while XP, medals and
  // settings survive. Nothing here may throw.
  await page.evaluate(() => {
    localStorage.setItem("wortwerkstatt.state", JSON.stringify({
      settings: { language: "xx", cycle: 99 },
      topics: { "sp-st": { rounds: 4, clean: 3 } },
      chapters: { "sp-st-1": { rounds: 4, clean: 3 }, "gone-chapter": { rounds: 2, clean: 1 } },
      game: { xp: 120, rounds: 6, medals: ["erste-runde"] }
    }));
  });
  await page.reload();
  await page.waitForSelector(".topic-card");
  check("an unusable language falls back to German",
    (await text(".section h2")) === "Üben", await text(".section h2"));
  check("an unusable cycle falls back to the default",
    (await text(".panel .hint")).includes("Zyklus 1"));
  check("stored XP survives", (await text(".stats-xp")) === "120 von 160 XP");
  check("progress for a chapter that still exists survives",
    (await text('.topic-card[data-id="sp-st"] .topic-sub')) === "1 von 3 Kapiteln geübt");
  check("progress for a chapter that is gone does no harm",
    (await count(".topic-card")) === topicsForCycle("de", 1).length);
  await shot("26-home-migrated");

  check("no console errors", consoleErrors.length === 0, consoleErrors.join(" | "));
} finally {
  await browser.close();
  server.close();
}

// A wrong answer of exactly the same length, so the auto-check fires.
function scramble(answer) {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  return answer.split("").map((ch) => {
    const i = lower.indexOf(ch.toLowerCase());
    if (i < 0) return ch === " " ? " " : "x";
    const next = lower[(i + 1) % lower.length];
    return ch === ch.toUpperCase() ? next.toUpperCase() : next;
  }).join("");
}

function cssEscape(value) {
  return String(value).replace(/["\\]/g, "\\$&");
}

console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
