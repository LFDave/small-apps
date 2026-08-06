// storage.js — localStorage persistence. One key, app-prefixed per the
// repo convention. Everything stays on the device.

import {
  LANGUAGES, ANSWER_MODES, ROUND_SIZES,
  DEFAULT_LANGUAGE, DEFAULT_ANSWER_MODE, DEFAULT_ROUND_SIZE
} from "./data.js?v=1";
import { ANIMALS } from "./animals.js?v=1";

const KEY = "tierraten.state";

const KNOWN_IDS = new Set(ANIMALS.map((a) => a.id));

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState();
    const data = JSON.parse(raw);
    const state = {
      settings: sanitizeSettings(data.settings),
      animals: sanitizeAnimals(data.animals),
      game: sanitizeGame(data.game)
    };
    // A save from an older version comes back in a different shape.
    // Writing the normalised one straight back runs the migration once
    // instead of on every load; an already current save serialises
    // identically and nothing is written.
    if (JSON.stringify(state) !== raw) save(state);
    return state;
  } catch {
    return emptyState();
  }
}

function sanitizeSettings(s) {
  s = s && typeof s === "object" ? s : {};
  return {
    language: LANGUAGES.some((l) => l.code === s.language) ? s.language : DEFAULT_LANGUAGE,
    answerMode: ANSWER_MODES.includes(s.answerMode) ? s.answerMode : DEFAULT_ANSWER_MODE,
    roundSize: ROUND_SIZES.includes(s.roundSize) ? s.roundSize : DEFAULT_ROUND_SIZE
  };
}

// Per animal: how often it was guessed, how often it was shown, and the
// fewest clues it ever took. An id the fact table no longer carries is
// dropped rather than kept as a ghost the medals would count.
function sanitizeAnimals(animals) {
  if (!animals || typeof animals !== "object") return {};
  const out = {};
  for (const [id, value] of Object.entries(animals)) {
    if (!KNOWN_IDS.has(id) || !value || typeof value !== "object") continue;
    out[id] = {
      solved: num(value.solved),
      revealed: num(value.revealed),
      bestClues: num(value.bestClues)
    };
  }
  return out;
}

function sanitizeGame(g) {
  g = g && typeof g === "object" ? g : {};
  return {
    xp: num(g.xp),
    guesses: num(g.guesses),
    rounds: num(g.rounds),
    cleanRuns: num(g.cleanRuns),
    cleanSize: ROUND_SIZES.includes(g.cleanSize) ? g.cleanSize : DEFAULT_ROUND_SIZE,
    medals: Array.isArray(g.medals) ? g.medals.filter((m) => typeof m === "string") : []
  };
}

function num(v) {
  return Number.isFinite(v) && v >= 0 ? v : 0;
}

export function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

// Reset clears progress. Language, answer mode and round size are
// settings, not progress, so they survive: a child who reads English
// should not land back in German after clearing their XP.
export function reset(settings) {
  localStorage.removeItem(KEY);
  const state = emptyState();
  state.settings = sanitizeSettings(settings);
  save(state);
  return state;
}

function emptyState() {
  return {
    settings: sanitizeSettings(null),
    animals: {},
    game: sanitizeGame(null)
  };
}
