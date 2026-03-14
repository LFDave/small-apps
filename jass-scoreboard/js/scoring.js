// scoring.js — add score, calculate totals, check winner

import { getState } from "./state.js";

function addEntry(teamId, points) {
  const state = getState();
  if (state.gameFinished) return false;

  const p = parseInt(points, 10);
  if (isNaN(p) || p <= 0 || p > 500) return false;
  if (!state.teams.find(t => t.id === teamId)) return false;

  state.entries.push({
    teamId,
    points: p,
    timestamp: Date.now()
  });

  recalcTotals();
  checkWinner();
  return true;
}

function undoLastEntry() {
  const state = getState();
  if (state.entries.length === 0) return false;
  state.entries.pop();
  state.winner = null;
  state.gameFinished = false;
  recalcTotals();
  checkWinner();
  return true;
}

function recalcTotals() {
  const state = getState();
  state.totals = { A: 0, B: 0 };
  for (const entry of state.entries) {
    state.totals[entry.teamId] = (state.totals[entry.teamId] || 0) + entry.points;
  }
}

function checkWinner() {
  const state = getState();
  if (state.gameFinished) return;
  for (const team of state.teams) {
    if ((state.totals[team.id] || 0) > state.targetScore) {
      state.winner = team.id;
      state.gameFinished = true;
      return;
    }
  }
}

export { addEntry, undoLastEntry, recalcTotals, checkWinner };
