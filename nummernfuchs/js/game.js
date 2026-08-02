// game.js — quiet gamification: XP, levels, medals. Pure logic, no DOM
// and no strings: level and medal names are string ids resolved by the
// UI, so the progression layer works in every language.
// XP measures practice, not perfection: mistakes never subtract, speed
// never matters. Medal checks are pure functions of the data object so
// they can never drift from the stored state.

import { countryByCode, emergencyKey } from "./data.js?v=8";

// Cumulative XP thresholds. Beyond the last level XP keeps counting.
export const LEVELS = [
  { xp: 0, titleKey: "level1" },
  { xp: 30, titleKey: "level2" },
  { xp: 80, titleKey: "level3" },
  { xp: 160, titleKey: "level4" },
  { xp: 280, titleKey: "level5" },
  { xp: 450, titleKey: "level6" }
];

// Medal thresholds follow GeoTriad's pattern: cumulative counters,
// with effort (digits typed) rewarded alongside success. `key` is the
// suffix of the medalName.../medalDesc... string ids.
export const MEDALS = [
  { id: "erste-uebung", key: "ErsteUebung", icon: "sparkles", check: (d) => d.game.exercises >= 1 },
  { id: "drei-uebungen", key: "DreiUebungen", icon: "star", check: (d) => d.game.exercises >= 3 },
  { id: "acht-uebungen", key: "AchtUebungen", icon: "award", check: (d) => d.game.exercises >= 8 },
  { id: "einundzwanzig-uebungen", key: "EinundzwanzigUebungen", icon: "trophy", check: (d) => d.game.exercises >= 21 },
  { id: "sitzt", key: "Sitzt", icon: "target", check: (d) => d.entries.some((e) => e.completions >= 3) },
  { id: "notruf-profi", key: "NotrufProfi", icon: "circle-check", check: emergencyPro },
  { id: "international", key: "International", icon: "plane", check: (d) => d.entries.some((e) => e.intl && e.completions >= 1) },
  { id: "riesenzahl", key: "Riesenzahl", icon: "gem", check: (d) => d.game.bestTraining >= 10 },
  { id: "tippfuchs", key: "Tippfuchs", icon: "zap", check: (d) => d.game.digitsTyped >= 500 }
];

// Every emergency number of the country the child is currently set to.
// Packs differ in size, so this is a per-country goal by design.
function emergencyPro(d) {
  const country = countryByCode(d.settings.country);
  return country.numbers.every(
    (n) => (d.emergency[emergencyKey(country.code, n.number)] || 0) >= 3
  );
}

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
    titleKey: LEVELS[index].titleKey,
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
