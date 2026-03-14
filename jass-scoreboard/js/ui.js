// ui.js — handle user input, bind event listeners, validate inputs

import { getState, setTeamName, setTargetScore, flipBoard, resetState } from "./state.js";
import { addEntry, undoLastEntry } from "./scoring.js";
import { render } from "./renderer.js";
import { saveState } from "./storage.js";

let errorTimeout = null;

function persist() {
  saveState(getState());
}

function bindEvents() {
  // Score entry form
  const addBtn = document.getElementById("btn-add");
  if (addBtn) {
    addBtn.addEventListener("click", handleAddScore);
  }

  // Allow pressing Enter in the points input
  const pointsInput = document.getElementById("input-points");
  if (pointsInput) {
    pointsInput.addEventListener("keydown", e => {
      if (e.key === "Enter") handleAddScore();
    });
  }

  // Undo button
  const undoBtn = document.getElementById("btn-undo");
  if (undoBtn) {
    undoBtn.addEventListener("click", () => {
      undoLastEntry();
      render();
      persist();
    });
  }

  // Reset button
  const resetBtn = document.getElementById("btn-reset");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Reset the game? Team names and target score will be kept.")) {
        resetState();
        render();
        persist();
        // Re-enable score input
        const inputArea = document.getElementById("score-input-area");
        if (inputArea) {
          const inputs = inputArea.querySelectorAll("input, button, select");
          inputs.forEach(el => { el.disabled = false; });
          inputArea.classList.remove("disabled");
        }
        document.getElementById("win-overlay")?.classList.remove("active");
      }
    });
  }

  // Flip button
  const flipBtn = document.getElementById("btn-flip");
  if (flipBtn) {
    flipBtn.addEventListener("click", () => {
      flipBoard();
      render();
      persist();
    });
  }

  // Team name edits (blur to save)
  const nameA = document.getElementById("edit-name-a");
  if (nameA) {
    nameA.addEventListener("change", () => {
      const ok = setTeamName("A", nameA.value);
      if (!ok) nameA.value = getState().teams.find(t => t.id === "A").name;
      render();
      persist();
    });
  }

  const nameB = document.getElementById("edit-name-b");
  if (nameB) {
    nameB.addEventListener("change", () => {
      const ok = setTeamName("B", nameB.value);
      if (!ok) nameB.value = getState().teams.find(t => t.id === "B").name;
      render();
      persist();
    });
  }

  // Target score edit
  const targetInput = document.getElementById("input-target");
  if (targetInput) {
    targetInput.addEventListener("change", () => {
      const ok = setTargetScore(targetInput.value);
      if (!ok) {
        targetInput.value = getState().targetScore;
        showError("Target score must be between 100 and 10000.");
      } else {
        render();
        persist();
      }
    });
  }

  // Close win overlay (click anywhere on it)
  const winOverlay = document.getElementById("win-overlay");
  if (winOverlay) {
    winOverlay.addEventListener("click", () => {
      winOverlay.classList.remove("active");
    });
  }
}

function handleAddScore() {
  const state = getState();
  if (state.gameFinished) return;

  const teamSelect = document.getElementById("select-team");
  const pointsInput = document.getElementById("input-points");

  const teamId = teamSelect ? teamSelect.value : null;
  const pointsRaw = pointsInput ? pointsInput.value : "";

  if (!teamId) {
    showError("Please select a team.");
    return;
  }

  const points = parseInt(pointsRaw, 10);
  if (isNaN(points) || points <= 0 || points > 500) {
    showError("Points must be a whole number between 1 and 500.");
    pointsInput && pointsInput.focus();
    return;
  }

  const ok = addEntry(teamId, points);
  if (ok) {
    if (pointsInput) {
      pointsInput.value = "";
      pointsInput.focus();
    }
    render();
    persist();
  }
}

function showError(msg) {
  const errEl = document.getElementById("error-msg");
  if (!errEl) return;
  errEl.textContent = msg;
  errEl.classList.add("visible");
  clearTimeout(errorTimeout);
  errorTimeout = setTimeout(() => {
    errEl.classList.remove("visible");
  }, 3000);
}

function initInputValues() {
  const state = getState();
  const nameA = document.getElementById("edit-name-a");
  const nameB = document.getElementById("edit-name-b");
  const targetInput = document.getElementById("input-target");

  if (nameA) nameA.value = state.teams[0].name;
  if (nameB) nameB.value = state.teams[1].name;
  if (targetInput) targetInput.value = state.targetScore;
}

export { bindEvents, initInputValues };
