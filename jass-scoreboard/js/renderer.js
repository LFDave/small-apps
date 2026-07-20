// renderer.js — draws the whole slate as one SVG scene:
// two chalk Z's (one per team), marks, totals, win state.
//
// Readability from both sides of the table:
// Each Z is drawn point-symmetric about its own centre — the top bar,
// the diagonal and the bottom bar map exactly onto themselves under a
// 180° rotation. The far team's half IS rotated 180° (so its name and
// total face the player across the table), and because of the point
// symmetry both Z shapes still read as a proper "Z" — never as an
// "S" — no matter which side of the table you look from.

import { getState } from "./state.js?v=5";
import { computeMarks } from "./scoring.js?v=5";

// ── Board geometry (one half, local coordinates) ─────────────────
const W = 640;        // board width
const HH = 460;       // height of one half
const H = HH * 2;     // full board height

const XL = 64;        // Z left x
const XR = 576;       // Z right x
const TOP_Y = 150;    // Z top bar y
const BOT_Y = 380;    // Z bottom bar y
// Z centre = ((XL+XR)/2, (TOP_Y+BOT_Y)/2) = (320, 265).
// rotate180(x, y) → (640−x, 530−y): top bar ↔ bottom bar, the
// diagonal (XR,TOP_Y)→(XL,BOT_Y) maps onto itself. Point symmetry ✓

function esc(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Deterministic PRNG (mulberry32) — chalk jitter must be stable
 * across re-renders so the marks don't wiggle on every update.
 */
function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function chalkLine(rand, x1, y1, x2, y2, width, cls) {
  const j = () => rand() * 2.8 - 1.4;
  return `<line class="${cls}" x1="${(x1 + j()).toFixed(1)}" y1="${(y1 + j()).toFixed(1)}" x2="${(x2 + j()).toFixed(1)}" y2="${(y2 + j()).toFixed(1)}" stroke-width="${width}" stroke-linecap="round"/>`;
}

function splitGroups(count) {
  const groups = [];
  for (let left = count; left > 0; left -= 5) groups.push(Math.min(left, 5));
  return groups;
}

/**
 * Tally marks on a horizontal bar, bundled in fives: four upright
 * strokes plus a slash across them for each complete group (||||\).
 * dir 1 = left-aligned growing right (hundreds), dir -1 =
 * right-aligned growing left (twenties). Marks stack up in place —
 * no conversion between lines, chalk stays where it was written.
 */
function barTallies(rand, count, y, dir) {
  if (!count) return "";
  const usable = XR - XL - 24;
  const groups = splitGroups(count);
  const uprightTotal = groups.reduce((sum, c) => sum + Math.min(c, 4), 0);
  const GAP = 26;
  const denom = Math.max(1, uprightTotal - groups.length);
  const step = Math.max(7, Math.min(19, (usable - (groups.length - 1) * GAP) / denom));

  let x = dir === 1 ? XL + 12 : XR - 12;
  let out = "";
  for (const cnt of groups) {
    const uprights = Math.min(cnt, 4);
    for (let k = 0; k < uprights; k++) {
      const ux = x + dir * k * step;
      out += chalkLine(rand, ux, y - 17, ux + (rand() * 4 - 2), y + 17, 3.2, "mark");
    }
    const groupWidth = (uprights - 1) * step;
    if (cnt === 5) {
      out += chalkLine(rand, x - dir * step * 0.45, y + 16, x + dir * (groupWidth + step * 0.45), y - 16, 3.2, "mark");
    }
    x += dir * (groupWidth + GAP);
  }
  return out;
}

/**
 * Fifties as strokes crossing the diagonal, accumulating compactly
 * from the top-right end and bundled in fives like the other lines:
 * four cross-strokes plus a slash through them per complete group.
 */
function diagTallies(rand, count) {
  if (!count) return "";
  const dx = XL - XR;
  const dy = BOT_Y - TOP_Y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy; // perpendicular unit vector
  const py = ux;
  const point = t => [XR + ux * t, TOP_Y + uy * t];

  const groups = splitGroups(count);
  const uprightTotal = groups.reduce((sum, c) => sum + Math.min(c, 4), 0);
  const GAP = 36;
  const usable = len * 0.8;
  const denom = Math.max(1, uprightTotal - groups.length);
  const step = Math.max(12, Math.min(26, (usable - (groups.length - 1) * GAP) / denom));

  let t = len * 0.1;
  let out = "";
  for (const cnt of groups) {
    const uprights = Math.min(cnt, 4);
    for (let k = 0; k < uprights; k++) {
      const [cx, cy] = point(t + k * step);
      out += chalkLine(rand, cx - px * 18, cy - py * 18, cx + px * 18, cy + py * 18, 3.2, "mark");
    }
    const groupSpan = (uprights - 1) * step;
    if (cnt === 5) {
      const [sx, sy] = point(t - step * 0.45);
      const [ex, ey] = point(t + groupSpan + step * 0.45);
      out += chalkLine(rand, sx + px * 12, sy + py * 12, ex - px * 12, ey - py * 12, 3.2, "mark");
    }
    t += groupSpan + GAP;
  }
  return out;
}

/**
 * One team's half of the slate, drawn in local coordinates for a
 * viewer sitting at that half's outer edge.
 */
function buildHalf(team, total, marks, isWinner, seed) {
  const rand = mulberry32(seed);
  const { hundreds, fifties, twenties, remainder } = marks;

  let s = "";
  if (isWinner) {
    s += `<rect class="win-glow" x="18" y="14" width="${W - 36}" height="${HH - 28}" rx="14"/>`;
  }

  // Name + total, facing this half's player
  s += `<text class="team-name" x="${XL}" y="62">${esc(team.name)}</text>`;
  s += `<text class="team-total" x="${XR}" y="72" text-anchor="end">${total}</text>`;

  // The Z — red painted guide lines, point-symmetric about (320, 265)
  s += `<g class="z-lines" filter="url(#chalk-rough)">`;
  s += `<line class="z-line" x1="${XL}" y1="${TOP_Y}" x2="${XR}" y2="${TOP_Y}"/>`;
  s += `<line class="z-line z-diag" x1="${XR}" y1="${TOP_Y}" x2="${XL}" y2="${BOT_Y}"/>`;
  s += `<line class="z-line" x1="${XL}" y1="${BOT_Y}" x2="${XR}" y2="${BOT_Y}"/>`;
  s += `</g>`;

  // Small value labels at the line ends (face this half's player)
  s += `<text class="line-label" x="${XL - 12}" y="${TOP_Y + 5}" text-anchor="end">100</text>`;
  s += `<text class="line-label" x="${XL - 12}" y="${BOT_Y + 5}" text-anchor="end">20</text>`;
  s += `<text class="line-label" x="${(XL + XR) / 2 + 26}" y="${(TOP_Y + BOT_Y) / 2 + 30}">50</text>`;

  // Chalk marks
  s += `<g class="marks" filter="url(#chalk-rough)">`;
  s += barTallies(rand, hundreds, TOP_Y, 1);
  s += diagTallies(rand, fifties);
  s += barTallies(rand, twenties, BOT_Y, -1);
  s += `</g>`;

  // Sum of all sub-20 rests, written as a chalk number
  if (remainder > 0) {
    s += `<text class="rest-num" x="${XR}" y="${BOT_Y + 56}" text-anchor="end">+ ${remainder}</text>`;
  }

  return s;
}

// Styles inlined into the standalone export SVG — the app stylesheet
// doesn't apply once the SVG leaves the page. Keep in sync with the
// same classes in css/styles.css.
const EXPORT_STYLE = `
  .board-frame{fill:none;stroke:rgba(216,74,67,0.35);stroke-width:2.5}
  .board-divider{stroke:#d84a43;stroke-width:3.5;stroke-linecap:round;opacity:.85}
  .z-line{stroke:#d84a43;stroke-width:4;stroke-linecap:round;opacity:.85}
  .z-diag{stroke-width:3;opacity:.7}
  .line-label{fill:rgba(216,74,67,0.55);font-family:'Segoe Print','Bradley Hand','Chalkboard SE','Comic Sans MS',cursive;font-size:15px}
  .mark{stroke:#f2efe4;opacity:.92}
  .team-name{fill:#f2efe4;font-family:'Segoe Print','Bradley Hand','Chalkboard SE','Comic Sans MS',cursive;font-size:27px}
  .team-total{fill:#f2efe4;font-family:'Segoe Print','Bradley Hand','Chalkboard SE','Comic Sans MS',cursive;font-size:46px;font-weight:700}
  .rest-num{fill:#f2efe4;font-family:'Segoe Print','Bradley Hand','Chalkboard SE','Comic Sans MS',cursive;font-size:28px}
  .win-glow{fill:rgba(255,215,90,0.09);stroke:#ffd75a;stroke-width:2.5}
`;

/**
 * The complete slate scene (both Z's, no controls). With forExport the
 * SVG is self-contained: explicit size, inlined styles and a slate
 * background, so it rasterizes correctly outside the page.
 */
function buildBoardSvg(forExport = false) {
  const state = getState();

  // Team A defaults to the near (bottom) half — the side facing the
  // person holding the device; flipped swaps the halves. The data
  // model itself never changes.
  const nearTeam = state.flipped ? state.teams[1] : state.teams[0];
  const farTeam = state.flipped ? state.teams[0] : state.teams[1];
  const marks = computeMarks(state.entries);

  const sizeAttrs = forExport ? ` width="${W}" height="${H}"` : "";
  const exportBits = forExport
    ? `<style>${EXPORT_STYLE}</style>
       <rect width="${W}" height="${H}" rx="12" fill="url(#slate-grad)"/>`
    : "";
  const gradientDef = forExport
    ? `<linearGradient id="slate-grad" x1="0" y1="0" x2="0.34" y2="0.94">
         <stop offset="0" stop-color="#232e28"/>
         <stop offset="1" stop-color="#1b241f"/>
       </linearGradient>`
    : "";

  return `<svg viewBox="0 0 ${W} ${H}"${sizeAttrs} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Jasstafel: ${esc(farTeam.name)} ${state.totals[farTeam.id]} Punkte, ${esc(nearTeam.name)} ${state.totals[nearTeam.id]} Punkte">
    <defs>
      <filter id="chalk-rough" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4"/>
      </filter>
      ${gradientDef}
    </defs>
    ${exportBits}
    <rect class="board-frame" x="10" y="10" width="${W - 20}" height="${H - 20}" rx="16"/>
    <g transform="rotate(180 ${W / 2} ${HH / 2})">${buildHalf(farTeam, state.totals[farTeam.id], marks[farTeam.id], state.winner === farTeam.id, 11)}</g>
    <line class="board-divider" x1="26" y1="${HH}" x2="${W - 26}" y2="${HH}"/>
    <g transform="translate(0 ${HH})">${buildHalf(nearTeam, state.totals[nearTeam.id], marks[nearTeam.id], state.winner === nearTeam.id, 47)}</g>
  </svg>`;
}

function render() {
  const state = getState();

  const board = document.getElementById("board");
  if (board) board.innerHTML = buildBoardSvg();

  // Team toggle labels
  const btnTeamA = document.getElementById("btn-team-a");
  const btnTeamB = document.getElementById("btn-team-b");
  if (btnTeamA) btnTeamA.textContent = state.teams[0].name;
  if (btnTeamB) btnTeamB.textContent = state.teams[1].name;

  // Disable score entry once the game is finished (undo/reset stay active)
  const inputArea = document.getElementById("score-input-area");
  if (inputArea) {
    inputArea.classList.toggle("disabled", state.gameFinished);
    inputArea
      .querySelectorAll(".btn-team, .btn-chip, #input-points, #btn-add")
      .forEach(el => { el.disabled = state.gameFinished; });
  }

  // Screen-reader status
  const sr = document.getElementById("sr-status");
  if (sr) {
    sr.textContent =
      `${state.teams[0].name}: ${state.totals.A} Punkte. ` +
      `${state.teams[1].name}: ${state.totals.B} Punkte. Ziel: ${state.targetScore}.`;
  }

  renderWinOverlay(state);
}

function renderWinOverlay(state) {
  const overlay = document.getElementById("win-overlay");
  if (!overlay) return;
  if (state.gameFinished && state.winner && !state.winAcknowledged) {
    const winner = state.teams.find(t => t.id === state.winner);
    document.getElementById("win-team-name").textContent = winner ? winner.name : "";
    overlay.classList.add("active");
  } else {
    overlay.classList.remove("active");
  }
}

export { render, buildBoardSvg };
