# Mathe-Trainer (add-subtract) PRD

Version: 2026-08-01. Single source of truth for behavior.

## Task

Practice addition and subtraction. German UI, dark theme, sage accent, no accounts, no time pressure.

## Setup screen

- Operation: Plus or Minus, toggle chips, exactly one active (aria-pressed).
- Range: preset chips 0-10, 0-20, 0-50, 0-100, 10-20, 50-100, plus "Eigener Bereich" with Von/Bis number inputs (0 to 1000).
- Invalid custom range shows an inline German message in a role="status" element. No alert().
- "Los geht's" saves settings to localStorage `add-subtract.settings` and starts the quiz.
- Last used settings are restored on load.

## Quiz screen

- Problem shown as `a + b =` or `a − b =`.
- The chosen range bounds the result, not the operands. The result is drawn from [min, max], then the operands are derived from it: for plus, a random split a + b = result; for minus, a = result + b with a <= max. Every number in the task stays within [0, max], and results never leave the range and are never negative.
- The setup screen states this next to the range chips: "Auch das Ergebnis bleibt in diesem Bereich."
- Answer input follows the known-length input pattern from PRODUCT.md:
  - One slot per digit of the correct answer; digit count is visible.
  - On-screen keypad 0-9 plus backspace; physical digit keys, Backspace, and Enter also work.
  - The answer auto-checks the moment the last digit is entered. There is no confirm button.
  - The whole answer is evaluated, never single digits while typing.
  - Advisory text under the slots: "Bei der letzten Ziffer siehst du sofort, ob es stimmt." (WCAG 3.2.2)
  - Results are announced in the role="status" feedback element (WCAG 4.1.3).
  - No delays or hidden timing around evaluation (WCAG 2.2.1).
- Correct: slots lock with success styling, feedback "Richtig. a op b = x.", solved and streak counters increment and persist to `add-subtract.stats`, "Weiter" button appears and takes focus. Advancing is always this deliberate action; there is no auto-advance.
- Wrong, attempt 1: wrong positions get danger styling, feedback "Fast. Versuch es noch einmal." Correction via backspace; marks clear on edit.
- Wrong, attempt 2: same, plus counting hint ("Beginne bei X und zähle Y weiter/zurück.").
- Wrong, attempt 3: the correct answer is revealed in the slots, feedback names the solution, streak resets to 0, "Weiter" appears. No harsh language.
- Toolbar: "Richtig: N · Serie: M" (tabular numerals) and an "Ändern" button back to setup.

## Accessibility

- lang="de", semantic headings in order, all controls are buttons or labeled inputs.
- Focus visible: 2px #F4E7B1 outline, 2px offset.
- Touch targets at least 3rem.
- Feedback never relies on color alone; the status text always states the result.
- prefers-reduced-motion disables transitions.

## Progression (per GAMIFICATION.md)

XP:

- Solving a task earns XP scaled by range: base 2 XP times a multiplier of 1 (max <= 10), 2 (<= 20), 3 (<= 50), or 4 (above).
- Retries cost nothing: a task solved after wrong attempts earns full XP. Struggling is practicing, not failing.
- Revealed solution: 1 XP flat for the effort. XP never decreases.

Levels (cumulative XP): Zahlenstart 0, Zahlenspringer 20, Rechenfuchs 60, Rechenprofi 150, Zahlenmeister 300, Rechenheld 600. Past the top, XP keeps counting. The setup screen shows a stats strip: level name, XP, progress bar to the next level (progress tokens), and the medal count linking to the gallery.

Medals (pure functions of stored counters, all visible when locked, Lucide icons):

- Startklar: 1 Aufgabe gelöst (solved >= 1)
- Dranbleiber: 8 Aufgaben gelöst (solved >= 8)
- Rechenkünstler: 34 Aufgaben gelöst (solved >= 34)
- Fleissige Finger: 144 Ziffern getippt (digitsTyped >= 144)
- Nicht aufgegeben: 21 Aufgaben im zweiten Anlauf gelöst (retriedSolved >= 21)
- Minus-Fuchs: 21 Minus-Aufgaben gelöst (minusSolved >= 21)
- Grosse Zahlen: 8 Aufgaben im Bereich bis 100 gelöst (max100Solved >= 8)
- Entdecker: eine Aufgabe in jedem vorgegebenen Bereich (rangesSolved covers all six presets)

Reward moments: after a task completes, a small persistent block under the feedback shows XP gained, a new level, and new medals. No modals, no animation, no sound. It clears with the next task.

Difficulty proposal:

- Ladder: 0-10 to 0-20 to 0-50 to 0-100. Other presets and custom ranges never trigger proposals.
- Mastery trigger per GAMIFICATION.md adaptive difficulty: a clean run here is one task solved without a wrong answer. Because a task takes seconds, the threshold is 10 consecutive clean tasks, not the 2 that longer exercises use.
- On the 10th, the success state shows a proposal instead of Weiter: "Das klappt richtig gut. Möchtest du bis N rechnen?" with "Ja, bis N" (updates the saved setting and continues immediately; the settings screen follows the change) and "Später" (continues unchanged).
- Declining resets the counter silently and re-arms after 10 more. The counter also resets on any wrong answer, on a revealed solution, and when the quiz starts.
- The range always stays freely selectable in the settings.

## Storage

- `add-subtract.settings`: { op, min, max, custom }
- `add-subtract.stats`: { xp, solved, streak, firstTryStreak, digitsTyped, retriedSolved, minusSolved, max100Solved, rangesSolved }

## Out of scope

- English toggle, sound, negative results, multiplication.
