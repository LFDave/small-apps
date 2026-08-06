// e2e.test.mjs — end-to-end tests for Tierraten.
//
// Run:
//   cd tierraten/tests && npm install && node e2e.test.mjs
//
// Spawns its own static server (node, no external deps) and drives the
// real flows in Chromium: a choose-mode round with a wrong guess, a
// typed round that checks itself on the last character, a reveal, the
// alphabet walk, settings, persistence, reset and the medal view.
// Exits non-zero if any check fails. Screenshots land in
// tests/screenshots/ (gitignored).
//
// The expected answers are derived from the fact table through the same
// modules the app renders from, so the tests cannot drift from it.

import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { mkdirSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ANIMALS, CONTINENTS, HABITATS, BODIES, BIRTHS, FOODS, COVERS, COLORS, COUNTRIES
} from "../js/animals.js?v=1";
import {
  LANGUAGES, ALPHABET, CLUES, CLUE_COUNT, ROUND_SIZES, OPTION_COUNT, MASTERY_RUNS,
  nameOf, letterOf, secondLetterOf, valueKey, clueLabelKey, acceptedForms, matchesName
} from "../js/data.js?v=1";
import { TABLES } from "../js/i18n.js?v=1";
import { MEDALS, LEVELS, levelFor, xpForAnimal, SOLVE_BASE, REVEAL_XP } from "../js/game.js?v=1";

const TESTS_DIR = dirname(fileURLToPath(import.meta.url));
const APP_DIR = join(TESTS_DIR, "..");
const SHOTS_DIR = join(TESTS_DIR, "screenshots");
const PORT = 8477;
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

const FIELD_OF_SET = {
  continent: "continent", country: "country", habitat: "habitat", body: "body",
  birth: "birth", food: "food", cover: "cover", color: "color"
};
const VALUE_SETS = {
  continent: CONTINENTS, country: COUNTRIES, habitat: HABITATS, body: BODIES,
  birth: BIRTHS, food: FOODS, cover: COVERS, color: COLORS
};

/* ── Cache-busting version consistency ──────────────────────────────
   Every local asset reference (index.html, inter-module imports and the
   css url()s) must carry the same ?v= — a partial bump would serve a
   mix of stale and new files to a phone on a plain reload. */
const jsFiles = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? jsFiles(join(dir, e.name))
    : e.name.endsWith(".js") ? [join(dir, e.name)] : []);

{
  const sources = [
    ["index.html", readFileSync(join(APP_DIR, "index.html"), "utf8")],
    ["css/styles.css", readFileSync(join(APP_DIR, "css", "styles.css"), "utf8")],
    ...jsFiles(join(APP_DIR, "js")).map((f) => [relative(APP_DIR, f), readFileSync(f, "utf8")])
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
   German is the reference. Every other language carries exactly the
   same keys with the same placeholders, or a screen falls back to
   German mid-sentence without anyone noticing. */
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
  check("a language ships for every code in LANGUAGES",
    LANGUAGES.every((l) => TABLES[l.code]), LANGUAGES.map((l) => l.code).join(","));
}

/* ── Fact table ─────────────────────────────────────────────────────
   Every field holds a value from its own list, every value carries a
   label in every language, and every listed value is actually used —
   an unused value is either a typo or dead weight. */
{
  const problems = [];
  const ids = new Set();
  for (const animal of ANIMALS) {
    if (ids.has(animal.id)) problems.push(`${animal.id} duplicate id`);
    ids.add(animal.id);
    for (const lang of LANGUAGES) {
      const name = animal.name[lang.code];
      if (typeof name !== "string" || name.length < 2) problems.push(`${animal.id} has no ${lang.code} name`);
      else if (!/^[A-Z]$/.test(letterOf(animal, lang.code))) {
        problems.push(`${animal.id} starts with ${letterOf(animal, lang.code)} in ${lang.code}`);
      }
    }
  }
  for (const [set, values] of Object.entries(VALUE_SETS)) {
    const field = FIELD_OF_SET[set];
    for (const value of values) {
      for (const [code, table] of Object.entries(TABLES)) {
        if (!table[valueKey(set, value)]) problems.push(`${code} has no ${valueKey(set, value)}`);
      }
      if (!ANIMALS.some((a) => a[field] === value)) problems.push(`${set} value ${value} is never used`);
    }
    for (const animal of ANIMALS) {
      if (!values.includes(animal[field])) problems.push(`${animal.id}.${field} = ${animal[field]} is off the list`);
    }
  }
  for (const clue of CLUES) {
    for (const [code, table] of Object.entries(TABLES)) {
      if (!table[clueLabelKey(clue.id)]) problems.push(`${code} has no ${clueLabelKey(clue.id)}`);
    }
  }
  check(`all ${ANIMALS.length} animals carry a complete, labelled fact row`,
    problems.length === 0, problems.slice(0, 8).join(" | "));
  check("the clue ladder has nine steps", CLUE_COUNT === 9, String(CLUE_COUNT));
}

/* ── Names ──────────────────────────────────────────────────────────
   Two animals must never answer to the same spelling in one language,
   or a typed guess is right for the wrong animal. And no two animals in
   a letter may look identical through all nine clues, or the last clue
   still leaves a coin toss. */
{
  const problems = [];
  for (const lang of LANGUAGES) {
    const byForm = new Map();
    const byClues = new Map();
    for (const animal of ANIMALS) {
      for (const form of acceptedForms(animal, lang.code)) {
        if (byForm.has(form)) problems.push(`${lang.code}: "${form}" answers for ${byForm.get(form)} and ${animal.id}`);
        byForm.set(form, animal.id);
      }
      const vector = [
        letterOf(animal, lang.code), secondLetterOf(animal, lang.code),
        ...CLUES.filter((c) => c.field).map((c) => animal[c.field])
      ].join("|");
      if (byClues.has(vector)) problems.push(`${lang.code}: ${byClues.get(vector)} and ${animal.id} share every clue`);
      byClues.set(vector, animal.id);
    }
  }
  check("no two animals share a spelling or a full clue row", problems.length === 0,
    problems.slice(0, 6).join(" | "));

  // The umlaut a child cannot reach on a keyboard must never cost them
  // the answer, and a listed alternative name has to be accepted.
  const kangaroo = ANIMALS.find((a) => a.id === "kaenguru");
  check("umlauts are forgiving in a typed guess",
    matchesName(kangaroo, "de", "Kaenguru") && matchesName(kangaroo, "de", "kanguru")
    && matchesName(kangaroo, "de", "KÄNGURU"));
  const whale = ANIMALS.find((a) => a.id === "wal");
  check("a listed alternative name is accepted", matchesName(whale, "de", "Blauwal"));
  check("a wrong name is still wrong", !matchesName(whale, "de", "Wolf"));
  const roe = ANIMALS.find((a) => a.id === "reh");
  check("spaces and case fall away", matchesName(roe, "en", "  roe   DEER "));
}

/* ── Alphabet coverage ──────────────────────────────────────────────
   Every letter that holds animals must hold enough of them for the
   round the settings can ask for, or say plainly that it holds none. */
{
  const report = [];
  const empty = { de: [], en: [] };
  for (const lang of LANGUAGES) {
    for (const letter of ALPHABET) {
      const n = ANIMALS.filter((a) => letterOf(a, lang.code) === letter).length;
      if (!n) empty[lang.code].push(letter);
    }
    report.push(`${lang.code}: ${26 - empty[lang.code].length}/26`);
  }
  check("the alphabet is covered in every language, gaps named", true, report.join(", "));
  console.log(`      empty letters — de: ${empty.de.join(",") || "none"} | en: ${empty.en.join(",") || "none"}`);
  check("at most one letter is empty per language",
    empty.de.length <= 1 && empty.en.length <= 1,
    `de ${empty.de.join(",")} / en ${empty.en.join(",")}`);
}

/* ── XP and levels ──────────────────────────────────────────────────
   XP rewards guessing early, which is harder, and never speed. A
   revealed animal still pays: effort counts. */
{
  check("an early guess is worth more than a late one",
    xpForAnimal({ solved: true, clues: 1 }) > xpForAnimal({ solved: true, clues: CLUE_COUNT }));
  check("every clue used still earns the base",
    xpForAnimal({ solved: true, clues: CLUE_COUNT }) === SOLVE_BASE);
  check("a revealed animal still earns something",
    xpForAnimal({ solved: false, clues: 3 }) === REVEAL_XP && REVEAL_XP > 0);
  check("levels only ever climb", LEVELS.every((l, i) => i === 0 || l.xp > LEVELS[i - 1].xp));
  check("the first level starts at zero XP", levelFor(0).number === 1);
  check("the top level keeps counting past its threshold",
    levelFor(LEVELS[LEVELS.length - 1].xp + 5000).number === LEVELS.length);
  // GAMIFICATION.md: the second level should land inside a first sitting.
  const perRound = 3 * xpForAnimal({ solved: true, clues: 3 });
  check("the second level is reachable in a first sitting",
    LEVELS[1].xp <= perRound * 3, `${LEVELS[1].xp} XP vs ${perRound} per round`);
  check("every medal names a real icon and a growing goal",
    MEDALS.every((m) => m.goal > 0 && typeof m.count === "function"));
}

/* ── Static server ──────────────────────────────────────────────── */

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2"
};

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(req.url.split("?")[0]);
  try {
    const body = await readFile(join(APP_DIR, path === "/" ? "/index.html" : path));
    res.writeHead(200, { "Content-Type": TYPES[extname(path)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404).end("not found");
  }
});
await new Promise((resolve) => server.listen(PORT, resolve));

mkdirSync(SHOTS_DIR, { recursive: true });

const PIXEL = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64");

const browser = await chromium.launch({ executablePath: CHROMIUM });

const consoleErrors = [];
async function newPage({ width = 390, height = 900 } = {}) {
  const context = await browser.newContext({ viewport: { width, height } });
  // The flag images are the one external request the app makes, and the
  // test machine has no reason to reach the internet. Serving a real
  // (if tiny) image keeps a network failure from being read as an app
  // error — and it has to decode, because a flag that fails to load
  // takes itself off the page.
  await context.route("https://flagcdn.com/**", (route) =>
    route.fulfill({ status: 200, contentType: "image/png", body: PIXEL }));
  const page = await context.newPage();
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
  page.on("pageerror", (e) => consoleErrors.push(String(e)));
  await page.goto(URL);
  await page.waitForSelector(".shell");
  return page;
}

// The view fades in, so a screenshot taken the same tick catches it
// half-transparent. Waiting out the transition keeps the evidence
// readable.
async function shot(page, name) {
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(SHOTS_DIR, `${name}.png`), fullPage: true });
}

/* ── Reading the board ──────────────────────────────────────────── */

// The clue rows carry labels, not ids, so the test reads them back
// through the same string table the app rendered them from. Nine rows
// identify exactly one animal; the content checks above guarantee it.
function reverseMap(set, lang) {
  const map = new Map();
  for (const value of VALUE_SETS[set]) map.set(TABLES[lang][valueKey(set, value)], value);
  return map;
}

async function currentAnimal(page, lang) {
  const values = await page.$$eval(".clue .clue-value", (nodes) =>
    nodes.map((n) => n.textContent.trim()));
  let pool = ANIMALS.slice();
  values.forEach((text, i) => {
    const clue = CLUES[i];
    if (!clue) return;
    if (!clue.field) {
      pool = pool.filter((a) => secondLetterOf(a, lang) === text);
      return;
    }
    const value = reverseMap(clue.set, lang).get(text);
    pool = pool.filter((a) => a[clue.field] === value);
  });
  return pool.length === 1 ? pool[0] : null;
}

// Option labels are matched exactly: "Ameise" is a substring of
// "Ameisenbär", so a contains-match would tap the wrong animal.
async function optionNames(page) {
  return page.$$eval('[data-action="choose"]', (nodes) => nodes.map((n) => n.textContent.trim()));
}

async function clickOption(page, name) {
  const names = await optionNames(page);
  const index = names.indexOf(name);
  if (index < 0) throw new Error(`no option named ${name} among ${names.join(", ")}`);
  await page.locator('[data-action="choose"]').nth(index).click();
}

async function revealAllClues(page) {
  while (await page.locator('[data-action="next-clue"]').count()) {
    await page.click('[data-action="next-clue"]');
  }
}

async function seed(page, patch) {
  await page.evaluate((p) => {
    const raw = localStorage.getItem("tierraten.state");
    const state = raw ? JSON.parse(raw) : {};
    localStorage.setItem("tierraten.state", JSON.stringify({ ...state, ...p }));
  }, patch);
  await page.reload();
  await page.waitForSelector(".shell");
}

const readState = (page) => page.evaluate(() => JSON.parse(localStorage.getItem("tierraten.state")));

/* ── Home ───────────────────────────────────────────────────────── */
{
  const page = await newPage();
  check("the home screen opens on the app title",
    (await page.locator(".app-header h1").textContent()).trim() === TABLES.de.appTitle);
  check("the alphabet grid shows all 26 letters",
    await page.locator(".letter-tile").count() === 26);
  check("a letter with no animal is not a button",
    await page.locator(".letter-tile-empty").count() === 1
    && await page.locator("button.letter-tile-empty").count() === 0);
  check("the alphabet walk starts at A",
    (await page.locator('.panel [data-action="start-letter"]').getAttribute("data-letter")) === "A");
  check("the storage note names the device",
    (await page.locator(".app-footer .hint").textContent()).includes("Gerät"));
  await shot(page, "01-home-de");
  await page.close();
}

/* ── A choose-mode round, with a wrong guess on the way ─────────── */
{
  const page = await newPage();
  await page.click('.panel [data-action="start-letter"]');
  await page.waitForSelector(".clue-list");

  check("a round opens on the first clue and nothing else",
    await page.locator(".clue").count() === 1);
  check("the first clue is the continent",
    (await page.locator(".clue-label").first().textContent()).trim() === TABLES.de.clueKontinentLabel);
  check("the round names which animal of how many",
    (await page.locator(".instruction").first().textContent()).includes("1"));
  check(`choose mode offers ${OPTION_COUNT} names`,
    await page.locator('[data-action="choose"]').count() === OPTION_COUNT);
  await shot(page, "02-round-first-clue");

  await page.click('[data-action="next-clue"]');
  await page.click('[data-action="next-clue"]');
  check("each clue adds one row", await page.locator(".clue").count() === 3);
  check("the country clue shows a flag image", await page.locator(".clue .flag").count() === 1);

  await revealAllClues(page);
  check("the ladder stops at the last clue", await page.locator(".clue").count() === CLUE_COUNT);
  check("the next-clue button is gone once every clue is out",
    await page.locator('[data-action="next-clue"]').count() === 0);
  await shot(page, "03-round-all-clues");

  const animal = await currentAnimal(page, "de");
  check("the clue rows identify exactly one animal", animal !== null);

  // A wrong name first: the game has to stay playable and stay kind.
  const wrongName = (await optionNames(page)).find((n) => n !== nameOf(animal, "de"));
  await clickOption(page, wrongName);
  check("a wrong guess is marked without ending the turn",
    await page.locator(".feedback-danger").count() === 1
    && await page.locator('[data-action="choose"]').count() === OPTION_COUNT);
  check("the wrong name is named back",
    (await page.locator(".feedback-danger").textContent()).includes(wrongName));
  await shot(page, "04-round-wrong-guess");

  await clickOption(page, nameOf(animal, "de"));
  check("the right name is confirmed at once",
    await page.locator(".feedback-success").count() === 1);
  check("the name joins the clue list", await page.locator(".clue-name").count() === 1);
  check("the answer options are gone once the animal is found",
    await page.locator('[data-action="choose"]').count() === 0);
  await shot(page, "05-round-solved");

  const stored = await readState(page);
  check("the solve is written to the device", stored.animals[animal.id].solved === 1);
  check("both guesses are counted, right and wrong", stored.game.guesses === 2);

  // Play the rest of the round out.
  while (await page.locator('[data-action="next-animal"]').count()) {
    await page.click('[data-action="next-animal"]');
    if (!await page.locator('[data-action="choose"]').count()) break;
    await revealAllClues(page);
    const next = await currentAnimal(page, "de");
    await clickOption(page, nameOf(next, "de"));
  }
  check("the round ends on a summary", await page.locator(".reward-xp").count() === 1);
  check("the summary lists every animal of the round",
    await page.locator(".result").count() === ROUND_SIZES[0]);
  check("the reward names XP gained",
    (await page.locator(".reward-xp").textContent()).includes("+"));
  check("the summary offers the next letter",
    (await page.locator('[data-action="start-letter"]').getAttribute("data-letter")) === "B");
  await shot(page, "06-round-done");

  const after = await readState(page);
  check("XP was added once for the round", after.game.xp > 0);
  check("the round is counted", after.game.rounds === 1);
  check("the first medals are unlocked", after.game.medals.includes("erstes-tier"));
  await page.close();
}

/* ── An unreachable flag leaves no broken image ─────────────────── */
{
  const context = await browser.newContext({ viewport: { width: 390, height: 900 } });
  await context.route("https://flagcdn.com/**", (route) => route.abort());
  const page = await context.newPage();
  page.on("pageerror", (e) => consoleErrors.push(String(e)));
  await page.goto(URL);
  await page.waitForSelector(".shell");
  await page.click('.panel [data-action="start-letter"]');
  await page.waitForSelector(".clue-list");
  await page.click('[data-action="next-clue"]');
  await page.waitForFunction(() => !document.querySelector(".clue .flag"));
  check("a flag that cannot load takes itself off the page",
    await page.locator(".clue .flag").count() === 0
    && (await page.locator(".clue").nth(1).textContent()).includes("Zum Beispiel"));
  await shot(page, "18-round-no-flag");
  await context.close();
}

/* ── Reveal ─────────────────────────────────────────────────────── */
{
  const page = await newPage();
  await page.click('.panel [data-action="start-letter"]');
  await page.waitForSelector(".clue-list");
  await page.click('[data-action="reveal"]');
  check("showing the answer puts every clue and the name on screen",
    await page.locator(".clue").count() === CLUE_COUNT + 1
    && await page.locator(".clue-name").count() === 1);
  check("showing the answer is not marked as a mistake",
    await page.locator(".feedback-danger").count() === 0
    && await page.locator(".feedback-info").count() === 1);
  const stored = await readState(page);
  const revealed = Object.values(stored.animals).filter((a) => a.revealed > 0).length;
  check("a shown animal is not recorded as guessed", revealed === 1
    && Object.values(stored.animals).every((a) => a.solved === 0));
  await shot(page, "07-round-revealed");
  await page.close();
}

/* ── Typing mode ────────────────────────────────────────────────── */
{
  const page = await newPage();
  await page.click('[data-action="nav-settings"]');
  await page.click('[data-action="set-answer"][data-mode="type"]');
  check("the chosen answer mode is marked for a screen reader",
    await page.getAttribute('[data-action="set-answer"][data-mode="type"]', "aria-pressed") === "true");
  await shot(page, "08-settings-de");
  await page.click('[data-action="nav-back"]');
  await page.click('.panel [data-action="start-letter"]');
  await page.waitForSelector(".clue-list");

  check("typing mode shows a field and no name list",
    await page.locator("#guess").count() === 1 && await page.locator('[data-action="choose"]').count() === 0);
  check("the field says that it checks itself (WCAG 3.2.2)",
    (await page.locator(".guess-field .hint").textContent()).trim() === TABLES.de.roundGuessAdvice);
  check("the result region is a status region (WCAG 4.1.3)",
    await page.locator('.feedback[role="status"]').count() === 1);

  await revealAllClues(page);
  const animal = await currentAnimal(page, "de");
  const name = nameOf(animal, "de");

  // A wrong word is judged only when the child says they are done, so a
  // half-typed name is never thrown back at them.
  await page.fill("#guess", "Xyz");
  check("a half-typed guess is left alone", await page.locator(".feedback-danger").count() === 0);
  await page.click('[data-action="check"]');
  check("a checked wrong guess is marked", await page.locator(".feedback-danger").count() === 1);
  check("the field keeps what was written", await page.inputValue("#guess") === "Xyz");
  await shot(page, "09-type-wrong");

  // The known-length pattern: the right name locks in on the last
  // character, with no button in between.
  await page.fill("#guess", "");
  await page.locator("#guess").pressSequentially(name.slice(0, -1), { delay: 5 });
  check("nothing fires before the last character",
    await page.locator(".feedback-success").count() === 0);
  await page.locator("#guess").pressSequentially(name.slice(-1), { delay: 5 });
  await page.waitForSelector(".feedback-success");
  check("the last character checks the whole name at once",
    await page.locator(".feedback-success").count() === 1
    && await page.locator(".clue-name").count() === 1);
  check("the field is gone once the name is right", await page.locator("#guess").count() === 0);
  await shot(page, "10-type-solved");
  await page.close();
}

/* ── Persistence and reset ──────────────────────────────────────── */
{
  const page = await newPage();
  await seed(page, {
    settings: { language: "de", answerMode: "choose", roundSize: 3 },
    animals: { loewe: { solved: 2, revealed: 0, bestClues: 2 } },
    game: { xp: 200, guesses: 12, rounds: 4, cleanRuns: 1, cleanSize: 3, medals: [] }
  });
  check("XP survives a reload",
    (await page.locator(".stats-xp").textContent()).includes("200"));
  check("the level follows the XP",
    (await page.locator(".stats-level").textContent()).includes(TABLES.de[levelFor(200).key]));
  const lTile = page.locator('.letter-tile[data-letter="L"] .letter-tile-sub');
  check("a solved animal shows on its letter", (await lTile.textContent()).includes("1/"));

  await page.click('[data-action="nav-medals"]');
  check("every medal is listed, locked ones included",
    await page.locator(".medal").count() === MEDALS.length);
  check("medals earned by the stored counters are marked",
    await page.locator(".medal-earned").count() >= 2);
  check("a locked medal still shows its goal",
    (await page.locator(".medal:not(.medal-earned) .medal-state").first().textContent()).includes(TABLES.de.medalsLocked));
  await shot(page, "11-medals-de");
  await page.click('[data-action="nav-back"]');

  page.on("dialog", (d) => d.accept());
  await page.click('[data-action="reset-all"]');
  await page.waitForFunction(() => !document.querySelector(".stats-xp").textContent.includes("200"));
  const after = await readState(page);
  check("reset clears progress", after.game.xp === 0 && Object.keys(after.animals).length === 0);
  check("reset keeps the settings", after.settings.language === "de" && after.settings.roundSize === 3);
  await page.close();
}

/* ── The longer round is offered, never forced ──────────────────── */
{
  const page = await newPage();
  await seed(page, {
    settings: { language: "de", answerMode: "choose", roundSize: 3 },
    animals: {},
    game: { xp: 300, guesses: 20, rounds: 4, cleanRuns: MASTERY_RUNS - 1, cleanSize: 3, medals: [] }
  });
  // A letter with a single animal keeps the run short; the mastery
  // streak does not care how long a round was, only that nothing in it
  // had to be shown.
  const lone = ALPHABET.find((L) => ANIMALS.filter((a) => letterOf(a, "de") === L).length === 1);
  await page.click(`.letter-tile[data-letter="${lone}"]`);
  await page.waitForSelector(".clue-list");
  await revealAllClues(page);
  await clickOption(page, nameOf(await currentAnimal(page, "de"), "de"));
  await page.click('[data-action="next-animal"]');
  await page.waitForSelector(".reward-xp");

  check("a clean streak offers the longer round",
    (await page.locator(".suggest").count()) === 1);
  check("the offer is a suggestion, not a change",
    (await readState(page)).settings.roundSize === 3);
  await shot(page, "15-suggest-longer-round");

  await page.click('[data-action="accept-size"]');
  const after = await readState(page);
  check("accepting the offer saves the longer round and starts it",
    after.settings.roundSize === 5 && after.game.cleanRuns === 0
    && await page.locator(".clue-list").count() === 1);
  await page.close();
}

/* ── Desktop ────────────────────────────────────────────────────── */
{
  const page = await newPage({ width: 1280, height: 900 });
  await shot(page, "16-home-desktop");
  await page.click('.panel [data-action="start-letter"]');
  await page.waitForSelector(".clue-list");
  await page.click('[data-action="next-clue"]');
  await page.click('[data-action="next-clue"]');
  await shot(page, "17-round-desktop");
  // Everything on the round screen must be reachable by keyboard.
  const stops = [];
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    stops.push(await page.evaluate(() => {
      const el = document.activeElement;
      return el ? `${el.tagName}:${el.dataset.action || ""}` : "none";
    }));
  }
  check("every control on a round is reachable by keyboard",
    stops.includes("BUTTON:next-clue") && stops.includes("BUTTON:choose")
    && stops.includes("BUTTON:reveal") && stops.includes("BUTTON:nav-back"),
    stops.join(" "));
  await page.close();
}

/* ── Language ───────────────────────────────────────────────────── */
{
  const page = await newPage();
  await page.click('[data-action="nav-settings"]');
  await page.click('[data-action="set-lang"][data-lang="en"]');
  check("the document language follows the setting",
    await page.evaluate(() => document.documentElement.lang) === "en");
  await page.click('[data-action="nav-back"]');
  check("the interface is in the chosen language",
    (await page.locator(".app-header h1").textContent()).trim() === TABLES.en.appTitle);

  // The alphabet is a different walk in each language, because the names
  // are. This is the point of deriving the letter from the name.
  const differs = ALPHABET.find((L) =>
    ANIMALS.filter((a) => letterOf(a, "de") === L).length
    !== ANIMALS.filter((a) => letterOf(a, "en") === L).length);
  const enCount = ANIMALS.filter((a) => letterOf(a, "en") === differs).length;
  const tile = await page.locator(`.letter-tile[data-letter="${differs}"] .letter-tile-sub`).textContent();
  check("the letter counts follow the language", Boolean(differs) && tile.includes(`/${enCount}`),
    `${differs}: ${tile.trim()} (en ${enCount})`);
  await shot(page, "12-home-en");

  await page.click('.panel [data-action="start-letter"]');
  await page.waitForSelector(".clue-list");
  await revealAllClues(page);
  const animal = await currentAnimal(page, "en");
  check("an English round names its animals in English", animal !== null
    && (await optionNames(page)).includes(nameOf(animal, "en")));
  await shot(page, "13-round-en");

  const labels = await page.$$eval(".clue-label", (n) => n.map((x) => x.textContent.trim()));
  check("no German label is left on an English screen",
    labels.every((l) => Object.values(TABLES.en).includes(l)), labels.join(" | "));
  await page.close();
}

/* ── Narrow viewport ────────────────────────────────────────────── */
{
  for (const lang of LANGUAGES) {
    const page = await newPage({ width: 360, height: 780 });
    await page.evaluate((code) => {
      localStorage.setItem("tierraten.state", JSON.stringify({
        settings: { language: code, answerMode: "choose", roundSize: 5 },
        animals: {}, game: { xp: 0, guesses: 0, rounds: 0, cleanRuns: 0, cleanSize: 5, medals: [] }
      }));
    }, lang.code);
    await page.reload();
    await page.waitForSelector(".shell");

    const views = [];
    const fits = async (name) => {
      const over = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (over > 0) views.push(`${name} +${over}px`);
    };
    await fits("home");
    await page.click('[data-action="nav-medals"]');
    await fits("medals");
    await page.click('[data-action="nav-back"]');
    await page.click('[data-action="nav-settings"]');
    await fits("settings");
    await page.click('[data-action="nav-back"]');
    await page.click('.panel [data-action="start-letter"]');
    await page.waitForSelector(".clue-list");
    await revealAllClues(page);
    await fits("round");
    if (lang.code === "de") await shot(page, "14-round-narrow-de");
    check(`nothing overflows a 360px screen in ${lang.code}`, views.length === 0, views.join(", "));
    await page.close();
  }
}

/* ── Console ────────────────────────────────────────────────────── */

check("no console errors anywhere in the run", consoleErrors.length === 0,
  consoleErrors.slice(0, 3).join(" | "));

await browser.close();
server.close();

console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
