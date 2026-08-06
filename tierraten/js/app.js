// app.js — controller: owns the state, handles every interaction through
// event delegation, persists via storage.js and draws via ui.js.

import { render } from "./ui.js?v=1";
import {
  CLUE_COUNT, ROUND_SIZES, MASTERY_RUNS,
  animalById, nameOf, matchesName
} from "./data.js?v=1";
import { t, setLanguage } from "./i18n.js?v=1";
import * as storage from "./storage.js?v=1";
import { pickAnimals, optionsFor, nextLetter } from "./round.js?v=1";
import { award, levelFor, xpForRound } from "./game.js?v=1";

const state = {
  view: "home",
  data: storage.load(),
  round: null,
  nextLetter: null
};

setLanguage(state.data.settings.language);

// Where the alphabet walk stands. Recomputed before every draw, because
// solving an animal, switching language and clearing progress all move
// it, and the home screen and the completion screen both point at it.
function refresh() {
  state.nextLetter = nextLetter(state.data.settings.language, state.data);
  render(state);
}

function go(view) {
  state.view = view;
  refresh();
}

function goHome() {
  state.round = null;
  go("home");
}

// Back goes one step up the path: a round returns to the letters, and so
// does everything else.
function goBack() {
  goHome();
}

/* ── Settings ────────────────────────────────────────────────────── */

// Settings apply and persist immediately: no save button, no confirm
// (shared settings pattern in PRODUCT.md).
function setSetting(key, value) {
  state.data.settings[key] = value;
  if (key === "language") setLanguage(value);
  if (key === "roundSize") {
    // The round length changed, so the mastery streak starts over.
    // Silent: no message, nothing lost.
    state.data.game.cleanSize = value;
    state.data.game.cleanRuns = 0;
  }
  storage.save(state.data);
  refresh();
}

/* ── Rounds ──────────────────────────────────────────────────────── */

function startLetter(letter) {
  const { language, roundSize } = state.data.settings;
  const ids = pickAnimals(letter, language, roundSize, state.data);
  if (!ids.length) return;
  state.round = {
    letter,
    ids,
    size: roundSize,
    i: 0,
    clues: 1,
    phase: "ask",
    typed: "",
    lastGuess: null,
    note: null,
    options: optionsFor(ids[0], language),
    results: [],
    reward: null,
    suggestSize: null,
    nextLetter: null
  };
  go("round");
}

function currentAnimal() {
  return animalById(state.round.ids[state.round.i]);
}

function nextClue() {
  const r = state.round;
  if (r.phase !== "ask" || r.clues >= CLUE_COUNT) return;
  r.clues += 1;
  refresh();
}

function solve() {
  const r = state.round;
  const animal = currentAnimal();
  const entry = state.data.animals[animal.id] || { solved: 0, revealed: 0, bestClues: 0 };
  entry.solved += 1;
  // The fewest clues this animal ever needed. 0 means "never solved", so
  // the first solve always writes.
  entry.bestClues = entry.bestClues === 0 ? r.clues : Math.min(entry.bestClues, r.clues);
  state.data.animals[animal.id] = entry;
  r.results.push({ id: animal.id, solved: true, clues: r.clues });
  r.phase = "solved";
  r.lastGuess = null;
  r.note = null;
  storage.save(state.data);
  refresh();
}

function wrongGuess(text) {
  const r = state.round;
  r.lastGuess = text;
  r.note = null;
  storage.save(state.data);
  refresh();
}

// Choosing a name is one guess, right or wrong. Effort counts, so the
// counter moves either way (GAMIFICATION.md).
function choose(id) {
  const r = state.round;
  if (r.phase !== "ask") return;
  state.data.game.guesses += 1;
  if (id === currentAnimal().id) solve();
  else wrongGuess(nameOf(animalById(id), state.data.settings.language));
}

// A typed guess is judged as a whole word. It checks itself the moment
// it is spelled right, which is the reward the known-length pattern is
// after (PRODUCT.md); everything else needs the button, because the app
// must not give away how many letters the name has.
function checkTyped({ confirmed = false } = {}) {
  const r = state.round;
  if (r.phase !== "ask") return;
  const typed = r.typed.trim();
  const right = typed !== "" && matchesName(currentAnimal(), state.data.settings.language, typed);
  if (!right && !confirmed) return;
  if (!right && typed === "") {
    r.note = "empty";
    r.lastGuess = null;
    refresh();
    return;
  }
  state.data.game.guesses += 1;
  if (right) solve();
  else wrongGuess(typed);
}

function reveal() {
  const r = state.round;
  if (r.phase !== "ask") return;
  const animal = currentAnimal();
  const entry = state.data.animals[animal.id] || { solved: 0, revealed: 0, bestClues: 0 };
  entry.revealed += 1;
  state.data.animals[animal.id] = entry;
  r.results.push({ id: animal.id, solved: false, clues: r.clues });
  r.clues = CLUE_COUNT;
  r.phase = "revealed";
  r.lastGuess = null;
  r.note = null;
  storage.save(state.data);
  refresh();
}

function nextAnimal() {
  const r = state.round;
  r.i += 1;
  if (r.i >= r.ids.length) {
    finishRound();
    return;
  }
  r.clues = 1;
  r.phase = "ask";
  r.typed = "";
  r.lastGuess = null;
  r.note = null;
  r.options = optionsFor(r.ids[r.i], state.data.settings.language);
  refresh();
}

function finishRound() {
  const r = state.round;
  const g = state.data.game;
  const xpBefore = g.xp;

  g.rounds += 1;

  // A clean run is a round where nothing had to be shown. A run with a
  // reveal resets the streak silently: no message, no lost progress, and
  // the full XP either way.
  if (g.cleanSize !== r.size) {
    g.cleanSize = r.size;
    g.cleanRuns = 0;
  }
  const clean = r.results.every((res) => res.solved);
  g.cleanRuns = clean ? g.cleanRuns + 1 : 0;

  const bigger = ROUND_SIZES.filter((n) => n > r.size)[0] || null;
  r.suggestSize = g.cleanRuns >= MASTERY_RUNS && bigger ? bigger : null;

  // The forward button starts looking after the letter just played, so
  // it moves the walk on. A letter that still holds something unguessed
  // is not lost: the home screen keeps pointing at it, and "Nochmal"
  // deals the rest of it straight away.
  r.nextLetter = nextLetter(state.data.settings.language, state.data, r.letter);

  r.reward = award(state.data, xpForRound(r.results));
  r.reward.levelUp = levelFor(g.xp).index > levelFor(xpBefore).index;
  r.phase = "done";
  storage.save(state.data);
  refresh();
}

/* ── Event wiring ────────────────────────────────────────────────── */

document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  switch (el.dataset.action) {
    case "nav-home": goHome(); break;
    case "nav-back": goBack(); break;
    case "nav-settings": go("settings"); break;
    case "nav-medals": go("medals"); break;
    case "set-lang": setSetting("language", el.dataset.lang); break;
    case "set-answer": setSetting("answerMode", el.dataset.mode); break;
    case "set-size": setSetting("roundSize", Number(el.dataset.size)); break;
    case "start-letter": startLetter(el.dataset.letter); break;
    case "next-clue": nextClue(); break;
    case "choose": choose(el.dataset.id); break;
    case "check": checkTyped({ confirmed: true }); break;
    case "reveal": reveal(); break;
    case "next-animal": nextAnimal(); break;
    case "again": startLetter(state.round.letter); break;
    case "accept-size": {
      const size = Number(el.dataset.size);
      state.data.settings.roundSize = size;
      state.data.game.cleanSize = size;
      state.data.game.cleanRuns = 0;
      storage.save(state.data);
      startLetter(state.round.letter);
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

// The typed guess is tracked without re-rendering, so the caret and the
// focus stay where the child put them. The draw happens once, when the
// name comes out right.
document.addEventListener("input", (e) => {
  if (e.target.id !== "guess") return;
  const r = state.round;
  if (!r || r.phase !== "ask") return;
  r.typed = e.target.value;
  checkTyped();
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  if (!(e.target instanceof HTMLElement) || e.target.id !== "guess") return;
  e.preventDefault();
  checkTyped({ confirmed: true });
});

refresh();
