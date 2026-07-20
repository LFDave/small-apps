# CLAUDE.md — jass-scoreboard

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change. Module structure
  (`state.js`, `storage.js`, `scoring.js`, `renderer.js`, `ui.js`,
  `app.js`) is mandated by the PRD.
- The board is one SVG scene; each Z is point-symmetric so both Z's read
  correctly from both sides of the table (far half rotated 180°).
- Chalk semantics: marks are written per round and never converted
  between lines (no exchanging five 20s for a 100); 20s align right on
  the bottom bar; all lines bundle tallies in fives (`||||\`); marks are
  wiped only by undo (last round) or corrections (negative entries,
  removing highest → lowest with borrowing). The rest number is always
  below 20 — at 20 it carries into a 20-mark.
- Team A defaults to the near (bottom) half — the side facing the person
  holding the device.
- JPG export builds a standalone SVG with styles inlined via
  `EXPORT_STYLE` in renderer.js — keep that block in sync with the same
  classes in css/styles.css when changing board styling.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back; it also enforces the `?v=N` cache-busting
  consistency across index.html and all js imports.
