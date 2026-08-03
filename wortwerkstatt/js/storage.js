// storage.js — localStorage persistence. Single key, app-prefixed per
// the repo convention. All data stays on the device.

import {
  LANGUAGES, CONTENT_LANGUAGES, CYCLES,
  DEFAULT_LANGUAGE, DEFAULT_CONTENT_LANGUAGE, DEFAULT_CYCLE
} from "./data.js?v=7";

const KEY = "wortwerkstatt.state";

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState();
    const data = JSON.parse(raw);
    const state = {
      settings: sanitizeSettings(data.settings),
      chapters: sanitizeChapters(data.chapters),
      texts: sanitizeChapters(data.texts),
      game: sanitizeGame(data.game)
    };
    // A save from an older version comes back in a different shape.
    // Write the normalised one straight back so the migration runs once
    // instead of on every load. A save that is already current
    // serialises identically and nothing is written.
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
    contentLanguage: CONTENT_LANGUAGES.some((c) => c.code === s.contentLanguage)
      ? s.contentLanguage : DEFAULT_CONTENT_LANGUAGE,
    cycle: CYCLES.includes(s.cycle) ? s.cycle : DEFAULT_CYCLE
  };
}

// Progress is counted per chapter. Saves written before chapters
// existed stored it per rule under `topics`; those keys do not map onto
// chapters, so they are dropped rather than guessed at. XP, medals and
// settings survive, which is the part a child would notice.
// Chapters and texts are both "how often, and how often cleanly", so
// they normalise the same way.
function sanitizeChapters(chapters) {
  if (!chapters || typeof chapters !== "object") return {};
  const out = {};
  for (const [id, value] of Object.entries(chapters)) {
    if (!value || typeof value !== "object") continue;
    out[id] = { rounds: num(value.rounds), clean: num(value.clean) };
  }
  return out;
}

function sanitizeGame(g) {
  g = g && typeof g === "object" ? g : {};
  return {
    xp: num(g.xp),
    rounds: num(g.rounds),
    charsTyped: num(g.charsTyped),
    written: num(g.written),
    cleanCycle: num(g.cleanCycle),
    cleanCount: num(g.cleanCount),
    cycles: Array.isArray(g.cycles) ? g.cycles.filter((c) => CYCLES.includes(c)) : [],
    medals: Array.isArray(g.medals) ? g.medals.filter((m) => typeof m === "string") : []
  };
}

function num(v) {
  return Number.isFinite(v) && v >= 0 ? v : 0;
}

export function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

// Reset clears progress. Language, learning language and cycle are
// settings, not progress, so they survive: a child in cycle 3 should
// not land back in cycle 1 after clearing their XP.
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
    chapters: {},
    texts: {},
    game: sanitizeGame(null)
  };
}
