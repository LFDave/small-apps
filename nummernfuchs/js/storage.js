// storage.js — localStorage persistence. Single key, app-prefixed per
// foundation convention. All data stays on the device.

import { LANGUAGES, COUNTRIES, DEFAULT_LANGUAGE, DEFAULT_COUNTRY } from "./data.js?v=8";

const KEY = "nummernfuchs.state";

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState();
    const data = JSON.parse(raw);
    const state = {
      entries: Array.isArray(data.entries) ? data.entries : [],
      emergency: sanitizeEmergency(data.emergency),
      trainingLength: clampLength(data.trainingLength),
      settings: sanitizeSettings(data.settings),
      game: sanitizeGame(data.game)
    };
    // A save from an older version comes back in a different shape.
    // Write the normalised one straight back so the migration runs
    // once instead of on every load. A save that is already current
    // serialises identically and nothing is written.
    if (JSON.stringify(state) !== raw) save(state);
    return state;
  } catch {
    return emptyState();
  }
}

function sanitizeSettings(s) {
  s = s && typeof s === "object" ? s : {};
  const language = LANGUAGES.some((l) => l.code === s.language) ? s.language : DEFAULT_LANGUAGE;
  const country = COUNTRIES.some((c) => c.code === s.country) ? s.country : DEFAULT_COUNTRY;
  return { language, country };
}

// Emergency streaks are keyed "<country>:<number>". Before the country
// setting existed they were bare numbers from the Swiss pack, so any
// unprefixed key is migrated to Switzerland rather than dropped.
function sanitizeEmergency(e) {
  if (!e || typeof e !== "object") return {};
  const out = {};
  for (const [key, value] of Object.entries(e)) {
    if (!Number.isFinite(value) || value < 0) continue;
    out[key.includes(":") ? key : `${DEFAULT_COUNTRY}:${key}`] = value;
  }
  return out;
}

function sanitizeGame(g) {
  const num = (v) => (Number.isFinite(v) && v >= 0 ? v : 0);
  g = g && typeof g === "object" ? g : {};
  return {
    xp: num(g.xp),
    exercises: num(g.exercises),
    digitsTyped: num(g.digitsTyped),
    bestTraining: num(g.bestTraining),
    trainCleanLen: num(g.trainCleanLen),
    trainCleanCount: num(g.trainCleanCount),
    medals: Array.isArray(g.medals) ? g.medals.filter((m) => typeof m === "string") : []
  };
}

function clampLength(n) {
  return Number.isInteger(n) ? Math.min(16, Math.max(3, n)) : 6;
}

export function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

// Reset clears progress and numbers. Language and country are settings,
// not progress, so they survive: a child on the Italian pack should not
// be thrown back to German after a reset.
export function reset(settings) {
  localStorage.removeItem(KEY);
  const state = emptyState();
  state.settings = sanitizeSettings(settings);
  save(state);
  return state;
}

function emptyState() {
  return {
    entries: [],
    emergency: {},
    trainingLength: 6,
    settings: sanitizeSettings(null),
    game: sanitizeGame(null)
  };
}
