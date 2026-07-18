# Jass Tafel — Schiefertafel Z/Z

A digital Swiss Jass slate for the browser: one chalk board with two
**Z**'s, lying (virtually) flat on the table between the two teams. Both
Z's read correctly from both sides of the table, and each team sees its
own name and total the right way up.

Full requirements and behavior rules live in [PRD.md](PRD.md) — this
README only covers what it is and how to use it.

## How to use

1. Serve the folder from any static web server (ES modules need http):
   `python3 -m http.server` → open `http://localhost:8000/index.html`
2. Edit team names and the target score (default 2500) at the top.
3. Select a team, type the round points (1–500) and hit **Eintragen** —
   or tap a quick chip (+20 / +50 / +100 / +157).
4. **↩ Rückgängig** wipes the last round's marks, **🔄 Neu** starts a new
   game, **⇅** rotates the board for the players across the table.
5. A team wins by *exceeding* the target. The game survives page
   reloads (localStorage).

Rounds are written as chalk marks like on a real Jasstafel: 100s on the
top bar, 50s on the diagonal, 20s right-aligned on the bottom bar (all
bundled in fives, `||||\`), plus a rest number that always stays below 20.
Marks are never converted between lines — chalk stays where it was
written.

## Tests

```
cd tests
npm install
node e2e.test.mjs
```

Spawns its own static server and drives the real flows in Chromium.
Screenshots land in `tests/screenshots/`.

## Tech

HTML5, CSS3, Vanilla JavaScript (ES6 modules). No frameworks, no build
step, no binary assets.
