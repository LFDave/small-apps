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
} from "./state.js?v=5";
import { render, buildBoardSvg } from "./renderer.js?v=5";

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

  // Export the slate (both Z's, no controls) as a JPG download
  document.getElementById("btn-export")?.addEventListener("click", exportBoardAsJpg);

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

/**
 * Rasterize the self-contained board SVG onto a 2× canvas and trigger
 * a JPG download (jasstafel-YYYY-MM-DD.jpg). Pure browser APIs — a PDF
 * export would require an external library, which this app forbids;
 * the browser's print dialog can produce a PDF instead.
 */
function exportBoardAsJpg() {
  const svgMarkup = buildBoardSvg(true);
  const svgUrl = URL.createObjectURL(new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" }));
  const img = new Image();
  img.onload = () => {
    URL.revokeObjectURL(svgUrl);
    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = 640 * scale;
    canvas.height = 920 * scale;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#232e28";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      if (!blob) {
        showError("Export fehlgeschlagen.");
        return;
      }
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      const d = new Date();
      const pad = n => String(n).padStart(2, "0");
      link.download = `jasstafel-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.jpg`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    }, "image/jpeg", 0.92);
  };
  img.onerror = () => {
    URL.revokeObjectURL(svgUrl);
    showError("Export fehlgeschlagen.");
  };
  img.src = svgUrl;
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
