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

// Lets a test queue the exact numbers the generator should draw next.
// With an empty queue the app uses real randomness, so every other check
// still runs against ordinary problems.
await page.addInitScript(() => {
  const real = Math.random;
  window.__rand = [];
  Math.random = () => (window.__rand.length ? window.__rand.shift() : real());
});
// The generator draws the result first, then one operand, both from
// [0, max]. These are the two draws that produce a given task.
const drawsFor = (op, a, b, max) => {
  const result = op === "+" ? a + b : a - b;
  return op === "+"
    ? [(result + 0.5) / (max + 1), (a + 0.5) / (result + 1)]
    : [(result + 0.5) / (max + 1), (b + 0.5) / (max - result + 1)];
};
const forceProblem = (op, a, b, max) =>
  page.evaluate(d => { window.__rand = d; }, drawsFor(op, a, b, max));
// Queues several tasks in a row, so a test can tell one advance from two.
const forceProblems = (list) =>
  page.evaluate(d => { window.__rand = d; }, list.flatMap(p => drawsFor(...p)));

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

  // ── Gamification: XP, stats strip, medal gallery ──────────────────
  check("XP accumulated in storage",
    await page.evaluate(() => JSON.parse(localStorage.getItem("add-subtract.stats")).xp > 0));
  await page.click("#change-settings");
  check("stats strip shows a level name", (await page.textContent("#level-name")).length > 0);
  check("level progress bar present", await page.isVisible("#level-bar"));
  await page.click("#show-medals");
  check("medal gallery lists all medals", await page.evaluate(() => document.querySelectorAll(".medal").length === 8));
  check("locked medals stay visible with name",
    await page.evaluate(() => [...document.querySelectorAll(".medal.locked .name")].every(n => n.textContent.length > 0)));
  check("first medal unlocked after solving",
    await page.evaluate(() => {
      const first = [...document.querySelectorAll(".medal")].find(m => m.querySelector(".name").textContent === "Startklar");
      return first && !first.classList.contains("locked");
    }));
  await page.screenshot({ path: join(SHOTS_DIR, "04-medals.png") });
  await page.click("#medals-back");

  // ── Difficulty proposal after 10 first-try solves ─────────────────
  await page.click('#range-chips button[data-min="0"][data-max="10"]');
  await page.click("#start");
  for (let i = 0; i < 10; i++) {
    const { answer: ans } = await readProblem();
    await typeAnswer(String(ans));
    if (i === 0) check("reward block appears after a solve",
      (await page.textContent("#reward")).includes("XP"));
    if (i < 9) await page.click("#next");
  }
  check("proposal appears after 10 first-try solves", await page.isVisible("#proposal"));
  check("proposal offers the next ladder step", (await page.textContent("#propose-yes")).includes("20"));
  check("Weiter hidden while proposal shows", !(await page.isVisible("#next")));
  await page.screenshot({ path: join(SHOTS_DIR, "05-proposal.png") });
  await page.click("#propose-yes");
  check("accepting raises the range to 0-20",
    await page.evaluate(() => JSON.parse(localStorage.getItem("add-subtract.settings")).max === 20));
  check("quiz continues after accepting", (await page.textContent("#feedback")).trim() === "");

  // ── Rechenweg hints ───────────────────────────────────────────────
  const hintSteps = () => page.$$eval(".hint-steps li", els => els.map(e => e.textContent));

  // The strategy is picked by four questions in order: is the second
  // number close to the first, is it close to a whole ten, do the ones
  // cross a ten, otherwise tens first and then ones.
  const CASES = [
    { op: "-", a: 82, b: 31, rule: "tens first, then ones",
      title: "Ziehe zuerst die Zehner ab.", steps: ["82 − 30 = 52", "52 − 1 = ?"], shot: null },
    { op: "-", a: 25, b: 17, rule: "close to the first number, count up",
      title: "Zähle von 17 hinauf bis 25.", steps: ["17 + 3 = 20", "20 + 5 = 25", "Zusammen: 3 + 5 = ?"],
      shot: "07-hint-count-up.png" },
    { op: "-", a: 42, b: 7, rule: "ones cross a ten, bridge",
      title: "Gehe zuerst auf die Zehn.", steps: ["42 − 2 = 40", "40 − 5 = ?"], shot: null },
    { op: "-", a: 82, b: 29, rule: "close to a whole ten, round and give back",
      title: "Runde die 29 auf 30.", steps: ["82 − 30 = 52", "52 + 1 = ?"], shot: "06-hint-round.png" },
    { op: "-", a: 45, b: 17, rule: "not close, so bridge instead of counting up",
      title: "Gehe zuerst auf die Zehn.", steps: ["45 − 10 = 35", "35 − 5 = 30", "30 − 2 = ?"], shot: null },
    { op: "-", a: 10, b: 7, rule: "number pair to ten",
      title: "Zähle von 7 hinauf bis 10.", steps: ["7 + ? = 10"], shot: null },
    { op: "-", a: 60, b: 45, rule: "tens away, then out of the last ten",
      title: "Ziehe zuerst die Zehner ab.", steps: ["60 − 40 = 20", "10 − 5 = 5", "10 + 5 = ?"], shot: null },
    { op: "+", a: 45, b: 19, rule: "plus close to a whole ten, round and take back",
      title: "Runde die 19 auf 20.", steps: ["45 + 20 = 65", "65 − 1 = ?"], shot: "08-hint-plus-round.png" },
    { op: "+", a: 8, b: 7, rule: "plus crossing a ten, fill up",
      title: "Fülle zuerst auf die nächste Zehn.", steps: ["8 + 2 = 10", "10 + 5 = ?"], shot: null }
  ];

  for (const c of CASES) {
    const sign = c.op === "+" ? "+" : "−";
    await page.click("#change-settings");
    await page.click(`#op-chips button[data-op="${c.op}"]`);
    await page.click('#range-chips button[data-min="0"][data-max="100"]');
    await forceProblem(c.op, c.a, c.b, 100);
    await page.click("#start");
    check(`task forced to ${c.a} ${sign} ${c.b}`,
      (await page.textContent("#problem")).trim() === `${c.a} ${sign} ${c.b} =`,
      await page.textContent("#problem"));
    check(`${c.a} ${sign} ${c.b}: hint stays closed until asked`,
      (await page.textContent("#hint")).trim() === ""
      && await page.getAttribute("#hint-toggle", "aria-expanded") === "false");
    await page.click("#hint-toggle");
    check(`${c.a} ${sign} ${c.b}: ${c.rule}`,
      (await page.textContent(".hint-title")) === c.title, await page.textContent(".hint-title"));
    check(`${c.a} ${sign} ${c.b}: steps`,
      (await hintSteps()).join(" | ") === c.steps.join(" | "), (await hintSteps()).join(" | "));
    const answer = c.op === "+" ? c.a + c.b : c.a - c.b;
    check(`${c.a} ${sign} ${c.b}: the answer stays the learner's move`,
      !new RegExp(`(^|\\D)${answer}(\\D|$)`).test(await page.textContent("#hint")),
      await page.textContent("#hint"));
    if (c.shot) await page.screenshot({ path: join(SHOTS_DIR, c.shot) });
  }

  check("hint region is a status region (WCAG 4.1.3)", await page.getAttribute("#hint", "role") === "status");
  check("toggle reports the expanded state", await page.getAttribute("#hint-toggle", "aria-expanded") === "true");
  await page.click("#hint-toggle");
  check("hint can be collapsed again",
    (await page.textContent("#hint")).trim() === ""
    && await page.getAttribute("#hint-toggle", "aria-expanded") === "false");

  // The hint is available before any wrong answer: nothing above asked
  // for one, and every task opened it straight from the toggle.

  // Enter on a focused button does that button's job and nothing else,
  // even while Weiter is on screen and listening for Enter.
  await page.click("#change-settings");
  await page.click('#op-chips button[data-op="-"]');
  await forceProblem("-", 45, 17, 100);
  await page.click("#start");
  await typeAnswer("28");
  await forceProblems([["-", 45, 7, 100], ["-", 20, 5, 100]]);
  await page.focus("#hint-toggle");
  await page.keyboard.press("Enter");
  check("Enter on the hint toggle does not skip the solved task",
    (await page.textContent("#problem")).trim() === "45 − 17 =",
    await page.textContent("#problem"));
  check("Enter on the hint toggle opens the hint",
    await page.getAttribute("#hint-toggle", "aria-expanded") === "true");

  // Two tasks are queued, so a double advance would show the second one.
  await page.focus("#next");
  await page.keyboard.press("Enter");
  check("Enter on Weiter advances exactly one task",
    (await page.textContent("#problem")).trim() === "45 − 7 =",
    await page.textContent("#problem"));
  check("Weiter via Enter clears the feedback", (await page.textContent("#feedback")).trim() === "");
  await page.evaluate(() => { window.__rand = []; });

  await page.click("#change-settings");
  await page.click('#op-chips button[data-op="+"]');
  await page.click('#range-chips button[data-min="0"][data-max="20"]');
  await forceProblem("+", 8, 7, 20);
  await page.click("#start");

  // Second miss opens the hint by itself.
  for (let i = 0; i < 2; i++) {
    await typeAnswer("16");
    if (i === 0) for (const _ of "16") await page.click("#backspace");
  }
  check("second miss opens the hint automatically",
    await page.getAttribute("#hint-toggle", "aria-expanded") === "true"
    && (await page.textContent(".hint-title")).length > 0);
  check("feedback points at the hint instead of repeating it",
    (await page.textContent("#feedback")).includes("Rechenweg"));
  await page.screenshot({ path: join(SHOTS_DIR, "09-hint-after-second-miss.png") });
  for (const _ of "16") await page.click("#backspace");
  await typeAnswer("15");
  check("solving after the hint still counts and pays full XP",
    (await page.textContent("#reward")).includes("XP"));

  // A hint costs nothing but does not feed the mastery streak.
  await page.click("#change-settings");
  await forceProblem("+", 8, 7, 20);
  await page.click("#start");
  await page.click("#hint-toggle");
  await typeAnswer("15");
  check("a hinted task does not raise the clean-run streak",
    await page.evaluate(() => JSON.parse(localStorage.getItem("add-subtract.stats")).firstTryStreak === 0));
  const solvedBefore = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("add-subtract.stats")).solved);
  await page.click("#next");
  ({ answer } = await readProblem());
  await typeAnswer(String(answer));
  check("an unhinted solve raises the clean-run streak",
    await page.evaluate(() => JSON.parse(localStorage.getItem("add-subtract.stats")).firstTryStreak === 1));
  check("hinted solves still count as solved",
    await page.evaluate(() => JSON.parse(localStorage.getItem("add-subtract.stats")).solved) === solvedBefore + 1);

  // ── Alles zurücksetzen ────────────────────────────────────────────
  await page.click("#change-settings");
  check("reset lives in the home footer, not in the quiz",
    await page.isVisible(".app-footer #reset-all") && !(await page.isVisible("#quiz")));

  let dialogText = "";
  page.once("dialog", d => { dialogText = d.message(); d.dismiss(); });
  await page.click("#reset-all");
  check("reset asks before deleting", dialogText.length > 0);
  check("confirmation says the data lives on this device", dialogText.includes("Gerät"), dialogText);
  check("cancelling keeps the progress",
    await page.evaluate(() => JSON.parse(localStorage.getItem("add-subtract.stats")).solved > 0));

  page.once("dialog", d => d.accept());
  await page.click("#reset-all");
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem("add-subtract.stats")));
  check("reset clears XP, solves and streak", after.xp === 0 && after.solved === 0 && after.streak === 0);
  check("reset clears the medal counters",
    after.digitsTyped === 0 && after.minusSolved === 0 && Object.keys(after.rangesSolved).length === 0);
  check("reset keeps the settings",
    await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem("add-subtract.settings"));
      return s.op === "+" && s.max === 20;
    }));
  check("progress box shows the first level again",
    (await page.textContent("#level-name")) === "Zahlenstart");
  check("medal count is back to zero", (await page.textContent("#medal-count")).includes("0 von 8"));
  check("reset is announced in a status region",
    await page.getAttribute("#reset-status", "role") === "status"
    && (await page.textContent("#reset-status")).length > 0);
  await page.screenshot({ path: join(SHOTS_DIR, "10-reset.png"), fullPage: true });
  await page.click("#show-medals");
  check("medals are locked again after the reset",
    await page.evaluate(() => document.querySelectorAll(".medal.locked").length === 8));
  await page.click("#medals-back");

  check("no console errors", consoleErrors.length === 0, consoleErrors.join(" | "));
} finally {
  await browser.close();
  server.kill();
}

console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
