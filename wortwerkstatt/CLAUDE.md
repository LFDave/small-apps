# CLAUDE.md — wortwerkstatt

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Follows the repo baseline (root PRODUCT.md/DESIGN.md): dark-only
  tokens in `css/styles.css`, accent family **blue**. Blue is not
  cosmetic: amber, sage and coral sit close to the warning, success and
  danger tones this app shows on almost every screen, and the accent
  has to stay clearly distinct from "you got it wrong".

## The source is load-bearing

- The curriculum follows **Lehrplan 21, D.4 Schreiben, D.4.F.1**,
  Fassung **Kanton Bern, 23.06.2016**. The edition lives in `data.js`
  as `LEHRPLAN_VERSION` and renders on every rule view. A newer Fassung
  means a new date **and** a re-check of every `step` in the pack.
- `be.lehrplan.ch` returns HTTP 403 to automated requests. Do not
  report the ladder as verified from the site; work from the PDF of the
  named edition.
- A rule's `step` names the competency step where it appears word for
  word, or is `null`. **Never invent a step reference.** A `null` rule
  renders "Ergänzende Übung", which is the honest answer and is what a
  parent checking the app relies on.
- **Cycle bars place a step, and a step can span two cycles.** Step b
  spans cycles 1 and 2, so `sch`, `sp-st`, `ng-nk`, `abstrakte-nomen`
  and `satzschluss` carry `cycles: [1, 2]` and appear on both lists
  with one shared set of progress counters. `topic.cycles` is an array
  for this reason; never collapse it back to a single number.
- Deliberately out of scope, with reasons in PRD.md: direkte Rede
  (guillemets are impractical to type), and step-linked cycle 3 rules
  (steps f and g add exceptions, not new rules).

## Content rules

All enforced by the e2e suite unless noted:

- Swiss standard German, ss never sharp s.
- The answer must be among the options; a chapter needs at least
  `ROUND_SIZE` items so no task repeats in a round.
- No two tasks may read the same with the blank open, anywhere in the
  pack, or one question has two right answers.
- Every rule must have at least one chapter of a typed kind.
- **A written answer must have exactly one correct spelling.** Not
  machine-checkable — check candidates on duden.de. `Biografie` was
  removed because Duden gives "Alternative Schreibung: Biographie", so
  the app would mark a right answer wrong.
- `fremdwort` holds Fremdwörter (foreign spelling or pronunciation
  kept: Rhythmus, Restaurant, Ingenieur), not assimilated Lehnwörter.
  `Adresse` and `Maschine` are Lehnwörter and live in
  `doppelkonsonant` and `sch`, the rules they actually illustrate.
- Beyond the suite: exactly one option may produce a real German word,
  and where two are real (`singen` / `sinken`, `Rad` / `Rat`) the item
  needs a `clue`. Distractors are mistakes children actually make
  (`Schport`), never random letters.
- **Do not delete exercises to make room.** Move them to the rule they
  illustrate. If something must go, say so explicitly and why.

## Structure and engine

- **Two language dimensions, kept apart.** Interface language
  (`settings.language`, tables in `js/i18n/`) and learning language
  (`settings.contentLanguage`, packs in `js/content/`). Rule titles and
  rule explanations are interface copy and translate. Practice material
  — words, sentence frames, clues, prompts — stays in the language it
  teaches and is marked with `lang` through `contentLangAttr()`. Never
  translate a practice item; never hardcode a rule explanation into a
  content pack.
- **Adding a content pack**: add `js/content/<code>.js`, register it in
  `CONTENT_LANGUAGES`, and add `topic<Id>Title` / `topic<Id>Rule` to
  **every** interface table. Topic ids are unique across packs because
  they resolve their string ids by convention (`topicKey`). The
  Lernsprache settings panel appears on its own once more than one pack
  ships.
- **No copy outside `js/i18n/`.** `content/de.js` carries practice
  material and string ids, never interface sentences. `game.js` and
  `round.js` carry no strings at all.
- **Chapters** are the unit of progress. `data.chapters[chapterId]`
  holds `{rounds, clean}`; rule status is derived in `topicStatus()`.
  Chapter ids are unique across the pack so `chapterById` can find one
  without knowing its rule.
- **Spacing lives in one place.** `fillTask()` in `round.js` joins the
  parts around the answer: word fragments glued, an end-of-sentence
  mark tight, a following clause spaced. The rendered blank and the
  solution text both go through it. `ui.js` splits on the `BLANK`
  sentinel rather than re-implementing the rules.
- **Writing mode** (`content.texts`, `kind: "text"`): nothing is tapped.
  A text round is built by `buildTextRound` and is **never shuffled** —
  a paragraph runs in order. Progress lands in the `texts` bucket, not
  in `chapters`. The prompt of a sentence is a hurried draft (lowercase,
  no punctuation) and **never a misspelling**; the e2e suite checks that
  prompt and answer carry the same letters and differ only in form. Keep
  sentences under 65 characters, or one auto-check at the end stops
  being a fair unit to be judged on.
- Seven task kinds, three chosen and four typed (`isTyped`). `copy` is
  the writing chapter of the punctuation rules — typing a lone "?" is
  thin, and the comma rule's empty answer could never trigger a
  known-length check on its own.
- The rule box renders only after an answer during a round. The full
  rule text is always on the rule view for anyone who wants it first.
- **A word checks itself; a sentence is confirmed** (`needsConfirm`,
  `CONFIRM_KINDS`). The known-length pattern needs a length the child
  can actually count. `memory` and `write` auto-check on the last
  character with the count stated. `copy` and `text` get a Fertig button
  and Enter, because a sentence one character short never reaches the
  expected length and would hang forever with no feedback — the bug this
  rule exists to prevent. **Never move a sentence kind to auto-check.**
  Confirmed fields also allow overshoot, so a too-long answer stays
  finishable. Wrong answers come back character by character for a word
  and **word by word** for a sentence (`wordDiff`), so one missing comma
  marks one word instead of everything after it. The advisory line under
  the field says which of the two applies (WCAG 3.2.2). `autocapitalize="none"` and
  `spellcheck="false"` are load-bearing — capitals are the lesson and
  the browser must not spell it for the child. The `input` handler must
  not re-render, or the caret jumps.
- Gamification lives in `js/game.js` (pure, no DOM). Medal checks must
  stay pure functions of the data object — never event flags.
  `alleskoenner` reads `settings.cycle`, so it is a per-cycle goal.
  Rewards render only on the completion panel. XP never decreases and
  never depends on speed.
- Mixed rounds credit every chapter they drew from, so the cards move
  for a child who only ever taps "Gemischte Übung".
- Icons: `js/icons.js` is generated from lucide-static SVGs; add icons
  by appending to `PATHS`, keep the Lucide names.
- The app makes **no external requests**. Keep it that way.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back. It enforces `?v=N` consistency, string-table
  parity, content-pack sanity, the step-b cycle span, and that every
  language and cycle fits the narrow viewport. The suite spawns its own
  node static server and derives its expected answers from the content
  pack through `round.js`, so it cannot drift from the engine.
