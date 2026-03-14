// app.js — application bootstrap

import { getState, setState } from "./state.js";
import { loadState } from "./storage.js";
import { recalcTotals, checkWinner } from "./scoring.js";
import { render } from "./renderer.js";
import { bindEvents, initInputValues } from "./ui.js";

function bootstrap() {
  // Attempt to restore persisted state
  const saved = loadState();
  if (saved) {
    // Merge saved data into state carefully
    const current = getState();
    const restored = {
      teams: saved.teams || current.teams,
      entries: saved.entries || [],
      totals: { A: 0, B: 0 },
      targetScore:
        typeof saved.targetScore === "number" ? saved.targetScore : current.targetScore,
      flipped: typeof saved.flipped === "boolean" ? saved.flipped : false,
      winner: saved.winner || null,
      gameFinished: typeof saved.gameFinished === "boolean" ? saved.gameFinished : false
    };
    setState(restored);
    recalcTotals();
    checkWinner();
  }

  initInputValues();
  bindEvents();
  render();
}

document.addEventListener("DOMContentLoaded", bootstrap);
