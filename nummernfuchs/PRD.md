# Nummernfuchs — PRD

Single source of truth for behavior. Update this file in the same
change as any behavior change.

## Goal

Kids (roughly 6 to 12) learn real numbers by heart: door codes, phone
numbers of their family, and the emergency numbers of the country they
live in. The method is chunking (numbers are learned in spoken groups),
retrieval practice (typing from memory instead of re-reading) and
progressive hiding.

Follows the repo baseline (PRODUCT.md and DESIGN.md at the repo root):
dark-only token system, violet accent family, Atkinson Hyperlegible
(digits included; alignment comes from fixed-width digit cells, not
from a mono font).

## Scope

1. **Meine Nummern** — custom codes (3 to 16 digits, free chunking) and
   phone numbers including an international form.
2. **Learning ladder** — per-entry practice flow with progressive
   hiding.
3. **Notfallnummern** — a built-in emergency pack per country with a
   typing quiz.
4. **Zufallszahl** — random-number training with selectable length.
5. **Quiet gamification** — XP, levels and medals that reward practice,
   never speed or perfection.
6. **Einstellungen** — language and country.

Out of scope (planned later): spaced review scheduling, sounds,
sibling profiles.

## Languages

Five languages ship with the app: German (default, Swiss standard
German, ss never ß), French, Italian, Rumantsch Grischun and English.
That is the four Swiss national languages plus English, the set defined
in the repo PRODUCT.md.

- One table per language in `js/i18n/<code>.js`, all keyed by the same
  stable IDs. German is the reference table and the fallback for a
  missing key; `t()` returns the key itself so a hole is visible rather
  than silently German.
- All five tables are imported statically, so switching language never
  touches the network.
- `document.documentElement.lang` follows the setting.
- The app name "Nummernfuchs" is a proper noun and stays untranslated
  in every language. So do the service proper nouns Rega and
  Tox Info Suisse.
- The e2e suite enforces that every language carries exactly the same
  keys with the same `{placeholders}`, that no table uses ß, and that
  no raw key id reaches the screen in any language.
- The Rumantsch table was written without a native speaker. It is
  complete and consistent, but the wording still wants a review by
  someone who writes Rumantsch Grischun daily.

## Settings

Follows the shared settings pattern in the repo PRODUCT.md.

- Entry point: a gear button in the home header (`nav-settings`).
- Own view with a back button. One panel per setting, each with a short
  heading and one line saying what it changes.
- Options are a choice grid with `aria-pressed`; the selected one gets
  an accent border. No save button, no confirm, no toast: a change
  applies and is written to localStorage at once.
- Panel order: **Sprache** first, then **Land**.
- Reset is not in settings. It stays in the home footer with its
  confirmation.
- Reset clears numbers and progress but keeps the settings: a child on
  the Italian pack should not land back on German after a reset.

## Countries

Six countries, Switzerland by default. Each pack lists the numbers a
child there should know, with the dialling code used as the default for
new international phone entries.

| Country | Code | Dial | Numbers |
| --- | --- | --- | --- |
| Schweiz | ch | +41 | 112 Notruf Europa, 117 Polizei, 118 Feuerwehr, 144 Sanität, 145 Tox Info, 1414 Rega |
| Deutschland | de | +49 | 112 Feuerwehr und Rettungsdienst, 110 Polizei, 116117 Ärztlicher Bereitschaftsdienst |
| Österreich | at | +43 | 112 Euronotruf, 133 Polizei, 122 Feuerwehr, 144 Rettung, 140 Bergrettung |
| Frankreich | fr | +33 | 112 Notruf Europa, 17 Police secours, 18 Sapeurs-pompiers, 15 SAMU |
| Italien | it | +39 | 112 Numero unico, 113 Polizia, 115 Vigili del fuoco, 118 Emergenza sanitaria |
| Liechtenstein | li | +423 | 112 Notruf Europa, 117 Polizei, 118 Feuerwehr, 144 Sanität, 145 Tox Info, 1414 Rega |

Numbers carry a `key`, not their own copy: the name, the situation and
the explanation come from the string tables, so one pack reads the same
in all five languages. The explanation is templated with `{number}`,
which is why "118 ist die Feuerwehr" in Switzerland and "118 è il
soccorso sanitario" in Italy come from the same shape without ever
sharing a fact.

### Gaps

Where a country has no short number for something another country has,
the pack carries a `gaps` entry instead of a blank or a borrowed
number. Gaps render on the home emergency panel under "Was hier fehlt"
with a warning icon, and name what to do instead.

| Country | Gap | Shown text says |
| --- | --- | --- |
| de | poison | no nationwide number, each Bundesland runs its own Giftnotruf, call 112 if life is in danger |
| de | mountain rescue | no separate number, reached through 112 |
| at | poison | no short number, Vergiftungsinformationszentrale Wien is 01 406 43 43 |
| fr | poison | no nationwide number, regional Centres antipoison, call 15 or 112 |
| fr | mountain rescue | no separate number, reached through 112 |
| it | poison | no nationwide number, regional Centri antiveleni, call 112 |
| it | mountain rescue | no separate number, reached through 112 |

Switzerland and Liechtenstein have no gaps.

### Country notes

Two packs carry one extra line of context, shown as a quiet hint under
the grid: Italy (112 brings all emergency calls together, 113/115/118
still work) and Liechtenstein (same numbers as Switzerland).

### Sources

Checked in August 2026. Where official government sites blocked
automated access, the numbers were confirmed through search results
citing those same official sources.

- Switzerland: ch.ch and the Swiss emergency services (112, 117, 118,
  144, 145 Tox Info Suisse, 1414 Rega).
- Liechtenstein: Liechtensteinische Landesverwaltung (llv.li) and
  Landespolizei Liechtenstein. Rega and Tox Info Suisse serve
  Liechtenstein, so the pack is identical to the Swiss one.
- Austria: Bundesministerium für Inneres and polizei.gv.at (112, 133,
  122, 144, 140). The Vergiftungsinformationszentrale has no short
  number.
- Germany: 110 and 112 are nationwide; 116117 is the ärztlicher
  Bereitschaftsdienst. The Giftnotruf is organised per Bundesland,
  confirmed by the Bundesamt für Verbraucherschutz und
  Lebensmittelsicherheit list.
- France: gendarmerie.interieur.gouv.fr and masecurite.interieur.gouv.fr
  (112, 15, 17, 18). Poison control runs through regional Centres
  antipoison; there is no national short number.
- Italy: NUE 112 is the single emergency number and routes police, fire
  and medical calls; 113, 115 and 118 still work. Poison control runs
  through regional Centri antiveleni.

Do not extend or change a pack without a source. Never carry a number
across a border because it looks familiar.

## Entries

- Fields: `id`, `type` (`code` | `phone`), `label` (1 to 24 chars),
  `chunks` (array of digit groups), `intl` (phones only), `cc`
  (country code digits, default from the country setting),
  `completions`, `lastDone`.
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
  The country code is prefilled from the country setting and stays
  editable (1 to 3 digits). Changing the country does not rewrite
  numbers that already exist.
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
pad has keys 1-9, 0 and backspace; there is no confirm button. The
answer checks itself the moment the last cell fills (PIN-pad pattern,
like a phone unlock screen). A visible advisory line under the pad
announces this before use: "Bei der letzten Ziffer siehst du sofort,
ob es stimmt." Evaluation is whole-answer only, never per typed digit,
so recall cannot degrade into digit-by-digit guessing. The physical
keyboard works the same (digits, `+`, Backspace).

Feedback (persistent until the child moves on, never "Falsch"):

- Correct: "Richtig." (success) + Weiter button.
- Wrong: wrong cells marked, "Fast. Versuch es noch einmal." + retry.
  From the second miss on the same step, an extra option shows the
  number again (`reveal`), then practice continues with a reset miss
  counter.
- Ladder complete: `completions` +1, celebration panel, options
  "Zur Übersicht" and "Nochmals üben".

Entry status from `completions`: 0 = Neu, 1 to 2 = Geübt, 3+ = Sitzt!

## Random-number training (Zufallszahl)

- Home panel with a length stepper: 3 to 16 digits, default 6. The
  chosen length persists (`trainingLength` in `nummernfuchs.state`).
- "Zufallszahl üben" generates uniform random digits of that length
  (leading zeros allowed) and auto-chunks them like a code.
- The number runs through the same learning ladder as a transient
  entry: nothing is stored, no status pill, cloze always hides the
  first chunk (completions is always 0 for a fresh random number).
- The completion panel's primary action is "Neue Zufallszahl" (same
  length, new number); "Zur Übersicht" is secondary. This is the
  opposite emphasis of the entry ladder, where returning home is
  primary, because training sessions chain naturally.
- **Level-up suggestion**: a run is clean when it finished without a
  single wrong answer. After five consecutive clean runs at the current
  length (tracked as `trainCleanLen`/`trainCleanCount` in the game
  state), the completion panel suggests one digit more ("Das klappt
  richtig gut. Probier es mit {n} Ziffern!") and the primary action
  becomes "Mit {n} Ziffern üben": it raises the saved length by one
  (max 16) and starts a new number immediately. A run with mistakes
  silently resets the clean streak — no message, and XP is unaffected.
  Changing the length (stepper or suggestion) also resets the streak.

## Emergency quiz

- All numbers of the selected country per session, random order. Pack
  size varies (3 in Germany, 6 in Switzerland), so the summary counts
  are relative to the pack.
- A round shows icon, situation ("Es brennt.") and the question
  "Welche Nummer rufst du?"; the child types the number (cell count
  hints the length; the last digit evaluates automatically, same
  PIN-pad pattern as the ladder).
- Correct on first try: success feedback with a one-line explanation
  ("118 ist die Feuerwehr."), per-number streak +1.
- Wrong: streak resets, the correct number is named in the feedback and
  must be typed once to continue (corrective encoding, no punishment).
- A number is "known" on the home grid (check mark) at streak >= 3
  across sessions.
- Summary panel: "{k} von {n} Nummern hast du direkt gewusst." plus a
  per-number gewusst/geübt list.
- **Streaks are country-scoped.** They are stored under
  `"<country>:<number>"`, because the same digits mean different things
  in different countries: 118 is the fire brigade in Switzerland and
  the ambulance in Italy. Practising the German pack never marks a
  Swiss number as known. No pack may contain two numbers with the same
  situation text, or one quiz question would have two right answers;
  the e2e suite enforces this.

## Screens

1. **Home** — header with the app title and the settings button, entry
   cards (label, chunked number, international subline, status pill,
   edit), add button (primary only when the list is empty),
   random-number training panel (length stepper + start), emergency
   panel (country flag next to the heading, intro naming the country,
   number grid, optional country note, gaps block, practice button),
   storage note ("Alle Nummern bleiben auf diesem Gerät.") and reset
   link (confirm dialog).
2. **Einstellungen** — Sprache panel (5 options) and Land panel
   (6 options with flag and dialling code).
3. **Medaillen** — level panel with progress bar plus the medal grid
   (unlocked and locked), reached from the home stats strip.
4. **Form** — type choice (Code / Telefonnummer), label, number input
   with chunking hint, international checkbox + country code + live
   preview (phones only), save, delete (edit mode, confirm dialog).
5. **Ladder** — back, entry label, step dots, instruction, cells,
   pad or Weiter, persistent feedback area.
6. **Quiz** — back, progress line, situation card, cells, pad,
   persistent feedback area, summary panel.

## Gamification (quiet)

XP measures practice, not perfection: mistakes never subtract XP,
retries cost nothing, and speed never matters.

- **XP awards**: completed ladder = 10 + digit count, +5 when the run
  included the international step (applies to entries and random
  training alike, so longer numbers earn more). Completed quiz
  session = 3 XP per first-try answer + 1 XP per corrected answer
  (effort still counts) + 5 for finishing.
- **Levels** (cumulative XP): 1 Fuchswelpe 0, 2 Schlaufuchs 30,
  3 Zahlenfuchs 80, 4 Merkfuchs 160, 5 Superfuchs 280,
  6 Meisterfuchs 450. Beyond the last level XP keeps counting. The
  titles are string ids, so they translate with the rest of the UI.
- **Medals** (9, all checks are pure functions of the stored data):
  Erste Übung / Fleissiger Fuchs / Übungsfuchs / Trainingsmeister at
  1, 3, 8 and 21 completed exercises (ladders and quiz sessions);
  Sitzt! when an entry reaches 3 completions; Notruf-Profi when every
  emergency number of the **currently selected country** has streak 3;
  International after the first completed international ladder;
  Riesenzahl for a completed random number with 10+ digits; Tippfuchs
  at 500 typed digits (effort medal, GeoTriad-style).
- **Display**: a stats strip on home (level badge, title, progress bar
  to the next level, medal count) opens the medal gallery view; locked
  medals stay visible with their description so the goal is clear.
  Rewards appear only on completion panels as a quiet block (+XP,
  level up, new medals) — no modals, no celebratory animation, in
  line with the baseline motion rules.
- **Counters** stored under `game` in `nummernfuchs.state`: `xp`,
  `exercises`, `digitsTyped` (every pad press), `bestTraining`
  (longest completed random number), `trainCleanLen`/`trainCleanCount`
  (clean-run streak for the level-up suggestion), `medals`. Reset
  clears them.

## Persistence and privacy

- Everything in `localStorage` under `nummernfuchs.state`: `entries`,
  `emergency` (streaks keyed `"<country>:<number>"`), `trainingLength`,
  `settings` (`language`, `country`) and `game`. No accounts, no
  analytics.
- **Migration**: streaks saved before the country setting existed were
  bare numbers from the Swiss pack. On load, any key without a colon is
  read as `ch:<number>` rather than dropped, so existing progress
  survives. When the loaded state does not serialise back to what was
  stored, the normalised state is written once, so a migration runs
  once instead of on every load. A save that is already current writes
  nothing, and a first-time visitor is never written to before they act.
- Reset and delete confirm first and mention that data lives on the
  device. Reset keeps `settings`.
- The only external request is flagcdn for the country flags. Flags
  render hidden and appear once loaded, so an offline device or a
  blocked CDN leaves no broken image and no empty box; the country name
  next to the flag always carries the meaning.

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
- Country choices are one per row below 30rem, because the flag plus a
  long label (Liechtenstein) does not fit two across on a phone.
- Auto-check accessibility (WCAG 2.1 AA): the behavior is announced
  before use via the visible advisory line (SC 3.2.2 On Input), results
  are announced through the persistent feedback area with
  `role="status"` instead of a forced focus jump (SC 4.1.3 Status
  Messages), no time limits are involved (SC 2.2.1), and wrong answers
  are identified in text, never by color alone (SC 3.3.1).

## Structure

- `index.html`, `css/styles.css`, `fonts/`, `js/`:
  `data.js` (languages, country packs, no copy), `i18n.js` (`t`,
  `setLanguage`, fallback), `i18n/de|en|fr|it|rm.js` (string tables),
  `util.js` (parsing, chunking, international derivation), `storage.js`
  (persistence and migration), `practice.js` (ladder/quiz logic, no
  DOM), `game.js` (XP, levels, medals, no DOM and no copy), `ui.js`
  (rendering), `app.js` (state + events), `icons.js`.
- Cache busting: every local asset URL carries the same `?v=N`
  (stylesheet link, script tag, inter-module imports, font urls).
  Bump N in all files on every release; the e2e suite enforces
  consistency and walks `js/` recursively. Current: `?v=7`.
- Tests: `tests/e2e.test.mjs` (Playwright, self-contained static
  server, no python dependency).
