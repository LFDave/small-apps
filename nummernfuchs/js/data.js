// data.js — static app data: Swiss emergency numbers and all UI strings.
// Strings live here keyed by stable IDs so an English toggle can be added
// later without touching markup or logic (foundation language rule).

export const EMERGENCY = [
  {
    number: "112",
    name: "Notruf Europa",
    icon: "phone-call",
    situation: "Der allgemeine Notruf. Er funktioniert in ganz Europa.",
    explain: "112 ist der Notruf in ganz Europa."
  },
  {
    number: "117",
    name: "Polizei",
    icon: "shield",
    situation: "Du brauchst die Polizei.",
    explain: "117 ist die Polizei."
  },
  {
    number: "118",
    name: "Feuerwehr",
    icon: "flame",
    situation: "Es brennt.",
    explain: "118 ist die Feuerwehr."
  },
  {
    number: "144",
    name: "Sanität",
    icon: "ambulance",
    situation: "Jemand ist verletzt und braucht schnell Hilfe.",
    explain: "144 ist die Sanität."
  },
  {
    number: "145",
    name: "Tox Info",
    icon: "flask-conical",
    situation: "Jemand hat etwas Giftiges geschluckt.",
    explain: "145 ist Tox Info Suisse. Sie hilft bei Vergiftungen."
  },
  {
    number: "1414",
    name: "Rega",
    icon: "mountain",
    situation: "Jemand braucht Hilfe in den Bergen.",
    explain: "1414 ist die Rega, die Rettung aus der Luft."
  }
];

export const STRINGS = {
  appTitle: "Nummernfuchs",
  appTagline: "Merk dir Nummern und Codes.",

  homeMyNumbers: "Meine Nummern",
  homeEmpty: "Noch keine Nummern gespeichert. Füge die erste hinzu, zum Beispiel Mamis Handynummer oder den Code der Haustür.",
  homeAdd: "Nummer hinzufügen",
  homeEmergency: "Notfallnummern",
  homeEmergencyIntro: "Diese Nummern helfen dir im Notfall. Kennst du sie auswendig?",
  homeEmergencyPractice: "Notfallnummern üben",
  homePractice: "Üben",
  homeStorageNote: "Alle Nummern bleiben auf diesem Gerät.",
  homeReset: "Alles zurücksetzen",
  resetConfirm: "Alle Nummern und Fortschritte löschen? Die Daten liegen nur auf diesem Gerät.",

  statusNeu: "Neu",
  statusGeuebt: "Geübt",
  statusSitzt: "Sitzt!",

  formTitleNew: "Neue Nummer",
  formTitleEdit: "Nummer bearbeiten",
  formTypeLabel: "Was für eine Nummer ist es?",
  formTypeCode: "Code",
  formTypeCodeHint: "Türcode, Briefkasten, Veloschloss",
  formTypePhone: "Telefonnummer",
  formTypePhoneHint: "Handy oder Festnetz",
  formLabelLabel: "Für wen oder was?",
  formLabelPlaceholderCode: "Haustür",
  formLabelPlaceholderPhone: "Mami Handy",
  formNumberLabel: "Die Nummer",
  formNumberHint: "Mit Leerzeichen in Gruppen teilen, so wie du sie sprichst. Zum Beispiel: 640 132",
  formNumberPlaceholderCode: "640 132",
  formNumberPlaceholderPhone: "079 640 13 21",
  formIntlLabel: "Auch international üben",
  formIntlCc: "Landesvorwahl",
  formIntlPreview: "International:",
  formSave: "Speichern",
  formDelete: "Löschen",
  formDeleteConfirm: "Diese Nummer löschen? Die Daten liegen nur auf diesem Gerät.",
  formBack: "Zurück",

  errLabelEmpty: "Gib der Nummer einen Namen, zum Beispiel Mami Handy.",
  errLabelLong: "Der Name ist zu lang. Höchstens 24 Zeichen.",
  errNumberEmpty: "Gib die Nummer ein.",
  errNumberInvalid: "Nur Ziffern und Leerzeichen sind erlaubt.",
  errNumberShort: "Die Nummer ist zu kurz. Mindestens 3 Ziffern.",
  errNumberLong: "Die Nummer ist zu lang. Höchstens 16 Ziffern.",
  errChunkLong: "Mach kleinere Gruppen. Höchstens 5 Ziffern pro Gruppe.",
  errCcInvalid: "Die Landesvorwahl braucht 1 bis 3 Ziffern.",

  ladderStepView: "Schau dir die Nummer gut an. Lies sie laut in Gruppen.",
  ladderStepCloze: "Eine Gruppe fehlt. Tipp sie ein.",
  ladderStepTail: "Jetzt fehlt fast alles. Tipp die fehlenden Gruppen ein.",
  ladderStepFull: "Und jetzt ganz aus dem Kopf. Tipp die ganze Nummer ein.",
  ladderStepIntlView: "So wählst du die Nummer aus dem Ausland. Schau sie dir gut an.",
  ladderStepIntlFull: "Tipp die internationale Nummer ein. Sie beginnt mit +.",
  ladderReady: "Ich bin bereit",
  ladderNext: "Weiter",
  ladderRetry: "Nochmals versuchen",
  ladderReveal: "Nummer nochmals anschauen",
  ladderRevealMsg: "Schau genau hin. Dann versuch es nochmals.",
  ladderRevealDone: "Weiter üben",
  ladderCorrect: "Richtig.",
  ladderWrong: "Fast. Versuch es noch einmal.",
  ladderWrongAgain: "Fast. Schau dir die Nummer nochmals an, wenn du willst.",
  ladderDoneTitle: "Geschafft!",
  ladderDoneMsg: "Du hast dir «{label}» gemerkt.",
  ladderDoneSitzt: "Diese Nummer sitzt jetzt richtig gut.",
  ladderAgain: "Nochmals üben",
  ladderHome: "Zur Übersicht",

  quizTitle: "Notfallnummern",
  quizQuestion: "Welche Nummer rufst du?",
  quizProgress: "Nummer {i} von {n}",
  quizCorrect: "Richtig. {explain}",
  quizWrongCopy: "Fast. {explain} Tipp sie zum Merken nochmals ein.",
  quizCopyAgain: "Schau: {number}. Versuch es nochmals.",
  quizDoneTitle: "Gut gemacht!",
  quizDoneMsg: "{k} von {n} Nummern hast du direkt gewusst.",
  quizDoneAll: "Alle Nummern gewusst. Stark!",
  quizKnown: "gewusst",
  quizPracticed: "geübt",

  padBackspace: "Ziffer löschen",
  padAutoHint: "Bei der letzten Ziffer siehst du sofort, ob es stimmt."
};

// Fills {placeholders} in a string template.
export function fmt(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, k) => (k in values ? values[k] : `{${k}}`));
}
