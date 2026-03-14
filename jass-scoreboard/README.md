# Jass Scoreboard — Schiefertafel Z/Z

A browser-based digital Jass scoreboard that replicates the look and feel of a traditional Swiss chalk slate board (Jasstafeln) with the classic Z/Z layout.

## Features

- 🎯 **Z/Z Board Layout** — Visual division of two mirrored team areas with red chalk guide lines
- 📊 **Tally Mark Display** — Points shown as chalk tally marks (`||||\ ||||\ |`) instead of numbers
- 🔢 **Numeric Totals** — Running totals displayed at the bottom of each panel
- 🏆 **Win Detection** — Animated win overlay when a team exceeds the target score
- ↩ **Undo** — Remove the last recorded entry
- 🔄 **Reset** — Clear all scores while keeping team names and target score
- ⇄ **Flip Board** — Swap panel positions for players on opposite sides of the table
- 💾 **Persistence** — Game state saved to `localStorage` and restored on page reload
- 📱 **Responsive** — Works on mobile (320px+), tablet, and desktop

## Usage

1. Open `index.html` in any modern browser (requires ES module support)
2. Edit team names by clicking on the name fields at the top
3. Set your target score (default: 2500)
4. Select a team, enter points (1–500), and click **Eintragen**
5. Use **↩ Rückgängig** to undo the last entry
6. Use **🔄 Neu** to reset the game
7. Use **⇄** to flip the board orientation

## Project Structure

```
jass-scoreboard/
├── index.html          # Root HTML structure
├── css/
│   └── styles.css      # Chalk board styling, Z/Z grid, animations
├── js/
│   ├── app.js          # Application bootstrap
│   ├── state.js        # Global state definition and mutations
│   ├── storage.js      # localStorage persistence
│   ├── scoring.js      # Score entry, totals, win check
│   ├── renderer.js     # Board, tallies, totals, win state rendering
│   └── ui.js           # Event binding and input validation
├── assets/
│   ├── textures/       # (placeholder for optional slate texture)
│   └── fonts/          # (placeholder for optional chalk fonts)
└── README.md
```

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript (ES6 modules)

No external frameworks or libraries are used.

## Game Rules

- Two teams record scores round by round
- A team wins when its total **exceeds** the target score
- Default target: **2500 points**
- Valid point entries: integers from 1 to 500
- After a win, score entry is disabled but undo remains available

## Tally Mark Rendering

Points are displayed as tally marks:

| Points | Display               |
|--------|-----------------------|
| 3      | `\| \| \|`            |
| 5      | `\|\|\|\|\ `          |
| 7      | `\|\|\|\|\  \| \|`    |
| 10     | `\|\|\|\|\  \|\|\|\|\ ` |

Groups of 5 are rendered as `||||\ ` and remainders as `| `.
