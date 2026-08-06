// data.js — settings vocabulary, the clue ladder, and the selectors the
// rest of the app reads the fact table through. No DOM, no strings.

import { ANIMALS } from "./animals.js?v=1";

export const LANGUAGES = [
  { code: "de", label: "Deutsch", htmlLang: "de-CH" },
  { code: "en", label: "English", htmlLang: "en" }
];
export const DEFAULT_LANGUAGE = "de";

// How a guess is given. Choosing is the default: the primary audience is
// children, and spelling "Eichhörnchen" is a second task on top of the
// one the game is about. Typing is one tap away for anyone who wants it.
export const ANSWER_MODES = ["choose", "type"];
export const DEFAULT_ANSWER_MODE = "choose";

export const ROUND_SIZES = [3, 5];
export const DEFAULT_ROUND_SIZE = 3;

// How many names a choose-mode round offers. One of them is the answer.
export const OPTION_COUNT = 4;

// Consecutive rounds solved without a single reveal before the app
// offers the longer round. A suggestion, never a forced step.
export const MASTERY_RUNS = 5;

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// The ladder, in the order the clues appear. `field` names the column in
// the fact table; `set` is the id namespace its value belongs to, which
// is also how the label is looked up (habitat + "Wald" -> habitatWald).
// The last step has neither: the second letter is derived from the name
// in the language on screen, so it can never drift from it.
export const CLUES = [
  { id: "kontinent", field: "continent", set: "continent", icon: "globe" },
  { id: "land", field: "country", set: "country", icon: "map-pin" },
  { id: "lebensraum", field: "habitat", set: "habitat", icon: "trees" },
  { id: "koerper", field: "body", set: "body", icon: "footprints" },
  { id: "nachwuchs", field: "birth", set: "birth", icon: "egg" },
  { id: "nahrung", field: "food", set: "food", icon: "utensils" },
  { id: "huelle", field: "cover", set: "cover", icon: "layers" },
  { id: "farbe", field: "color", set: "color", icon: "palette" },
  { id: "buchstabe", field: null, set: null, icon: "case-upper" }
];

export const CLUE_COUNT = CLUES.length;

/* ── Names and letters ───────────────────────────────────────────── */

export function nameOf(animal, lang) {
  return animal.name[lang] || animal.name[DEFAULT_LANGUAGE];
}

// The letter an animal sits under follows its name in the language on
// screen. Eichhörnchen is E and Squirrel is S, so the alphabet really is
// a different walk in each language.
export function letterOf(animal, lang) {
  return nameOf(animal, lang).charAt(0).toUpperCase();
}

export function animalsForLetter(letter, lang) {
  return ANIMALS.filter((a) => letterOf(a, lang) === letter);
}

export function animalById(id) {
  return ANIMALS.find((a) => a.id === id) || null;
}

// Every letter of the alphabet, with how many animals it holds. Letters
// with none stay in the grid and say so, rather than disappearing.
export function letterIndex(lang) {
  return ALPHABET.map((letter) => ({ letter, animals: animalsForLetter(letter, lang) }));
}

// The second letter, the last clue before the name itself.
export function secondLetterOf(animal, lang) {
  return nameOf(animal, lang).charAt(1).toUpperCase();
}

/* ── Answer matching ─────────────────────────────────────────────── */

// A typed guess is compared on letters alone: case, spaces, hyphens and
// the two ways of writing an umlaut all fall away first. Both readings
// of an umlaut are produced ("Kaenguru" and "Kanguru" both reach
// "Känguru"), so a child is never marked wrong for the spelling of a
// letter they cannot type.
function stripped(text) {
  return String(text).toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
}

function transliterated(text) {
  return String(text).toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
}

export function guessForms(text) {
  return new Set([stripped(text), transliterated(text)].filter(Boolean));
}

// All the spellings that count as this animal's name: the name itself
// plus any listed alternative, in the language on screen.
export function acceptedForms(animal, lang) {
  const words = [nameOf(animal, lang), ...((animal.alt && animal.alt[lang]) || [])];
  const forms = new Set();
  for (const word of words) for (const f of guessForms(word)) forms.add(f);
  return forms;
}

export function matchesName(animal, lang, guess) {
  const accepted = acceptedForms(animal, lang);
  for (const form of guessForms(guess)) if (accepted.has(form)) return true;
  return false;
}

/* ── Label keys ──────────────────────────────────────────────────── */

// A value id becomes a string id by convention: "schwarz-weiss" in the
// colour set is colorSchwarzWeiss. Nothing maps ids to labels by hand,
// so a new value cannot be added without its label showing up missing.
export function pascal(id) {
  return String(id).split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
}

export function valueKey(set, value) {
  return set + pascal(value);
}

export function clueLabelKey(clueId) {
  return "clue" + pascal(clueId) + "Label";
}
