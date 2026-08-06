// round.js — building a letter round and its answer options. Pure
// functions over the fact table and the stored progress; no DOM, no
// strings, no persistence.

import { ANIMALS } from "./animals.js?v=1";
import {
  ALPHABET, OPTION_COUNT, animalsForLetter, letterOf, letterIndex
} from "./data.js?v=1";

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

// The names offered in choose mode: the answer plus other animals, taken
// from the same letter first so the choice is decided by the clues and
// not by the initial. A thin letter borrows from the rest of the pool.
export function optionsFor(animalId, lang, count = OPTION_COUNT) {
  const answer = ANIMALS.find((a) => a.id === animalId);
  if (!answer) return [];
  const letter = letterOf(answer, lang);
  const sameLetter = shuffled(
    animalsForLetter(letter, lang).filter((a) => a.id !== animalId)
  );
  const rest = shuffled(ANIMALS.filter((a) => a.id !== animalId && letterOf(a, lang) !== letter));
  const others = [...sameLetter, ...rest].slice(0, count - 1);
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
