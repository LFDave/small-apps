# small-apps

small apps for various use cases

## Apps Available

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
A calm spelling trainer for kids, built around the three Lehrplan 21 cycles. One rule at a time, with the explanation appearing after the answer instead of before it.

**Features:**
- 17 orthography rules across the three cycles (1./2. Klasse, 3.-6. Klasse, 7.-9. Klasse)
- Cycle 2 covers the classic stumbling blocks: sch, sp/st, ng/nk, abstract nouns, end-of-sentence marks
- Four kinds of task: letters missing inside a word, a word missing from a sentence, a punctuation mark, and memory words written from memory
- Distractors are the mistakes children really make (`Schport`, `Beischpiel`), so only the rule decides
- Rounds of six tasks per rule, or mixed practice across the whole cycle
- Memory words check themselves on the last letter, no confirm button
- Supportive feedback that stays on screen, with the rule shown once the answer is in
- Quiet gamification: XP, levels and medals that reward practice, never speed or perfection
- After five clean rounds the app suggests the next cycle, and never forces it
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
