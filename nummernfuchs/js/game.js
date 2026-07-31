// game.js — quiet gamification: XP, levels, medals. Pure logic, no DOM.
// XP measures practice, not perfection: mistakes never subtract, speed
// never matters. Medal checks are pure functions of the data object so
// they can never drift from the stored state.

import { EMERGENCY } from "./data.js?v=5";

// Cumulative XP thresholds. Beyond the last level XP keeps counting.
export const LEVELS = [
  { xp: 0, title: "Fuchswelpe" },
  { xp: 30, title: "Schlaufuchs" },
  { xp: 80, title: "Zahlenfuchs" },
  { xp: 160, title: "Merkfuchs" },
  { xp: 280, title: "Superfuchs" },
  { xp: 450, title: "Meisterfuchs" }
];

// Medal thresholds follow GeoTriad's pattern: cumulative counters,
// with effort (digits typed) rewarded alongside success.
export const MEDALS = [
  { id: "erste-uebung", icon: "sparkles", check: (d) => d.game.exercises >= 1 },
  { id: "drei-uebungen", icon: "star", check: (d) => d.game.exercises >= 3 },
  { id: "acht-uebungen", icon: "award", check: (d) => d.game.exercises >= 8 },
  { id: "einundzwanzig-uebungen", icon: "trophy", check: (d) => d.game.exercises >= 21 },
  { id: "sitzt", icon: "target", check: (d) => d.entries.some((e) => e.completions >= 3) },
  { id: "notruf-profi", icon: "circle-check", check: (d) => EMERGENCY.every((s) => (d.emergency[s.number] || 0) >= 3) },
  { id: "international", icon: "plane", check: (d) => d.entries.some((e) => e.intl && e.completions >= 1) },
  { id: "riesenzahl", icon: "gem", check: (d) => d.game.bestTraining >= 10 },
  { id: "tippfuchs", icon: "zap", check: (d) => d.game.digitsTyped >= 500 }
];

// XP for one completed ladder: base 10, plus one per digit, plus 5
// when the run included the international form.
export function xpForLadder(digitCount, hadIntl) {
  return 10 + digitCount + (hadIntl ? 5 : 0);
}

// XP for one completed quiz session: 3 per first-try answer, 1 per
// corrected answer (effort still counts), plus 5 for finishing.
export function xpForQuiz(firstTryCount, correctedCount) {
  return firstTryCount * 3 + correctedCount + 5;
}

export function levelFor(xp) {
  let index = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].xp) index = i;
  }
  const next = LEVELS[index + 1] || null;
  return {
    level: index + 1,
    title: LEVELS[index].title,
    nextXp: next ? next.xp : null,
    progress: next
      ? (xp - LEVELS[index].xp) / (next.xp - LEVELS[index].xp)
      : 1
  };
}

// Adds XP, sweeps the medal list, and reports what changed so the UI
// can show a quiet reward block. Mutates data.game; the caller saves.
export function award(data, xp) {
  const before = levelFor(data.game.xp).level;
  data.game.xp += xp;
  const after = levelFor(data.game.xp);
  const newMedals = MEDALS.filter(
    (m) => !data.game.medals.includes(m.id) && m.check(data)
  );
  for (const m of newMedals) data.game.medals.push(m.id);
  return {
    xp,
    newMedals,
    levelUp: after.level > before ? after : null
  };
}
