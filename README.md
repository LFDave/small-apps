# small-apps

small apps for various use cases

## Apps Available

### 🧭 Lehrplan-Apps (moved)
The Lehrplan-Kompass and the math practice apps now live in their own repo: [LFDave/lehrplan-apps](https://github.com/LFDave/lehrplan-apps), deployed at [lfdave.github.io/lehrplan-apps](https://lfdave.github.io/lehrplan-apps). The Wortwerkstatt below stays here and is linked from the Kompass.

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
- Seven kinds of task: letters missing in a word, a word missing from a sentence, a punctuation mark, the missing word typed out, a whole sentence written correctly, memory words written from memory, and one sentence of a text in the writing mode
- Rules that straddle a cycle boundary in the source appear on both cycle lists and share one set of counters
- Distractors are the mistakes children really make (`Schport`, `Beischpiel`), so only the rule decides
- A written word checks itself on the last character; a written sentence is judged as soon as it looks finished, with a Fertig button for anything still ambiguous, and a wrong sentence comes back word by word so one missing comma marks one word
- Supportive feedback that stays on screen, with the rule shown once the answer is in
- Quiet gamification: XP, levels and eleven medals that reward practice, never speed or perfection
- After five clean rounds the app suggests the next cycle, and never forces it; no chapter is ever locked
- German and English interface; the practice material stays German, because German spelling cannot be taught with English sentences
- No external requests at all, works offline after the first load
- Progress saved locally on the device (no sign-up, no tracking)

**Play:** [lfdave.github.io/small-apps/wortwerkstatt](https://lfdave.github.io/small-apps/wortwerkstatt)

### 🐾 Tierraten
A calm animal guessing game for children. One animal is described clue by clue until you recognise it, and the game walks through the alphabet from A to Z.

**Features:**
- 84 animals, from the ant to the zebra, each with a full row of checkable facts
- Nine clues in a fixed ladder: continent, a country with its flag, habitat, body, mammal or egg, food, covering, colour, and the second letter of the name
- Guess from the first clue on; the earlier you get it, the more you earn
- A wrong guess costs nothing and keeps the turn open, and the answer is always one tap away
- Two ways to answer: tap one of four names, or write it yourself and watch it lock in the moment it is spelled right
- The alphabet follows the language, so the squirrel sits under E in German and under S in English
- The one letter with no animal stays in the grid and says so, instead of quietly disappearing
- Quiet gamification: XP, six levels and nine medals that reward practice, never speed
- After five clean rounds the app offers longer rounds, and never forces them
- German and English interface
- Works offline after the first load, apart from the country flags
- Progress saved locally on the device (no sign-up, no tracking)

**Play:** [lfdave.github.io/small-apps/tierraten](https://lfdave.github.io/small-apps/tierraten)

### ➕➖ Math Trainer
Simple math practice game for addition and subtraction.

**Play:** [lfdave.github.io/small-apps/add-subtract](https://lfdave.github.io/small-apps/add-subtract)

### 🚀 Math Trainer Mission
Mission variant of the math trainer for addition and subtraction practice.

**Play:** [lfdave.github.io/small-apps/add-subtract-mission](https://lfdave.github.io/small-apps/add-subtract-mission)
