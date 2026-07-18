// storage.js — localStorage persistence, serialization, restoration

const STORAGE_KEY = "jassScoreboardState";

function saveState(state) {
  const toSave = {
    teams: state.teams,
    entries: state.entries,
    targetScore: state.targetScore,
    flipped: state.flipped,
    winner: state.winner,
    gameFinished: state.gameFinished
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    // storage may be unavailable (private mode, quota)
    console.warn("Could not save state:", e);
  }
}

/**
 * Restore a saved state. Entries from older versions of the app
 * (which stored {barType, value} instead of {points}) are migrated.
 */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return null;
    if (Array.isArray(data.entries)) {
      data.entries = data.entries.map(migrateEntry).filter(Boolean);
    } else {
      data.entries = [];
    }
    return data;
  } catch (e) {
    console.warn("Could not load state:", e);
    return null;
  }
}

function migrateEntry(entry) {
  if (!entry || (entry.teamId !== "A" && entry.teamId !== "B")) return null;
  let points = null;
  if (Number.isInteger(entry.points) && entry.points >= 1) points = entry.points;
  else if (Number.isInteger(entry.value) && entry.value >= 1) points = entry.value;
  if (points === null || points > 500) return null;
  return { teamId: entry.teamId, points, timestamp: entry.timestamp || 0 };
}

export { saveState, loadState };
