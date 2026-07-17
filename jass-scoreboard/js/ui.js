// ui.js — event binding and input validation

import {
  getState,
  setTeamName,
  setTargetScore,
  addEntry,
  undoEntry,
  resetGame,
  toggleFlip,
  acknowledgeWin
} from "./state.js";
import { render } from "./renderer.js";

let selectedTeam = "A";
let errorTimeout = null;

function bindUI() {
  // Team selection
  document.getElementById("btn-team-a")?.addEventListener("click", () => selectTeam("A"));
  document.getElementById("btn-team-b")?.addEventListener("click", () => selectTeam("B"));

  // Free score entry
  const pointsInput = document.getElementById("input-points");
  document.getElementById("btn-add")?.addEventListener("click", submitPoints);
  pointsInput?.addEventListener("keydown", e => {
    if (e.key === "Enter") submitPoints();
  });

  // Quick-add chips for common Jass values
  document.querySelectorAll(".btn-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      recordScore(parseInt(chip.dataset.add, 10));
    });
  });

  // Undo / reset / flip
  document.getElementById("btn-undo")?.addEventListener("click", () => {
    undoEntry();
    render();
  });
  document.getElementById("btn-reset")?.addEventListener("click", () => {
    if (confirm("Spiel zurücksetzen? Teamnamen und Ziel bleiben erhalten.")) {
      resetGame();
      render();
    }
  });
  document.getElementById("btn-flip")?.addEventListener("click", () => {
    toggleFlip();
    render();
  });

  // Team names
  bindNameInput("edit-name-a", "A");
  bindNameInput("edit-name-b", "B");

  // Target score
  const targetInput = document.getElementById("input-target");
  targetInput?.addEventListener("change", () => {
    if (!setTargetScore(targetInput.value)) {
      targetInput.value = getState().targetScore;
      showError("Ziel muss zwischen 100 und 10000 liegen.");
      return;
    }
    render();
  });

  // Dismiss win overlay
  document.getElementById("win-overlay")?.addEventListener("click", () => {
    acknowledgeWin();
    render();
  });

  syncInputValues();
  selectTeam(selectedTeam);
}

function bindNameInput(id, teamId) {
  const input = document.getElementById(id);
  input?.addEventListener("change", () => {
    if (!setTeamName(teamId, input.value)) {
      input.value = getState().teams.find(t => t.id === teamId).name;
      showError("Name muss 1–30 Zeichen lang sein.");
      return;
    }
    render();
  });
}

function selectTeam(teamId) {
  selectedTeam = teamId;
  document.getElementById("btn-team-a")?.classList.toggle("is-active", teamId === "A");
  document.getElementById("btn-team-b")?.classList.toggle("is-active", teamId === "B");
}

function submitPoints() {
  const input = document.getElementById("input-points");
  if (!input) return;
  const value = Number(input.value);
  if (recordScore(value)) {
    input.value = "";
    input.focus();
  }
}

function recordScore(points) {
  const error = addEntry(selectedTeam, points);
  if (error) {
    showError(error);
    return false;
  }
  render();
  return true;
}

function showError(msg) {
  const el = document.getElementById("error-msg");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("visible");
  clearTimeout(errorTimeout);
  errorTimeout = setTimeout(() => el.classList.remove("visible"), 3000);
}

function syncInputValues() {
  const state = getState();
  const nameA = document.getElementById("edit-name-a");
  const nameB = document.getElementById("edit-name-b");
  const target = document.getElementById("input-target");
  if (nameA) nameA.value = state.teams[0].name;
  if (nameB) nameB.value = state.teams[1].name;
  if (target) target.value = state.targetScore;
}

export { bindUI };
