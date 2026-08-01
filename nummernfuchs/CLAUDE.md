# CLAUDE.md — nummernfuchs

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Follows the repo baseline (root PRODUCT.md/DESIGN.md): dark-only
  tokens in `css/styles.css`, accent family **violet**.
- **Languages**: de (default, Swiss standard German, ss never ß), fr,
  it, rm, en. One table per language in `js/i18n/<code>.js`, all with
  identical keys. German is the reference and the fallback; `t()`
  returns the key id when a key is missing, so holes are visible. Add a
  key to `de.js` first, then to all four others in the same change —
  the e2e suite fails on any mismatch, on a stray ß, and on a raw key
  id reaching the screen.
- The Rumantsch table (Rumantsch Grischun) was written without a native
  speaker. Keep it complete and consistent; flag it for review rather
  than presenting the wording as authoritative.
- **No copy outside `js/i18n/`.** `data.js`, `game.js`, `practice.js`
  and `ui.js` carry string ids, never sentences. Level titles and medal
  names are ids (`titleKey`, `key`) for the same reason.
- **Countries**: `COUNTRIES` in `js/data.js`, keyed by ISO 3166-1
  alpha-2. Never add or change a number without a source, and record
  the source in PRD.md. Never carry a number across a border because it
  looks familiar — 118 is the fire brigade in Switzerland and the
  ambulance in Italy. Where a country lacks a service, add a `gaps`
  entry naming what to do instead; never a blank, never a borrowed
  number.
- Two numbers in one pack may not share a situation string, or a quiz
  round has two right answers. The e2e suite checks this.
- Emergency streaks are keyed `"<country>:<number>"`. Anything reading
  or writing them must go through `emergencyKey()`. `storage.js`
  migrates pre-country bare-number keys to `ch:`.
- Settings (`language`, `country`) apply and persist immediately, with
  no save button. `storage.reset()` clears progress but keeps settings
  and writes the fresh state back, so a reload does not undo it.
- Digits render in Atkinson Hyperlegible inside fixed-width `.cell`
  elements — alignment comes from the cells, not from a mono font.
  Fonts are self-hosted woff2 in `fonts/`.
- Flags come from flagcdn (the one allowed external request), render
  with `hidden` and are revealed by the capture-phase `load` listener in
  `app.js` plus `revealLoadedFlags()` after each render. Never make a
  flag load-bearing for meaning: the country name sits next to it.
- `js/practice.js` is DOM-free ladder/quiz logic; the e2e suite imports
  it directly (`from "../js/practice.js?v=7"`) to derive the expected
  answers, so tests never drift from the step builder. Keep it pure.
- The cloze step hides chunk `completions % chunkCount` — deterministic
  on purpose (rotation across runs, and the tests rely on it).
- Input uses the PIN-pad pattern: no confirm button, the answer is
  evaluated when the last cell fills. Keep the advisory line under the
  pad (WCAG 3.2.2) and never validate per digit — whole-answer checks
  only, otherwise recall becomes guessing.
- Random-number training reuses the ladder via a transient entry in
  `state.ladder.trainEntry` (no id, never persisted). Anything that
  writes progress must guard on `trainEntry` first.
- Gamification lives in `js/game.js` (pure, no DOM): XP formulas,
  LEVELS, MEDALS. Medal checks must stay pure functions of the data
  object — never event flags — so they cannot drift from stored state.
  `notruf-profi` reads `settings.country`, so it is a per-country goal.
  Rewards render only on completion panels (quiet block, no modals,
  no celebration motion). XP never decreases; no speed bonuses.
- Icons: `js/icons.js` is generated from lucide-static SVGs; add icons
  by appending to `PATHS`, keep the Lucide names.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back. It enforces `?v=N` consistency across
  index.html, all js imports (walking `js/` recursively) and css font
  urls, string-table parity, country-pack sanity, and that every
  language fits the narrow viewport. The suite spawns its own node
  static server (no python needed). flagcdn is unreachable from some
  sandboxes; those console errors are filtered by request URL, and the
  flag fallback is asserted explicitly instead.
