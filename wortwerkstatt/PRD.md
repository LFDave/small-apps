# Wortwerkstatt — PRD

Single source of truth for behavior. Update this file in the same
change as any behavior change.

## Goal

Kids practise writing correctly: the orthography rules of Lehrplan 21,
one rule at a time, from recognising a rule to writing it themselves.
The method is rule discrimination (choosing between spellings that
sound identical), retrieval practice (writing from memory instead of
copying), and a rule explanation that appears exactly when it explains
something, which is after the answer is in.

Follows the repo baseline (PRODUCT.md and DESIGN.md at the repo root):
dark-only token system, blue accent family, Atkinson Hyperlegible
self-hosted, Lucide icons inlined.

## Source

The curriculum follows one competency of Lehrplan 21:

> **D.4 Schreiben**, aspect **F: Schreibprozess: sprachformal
> überarbeiten**, competency **D.4.F.1** — "Die Schülerinnen und
> Schüler können ihren Text in Bezug auf Rechtschreibung und Grammatik
> überarbeiten."
>
> Fachbereichslehrplan Deutsch, Kompetenzaufbau, **Kanton Bern,
> 23.06.2016**.

The edition string lives in `data.js` as `LEHRPLAN_VERSION` and is
shown on every rule view next to the step reference. **A later revision
means a new date there and a re-check of every `step` in the content
pack.** `be.lehrplan.ch` refuses automated requests (HTTP 403), so the
ladder below was read from the PDF of that edition, not from the site.

### The ladder, and which cycle each step sits in

The cycle bars in the competency table are what place a step. A step
whose bar spans a boundary belongs to **both** cycles.

| Step | Cycles | Rules named in the text |
| --- | --- | --- |
| a | 1 | lautgetreue Schreibweise, Wortgrenzen, Eigennamen und konkrete Nomen gross, Satzanfang gross, Punkt am Satzende |
| b | **1 and 2** | sch-Schreibung, sp-/st-Schreibung, ng-Schreibung, gebräuchliche abstrakte Nomen gross, Satzschlusszeichen |
| c | 2 | ie-Schreibung, e-/ä-Schreibung, Komma bei Aufzählungen |
| d | 2 | Wortstammregel, Doppelkonsonantenregel, Grossschreibung typischer abstrakter Nomen, Kommas zwischen Teilsätzen, Zeichen bei der direkten Rede |
| e | 2 | Grossschreibung abgeleiteter Nomen mit häufigen Nachmorphemen (Frei-heit, Entdeck-ung) |
| f | 3 | the same rules "inklusive wichtiger Ausnahmen" |
| g | 3 | selbstständig überarbeiten, no new rules |

Step b straddles the cycle 1 / cycle 2 boundary, so its five rules
appear on **both** cycle lists, sharing one set of progress counters.
That is why cycle 2 shows 13 rules while owning 8 of them.

### What is grounded and what is selected

Each rule carries a `step` field. Where it names a step, the rule is in
that step's text word for word, and the rule view says so. Where it is
`null`, the rule is standard orthography for the band that the document
does not spell out, and the rule view says **"Ergänzende Übung. Diese
Regel steht nicht im Lehrplan-Text."** rather than borrowing authority.

Two things are deliberately **not** implemented:

- **Zeichen bei der direkten Rede** (step d). Swiss usage sets
  guillemets («…»), which are impractical to type on the keyboards
  children use, and a choice-only version would be the one rule that
  never reaches its writing chapter.
- **Cycle 3 has no step-linked rules.** Steps f and g add exceptions
  and self-correction to rules already covered, not new rules. Cycle 3
  therefore holds standard cycle-3 orthography, all marked as extra
  practice, and a learner who wants the f-level work practises the
  cycle 2 rules, which stay one tap away.

## Curriculum

22 rules, 66 chapters, 484 tasks, plus 9 texts of 42 sentences for
the writing mode.

| Cycle | Rules on the list | Owned by the cycle |
| --- | --- | --- |
| 1 (1./2. Klasse) | 9 | 9 |
| 2 (3.–6. Klasse) | 13 | 8, plus the 5 spanning rules of step b |
| 3 (7.–9. Klasse) | 5 | 5 |

**Cycle 1** — nomen-gross (a), satzanfang (a), wortgrenzen (a),
merkwort-1 (a), satzschluss (a and b), sch (b), sp-st (b), ng-nk (b),
abstrakte-nomen (b).

**Cycle 2** — ie (c), e-ae (c), komma-aufzaehlung (c), wortstamm (d),
doppelkonsonant (d), komma-teilsatz (d), nachmorpheme (e), merkwort-2
(extra), plus the five step b rules above.

**Cycle 3** — dehnung, nominalisierung, das-dass, endung, fremdwort,
all extra practice.

### Content rules

- Exactly one option may produce a correct German word or sentence.
  Where two options are both real (`singen` / `sinken`, `Rad` / `Rat`),
  the task carries a clue that decides it.
- **A written answer must have exactly one correct spelling.** No word
  with an accepted variant may be an answer. `Biografie` was removed
  for this reason: Duden gives "Alternative Schreibung: Biographie", so
  a child writing `Biographie` would be marked wrong. Duden is the
  arbiter for any future candidate.
- The `fremdwort` rule holds Fremdwörter, words that keep foreign
  spelling or pronunciation (Rhythmus, Restaurant, Ingenieur), not
  assimilated Lehnwörter. `Adresse` and `Maschine` are Lehnwörter and
  moved to the rules they actually illustrate, `doppelkonsonant` and
  `sch`.
- Swiss standard German: ss, never sharp s.
- Every distractor is a mistake children really make (`Schport`,
  `Beischpiel`), not a random letter. That is the whole point of the
  sp/st rule: both spellings sound identical, so only the rule decides.
- No two tasks may read the same way while the blank is open, or one
  question would have two right answers. The e2e suite enforces this
  across the whole pack.

## Chapters

Every rule has three chapters. They rise in difficulty and always end
in writing, because recognition and production are different skills and
production is the harder one.

| # | Name | What changes |
| --- | --- | --- |
| 1 | Zum Aufwärmen | the rule on common words, answer by choosing |
| 2 | Schon schwieriger | rarer or longer words, answer by choosing |
| 3 | Selber schreiben | the same rule, answer by writing |

Chapters are never locked. A completion panel points at the next
chapter of the same rule, so the chapters read as a path, but any
chapter can be started at any time from the rule view.

Chapter names are shared across all rules and describe what changes,
rather than being themed. A name that tells a child what is different
is worth more than a decorative one, and the baseline keeps game chrome
quiet.

## Task kinds

Six kinds share one engine. Three are answered by choosing, three by
writing.

| Kind | Task shape | Answer |
| --- | --- | --- |
| `word` | letters missing inside a word: `Bei ··· iel` | choice |
| `sentence` | one word missing from a sentence | choice |
| `punct` | a mark missing, joined without a space | choice |
| `write` | the missing word, typed into the sentence frame | typed |
| `copy` | a whole short sentence written out correctly | typed |
| `memory` | study the word, then write it from memory | typed |
| `text` | one sentence of a text, in a paragraph taking shape | typed |

`copy` is the writing chapter of the punctuation rules, where typing a
lone "?" would be a thin exercise. It is also what makes the comma rule
work at all: "no comma" has zero length and could never trigger a
known-length check, but the same answer inside a whole sentence can.

`round.js` owns the spacing rules in one function, `fillTask`. Word
fragments are glued together, an end-of-sentence mark sits tight
against the sentence, a following clause keeps its space. The rendered
blank and the solution text both come from that function, so they can
never disagree about a space.

## Writing mode (Texte schreiben)

A second mode alongside the rules, where **nothing is tapped**. It is
the integration exercise the source competency is actually about:
D.4.F.1 is "einen **Text** sprachformal überarbeiten", not isolated
words, and no other part of the app asks for a whole text.

- Nine texts, three per cycle, 42 sentences in total. A text is 4 to 5
  sentences and names on its card which rules it pulls together.
- The text is written **one sentence at a time, in order**. A paragraph
  that shuffles is not a paragraph, so a text round is as long as the
  text rather than `ROUND_SIZE`.
- The whole text is on screen throughout: sentences already written
  show their finished form, the sentence in hand shows the draft, the
  rest wait in muted grey. Watching the paragraph take shape is what
  makes it a text rather than a pile of sentences.
- **The prompt is a draft, never a misspelling.** It is the text as
  someone would type it in a hurry: all lowercase, no punctuation, and
  otherwise exactly the letters of the answer. A child must never be
  shown a wrongly spelled word, which is why the mode exercises
  capitals, end marks and commas rather than letter spellings, and why
  `text.rules` lists only those rules. Word spellings are still
  practised, because every letter is typed by hand.
- What each cycle mixes: cycle 1 combines Satzanfang, Nomen gross and
  Satzschlusszeichen; cycle 2 adds Aufzählungskommas, abstrakte Nomen
  and Nebensatzkommas; cycle 3 adds Nominalisierung and relative
  clauses with two commas in one sentence.
- A sentence stays under 65 characters, so one auto-check at the end
  stays a fair unit to be judged on. On a miss the whole sentence is
  shown back character by character with the misses marked, which
  pinpoints the capitals and marks that went wrong.
- Progress lives in its own `texts` bucket, keyed by text id, in the
  same `{rounds, clean}` shape as chapters. The completion panel shows
  the finished text in full.

## Round

- A round is six tasks (`ROUND_SIZE`), drawn from one chapter, from all
  chapters of one rule, or from every chapter of the cycle. Items are
  taken round robin across shuffled chapters, so a mixed round spreads
  instead of landing three times in the same place.
- Option order is shuffled per task, so the answer never sits in the
  same place twice.
- Step dots show the position in the round.

### Input model

- **Choice tasks**: large option buttons, no confirm step. A single
  punctuation mark gets display size, or a comma disappears in a button
  built for words. The empty option of a comma rule renders as
  "kein Komma", never as a blank button.
- **Written tasks**: a field capped at the answer length that checks
  itself the moment the last character lands, the known-length pattern
  from PRODUCT.md. A visible advisory line announces that before the
  field is used (WCAG 3.2.2 On Input). The whole answer is evaluated,
  never a character at a time. The field is set to
  `autocapitalize="none"` and `spellcheck="false"`: capitals are part
  of the lesson, and a browser must not spell it for the child. Typing
  does not re-render, so the caret and the focus stay put.
- `memory` hides the word after a study step; `write` shows the
  sentence around the gap; `copy` keeps the sentence on screen to be
  written out.

### Feedback

Persistent until the child moves on, never "Falsch".

- Correct: "Richtig.", the solution fills the blank in the success
  tone, and a Weiter button appears.
- Wrong: the chosen answer stays visible with a line through it; a
  written answer is shown back character by character with the misses
  marked by colour **and** an underline; "Fast. Schau die Regel an und
  versuch es nochmals." and a retry. From the second miss on the same
  task an extra option shows the solution (`reveal`); afterwards
  practice continues with the miss counter reset, while the task still
  counts as corrected.
- **The rule text appears only after an answer** during a round. Before
  the answer it would be a lookup table. It is always readable in full
  on the rule view for anyone who wants it first.

### Completion

- "{k} von {n} Aufgaben hast du direkt gewusst." plus a per-task list
  showing every solution with a gewusst/geübt tag.
- Quiet reward block: XP gained, level reached, medals unlocked.
- A pointer to the next chapter, or to the next cycle when the mastery
  streak calls for it.

## Progress and status

- Progress is counted **per chapter**. Every chapter a round drew from
  is credited, so mixed practice moves the chapter cards too. A chapter
  counts as clean for that round only when all of its tasks in the
  round were right first time.
- Chapter status: 0 rounds = Neu, 1+ rounds = Geübt, 3+ clean rounds =
  Sitzt!
- Rule status: Sitzt! only when every chapter is, including the writing
  chapter; Geübt when any chapter has been touched.
- A rule that spans two cycles has one set of counters, so progress
  made in cycle 1 is the same progress in cycle 2.

## Gamification (quiet)

XP measures practice, not perfection: mistakes never subtract XP,
retries cost nothing, and speed never matters.

- **XP per round**: 5 for finishing, 2 per answer right first time,
  1 per corrected answer, plus 2 per cycle step because the later
  cycles are harder, plus 3 when every task in the round was written
  rather than tapped. A clean cycle 1 choice round is 17 XP; the same
  round in a writing chapter is 20.
- **Levels** (cumulative XP): 1 Schreiblehrling 0, 2 Wortsammler 30,
  3 Satzbauer 80, 4 Regelprofi 160, 5 Schreibprofi 280,
  6 Meisterfeder 450. Beyond the last level XP keeps counting. The
  titles are string ids, so they translate with the rest of the UI.
- **Medals** (11, every check a pure function of the stored data):
  Erste Runde / Dranbleiber / Wortarbeiter / Werkstattmeister at 1, 3,
  8 and 21 finished rounds; Regelfest when a chapter reaches 3 clean
  rounds; Kapitelmeister when every chapter of one rule has been
  practised, writing chapter included; Rundum when every rule of the
  **currently selected cycle** has been practised; Wortschmied at 400
  typed characters (effort medal, counts the tries that missed);
  Selberschreiber at 20 written answers; Textschreiber after three
  whole texts; Zyklusreise after practising in all three cycles.
- **Display**: a stats strip on home opens the medal gallery; locked
  medals stay visible with their description. Rewards appear only on
  the completion panel as a quiet block, with no modal and no
  celebration motion.
- **Counters** stored under `game`: `xp`, `rounds`, `charsTyped`,
  `written`, `cleanCycle`/`cleanCount`, `cycles`, `medals`. Reset
  clears them.

## Adaptive difficulty

- A round is clean when it finished without a single wrong answer.
- After five consecutive clean rounds in the current cycle, the
  completion panel suggests the next one and offers a one-tap action
  that switches the setting and starts a mixed round immediately.
- A round with mistakes resets the streak silently. No message, no lost
  progress, full XP: struggling at a cycle is practising, not failing.
- The app never steps down on its own and never locks a cycle or a
  chapter behind progression.

## Settings

Follows the shared settings pattern in the repo PRODUCT.md.

- Gear button in the home header, own view with a back button, one
  panel per setting, `aria-pressed` on the options, no save button.
- Panel order: **Sprache**, then **Lernsprache** (see below), then
  **Zyklus**.
- Defaults: German interface, German learning language, cycle 1. Cycle
  1 is the default because it is where the source places the rules the
  brief named; the other cycles are one tap away.
- Reset stays in the home footer, clears progress, keeps every setting.

## Languages

Two dimensions, deliberately separate.

**Interface language** — German (default, Swiss standard German) and
English. One table per language in `js/i18n/<code>.js`, keyed by the
same stable ids. German is the reference and the fallback; `t()`
returns the key id when a key is missing, so a hole is visible. The
e2e suite enforces identical keys, identical `{placeholders}`, no sharp
s, and that no raw key id reaches the screen in either language.

**Learning language** — the language whose orthography is practised.
One content pack per language in `js/content/<code>.js`. The app ships
German. Every code path is generic, so a second pack drops in by adding
a file and registering it in `data.js`. The setting is stored and used
either way; its panel appears with the second pack, because a panel
that offers no choice is noise.

**Where the split runs.** Rule titles and rule explanations live in the
interface tables, so an English-speaking child gets the German sp/st
rule explained in English. The practice material itself (words,
sentence frames, clues, prompts) stays in the language it teaches,
because you cannot teach German end-of-sentence marks with English
sentences. Every element carrying that material is marked with the
content pack's language (WCAG 3.1.2), so a screen reader switches voice.

Adding a content pack means adding its rule title and rule ids to every
interface table. Topic ids are unique across packs for that reason.

## Screens

1. **Home** — title and settings button, stats strip, "Üben" panel
   (which cycle, mixed practice), "Texte schreiben" section (the
   writing mode), rule cards (icon, title, chapters practised, status),
   storage note and reset.
2. **Text** — the writing mode: the paragraph taking shape, one
   sentence being written, no options anywhere on screen.
3. **Regel** — the rule text in full, the source line naming the
   competency step and the Lehrplan edition, the three chapter cards
   with the writing chapter tagged, and mixed practice across the rule.
4. **Runde** — back, rule title, step dots, instruction, task panel,
   options or the writing field, rule box after the answer, persistent
   feedback area, actions.
5. **Abschluss** — completion feedback, reward block, optional cycle
   suggestion, per-task summary, next chapter, actions.
6. **Einstellungen** — Sprache, optional Lernsprache, Zyklus.
7. **Medaillen** — level panel with progress bar plus the medal grid.

Back walks one step up the path: a round returns to its rule, a rule
returns home.

## Persistence and privacy

- Everything in `localStorage` under `wortwerkstatt.state`: `settings`
  (`language`, `contentLanguage`, `cycle`), `chapters` (per chapter:
  `rounds`, `clean`) and `game`. No accounts, no analytics, no cookies.
- Loading sanitises every field: an unknown language, an unknown cycle
  or a negative counter falls back to the default, and progress stored
  for a chapter that no longer exists is kept without breaking
  anything. When the loaded state does not serialise back to what was
  stored, the normalised state is written once.
- **Migration**: progress used to be stored per rule under `topics`.
  Those keys do not map onto chapters, so they are dropped rather than
  guessed at. XP, medals and settings survive, which is the part a
  child would notice.
- Reset confirms first and says the data lives on the device.
- **No external requests at all.** Fonts and icons ship with the app,
  so it keeps working offline after the first load.

## Design

- Tokens copied from the repo root `DESIGN.md` into `css/styles.css`.
  Dark only. Accent family: **blue**, chosen over amber, sage and coral
  because those sit close to the warning, success and danger tones this
  app shows constantly; the accent has to stay clearly distinct from
  "you got it wrong".
- Atkinson Hyperlegible (self-hosted woff2, 400/700) throughout. It was
  designed to keep similar letterforms apart, which is the entire job
  on a spelling screen.
- Lucide icons inlined as SVG (`js/icons.js`, generated from
  lucide-static).
- Motion: opacity and transform only, 120 to 240 ms, reduced-motion
  disables it.
- Targets: option buttons 3.5rem tall, every other control at least
  2.75rem.
- Accessibility (WCAG 2.1 AA): auto-check is announced before use
  (SC 3.2.2), results are announced through the persistent feedback
  area with `role="status"` (SC 4.1.3), no time limits (SC 2.2.1),
  wrong answers are identified in text and by shape as well as colour
  (SC 1.4.1, SC 3.3.1), and practice material is marked with its own
  language (SC 3.1.2). The open blank carries an `aria-label` so it is
  announced as a gap rather than as three middle dots.

## Structure

- `index.html`, `css/styles.css`, `fonts/`, `js/`:
  `data.js` (registries, cycle lookup, Lehrplan edition), `i18n.js`,
  `i18n/de|en.js`, `content/de.js` (the curriculum), `util.js`
  (shuffle, escaping, status), `storage.js`, `round.js` (round
  building, spacing and checking, no DOM), `game.js` (XP, levels,
  medals, no DOM and no copy), `ui.js` (rendering), `app.js` (state and
  events), `icons.js`.
- Cache busting: every local asset URL carries the same `?v=N`.
  Bump N in all files on every release; the e2e suite enforces
  consistency and walks `js/` recursively. Current: `?v=2`.
- Tests: `tests/e2e.test.mjs` (Playwright, self-contained static
  server, no python dependency). The expected answers are derived from
  the content pack through `round.js`, the module the app renders from,
  so the tests cannot drift from the engine.
