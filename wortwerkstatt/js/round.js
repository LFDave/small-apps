// round.js — pure round logic: drawing the tasks, joining the visible
// text around the blank, and checking answers. No DOM access; app.js
// owns the state and ui.js renders it. The e2e suite imports this
// module directly to derive the expected answers, so the tests can
// never drift from the engine.

import { shuffle } from "./util.js?v=5";

export const ROUND_SIZE = 6;

// Task kinds. The first three are answered by choosing, the last three
// by writing. Every item stores its solution in `answer`, so checking
// is the same everywhere.
export const CHOICE_KINDS = ["word", "sentence", "punct"];
export const TYPED_KINDS = ["memory", "write", "copy", "text"];

export function isTyped(kind) {
  return TYPED_KINDS.includes(kind);
}

// Whole sentences are confirmed, single words check themselves.
//
// The known-length pattern only works while the length is knowable by
// the person typing. For a word with "8 Buchstaben" under the field it
// is: you can count eight letters. For a 45-character sentence it is
// not — and a child who leaves out one comma then types a sentence that
// looks finished, never reaches the expected length, and gets no
// response at all. PRODUCT.md covers exactly this case: keep a confirm
// button where the input length is unknown.
export const CONFIRM_KINDS = ["copy", "text"];

export function needsConfirm(kind) {
  return CONFIRM_KINDS.includes(kind);
}

// Spacing is not the lesson. A trailing space or a double space between
// two words is a slip of the thumb, not a spelling mistake, so it is
// normalised away before anything is judged.
export function normaliseTyped(value) {
  return String(value).trim().replace(/\s+/g, " ");
}

function wordCount(value) {
  const t = normaliseTyped(value);
  return t === "" ? 0 : t.split(" ").length;
}

// Whether a sentence can be judged without waiting for the button.
//
// Two cases are safe. Exactly right is trivially safe: the answer ends
// in a sentence mark, so passing through it means the child is done.
// Same word count and ending on a sentence mark is the other: it is how
// a finished sentence looks, and it catches the whole common error
// class — a missing comma, a small letter, one letter short in a word.
//
// Everything else still waits for the button, because a sentence with
// too few or too many words is indistinguishable from one that is still
// being typed. Judging that would be judging characters as they are
// typed, which recall must never become.
export function looksComplete(expected, typed) {
  const value = normaliseTyped(typed);
  if (value === expected) return true;
  if (!/[.!?]$/.test(value)) return false;
  return wordCount(value) === wordCount(expected);
}

// Only the memory kind hides the answer first and asks for it back.
// Write derives it from the rule, copy has it on screen the whole time.
// Which of the child's words are right.
//
// The comparison aligns the two sentences rather than walking them
// position by position. Position by position, one word dropped in the
// middle shifts everything after it and the rest of the sentence turns
// red, which tells a child nothing except that they failed. Aligned, a
// word they got right stays right no matter what happened around it.
//
// A dropped word immediately followed by an unexpected one is one word
// written differently, not one lost and one gained, so the two collapse
// into a single marked word.
export function wordDiff(expected, typed) {
  const want = splitWords(expected);
  const got = splitWords(typed);
  const n = want.length;
  const m = got.length;

  // Longest common subsequence over the suffixes of both sentences.
  const lcs = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] = want[i] === got[j]
        ? lcs[i + 1][j + 1] + 1
        : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const rows = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (want[i] === got[j]) rows.push({ word: got[j++], ok: true, i: i++ });
    else if (lcs[i + 1][j] >= lcs[i][j + 1]) rows.push({ word: "", ok: false, dropped: true, i: i++ });
    else rows.push({ word: got[j++], ok: false });
  }
  while (j < m) rows.push({ word: got[j++], ok: false });
  while (i < n) rows.push({ word: "", ok: false, dropped: true, i: i++ });

  const merged = [];
  for (let k = 0; k < rows.length; k++) {
    const a = rows[k];
    const b = rows[k + 1];
    const pair = b && !a.ok && !b.ok && a.dropped !== b.dropped;
    if (pair) {
      merged.push({ word: a.dropped ? b.word : a.word, ok: false });
      k += 1;
    } else {
      merged.push({ word: a.word, ok: a.ok });
    }
  }
  return merged;
}

function splitWords(value) {
  const t = normaliseTyped(value);
  return t === "" ? [] : t.split(" ");
}

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

// A text is written in order: a paragraph that shuffles is not a
// paragraph. Every sentence of it is one task, so the round is as long
// as the text rather than ROUND_SIZE.
export function buildTextRound(text) {
  return text.sentences.map((item) => ({
    topicId: null,
    chapterId: null,
    textId: text.id,
    kind: "text",
    emptyOptionKey: null,
    item,
    options: null
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
  if (kind === "memory" || kind === "copy" || kind === "text") return filler;
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
