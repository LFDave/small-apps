// app.js — controller: owns the state, handles all interactions via
// event delegation, persists through storage.js and renders via ui.js.

import { render } from "./ui.js?v=1";
import { topicById, topicsForCycle } from "./data.js?v=1";
import { t, setLanguage } from "./i18n.js?v=1";
import * as storage from "./storage.js?v=1";
import { buildRound, isCorrect, needsStudyStep, expectedAnswer } from "./round.js?v=1";
import { award, xpForRound } from "./game.js?v=1";

// Consecutive clean rounds before the app offers the next cycle. The
// offer is a suggestion, never a forced step (GAMIFICATION.md).
const MASTERY_RUNS = 5;

const state = {
  view: "home",
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
  go("home");
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

/* ── Round ───────────────────────────────────────────────────────── */

// topicId null means a mixed round over every rule of the cycle.
function startRound(topicId) {
  const { cycle, contentLanguage } = state.data.settings;
  const topic = topicId ? topicById(contentLanguage, topicId) : null;
  const topics = topic ? [topic] : topicsForCycle(contentLanguage, cycle);
  if (topics.length === 0) return;
  const tasks = buildRound(topics);
  state.round = {
    topicId: topic ? topic.id : null,
    cycle,
    tasks,
    i: 0,
    phase: needsStudyStep(tasks[0]) ? "study" : "ask",
    typed: "",
    chosen: null,
    wrong: 0,
    missed: false,
    firstTry: [],
    reward: null,
    suggestCycle: null
  };
  go("round");
}

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

// Known-length input: evaluated as a whole word the moment the last
// letter lands, never letter by letter while typing.
function checkWritten() {
  const r = state.round;
  const task = r.tasks[r.i];
  if (r.typed.length < expectedAnswer(task).length) return;
  if (isCorrect(task, r.typed)) {
    r.phase = "correct";
    r.firstTry[r.i] = !r.missed;
    state.data.game.memoryWords += 1;
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

  // Every rule the round actually drew from gets the credit, so mixed
  // practice moves the topic cards too. A rule counts as clean only
  // when all of its tasks in this round were right first time.
  const perTopic = new Map();
  r.tasks.forEach((task, i) => {
    const acc = perTopic.get(task.topicId) || { clean: true };
    if (!r.firstTry[i]) acc.clean = false;
    perTopic.set(task.topicId, acc);
  });
  for (const [id, acc] of perTopic) {
    if (!state.data.topics[id]) state.data.topics[id] = { rounds: 0, clean: 0 };
    const progress = state.data.topics[id];
    progress.rounds += 1;
    if (acc.clean) progress.clean += 1;
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

  r.reward = award(state.data, xpForRound(r.cycle, firstTry, corrected));
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
    case "nav-settings": go("settings"); break;
    case "nav-medals": go("medals"); break;
    case "set-lang": setSetting("language", el.dataset.lang); break;
    case "set-content": setSetting("contentLanguage", el.dataset.content); break;
    case "set-cycle": setSetting("cycle", Number(el.dataset.cycle)); break;
    case "start-topic": startRound(el.dataset.id); break;
    case "start-mixed": startRound(null); break;
    case "choose": choose(el.dataset.value); break;
    case "study-done": r.phase = "ask"; render(state); break;
    case "next": nextTask(); break;
    case "retry": {
      r.typed = "";
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
    case "again": startRound(r.topicId); break;
    case "accept-cycle": {
      const next = Number(el.dataset.cycle);
      state.data.settings.cycle = next;
      state.data.game.cleanCycle = next;
      state.data.game.cleanCount = 0;
      storage.save(state.data);
      startRound(null);
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
  checkWritten();
});

// Enter must not submit anything: the answer checks itself on the last
// letter, and an early Enter would look like a confirm button.
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target instanceof HTMLElement && e.target.id === "answer") {
    e.preventDefault();
  }
});

render(state);
