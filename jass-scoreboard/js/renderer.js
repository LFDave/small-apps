// renderer.js — render board, tallies, totals, win state

import { getState } from "./state.js";

/**
 * Converts a point value into tally mark strings.
 * Groups of 5 become "||||\" and remainders are "|".
 */
function renderTallies(points) {
  const groups = Math.floor(points / 5);
  const remainder = points % 5;
  let result = "";
  for (let i = 0; i < groups; i++) {
    result += "||||\\  ";
  }
  for (let i = 0; i < remainder; i++) {
    result += "| ";
  }
  return result.trim();
}

/**
 * Build the HTML for one team's entry list.
 */
function buildEntriesHTML(teamId) {
  const state = getState();
  const teamEntries = state.entries.filter(e => e.teamId === teamId);
  if (teamEntries.length === 0) {
    return '<span class="no-entries">—</span>';
  }
  return teamEntries
    .map(e => `<div class="tally-row">${renderTallies(e.points)}</div>`)
    .join("");
}

/**
 * Full render of the scoreboard.
 */
function render() {
  const state = getState();

  const [topTeam, bottomTeam] = state.flipped
    ? [state.teams[1], state.teams[0]]
    : [state.teams[0], state.teams[1]];

  // Team name headers
  document.getElementById("team-a-name").textContent = topTeam.name;
  document.getElementById("team-b-name").textContent = bottomTeam.name;

  // Entries (tally marks)
  document.getElementById("entries-a").innerHTML = buildEntriesHTML(topTeam.id);
  document.getElementById("entries-b").innerHTML = buildEntriesHTML(bottomTeam.id);

  // Totals
  document.getElementById("total-a").textContent = state.totals[topTeam.id] || 0;
  document.getElementById("total-b").textContent = state.totals[bottomTeam.id] || 0;

  // Target score display
  const targetEl = document.getElementById("target-score-display");
  if (targetEl) targetEl.textContent = state.targetScore;

  // Win state
  renderWinState(topTeam, bottomTeam);

  // Update team select options to reflect current names
  const teamSelect = document.getElementById("select-team");
  if (teamSelect) {
    for (const opt of teamSelect.options) {
      const team = state.teams.find(t => t.id === opt.value);
      if (team) opt.textContent = team.name;
    }
  }

  // Input area enable/disable (undo and reset always stay enabled)
  const inputArea = document.getElementById("score-input-area");
  if (inputArea) {
    inputArea.classList.toggle("disabled", state.gameFinished);
    const inputs = inputArea.querySelectorAll("input, select");
    inputs.forEach(el => { el.disabled = state.gameFinished; });
    const addBtn = document.getElementById("btn-add");
    if (addBtn) addBtn.disabled = state.gameFinished;
  }

  // Highlight winning panel
  const panelA = document.getElementById("panel-a");
  const panelB = document.getElementById("panel-b");
  if (panelA && panelB) {
    panelA.classList.remove("winner-panel");
    panelB.classList.remove("winner-panel");
    if (state.gameFinished && state.winner) {
      const winnerId = state.winner;
      const winnerIsTop = topTeam.id === winnerId;
      if (winnerIsTop) panelA.classList.add("winner-panel");
      else panelB.classList.add("winner-panel");
    }
  }
}

function renderWinState(topTeam, bottomTeam) {
  const state = getState();
  const overlay = document.getElementById("win-overlay");
  if (!overlay) return;

  if (state.gameFinished && state.winner) {
    const winningTeam =
      state.winner === topTeam.id ? topTeam : bottomTeam;
    document.getElementById("win-team-name").textContent = winningTeam.name;
    overlay.classList.add("active");
  } else {
    overlay.classList.remove("active");
  }
}

export { render, renderTallies };
