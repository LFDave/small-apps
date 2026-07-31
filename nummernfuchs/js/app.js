// app.js — controller: owns the state, handles all interactions via
// event delegation, persists through storage.js and renders via ui.js.

import { render, intlPreviewText } from "./ui.js?v=3";
import { STRINGS as S } from "./data.js?v=3";
import * as storage from "./storage.js?v=3";
import { parseNumberInput, autoChunk, randomDigits } from "./util.js?v=3";
import {
  buildLadder, expectedChars, checkTyped, stepNeedsInput, stepAllowsPlus,
  buildQuiz
} from "./practice.js?v=3";

const state = {
  view: "home",
  data: storage.load(),
  form: null,
  ladder: null,
  quiz: null
};

function go(view) {
  state.view = view;
  render(state);
}

function goHome() {
  state.form = null;
  state.ladder = null;
  state.quiz = null;
  go("home");
}

/* ── Form ────────────────────────────────────────────────────────── */

function newForm(entry) {
  if (entry) {
    return {
      editingId: entry.id, type: entry.type, label: entry.label,
      numberRaw: entry.chunks.join(" "), intl: entry.intl !== false,
      cc: entry.cc || "41", error: null, parsedChunks: entry.chunks
    };
  }
  return {
    editingId: null, type: "code", label: "", numberRaw: "",
    intl: true, cc: "41", error: null, parsedChunks: null
  };
}

function saveForm() {
  const f = state.form;
  const label = f.label.trim();
  if (!label) return formError("errLabelEmpty");
  if (label.length > 24) return formError("errLabelLong");
  const parsed = parseNumberInput(f.numberRaw, f.type);
  if (parsed.error) return formError(parsed.error);
  const cc = (f.cc || "").replace(/\s/g, "");
  if (f.type === "phone" && f.intl && !/^\d{1,3}$/.test(cc)) return formError("errCcInvalid");

  if (f.editingId) {
    const entry = state.data.entries.find((e) => e.id === f.editingId);
    if (entry) {
      if (entry.chunks.join("") !== parsed.digits) entry.completions = 0;
      entry.label = label;
      entry.type = f.type;
      entry.chunks = parsed.chunks;
      entry.intl = f.type === "phone" ? f.intl : false;
      entry.cc = cc || "41";
    }
  } else {
    state.data.entries.push({
      id: "e" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      type: f.type, label, chunks: parsed.chunks,
      intl: f.type === "phone" ? f.intl : false, cc: cc || "41",
      completions: 0, lastDone: null
    });
  }
  storage.save(state.data);
  goHome();
}

function formError(key) {
  state.form.error = key;
  render(state);
}

/* ── Ladder ──────────────────────────────────────────────────────── */

function startLadder(id) {
  const entry = state.data.entries.find((e) => e.id === id);
  if (!entry) return;
  state.ladder = {
    entryId: id, steps: buildLadder(entry), i: 0,
    typed: [], wrong: 0, phase: "input"
  };
  go("ladder");
}

// Random-number training: a transient entry that never touches
// storage. Completing it only offers the next random number.
function startTraining() {
  const digits = randomDigits(state.data.trainingLength);
  const entry = { type: "code", chunks: autoChunk(digits, "code"), completions: 0 };
  state.ladder = {
    trainEntry: entry, steps: buildLadder(entry), i: 0,
    typed: [], wrong: 0, phase: "input"
  };
  go("ladder");
}

function ladderAdvance() {
  const l = state.ladder;
  l.i += 1;
  l.typed = [];
  l.wrong = 0;
  l.phase = "input";
  if (l.i >= l.steps.length) {
    if (!l.trainEntry) {
      const entry = state.data.entries.find((e) => e.id === l.entryId);
      entry.completions += 1;
      entry.lastDone = Date.now();
      storage.save(state.data);
    }
    l.phase = "done";
  }
  render(state);
}

function ladderCheck() {
  const l = state.ladder;
  const step = l.steps[l.i];
  if (l.typed.length < expectedChars(step).length) return;
  if (checkTyped(step, l.typed).ok) {
    l.phase = "correct";
  } else {
    l.wrong += 1;
    l.phase = "wrong";
  }
  render(state);
}

/* ── Quiz ────────────────────────────────────────────────────────── */

function startQuiz() {
  state.quiz = {
    rounds: buildQuiz(), i: 0, typed: [], phase: "ask",
    firstTry: {}, wrongThisRound: false, copyAgain: false
  };
  go("quiz");
}

function quizCheck() {
  const q = state.quiz;
  const number = q.rounds[q.i];
  if (q.typed.length < number.length) return;
  const correct = q.typed.join("") === number;
  if (correct) {
    q.phase = "correct";
    const firstTry = !q.wrongThisRound;
    q.firstTry[number] = firstTry;
    const streak = state.data.emergency[number] || 0;
    state.data.emergency[number] = firstTry ? streak + 1 : 0;
    storage.save(state.data);
  } else if (q.phase === "ask") {
    q.wrongThisRound = true;
    q.phase = "copy";
    q.typed = [];
  } else {
    q.copyAgain = true;
    q.typed = [];
  }
  render(state);
}

function quizNext() {
  const q = state.quiz;
  q.i += 1;
  q.typed = [];
  q.wrongThisRound = false;
  q.copyAgain = false;
  q.phase = q.i >= q.rounds.length ? "done" : "ask";
  render(state);
}

/* ── Shared input handling ───────────────────────────────────────── */

function activeInput() {
  if (state.view === "ladder" && state.ladder.phase === "input") {
    const step = state.ladder.steps[state.ladder.i];
    if (!stepNeedsInput(step)) return null;
    return {
      typed: state.ladder.typed,
      max: expectedChars(step).length,
      allowPlus: stepAllowsPlus(step)
    };
  }
  if (state.view === "quiz" && (state.quiz.phase === "ask" || state.quiz.phase === "copy")) {
    return {
      typed: state.quiz.typed,
      max: state.quiz.rounds[state.quiz.i].length,
      allowPlus: false
    };
  }
  return null;
}

// PIN-pad model: no confirm button. The answer is evaluated the moment
// the last cell fills; the advisory line under the pad announces this
// behavior beforehand (WCAG 3.2.2 On Input).
function pressKey(key) {
  const input = activeInput();
  if (!input) return;
  if (key === "back") {
    input.typed.pop();
  } else if (key === "+") {
    if (!input.allowPlus || input.typed.length >= input.max) return;
    input.typed.push("+");
  } else {
    if (input.typed.length >= input.max) return;
    input.typed.push(key);
  }
  if (input.typed.length >= input.max) {
    if (state.view === "ladder") ladderCheck();
    else quizCheck();
    return;
  }
  render(state);
}

/* ── Event wiring ────────────────────────────────────────────────── */

document.addEventListener("click", (e) => {
  const keyBtn = e.target.closest("[data-key]");
  if (keyBtn) {
    pressKey(keyBtn.dataset.key);
    return;
  }
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const id = el.dataset.id;
  switch (el.dataset.action) {
    case "nav-home": goHome(); break;
    case "nav-add": state.form = newForm(null); go("form"); break;
    case "nav-edit": {
      const entry = state.data.entries.find((en) => en.id === id);
      if (entry) { state.form = newForm(entry); go("form"); }
      break;
    }
    case "form-type": {
      state.form.type = el.dataset.type;
      const parsed = parseNumberInput(state.form.numberRaw, state.form.type);
      state.form.parsedChunks = parsed.error ? null : parsed.chunks;
      state.form.error = null;
      render(state);
      break;
    }
    case "form-save": saveForm(); break;
    case "form-delete": {
      if (confirm(S.formDeleteConfirm)) {
        state.data.entries = state.data.entries.filter((en) => en.id !== state.form.editingId);
        storage.save(state.data);
        goHome();
      }
      break;
    }
    case "reset-all": {
      if (confirm(S.resetConfirm)) {
        state.data = storage.reset();
        render(state);
      }
      break;
    }
    case "practice": startLadder(id); break;
    case "ladder-again": startLadder(id); break;
    case "train-len": {
      const next = state.data.trainingLength + Number(el.dataset.delta);
      state.data.trainingLength = Math.min(16, Math.max(3, next));
      storage.save(state.data);
      render(state);
      break;
    }
    case "train-start": startTraining(); break;
    case "train-again": startTraining(); break;
    case "step-next": ladderAdvance(); break;
    case "retry": {
      state.ladder.typed = [];
      state.ladder.phase = "input";
      render(state);
      break;
    }
    case "reveal": state.ladder.phase = "reveal"; render(state); break;
    case "reveal-done": {
      state.ladder.typed = [];
      state.ladder.wrong = 0;
      state.ladder.phase = "input";
      render(state);
      break;
    }
    case "quiz-start": startQuiz(); break;
    case "quiz-next": quizNext(); break;
  }
});

document.addEventListener("input", (e) => {
  if (!state.form) return;
  if (e.target.id === "f-label") state.form.label = e.target.value;
  if (e.target.id === "f-number") {
    state.form.numberRaw = e.target.value;
    const parsed = parseNumberInput(e.target.value, state.form.type);
    state.form.parsedChunks = parsed.error ? null : parsed.chunks;
    updateIntlPreview();
  }
  if (e.target.id === "f-cc") {
    state.form.cc = e.target.value.replace(/\D/g, "");
    updateIntlPreview();
  }
});

document.addEventListener("change", (e) => {
  if (!state.form) return;
  if (e.target.id === "f-intl") {
    state.form.intl = e.target.checked;
    const details = document.getElementById("intl-details");
    if (details) details.hidden = !e.target.checked;
  }
});

function updateIntlPreview() {
  const preview = document.getElementById("intl-preview");
  if (preview) preview.textContent = intlPreviewText(state.form);
}

document.addEventListener("keydown", (e) => {
  const inField = e.target instanceof HTMLElement
    && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA");
  if (inField) {
    if (e.key === "Enter" && state.view === "form") {
      e.preventDefault();
      saveForm();
    }
    return;
  }
  if (/^[0-9]$/.test(e.key) || e.key === "+") {
    pressKey(e.key);
  } else if (e.key === "Backspace") {
    if (activeInput()) {
      e.preventDefault();
      pressKey("back");
    }
  }
});

render(state);
