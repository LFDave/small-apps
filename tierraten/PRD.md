# Tierraten — PRD

Version: 2026-08-06

This file is the single source of truth for what the app does. It is
updated in the same change as any behaviour change. The README is user
facing and must not repeat spec detail.

## Purpose

One animal at a time, described clue by clue until a child recognises it.
The game walks the alphabet: A first, then B, and so on. Guessing early
is the reward; nobody is ever stuck, because the answer is one tap away.

Primary user: a child of roughly 6 to 11, alone or with a parent.
Primary task: name the animal from as few clues as possible.

## The clue ladder

Nine steps, always in this order. Step one is on screen when the animal
opens; every further step is a deliberate tap.

| # | Clue | Source field |
| --- | --- | --- |
| 1 | Where it lives (continent) | `continent` |
| 2 | A country it lives in, with its flag | `country` |
| 3 | Its home: forest, sea, mountains, with people, … | `habitat` |
| 4 | Its body: legs, wings, fins, arms | `body` |
| 5 | Mammal or hatched from an egg | `birth` |
| 6 | What it eats | `food` |
| 7 | What it is covered in: fur, feathers, scales, shell, … | `cover` |
| 8 | Its colour | `color` |
| 9 | The second letter of its name | derived from the name |

The tenth thing, the name itself, is not a clue: it arrives when the
child guesses it or asks to see it.

Each step renders as a labelled fact, not a sentence. A value like "Fast
der ganzen Welt" cannot be poured into a fixed sentence frame that also
has to work in English, and a labelled row reads the same in both.

## Screens

1. **Home** — title, settings button, stats strip (level, XP, progress,
   medal count), the forward button for the next letter in the walk, the
   full A–Z grid, storage note and reset.
2. **Round** — one letter, the clue list, the guess area, the reveal
   link, a persistent feedback region.
3. **Completion** — what was guessed and with how many clues, XP gained,
   a new level and new medals when there are any, the next letter, replay
   and back home.
4. **Medals** — all nine, earned and locked, each with its goal.
5. **Settings** — language, answer mode, animals per round.

## Rules of play

- A round is one letter. It holds up to `roundSize` animals, unguessed
  ones first, so a letter opens on new content.
- The first clue is visible from the start. Every further clue is a tap
  on **Nächster Hinweis**, up to nine.
- A guess can be given at any point, from the first clue on.
- A wrong guess is named back, kept supportive, and costs nothing but the
  attempt. The turn stays open.
- **Auflösen** shows every clue and the name. It is not a failure state:
  the animal is recorded as shown, not as guessed, and the round carries
  on.
- The round ends after its last animal, on the completion screen.

## Answering

Two modes, a setting (`answerMode`), default **choose**:

- **choose** — four names to tap: the animal plus three others, taken
  from the same letter first so the clues decide and not the initial.
  Spelling "Eichhörnchen" is a second task on top of the one the game is
  about, and the primary audience is children.
- **type** — the name is written. The guess is judged as a whole word,
  never character by character. It checks itself the moment it is spelled
  right, which is the instant confirmation the known-length pattern in
  PRODUCT.md is after; everything else waits for **Tipp prüfen** or
  Enter, because the app must not leak how many letters the name has.
  The advisory line under the field states this (WCAG 3.2.2) and the
  result lands in a `role="status"` region (WCAG 4.1.3). There is no
  grace delay anywhere (WCAG 2.2.1).

A typed guess is matched on letters alone: case, spaces and hyphens fall
away, and both readings of an umlaut are produced, so "Kaenguru",
"Kanguru" and "Känguru" all reach the same animal. Listed alternatives
(`alt`) are accepted too: Delphin, Flusspferd, Rhino, Blauwal, Jak.

## The alphabet walk

- The home screen points at the first letter, from A, that still holds an
  animal nobody has guessed. Empty letters are skipped.
- The completion screen points at the first such letter **after** the one
  just played, so finishing a round moves the walk on. What is left in
  the finished letter is not lost: home still points at it, and
  **Nochmal** deals it straight away.
- Once every animal is guessed, home says so and any letter can be
  replayed.

## Letters follow the language

An animal's letter is derived from its name in the interface language, so
the alphabet is a genuinely different walk in each one: Eichhörnchen sits
under E and Squirrel under S. The second-letter clue is derived the same
way and cannot drift from the name on screen.

X holds no animal in either language. The tile stays in the grid, greyed
and marked "Kein Tier", with a line under the grid saying what that
means. Naming the gap is the honest answer; the alternative is an obscure
genus name dressed up as a common name.

## Content

84 animals in `js/animals.js`. Every field holds a stable id; labels live
in `js/i18n/` and change with the language.

- Facts are the ordinary checkable kind: range, habitat, body plan, diet,
  covering, colour.
- `country` is one country the species really occurs in, labelled "Zum
  Beispiel in" so it never reads as *the* country of a species.
- Where a species would need a hedge to fit the mammal-or-egg step
  (sharks that bear live young, for instance) the species is left out
  rather than squeezed into the binary.
- Sources: general reference works on the species named. Nothing here is
  invented; a parent can check any row against a field guide.

Guaranteed by the e2e suite: every field value comes from its own list,
every listed value carries a label in every language and is actually
used, no two animals answer to the same spelling in one language, and no
two animals present an identical row of all nine clues.

## Progression

Follows GAMIFICATION.md.

- **XP** — a guessed animal earns `4 + (9 − clues used)`, so 12 for a
  guess on the first clue and 4 when every clue was needed. Guessing
  early is harder, not faster; the clock plays no part. A shown animal
  still earns 2, because effort counts. XP only ever grows.
- **Levels** — six, at 0 / 60 / 180 / 420 / 900 / 1800 XP. The second
  arrives inside a first sitting; past the top, XP keeps counting.
- **Medals** — nine: four for animals guessed (1, 3, 8, 21), two for
  guesses made whether right or wrong (10, 40), one for three animals
  guessed with three clues or fewer, two for rounds finished (5, 13).
  Every check is a pure function of the stored counters, never an event
  flag. Locked medals stay visible with their goal.
- **Rewards** appear only on the completion screen, as a quiet block.
- **Adaptive difficulty** — after five rounds in a row with nothing
  shown, the completion screen offers five animals per round instead of
  three. One tap accepts; the setting stays free either way, and a round
  with a reveal resets the streak silently at full XP.

## Settings

Applied and saved immediately, no save button.

| Setting | Values | Default |
| --- | --- | --- |
| Sprache | Deutsch, English | Deutsch |
| So gibst du deinen Tipp | Auswählen, Tippen | Auswählen |
| Tiere pro Runde | 3, 5 | 3 |

Reset lives in the home footer with its confirmation, not in settings.

## Storage

One localStorage key, `tierraten.state`:

```
settings: { language, answerMode, roundSize }
animals:  { <id>: { solved, revealed, bestClues } }
game:     { xp, guesses, rounds, cleanRuns, cleanSize, medals[] }
```

`bestClues` is the fewest clues that animal ever needed; 0 means never
guessed. A save in an older shape is normalised once on load. Reset
clears progress and keeps the settings. Nothing leaves the device: no
accounts, no analytics, no cookies.

## Requests

The flag images from flagcdn are the only external request, and they are
decorative: the country name carries the clue, and an image that fails
removes itself so an offline reader never sees a broken icon. Everything
else, fonts and icons included, ships with the app.

## Out of scope

- Photographs of the animals. They would settle the guess instantly and
  turn the clue ladder into decoration.
- Sound. Nothing here needs it.
- More than two interface languages, for now. Each one needs a full set
  of animal names, not just interface strings.
