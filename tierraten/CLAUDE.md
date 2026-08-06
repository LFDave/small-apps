# CLAUDE.md — tierraten

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behaviour change.
- Follows the repo baseline (root PRODUCT.md/DESIGN.md): dark-only tokens
  in `css/styles.css`, accent family **amber**. Amber is not cosmetic:
  the game marks a wrong guess in danger and a right one in success on
  almost every screen, and sage and coral sit too close to both to stay
  legible as "this is the app's colour".

## The fact table is the app

- `js/animals.js` holds one row per animal and **only ids**, never
  labels. Labels live in `js/i18n/` and are looked up by convention:
  `valueKey("color", "schwarz-weiss")` is `colorSchwarzWeiss`. Adding a
  value without its label is a test failure, not a silent fallback.
- **Do not invent facts.** Every row is the ordinary checkable kind, and
  a parent must be able to hold it against a field guide. `country` is
  *one* country the species really occurs in and is labelled "Zum
  Beispiel in" for exactly that reason.
- **The mammal-or-egg step is a binary on purpose, so the content bends
  to it, not the other way round.** Species that would need a hedge
  (sharks that bear live young) are left out. Never add an animal whose
  clue would have to lie to fit.
- Adding an animal: give it a name in **every** interface language, and
  check what letter that name lands on. The letter is derived
  (`letterOf`), so a new English name can empty or fill a letter without
  anyone touching the alphabet.
- The e2e suite enforces: every value from its own list, every listed
  value labelled in every language **and actually used**, no two animals
  answering to the same spelling in one language, and no two animals with
  an identical row of all nine clues. That last one is what keeps the
  ninth clue from leaving a coin toss.

## Letters, and the gap at X

- The alphabet is derived from the names, so it is genuinely different in
  German and English. Never hardcode a letter onto an animal.
- **X holds no animal and says so.** The tile stays in the grid, greyed,
  with a line under the grid explaining it. Do not fill the gap with a
  genus name dressed up as a common name (`Xerus` is `Borstenhörnchen` in
  German), and do not hide the letter — a silent hole in the alphabet is
  worse than a named one.

## Engine

- **The clue ladder is data.** `CLUES` in `js/data.js` gives the order,
  the field, the id namespace and the icon. The last step has no field:
  the second letter is derived from the name on screen so it cannot drift
  from it. Reordering the ladder is a one-line change there.
- **Clues render as labelled facts, not sentences.** A value like "Fast
  der ganzen Welt" cannot be poured into a fixed sentence frame that also
  has to work in English. Never turn a clue back into a template.
- **A guess is judged as a whole word.** `matchesName` strips case,
  spaces and hyphens and produces both readings of an umlaut, so
  "Kaenguru" and "Kanguru" both reach "Känguru". A child must never lose
  an answer to a key they cannot type.
- **Typing mode auto-checks on an exact match only.** That is the
  narrowest possible trigger and the reason there is no character count
  on screen: showing the length would hand over a clue the ladder is
  supposed to charge for. The button and Enter cover everything else.
  Never widen the auto-check, and never add a length hint.
- **The `input` handler must not re-render** on a non-matching value, or
  the caret jumps mid-word.
- `js/round.js` is pure: picking animals, building options, finding the
  next letter. `js/game.js` is pure: XP, levels, medals. Neither touches
  the DOM or a string.
- Medal checks stay **pure functions of the stored counters**. The stored
  `medals` list exists only so the completion screen can name what is
  new; it never decides what is earned.
- Two "next letter" answers exist and they are different on purpose: home
  points at the first unfinished letter from A, the completion screen at
  the first one **after** the letter just played, so a round moves the
  walk on. Do not collapse them.
- Icons: `js/icons.js` is generated from lucide-static SVGs; add icons by
  appending to `PATHS` and keep the Lucide names.

## Requests

The flag images from flagcdn are the only external request. They are
decorative — the country name carries the clue — and an image that fails
removes itself, so an offline reader never gets a broken icon. Keep it
that way: nothing else may leave the device.

## Tests

`cd tests && npm install && node e2e.test.mjs` — must pass before
reporting back. It enforces `?v=N` consistency, string-table parity, the
fact-table rules above, the XP shape from GAMIFICATION.md, and that every
language fits a 360px viewport. It identifies the animal on screen by
reading the nine clue rows back through the same string table the app
rendered them from, so it cannot drift from the engine.
