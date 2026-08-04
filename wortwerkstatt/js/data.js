// data.js — app registries: interface languages, content packs and the
// three Lehrplan 21 cycles. No copy lives here; everything visible
// resolves through the string tables in js/i18n/.

import { de as contentDe } from "./content/de.js?v=9";

export const LANGUAGES = [
  { code: "de", htmlLang: "de-CH", label: "Deutsch" },
  { code: "en", htmlLang: "en", label: "English" }
];

export const DEFAULT_LANGUAGE = "de";

// A content pack is one language's orthography curriculum. The app
// ships German; every code path is generic, so a second pack drops in
// by adding a file here. Interface language and content language are
// two separate settings on purpose: a child can practise German
// spelling with a French interface.
export const CONTENT_LANGUAGES = [contentDe];

export const DEFAULT_CONTENT_LANGUAGE = "de";

// Lehrplan 21 cycles, as the competency table places them (see PRD.md).
// 1 = 1./2. Klasse, 2 = 3. bis 6. Klasse, 3 = 7. bis 9. Klasse.
export const CYCLES = [1, 2, 3];

// The exact edition the rule references point at. A later revision of
// the Lehrplan means a new date here and a re-check of every `step` in
// the content pack.
export const LEHRPLAN_VERSION = "Kanton Bern, 23.06.2016";

// Cycle 1 holds the rules the source document lists first, including
// the sch, sp/st and ng spellings. Stepping up is suggested after five
// clean rounds; stepping down is always a tap away in the settings.
export const DEFAULT_CYCLE = 1;

export function contentByCode(code) {
  return CONTENT_LANGUAGES.find((c) => c.code === code) || CONTENT_LANGUAGES[0];
}

// A rule can span two cycles. The competency table draws a step that
// straddles a cycle boundary across both bars, and step b does exactly
// that: sch, sp/st, ng, abstract nouns and end-of-sentence marks are
// introduced in cycle 1 and consolidated in cycle 2, so they belong on
// both lists rather than only the earlier one.
export function topicsForCycle(contentCode, cycle) {
  return contentByCode(contentCode).topics.filter((topic) => topic.cycles.includes(cycle));
}

export function topicById(contentCode, id) {
  return contentByCode(contentCode).topics.find((topic) => topic.id === id) || null;
}

// Chapter ids are unique across the pack, so a chapter can be looked up
// without knowing its rule. Returns { topic, chapter, index } or null.
export function chapterById(contentCode, chapterId) {
  for (const topic of contentByCode(contentCode).topics) {
    const index = topic.chapters.findIndex((c) => c.id === chapterId);
    if (index >= 0) return { topic, chapter: topic.chapters[index], index };
  }
  return null;
}

export function chaptersForCycle(contentCode, cycle) {
  return topicsForCycle(contentCode, cycle).flatMap((topic) =>
    topic.chapters.map((chapter) => ({ topic, chapter })));
}

export function textsForCycle(contentCode, cycle) {
  return (contentByCode(contentCode).texts || []).filter((text) => text.cycles.includes(cycle));
}

export function textById(contentCode, id) {
  return (contentByCode(contentCode).texts || []).find((text) => text.id === id) || null;
}

// Turns a topic id into the PascalCase part of its string ids:
// "sp-st" -> "SpSt", resolved as topicSpStTitle / topicSpStRule.
// Topic ids are unique across content packs for this reason.
export function topicKey(id) {
  return id.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
}

// Same convention for texts: "schulweg" -> textSchulwegTitle.
export const textKey = topicKey;
