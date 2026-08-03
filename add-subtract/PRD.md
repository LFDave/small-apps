# Mathe-Trainer (add-subtract) PRD

Version: 2026-08-03. Single source of truth for behavior.

## Task

Practice addition and subtraction. German UI, dark theme, sage accent, no accounts, no time pressure.

## Setup screen

- Operation: Plus or Minus, toggle chips, exactly one active (aria-pressed).
- Range: preset chips 0-10, 0-20, 0-50, 0-100, 10-20, 50-100, plus "Eigener Bereich" with Von/Bis number inputs (0 to 1000).
- Invalid custom range shows an inline German message in a role="status" element. No alert().
- "Los geht's" saves settings to localStorage `add-subtract.settings` and starts the quiz.
- Last used settings are restored on load.
- Home footer, below "Los geht's" and separated by a hairline: the storage note "Fortschritt und Einstellungen bleiben auf diesem Gerät." and the link-styled button "Alles zurücksetzen".
  - Reset asks first with a native confirm that names what goes and where the data lives: "Allen Fortschritt löschen? XP, Medaillen und gelöste Aufgaben verschwinden. Die Daten liegen nur auf diesem Gerät."
  - Cancelling changes nothing. Confirming clears `add-subtract.stats` back to zero, so XP, level, streak, solve counters and every medal reset together.
  - Settings survive the reset. A child practising minus up to 100 should not land back on plus up to 10.
  - The stats strip and the medal count re-render at once, and a `role="status"` line under the button says "Der Fortschritt wurde gelöscht. Die Einstellungen bleiben." It clears when the home screen is left.
  - Reset stays in the home footer, never in the quiz.

## Quiz screen

- Problem shown as `a + b =` or `a − b =`.
- The chosen range bounds the result, not the operands. The result is drawn from [min, max], then the operands are derived from it: for plus, a random split a + b = result; for minus, a = result + b with a <= max. Every number in the task stays within [0, max], and results never leave the range and are never negative.
- The setup screen states this next to the range chips: "Auch das Ergebnis bleibt in diesem Bereich."
- Answer input follows the known-length input pattern from PRODUCT.md:
  - One slot per digit of the correct answer; digit count is visible.
  - On-screen keypad 0-9 plus backspace; physical digit keys, Backspace, and Enter also work.
  - Enter on a focused button does that button's job and nothing else. Only with focus outside a button does Enter advance from "Weiter" or decline a proposal, so one keypress never triggers two actions.
  - The answer auto-checks the moment the last digit is entered. There is no confirm button.
  - The whole answer is evaluated, never single digits while typing.
  - Advisory text under the slots: "Bei der letzten Ziffer siehst du sofort, ob es stimmt." (WCAG 3.2.2)
  - Results are announced in the role="status" feedback element (WCAG 4.1.3).
  - No delays or hidden timing around evaluation (WCAG 2.2.1).
- Correct: slots lock with success styling, feedback "Richtig. a op b = x.", solved and streak counters increment and persist to `add-subtract.stats`, "Weiter" button appears and takes focus. Advancing is always this deliberate action; there is no auto-advance.
- Wrong, attempt 1: wrong positions get danger styling, feedback "Fast. Versuch es noch einmal." Correction via backspace; marks clear on edit.
- Wrong, attempt 2: same, and the Rechenweg opens by itself, feedback "Fast. Der Rechenweg unter der Aufgabe hilft dir weiter."
- Wrong, attempt 3: the correct answer is revealed in the slots, feedback names the solution, streak resets to 0, "Weiter" appears. No harsh language.
- Toolbar: "Richtig: N · Serie: M" (tabular numerals) and an "Ändern" button back to setup.

## Rechenweg

A hint shows how to get to the answer, not the answer itself.

- The quiz has a "Rechenweg zeigen" toggle under the advisory line, with a Lucide `lightbulb` icon, `aria-expanded` and `aria-controls="hint"`. Pressing it again collapses the block and the label switches to "Rechenweg ausblenden".
- The hint block sits between the toggle and the keypad and is a `role="status"` region, so opening it is announced. It holds a title naming the strategy, the steps as an unnumbered ordered list, and an optional short note.
- Every hint breaks the task into steps small enough to do in the head and leaves exactly the last one open with "?", so the learner still makes the closing move. A hint never writes out the solved task.
- The hint stays until "Weiter" and stays available after the task is solved.
- The strategy follows from the numbers of the current task:

| Task shape | Strategy | Example |
| --- | --- | --- |
| plus, one part 0 | nothing changes | 7 + 0 |
| plus, small part crosses a ten | fill up to the ten | 8 + 7 → 8 + 2 = 10, 10 + 5 = ? |
| plus, small part lands on the ten | named, no steps | 5 + 5 |
| plus, both parts under ten, no crossing | count on from the larger part | 3 + 4 |
| plus, no crossing, tens present | ones only, the tens stay | 45 + 3 → 5 + 3 = ? |
| plus, both parts whole tens | tens only, then a zero | 40 + 20 → 4 + 2 = ? |
| plus, second part a whole ten | split the other number | 23 + 40 → 40 + 20 = 60, 60 + 3 = ? |
| plus, two parts of ten or more | split the smaller into tens and ones | 23 + 45 → 45 + 20 = 65, 65 + 3 = ? |
| minus 0, or a number from itself | named, no steps | 8 − 0, 8 − 8 |
| minus, both under ten, no crossing | count back | 8 − 3 |
| minus, no crossing, tens present | ones only, the tens stay | 48 − 3 → 8 − 3 = ? |
| minus under ten from a whole ten | take it out of the last ten | 40 − 7 → 10 − 7 = 3, 30 + 3 = ? |
| minus under ten from exactly 10 | count up | 10 − 7 → 7 + ? = 10 |
| minus under ten crossing a ten | step down to the ten first | 45 − 7 → 45 − 5 = 40, 40 − 2 = ? |
| minus ten or more, ones fit | take the tens away first | 95 − 12 → 95 − 10 = 85, 85 − 2 = ? |
| minus a whole ten | split the first number | 45 − 20 → 40 − 20 = 20, 20 + 5 = ? |
| minus, both whole tens | tens only, then a zero | 40 − 20 → 4 − 2 = ? |
| minus ten or more, ones too small | count up from the smaller number over the next ten, then the next hundred | 45 − 17 → 17 + 3 = 20, 20 + 25 = 45, Zusammen: 3 + 25 = ? |

- Custom ranges up to 1000 use the same strategies. The counting-up ladder adds the hundred stone when it helps, for example 345 − 178 → 178 + 2 = 180, 180 + 20 = 200, 200 + 145 = 345.

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
- Hints cost nothing either: a task solved with the Rechenweg open earns full XP, counts as solved, and feeds every medal counter. Asking how something works is practicing too.
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
- A task solved with the Rechenweg open is not a clean run: the counter neither advances nor resets. The proposal should follow numbers a learner already does alone.
- Declining resets the counter silently and re-arms after 10 more. The counter also resets on any wrong answer, on a revealed solution, and when the quiz starts.
- The range always stays freely selectable in the settings.

## Storage

- `add-subtract.settings`: { op, min, max, custom }
- `add-subtract.stats`: { xp, solved, streak, firstTryStreak, digitsTyped, retriedSolved, minusSolved, max100Solved, rangesSolved }
- "Alles zurücksetzen" writes an empty stats object and leaves the settings key untouched.
- Whether a hint was open is per task only. It is never stored.

## Out of scope

- English toggle, sound, negative results, multiplication.
