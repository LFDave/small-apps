// i18n.js — interface language lookup. Both tables ship with the app and
// are imported statically, so switching language never touches the
// network. German is the fallback for a missing key; a missing key is a
// bug, and `t` returns the key itself so it shows up instead of hiding.

import { LANGUAGES, DEFAULT_LANGUAGE } from "./data.js?v=2";
import { de } from "./i18n/de.js?v=2";
import { en } from "./i18n/en.js?v=2";

export const TABLES = { de, en };

let current = DEFAULT_LANGUAGE;

export function setLanguage(code) {
  current = TABLES[code] ? code : DEFAULT_LANGUAGE;
  const lang = LANGUAGES.find((l) => l.code === current);
  if (typeof document !== "undefined" && lang) {
    document.documentElement.lang = lang.htmlLang;
  }
  return current;
}

export function currentLanguage() {
  return current;
}

// Fills {placeholders} in a string template.
export function fmt(template, values) {
  return String(template).replace(/\{(\w+)\}/g, (_, k) => (k in values ? values[k] : `{${k}}`));
}

export function t(key, values) {
  const raw = TABLES[current][key] ?? TABLES[DEFAULT_LANGUAGE][key];
  if (raw === undefined) return key;
  return values ? fmt(raw, values) : raw;
}
