// practice.js — pure session logic for the learning ladder and the
// emergency-number quiz. No DOM access; app.js owns the state, ui.js
// renders it.

import { intlChunks, shuffle } from "./util.js?v=3";
import { EMERGENCY } from "./data.js?v=3";

// Builds the ladder steps for one entry. Each step has the chunks to
// display and the set of hidden chunk indices the child must type.
// The cloze chunk rotates with the number of completed ladders so
// repeat practice hides a different group each time.
export function buildLadder(entry) {
  const n = entry.chunks.length;
  const steps = [{ kind: "view", chunks: entry.chunks, hidden: [] }];
  if (n > 1) {
    const clozeIdx = entry.completions % n;
    const tailHidden = entry.chunks.map((_, i) => i).slice(1);
    steps.push({ kind: "cloze", chunks: entry.chunks, hidden: [clozeIdx] });
    if (!(tailHidden.length === 1 && tailHidden[0] === clozeIdx)) {
      steps.push({ kind: "tail", chunks: entry.chunks, hidden: tailHidden });
    }
  }
  steps.push({ kind: "full", chunks: entry.chunks, hidden: entry.chunks.map((_, i) => i) });
  if (entry.type === "phone" && entry.intl) {
    const intl = intlChunks(entry);
    steps.push({ kind: "intl-view", chunks: intl, hidden: [] });
    steps.push({ kind: "intl-full", chunks: intl, hidden: intl.map((_, i) => i) });
  }
  return steps;
}

// The characters the child must type for a step, in order: every
// character of every hidden chunk ("+" counts as a character too).
export function expectedChars(step) {
  return step.hidden.flatMap((i) => step.chunks[i].split(""));
}

// Compares typed characters with the expected sequence.
// Returns { ok, diff } where diff[i] is true for a correct position.
export function checkTyped(step, typed) {
  const expected = expectedChars(step);
  const diff = expected.map((ch, i) => typed[i] === ch);
  return { ok: typed.length === expected.length && diff.every(Boolean), diff };
}

export function stepNeedsInput(step) {
  return step.hidden.length > 0;
}

export function stepAllowsPlus(step) {
  return step.kind === "intl-full";
}

// Quiz session: all emergency numbers in random order.
export function buildQuiz() {
  return shuffle(EMERGENCY.map((svc) => svc.number));
}

export function serviceByNumber(number) {
  return EMERGENCY.find((svc) => svc.number === number);
}
