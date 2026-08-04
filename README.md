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
- Competencies that have a matching practice app link straight to it ("Üben mit ..."): all ten math competencies of the Operieren-und-Benennen aspect plus spelling (Wortwerkstatt)
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

### 🧱 Rechenturm
A calm arithmetic trainer that implements exactly one Lehrplan 21 competency: MA.1.A.3 "addieren, subtrahieren, multiplizieren, dividieren und potenzieren" (Bern edition). Its ten difficulty levels are the official Kompetenzstufen a-j of that competency; the Grundansprüche of cycles 1 and 2 are marked as badges. The Lehrplan sets no Grundanspruch for cycle 3 here, so the app doesn't invent one; a "Turmspitze" medal for a clean run on the top Stufe stands in.

**Features:**
- Task forms straight from the step texts: from adding within 20 through the Einmaleins, written-style large sums, decimals, percentages and prime factors up to power rules (aⁿ · aᵐ) and scientific notation
- Step parts the Lehrplan assigns to the calculator are implemented as mental arithmetic with easy numbers, testing the operation rather than the device
- Typed answers check themselves on the last character; whole-answer evaluation, never per character
- Quiet gamification per GAMIFICATION.md: XP, five levels (Steinleger to Turmmeister), medals for rounds, effort and the Grundansprüche; five clean rounds suggest the next Stufe, never forced, nothing locked
- Swiss number formatting (320'000), German (Swiss standard), dark coral design, works offline after first load
- Progress saved locally on the device (no sign-up, no tracking)

**Open:** [lfdave.github.io/small-apps/rechenturm](https://lfdave.github.io/small-apps/rechenturm)

### 📏 Masswerk
A calm quantities trainer that implements exactly one Lehrplan 21 competency: MA.3.A.2 "Grössen schätzen, messen, umwandeln, runden und mit ihnen rechnen" (Bern edition). Its difficulty levels are the official Kompetenzstufen of that competency; the Grundansprüche of all three cycles are marked as badges. Stufen a and f train measuring real objects, which an app cannot check honestly — they are deliberately skipped and a visible note says so.

**Features:**
- Task forms straight from the step texts: francs and rappen, clock times and durations, unit conversions (g/kg, mm/cm/m, dl/l), comparing and rounding quantities, areas and volumes, SI prefixes, and speeds (m/s ↔ km/h)
- Typed answers check themselves on the last character, with Enter for early-complete answers; numeric comparison accepts "7.0" for "7"
- Quiet gamification per GAMIFICATION.md: XP, five levels (Lehrling to Werkmeister), medals for rounds, effort and the three Grundansprüche; five clean rounds suggest the next Stufe, never forced, nothing locked
- Swiss formats (2'000, Fr./Rp., 09:40), German (Swiss standard), dark sage design, works offline after first load
- Progress saved locally on the device (no sign-up, no tracking)

**Open:** [lfdave.github.io/small-apps/masswerk](https://lfdave.github.io/small-apps/masswerk)

### 📖 Zahlenwissen
A calm trainer for exactly one Lehrplan 21 competency: MA.1.A.1 "arithmetische Begriffe und Symbole verstehen, Zahlen lesen und schreiben" (Bern edition). Twelve levels from comparing dot sets through German number words (own Zahlwort engine, Swiss spelling), place values, fraction/decimal/percent conversions, up to scientific notation and irrational numbers. Grundanspruch badges on c/g/j; dark sage design.

**Open:** [lfdave.github.io/small-apps/zahlenwissen](https://lfdave.github.io/small-apps/zahlenwissen)

### 💡 Rechenkniff
Exactly one competency: MA.1.A.4 "Zahlen zerlegen, umformen und Rechengesetze nutzen". Twelve levels from equalizing sets through commutative/associative/distributive laws, inverse operations, rounding and divisibility up to linear equations, combining terms (6a + 3b) and binomial formulas; the all-Erweiterung Stufe j is flagged as such. Grundanspruch badges on c/g/k; dark violet design.

**Open:** [lfdave.github.io/small-apps/rechenkniff](https://lfdave.github.io/small-apps/rechenkniff)

### 🔷 Formenreich
Exactly one competency: MA.2.A.1 "Begriffe und Symbole zu Form und Raum". Figures are drawn as SVG and recognized: circle to cube in cycle 1, cylinders and pyramids, circle terms, coordinates, quadrilateral types up to cone/prism and tetrahedron facts. The e2e oracle classifies every figure independently from the markup geometry. Grundanspruch badges on c/g/k; dark violet design.

**Open:** [lfdave.github.io/small-apps/formenreich](https://lfdave.github.io/small-apps/formenreich)

### 🪞 Spiegelraster
Exactly one competency: MA.2.A.2 "Figuren und Körper abbilden". Patterns, symmetry, finding mirror images, telling rotated from mirrored from translated, rotation angles and stretch factors — all on grid figures built from chiral polyominoes so the transformations never coincide. Grundanspruch badges on c/f/i; dark coral design.

**Open:** [lfdave.github.io/small-apps/spiegelraster](https://lfdave.github.io/small-apps/spiegelraster)

### ⬠ Figurenmass
Exactly one competency: MA.2.A.3 "Längen, Flächen und Volumen vergleichen, messen und berechnen". Measuring happens on the on-screen raster (reading line lengths, counting unit squares), computing goes from perimeter and area through Pythagorean triples to circles with π ≈ 3.14, pyramids, angle sums and similarity. Grundanspruch badges on b/e/i; dark blue design.

**Open:** [lfdave.github.io/small-apps/figurenmass](https://lfdave.github.io/small-apps/figurenmass)

### ⚖️ Grössenwissen
Exactly one competency: MA.3.A.1 (terms, symbols and reference quantities for Grössen, Funktionen, Daten und Zufall). Opposites, the real Swiss coin set, unit abbreviations, reference quantities, SI prefixes from Milli to Tera and Mikro/Nano, probability words, diagram types, currencies, relative frequency, Zins and Rabatt. Grundanspruch badges on c/h/l; dark amber design.

**Open:** [lfdave.github.io/small-apps/groessenwissen](https://lfdave.github.io/small-apps/groessenwissen)

### 📈 Wertepfad
Exactly one competency: MA.3.A.3 (Zahlenfolgen, Wertetabellen, Proportionalität und Funktionen). Value tables, linear and nonlinear sequences (the test oracle solves them generically via first and second differences), proportional and inverse-proportional reasoning, percentages, map scales, function values, intersections, slope and zeros. Grundanspruch badges on b/e/i; dark blue design.

**Open:** [lfdave.github.io/small-apps/wertepfad](https://lfdave.github.io/small-apps/wertepfad)

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

### ➕➖ Math Trainer
Simple math practice game for addition and subtraction.

**Play:** [lfdave.github.io/small-apps/add-subtract](https://lfdave.github.io/small-apps/add-subtract)

### 🚀 Math Trainer Mission
Mission variant of the math trainer for addition and subtraction practice.

**Play:** [lfdave.github.io/small-apps/add-subtract-mission](https://lfdave.github.io/small-apps/add-subtract-mission)
