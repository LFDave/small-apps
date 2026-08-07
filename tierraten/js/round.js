// round.js — building a letter round and its answer options. Pure
// functions over the fact table and the stored progress; no DOM, no
// strings, no persistence.

import { ANIMALS } from "./animals.js?v=2";
import {
  ALPHABET, CLUES, OPTION_COUNT, animalsForLetter, letterOf, letterIndex
} from "./data.js?v=2";

function shuffled(list) {
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function isSolved(data, id) {
  return Boolean(data.animals[id] && data.animals[id].solved > 0);
}

// The animals of one letter, in the order the round will show them:
// what the child has not guessed yet comes first, so a letter opens on
// new content instead of repeating what already sits.
export function pickAnimals(letter, lang, size, data) {
  const pool = animalsForLetter(letter, lang);
  const fresh = shuffled(pool.filter((a) => !isSolved(data, a.id)));
  const known = shuffled(pool.filter((a) => isSolved(data, a.id)));
  return [...fresh, ...known].slice(0, size).map((a) => a.id);
}

// How far down the ladder two animals stay indistinguishable: the number
// of leading clues on which they agree. Two African animals score at
// least 1, two African animals from the same country at least 2. It
// counts the *leading* run, not the total, because that is where the
// child actually gets to stop reading.
export function sharedPrefix(a, b) {
  let n = 0;
  for (const clue of CLUES) {
    if (!clue.field || a[clue.field] !== b[clue.field]) break;
    n += 1;
  }
  return n;
}

// The names offered in choose mode: the answer plus other animals from
// the same letter, picked so the early clues cannot split them.
//
// Picking at random is what made the game give itself away — a letter
// holding one African animal would offer it beside three from three
// other continents, and clue one was the whole game. Ranking candidates
// by how long they stay indistinguishable puts the answer's own
// continent on the board first, so the child has to go deeper. Ties stay
// shuffled, so the same animal does not always come with the same
// company.
//
// A letter too thin to fill the board borrows from the rest of the pool.
// The initial gives those away, but a letter with one animal has no
// honest alternative, and the borrowed names are ranked the same way so
// the clues still have work to do.
export function optionsFor(animalId, lang, count = OPTION_COUNT) {
  const answer = ANIMALS.find((a) => a.id === animalId);
  if (!answer) return [];
  const letter = letterOf(answer, lang);
  const byCloseness = (list) => shuffled(list)
    .map((a) => ({ a, score: sharedPrefix(answer, a) }))
    .sort((x, y) => y.score - x.score)
    .map((x) => x.a);

  const sameLetter = byCloseness(
    animalsForLetter(letter, lang).filter((a) => a.id !== animalId)
  );
  const others = sameLetter.length >= count - 1
    ? sameLetter.slice(0, count - 1)
    : [
      ...sameLetter,
      ...byCloseness(ANIMALS.filter((a) => a.id !== animalId && letterOf(a, lang) !== letter))
        .slice(0, count - 1 - sameLetter.length)
    ];
  return shuffled([answer, ...others]).map((a) => a.id);
}

// Where the alphabet walk stands: the first letter that still holds an
// animal nobody has guessed. Empty letters are skipped, because there is
// nothing there to walk to. Returns null once every animal is guessed.
export function nextLetter(lang, data, after = null) {
  const start = after ? ALPHABET.indexOf(after) + 1 : 0;
  const order = [...ALPHABET.slice(start), ...ALPHABET.slice(0, start)];
  for (const letter of order) {
    const pool = animalsForLetter(letter, lang);
    if (pool.length && pool.some((a) => !isSolved(data, a.id))) return letter;
  }
  return null;
}

// One row per letter for the home grid, with what is solved so far.
export function letterRows(lang, data) {
  return letterIndex(lang).map(({ letter, animals }) => ({
    letter,
    total: animals.length,
    solved: animals.filter((a) => isSolved(data, a.id)).length
  }));
}
