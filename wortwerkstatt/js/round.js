// round.js — pure round logic: drawing the tasks, joining the visible
// text around the blank, and checking answers. No DOM access; app.js
// owns the state and ui.js renders it. The e2e suite imports this
// module directly to derive the expected answers, so the tests can
// never drift from the engine.

import { shuffle } from "./util.js?v=2";

export const ROUND_SIZE = 6;

// Task kinds. The first three are answered by choosing, the last three
// by writing. Every item stores its solution in `answer`, so checking
// is the same everywhere.
export const CHOICE_KINDS = ["word", "sentence", "punct"];
export const TYPED_KINDS = ["memory", "write", "copy"];

export function isTyped(kind) {
  return TYPED_KINDS.includes(kind);
}

// Only the memory kind hides the answer first and asks for it back.
// Write derives it from the rule, copy has it on screen the whole time.
export function needsStudyStep(task) {
  return task.kind === "memory";
}

// Draws one round from the given chapters, each entry { topic, chapter }.
// Items are taken round robin across shuffled chapters, so a mixed round
// spreads over the rules instead of landing three times in the same one.
// No item repeats inside a round. Option order is shuffled per task, so
// the answer never sits in the same place twice.
export function buildRound(entries, size = ROUND_SIZE) {
  const pools = shuffle(entries).map((entry) => ({ entry, items: shuffle(entry.chapter.items) }));
  const picked = [];
  while (picked.length < size) {
    let took = 0;
    for (const pool of pools) {
      if (picked.length >= size) break;
      const item = pool.items.pop();
      if (!item) continue;
      picked.push({
        topicId: pool.entry.topic.id,
        chapterId: pool.entry.chapter.id,
        kind: pool.entry.chapter.kind,
        emptyOptionKey: pool.entry.chapter.emptyOptionKey || null,
        item
      });
      took += 1;
    }
    if (took === 0) break;
  }
  return picked.map((task) => ({
    ...task,
    options: isTyped(task.kind) ? null : shuffle(task.item.options)
  }));
}

export function expectedAnswer(task) {
  return task.item.answer;
}

// Builds the visible text of a task with `filler` in place of the
// answer. The spacing rules live here alone: word fragments are glued
// together, an end-of-sentence mark sits tight against the sentence,
// and a following clause keeps its space. The rendered blank and the
// solution text both come from this function, so they can never
// disagree about a space.
export function fillTask(task, filler) {
  const { kind, item } = task;
  // A memory word is the whole task, and a copy task types out a whole
  // sentence, so there is nothing to join around.
  if (kind === "memory" || kind === "copy") return filler;
  if (kind === "word") return item.before + filler + item.after;
  const head = kind === "punct"
    ? item.before + filler
    : (item.before ? item.before + " " : "") + filler;
  const after = item.after || "";
  if (!after) return head;
  return /^[.,!?;:]/.test(after) ? head + after : head + " " + after;
}

export function solutionText(task) {
  return fillTask(task, expectedAnswer(task));
}

export function isCorrect(task, answer) {
  return answer === expectedAnswer(task);
}

// Which letters of a written answer are right, position by position.
// Used to mark the misses without ever marking them by colour alone.
export function letterDiff(expected, typed) {
  return expected.split("").map((ch, i) => (typed[i] || "") === ch);
}
