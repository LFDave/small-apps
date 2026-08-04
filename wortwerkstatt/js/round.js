// round.js — pure round logic: drawing the tasks, joining the visible
// text around the blank, and checking answers. No DOM access; app.js
// owns the state and ui.js renders it. The e2e suite imports this
// module directly to derive the expected answers, so the tests can
// never drift from the engine.

import { shuffle } from "./util.js?v=8";

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
// Which of the child's words are right, and how many are missing.
// Returns { rows, missing }.
//
// A **punctuation mark is judged on its own**, not as part of the word
// it hangs off. Writing "leicht" for "leicht." spells the word
// perfectly and forgets the full stop; marking the word red would say
// the child got the word wrong and hide which of the two rules they
// actually missed.
//
// The two sentences are **aligned**, not walked position by position:
// position by position, one word dropped in the middle shifts
// everything after it and the rest of the sentence turns red.
//
// The alignment pairs tokens that are the **same word written
// differently** — the same letters in another case, or within an edit
// or two. That is what decides where a gap belongs. Pairing by position
// instead would match "fil" to "Lernen" and "im" to "fiel", and the
// dots for the words genuinely left out would land nowhere near them.
export function wordDiff(expected, typed) {
  const rows = [];
  let missing = 0;

  for (const op of align(splitTokens(expected), splitTokens(typed))) {
    if (op.type === "drop") {
      // Nothing was written here, so the gap is shown where it belongs.
      rows.push({ word: "", ok: false, gap: true, punct: op.want.punct });
      if (!op.want.punct) missing += 1;
    } else {
      const ok = op.type === "pair" && op.want.text === op.got.text;
      rows.push({ word: op.got.text, ok, punct: op.got.punct });
    }
  }
  return { rows, missing };
}

// Order-preserving alignment of two token lists over `sameWord`.
function align(want, got) {
  const n = want.length;
  const m = got.length;
  const lcs = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] = sameWord(want[i], got[j])
        ? lcs[i + 1][j + 1] + 1
        : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }
  const ops = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (sameWord(want[i], got[j])) ops.push({ type: "pair", want: want[i++], got: got[j++] });
    else if (lcs[i + 1][j] >= lcs[i][j + 1]) ops.push({ type: "drop", want: want[i++] });
    else ops.push({ type: "add", got: got[j++] });
  }
  while (j < m) ops.push({ type: "add", got: got[j++] });
  while (i < n) ops.push({ type: "drop", want: want[i++] });
  return ops;
}

// Whether two tokens are one word the child was reaching for: the same
// letters in another case, or close enough that "fil" is plainly an
// attempt at "fiel". A mark never pairs with a word.
function sameWord(a, b) {
  if (a.punct !== b.punct) return false;
  const x = a.text.toLowerCase();
  const y = b.text.toLowerCase();
  if (x === y) return true;
  const longest = Math.max(x.length, y.length);
  if (longest <= 2) return false;
  return editDistance(x, y) <= (longest <= 5 ? 1 : 2);
}

function editDistance(a, b) {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      row[j] = a[i - 1] === b[j - 1]
        ? prev[j - 1]
        : 1 + Math.min(prev[j - 1], prev[j], row[j - 1]);
    }
    prev = row;
  }
  return prev[b.length];
}

// A word and the mark that follows it are two things to get right, so
// they are two tokens: "leicht." becomes "leicht" and ".".
function splitTokens(value) {
  const tokens = [];
  for (const chunk of splitWords(value)) {
    const match = /^(.*?)([.,!?;:]+)$/.exec(chunk);
    if (!match) tokens.push({ text: chunk, punct: false });
    else {
      if (match[1]) tokens.push({ text: match[1], punct: false });
      tokens.push({ text: match[2], punct: true });
    }
  }
  return tokens;
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
