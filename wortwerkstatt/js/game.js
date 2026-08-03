// game.js — quiet gamification: XP, levels, medals. Pure logic, no DOM
// and no copy: level and medal names are string ids resolved by the UI,
// so the progression layer works in every interface language.
// XP measures practice, not perfection: mistakes never subtract, speed
// never matters. Medal checks are pure functions of the data object so
// they can never drift from the stored state.

import { topicsForCycle } from "./data.js?v=1";

// Cumulative XP thresholds. Beyond the last level XP keeps counting.
export const LEVELS = [
  { xp: 0, titleKey: "level1" },
  { xp: 30, titleKey: "level2" },
  { xp: 80, titleKey: "level3" },
  { xp: 160, titleKey: "level4" },
  { xp: 280, titleKey: "level5" },
  { xp: 450, titleKey: "level6" }
];

// Growing step series on cumulative counters. `key` is the suffix of
// the medalName.../medalDesc... string ids. Effort medals sit next to
// completion medals on purpose, so practice pays even when the answers
// went wrong.
export const MEDALS = [
  { id: "erste-runde", key: "ErsteRunde", icon: "sparkles", check: (d) => d.game.rounds >= 1 },
  { id: "drei-runden", key: "DreiRunden", icon: "star", check: (d) => d.game.rounds >= 3 },
  { id: "acht-runden", key: "AchtRunden", icon: "award", check: (d) => d.game.rounds >= 8 },
  { id: "einundzwanzig-runden", key: "EinundzwanzigRunden", icon: "trophy", check: (d) => d.game.rounds >= 21 },
  { id: "regelfest", key: "Regelfest", icon: "target", check: (d) => Object.values(d.topics).some((p) => p.clean >= 3) },
  { id: "alleskoenner", key: "Alleskoenner", icon: "layers", check: cycleComplete },
  { id: "wortschmied", key: "Wortschmied", icon: "hammer", check: (d) => d.game.charsTyped >= 400 },
  { id: "blitzmerker", key: "Blitzmerker", icon: "zap", check: (d) => d.game.memoryWords >= 20 },
  { id: "zyklusreise", key: "Zyklusreise", icon: "graduation-cap", check: (d) => d.game.cycles.length >= 3 }
];

// Every rule of the cycle the child is currently set to. Cycles differ
// in size, so this is a per-cycle goal by design.
function cycleComplete(d) {
  const topics = topicsForCycle(d.settings.contentLanguage, d.settings.cycle);
  return topics.length > 0 && topics.every((topic) => (d.topics[topic.id] || {}).rounds >= 1);
}

// XP for one finished round: 5 for finishing, 2 per answer that was
// right first time, 1 per answer that took a correction (effort still
// counts), plus 2 per cycle step because the later cycles are harder.
export function xpForRound(cycle, firstTryCount, correctedCount) {
  return 5 + firstTryCount * 2 + correctedCount + (cycle - 1) * 2;
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
