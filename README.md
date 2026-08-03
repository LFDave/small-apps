# small-apps

small apps for various use cases

## Apps Available

### 🧭 Lehrplan-Kompass
A calm curriculum explorer for the Swiss Lehrplan 21 (Bern edition). Kids and parents pick a school cycle, browse all subject areas, and tick off competencies they already master: "Das kann ich schon."

**Features:**
- All 16 subject and module areas of Lehrplan 21 with 90 competence areas and 363 competencies, for all three cycles (kindergarten to 9th grade)
- 721 cycle-specific, child-friendly German texts in Ich-form, each written at the level of that cycle's Grundanspruch, with the official Lehrplan 21 code next to every entry for parents and teachers
- Self-assessment checklist per cycle with per-subject progress bars
- Checks are stored separately per cycle, so moving up a cycle starts a fresh round on the same competencies at their higher level
- German (Swiss standard), dark, quiet design; works offline after first load
- Progress saved locally on the device (no sign-up, no tracking)

**Open:** [lfdave.github.io/small-apps/lehrplan-kompass](https://lfdave.github.io/small-apps/lehrplan-kompass)

### 👣 Zahlensprung
A calm counting trainer that implements exactly one Lehrplan 21 competency: MA.1.A.2 "flexibel zählen, Zahlen ordnen, Ergebnisse überschlagen" (Bern edition). Its ten difficulty levels are the official Kompetenzstufen a-j of that competency; the Grundansprüche of the three cycles are marked as badges.

**Features:**
- Four procedurally generated task forms straight from the step texts: counting dots, continuing number sequences (forwards/backwards, step sizes per Stufe), ordering numbers (decimals, fractions territory, negatives), and estimation (Überschlagen with order-of-magnitude distractors)
- Number ranges from the Lehrplan bound every number in a task, including the answer (20 / 100 / 1000 / 1 million / decimals)
- Typed answers check themselves on the last character; ordering evaluates once all numbers are picked — whole-answer evaluation, never per character
- Quiet gamification per GAMIFICATION.md: XP, five levels, medals for rounds, effort and the three Grundansprüche; five clean rounds suggest the next Stufe, never forced, nothing locked
- Swiss number formatting (13'567), German (Swiss standard), dark amber design, works offline after first load
- Progress saved locally on the device (no sign-up, no tracking)

**Open:** [lfdave.github.io/small-apps/zahlensprung](https://lfdave.github.io/small-apps/zahlensprung)

### 🃏 Jass Scoreboard (Schiefertafel Z/Z)
A browser-based digital Jass scoreboard that replicates a traditional Swiss chalk slate board with the classic Z/Z layout.

**Features:**
- One SVG slate scene with two chalk Z's — both readable from both sides of the table (point-symmetric Z geometry, far half rotated 180°)
- Classic Schieber chalk notation: 100s on the top bar, 50s on the diagonal, 20s right-aligned on the bottom bar — all bundled tally-style (`||||\`), rest as chalk number; marks stack up per round and are never converted (chalk stays chalk)
- Free score entry (1–500) plus quick chips (+20/+50/+100/+157); negative entries correct mistakes (marks wiped highest → lowest)
- Two teams, editable names and target score (default 2500)
- Win detection with animated overlay (gold glow, chalk particles)
- Undo last entry, reset game, rotate board orientation
- JPG export of the board (just the two Z's, no controls)
- Game state persisted to localStorage — resume on page reload
- Responsive: works on mobile (320px+), tablet, and desktop
- No external frameworks — pure HTML, CSS, Vanilla JS

**Play:** [lfdave.github.io/small-apps/jass-scoreboard](https://lfdave.github.io/small-apps/jass-scoreboard)

### 🌍 GeoTriad - Geography Quiz Game
A fun, educational geography quiz game for kids around 10 years old!

**Features:**
- 195 countries with bilingual names (English/German)
- 3 game modes: Guess the Continent, Guess the Country, Guess the Capital
- Earn coins and track your fire streak 🔥
- Smart hint system (3 hints per question)
- Unlock medals for achievements and extraordinary place names
- Dark mode with kid-friendly design
- Fully keyboard accessible
- Mobile-friendly design
- Progress saved locally (no sign-up required)

**Play:** [lfdave.github.io/small-apps/geotriad-game](https://lfdave.github.io/small-apps/geotriad-game)

### 🎮 Pokémon Identification Game
A fun, kid-friendly browser game where players identify Pokémon from images and earn coins and medals!

**Features:**
- 151 Generation 1 Pokémon to identify
- Earn coins for correct answers
- Unlock achievements and medals
- Track your streak and progress
- Dark mode with high contrast accessibility
- Fully keyboard accessible
- Mobile-friendly design
- Progress saved locally (no sign-up required)

**Play:** [lfdave.github.io/small-apps/pokemon-game](https://lfdave.github.io/small-apps/pokemon-game)

### 🦊 Nummernfuchs
A calm memory trainer that helps kids learn real numbers by heart: door codes, family phone numbers (incl. the international +41 form), and the emergency numbers of their country.

**Features:**
- Learn any code or phone number in spoken chunks (e.g. `640 132`)
- Learning ladder: the number disappears group by group until it is typed fully from memory
- Phone numbers optionally practiced in international form (+41 79 ...)
- Five languages: German (default), French, Italian, Rumantsch, English
- Six country packs with a situation quiz: Switzerland, Germany, Austria, France, Italy, Liechtenstein
- Where a country has no short number for a service, the app says so and names what to dial instead
- Random-number training with selectable length (3-16 digits)
- Quiet gamification: XP, fox levels and medals that reward practice, never speed
- Supportive feedback, no time pressure while typing
- Progress saved locally on the device (no sign-up, no tracking)

**Play:** [lfdave.github.io/small-apps/nummernfuchs](https://lfdave.github.io/small-apps/nummernfuchs)

### ✏️ Wortwerkstatt
A calm spelling trainer for kids, built on one Lehrplan 21 competency (D.4 Schreiben, D.4.F.1, Kanton Bern edition of 23.06.2016). Every rule shows the competency step it comes from — and says so plainly when a rule is extra practice the Lehrplan text does not name.

**Features:**
- 22 rules, 66 chapters, 484 tasks across the three cycles, plus 9 texts of 42 sentences
- Three chapters per rule that rise in difficulty and always end in writing: tap the answer, then tap a harder one, then type it yourself
- A writing-only mode: whole texts written out sentence by sentence, mixing capitals, end marks and commas, with the paragraph taking shape on screen
- Seven kinds of task: letters missing in a word, a word missing from a sentence, a punctuation mark, the missing word typed out, a whole sentence written correctly, and memory words written from memory
- Rules that straddle a cycle boundary in the source appear on both cycle lists and share one set of counters
- Distractors are the mistakes children really make (`Schport`, `Beischpiel`), so only the rule decides
- Written answers check themselves on the last character, no confirm button
- Supportive feedback that stays on screen, with the rule shown once the answer is in
- Quiet gamification: XP, levels and eleven medals that reward practice, never speed or perfection
- After five clean rounds the app suggests the next cycle, and never forces it; no chapter is ever locked
- German and English interface; the practice material stays German, because German spelling cannot be taught with English sentences
- No external requests at all, works offline after the first load
- Progress saved locally on the device (no sign-up, no tracking)

**Play:** [lfdave.github.io/small-apps/wortwerkstatt](https://lfdave.github.io/small-apps/wortwerkstatt)

### ➕➖ Math Trainer
Simple math practice game for addition and subtraction.

**Play:** [lfdave.github.io/small-apps/add-subtract](https://lfdave.github.io/small-apps/add-subtract)

### 🚀 Math Trainer Mission
Mission variant of the math trainer for addition and subtraction practice.

**Play:** [lfdave.github.io/small-apps/add-subtract-mission](https://lfdave.github.io/small-apps/add-subtract-mission)
