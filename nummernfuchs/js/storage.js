// storage.js — localStorage persistence. Single key, app-prefixed per
// foundation convention. All data stays on the device.

const KEY = "nummernfuchs.state";

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState();
    const data = JSON.parse(raw);
    return {
      entries: Array.isArray(data.entries) ? data.entries : [],
      emergency: data.emergency && typeof data.emergency === "object" ? data.emergency : {},
      trainingLength: clampLength(data.trainingLength),
      game: sanitizeGame(data.game)
    };
  } catch {
    return emptyState();
  }
}

function sanitizeGame(g) {
  const num = (v) => (Number.isFinite(v) && v >= 0 ? v : 0);
  g = g && typeof g === "object" ? g : {};
  return {
    xp: num(g.xp),
    exercises: num(g.exercises),
    digitsTyped: num(g.digitsTyped),
    bestTraining: num(g.bestTraining),
    medals: Array.isArray(g.medals) ? g.medals.filter((m) => typeof m === "string") : []
  };
}

function clampLength(n) {
  return Number.isInteger(n) ? Math.min(16, Math.max(3, n)) : 6;
}

export function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function reset() {
  localStorage.removeItem(KEY);
  return emptyState();
}

function emptyState() {
  return {
    entries: [],
    emergency: {},
    trainingLength: 6,
    game: sanitizeGame(null)
  };
}
