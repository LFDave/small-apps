// renderer.js — render board, tallies, totals, win state

import { getState } from "./state.js";

// ── SVG Z geometry constants ──────────────────────────────────────
const Z_W  = 400;   // viewBox width
const Z_H  = 170;   // viewBox height
const X_L  = 12;    // left x bound
const X_R  = 388;   // right x bound
const TOP_Y = 42;   // top bar y
const BOT_Y = 128;  // bottom bar y
// Diagonal: (X_R, TOP_Y) → (X_L, BOT_Y)

// Mark spacing limits (SVG viewBox units)
const MIN_SPACING = 6;
const MAX_SPACING = 13;
const DIAG_MARGIN = 14;  // gap to leave at each end of the diagonal

/**
 * Build perpendicular tick marks along the top or bottom horizontal bar.
 */
function hMarks(count, y) {
  if (!count) return "";
  const usable = X_R - X_L - 16;                               // ~360 px
  const spacing = Math.max(MIN_SPACING, Math.min(MAX_SPACING, count > 1 ? usable / (count - 1) : usable));
  const totalSpan = spacing * (count - 1);
  const startX = X_L + 8 + (usable - totalSpan) / 2;

  let out = "";
  for (let i = 0; i < count; i++) {
    const x = +(startX + i * spacing).toFixed(1);
    out += `<line x1="${x}" y1="${y - 11}" x2="${x}" y2="${y + 11}" stroke="rgba(240,237,224,0.92)" stroke-width="2" stroke-linecap="round"/>`;
  }
  return out;
}

/**
 * Build perpendicular tick marks along the diagonal of the Z.
 * Marks are drawn as short vertical lines since preserveAspectRatio="none"
 * would skew true perpendiculars; vertical ticks look authentic on a chalk board.
 */
function diagMarks(count) {
  if (!count) return "";
  const dx = X_L - X_R;         // -376
  const dy = BOT_Y - TOP_Y;     //  86
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len;  const uy = dy / len;  // unit along diagonal

  const usable = len - 2 * DIAG_MARGIN;
  const spacing = Math.max(MIN_SPACING, Math.min(MAX_SPACING, count > 1 ? usable / (count - 1) : usable));
  const totalSpan = spacing * (count - 1);
  const tStart = DIAG_MARGIN + (usable - totalSpan) / 2;

  let out = "";
  for (let i = 0; i < count; i++) {
    const t  = tStart + i * spacing;
    const cx = +(X_R + ux * t).toFixed(1);
    const cy = +(TOP_Y + uy * t).toFixed(1);
    // Vertical tick crossing the diagonal line
    out += `<line x1="${cx}" y1="${+(cy - 13).toFixed(1)}" x2="${cx}" y2="${+(cy + 13).toFixed(1)}" stroke="rgba(240,237,224,0.92)" stroke-width="2" stroke-linecap="round"/>`;
  }
  return out;
}

/**
 * Build the complete SVG Z shape with marks on lines for one team.
 */
function buildZsvg(teamId) {
  const state = getState();
  const entries = state.entries.filter(e => e.teamId === teamId);

  // Count marks per bar (support legacy entries that only have points/no barType)
  const topN  = entries.filter(e => e.barType === "top").length;
  const diagN = entries.filter(e => e.barType === "diagonal").length;
  const botN  = entries.filter(e => e.barType === "bottom").length;

  return `<svg viewBox="0 0 ${Z_W} ${Z_H}" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true">
    <!-- Z guide lines -->
    <line x1="${X_L}" y1="${TOP_Y}" x2="${X_R}" y2="${TOP_Y}" stroke="rgba(224,80,80,0.80)" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="${X_R}" y1="${TOP_Y}" x2="${X_L}" y2="${BOT_Y}" stroke="rgba(224,80,80,0.52)" stroke-width="1.5" stroke-dasharray="9,6"/>
    <line x1="${X_L}" y1="${BOT_Y}" x2="${X_R}" y2="${BOT_Y}" stroke="rgba(224,80,80,0.80)" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Chalk marks on bars -->
    ${hMarks(topN,  TOP_Y)}
    ${diagMarks(diagN)}
    ${hMarks(botN,  BOT_Y)}
  </svg>`;
}

/**
 * Full render of the scoreboard.
 */
function render() {
  const state = getState();

  const [topTeam, bottomTeam] = state.flipped
    ? [state.teams[1], state.teams[0]]
    : [state.teams[0], state.teams[1]];

  // Team name headers inside panels
  document.getElementById("team-a-name").textContent = topTeam.name;
  document.getElementById("team-b-name").textContent = bottomTeam.name;

  // SVG Z marks
  const svgA = document.getElementById("z-svg-a");
  const svgB = document.getElementById("z-svg-b");
  if (svgA) svgA.innerHTML = buildZsvg(topTeam.id);
  if (svgB) svgB.innerHTML = buildZsvg(bottomTeam.id);

  // Totals
  document.getElementById("total-a").textContent = state.totals[topTeam.id] || 0;
  document.getElementById("total-b").textContent = state.totals[bottomTeam.id] || 0;

  // Target score display
  const targetEl = document.getElementById("target-score-display");
  if (targetEl) targetEl.textContent = state.targetScore;

  // Update team toggle button labels
  const btnTeamA = document.getElementById("btn-team-a");
  const btnTeamB = document.getElementById("btn-team-b");
  if (btnTeamA) btnTeamA.textContent = state.teams[0].name;
  if (btnTeamB) btnTeamB.textContent = state.teams[1].name;

  // Win state
  renderWinState(topTeam, bottomTeam);

  // Input area enable/disable (undo and reset always stay enabled)
  const inputArea = document.getElementById("score-input-area");
  if (inputArea) {
    inputArea.classList.toggle("disabled", state.gameFinished);
    inputArea.querySelectorAll(".btn-mark, .btn-team").forEach(el => {
      el.disabled = state.gameFinished;
    });
  }

  // Highlight winning panel
  const panelA = document.getElementById("panel-a");
  const panelB = document.getElementById("panel-b");
  if (panelA && panelB) {
    panelA.classList.remove("winner-panel");
    panelB.classList.remove("winner-panel");
    if (state.gameFinished && state.winner) {
      const winnerIsTop = topTeam.id === state.winner;
      if (winnerIsTop) panelA.classList.add("winner-panel");
      else             panelB.classList.add("winner-panel");
    }
  }
}

function renderWinState(topTeam, bottomTeam) {
  const state = getState();
  const overlay = document.getElementById("win-overlay");
  if (!overlay) return;

  if (state.gameFinished && state.winner) {
    const winningTeam = state.winner === topTeam.id ? topTeam : bottomTeam;
    document.getElementById("win-team-name").textContent = winningTeam.name;
    overlay.classList.add("active");
  } else {
    overlay.classList.remove("active");
  }
}

export { render };
