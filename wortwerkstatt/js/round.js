// round.js — pure round logic: drawing the tasks, joining the visible
// text around the blank, and checking answers. No DOM access; app.js
// owns the state and ui.js renders it. The e2e suite imports this
// module directly to derive the expected answers, so the tests can
// never drift from the engine.

import { shuffle } from "./util.js?v=1";

export const ROUND_SIZE = 6;

// Draws one round from the given topics. Items are taken round robin
// across shuffled topics, so a mixed round spreads over the rules
// instead of landing three times in the same one. No item repeats
// inside a round. Option order is shuffled per task, so the answer
// never sits in the same place twice.
export function buildRound(topics, size = ROUND_SIZE) {
  const pools = shuffle(topics).map((topic) => ({ topic, items: shuffle(topic.items) }));
  const picked = [];
  while (picked.length < size) {
    let took = 0;
    for (const pool of pools) {
      if (picked.length >= size) break;
      const item = pool.items.pop();
      if (!item) continue;
      picked.push({ topicId: pool.topic.id, kind: pool.topic.kind, item });
      took += 1;
    }
    if (took === 0) break;
  }
  return picked.map((task) => ({
    ...task,
    options: task.kind === "memory" ? null : shuffle(task.item.options)
  }));
}

// The answer a task expects.
export function expectedAnswer(task) {
  return task.kind === "memory" ? task.item.word : task.item.answer;
}

// Builds the visible text of a task with `filler` in place of the
// answer. The spacing rules live here alone: word fragments are glued
// together, an end-of-sentence mark sits tight against the sentence,
// and a following clause keeps its space. The solution text and the
// rendered blank both come from this function, so they can never
// disagree about a space.
export function fillTask(task, filler) {
  const { kind, item } = task;
  if (kind === "memory") return filler;
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

// Which letters of a written word are right, position by position.
// Used to mark the misses without ever marking them by colour alone.
export function letterDiff(expected, typed) {
  return expected.split("").map((ch, i) => (typed[i] || "") === ch);
}

export function needsStudyStep(task) {
  return task.kind === "memory";
}
