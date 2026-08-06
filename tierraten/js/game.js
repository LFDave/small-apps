// game.js — XP, levels and medals. Pure: no DOM, no strings, no storage.
// Follows GAMIFICATION.md — XP only ever grows, effort counts, and every
// medal is a function of the stored counters rather than an event flag,
// so state and medals cannot drift apart.

import { CLUE_COUNT } from "./data.js?v=2";

// A solved animal is worth a base plus whatever clues were left unused.
// Guessing early is harder, not faster: the clock plays no part here, and
// an animal that took every clue still pays.
export const SOLVE_BASE = 4;
export const REVEAL_XP = 2;

// Solved with this many clues or fewer counts as a quick read.
export const QUICK_CLUES = 3;

export function xpForAnimal({ solved, clues }) {
  if (!solved) return REVEAL_XP;
  return SOLVE_BASE + Math.max(0, CLUE_COUNT - clues);
}

export function xpForRound(results) {
  return results.reduce((sum, r) => sum + xpForAnimal(r), 0);
}

// Six levels. The second arrives inside a first sitting, the last takes
// real practice. Past the top, XP keeps counting.
export const LEVELS = [
  { key: "level1", xp: 0 },
  { key: "level2", xp: 60 },
  { key: "level3", xp: 180 },
  { key: "level4", xp: 420 },
  { key: "level5", xp: 900 },
  { key: "level6", xp: 1800 }
];

export function levelFor(xp) {
  let index = 0;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].xp) index = i;
  const next = LEVELS[index + 1] || null;
  const floor = LEVELS[index].xp;
  return {
    index,
    number: index + 1,
    key: LEVELS[index].key,
    next,
    toNext: next ? next.xp - xp : 0,
    progress: next ? (xp - floor) / (next.xp - floor) : 1
  };
}

/* ── Counters derived from the stored data ───────────────────────── */

export function solvedCount(data) {
  return Object.values(data.animals).filter((a) => a.solved > 0).length;
}

export function quickCount(data) {
  return Object.values(data.animals)
    .filter((a) => a.solved > 0 && a.bestClues > 0 && a.bestClues <= QUICK_CLUES).length;
}

/* ── Medals ──────────────────────────────────────────────────────── */

// Three kinds, as GAMIFICATION.md asks: what was finished, what was
// attempted (so practice pays even when the guess was wrong), and the
// milestones that belong to this game in particular.
export const MEDALS = [
  { id: "erstes-tier", icon: "paw-print", goal: 1, count: solvedCount },
  { id: "drei-tiere", icon: "star", goal: 3, count: solvedCount },
  { id: "acht-tiere", icon: "award", goal: 8, count: solvedCount },
  { id: "einundzwanzig-tiere", icon: "trophy", goal: 21, count: solvedCount },
  { id: "zehn-versuche", icon: "sparkles", goal: 10, count: (d) => d.game.guesses },
  { id: "vierzig-versuche", icon: "target", goal: 40, count: (d) => d.game.guesses },
  { id: "schneller-blick", icon: "zap", goal: 3, count: quickCount },
  { id: "fuenf-buchstaben", icon: "case-upper", goal: 5, count: (d) => d.game.rounds },
  { id: "dreizehn-buchstaben", icon: "medal", goal: 13, count: (d) => d.game.rounds }
];

export function medalProgress(medal, data) {
  const have = medal.count(data);
  return { have: Math.min(have, medal.goal), goal: medal.goal, earned: have >= medal.goal };
}

export function earnedMedals(data) {
  return MEDALS.filter((m) => medalProgress(m, data).earned).map((m) => m.id);
}

// Adds the XP, then recomputes which medals are earned and reports the
// ones that were not on the list before. The list is stored so the
// completion screen can name what is new, never to decide what is
// earned: that stays a pure read of the counters.
export function award(data, xp) {
  data.game.xp += xp;
  const earned = earnedMedals(data);
  const before = new Set(data.game.medals);
  const fresh = earned.filter((id) => !before.has(id));
  data.game.medals = earned;
  return { xp, medals: fresh };
}
