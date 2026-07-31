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

- Problem shown as `a + b =` or `a − b =`. For minus, a >= b (operands swap), so results are never negative.
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

## Storage

- `add-subtract.settings`: { op, min, max, custom }
- `add-subtract.stats`: { solved, streak }

## Out of scope

- English toggle, sound, negative results, multiplication.
