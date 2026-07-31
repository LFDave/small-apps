// ui.js — pure rendering: builds the HTML for each view from state.
// No state mutation here; all interactions go through data-action
// attributes handled in app.js.

import { icon } from "./icons.js?v=5";
import { STRINGS as S, EMERGENCY, MEDAL_TEXT, fmt } from "./data.js?v=5";
import { intlChunks, statusOf, escapeHtml } from "./util.js?v=5";
import { checkTyped, stepNeedsInput, stepAllowsPlus, serviceByNumber } from "./practice.js?v=5";
import { MEDALS, levelFor } from "./game.js?v=5";

export function render(state) {
  const app = document.getElementById("app");
  let html = "";
  if (state.view === "home") html = renderHome(state);
  else if (state.view === "form") html = renderForm(state);
  else if (state.view === "ladder") html = renderLadder(state);
  else if (state.view === "quiz") html = renderQuiz(state);
  else if (state.view === "medals") html = renderMedals(state);
  app.innerHTML = `<div class="shell">${html}</div>`;
  const auto = app.querySelector("[data-autofocus]");
  if (auto) auto.focus();
}

/* ── Home ────────────────────────────────────────────────────────── */

function renderHome(state) {
  const entries = state.data.entries;
  const cards = entries.map((e) => {
    const status = statusOf(e.completions);
    const statusLabel = { neu: S.statusNeu, geuebt: S.statusGeuebt, sitzt: S.statusSitzt }[status];
    const intlLine = e.type === "phone" && e.intl
      ? `<span class="entry-intl">${intlChunks(e).join(" ")}</span>` : "";
    return `
      <li class="entry-row">
        <button type="button" class="entry-card" data-action="practice" data-id="${e.id}">
          <span class="entry-main">
            <span class="entry-label">${escapeHtml(e.label)}</span>
            <span class="entry-number">${e.chunks.join(" ")}</span>
            ${intlLine}
          </span>
          <span class="pill pill-${status}">${statusLabel}</span>
          ${icon("chevron-right", "muted")}
        </button>
        <button type="button" class="btn-icon" data-action="nav-edit" data-id="${e.id}" aria-label="${escapeHtml(e.label)} bearbeiten">${icon("pencil")}</button>
      </li>`;
  }).join("");

  const myNumbers = entries.length
    ? `<ul class="entry-list">${cards}</ul>`
    : `<div class="panel empty-panel"><p>${S.homeEmpty}</p></div>`;

  const addBtnClass = entries.length ? "btn-secondary" : "btn-primary";

  const emgItems = EMERGENCY.map((svc) => {
    const known = (state.data.emergency[svc.number] || 0) >= 3;
    return `
      <li class="emg-item">
        <span class="emg-icon">${icon(svc.icon)}</span>
        <span class="emg-text"><span class="emg-num">${svc.number}</span>
        <span class="emg-name">${svc.name}</span></span>
        ${known ? `<span class="emg-known" title="${S.statusSitzt}">${icon("check")}</span>` : ""}
      </li>`;
  }).join("");

  return `
    <header class="app-header">
      <h1>${S.appTitle}</h1>
      <p class="tagline">${S.appTagline}</p>
    </header>
    ${statsStrip(state)}
    <section class="section">
      <h2>${S.homeMyNumbers}</h2>
      ${myNumbers}
      <button type="button" class="btn ${addBtnClass} btn-wide" data-action="nav-add">${icon("plus")} ${S.homeAdd}</button>
    </section>
    <section class="section">
      <h2>${S.homeTraining}</h2>
      <div class="panel">
        <p class="hint">${S.homeTrainingIntro}</p>
        <div class="train-len">
          <button type="button" class="key" data-action="train-len" data-delta="-1" aria-label="${S.trainingFewer}">${icon("minus")}</button>
          <span class="train-len-value" aria-live="polite">${fmt(S.trainingDigits, { n: state.data.trainingLength })}</span>
          <button type="button" class="key" data-action="train-len" data-delta="1" aria-label="${S.trainingMore}">${icon("plus")}</button>
        </div>
        <button type="button" class="btn btn-secondary btn-wide" data-action="train-start">${S.trainingStart}</button>
      </div>
    </section>
    <section class="section">
      <h2>${S.homeEmergency}</h2>
      <div class="panel">
        <p class="hint">${S.homeEmergencyIntro}</p>
        <ul class="emg-grid">${emgItems}</ul>
        <button type="button" class="btn btn-secondary btn-wide" data-action="quiz-start">${S.homeEmergencyPractice}</button>
      </div>
    </section>
    <footer class="app-footer">
      <p class="hint">${S.homeStorageNote}</p>
      <button type="button" class="btn-link" data-action="reset-all">${S.homeReset}</button>
    </footer>`;
}

/* ── Level, XP and medals ────────────────────────────────────────── */

function xpLine(game) {
  const lv = levelFor(game.xp);
  return lv.nextXp
    ? fmt(S.statsXp, { xp: game.xp, next: lv.nextXp })
    : fmt(S.statsXpMax, { xp: game.xp });
}

function progressBar(game) {
  const lv = levelFor(game.xp);
  const pct = Math.round(lv.progress * 100);
  return `<span class="progress" role="img" aria-label="${xpLine(game)}"><span class="progress-fill" style="width: ${pct}%"></span></span>`;
}

function statsStrip(state) {
  const g = state.data.game;
  const lv = levelFor(g.xp);
  return `
    <button type="button" class="stats-strip" data-action="nav-medals" aria-label="${S.statsOpen}">
      <span class="level-badge" aria-hidden="true">${lv.level}</span>
      <span class="stats-main">
        <span class="stats-title">${fmt(S.statsLevel, { n: lv.level, title: lv.title })}</span>
        ${progressBar(g)}
        <span class="stats-xp">${xpLine(g)}</span>
      </span>
      <span class="stats-medals" aria-label="${fmt(S.statsMedals, { k: g.medals.length, n: MEDALS.length })}">${icon("medal")} ${g.medals.length}/${MEDALS.length}</span>
      ${icon("chevron-right", "muted")}
    </button>`;
}

// Quiet reward block for completion panels: XP gained, level up, new
// medals. No modal, no celebration animation.
function rewardBlock(reward) {
  if (!reward) return "";
  const medals = reward.newMedals.map((m) =>
    `<span class="reward-row">${icon(m.icon)}<span>${fmt(S.rewardMedal, { name: MEDAL_TEXT[m.id].name })}</span></span>`).join("");
  const levelUp = reward.levelUp
    ? `<span class="reward-row">${icon("medal")}<span>${fmt(S.rewardLevelUp, { title: reward.levelUp.title })}</span></span>` : "";
  return `
    <div class="reward-block">
      <span class="reward-xp">${fmt(S.rewardXp, { xp: reward.xp })}</span>
      ${levelUp}
      ${medals}
    </div>`;
}

function renderMedals(state) {
  const g = state.data.game;
  const lv = levelFor(g.xp);
  const cards = MEDALS.map((m) => {
    const unlocked = g.medals.includes(m.id);
    const t = MEDAL_TEXT[m.id];
    return `
      <li class="medal-card ${unlocked ? "" : "locked"}">
        <span class="medal-icon">${icon(m.icon)}</span>
        <span class="medal-name">${t.name}</span>
        <span class="medal-desc">${t.desc}</span>
      </li>`;
  }).join("");
  return `
    ${viewHeader(S.medalsTitle)}
    <div class="panel">
      <p class="stats-title">${fmt(S.statsLevel, { n: lv.level, title: lv.title })}</p>
      ${progressBar(g)}
      <p class="hint">${xpLine(g)}</p>
    </div>
    <ul class="medal-grid">${cards}</ul>`;
}

/* ── Add / edit form ─────────────────────────────────────────────── */

function renderForm(state) {
  const f = state.form;
  const isPhone = f.type === "phone";
  const title = f.editingId ? S.formTitleEdit : S.formTitleNew;
  const labelPlaceholder = isPhone ? S.formLabelPlaceholderPhone : S.formLabelPlaceholderCode;
  const numberPlaceholder = isPhone ? S.formNumberPlaceholderPhone : S.formNumberPlaceholderCode;

  const intlBlock = isPhone ? `
    <div class="intl-block">
      <label class="check">
        <input type="checkbox" id="f-intl" ${f.intl ? "checked" : ""}>
        <span>${S.formIntlLabel}</span>
      </label>
      <div id="intl-details" ${f.intl ? "" : "hidden"}>
        <label class="field field-cc">
          <span>${S.formIntlCc}</span>
          <span class="cc-wrap"><span class="cc-plus" aria-hidden="true">+</span><input id="f-cc" inputmode="numeric" maxlength="3" value="${escapeHtml(f.cc)}"></span>
        </label>
        <p class="hint" id="intl-preview">${intlPreviewText(f)}</p>
      </div>
    </div>` : "";

  const deleteBtn = f.editingId
    ? `<button type="button" class="btn btn-danger btn-wide" data-action="form-delete">${S.formDelete}</button>` : "";

  return `
    ${viewHeader(title)}
    <div class="panel form">
      <fieldset class="type-choice">
        <legend>${S.formTypeLabel}</legend>
        <div class="choice-grid">
          <button type="button" class="choice ${!isPhone ? "selected" : ""}" data-action="form-type" data-type="code" aria-pressed="${!isPhone}">
            <span class="choice-title">${S.formTypeCode}</span>
            <span class="choice-hint">${S.formTypeCodeHint}</span>
          </button>
          <button type="button" class="choice ${isPhone ? "selected" : ""}" data-action="form-type" data-type="phone" aria-pressed="${isPhone}">
            <span class="choice-title">${S.formTypePhone}</span>
            <span class="choice-hint">${S.formTypePhoneHint}</span>
          </button>
        </div>
      </fieldset>
      <label class="field">
        <span>${S.formLabelLabel}</span>
        <input id="f-label" maxlength="24" autocomplete="off" placeholder="${labelPlaceholder}" value="${escapeHtml(f.label)}" ${f.editingId ? "" : "data-autofocus"}>
      </label>
      <label class="field">
        <span>${S.formNumberLabel}</span>
        <input id="f-number" inputmode="tel" autocomplete="off" placeholder="${numberPlaceholder}" value="${escapeHtml(f.numberRaw)}">
        <span class="hint">${S.formNumberHint}</span>
      </label>
      ${intlBlock}
      ${f.error ? feedback("warn", S[f.error] || f.error) : ""}
      <button type="button" class="btn btn-primary btn-wide" data-action="form-save">${S.formSave}</button>
      ${deleteBtn}
    </div>`;
}

export function intlPreviewText(f) {
  const parsed = f.parsedChunks;
  if (!parsed) return `${S.formIntlPreview} +${escapeHtml(f.cc || "41")} …`;
  const preview = intlChunks({ chunks: parsed, cc: (f.cc || "41").replace(/\D/g, "") });
  return `${S.formIntlPreview} ${preview.join(" ")}`;
}

/* ── Learning ladder ─────────────────────────────────────────────── */

function renderLadder(state) {
  const l = state.ladder;
  const training = Boolean(l.trainEntry);
  const entry = l.trainEntry || state.data.entries.find((e) => e.id === l.entryId);
  if (!entry) return "";
  const title = training ? S.trainingTitle : escapeHtml(entry.label);

  if (l.phase === "done") {
    if (training) {
      const n = entry.chunks.join("").length;
      const g = state.data.game;
      const suggest = g.trainCleanLen === state.data.trainingLength
        && g.trainCleanCount >= 2
        && state.data.trainingLength < 16;
      const nextLen = state.data.trainingLength + 1;
      const buttons = suggest
        ? `
          <button type="button" class="btn btn-primary btn-wide" data-action="train-up" data-autofocus>${fmt(S.trainingSuggestBtn, { n: nextLen })}</button>
          <button type="button" class="btn btn-secondary btn-wide" data-action="train-again">${S.trainingAgain}</button>
          <button type="button" class="btn btn-secondary btn-wide" data-action="nav-home">${S.ladderHome}</button>`
        : `
          <button type="button" class="btn btn-primary btn-wide" data-action="train-again" data-autofocus>${S.trainingAgain}</button>
          <button type="button" class="btn btn-secondary btn-wide" data-action="nav-home">${S.ladderHome}</button>`;
      return `
        ${viewHeader(title)}
        <div class="panel done-panel">
          ${feedback("success", `<strong>${S.ladderDoneTitle}</strong> ${fmt(S.trainingDoneMsg, { n })}`)}
          ${rewardBlock(l.reward)}
          ${suggest ? feedback("info", fmt(S.trainingSuggest, { n: nextLen })) : ""}
          ${buttons}
        </div>`;
    }
    const sitzt = statusOf(entry.completions) === "sitzt";
    return `
      ${viewHeader(title)}
      <div class="panel done-panel">
        ${feedback("success", `<strong>${S.ladderDoneTitle}</strong> ${fmt(S.ladderDoneMsg, { label: escapeHtml(entry.label) })}${sitzt ? " " + S.ladderDoneSitzt : ""}`)}
        ${rewardBlock(l.reward)}
        <button type="button" class="btn btn-primary btn-wide" data-action="nav-home" data-autofocus>${S.ladderHome}</button>
        <button type="button" class="btn btn-secondary btn-wide" data-action="ladder-again" data-id="${entry.id}">${S.ladderAgain}</button>
      </div>`;
  }

  const step = l.steps[l.i];
  const instruction = {
    "view": S.ladderStepView,
    "cloze": S.ladderStepCloze,
    "tail": S.ladderStepTail,
    "full": S.ladderStepFull,
    "intl-view": S.ladderStepIntlView,
    "intl-full": S.ladderStepIntlFull
  }[step.kind];

  const dots = l.steps.map((_, i) =>
    `<span class="dot ${i < l.i ? "done" : i === l.i ? "current" : ""}"></span>`).join("");

  let fb = "";
  let actions = "";
  if (!stepNeedsInput(step)) {
    actions = primaryBtn("step-next", l.i === 0 ? S.ladderReady : S.ladderNext, true);
  } else if (l.phase === "input") {
    actions = pad(stepAllowsPlus(step));
  } else if (l.phase === "correct") {
    fb = feedback("success", S.ladderCorrect);
    actions = primaryBtn("step-next", S.ladderNext, true);
  } else if (l.phase === "wrong") {
    fb = feedback("warn", l.wrong >= 2 ? S.ladderWrongAgain : S.ladderWrong);
    actions = `
      ${primaryBtn("retry", S.ladderRetry, true)}
      ${l.wrong >= 2 ? `<button type="button" class="btn btn-secondary btn-wide" data-action="reveal">${S.ladderReveal}</button>` : ""}`;
  } else if (l.phase === "reveal") {
    fb = feedback("info", S.ladderRevealMsg);
    actions = primaryBtn("reveal-done", S.ladderRevealDone, true);
  }

  return `
    ${viewHeader(title)}
    <div class="step-dots" role="img" aria-label="Schritt ${l.i + 1} von ${l.steps.length}">${dots}</div>
    <p class="instruction">${instruction}</p>
    ${renderCells(step, l)}
    <div class="feedback-area">${fb}</div>
    <div class="actions">${actions}</div>`;
}

/* ── Emergency quiz ──────────────────────────────────────────────── */

function renderQuiz(state) {
  const q = state.quiz;

  if (q.phase === "done") {
    const known = Object.values(q.firstTry).filter(Boolean).length;
    const total = q.rounds.length;
    const msg = known === total ? S.quizDoneAll : fmt(S.quizDoneMsg, { k: known, n: total });
    const items = EMERGENCY.map((svc) => `
      <li class="quiz-result ${q.firstTry[svc.number] ? "known" : ""}">
        <span class="emg-icon">${icon(svc.icon)}</span>
        <span class="emg-text"><span class="emg-num">${svc.number}</span>
        <span class="emg-name">${svc.name}</span></span>
        <span class="quiz-result-tag">${q.firstTry[svc.number] ? S.quizKnown : S.quizPracticed}</span>
      </li>`).join("");
    return `
      ${viewHeader(S.quizTitle)}
      <div class="panel done-panel">
        ${feedback("success", `<strong>${S.quizDoneTitle}</strong> ${msg}`)}
        ${rewardBlock(q.reward)}
        <ul class="quiz-results">${items}</ul>
        <button type="button" class="btn btn-primary btn-wide" data-action="nav-home" data-autofocus>${S.ladderHome}</button>
        <button type="button" class="btn btn-secondary btn-wide" data-action="quiz-start">${S.ladderAgain}</button>
      </div>`;
  }

  const svc = serviceByNumber(q.rounds[q.i]);
  const step = { kind: "quiz", chunks: [svc.number], hidden: [0] };

  let fb = "";
  let actions = "";
  if (q.phase === "ask" || q.phase === "copy") {
    if (q.phase === "copy") {
      fb = feedback("warn", q.copyAgain
        ? fmt(S.quizCopyAgain, { number: svc.number })
        : fmt(S.quizWrongCopy, { explain: svc.explain }));
    }
    actions = pad(false);
  } else if (q.phase === "correct") {
    fb = feedback("success", fmt(S.quizCorrect, { explain: svc.explain }));
    actions = primaryBtn("quiz-next", S.ladderNext, true);
  }

  return `
    ${viewHeader(S.quizTitle)}
    <p class="quiz-progress">${fmt(S.quizProgress, { i: q.i + 1, n: q.rounds.length })}</p>
    <div class="panel quiz-card">
      <span class="quiz-icon">${icon(svc.icon)}</span>
      <p class="quiz-situation">${svc.situation}</p>
      <p class="quiz-question">${S.quizQuestion}</p>
    </div>
    ${renderCells(step, { typed: q.typed, phase: q.phase === "correct" ? "correct" : "input" })}
    <div class="feedback-area">${fb}</div>
    <div class="actions">${actions}</div>`;
}

/* ── Shared pieces ───────────────────────────────────────────────── */

function viewHeader(title) {
  return `
    <header class="view-header">
      <button type="button" class="btn-icon" data-action="nav-home" aria-label="${S.formBack}">${icon("arrow-left")}</button>
      <h1>${title}</h1>
    </header>`;
}

function feedback(tone, msg) {
  const icons = { success: "check", warn: "info", info: "info" };
  return `<div class="feedback feedback-${tone}" role="status">${icon(icons[tone])}<span>${msg}</span></div>`;
}

function primaryBtn(action, label, autofocus) {
  return `<button type="button" class="btn btn-primary btn-wide" data-action="${action}" ${autofocus ? "data-autofocus" : ""}>${label}</button>`;
}

// PIN-pad without a confirm button: the app checks the answer when the
// last cell fills. The visible hint announces that behavior before the
// component is used (WCAG 3.2.2 On Input).
function pad(allowPlus) {
  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const keys = digits.map((d) => `<button type="button" class="key" data-key="${d}">${d}</button>`).join("");
  const plusKey = allowPlus
    ? `<button type="button" class="key" data-key="+">+</button>`
    : `<span class="key key-empty" aria-hidden="true"></span>`;
  return `
    <div class="pad" role="group" aria-label="Zahlenfeld">
      ${keys}
      ${plusKey}
      <button type="button" class="key" data-key="0">0</button>
      <button type="button" class="key" data-key="back" aria-label="${S.padBackspace}">${icon("delete")}</button>
    </div>
    <p class="hint pad-hint">${S.padAutoHint}</p>`;
}

// Renders the digit cells for a step. Hidden chunks consume the typed
// characters in order; the render mode comes from the session phase.
function renderCells(step, session) {
  const phase = session.phase;
  const diff = phase === "wrong" ? checkTyped(step, session.typed).diff : null;
  let pos = 0;
  const nextPos = session.typed.length;
  const groups = step.chunks.map((chunk, ci) => {
    const hidden = step.hidden.includes(ci);
    const cells = chunk.split("").map((ch) => {
      if (!hidden) return `<span class="cell shown">${ch}</span>`;
      const p = pos++;
      if (phase === "correct") return `<span class="cell ok">${ch}</span>`;
      if (phase === "reveal") return `<span class="cell reveal">${ch}</span>`;
      const typedCh = session.typed[p];
      if (typedCh === undefined) {
        return `<span class="cell empty ${phase === "input" && p === nextPos ? "next" : ""}">·</span>`;
      }
      if (phase === "wrong" && diff && !diff[p]) return `<span class="cell wrong">${typedCh}</span>`;
      return `<span class="cell filled">${typedCh}</span>`;
    }).join("");
    return `<div class="chunk">${cells}</div>`;
  }).join("");
  return `<div class="cells">${groups}</div>`;
}
