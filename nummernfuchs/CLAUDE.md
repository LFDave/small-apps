# CLAUDE.md — nummernfuchs

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Follows the repo baseline (root PRODUCT.md/DESIGN.md): dark-only
  tokens in `css/styles.css`, accent family **violet**, German-only
  Swiss copy (ss, never ß), all strings in `js/data.js`.
- Digits render in Atkinson Hyperlegible inside fixed-width `.cell`
  elements — alignment comes from the cells, not from a mono font.
  Fonts are self-hosted woff2 in `fonts/`.
- `js/practice.js` is DOM-free ladder/quiz logic; the e2e suite imports
  it directly (`from "../js/practice.js?v=1"`) to derive the expected
  answers, so tests never drift from the step builder. Keep it pure.
- The cloze step hides chunk `completions % chunkCount` — deterministic
  on purpose (rotation across runs, and the tests rely on it).
- Icons: `js/icons.js` is generated from lucide-static SVGs; add icons
  by appending to `PATHS`, keep the Lucide names.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back; it also enforces `?v=N` consistency across
  index.html, all js imports and css font urls. The suite spawns its
  own node static server (no python needed).
