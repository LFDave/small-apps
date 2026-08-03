// app.js — controller: owns the state, handles all interactions via
// event delegation, persists through storage.js and renders via ui.js.

import { render } from "./ui.js?v=7";
import {
  topicById, chapterById, chaptersForCycle, topicKey, textById, textKey
} from "./data.js?v=7";
import { t, setLanguage } from "./i18n.js?v=7";
import * as storage from "./storage.js?v=7";
import {
  buildRound, buildTextRound, isCorrect, needsStudyStep, expectedAnswer,
  isTyped, needsConfirm, looksComplete, normaliseTyped
} from "./round.js?v=7";
import { award, xpForRound } from "./game.js?v=7";

// Consecutive clean rounds before the app offers the next cycle. The
// offer is a suggestion, never a forced step (GAMIFICATION.md).
const MASTERY_RUNS = 5;

const state = {
  view: "home",
  topicId: null,
  data: storage.load(),
  round: null
};

setLanguage(state.data.settings.language);

function go(view) {
  state.view = view;
  render(state);
}

function goHome() {
  state.round = null;
  state.topicId = null;
  go("home");
}

// Back goes one step up the path the child came down: a round returns
// to its rule, a rule returns home.
function goBack() {
  if (state.view === "round" && state.round && state.round.topicId) {
    state.topicId = state.round.topicId;
    state.round = null;
    go("topic");
    return;
  }
  goHome();
}

/* ── Settings ────────────────────────────────────────────────────── */

// Settings apply and persist immediately: no save button, no confirm
// (shared settings pattern in PRODUCT.md).
function setSetting(key, value) {
  state.data.settings[key] = value;
  if (key === "language") setLanguage(value);
  if (key === "cycle") {
    // Difficulty changed, so the mastery streak starts over. Silent:
    // no message, nothing lost.
    state.data.game.cleanCycle = value;
    state.data.game.cleanCount = 0;
  }
  storage.save(state.data);
  render(state);
}

/* ── Rounds ──────────────────────────────────────────────────────── */

function startRound({ entries, title, topicId, chapterId, textId, tasks: given }) {
  const tasks = given || (entries.length ? buildRound(entries) : []);
  if (!tasks.length) return;
  state.round = {
    title,
    topicId: topicId || null,
    chapterId: chapterId || null,
    textId: textId || null,
    cycle: state.data.settings.cycle,
    tasks,
    i: 0,
    phase: needsStudyStep(tasks[0]) ? "study" : "ask",
    typed: "",
    chosen: null,
    wrong: 0,
    missed: false,
    firstTry: [],
    reward: null,
    suggestCycle: null,
    nextChapterId: null,
    nextChapterIndex: 0
  };
  go("round");
}

function startChapter(chapterId) {
  const found = chapterById(state.data.settings.contentLanguage, chapterId);
  if (!found) return;
  startRound({
    entries: [{ topic: found.topic, chapter: found.chapter }],
    title: t("topic" + topicKey(found.topic.id) + "Title"),
    topicId: found.topic.id,
    chapterId: found.chapter.id
  });
}

function startTopicMixed(topicId) {
  const topic = topicById(state.data.settings.contentLanguage, topicId);
  if (!topic) return;
  startRound({
    entries: topic.chapters.map((chapter) => ({ topic, chapter })),
    title: t("topic" + topicKey(topic.id) + "Title"),
    topicId: topic.id
  });
}

function startCycleMixed() {
  const { contentLanguage, cycle } = state.data.settings;
  startRound({
    entries: chaptersForCycle(contentLanguage, cycle),
    title: t("roundMixed")
  });
}

// The writing mode: a whole text, sentence by sentence, in order.
function startText(textId) {
  const text = textById(state.data.settings.contentLanguage, textId);
  if (!text) return;
  startRound({
    entries: [],
    tasks: buildTextRound(text),
    title: t("text" + textKey(text.id) + "Title"),
    textId: text.id
  });
}

function restartRound() {
  const r = state.round;
  if (r.textId) startText(r.textId);
  else if (r.chapterId) startChapter(r.chapterId);
  else if (r.topicId) startTopicMixed(r.topicId);
  else startCycleMixed();
}

/* ── Answering ───────────────────────────────────────────────────── */

function choose(value) {
  const r = state.round;
  if (!r || r.phase !== "ask") return;
  const task = r.tasks[r.i];
  if (isCorrect(task, value)) {
    r.phase = "correct";
    r.firstTry[r.i] = !r.missed;
  } else {
    r.chosen = value;
    r.wrong += 1;
    r.missed = true;
    r.phase = "wrong";
  }
  storage.save(state.data);
  render(state);
}

// Known-length input: evaluated as a whole answer the moment the last
// character lands, never character by character while typing.
function checkWritten({ confirmed = false } = {}) {
  const r = state.round;
  if (!r || r.phase !== "ask") return;
  const task = r.tasks[r.i];
  const typed = normaliseTyped(r.typed);
  // A confirmed answer is judged exactly as written, however long it
  // is. An auto-checked one waits for the last character.
  if (!confirmed && r.typed.length < expectedAnswer(task).length) return;
  if (confirmed && typed === "") return;
  r.typed = typed;
  if (isCorrect(task, typed)) {
    r.phase = "correct";
    r.firstTry[r.i] = !r.missed;
    state.data.game.written += 1;
  } else {
    r.wrong += 1;
    r.missed = true;
    r.phase = "wrong";
  }
  storage.save(state.data);
  render(state);
}

function nextTask() {
  const r = state.round;
  r.i += 1;
  r.typed = "";
  r.chosen = null;
  r.wrong = 0;
  r.missed = false;
  if (r.i >= r.tasks.length) finishRound();
  else r.phase = needsStudyStep(r.tasks[r.i]) ? "study" : "ask";
  render(state);
}

function finishRound() {
  const r = state.round;
  const g = state.data.game;
  const firstTry = r.firstTry.filter(Boolean).length;
  const corrected = r.tasks.length - firstTry;

  g.rounds += 1;
  if (!g.cycles.includes(r.cycle)) g.cycles.push(r.cycle);

  // Every chapter the round actually drew from gets the credit, so
  // mixed practice moves the chapter cards too. A chapter counts as
  // clean only when all of its tasks in this round were right first
  // time.
  const bucket = r.textId ? state.data.texts : state.data.chapters;
  const perUnit = new Map();
  r.tasks.forEach((task, i) => {
    const id = r.textId || task.chapterId;
    const acc = perUnit.get(id) || { clean: true };
    if (!r.firstTry[i]) acc.clean = false;
    perUnit.set(id, acc);
  });
  for (const [id, acc] of perUnit) {
    if (!bucket[id]) bucket[id] = { rounds: 0, clean: 0 };
    bucket[id].rounds += 1;
    if (acc.clean) bucket[id].clean += 1;
  }

  // Clean runs at the current cycle build toward the suggestion to step
  // up. A round with mistakes resets the streak silently and still
  // earns full XP: struggling is practising, not failing.
  if (g.cleanCycle !== r.cycle) {
    g.cleanCycle = r.cycle;
    g.cleanCount = 0;
  }
  g.cleanCount = corrected === 0 ? g.cleanCount + 1 : 0;
  r.suggestCycle = g.cleanCount >= MASTERY_RUNS && r.cycle < 3 ? r.cycle + 1 : null;

  // Point at the next chapter of the same rule, so the chapters read as
  // a path rather than a list.
  const found = r.chapterId ? chapterById(state.data.settings.contentLanguage, r.chapterId) : null;
  if (found && found.index + 1 < found.topic.chapters.length) {
    r.nextChapterId = found.topic.chapters[found.index + 1].id;
    r.nextChapterIndex = found.index + 1;
  }

  const wasTyped = r.tasks.every((task) => isTyped(task.kind));
  r.reward = award(state.data, xpForRound(r.cycle, firstTry, corrected, wasTyped));
  r.phase = "done";
  storage.save(state.data);
}

/* ── Event wiring ────────────────────────────────────────────────── */

document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const r = state.round;
  switch (el.dataset.action) {
    case "nav-home": goHome(); break;
    case "nav-back": goBack(); break;
    case "nav-settings": go("settings"); break;
    case "nav-medals": go("medals"); break;
    case "set-lang": setSetting("language", el.dataset.lang); break;
    case "set-content": setSetting("contentLanguage", el.dataset.content); break;
    case "set-cycle": setSetting("cycle", Number(el.dataset.cycle)); break;
    case "open-topic": state.topicId = el.dataset.id; go("topic"); break;
    case "start-chapter": startChapter(el.dataset.id); break;
    case "start-topic-mixed": startTopicMixed(el.dataset.id); break;
    case "start-cycle-mixed": startCycleMixed(); break;
    case "start-text": startText(el.dataset.id); break;
    case "check": checkWritten({ confirmed: true }); break;
    case "choose": choose(el.dataset.value); break;
    case "study-done": r.phase = "ask"; render(state); break;
    case "next": nextTask(); break;
    case "retry": {
      // A sentence is expensive to retype, so a retry keeps what was
      // written and the child fixes the word that is marked. A single
      // word is three to ten characters, so it starts fresh.
      if (!needsConfirm(r.tasks[r.i].kind)) r.typed = "";
      r.chosen = null;
      r.phase = "ask";
      render(state);
      break;
    }
    case "reveal": r.phase = "reveal"; render(state); break;
    case "reveal-done": {
      // The miss stays on the record for the summary; only the counter
      // that offers the reveal starts over.
      r.typed = "";
      r.chosen = null;
      r.wrong = 0;
      r.phase = "ask";
      render(state);
      break;
    }
    case "again": restartRound(); break;
    case "accept-cycle": {
      const next = Number(el.dataset.cycle);
      state.data.settings.cycle = next;
      state.data.game.cleanCycle = next;
      state.data.game.cleanCount = 0;
      storage.save(state.data);
      startCycleMixed();
      break;
    }
    case "reset-all": {
      if (confirm(t("resetConfirm"))) {
        state.data = storage.reset(state.data.settings);
        goHome();
      }
      break;
    }
  }
});

// The written answer is tracked without re-rendering, so the caret and
// the focus stay where the child put them. The render happens once, on
// the check.
document.addEventListener("input", (e) => {
  if (e.target.id !== "answer") return;
  const r = state.round;
  if (!r || r.phase !== "ask") return;
  const value = e.target.value;
  if (value.length > r.typed.length) {
    state.data.game.charsTyped += value.length - r.typed.length;
  }
  r.typed = value;
  const task = r.tasks[r.i];
  if (!needsConfirm(task.kind)) {
    checkWritten();
  } else if (looksComplete(expectedAnswer(task), value)) {
    // The sentence looks finished, so there is nothing to wait for.
    // The button stays for everything this cannot tell apart from a
    // sentence still being typed.
    checkWritten({ confirmed: true });
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  if (!(e.target instanceof HTMLElement) || e.target.id !== "answer") return;
  e.preventDefault();
  // Where a confirm button exists, Enter is the same button. Where the
  // answer checks itself, Enter must do nothing, or it would read as a
  // confirm button that is not there.
  const r = state.round;
  if (r && r.phase === "ask" && needsConfirm(r.tasks[r.i].kind)) {
    checkWritten({ confirmed: true });
  }
});

render(state);
