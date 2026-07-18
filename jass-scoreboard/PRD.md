# PRD — Digital Jass Scoreboard (Schiefertafel Z/Z)

Version: 2.2 (as built — this file is the single source of truth and is
updated in the same change whenever behavior changes)

## 1. Product

A browser-based scoreboard replicating a traditional Swiss Jass slate
(Jasstafel) with Z/Z representation. The board is one SVG scene — a slate
lying flat on the table between two teams — with one chalk **Z** per team.
It must be extremely fast to use during gameplay, visually similar to
physical Jasstafeln, and deployable as a static web app.

## 2. Constraints

- HTML5, CSS3, Vanilla JavaScript (ES6+ modules) only.
- Forbidden: React, Angular, Vue, jQuery, TypeScript, external JS
  frameworks; external CSS libraries should be avoided.
- No binary assets: slate, wood frame, chalk look and favicon are pure
  CSS/SVG (favicon is an inline SVG data URI).
- Tests are exempt: the Playwright suite under `tests/` may use npm
  packages — tooling, not shipped app code.

## 3. Structure & Responsibilities

```
jass-scoreboard/
├── index.html          root structure, DOM containers, loads CSS/JS
├── css/styles.css      layout, slate/chalk styling, animations
├── js/
│   ├── app.js          bootstrap: restore → init → bind → render
│   ├── state.js        global state, mutations, validation
│   ├── storage.js      localStorage persistence + legacy migration
│   ├── scoring.js      validation, totals, win check, mark accumulation
│   ├── renderer.js     single-SVG slate scene: Z's, marks, totals, win
│   └── ui.js           event binding, input validation
├── tests/e2e.test.mjs  Playwright end-to-end tests
├── PRD.md              this file
└── README.md           user-facing: what it is, how to use/run/test
```

## 4. Data Model

```js
state = {
  teams: [{ id: "A", name: "Team A" }, { id: "B", name: "Team B" }],
  entries: [],                    // [{ teamId, points, timestamp }]
  totals: { A: 0, B: 0 },         // derived, never edited
  targetScore: 2500,
  flipped: false,
  winner: null,
  gameFinished: false,
  winAcknowledged: false          // transient, never persisted
}
```

Chalk marks are derived from the entry sequence, never stored.

## 5. Game Rules

- Exactly two teams; names editable, 1–30 characters.
- Target score: default 2500, editable, range 100–10000.
- Win: `team_total > targetScore` (must strictly exceed).
- On win: score entry disabled; undo and reset remain available.

## 6. Score Entry

1. Select team (toggle buttons showing team names)
2. Enter points or tap a quick chip: +20 / +50 / +100 / +157
3. **Eintragen** (Enter also submits)

Validation: integer, `0 < points ≤ 500`. Errors shown in German in an
`aria-live` region.

## 7. Chalk Mark Rendering

Each round is decomposed once, at entry time:

| Line | Value per mark | Layout |
|---|---|---|
| Top bar | 100 | left-aligned |
| Diagonal | 50 | compact from the top-right end |
| Bottom bar | 20 | **aligned right**, growing left |
| Chalk number | sub-20 rest | always below 20 |

Hard rules (chalk semantics):

- Marks accumulate round after round and are **never converted** between
  lines (no exchanging five 20s for a 100, or two 50s for a 100).
- A written mark disappears only through **Undo**, which wipes exactly
  the last round's marks.
- All three lines bundle tallies in fives: every fifth stroke is a slash
  across the previous four (`||||\`) — display grouping, never conversion.
- The rest number never reaches 20: rests add up, and at 20 a 20-mark is
  written and the number rewritten with the leftover (numerals are the
  one thing a chalk writer wipes and rewrites).
- Round entries never display numeric values; only the running total and
  the rest number are numerals.
- Chalk strokes use deterministic jitter (seeded PRNG): the hand-drawn
  look is stable across re-renders — marks never wiggle or move.

## 8. Board Layout — readable from both sides

- Two halves separated by a red centre line; one Z per half.
- Each Z is **point-symmetric about its own centre**: top bar, diagonal
  and bottom bar map onto themselves under a 180° rotation, so a Z viewed
  upside down is still a "Z", never an "S".
- The far half is rotated 180° so that team's name, total and marks face
  the player across the table.
- The ⇅ button toggles `flipped`, swapping which team sits at the near
  edge; the data model never changes.

## 9. Undo & Reset

- Undo: `entries.pop()` → recompute totals/marks/winner → re-render.
  Undo also revives a finished game.
- Reset (with confirmation): clears entries, totals, winner,
  gameFinished; keeps team names, target score, flip state.

## 10. Persistence & Caching

- `localStorage`, key `jassScoreboardState`; saved fields: teams,
  entries, targetScore, flipped, winner, gameFinished.
- Totals and marks are recomputed on load, never trusted from storage.
- Legacy v1 entries (`{barType, value}`) are migrated to `{points}`.
- Cache busting: every local asset URL (CSS link, script tag, and every
  inter-module import) carries the same `?v=N` query. Bump `N` in all
  files on every release; the e2e suite fails if versions diverge or an
  asset URL is unversioned.

## 11. UI & Accessibility

- DOM: header (title, target, ⇅) · name editors · `#board` ·
  screen-reader live region · input area (team toggle, points +
  Eintragen, chips, Rückgängig/Neu) · win overlay.
- UI language: German, Swiss spelling (no ß).
- Win animation: overlay (trophy, "Gewonnen!", chalk particles), pulsing
  gold glow on the winning half; tap to dismiss.
- Responsive from 320px; keyboard operable; visible focus rings;
  `prefers-reduced-motion` respected; user input escaped before SVG
  injection.
- Performance: initial load < 1s, score update < 50ms.

## 12. Testing

- Playwright e2e tests in `tests/` must pass before any change is
  reported or a PR is opened/updated.
- Tests exercise real flows in Chromium (entry, validation, chalk
  semantics, bundling, rest carry, undo, flip, persistence, win, reset,
  escaping, cache-version consistency) and fail on console errors.
- Screenshots of changed states accompany every change report.

## 13. Out of Scope

Multiple Jass variants, multiplayer sync, PWA install, statistics,
export screenshot, tournament mode.
