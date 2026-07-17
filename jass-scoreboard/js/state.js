// state.js — global state definition, mutations, validation

import { computeTotals, findWinner, validatePoints } from "./scoring.js";
import { saveState } from "./storage.js";

function defaults() {
  return {
    teams: [
      { id: "A", name: "Team A" },
      { id: "B", name: "Team B" }
    ],
    entries: [],
    totals: { A: 0, B: 0 },
    targetScore: 2500,
    flipped: false,
    winner: null,
    gameFinished: false,
    // transient, never persisted: whether the win overlay was dismissed
    winAcknowledged: false
  };
}

let state = defaults();

function recompute() {
  state.totals = computeTotals(state.entries);
  state.winner = findWinner(state.totals, state.targetScore);
  state.gameFinished = state.winner !== null;
  if (!state.gameFinished) state.winAcknowledged = false;
}

function initState(saved) {
  state = defaults();
  if (saved && typeof saved === "object") {
    if (Array.isArray(saved.teams)) {
      for (const team of state.teams) {
        const savedTeam = saved.teams.find(t => t && t.id === team.id);
        if (savedTeam && typeof savedTeam.name === "string") {
          const name = savedTeam.name.trim().slice(0, 30);
          if (name.length >= 1) team.name = name;
        }
      }
    }
    if (Array.isArray(saved.entries)) state.entries = saved.entries;
    const target = Math.round(Number(saved.targetScore));
    if (Number.isFinite(target) && target >= 100 && target <= 10000) {
      state.targetScore = target;
    }
    state.flipped = saved.flipped === true;
  }
  recompute();
}

function getState() {
  return state;
}

function setTeamName(teamId, name) {
  const trimmed = String(name).trim();
  if (trimmed.length < 1 || trimmed.length > 30) return false;
  const team = state.teams.find(t => t.id === teamId);
  if (!team) return false;
  team.name = trimmed;
  saveState(state);
  return true;
}

function setTargetScore(value) {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n) || n < 100 || n > 10000) return false;
  state.targetScore = n;
  recompute();
  saveState(state);
  return true;
}

function addEntry(teamId, points) {
  if (state.gameFinished) return "Spiel beendet — Rückgängig oder Neu.";
  if (!state.teams.find(t => t.id === teamId)) return "Ungültiges Team.";
  const error = validatePoints(points);
  if (error) return error;
  state.entries.push({ teamId, points, timestamp: Date.now() });
  recompute();
  saveState(state);
  return null;
}

function undoEntry() {
  if (state.entries.length === 0) return false;
  state.entries.pop();
  recompute();
  saveState(state);
  return true;
}

function resetGame() {
  // Clear entries/winner, keep team names, target score and flip state
  state.entries = [];
  recompute();
  saveState(state);
}

function toggleFlip() {
  state.flipped = !state.flipped;
  saveState(state);
}

function acknowledgeWin() {
  state.winAcknowledged = true;
}

export {
  initState,
  getState,
  setTeamName,
  setTargetScore,
  addEntry,
  undoEntry,
  resetGame,
  toggleFlip,
  acknowledgeWin
};
