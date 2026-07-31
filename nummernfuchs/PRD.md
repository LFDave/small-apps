# Nummernfuchs — PRD

Single source of truth for behavior. Update this file in the same
change as any behavior change.

## Goal

Kids (roughly 6 to 12) learn real numbers by heart: door codes, phone
numbers of their family, and the Swiss emergency numbers. The method is
chunking (numbers are learned in spoken groups), retrieval practice
(typing from memory instead of re-reading) and progressive hiding.

German-only UI (Swiss standard German, ss never ß). All strings live in
`js/data.js` keyed by stable IDs so an English toggle can be added
later. Follows the repo baseline (PRODUCT.md and DESIGN.md at the repo
root): dark-only token system, violet accent family, Atkinson
Hyperlegible (digits included; alignment comes from fixed-width digit
cells, not from a mono font).

## V1 scope

1. **Meine Nummern** — custom codes (3 to 16 digits, free chunking) and
   phone numbers including an international form.
2. **Learning ladder** — per-entry practice flow with progressive
   hiding.
3. **Notfallnummern** — built-in Swiss emergency pack with a typing
   quiz: 112 Notruf Europa, 117 Polizei, 118 Feuerwehr, 144 Sanität,
   145 Tox Info, 1414 Rega.

Out of scope for v1 (planned later): spaced review scheduling, the
standalone Blitz digit-span game, sounds, English toggle, sibling
profiles.

## Entries

- Fields: `id`, `type` (`code` | `phone`), `label` (1 to 24 chars),
  `chunks` (array of digit groups), `intl` (phones only), `cc`
  (country code digits, default `41`), `completions`, `lastDone`.
- **Chunking**: spaces in the number input define the groups ("so wie
  du sie sprichst"). Without spaces the number is auto-chunked:
  - phone with 10 digits: 3-3-2-2 (079 640 13 21),
  - otherwise groups of three with a 2+2 tail so no single-digit group
    appears (640132 → 640 132; 4 digits → 2+2; 7 digits → 3+2+2).
- Validation: digits and spaces only, 3 to 16 digits total, max 5
  digits per group, label required. Errors are supportive and specific.
- **International form** (phones with `intl` on): derived, never stored
  separately. Leading zero of the first chunk is dropped and `+cc` is
  prefixed as its own chunk: 079 640 13 21 → +41 79 640 13 21.
  Default country code 41, editable (1 to 3 digits).
- Editing a number resets `completions` when the digits changed;
  a label-only edit keeps progress.

## Learning ladder

Steps built per run (`js/practice.js`):

1. `view` — whole number visible. "Schau dir die Nummer gut an."
2. `cloze` — one chunk hidden (only if the entry has 2+ chunks). The
   hidden chunk index rotates: `completions % chunkCount`, so repeat
   runs hide a different group.
3. `tail` — only the first chunk visible. Skipped when it would equal
   the cloze step (2-chunk entries whose cloze already hid chunk 1).
4. `full` — nothing visible, type the whole number.
5. `intl-view` + `intl-full` — phones with `intl` on: the international
   form is shown once, then typed completely. The `+` key exists on the
   pad only in `intl-full`, and `+` counts as a typed character.

Input model: hidden chunks render as fixed-width cells (dots when
empty); typing fills them left to right across all hidden chunks. The
pad has keys 1-9, 0, backspace; OK checks. The physical keyboard works
the same (digits, `+`, Backspace, Enter = OK).

Feedback (persistent until the child moves on, never "Falsch"):

- Incomplete OK press: "Tipp zuerst alle Ziffern ein." (info)
- Correct: "Richtig." (success) + Weiter button.
- Wrong: wrong cells marked, "Fast. Versuch es noch einmal." + retry.
  From the second miss on the same step, an extra option shows the
  number again (`reveal`), then practice continues with a reset miss
  counter.
- Ladder complete: `completions` +1, celebration panel, options
  "Zur Übersicht" and "Nochmals üben".

Entry status from `completions`: 0 = Neu, 1 to 2 = Geübt, 3+ = Sitzt!

## Emergency quiz

- All six numbers per session, random order.
- A round shows icon, situation ("Es brennt.") and the question
  "Welche Nummer rufst du?"; the child types the number (cell count
  hints the length).
- Correct on first try: success feedback with a one-line explanation
  ("118 ist die Feuerwehr."), per-number streak +1.
- Wrong: streak resets, the correct number is named in the feedback and
  must be typed once to continue (corrective encoding, no punishment).
- A number is "known" on the home grid (check mark) at streak >= 3
  across sessions.
- Summary panel: "{k} von 6 Nummern hast du direkt gewusst." plus a
  per-number gewusst/geübt list.

## Screens

1. **Home** — entry cards (label, chunked number, international
   subline, status pill, edit), add button (primary only when the list
   is empty), emergency grid with practice button, storage note
   ("Alle Nummern bleiben auf diesem Gerät.") and reset link
   (confirm dialog).
2. **Form** — type choice (Code / Telefonnummer), label, number input
   with chunking hint, international checkbox + country code + live
   preview (phones only), save, delete (edit mode, confirm dialog).
3. **Ladder** — back, entry label, step dots, instruction, cells,
   pad/OK or Weiter, persistent feedback area.
4. **Quiz** — back, progress line, situation card, cells, pad/OK,
   persistent feedback area, summary panel.

## Persistence and privacy

- Everything in `localStorage` under `nummernfuchs.state`
  (`entries` + `emergency` streaks). No accounts, no analytics, no
  external requests at all (fonts and icons ship with the app).
- Reset and delete confirm first and mention that data lives on the
  device.

## Design

- Tokens copied from the repo root `DESIGN.md` into `css/styles.css`
  custom properties. Dark only. Accent family: **violet** (recorded in
  the `PRODUCT.md` app registry).
- Digits render in Atkinson Hyperlegible (self-hosted woff2, 400/700)
  inside fixed-width cells; chunk gaps carry the grouping.
- Lucide icons inlined as SVG (`js/icons.js`, generated from
  lucide-static).
- Motion: opacity/transform only, 120 to 240 ms, reduced-motion
  disables it.
- Targets: pad keys 3rem, buttons min 2.75rem.

## Structure

- `index.html`, `css/styles.css`, `fonts/`, `js/`:
  `data.js` (strings + emergency data), `util.js` (parsing, chunking,
  international derivation), `storage.js`, `practice.js` (ladder/quiz
  logic, no DOM), `ui.js` (rendering), `app.js` (state + events),
  `icons.js`.
- Cache busting: every local asset URL carries the same `?v=N`
  (stylesheet link, script tag, inter-module imports, font urls).
  Bump N in all files on every release; the e2e suite enforces
  consistency.
- Tests: `tests/e2e.test.mjs` (Playwright, self-contained static
  server, no python dependency).
