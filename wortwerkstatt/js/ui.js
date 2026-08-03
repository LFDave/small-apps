// ui.js — pure rendering: builds the HTML for each view from state.
// No state mutation here; all interactions go through data-action
// attributes handled in app.js. Every interface string comes from
// i18n; every practice string comes from the content pack and is
// marked with the content language so screen readers switch voice.

import { icon } from "./icons.js?v=2";
import {
  LANGUAGES, CONTENT_LANGUAGES, CYCLES,
  contentByCode, topicsForCycle, topicById, topicKey, LEHRPLAN_VERSION
} from "./data.js?v=2";
import { t, currentLanguage } from "./i18n.js?v=2";
import { escapeHtml, statusOf, topicStatus } from "./util.js?v=2";
import { fillTask, expectedAnswer, letterDiff, isTyped, ROUND_SIZE } from "./round.js?v=2";
import { MEDALS, levelFor } from "./game.js?v=2";

// Sentinel put in place of the answer so the blank lands exactly where
// round.js says it does, spacing included. A control character, because
// it must never occur in the content itself.
const BLANK = "\u0000";
const DOTS = "···";

export function render(state) {
  const app = document.getElementById("app");
  let html = "";
  if (state.view === "home") html = renderHome(state);
  else if (state.view === "topic") html = renderTopic(state);
  else if (state.view === "round") html = renderRound(state);
  else if (state.view === "medals") html = renderMedals(state);
  else if (state.view === "settings") html = renderSettings(state);
  app.innerHTML = `<div class="shell">${html}</div>`;
  const auto = app.querySelector("[data-autofocus]");
  if (auto) auto.focus();
}

/* ── Content language marking ────────────────────────────────────── */

// Practice material stays in the language it teaches, so an English
// interface still shows German words. Marking them keeps the page
// honest about it (WCAG 3.1.2 Language of Parts).
function contentLangAttr(state) {
  return ` lang="${contentByCode(state.data.settings.contentLanguage).htmlLang}"`;
}

function topicTitle(topic) {
  return t("topic" + topicKey(topic.id) + "Title");
}

function topicRule(topic) {
  return t("topic" + topicKey(topic.id) + "Rule");
}

function chapterName(index) {
  return t("chapter" + (index + 1));
}

function cycleName(cycle) {
  return t("cycle" + cycle);
}

function cycleRange(cycle) {
  return t("cycle" + cycle + "Range");
}

// Where the rule comes from, named precisely enough to check. A rule
// the document does not spell out says so instead of borrowing
// authority it does not have.
function ruleSourceLine(topic) {
  const span = topic.cycles.length > 1
    ? ` ${t("ruleSpan", { a: cycleName(topic.cycles[0]), b: cycleName(topic.cycles[1]) })}`
    : "";
  const source = topic.step
    ? t("ruleSource", { step: topic.step, version: LEHRPLAN_VERSION })
    : t("ruleSourceExtra");
  return `<p class="rule-source">${source}${span}</p>`;
}

function statusPill(status) {
  const label = { neu: t("statusNeu"), geuebt: t("statusGeuebt"), sitzt: t("statusSitzt") }[status];
  return `<span class="pill pill-${status}">${label}</span>`;
}

/* ── Home ────────────────────────────────────────────────────────── */

function renderHome(state) {
  const cycle = state.data.settings.cycle;
  const topics = topicsForCycle(state.data.settings.contentLanguage, cycle);

  const cards = topics.map((topic) => {
    const status = topicStatus(topic, state.data.chapters);
    const done = topic.chapters.filter((c) => (state.data.chapters[c.id] || {}).rounds > 0).length;
    return `
      <li>
        <button type="button" class="topic-card" data-action="open-topic" data-id="${topic.id}">
          <span class="topic-icon">${icon(topic.icon)}</span>
          <span class="topic-main">
            <span class="topic-title">${topicTitle(topic)}</span>
            <span class="topic-sub">${t("topicChapters", { k: done, n: topic.chapters.length })}</span>
          </span>
          ${statusPill(status)}
          ${icon("chevron-right", "muted")}
        </button>
      </li>`;
  }).join("");

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
      <h2>${t("homePractice")}</h2>
      <div class="panel">
        <p class="hint">${t("homeIntro", { cycle: cycleName(cycle), range: cycleRange(cycle) })}</p>
        <button type="button" class="btn btn-primary btn-wide" data-action="start-cycle-mixed">
          ${icon("shuffle")} ${t("homeMixed")}
        </button>
        <p class="hint">${t("homeMixedHint", { n: ROUND_SIZE })}</p>
      </div>
    </section>
    <section class="section">
      <h2>${t("homeRules")}</h2>
      <ul class="topic-list">${cards}</ul>
    </section>
    <footer class="app-footer">
      <p class="hint">${t("homeStorageNote")}</p>
      <button type="button" class="btn-link" data-action="reset-all">${t("homeReset")}</button>
    </footer>`;
}

/* ── Rule view: the chapters of one rule ─────────────────────────── */

function renderTopic(state) {
  const topic = topicById(state.data.settings.contentLanguage, state.topicId);
  if (!topic) return "";

  const cards = topic.chapters.map((chapter, i) => {
    const progress = state.data.chapters[chapter.id];
    const status = statusOf(progress);
    const sub = progress && progress.rounds
      ? t("chapterRounds", { n: progress.rounds })
      : t("chapterNew", { n: chapter.items.length });
    return `
      <li>
        <button type="button" class="topic-card" data-action="start-chapter" data-id="${chapter.id}">
          <span class="chapter-number" aria-hidden="true">${i + 1}</span>
          <span class="topic-main">
            <span class="topic-title">${chapterName(i)}</span>
            <span class="topic-sub">${sub}</span>
          </span>
          ${isTyped(chapter.kind) ? `<span class="tag-write">${icon("pen-line")} ${t("chapterWriting")}</span>` : ""}
          ${statusPill(status)}
          ${icon("chevron-right", "muted")}
        </button>
      </li>`;
  }).join("");

  return `
    ${viewHeader(topicTitle(topic))}
    <div class="rule">
      <span class="rule-label">${icon("lightbulb")} ${t("roundRule")}</span>
      <p class="rule-text">${topicRule(topic)}</p>
      ${ruleSourceLine(topic)}
    </div>
    <section class="section">
      <h2>${t("topicChaptersTitle")}</h2>
      <ul class="topic-list">${cards}</ul>
      <button type="button" class="btn btn-secondary btn-wide" data-action="start-topic-mixed" data-id="${topic.id}">
        ${icon("shuffle")} ${t("topicMixed")}
      </button>
    </section>`;
}

/* ── Settings ────────────────────────────────────────────────────── */

// One panel per setting, a choice grid per panel, changes save at once.
// Shared settings pattern from PRODUCT.md.
function renderSettings(state) {
  const lang = currentLanguage();
  const settings = state.data.settings;

  const langChoices = LANGUAGES.map((l) => `
    <button type="button" class="choice ${l.code === lang ? "selected" : ""}"
            data-action="set-lang" data-lang="${l.code}" aria-pressed="${l.code === lang}">
      <span class="choice-title" lang="${l.htmlLang}">${l.label}</span>
    </button>`).join("");

  // The learning language is a real setting with one option today. A
  // panel that offers no choice is noise, so it appears with the second
  // content pack; the setting itself is stored and used either way.
  const contentPanel = CONTENT_LANGUAGES.length > 1 ? `
    <section class="section">
      <h2>${t("settingsContent")}</h2>
      <div class="panel">
        <p class="hint">${t("settingsContentHint")}</p>
        <div class="choice-grid choice-grid-wide">
          ${CONTENT_LANGUAGES.map((c) => `
            <button type="button" class="choice ${c.code === settings.contentLanguage ? "selected" : ""}"
                    data-action="set-content" data-content="${c.code}"
                    aria-pressed="${c.code === settings.contentLanguage}">
              <span class="choice-title" lang="${c.htmlLang}">${c.label}</span>
            </button>`).join("")}
        </div>
      </div>
    </section>` : "";

  const cycleChoices = CYCLES.map((c) => {
    const count = topicsForCycle(settings.contentLanguage, c).length;
    return `
      <button type="button" class="choice ${c === settings.cycle ? "selected" : ""}"
              data-action="set-cycle" data-cycle="${c}" aria-pressed="${c === settings.cycle}">
        <span class="choice-title">${cycleName(c)}</span>
        <span class="choice-hint">${cycleRange(c)}</span>
        <span class="choice-hint">${t("settingsCycleTopics", { n: count })}</span>
      </button>`;
  }).join("");

  return `
    ${viewHeader(t("settingsTitle"))}
    <section class="section">
      <h2>${t("settingsLanguage")}</h2>
      <div class="panel">
        <p class="hint">${t("settingsLanguageHint")}</p>
        <div class="choice-grid choice-grid-wide">${langChoices}</div>
      </div>
    </section>
    ${contentPanel}
    <section class="section">
      <h2>${t("settingsCycle")}</h2>
      <div class="panel">
        <p class="hint">${t("settingsCycleHint")}</p>
        <div class="choice-grid choice-grid-cycle">${cycleChoices}</div>
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

// Quiet reward block for the completion panel: XP gained, level up, new
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

/* ── Round ───────────────────────────────────────────────────────── */

// The task text with the answer slot in place. `slot` is the finished
// HTML for the blank; everything around it is content and is escaped.
function taskLine(state, task, slot) {
  const [before, after] = fillTask(task, BLANK).split(BLANK);
  return `<span class="task-text"${contentLangAttr(state)}>${escapeHtml(before)}${slot}${escapeHtml(after)}</span>`;
}

// The open slot shows three dots, which a screen reader would spell out
// one by one. It is named instead, so the gap is announced as a gap.
function blankSlot(text, extra = "", label = "") {
  const empty = text === "";
  const named = label ? ` role="img" aria-label="${label}"` : "";
  return `<span class="blank ${extra} ${empty ? "blank-none" : ""}"${named}>${escapeHtml(text)}</span>`;
}

function renderRound(state) {
  const r = state.round;
  const title = r.title;

  if (r.phase === "done") return renderRoundDone(state, title);

  const task = r.tasks[r.i];
  const topic = topicById(state.data.settings.contentLanguage, task.topicId);
  const dots = r.tasks.map((_, i) =>
    `<span class="dot ${i < r.i ? "done" : i === r.i ? "current" : ""}"></span>`).join("");

  const body = isTyped(task.kind)
    ? renderTypedTask(state, task, r)
    : renderChoiceTask(state, task, r);

  return `
    ${viewHeader(title)}
    <div class="step-dots" role="img" aria-label="${t("roundStepProgress", { i: r.i + 1, n: r.tasks.length })}">${dots}</div>
    <p class="instruction">${instructionFor(task, r)}</p>
    ${body.task}
    ${ruleBlock(topic, r)}
    <div class="feedback-area">${body.feedback}</div>
    <div class="actions">${body.actions}</div>`;
}

function instructionFor(task, r) {
  if (task.kind === "memory") {
    return r.phase === "study" ? t("instructionMemoryStudy") : t("instructionMemoryWrite");
  }
  return t("instruction" + task.kind.charAt(0).toUpperCase() + task.kind.slice(1));
}

// The rule stays out of the way while the child thinks and appears once
// the answer is in, which is when it explains something. It is always
// available on the rule view for anyone who wants to read it first.
function ruleBlock(topic, r) {
  if (r.phase === "ask" || r.phase === "study") return "";
  return `
    <div class="rule">
      <span class="rule-label">${icon("lightbulb")} ${t("roundRule")}</span>
      <p class="rule-text">${topicRule(topic)}</p>
    </div>`;
}

function renderChoiceTask(state, task, r) {
  const answer = expectedAnswer(task);
  const optionLabel = (value) =>
    value === "" && task.emptyOptionKey ? t(task.emptyOptionKey) : value;

  let slot = blankSlot(DOTS, "blank-open", t("blankLabel"));
  if (r.phase === "correct" || r.phase === "reveal") slot = blankSlot(answer, "blank-ok");
  else if (r.phase === "wrong") slot = blankSlot(r.chosen, "blank-miss");

  const clue = task.item.clue
    ? `<p class="task-clue"${contentLangAttr(state)}>${escapeHtml(task.item.clue)}</p>` : "";

  const taskHtml = `
    <div class="panel task-panel task-${task.kind}">
      ${taskLine(state, task, slot)}
      ${clue}
    </div>`;

  let feedback = "";
  let actions = "";
  if (r.phase === "ask") {
    actions = `
      <div class="choice-grid choice-grid-options" role="group" aria-label="${t("optionsLabel")}">
        ${task.options.map((value) => {
          // A single punctuation mark needs a size of its own, or a
          // comma disappears in a button built for words.
          const mark = task.kind === "punct" && value !== "";
          return `
          <button type="button" class="choice choice-option ${mark ? "choice-option-mark" : ""}" data-action="choose" data-value="${escapeHtml(value)}">
            <span class="choice-title"${value === "" ? "" : contentLangAttr(state)}>${escapeHtml(optionLabel(value))}</span>
          </button>`;
        }).join("")}
      </div>`;
  } else if (r.phase === "correct") {
    feedback = feedbackBlock("success", t("feedbackCorrect"));
    actions = primaryBtn("next", t("actionNext"), true);
  } else if (r.phase === "wrong") {
    feedback = feedbackBlock("warn", r.wrong >= 2 ? t("feedbackWrongAgain") : t("feedbackWrong"));
    actions = `
      ${primaryBtn("retry", t("actionRetry"), true)}
      ${r.wrong >= 2 ? secondaryBtn("reveal", t("actionReveal")) : ""}`;
  } else if (r.phase === "reveal") {
    feedback = feedbackBlock("info", t("feedbackReveal"));
    actions = primaryBtn("reveal-done", t("actionRevealDone"), true);
  }

  return { task: taskHtml, feedback, actions };
}

// memory, write and copy all end in the same known-length field. What
// differs is what the child can see while writing: a memory word is
// hidden, a write frame shows the sentence around the gap, a copy task
// keeps the sentence on screen to be written out correctly.
function renderTypedTask(state, task, r) {
  const answer = expectedAnswer(task);
  const shown = r.phase === "correct" || r.phase === "reveal";

  if (task.kind === "memory" && r.phase === "study") {
    return {
      task: `
        <div class="panel task-panel task-memory">
          <span class="memory-word"${contentLangAttr(state)}>${escapeHtml(answer)}</span>
          ${clueLine(state, task)}
        </div>`,
      feedback: "",
      actions: primaryBtn("study-done", t("memoryReady"), true)
    };
  }

  let frame = "";
  if (task.kind === "memory") {
    frame = shown
      ? `<span class="memory-word ${r.phase === "correct" ? "ok" : "reveal"}"${contentLangAttr(state)}>${escapeHtml(answer)}</span>`
      : "";
  } else if (task.kind === "copy") {
    frame = `<span class="copy-prompt"${contentLangAttr(state)}>${escapeHtml(task.item.prompt)}</span>`
      + (shown ? `<span class="memory-word ${r.phase === "correct" ? "ok" : "reveal"}"${contentLangAttr(state)}>${escapeHtml(answer)}</span>` : "");
  } else {
    const slot = shown
      ? blankSlot(answer, "blank-ok")
      : blankSlot(DOTS, "blank-open", t("blankLabel"));
    frame = taskLine(state, task, slot);
  }

  const taskHtml = `
    <div class="panel task-panel task-${task.kind}">
      ${frame}
      ${clueLine(state, task)}
      ${r.phase === "wrong" ? typedLetters(state, answer, r.typed) : ""}
    </div>`;

  let feedback = "";
  let actions = "";
  if (r.phase === "ask") {
    // Known-length input: no confirm button, the answer is checked the
    // moment the last letter lands. The advisory line under the field
    // announces that before the field is used (WCAG 3.2.2 On Input).
    actions = `
      <div class="answer-field">
        <label class="sr-only" for="answer">${t("memoryInputLabel")}</label>
        <input id="answer" type="text" value="${escapeHtml(r.typed)}" maxlength="${answer.length}"
               autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false"
               inputmode="text" data-autofocus${contentLangAttr(state)}>
        <p class="hint">${t("memoryLetters", { n: answer.length })}</p>
        <p class="hint">${t("memoryAutoHint")}</p>
      </div>`;
  } else if (r.phase === "correct") {
    feedback = feedbackBlock("success", t("feedbackCorrect"));
    actions = primaryBtn("next", t("actionNext"), true);
  } else if (r.phase === "wrong") {
    feedback = feedbackBlock("warn", r.wrong >= 2 ? t("feedbackWrongAgain") : t("feedbackWrong"));
    actions = `
      ${primaryBtn("retry", t("actionRetry"), true)}
      ${r.wrong >= 2 ? secondaryBtn("reveal", t("actionReveal")) : ""}`;
  } else if (r.phase === "reveal") {
    feedback = feedbackBlock("info", t("feedbackReveal"));
    actions = primaryBtn("reveal-done", t("actionRevealDone"), true);
  }

  return { task: taskHtml, feedback, actions };
}

function clueLine(state, task) {
  return task.item.clue
    ? `<p class="task-clue"${contentLangAttr(state)}>${escapeHtml(task.item.clue)}</p>` : "";
}

// What the child wrote, letter by letter, with the misses marked. The
// marking never rests on colour alone: a missed letter also carries a
// line under it and is named in the feedback text.
function typedLetters(state, answer, typed) {
  const diff = letterDiff(answer, typed);
  const cells = answer.split("").map((_, i) => {
    const ch = typed[i] || " ";
    const space = ch === " ";
    return `<span class="letter ${diff[i] ? "ok" : "miss"} ${space ? "letter-space" : ""}">${escapeHtml(ch)}</span>`;
  }).join("");
  return `
    <p class="hint">${t("memoryTyped")}</p>
    <div class="letters"${contentLangAttr(state)}>${cells}</div>`;
}

function renderRoundDone(state, title) {
  const r = state.round;
  const known = r.firstTry.filter(Boolean).length;
  const total = r.tasks.length;
  const msg = known === total ? t("doneAll", { n: total }) : t("doneMsg", { k: known, n: total });

  const items = r.tasks.map((task, i) => `
    <li class="result-row ${r.firstTry[i] ? "known" : ""}">
      <span class="result-text"${contentLangAttr(state)}>${escapeHtml(fillTask(task, expectedAnswer(task)))}</span>
      <span class="result-tag">${r.firstTry[i] ? t("resultKnown") : t("resultPracticed")}</span>
    </li>`).join("");

  const suggestion = r.suggestCycle
    ? feedbackBlock("info", t("suggestCycle", { cycle: cycleName(r.suggestCycle) }), "graduation-cap") : "";
  const suggestBtn = r.suggestCycle
    ? `<button type="button" class="btn btn-primary btn-wide" data-action="accept-cycle" data-cycle="${r.suggestCycle}" data-autofocus>${t("suggestCycleBtn", { cycle: cycleName(r.suggestCycle) })}</button>` : "";

  // A finished chapter points at the next one, which is what "learn
  // chapter 1, then chapter 2" needs to feel like a path.
  const nextChapter = r.nextChapterId && !r.suggestCycle
    ? `<button type="button" class="btn btn-primary btn-wide" data-action="start-chapter" data-id="${r.nextChapterId}" data-autofocus>${t("doneNextChapter", { name: chapterName(r.nextChapterIndex) })}</button>`
    : "";

  const againPrimary = !r.suggestCycle && !nextChapter;
  const again = againPrimary
    ? `<button type="button" class="btn btn-primary btn-wide" data-action="again" data-autofocus>${t("doneAgain")}</button>`
    : secondaryBtn("again", t("doneAgain"));

  return `
    ${viewHeader(title)}
    <div class="panel done-panel">
      ${feedbackBlock("success", `<strong>${t("doneTitle")}</strong> ${msg}`)}
      ${rewardBlock(r.reward)}
      ${suggestion}
      <ul class="result-list">${items}</ul>
      ${suggestBtn}
      ${nextChapter}
      ${again}
      ${secondaryBtn("nav-home", t("doneHome"))}
    </div>`;
}

/* ── Shared pieces ───────────────────────────────────────────────── */

function viewHeader(title) {
  return `
    <header class="view-header">
      <button type="button" class="btn-icon" data-action="nav-back" aria-label="${t("navBack")}">${icon("arrow-left")}</button>
      <h1>${title}</h1>
    </header>`;
}

function feedbackBlock(tone, msg, iconName) {
  const icons = { success: "check", warn: "info", info: "eye" };
  return `<div class="feedback feedback-${tone}" role="status">${icon(iconName || icons[tone])}<span>${msg}</span></div>`;
}

function primaryBtn(action, label, autofocus) {
  return `<button type="button" class="btn btn-primary btn-wide" data-action="${action}" ${autofocus ? "data-autofocus" : ""}>${label}</button>`;
}

function secondaryBtn(action, label) {
  return `<button type="button" class="btn btn-secondary btn-wide" data-action="${action}">${label}</button>`;
}
