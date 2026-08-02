// data.js — structural app data: the supported languages and the
// per-country emergency packs. No copy lives here; every name,
// situation and explanation is a string id resolved through i18n.js,
// so a pack is identical in all five languages.
//
// Sources for the number tables are listed in PRD.md. Where a country
// has no equivalent of a service another country has, the pack carries
// a `gaps` entry instead of a made-up or borrowed number.

export const LANGUAGES = [
  { code: "de", label: "Deutsch", htmlLang: "de-CH" },
  { code: "fr", label: "Français", htmlLang: "fr-CH" },
  { code: "it", label: "Italiano", htmlLang: "it-CH" },
  { code: "rm", label: "Rumantsch", htmlLang: "rm-CH" },
  { code: "en", label: "English", htmlLang: "en" }
];

export const DEFAULT_LANGUAGE = "de";
export const DEFAULT_COUNTRY = "ch";

// One entry per number a child should know. `key` selects the name,
// situation and explanation strings; `cc` is the dialling code used as
// the default for new international phone entries.
export const COUNTRIES = [
  {
    code: "ch",
    cc: "41",
    numbers: [
      { key: "euro", number: "112", icon: "phone-call" },
      { key: "police", number: "117", icon: "shield" },
      { key: "fire", number: "118", icon: "flame" },
      { key: "medical", number: "144", icon: "ambulance" },
      { key: "toxCh", number: "145", icon: "flask-conical" },
      { key: "rega", number: "1414", icon: "mountain" }
    ],
    gaps: [],
    note: null
  },
  {
    code: "de",
    cc: "49",
    numbers: [
      { key: "deNotruf", number: "112", icon: "flame" },
      { key: "police", number: "110", icon: "shield" },
      { key: "deDoctor", number: "116117", icon: "stethoscope" }
    ],
    gaps: ["gapDePoison", "gapDeRescue"],
    note: null
  },
  {
    code: "at",
    cc: "43",
    numbers: [
      { key: "euro", number: "112", icon: "phone-call" },
      { key: "police", number: "133", icon: "shield" },
      { key: "fire", number: "122", icon: "flame" },
      { key: "medical", number: "144", icon: "ambulance" },
      { key: "atRescue", number: "140", icon: "mountain" }
    ],
    gaps: ["gapAtPoison"],
    note: null
  },
  {
    code: "fr",
    cc: "33",
    numbers: [
      { key: "euro", number: "112", icon: "phone-call" },
      { key: "police", number: "17", icon: "shield" },
      { key: "fire", number: "18", icon: "flame" },
      { key: "medical", number: "15", icon: "ambulance" }
    ],
    gaps: ["gapFrPoison", "gapFrRescue"],
    note: null
  },
  {
    code: "it",
    cc: "39",
    numbers: [
      { key: "itEuro", number: "112", icon: "phone-call" },
      { key: "police", number: "113", icon: "shield" },
      { key: "fire", number: "115", icon: "flame" },
      { key: "medical", number: "118", icon: "ambulance" }
    ],
    gaps: ["gapItPoison", "gapItRescue"],
    note: "noteIt"
  },
  {
    code: "li",
    cc: "423",
    numbers: [
      { key: "euro", number: "112", icon: "phone-call" },
      { key: "police", number: "117", icon: "shield" },
      { key: "fire", number: "118", icon: "flame" },
      { key: "medical", number: "144", icon: "ambulance" },
      { key: "toxLi", number: "145", icon: "flask-conical" },
      { key: "rega", number: "1414", icon: "mountain" }
    ],
    gaps: [],
    note: "noteLi"
  },
  {
    code: "no",
    cc: "47",
    numbers: [
      { key: "fire", number: "110", icon: "flame" },
      { key: "police", number: "112", icon: "shield" },
      { key: "medical", number: "113", icon: "ambulance" },
      { key: "noLegevakt", number: "116117", icon: "stethoscope" },
      { key: "noSeaRescue", number: "120", icon: "life-buoy" }
    ],
    gaps: ["gapNoPoison", "gapNoRescue"],
    note: "noteNo"
  }
];

export function countryByCode(code) {
  return COUNTRIES.find((c) => c.code === code) || COUNTRIES[0];
}

// Streak key for one emergency number. Country-scoped on purpose: 118
// is the fire brigade in Switzerland and the ambulance in Italy, so a
// bare number would merge two different lessons.
export function emergencyKey(countryCode, number) {
  return `${countryCode}:${number}`;
}
