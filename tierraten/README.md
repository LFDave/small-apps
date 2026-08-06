# Tierraten

A calm animal guessing game for children. One animal is described clue by
clue until you recognise it, and the game walks through the alphabet from
A to Z.

**Play:** [lfdave.github.io/small-apps/tierraten](https://lfdave.github.io/small-apps/tierraten)

## What it is

Pick a letter and the game shows an animal whose name starts with it. It
begins with a single clue: which part of the world the animal lives in.
Each tap on **Nächster Hinweis** adds one more, up to nine: the country
with its flag, its home, its body, whether it is a mammal or hatches from
an egg, what it eats, what it is covered in, its colour, and finally the
second letter of its name.

Guess whenever you like. The earlier you get it, the more you earn. A
wrong guess costs nothing and the turn stays open. If you would rather
just see it, **Auflösen** shows the answer and the round carries on.

84 animals, from the ant to the zebra.

## How to play

1. The home screen points at the next letter in your walk. Tap it, or
   pick any letter from the grid.
2. Read the clue. Guess, or take another clue.
3. Give your guess by tapping one of four names, or by writing the name
   yourself. In writing mode the guess locks in the moment it is spelled
   right, so there is nothing to confirm.
4. Finish the round and see what you earned.

Levels, XP and medals come from practising, never from being fast. A
letter you have finished is marked in the grid.

## Settings

The gear button in the header opens three settings, each saved the moment
you change it:

- **Sprache** — German or English. The animal names change with it, so
  the alphabet is a different walk: the squirrel sits under E in German
  and under S in English.
- **So gibst du deinen Tipp** — tap one of four names, or write it.
- **Tiere pro Runde** — three animals or five.

Progress lives on your device only. There is no account, no tracking and
nothing to sign up for. **Fortschritt löschen** in the footer clears it.

## Running it

It is a static page. Open it from any web server:

```bash
cd tierraten
python3 -m http.server
```

Then open <http://localhost:8000>. A file:// open will not work, because
the app is built from ES modules.

Apart from the country flags, which come from flagcdn, the app makes no
network requests and keeps working offline after the first load.

## Tests

```bash
cd tierraten/tests
npm install
node e2e.test.mjs
```

The suite spawns its own static server and drives the real flows in
Chromium. It must pass before any change is reported as done.
