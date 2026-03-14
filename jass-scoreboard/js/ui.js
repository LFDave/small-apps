// ui.js — handle user input, bind event listeners, validate inputs

import { getState, setTeamName, setTargetScore, flipBoard, resetState } from "./state.js";
import { addEntry, undoLastEntry } from "./scoring.js";
import { render } from "./renderer.js";
import { saveState } from "./storage.js";

// Currently-active team for mark entry
let activeTeamId = "A";
let errorTimeout = null;

function persist() {
  saveState(getState());
}

function bindEvents() {
  // Team toggle buttons
  const btnTeamA = document.getElementById("btn-team-a");
  const btnTeamB = document.getElementById("btn-team-b");
  if (btnTeamA) btnTeamA.addEventListener("click", () => setActiveTeam("A"));
  if (btnTeamB) btnTeamB.addEventListener("click", () => setActiveTeam("B"));

  // Mark entry buttons (+100 / +50 / +20)
  const markDefs = [
    { id: "btn-mark-top",  barType: "top"      },
    { id: "btn-mark-diag", barType: "diagonal" },
    { id: "btn-mark-bot",  barType: "bottom"   }
  ];
  for (const { id, barType } of markDefs) {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", () => handleMarkAdd(barType));
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
        document.getElementById("score-input-area")?.classList.remove("disabled");
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

  // Team name edits (save on blur/change)
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
        showError("Ziel muss zwischen 100 und 10000 liegen.");
      } else {
        render();
        persist();
      }
    });
  }

  // Close win overlay on click
  const winOverlay = document.getElementById("win-overlay");
  if (winOverlay) {
    winOverlay.addEventListener("click", () => {
      winOverlay.classList.remove("active");
    });
  }
}

function setActiveTeam(teamId) {
  activeTeamId = teamId;
  // Update visual state of toggle buttons
  document.getElementById("btn-team-a")?.classList.toggle("is-active", teamId === "A");
  document.getElementById("btn-team-b")?.classList.toggle("is-active", teamId === "B");
}

function handleMarkAdd(barType) {
  const state = getState();
  if (state.gameFinished) return;

  const ok = addEntry(activeTeamId, barType);
  if (ok) {
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
  errorTimeout = setTimeout(() => errEl.classList.remove("visible"), 3000);
}

function initInputValues() {
  const state = getState();
  const nameA = document.getElementById("edit-name-a");
  const nameB = document.getElementById("edit-name-b");
  const targetInput = document.getElementById("input-target");

  if (nameA) nameA.value = state.teams[0].name;
  if (nameB) nameB.value = state.teams[1].name;
  if (targetInput) targetInput.value = state.targetScore;

  // Sync active team button visual
  setActiveTeam(activeTeamId);
}

export { bindEvents, initInputValues };
