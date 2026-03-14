// storage.js — localStorage persistence

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
    // storage may be unavailable (e.g. private mode quota)
    console.warn("Could not save state:", e);
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Could not load state:", e);
    return null;
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn("Could not clear state:", e);
  }
}

export { saveState, loadState, clearState };
