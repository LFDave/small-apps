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
- **Two language dimensions, kept apart.** Interface language
  (`settings.language`, tables in `js/i18n/`) and learning language
  (`settings.contentLanguage`, packs in `js/content/`). Rule titles and
  rule explanations are interface copy and translate. The practice
  material — words, sentence frames, clues — stays in the language it
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
  `round.js` carry no strings at all; level titles and medal names are
  ids.
- **Content rules** (all enforced by the e2e suite): Swiss standard
  German, ss never sharp s; the answer must be among the options; a
  rule needs at least `ROUND_SIZE` items so no task repeats in a round;
  no two tasks may read the same with the blank open, or one question
  has two right answers. Beyond the suite: exactly one option may
  produce a real German word, and where two are real (`singen` /
  `sinken`) the item needs a `clue`. Distractors are mistakes children
  actually make (`Schport`), never random letters.
- **Spacing lives in one place.** `fillTask()` in `round.js` joins the
  parts around the answer: word fragments glued, an end-of-sentence
  mark tight, a following clause spaced. The rendered blank and the
  solution text both go through it, so they cannot disagree. `ui.js`
  splits on the `BLANK` sentinel rather than re-implementing the rules.
- The rule box renders only after an answer. Before it, it would be a
  lookup table to copy from.
- Written answers use the known-length pattern: no confirm button, the
  whole word checked when the last letter lands, the advisory line kept
  under the field (WCAG 3.2.2). `autocapitalize="none"` and
  `spellcheck="false"` are load-bearing — capitals are the lesson and
  the browser must not spell it for the child. The `input` handler must
  not re-render, or the caret jumps.
- Gamification lives in `js/game.js` (pure, no DOM): XP formulas,
  LEVELS, MEDALS. Medal checks must stay pure functions of the data
  object — never event flags — so they cannot drift from stored state.
  `alleskoenner` reads `settings.cycle`, so it is a per-cycle goal.
  Rewards render only on the completion panel. XP never decreases and
  never depends on speed.
- Mixed rounds credit every rule they drew from, so the rule cards move
  for a child who only ever taps "Gemischte Übung".
- Icons: `js/icons.js` is generated from lucide-static SVGs; add icons
  by appending to `PATHS`, keep the Lucide names.
- The app makes **no external requests**. Keep it that way: no flags,
  no CDNs, no analytics.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back. It enforces `?v=N` consistency across
  index.html, all js imports (walking `js/` recursively) and css font
  urls, string-table parity, content-pack sanity, and that every
  language and cycle fits the narrow viewport. The suite spawns its own
  node static server (no python needed) and derives its expected
  answers from the content pack through `round.js`, so it cannot drift
  from the engine.
