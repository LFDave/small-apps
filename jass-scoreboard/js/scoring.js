// scoring.js — add score, calculate totals, check winner

import { getState } from "./state.js";

// Each bar type and its point value per mark
const BAR_VALUES = { top: 100, diagonal: 50, bottom: 20 };

function addEntry(teamId, barType) {
  const state = getState();
  if (state.gameFinished) return false;
  if (!BAR_VALUES[barType]) return false;
  if (!state.teams.find(t => t.id === teamId)) return false;

  state.entries.push({
    teamId,
    barType,
    value: BAR_VALUES[barType],
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
    // Support both new (value) and legacy (points) saved entries
    const pts = entry.value || entry.points || 0;
    state.totals[entry.teamId] = (state.totals[entry.teamId] || 0) + pts;
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
