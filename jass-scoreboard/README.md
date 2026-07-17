# Jass Tafel — Schiefertafel Z/Z

A browser-based digital Jass scoreboard that replicates a traditional Swiss chalk
slate board (Jasstafel). The whole board is rendered as **one SVG slate scene**
with two chalk **Z** shapes — one per team — exactly like the physical board
lying flat on the table between the two teams.

## The two Z's are readable from both sides

Like a real Jasstafel, the board is meant to sit between players facing each
other. Two things make it work:

1. **Each Z is drawn point-symmetric about its own centre** — the top bar, the
   diagonal and the bottom bar map exactly onto themselves under a 180°
   rotation. A "Z" viewed upside down is still a "Z" (never an "S").
2. **The far half of the slate is rotated 180°**, so the far team's name,
   total and marks face the player sitting across the table.

The result: from *either* side of the table you always see two proper Z's, and
each team reads its own name and total the right way up. The ⇅ button rotates
the board (swaps which team sits at the near edge) without touching the data.

## Chalk notation

Scores are entered as normal round values (1–500). The board decomposes each
team's running total into the classic Schieber chalk notation:

| Line | Value per mark |
|---|---|
| Top bar | 100 points (bundled tally-style: `||||\` per 500) |
| Diagonal | 50 points |
| Bottom bar | 20 points |
| Chalk number | remainder below 20 (e.g. `+ 17`) |

The board is always kept canonical — five twenties are automatically
"exchanged" for a hundred, like a tidy chalk writer would do.

## Features

- 🧮 **Free score entry** — any 1–500 points per round, plus quick chips (+20/+50/+100/+157)
- ✏️ **Chalk marks derived from totals** — authentic 100/50/20 notation on the Z lines
- 🔄 **Deterministic chalk jitter** — hand-drawn look that stays stable across re-renders
- 🏆 **Win detection** — a team wins by *exceeding* the target (default 2500)
- ↩ **Undo** — remove the last recorded round (also after a win)
- 🆕 **Reset** — clear scores, keep team names / target / orientation
- ⇅ **Rotate board** — swap which team faces the near edge
- 💾 **Persistence** — state saved to `localStorage` (`jassScoreboardState`), old-format entries are migrated
- 📱 **Responsive** — mobile (320px+), tablet, desktop
- ♿ **Accessible** — keyboard operable, live screen-reader status, reduced-motion support

## Usage

1. Open `index.html` via any static web server (ES modules require http, e.g. `python3 -m http.server`)
2. Edit team names and the target score at the top
3. Select a team, type the round points (or tap a quick chip)
4. **Eintragen** records the round; **↩ Rückgängig** undoes; **🔄 Neu** resets
5. **⇅** rotates the board for the players on the other side of the table

## Project Structure

```
jass-scoreboard/
├── index.html          # Root HTML structure, DOM containers
├── css/
│   └── styles.css      # Slate/chalk styling, layout, animations
├── js/
│   ├── app.js          # Application bootstrap
│   ├── state.js        # Global state definition and mutations
│   ├── storage.js      # localStorage persistence + legacy migration
│   ├── scoring.js      # Validation, totals, win check, chalk decomposition
│   ├── renderer.js     # Single-SVG slate scene: Z's, marks, totals, win state
│   └── ui.js           # Event binding and input validation
└── README.md
```

## Technologies

HTML5, CSS3, Vanilla JavaScript (ES6 modules). No frameworks, no external libraries.

## Game Rules

- Two teams record scores round by round
- A team wins when its total **exceeds** the target score (default **2500**)
- Valid point entries: integers from 1 to 500
- After a win, score entry is disabled; undo and reset remain available
