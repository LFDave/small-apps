# Wortwerkstatt — PRD

Single source of truth for behavior. Update this file in the same
change as any behavior change.

## Goal

Kids practise writing correctly: the orthography rules of Lehrplan 21,
one rule at a time. The method is rule discrimination (choosing between
spellings that sound identical), retrieval practice (writing a word
from memory instead of copying it) and a rule explanation that appears
exactly when it explains something, which is after the answer is in.

Follows the repo baseline (PRODUCT.md and DESIGN.md at the repo root):
dark-only token system, blue accent family, Atkinson Hyperlegible
self-hosted, Lucide icons inlined.

## Scope

1. **Zyklen** — the three Lehrplan 21 cycles as a setting; each holds
   its own set of rules.
2. **Regel-Runden** — a round of six tasks from one rule.
3. **Gemischte Übung** — a round of six tasks across every rule of the
   current cycle.
4. **Merkwörter** — words studied and then written from memory.
5. **Quiet gamification** — XP, levels and medals that reward practice,
   never speed or perfection.
6. **Einstellungen** — interface language, learning language, cycle.

Out of scope (possible later): spaced review scheduling, sound,
dictation of whole sentences, free writing with correction, sibling
profiles.

## Curriculum

Lehrplan 21 splits compulsory school into three cycles:

| Cycle | School years |
| --- | --- |
| 1 | 1. und 2. Klasse |
| 2 | 3. bis 6. Klasse |
| 3 | 7. bis 9. Klasse |

The brief for this app named the cycle 2 spelling competency at
`https://be.lehrplan.ch/index.php?code=a|1|11|4|6|1` and quoted it:

> Sie können dabei folgende Regeln in typischen Fällen beachten:
> sch-Schreibung, sp-/st-Schreibung, ng-Schreibung, gebräuchliche
> abstrakte Nomen gross, Satzschlusszeichen.

All five named rules ship as cycle 2 topics. The lehrplan.ch server
refuses automated requests (HTTP 403), so nothing beyond that quoted
wording and the cycle-to-school-year mapping above was read from the
source. The remaining topics are standard German orthography for the
band and are listed below so a parent or teacher can check them; they
are not presented as verbatim Lehrplan wording, and no competency codes
are claimed.

**Cycle 1 (4 rules, 32 tasks)**

| Rule | Kind | What it practises |
| --- | --- | --- |
| `nomen-gross` | sentence | concrete nouns take a capital |
| `satzanfang` | sentence | a sentence starts with a capital |
| `satzschluss-punkt` | punct | full stop or question mark |
| `merkwort-1` | memory | eight short everyday words |

**Cycle 2 (8 rules, 64 tasks)** — the five named competencies plus
three rules from the same band

| Rule | Kind | What it practises |
| --- | --- | --- |
| `sch` | word | the sch sound written with three letters |
| `sp-st` | word | sp and st where schp and scht are heard |
| `ng-nk` | word | ng against nk |
| `doppelkonsonant` | word | short vowel, doubled consonant |
| `dehnung` | word | long vowel: ie, silent h, doubled vowel |
| `abstrakte-nomen` | sentence | abstract nouns take a capital |
| `satzschluss` | punct | full stop, question mark, exclamation mark |
| `merkwort-2` | memory | eight words with tricky spellings |

**Cycle 3 (5 rules, 40 tasks)**

| Rule | Kind | What it practises |
| --- | --- | --- |
| `das-dass` | sentence | das against dass |
| `nominalisierung` | sentence | verbs and adjectives used as nouns |
| `komma` | punct | comma before a subclause, and where none belongs |
| `endung` | word | endings ig and lich |
| `fremdwort` | memory | eight loan words |

Every rule carries at least as many tasks as a round, so no task
repeats inside a round.

### Content rules

- Swiss standard German throughout: ss, never sharp s (Strasse, gross).
  The e2e suite fails on a sharp s anywhere in the strings.
- Exactly one option may produce a correct German word or sentence.
  Where two options are both real words (`singen` / `sinken`), the task
  carries a clue that decides it.
- Distractors are the mistakes children really make (`Schport`,
  `Beischpiel`), not random letters. That is the whole point of the
  sp/st rule: both spellings sound identical, so only the rule decides.
- No two tasks may read the same way while the blank is open, or one
  question would have two right answers. The e2e suite enforces this.

## Task kinds

Four kinds share one engine. Three of them are a choice between
spellings; the fourth is written from memory.

| Kind | Task shape | Answer |
| --- | --- | --- |
| `word` | letter group missing inside a word: `Bei ··· iel` | choice |
| `sentence` | one word missing from a sentence | choice |
| `punct` | a mark missing, joined without a space | choice |
| `memory` | study the word, then write it | typed |

`round.js` owns the spacing rules in one function, `fillTask`. Word
fragments are glued together, an end-of-sentence mark sits tight
against the sentence, a following clause keeps its space. The rendered
blank and the solution text both come from that function, so they can
never disagree about a space.

## Round

- A round is six tasks (`ROUND_SIZE`). A rule round draws from one
  rule; a mixed round draws round robin across every rule of the
  cycle, so six tasks spread over the rules instead of landing three
  times in the same one.
- Option order is shuffled per task, so the answer never sits in the
  same place twice.
- Step dots show the position in the round.

### Input model

- **Choice tasks**: large option buttons, no confirm step. A single
  punctuation mark gets display size, or a comma disappears in a button
  built for words. The empty option of the comma rule renders as
  "kein Komma", never as a blank button.
- **Memory tasks**: two steps. The word is shown ("Schau dir das Wort
  gut an."), then hidden, then written into a text field. The field is
  capped at the word length and checks itself the moment the last
  letter lands, the known-length pattern from PRODUCT.md. A visible
  advisory line announces that before the field is used ("Beim letzten
  Buchstaben siehst du sofort, ob es stimmt.", WCAG 3.2.2 On Input).
  The whole word is evaluated, never a letter at a time. The field is
  set to `autocapitalize="none"` and `spellcheck="false"`: capitals are
  part of the lesson, and a browser must not spell it for the child.
  Typing does not re-render, so the caret and the focus stay put.

### Feedback

Persistent until the child moves on, never "Falsch".

- Correct: "Richtig.", the solution fills the blank in the success
  tone, and a Weiter button appears.
- Wrong: the chosen answer stays visible in the blank with a line
  through it, wrong letters of a written word are marked by colour and
  an underline, "Fast. Schau die Regel an und versuch es nochmals." and
  a retry. From the second miss on the same task, an extra option shows
  the solution (`reveal`); afterwards practice continues with the miss
  counter reset, while the task still counts as corrected.
- **The rule text appears only after an answer**, in a quiet box under
  the task. Before the answer it would be a lookup table; after it, it
  explains what just happened.

### Completion

- "{k} von {n} Aufgaben hast du direkt gewusst." plus a per-task list
  showing every solution with a gewusst/geübt tag.
- Quiet reward block: XP gained, level reached, medals unlocked.

## Progress and status

- Every rule the round drew from is credited, so mixed practice moves
  the rule cards too. A rule counts as clean for that round only when
  all of its tasks in the round were right first time.
- Status from the stored counters: 0 rounds = Neu, 1+ rounds = Geübt,
  3+ clean rounds = Sitzt!

## Gamification (quiet)

XP measures practice, not perfection: mistakes never subtract XP,
retries cost nothing, and speed never matters.

- **XP per round**: 5 for finishing, 2 per answer right first time,
  1 per corrected answer, plus 2 per cycle step because the later
  cycles are harder. A clean cycle 2 round is 19 XP.
- **Levels** (cumulative XP): 1 Schreiblehrling 0, 2 Wortsammler 30,
  3 Satzbauer 80, 4 Regelprofi 160, 5 Schreibprofi 280,
  6 Meisterfeder 450. Beyond the last level XP keeps counting. The
  titles are string ids, so they translate with the rest of the UI.
- **Medals** (9, every check a pure function of the stored data):
  Erste Runde / Dranbleiber / Wortarbeiter / Werkstattmeister at 1, 3,
  8 and 21 finished rounds; Regelfest when a rule reaches 3 clean
  rounds; Rundum when every rule of the **currently selected cycle**
  has been practised at least once; Wortschmied at 400 typed letters
  (effort medal, counts the tries that missed); Blitzmerker at 20
  memory words written from memory; Zyklusreise after practising in
  all three cycles.
- **Display**: a stats strip on home (level badge, title, progress bar,
  medal count) opens the medal gallery; locked medals stay visible with
  their description so the goal is clear. Rewards appear only on the
  completion panel as a quiet block, with no modal and no celebration
  motion.
- **Counters** stored under `game`: `xp`, `rounds`, `charsTyped`
  (every letter typed into an answer field), `memoryWords` (words
  written correctly from memory), `cleanCycle`/`cleanCount` (the
  clean-run streak), `cycles` (which cycles have been practised),
  `medals`. Reset clears them.

## Adaptive difficulty

- A round is clean when it finished without a single wrong answer.
- After five consecutive clean rounds in the current cycle, the
  completion panel suggests the next one ("Das klappt richtig gut.
  Probier Zyklus 3!") and offers a one-tap action that switches the
  setting and starts a mixed round in it immediately.
- A round with mistakes resets the streak silently. No message, no lost
  progress, full XP: struggling at a cycle is practising, not failing.
- The app never steps down on its own, and never locks a cycle behind
  progression. Any cycle is one tap away in the settings, which also
  resets the streak.

## Settings

Follows the shared settings pattern in the repo PRODUCT.md.

- Entry point: a gear button in the home header (`nav-settings`).
- Own view with a back button. One panel per setting, each with a short
  heading and one line saying what it changes.
- Options are a choice grid with `aria-pressed`; the selected one gets
  an accent border. No save button, no confirm, no toast: a change
  applies and is written to localStorage at once.
- Panel order: **Sprache** first, then **Lernsprache** (see below),
  then **Zyklus**.
- Defaults: German interface, German learning language, cycle 2. Cycle
  2 is the default because it covers the widest band and holds the
  rules the brief named; cycles 1 and 3 are one tap away.
- Reset is not in settings. It stays in the home footer with its
  confirmation, clears progress and keeps every setting.

## Languages

Two dimensions, deliberately separate.

**Interface language** — German (default, Swiss standard German) and
English. One table per language in `js/i18n/<code>.js`, keyed by the
same stable ids. German is the reference and the fallback; `t()`
returns the key id when a key is missing, so a hole is visible rather
than silently German. `document.documentElement.lang` follows the
setting. The e2e suite enforces identical keys, identical
`{placeholders}`, no sharp s, and that no raw key id reaches the screen
in either language.

**Learning language** — the language whose orthography is practised.
One content pack per language in `js/content/<code>.js`. The app ships
German. Every code path is generic, so a second pack drops in by adding
a file and registering it in `data.js`. The setting is stored and used
either way; its settings panel appears with the second pack, because a
panel that offers no choice is noise.

**Where the split runs.** Rule titles and rule explanations live in the
interface tables, so an English-speaking child gets the German sp/st
rule explained in English. The practice material itself (words,
sentence frames, clues) stays in the language it teaches, because you
cannot teach German end-of-sentence marks with English sentences. Every
element carrying that material is marked with the content pack's
language (WCAG 3.1.2 Language of Parts), so a screen reader switches
voice for it.

Adding a content pack means adding its topic title and rule ids to
every interface table. Topic ids are unique across packs for that
reason.

## Screens

1. **Home** — header with the app title and the settings button, stats
   strip, "Üben" panel (which cycle, mixed practice button, what a
   round is), rule cards (icon, title, rounds practised, status pill),
   storage note and reset link.
2. **Einstellungen** — Sprache, optional Lernsprache, Zyklus.
3. **Runde** — back, rule title, step dots, instruction, task panel,
   options or the writing field, rule box after the answer, persistent
   feedback area, actions.
4. **Abschluss** — completion feedback, reward block, optional cycle
   suggestion, per-task summary, actions.
5. **Medaillen** — level panel with progress bar plus the medal grid,
   reached from the home stats strip.

## Persistence and privacy

- Everything in `localStorage` under `wortwerkstatt.state`: `settings`
  (`language`, `contentLanguage`, `cycle`), `topics` (per rule:
  `rounds`, `clean`) and `game`. No accounts, no analytics, no cookies.
- Loading sanitises every field: an unknown language, an unknown cycle
  or a negative counter falls back to the default, and progress stored
  for a rule that no longer exists is kept without breaking anything.
  When the loaded state does not serialise back to what was stored, the
  normalised state is written once, so a migration runs once instead of
  on every load. A first-time visitor is never written to before they
  act.
- Reset confirms first and says the data lives on the device.
- **No external requests at all.** Fonts and icons ship with the app,
  so it keeps working offline after the first load.

## Design

- Tokens copied from the repo root `DESIGN.md` into `css/styles.css`
  custom properties. Dark only. Accent family: **blue** (recorded in
  the `PRODUCT.md` app registry). Blue was chosen over amber, sage and
  coral because those sit close to the warning, success and danger
  tones this app shows constantly; the accent has to stay clearly
  distinct from "you got it wrong".
- Atkinson Hyperlegible (self-hosted woff2, 400/700) for everything.
  It was designed to keep similar letterforms apart, which is the
  entire job on a spelling screen.
- Lucide icons inlined as SVG (`js/icons.js`, generated from
  lucide-static).
- Motion: opacity and transform only, 120 to 240 ms, reduced-motion
  disables it.
- Targets: option buttons 3.5rem tall, every other control at least
  2.75rem.
- Accessibility (WCAG 2.1 AA): auto-check is announced before use
  (SC 3.2.2), results are announced through the persistent feedback
  area with `role="status"` instead of a forced focus jump (SC 4.1.3),
  no time limits are involved (SC 2.2.1), wrong answers are identified
  in text and by shape as well as colour (SC 1.4.1, SC 3.3.1), and the
  practice material is marked with its own language (SC 3.1.2). The
  open blank carries an `aria-label` so it is announced as a gap rather
  than as three middle dots.

## Structure

- `index.html`, `css/styles.css`, `fonts/`, `js/`:
  `data.js` (registries, no copy), `i18n.js` (`t`, `setLanguage`,
  fallback), `i18n/de|en.js` (string tables), `content/de.js` (the
  curriculum), `util.js` (shuffle, escaping, status), `storage.js`
  (persistence and sanitising), `round.js` (round building, spacing and
  checking, no DOM), `game.js` (XP, levels, medals, no DOM and no
  copy), `ui.js` (rendering), `app.js` (state and events), `icons.js`.
- Cache busting: every local asset URL carries the same `?v=N`
  (stylesheet link, script tag, inter-module imports, font urls).
  Bump N in all files on every release; the e2e suite enforces
  consistency and walks `js/` recursively. Current: `?v=1`.
- Tests: `tests/e2e.test.mjs` (Playwright, self-contained static
  server, no python dependency). The expected answers are derived from
  the content pack through `round.js`, the module the app renders from,
  so the tests cannot drift from the engine.
