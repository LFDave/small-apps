// data.js — app registries: interface languages, content packs and the
// three Lehrplan 21 cycles. No copy lives here; everything visible
// resolves through the string tables in js/i18n/.

import { de as contentDe } from "./content/de.js?v=1";

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

// Lehrplan 21 cycles. 1 = 1./2. Klasse, 2 = 3. bis 6. Klasse,
// 3 = 7. bis 9. Klasse.
export const CYCLES = [1, 2, 3];

// Cycle 2 covers the widest band and holds the rules most children
// stumble over (sch, sp/st, ng, abstract nouns, end-of-sentence marks).
// Cycle 1 and 3 are one tap away in the settings.
export const DEFAULT_CYCLE = 2;

export function contentByCode(code) {
  return CONTENT_LANGUAGES.find((c) => c.code === code) || CONTENT_LANGUAGES[0];
}

export function topicsForCycle(contentCode, cycle) {
  return contentByCode(contentCode).topics.filter((topic) => topic.cycle === cycle);
}

export function topicById(contentCode, id) {
  return contentByCode(contentCode).topics.find((topic) => topic.id === id) || null;
}

// Turns a topic id into the PascalCase part of its string ids:
// "sp-st" -> "SpSt", resolved as topicSpStTitle / topicSpStRule.
// Topic ids are unique across content packs for this reason.
export function topicKey(id) {
  return id.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
}
