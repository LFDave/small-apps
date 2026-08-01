// ui.js — pure rendering: builds the HTML for each view from state.
// No state mutation here; all interactions go through data-action
// attributes handled in app.js. Every visible string comes from i18n.

import { icon } from "./icons.js?v=7";
import { LANGUAGES, COUNTRIES, countryByCode, emergencyKey } from "./data.js?v=7";
import { t, keyPart, currentLanguage } from "./i18n.js?v=7";
import { intlChunks, statusOf, escapeHtml } from "./util.js?v=7";
import { checkTyped, stepNeedsInput, stepAllowsPlus } from "./practice.js?v=7";
import { MEDALS, levelFor } from "./game.js?v=7";

export function render(state) {
  const app = document.getElementById("app");
  let html = "";
  if (state.view === "home") html = renderHome(state);
  else if (state.view === "form") html = renderForm(state);
  else if (state.view === "ladder") html = renderLadder(state);
  else if (state.view === "quiz") html = renderQuiz(state);
  else if (state.view === "medals") html = renderMedals(state);
  else if (state.view === "settings") html = renderSettings(state);
  app.innerHTML = `<div class="shell">${html}</div>`;
  revealLoadedFlags(app);
  const auto = app.querySelector("[data-autofocus]");
  if (auto) auto.focus();
}

// Flags render hidden and appear once the image is really there, so a
// blocked or offline flagcdn leaves no empty box and no broken icon.
// Already-cached images are done before any load event fires, so they
// are un-hidden here; the rest wait for the listener in app.js.
function revealLoadedFlags(root) {
  for (const img of root.querySelectorAll(".flag[hidden]")) {
    if (img.complete && img.naturalWidth > 0) img.hidden = false;
  }
}

/* ── Emergency helpers ───────────────────────────────────────────── */

function serviceName(svc) {
  return t("emgName" + keyPart(svc.key));
}

function serviceSituation(svc) {
  return t("emgSituation" + keyPart(svc.key));
}

function serviceExplain(svc) {
  return t("emgExplain" + keyPart(svc.key), { number: svc.number });
}

// flagcdn is the one allowed external request (PRODUCT.md). Flags are
// decorative here: the country name is always next to them, so the app
// reads the same with or without them.
function flag(code, cls = "") {
  return `<img class="flag${cls ? " " + cls : ""}" src="https://flagcdn.com/w80/${code}.png"`
    + ` srcset="https://flagcdn.com/w160/${code}.png 2x" width="40" height="30" alt="" hidden>`;
}

/* ── Home ────────────────────────────────────────────────────────── */

function renderHome(state) {
  const entries = state.data.entries;
  const country = countryByCode(state.data.settings.country);

  const cards = entries.map((e) => {
    const status = statusOf(e.completions);
    const statusLabel = { neu: t("statusNeu"), geuebt: t("statusGeuebt"), sitzt: t("statusSitzt") }[status];
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
        <button type="button" class="btn-icon" data-action="nav-edit" data-id="${e.id}" aria-label="${t("formEditEntry", { label: escapeHtml(e.label) })}">${icon("pencil")}</button>
      </li>`;
  }).join("");

  const myNumbers = entries.length
    ? `<ul class="entry-list">${cards}</ul>`
    : `<div class="panel empty-panel"><p>${t("homeEmpty")}</p></div>`;

  const addBtnClass = entries.length ? "btn-secondary" : "btn-primary";

  const emgItems = country.numbers.map((svc) => {
    const known = (state.data.emergency[emergencyKey(country.code, svc.number)] || 0) >= 3;
    return `
      <li class="emg-item">
        <span class="emg-icon">${icon(svc.icon)}</span>
        <span class="emg-text"><span class="emg-num">${svc.number}</span>
        <span class="emg-name">${serviceName(svc)}</span></span>
        ${known ? `<span class="emg-known" title="${t("statusSitzt")}">${icon("check")}</span>` : ""}
      </li>`;
  }).join("");

  const note = country.note ? `<p class="hint">${t(country.note)}</p>` : "";

  // Services this country has no short number for. Naming the gap and
  // what to do instead beats leaving a blank or borrowing a number.
  const gaps = country.gaps.length ? `
    <div class="emg-gaps">
      <h3>${t("emgGapsTitle")}</h3>
      <ul>
        ${country.gaps.map((g) => `<li>${icon("triangle-alert")}<span>${t(g)}</span></li>`).join("")}
      </ul>
    </div>` : "";

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
      <h2>${t("homeMyNumbers")}</h2>
      ${myNumbers}
      <button type="button" class="btn ${addBtnClass} btn-wide" data-action="nav-add">${icon("plus")} ${t("homeAdd")}</button>
    </section>
    <section class="section">
      <h2>${t("homeTraining")}</h2>
      <div class="panel">
        <p class="hint">${t("homeTrainingIntro")}</p>
        <div class="train-len">
          <button type="button" class="key" data-action="train-len" data-delta="-1" aria-label="${t("trainingFewer")}">${icon("minus")}</button>
          <span class="train-len-value" aria-live="polite">${t("trainingDigits", { n: state.data.trainingLength })}</span>
          <button type="button" class="key" data-action="train-len" data-delta="1" aria-label="${t("trainingMore")}">${icon("plus")}</button>
        </div>
        <button type="button" class="btn btn-secondary btn-wide" data-action="train-start">${t("trainingStart")}</button>
      </div>
    </section>
    <section class="section">
      <div class="section-head">
        <h2>${t("homeEmergency")}</h2>
        ${flag(country.code, "flag-sm")}
      </div>
      <div class="panel">
        <p class="hint">${t("homeEmergencyIntro", { country: t("countryIn" + keyPart(country.code)) })}</p>
        <ul class="emg-grid">${emgItems}</ul>
        ${note}
        ${gaps}
        <button type="button" class="btn btn-secondary btn-wide" data-action="quiz-start">${t("homeEmergencyPractice")}</button>
      </div>
    </section>
    <footer class="app-footer">
      <p class="hint">${t("homeStorageNote")}</p>
      <button type="button" class="btn-link" data-action="reset-all">${t("homeReset")}</button>
    </footer>`;
}

/* ── Settings ────────────────────────────────────────────────────── */

// One panel per setting, a choice grid per panel, changes save at once.
// Shared settings pattern from PRODUCT.md.
function renderSettings(state) {
  const lang = currentLanguage();
  const countryCode = state.data.settings.country;

  const langChoices = LANGUAGES.map((l) => `
    <button type="button" class="choice ${l.code === lang ? "selected" : ""}"
            data-action="set-lang" data-lang="${l.code}" aria-pressed="${l.code === lang}">
      <span class="choice-title" lang="${l.htmlLang}">${l.label}</span>
    </button>`).join("");

  const countryChoices = COUNTRIES.map((c) => `
    <button type="button" class="choice choice-country ${c.code === countryCode ? "selected" : ""}"
            data-action="set-country" data-country="${c.code}" aria-pressed="${c.code === countryCode}">
      ${flag(c.code)}
      <span class="choice-body">
        <span class="choice-title">${t("country" + keyPart(c.code))}</span>
        <span class="choice-hint">+${c.cc}</span>
      </span>
    </button>`).join("");

  return `
    ${viewHeader(t("settingsTitle"))}
    <section class="section">
      <h2>${t("settingsLanguage")}</h2>
      <div class="panel">
        <p class="hint">${t("settingsLanguageHint")}</p>
        <div class="choice-grid choice-grid-lang">${langChoices}</div>
      </div>
    </section>
    <section class="section">
      <h2>${t("settingsCountry")}</h2>
      <div class="panel">
        <p class="hint">${t("settingsCountryHint")}</p>
        <div class="choice-grid choice-grid-country">${countryChoices}</div>
      </div>
    </section>`;
}

/* ── Level, XP and medals ────────────────────────────────────────── */

function xpLine(game) {
  const lv = levelFor(game.xp);
  return lv.nextXp
    ? t("statsXp", { xp: game.xp, next: lv.nextXp })
    : t("statsXpMax", { xp: game.xp });
}

function progressBar(game) {
  const lv = levelFor(game.xp);
  const pct = Math.round(lv.progress * 100);
  return `<span class="progress" role="img" aria-label="${xpLine(game)}"><span class="progress-fill" style="width: ${pct}%"></span></span>`;
}

function levelLine(game) {
  const lv = levelFor(game.xp);
  return t("statsLevel", { n: lv.level, title: t(lv.titleKey) });
}

function statsStrip(state) {
  const g = state.data.game;
  const lv = levelFor(g.xp);
  return `
    <button type="button" class="stats-strip" data-action="nav-medals" aria-label="${t("statsOpen")}">
      <span class="level-badge" aria-hidden="true">${lv.level}</span>
      <span class="stats-main">
        <span class="stats-title">${levelLine(g)}</span>
        ${progressBar(g)}
        <span class="stats-xp">${xpLine(g)}</span>
      </span>
      <span class="stats-medals" aria-label="${t("statsMedals", { k: g.medals.length, n: MEDALS.length })}">${icon("medal")} ${g.medals.length}/${MEDALS.length}</span>
      ${icon("chevron-right", "muted")}
    </button>`;
}

// Quiet reward block for completion panels: XP gained, level up, new
// medals. No modal, no celebration animation.
function rewardBlock(reward) {
  if (!reward) return "";
  const medals = reward.newMedals.map((m) =>
    `<span class="reward-row">${icon(m.icon)}<span>${t("rewardMedal", { name: t("medalName" + m.key) })}</span></span>`).join("");
  const levelUp = reward.levelUp
    ? `<span class="reward-row">${icon("medal")}<span>${t("rewardLevelUp", { title: t(reward.levelUp.titleKey) })}</span></span>` : "";
  return `
    <div class="reward-block">
      <span class="reward-xp">${t("rewardXp", { xp: reward.xp })}</span>
      ${levelUp}
      ${medals}
    </div>`;
}

function renderMedals(state) {
  const g = state.data.game;
  const cards = MEDALS.map((m) => {
    const unlocked = g.medals.includes(m.id);
    return `
      <li class="medal-card ${unlocked ? "" : "locked"}">
        <span class="medal-icon">${icon(m.icon)}</span>
        <span class="medal-name">${t("medalName" + m.key)}</span>
        <span class="medal-desc">${t("medalDesc" + m.key)}</span>
      </li>`;
  }).join("");
  return `
    ${viewHeader(t("medalsTitle"))}
    <div class="panel">
      <p class="stats-title">${levelLine(g)}</p>
      ${progressBar(g)}
      <p class="hint">${xpLine(g)}</p>
    </div>
    <ul class="medal-grid">${cards}</ul>`;
}

/* ── Add / edit form ─────────────────────────────────────────────── */

function renderForm(state) {
  const f = state.form;
  const isPhone = f.type === "phone";
  const title = f.editingId ? t("formTitleEdit") : t("formTitleNew");
  const labelPlaceholder = isPhone ? t("formLabelPlaceholderPhone") : t("formLabelPlaceholderCode");
  const numberPlaceholder = isPhone ? t("formNumberPlaceholderPhone") : t("formNumberPlaceholderCode");

  const intlBlock = isPhone ? `
    <div class="intl-block">
      <label class="check">
        <input type="checkbox" id="f-intl" ${f.intl ? "checked" : ""}>
        <span>${t("formIntlLabel")}</span>
      </label>
      <div id="intl-details" ${f.intl ? "" : "hidden"}>
        <label class="field field-cc">
          <span>${t("formIntlCc")}</span>
          <span class="cc-wrap"><span class="cc-plus" aria-hidden="true">+</span><input id="f-cc" inputmode="numeric" maxlength="3" value="${escapeHtml(f.cc)}"></span>
        </label>
        <p class="hint" id="intl-preview">${intlPreviewText(f)}</p>
      </div>
    </div>` : "";

  const deleteBtn = f.editingId
    ? `<button type="button" class="btn btn-danger btn-wide" data-action="form-delete">${t("formDelete")}</button>` : "";

  return `
    ${viewHeader(title)}
    <div class="panel form">
      <fieldset class="type-choice">
        <legend>${t("formTypeLabel")}</legend>
        <div class="choice-grid">
          <button type="button" class="choice ${!isPhone ? "selected" : ""}" data-action="form-type" data-type="code" aria-pressed="${!isPhone}">
            <span class="choice-title">${t("formTypeCode")}</span>
            <span class="choice-hint">${t("formTypeCodeHint")}</span>
          </button>
          <button type="button" class="choice ${isPhone ? "selected" : ""}" data-action="form-type" data-type="phone" aria-pressed="${isPhone}">
            <span class="choice-title">${t("formTypePhone")}</span>
            <span class="choice-hint">${t("formTypePhoneHint")}</span>
          </button>
        </div>
      </fieldset>
      <label class="field">
        <span>${t("formLabelLabel")}</span>
        <input id="f-label" maxlength="24" autocomplete="off" placeholder="${labelPlaceholder}" value="${escapeHtml(f.label)}" ${f.editingId ? "" : "data-autofocus"}>
      </label>
      <label class="field">
        <span>${t("formNumberLabel")}</span>
        <input id="f-number" inputmode="tel" autocomplete="off" placeholder="${numberPlaceholder}" value="${escapeHtml(f.numberRaw)}">
        <span class="hint">${t("formNumberHint")}</span>
      </label>
      ${intlBlock}
      ${f.error ? feedback("warn", t(f.error)) : ""}
      <button type="button" class="btn btn-primary btn-wide" data-action="form-save">${t("formSave")}</button>
      ${deleteBtn}
    </div>`;
}

export function intlPreviewText(f) {
  const parsed = f.parsedChunks;
  if (!parsed) return `${t("formIntlPreview")} +${escapeHtml(f.cc || "41")} …`;
  const preview = intlChunks({ chunks: parsed, cc: (f.cc || "41").replace(/\D/g, "") });
  return `${t("formIntlPreview")} ${preview.join(" ")}`;
}

/* ── Learning ladder ─────────────────────────────────────────────── */

function renderLadder(state) {
  const l = state.ladder;
  const training = Boolean(l.trainEntry);
  const entry = l.trainEntry || state.data.entries.find((e) => e.id === l.entryId);
  if (!entry) return "";
  const title = training ? t("trainingTitle") : escapeHtml(entry.label);

  if (l.phase === "done") {
    if (training) {
      const n = entry.chunks.join("").length;
      const g = state.data.game;
      const suggest = g.trainCleanLen === state.data.trainingLength
        && g.trainCleanCount >= 5
        && state.data.trainingLength < 16;
      const nextLen = state.data.trainingLength + 1;
      const buttons = suggest
        ? `
          <button type="button" class="btn btn-primary btn-wide" data-action="train-up" data-autofocus>${t("trainingSuggestBtn", { n: nextLen })}</button>
          <button type="button" class="btn btn-secondary btn-wide" data-action="train-again">${t("trainingAgain")}</button>
          <button type="button" class="btn btn-secondary btn-wide" data-action="nav-home">${t("ladderHome")}</button>`
        : `
          <button type="button" class="btn btn-primary btn-wide" data-action="train-again" data-autofocus>${t("trainingAgain")}</button>
          <button type="button" class="btn btn-secondary btn-wide" data-action="nav-home">${t("ladderHome")}</button>`;
      return `
        ${viewHeader(title)}
        <div class="panel done-panel">
          ${feedback("success", `<strong>${t("ladderDoneTitle")}</strong> ${t("trainingDoneMsg", { n })}`)}
          ${rewardBlock(l.reward)}
          ${suggest ? feedback("info", t("trainingSuggest", { n: nextLen })) : ""}
          ${buttons}
        </div>`;
    }
    const sitzt = statusOf(entry.completions) === "sitzt";
    return `
      ${viewHeader(title)}
      <div class="panel done-panel">
        ${feedback("success", `<strong>${t("ladderDoneTitle")}</strong> ${t("ladderDoneMsg", { label: escapeHtml(entry.label) })}${sitzt ? " " + t("ladderDoneSitzt") : ""}`)}
        ${rewardBlock(l.reward)}
        <button type="button" class="btn btn-primary btn-wide" data-action="nav-home" data-autofocus>${t("ladderHome")}</button>
        <button type="button" class="btn btn-secondary btn-wide" data-action="ladder-again" data-id="${entry.id}">${t("ladderAgain")}</button>
      </div>`;
  }

  const step = l.steps[l.i];
  const instruction = {
    "view": t("ladderStepView"),
    "cloze": t("ladderStepCloze"),
    "tail": t("ladderStepTail"),
    "full": t("ladderStepFull"),
    "intl-view": t("ladderStepIntlView"),
    "intl-full": t("ladderStepIntlFull")
  }[step.kind];

  const dots = l.steps.map((_, i) =>
    `<span class="dot ${i < l.i ? "done" : i === l.i ? "current" : ""}"></span>`).join("");

  let fb = "";
  let actions = "";
  if (!stepNeedsInput(step)) {
    actions = primaryBtn("step-next", l.i === 0 ? t("ladderReady") : t("ladderNext"), true);
  } else if (l.phase === "input") {
    actions = pad(stepAllowsPlus(step));
  } else if (l.phase === "correct") {
    fb = feedback("success", t("ladderCorrect"));
    actions = primaryBtn("step-next", t("ladderNext"), true);
  } else if (l.phase === "wrong") {
    fb = feedback("warn", l.wrong >= 2 ? t("ladderWrongAgain") : t("ladderWrong"));
    actions = `
      ${primaryBtn("retry", t("ladderRetry"), true)}
      ${l.wrong >= 2 ? `<button type="button" class="btn btn-secondary btn-wide" data-action="reveal">${t("ladderReveal")}</button>` : ""}`;
  } else if (l.phase === "reveal") {
    fb = feedback("info", t("ladderRevealMsg"));
    actions = primaryBtn("reveal-done", t("ladderRevealDone"), true);
  }

  return `
    ${viewHeader(title)}
    <div class="step-dots" role="img" aria-label="${t("ladderStepProgress", { i: l.i + 1, n: l.steps.length })}">${dots}</div>
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
    const msg = known === total ? t("quizDoneAll") : t("quizDoneMsg", { k: known, n: total });
    // Pack order, not the shuffled round order, so the summary reads
    // the same way as the home grid every time.
    const items = countryByCode(q.country).numbers.map((svc) => `
      <li class="quiz-result ${q.firstTry[svc.number] ? "known" : ""}">
        <span class="emg-icon">${icon(svc.icon)}</span>
        <span class="emg-text"><span class="emg-num">${svc.number}</span>
        <span class="emg-name">${serviceName(svc)}</span></span>
        <span class="quiz-result-tag">${q.firstTry[svc.number] ? t("quizKnown") : t("quizPracticed")}</span>
      </li>`).join("");
    return `
      ${viewHeader(t("quizTitle"))}
      <div class="panel done-panel">
        ${feedback("success", `<strong>${t("quizDoneTitle")}</strong> ${msg}`)}
        ${rewardBlock(q.reward)}
        <ul class="quiz-results">${items}</ul>
        <button type="button" class="btn btn-primary btn-wide" data-action="nav-home" data-autofocus>${t("ladderHome")}</button>
        <button type="button" class="btn btn-secondary btn-wide" data-action="quiz-start">${t("ladderAgain")}</button>
      </div>`;
  }

  const svc = q.rounds[q.i];
  const step = { kind: "quiz", chunks: [svc.number], hidden: [0] };

  let fb = "";
  let actions = "";
  if (q.phase === "ask" || q.phase === "copy") {
    if (q.phase === "copy") {
      fb = feedback("warn", q.copyAgain
        ? t("quizCopyAgain", { number: svc.number })
        : t("quizWrongCopy", { explain: serviceExplain(svc) }));
    }
    actions = pad(false);
  } else if (q.phase === "correct") {
    fb = feedback("success", t("quizCorrect", { explain: serviceExplain(svc) }));
    actions = primaryBtn("quiz-next", t("ladderNext"), true);
  }

  return `
    ${viewHeader(t("quizTitle"))}
    <p class="quiz-progress">${t("quizProgress", { i: q.i + 1, n: q.rounds.length })}</p>
    <div class="panel quiz-card">
      <span class="quiz-icon">${icon(svc.icon)}</span>
      <p class="quiz-situation">${serviceSituation(svc)}</p>
      <p class="quiz-question">${t("quizQuestion")}</p>
    </div>
    ${renderCells(step, { typed: q.typed, phase: q.phase === "correct" ? "correct" : "input" })}
    <div class="feedback-area">${fb}</div>
    <div class="actions">${actions}</div>`;
}

/* ── Shared pieces ───────────────────────────────────────────────── */

function viewHeader(title) {
  return `
    <header class="view-header">
      <button type="button" class="btn-icon" data-action="nav-home" aria-label="${t("formBack")}">${icon("arrow-left")}</button>
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
    <div class="pad" role="group" aria-label="${t("padLabel")}">
      ${keys}
      ${plusKey}
      <button type="button" class="key" data-key="0">0</button>
      <button type="button" class="key" data-key="back" aria-label="${t("padBackspace")}">${icon("delete")}</button>
    </div>
    <p class="hint pad-hint">${t("padAutoHint")}</p>`;
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
