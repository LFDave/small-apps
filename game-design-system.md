# Game Design System

Premium dark theme design system for single-page web games. Professional yet playful aesthetic with teal→violet gradient accents.

---

## Design Tokens

### Colors

```css
:root {
    /* Base darks (background hierarchy) */
    --bg0: #070a12;          /* Deepest background */
    --bg1: #0b1020;          /* Mid background */
    --bg2: #0f1830;          /* Surface/card background */
    --stroke: rgba(255,255,255,.08);  /* Subtle borders */

    /* Accent colors */
    --teal: #39d0c5;         /* Primary accent */
    --violet: #6e5cff;       /* Secondary accent */

    /* Semantic colors */
    --correct: #22c55e;      /* Success green */
    --incorrect: #ef4444;    /* Error red */

    /* Text hierarchy */
    --text-primary: rgba(255,255,255,.92);
    --text-secondary: rgba(255,255,255,.55);
}
```

### Spacing

```css
:root {
    --spacing-unit: 8px;     /* Base unit - multiply for consistent spacing */
    --border-radius: 16px;   /* Standard radius for cards/panels */
}
```

**Usage pattern**: `calc(var(--spacing-unit) * N)` where N = 0.5, 1, 1.5, 2, 2.5, 3, 4, 5

---

## Gradients

### Primary Accent Gradient

```css
--g-accent: linear-gradient(135deg, #39d0c5, #6e5cff);
```

Use for: Primary CTA buttons, gradient text on headings, active toggle states

### Hairline Stroke Gradient

```css
--g-stroke: linear-gradient(135deg,
    rgba(57, 208, 197, .35),
    rgba(255,255,255,.10),
    rgba(110, 92, 255, .25)
);
```

Use for: 1px top border on cards (via `::before` pseudo-element)

### Reward Glow

```css
--g-glow: radial-gradient(circle at 30% 20%,
    rgba(57, 208, 197, .25), transparent 55%),
  radial-gradient(circle at 80% 10%,
    rgba(110, 92, 255, .18), transparent 55%);
```

Use for: Achievement unlocks, reward moments, special card highlights

---

## Typography

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
```

### Heading Styles

```css
h1 {
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    background: var(--g-accent);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

h2 {
    font-size: 1.5rem;
    font-weight: 700;
    background: var(--g-accent);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
```

### Body Text

```css
/* Primary text */
color: var(--text-primary);  /* rgba(255,255,255,.92) */

/* Secondary/muted text */
color: var(--text-secondary);  /* rgba(255,255,255,.55) */

/* Labels (uppercase) */
font-size: 0.75rem;
text-transform: uppercase;
letter-spacing: 0.1em;
font-weight: 600;
```

---

## Transitions & Animations

### Standard Transition

```css
transition: all .15s cubic-bezier(0.4, 0, 0.2, 1);
```

### Animation Keyframes

```css
/* Fade in with slight upward motion */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Modal slide in */
@keyframes slideIn {
    from { transform: translateY(-30px) scale(0.95); opacity: 0; }
    to { transform: translateY(0) scale(1); opacity: 1; }
}

/* Success celebration */
@keyframes celebrate {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
}

/* Error shake */
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    75% { transform: translateX(8px); }
}

/* Attention pulse */
@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.01); }
}
```

---

## Background Atmosphere

```css
body {
    background-color: var(--bg0);
    background-image:
        radial-gradient(ellipse 1200px 700px at 15% 0%,
            rgba(57, 208, 197, .12), transparent 55%),
        radial-gradient(ellipse 900px 650px at 90% 10%,
            rgba(110, 92, 255, .12), transparent 55%);
    min-height: 100vh;
}
```

---

## Component Recipes

### Secondary Button

```css
button, .btn {
    background-color: var(--bg2);
    color: var(--text-primary);
    border: 1px solid var(--stroke);
    padding: calc(var(--spacing-unit) * 1.75) calc(var(--spacing-unit) * 3);
    font-size: 1rem;
    font-weight: 600;
    border-radius: 14px;
    cursor: pointer;
    transition: transform .15s ease, border-color .15s ease, box-shadow .15s ease;
    min-height: 48px;
    box-shadow: 0 4px 16px rgba(0,0,0,.25);
}

button:hover:not(:disabled) {
    transform: translateY(-2px);
    border-color: rgba(255,255,255,.14);
    box-shadow: 0 8px 24px rgba(0,0,0,.35);
}

button:active:not(:disabled) {
    transform: translateY(0);
}

button:disabled {
    opacity: 0.35;
    cursor: not-allowed;
}
```

### Primary CTA Button

```css
button.primary {
    border-radius: 14px;
    color: rgba(255,255,255,.95);
    border: 1px solid rgba(255,255,255,.12);
    background:
        linear-gradient(180deg, rgba(255,255,255,.18), transparent 40%),
        var(--g-accent);
    box-shadow: 0 10px 24px rgba(0,0,0,.35),
                0 0 40px rgba(57, 208, 197, .15);
    font-weight: 700;
}

button.primary:hover:not(:disabled) {
    transform: translateY(-2px);
    filter: brightness(1.05);
    box-shadow: 0 12px 32px rgba(0,0,0,.4),
                0 0 50px rgba(57, 208, 197, .2);
}

button.primary:active:not(:disabled) {
    transform: translateY(0);
    filter: brightness(.98);
}
```

### Card / Panel

```css
.card {
    background-color: var(--bg2);
    border-radius: var(--border-radius);
    padding: calc(var(--spacing-unit) * 4);
    border: 1px solid var(--stroke);
    box-shadow: 0 12px 40px rgba(0,0,0,.35);
    position: relative;
    overflow: hidden;
}

/* Optional: gradient top stroke */
.card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--g-stroke);
}
```

### Answer/Option Tile

Neutral by default, accent treatment only on interaction states.

```css
.option-btn {
    background: var(--bg2);
    border: 1px solid rgba(255,255,255,.08);
    color: var(--text-primary);
    padding: calc(var(--spacing-unit) * 2) calc(var(--spacing-unit) * 3);
    padding-right: calc(var(--spacing-unit) * 4);
    font-size: 1.15rem;
    font-weight: 600;
    border-radius: 14px;
    cursor: pointer;
    transition: all .15s cubic-bezier(0.4, 0, 0.2, 1);
    min-height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(0,0,0,.25);
    position: relative;
}

/* Chevron affordance indicator */
.option-btn::after {
    content: "›";
    position: absolute;
    right: calc(var(--spacing-unit) * 2);
    font-size: 1.4rem;
    font-weight: 300;
    color: rgba(255,255,255,.2);
    transition: all .15s ease;
}

.option-btn:hover:not(:disabled)::after {
    color: var(--teal);
    transform: translateX(2px);
}

.option-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    border-color: rgba(255,255,255,.15);
    background: 
        linear-gradient(180deg, rgba(255,255,255,.03), transparent 50%),
        var(--bg2);
    box-shadow: 
        0 8px 24px rgba(0,0,0,.35),
        0 0 0 1px rgba(255,255,255,.05);
}

.option-btn:active:not(:disabled) {
    transform: translateY(0);
    background: 
        linear-gradient(180deg, transparent, rgba(0,0,0,.05) 80%),
        var(--bg2);
    box-shadow: 0 2px 8px rgba(0,0,0,.3);
    transition-duration: .05s;
}

.option-btn:focus-visible {
    outline: none;
    border-color: var(--teal);
    box-shadow: 
        0 4px 16px rgba(0,0,0,.25),
        0 0 0 3px rgba(57, 208, 197, .25);
}

.option-btn:disabled {
    background: rgba(255,255,255,.02);
    border-color: rgba(255,255,255,.04);
    color: var(--text-secondary);
    opacity: 0.5;
    cursor: not-allowed;
}

.option-btn:disabled::after {
    display: none;
}
```

### Semantic States (Correct/Incorrect)

```css
.option-btn.correct {
    background:
        radial-gradient(ellipse 600px 300px at 50% 0%,
            rgba(34, 197, 94, .2), transparent 60%),
        var(--bg2);
    border-color: rgba(34, 197, 94, .5);
    color: #86efac;
    animation: celebrate 0.5s ease;
    box-shadow: 
        0 4px 24px rgba(0,0,0,.3),
        0 0 0 1px rgba(34, 197, 94, .3);
}

.option-btn.correct::after {
    content: "✓";
    color: #22c55e;
    font-weight: 700;
    transform: none;
}

.option-btn.incorrect {
    background:
        radial-gradient(ellipse 600px 300px at 50% 0%,
            rgba(239, 68, 68, .2), transparent 60%),
        var(--bg2);
    border-color: rgba(239, 68, 68, .5);
    color: #fca5a5;
    animation: shake 0.5s ease;
    box-shadow: 
        0 4px 24px rgba(0,0,0,.3),
        0 0 0 1px rgba(239, 68, 68, .25);
}

.option-btn.incorrect::after {
    content: "✗";
    color: #ef4444;
    font-weight: 700;
    transform: none;
}
```

### Highlighted/Selected State

```css
.option-btn.highlighted {
    border-color: rgba(57, 208, 197, .5);
    background: 
        radial-gradient(ellipse 800px 400px at 50% 0%,
            rgba(57, 208, 197, .12), transparent 60%),
        var(--bg2);
    animation: pulse 1.5s ease infinite;
    box-shadow: 
        0 4px 24px rgba(0,0,0,.3),
        0 0 0 1px rgba(57, 208, 197, .3);
}

.option-btn.highlighted::after {
    content: "→";
    color: var(--teal);
}
```

### Badge / Pill

```css
.badge {
    display: inline-block;
    background:
        linear-gradient(180deg, rgba(255,255,255,.15), transparent 50%),
        var(--g-accent);
    color: rgba(255,255,255,.95);
    padding: calc(var(--spacing-unit) * .75) calc(var(--spacing-unit) * 2);
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    box-shadow: 0 4px 12px rgba(57, 208, 197, .25);
}
```

### Stat Chip

```css
.stat-item {
    display: flex;
    align-items: center;
    gap: calc(var(--spacing-unit));
    background-color: var(--bg2);
    padding: calc(var(--spacing-unit) * 1.25) calc(var(--spacing-unit) * 2);
    border-radius: 12px;
    border: 1px solid var(--stroke);
    box-shadow: 0 4px 12px rgba(0,0,0,.2);
}

.stat-value {
    font-weight: 700;
    background: var(--g-accent);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 1.2rem;
}
```

### Toggle Button Group

```css
.toggle-btn {
    padding: calc(var(--spacing-unit)) calc(var(--spacing-unit) * 2);
    font-size: 0.9rem;
    min-height: 36px;
    min-width: 80px;
    /* Inherits from secondary button */
}

.toggle-btn.active {
    background:
        linear-gradient(180deg, rgba(255,255,255,.15), transparent 45%),
        var(--g-accent);
    border-color: transparent;
    color: rgba(255,255,255,.95);
}
```

### Modal

```css
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    inset: 0;
    background-color: rgba(7, 10, 18, 0.9);
    backdrop-filter: blur(8px);
    justify-content: center;
    align-items: center;
    animation: fadeIn 0.3s ease;
}

.modal.active {
    display: flex;
}

.modal-content {
    background-color: var(--bg2);
    border: 1px solid var(--stroke);
    border-radius: 20px;
    padding: calc(var(--spacing-unit) * 5);
    max-width: 440px;
    width: 90%;
    text-align: center;
    animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 24px 64px rgba(0,0,0,.5);
    position: relative;
    overflow: hidden;
}

.modal-content::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--g-stroke);
}

.modal-title {
    font-size: 1.75rem;
    margin-bottom: calc(var(--spacing-unit) * 2);
    background: var(--g-accent);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
}

.modal-message {
    font-size: 1rem;
    margin-bottom: calc(var(--spacing-unit) * 3);
    color: var(--text-secondary);
    line-height: 1.6;
}
```

### Reward Modal (with glow)

```css
.reward-modal .modal-content {
    position: relative;
}

.reward-modal .modal-content::after {
    content: "";
    position: absolute;
    inset: -30px;
    background: var(--g-glow);
    filter: blur(30px);
    opacity: 0.7;
    z-index: -1;
}
```

### Achievement Card

```css
.achievement-card {
    background-color: var(--bg2);
    border: 1px solid var(--stroke);
    border-radius: var(--border-radius);
    padding: calc(var(--spacing-unit) * 2.5);
    text-align: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 8px 24px rgba(0,0,0,.25);
    position: relative;
    overflow: hidden;
}

.achievement-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--g-stroke);
}

.achievement-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0,0,0,.35);
}

.achievement-card.locked {
    opacity: 0.45;
}

/* Reward glow for unlocked */
.achievement-card:not(.locked)::after {
    content: "";
    position: absolute;
    inset: -16px;
    background: var(--g-glow);
    filter: blur(20px);
    opacity: 0.5;
    z-index: -1;
}

.achievement-name {
    font-weight: 700;
    background: var(--g-accent);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.achievement-card.locked .achievement-name {
    background: none;
    -webkit-text-fill-color: var(--text-secondary);
}
```

### Feedback Message

```css
.feedback-message {
    padding: calc(var(--spacing-unit) * 2) calc(var(--spacing-unit) * 3);
    border-radius: 14px;
    text-align: center;
    font-size: 1.1rem;
    font-weight: 600;
    box-shadow: 0 8px 24px rgba(0,0,0,.25);
}

.feedback-message.correct {
    background:
        radial-gradient(600px 300px at 30% 20%,
            rgba(34, 197, 94, .2), transparent 55%),
        rgba(34, 197, 94, .08);
    color: #86efac;
    border: 1px solid rgba(34, 197, 94, .3);
}

.feedback-message.incorrect {
    background:
        radial-gradient(600px 300px at 30% 20%,
            rgba(239, 68, 68, .2), transparent 55%),
        rgba(239, 68, 68, .08);
    color: #fca5a5;
    border: 1px solid rgba(239, 68, 68, .3);
}
```

---

## Layout Patterns

### Header

```css
header {
    background-color: var(--bg2);
    padding: calc(var(--spacing-unit) * 2.5);
    text-align: center;
    border-bottom: 1px solid var(--stroke);
}
```

### Footer

```css
footer {
    background-color: var(--bg2);
    padding: calc(var(--spacing-unit) * 2.5);
    text-align: center;
    border-top: 1px solid var(--stroke);
    font-size: 0.8rem;
    color: var(--text-secondary);
}

footer a {
    background: var(--g-accent);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-decoration: none;
    font-weight: 600;
}
```

### Centered Content Container

```css
main {
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 900px;
    width: 100%;
    margin: 0 auto;
    padding: calc(var(--spacing-unit) * 3);
}
```

### Screen Transitions

```css
.screen {
    display: none;
    animation: fadeIn 0.4s ease-out;
}

.screen.active {
    display: flex;
    flex-direction: column;
    flex: 1;
}
```

---

## Accessibility

### Focus States

```css
*:focus-visible {
    outline: 2px solid var(--teal);
    outline-offset: 2px;
}

/* For elements with custom focus styling */
.option-btn:focus-visible {
    outline: none;
    border-color: var(--teal);
    box-shadow: 
        0 4px 16px rgba(0,0,0,.25),
        0 0 0 3px rgba(57, 208, 197, .25);
}
```

### Screen Reader Only

```css
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}
```

---

## Responsive Breakpoints

```css
@media (max-width: 600px) {
    h1 { font-size: 1.5rem; }
    
    main {
        padding: calc(var(--spacing-unit) * 2);
    }
    
    .card {
        padding: calc(var(--spacing-unit) * 3);
    }
    
    .option-btn {
        font-size: 1.05rem;
        padding: calc(var(--spacing-unit) * 1.5);
        min-height: 56px;
    }
}
```

---

## Design Principles

1. **Neutral by default** — Reserve accent colors for interaction states (hover, focus, selected, success/error)
2. **Depth through shadow** — Use layered shadows rather than borders for depth
3. **Gradient text for emphasis** — Apply `--g-accent` with background-clip for important headings
4. **Subtle affordances** — Chevrons, lift on hover, press feedback communicate interactivity
5. **Reward moments** — Use `--g-glow` sparingly for achievements and celebrations
6. **Consistent spacing** — Always use multiples of `--spacing-unit` (8px base)
7. **Dark-first approach** — `--bg0` < `--bg1` < `--bg2` hierarchy for surfaces
