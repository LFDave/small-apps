// ui.js — pure rendering: builds the HTML of each view from state. No
// state changes here; every interaction goes through a data-action
// attribute that app.js handles. Every label comes from i18n, so no copy
// lives in this file.

import { icon } from "./icons.js?v=1";
import {
  LANGUAGES, ANSWER_MODES, ROUND_SIZES, CLUES, CLUE_COUNT,
  animalById, nameOf, secondLetterOf, valueKey, clueLabelKey
} from "./data.js?v=1";
import { t } from "./i18n.js?v=1";
import { escapeHtml } from "./util.js?v=1";
import { letterRows } from "./round.js?v=1";
import { MEDALS, levelFor, medalProgress } from "./game.js?v=1";

export function render(state) {
  const app = document.getElementById("app");
  let html = "";
  if (state.view === "home") html = renderHome(state);
  else if (state.view === "round") html = renderRound(state);
  else if (state.view === "medals") html = renderMedals(state);
  else if (state.view === "settings") html = renderSettings(state);
  app.innerHTML = `<div class="shell">${html}</div>`;
  const auto = app.querySelector("[data-autofocus]");
  if (auto) {
    auto.focus();
    if (auto instanceof HTMLInputElement && auto.value) {
      auto.setSelectionRange(auto.value.length, auto.value.length);
    }
  }
}

/* ── Shared pieces ───────────────────────────────────────────────── */

function statsStrip(state) {
  const { xp } = state.data.game;
  const level = levelFor(xp);
  const medals = state.data.game.medals.length;
  const note = level.next
    ? t("statsToNext", { n: level.toNext, name: t(level.next.key) })
    : t("statsTop");
  return `
    <section class="stats" aria-label="${t("statsLevel", { n: level.number, name: t(level.key) })}">
      <div class="stats-row">
        <span class="stats-level">${t("statsLevel", { n: level.number, name: t(level.key) })}</span>
        <span class="stats-xp">${t("statsXp", { xp })}</span>
      </div>
      <div class="progress" role="presentation">
        <div class="progress-fill" style="transform: scaleX(${(level.progress).toFixed(3)})"></div>
      </div>
      <div class="stats-row">
        <span class="hint">${note}</span>
        <button type="button" class="btn-link" data-action="nav-medals">
          ${t("statsMedals", { k: medals, n: MEDALS.length })}
        </button>
      </div>
    </section>`;
}

function viewHeader(title) {
  return `
    <header class="view-header">
      <button type="button" class="btn-icon" data-action="nav-back" aria-label="${t("navBack")}">${icon("arrow-left")}</button>
      <h1>${title}</h1>
    </header>`;
}

/* ── Home ────────────────────────────────────────────────────────── */

function renderHome(state) {
  const lang = state.data.settings.language;
  const rows = letterRows(lang, state.data);

  const tiles = rows.map((row) => {
    if (!row.total) {
      return `
        <li>
          <span class="letter-tile letter-tile-empty" aria-label="${t("letterAria", { letter: row.letter })}: ${t("letterEmpty")}">
            <span class="letter-tile-char">${row.letter}</span>
            <span class="letter-tile-sub">${t("letterEmpty")}</span>
          </span>
        </li>`;
    }
    const complete = row.solved === row.total;
    const count = row.total === 1 ? t("letterCountOne") : t("letterCount", { n: row.total });
    const label = `${t("letterAria", { letter: row.letter })}: ${count}, ${t("letterSolved", { k: row.solved, n: row.total })}`;
    return `
      <li>
        <button type="button" class="letter-tile${complete ? " letter-tile-done" : ""}"
                data-action="start-letter" data-letter="${row.letter}" aria-label="${label}">
          <span class="letter-tile-char">${row.letter}</span>
          <span class="letter-tile-sub">${complete ? icon("check") : ""}${row.solved}/${row.total}</span>
        </button>
      </li>`;
  }).join("");

  const next = state.nextLetter;
  const continueBlock = next
    ? `
      <button type="button" class="btn btn-primary btn-wide" data-action="start-letter" data-letter="${next}">
        ${icon("paw-print")} ${t("homeContinue", { letter: next })}
      </button>
      <p class="hint">${t("homeContinueHint")}</p>`
    : `<p class="hint">${t("homeAllDone")}</p>`;

  return `
    <header class="app-header">
      <div class="app-header-row">
        <h1>${t("appTitle")}</h1>
        <button type="button" class="btn-icon" data-action="nav-settings" aria-label="${t("settingsOpen")}">${icon("settings")}</button>
      </div>
      <p class="tagline">${t("appTagline")}</p>
    </header>
    ${statsStrip(state)}
    <section class="section">
      <h2>${t("homeContinueTitle")}</h2>
      <div class="panel">${continueBlock}</div>
    </section>
    <section class="section">
      <h2>${t("homeAlphabet")}</h2>
      <ul class="letter-grid">${tiles}</ul>
      ${rows.some((row) => !row.total) ? `<p class="hint">${t("letterEmptyNote")}</p>` : ""}
    </section>
    <footer class="app-footer">
      <p class="hint">${t("homeStorageNote")}</p>
      <button type="button" class="btn-link" data-action="reset-all">${t("homeReset")}</button>
    </footer>`;
}

/* ── Clue rows ───────────────────────────────────────────────────── */

// One clue, drawn as a labelled fact rather than a sentence: the ladder
// has to read the same in every language, and a value like "Fast der
// ganzen Welt" cannot be poured into a fixed sentence frame in five.
function clueRow(clue, animal, lang) {
  const value = clue.field
    ? t(valueKey(clue.set, animal[clue.field]))
    : secondLetterOf(animal, lang);
  // The flag is the one thing the app fetches from outside, so it has to
  // fail quietly: without the onerror an offline reader gets a broken
  // image icon next to the country name. The name carries the clue, so
  // the image is decorative and drops out with nothing lost.
  const flag = clue.id === "land"
    ? `<img class="flag" src="https://flagcdn.com/w80/${animal.country}.png"
         srcset="https://flagcdn.com/w160/${animal.country}.png 2x"
         width="40" height="27" alt="" loading="lazy" onerror="this.remove()">`
    : "";
  return `
    <li class="clue">
      <span class="clue-icon">${icon(clue.icon)}</span>
      <span class="clue-main">
        <span class="clue-label">${t(clueLabelKey(clue.id))}</span>
        <span class="clue-value">${flag}${escapeHtml(value)}</span>
      </span>
    </li>`;
}

function nameRow(animal, lang) {
  return `
    <li class="clue clue-name">
      <span class="clue-icon">${icon("sparkles")}</span>
      <span class="clue-main">
        <span class="clue-label">${t("clueNameLabel")}</span>
        <span class="clue-value">${escapeHtml(nameOf(animal, lang))}</span>
      </span>
    </li>`;
}

/* ── Round ───────────────────────────────────────────────────────── */

function renderRound(state) {
  const r = state.round;
  if (r.phase === "done") return renderDone(state);

  const lang = state.data.settings.language;
  const animal = animalById(r.ids[r.i]);
  const shown = CLUES.slice(0, r.clues);
  const solvedOrShown = r.phase === "solved" || r.phase === "revealed";

  const clueList = shown.map((c) => clueRow(c, animal, lang)).join("")
    + (solvedOrShown ? nameRow(animal, lang) : "");

  const left = CLUE_COUNT - r.clues;
  const clueAction = solvedOrShown ? "" : (left > 0
    ? `
      <button type="button" class="btn btn-secondary btn-wide" data-action="next-clue">
        ${icon("lightbulb")} ${t("roundNextClue")}
      </button>
      <p class="hint">${left === 1 ? t("roundNextClueHintOne") : t("roundNextClueHint", { n: left })}</p>`
    : `<p class="hint">${t("roundAllClues")}</p>`);

  const progress = (r.i + (solvedOrShown ? 1 : 0)) / r.ids.length;

  return `
    ${viewHeader(t("roundTitle", { letter: r.letter }))}
    <section class="section">
      <p class="instruction">${t("roundProgress", { k: r.i + 1, n: r.ids.length })}</p>
      <div class="progress" role="presentation">
        <div class="progress-fill" style="transform: scaleX(${progress.toFixed(3)})"></div>
      </div>
      <div class="panel">
        <h2 class="panel-head">${t("roundCluesHead")}</h2>
        <ul class="clue-list">${clueList}</ul>
        ${clueAction}
      </div>
    </section>
    ${renderFeedback(state, animal, lang)}
    ${solvedOrShown ? renderAfter(state) : renderGuess(state, animal, lang)}`;
}

function renderFeedback(state, animal, lang) {
  const r = state.round;
  let tone = "";
  let body = "";
  if (r.phase === "solved") {
    tone = "success";
    const clues = r.clues;
    body = `<p><strong>${t("feedbackCorrect", { name: escapeHtml(nameOf(animal, lang)) })}</strong></p>
            <p>${clues === 1 ? t("feedbackCorrectCluesOne") : t("feedbackCorrectClues", { n: clues })}</p>`;
  } else if (r.phase === "revealed") {
    tone = "info";
    body = `<p>${t("feedbackRevealed", { name: escapeHtml(nameOf(animal, lang)) })}</p>`;
  } else if (r.note === "empty") {
    tone = "warning";
    body = `<p>${t("feedbackEmpty")}</p>`;
  } else if (r.lastGuess) {
    tone = "danger";
    body = `<p>${t("feedbackWrong", { guess: escapeHtml(r.lastGuess) })}</p>
            <p>${t("feedbackWrongTip")}</p>`;
  }
  // The region stays in the tree even when it is empty, so a result is
  // announced as a change inside it rather than as a new landmark.
  return `<div class="feedback${tone ? " feedback-" + tone : " feedback-empty"}" role="status">${body}</div>`;
}

function renderGuess(state, animal, lang) {
  const r = state.round;
  if (state.data.settings.answerMode === "choose") {
    const options = r.options.map((id) => {
      const other = animalById(id);
      return `
        <button type="button" class="choice choice-option" data-action="choose" data-id="${id}">
          <span class="choice-title">${escapeHtml(nameOf(other, lang))}</span>
        </button>`;
    }).join("");
    return `
      <section class="section">
        <h2 class="sr-only">${t("roundChooseLabel")}</h2>
        <p class="instruction">${t("roundChooseLabel")}</p>
        <div class="choice-grid choice-grid-options">${options}</div>
        <button type="button" class="btn-link" data-action="reveal">${t("roundReveal")}</button>
      </section>`;
  }
  return `
    <section class="section">
      <div class="guess-field">
        <label for="guess">${t("roundGuessLabel")}</label>
        <input id="guess" type="text" value="${escapeHtml(r.typed)}"
               placeholder="${t("roundGuessPlaceholder")}"
               autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"
               data-autofocus>
        <p class="hint">${t("roundGuessAdvice")}</p>
        <button type="button" class="btn btn-primary btn-wide" data-action="check">${t("roundGuessButton")}</button>
      </div>
      <button type="button" class="btn-link" data-action="reveal">${t("roundReveal")}</button>
    </section>`;
}

function renderAfter(state) {
  const r = state.round;
  const last = r.i + 1 >= r.ids.length;
  return `
    <section class="section">
      <button type="button" class="btn btn-primary btn-wide" data-action="next-animal">
        ${last ? t("roundFinish") : t("roundNextAnimal")} ${icon("chevron-right")}
      </button>
    </section>`;
}

/* ── Completion ──────────────────────────────────────────────────── */

function renderDone(state) {
  const r = state.round;
  const lang = state.data.settings.language;
  const solved = r.results.filter((x) => x.solved).length;

  const list = r.results.map((res) => {
    const animal = animalById(res.id);
    const note = res.solved ? t("doneListSolved", { n: res.clues }) : t("doneListRevealed");
    return `
      <li class="result">
        <span class="result-icon${res.solved ? " ok" : ""}">${icon(res.solved ? "circle-check" : "eye")}</span>
        <span class="result-main">
          <span class="result-name">${escapeHtml(nameOf(animal, lang))}</span>
          <span class="result-note">${note}</span>
        </span>
      </li>`;
  }).join("");

  const level = levelFor(state.data.game.xp);
  const levelLine = r.reward.levelUp
    ? `<p class="reward-line">${icon("star")} ${t("doneLevelUp", { name: t(level.key) })}</p>`
    : "";
  const medalLine = r.reward.medals.length
    ? `<div class="reward-medals">
         <p class="reward-line">${icon("medal")} ${r.reward.medals.length === 1 ? t("doneMedalsOne") : t("doneMedalsMany")}</p>
         <ul class="reward-medal-list">${r.reward.medals.map((id) => {
           const medal = MEDALS.find((m) => m.id === id);
           return `<li>${icon(medal.icon)} ${t(medalKey(id) + "Title")}</li>`;
         }).join("")}</ul>
       </div>`
    : "";

  const suggest = r.suggestSize
    ? `<div class="panel suggest">
         <p>${t("doneSuggest", { n: r.suggestSize })}</p>
         <button type="button" class="btn btn-secondary btn-wide" data-action="accept-size" data-size="${r.suggestSize}">
           ${t("doneSuggestAction", { n: r.suggestSize })}
         </button>
       </div>`
    : "";

  const nextLetter = r.nextLetter;

  return `
    ${viewHeader(t("doneTitle"))}
    <section class="section">
      <div class="panel">
        <p class="done-summary">${t("doneSummary", { k: solved, n: r.results.length })}</p>
        <ul class="result-list">${list}</ul>
      </div>
      <div class="panel reward">
        <p class="reward-xp">${t("doneXp", { xp: r.reward.xp })}</p>
        ${levelLine}
        ${medalLine}
      </div>
      ${suggest}
      <div class="actions">
        ${nextLetter ? `<button type="button" class="btn btn-primary btn-wide" data-action="start-letter" data-letter="${nextLetter}">
          ${t("doneNextLetter", { letter: nextLetter })} ${icon("chevron-right")}
        </button>` : ""}
        <button type="button" class="btn btn-secondary btn-wide" data-action="again">${icon("rotate-ccw")} ${t("doneAgain")}</button>
        <button type="button" class="btn-link" data-action="nav-home">${t("doneHome")}</button>
      </div>
    </section>`;
}

/* ── Medals ──────────────────────────────────────────────────────── */

function medalKey(id) {
  return "medal" + id.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
}

function renderMedals(state) {
  // Locked medals stay visible with their name and their goal: seeing
  // what is still ahead is part of the point.
  const items = MEDALS.map((medal) => {
    const p = medalProgress(medal, state.data);
    return `
      <li class="medal${p.earned ? " medal-earned" : ""}">
        <span class="medal-icon">${icon(medal.icon)}</span>
        <span class="medal-main">
          <span class="medal-title">${t(medalKey(medal.id) + "Title")}</span>
          <span class="medal-text">${t(medalKey(medal.id) + "Text")}</span>
          <span class="medal-state">${p.earned ? `${icon("check")} ${t("medalsCount", { k: p.goal, n: p.goal })}` : `${t("medalsLocked")} — ${t("medalsCount", { k: p.have, n: p.goal })}`}</span>
        </span>
      </li>`;
  }).join("");

  return `
    ${viewHeader(t("medalsTitle"))}
    <section class="section">
      <p class="hint">${t("medalsIntro")}</p>
      <ul class="medal-list">${items}</ul>
    </section>`;
}

/* ── Settings ────────────────────────────────────────────────────── */

function choice({ action, dataKey, value, current, title, hint }) {
  const selected = String(current) === String(value);
  return `
    <button type="button" class="choice${selected ? " selected" : ""}"
            data-action="${action}" data-${dataKey}="${value}" aria-pressed="${selected}">
      <span class="choice-title">${title}</span>
      ${hint ? `<span class="choice-hint">${hint}</span>` : ""}
    </button>`;
}

function panel(heading, hint, body) {
  return `
    <section class="panel">
      <div>
        <h2 class="panel-head">${heading}</h2>
        <p class="hint">${hint}</p>
      </div>
      <div class="choice-grid">${body}</div>
    </section>`;
}

function renderSettings(state) {
  const s = state.data.settings;
  const languages = LANGUAGES
    .map((l) => choice({ action: "set-lang", dataKey: "lang", value: l.code, current: s.language, title: l.label }))
    .join("");
  const modes = ANSWER_MODES
    .map((m) => choice({
      action: "set-answer", dataKey: "mode", value: m, current: s.answerMode,
      title: t(m === "choose" ? "answerChoose" : "answerType"),
      hint: t(m === "choose" ? "answerChooseHint" : "answerTypeHint")
    }))
    .join("");
  const sizes = ROUND_SIZES
    .map((n) => choice({
      action: "set-size", dataKey: "size", value: n, current: s.roundSize,
      title: t("roundSize", { n })
    }))
    .join("");

  return `
    ${viewHeader(t("settingsTitle"))}
    <section class="section">
      ${panel(t("settingsLanguage"), t("settingsLanguageHint"), languages)}
      ${panel(t("settingsAnswer"), t("settingsAnswerHint"), modes)}
      ${panel(t("settingsRound"), t("settingsRoundHint"), sizes)}
    </section>`;
}
