// i18n/de.js — German (Swiss standard German, ss never sharp s).
// The reference table: every other language carries exactly these keys
// with exactly these {placeholders}. The e2e suite enforces it.

export const de = {
  /* ── App shell ─────────────────────────────────────────────────── */
  appTitle: "Wortwerkstatt",
  appTagline: "Rechtschreibung üben, Regel für Regel.",
  navBack: "Zurück",
  settingsOpen: "Einstellungen öffnen",

  /* ── Home ──────────────────────────────────────────────────────── */
  homePractice: "Üben",
  homeRules: "Regeln",
  homeIntro: "Du übst gerade {cycle}, {range}.",
  homeMixed: "Gemischte Übung",
  homeMixedHint: "{n} Aufgaben aus allen Regeln dieses Zyklus.",
  homeStorageNote: "Dein Fortschritt bleibt auf diesem Gerät.",
  homeReset: "Fortschritt löschen",
  resetConfirm: "Wirklich den ganzen Fortschritt löschen? Die Daten liegen nur auf diesem Gerät.",
  topicRounds: "{n} Runden geübt",
  topicNew: "Noch nicht geübt",

  statusNeu: "Neu",
  statusGeuebt: "Geübt",
  statusSitzt: "Sitzt!",

  /* ── Cycles ────────────────────────────────────────────────────── */
  cycle1: "Zyklus 1",
  cycle1Range: "1. und 2. Klasse",
  cycle2: "Zyklus 2",
  cycle2Range: "3. bis 6. Klasse",
  cycle3: "Zyklus 3",
  cycle3Range: "7. bis 9. Klasse",

  /* ── Level, XP, medals ─────────────────────────────────────────── */
  statsLevel: "Level {n}: {title}",
  statsXp: "{xp} von {next} XP",
  statsXpMax: "{xp} XP",
  statsMedals: "{k} von {n} Medaillen",
  statsOpen: "Level und Medaillen ansehen",
  medalsTitle: "Medaillen",
  rewardXp: "+{xp} XP",
  rewardLevelUp: "Neues Level: {title}",
  rewardMedal: "Neue Medaille: {name}",

  level1: "Schreiblehrling",
  level2: "Wortsammler",
  level3: "Satzbauer",
  level4: "Regelprofi",
  level5: "Schreibprofi",
  level6: "Meisterfeder",

  medalNameErsteRunde: "Erste Runde",
  medalDescErsteRunde: "Eine Übungsrunde beendet.",
  medalNameDreiRunden: "Dranbleiber",
  medalDescDreiRunden: "Drei Übungsrunden beendet.",
  medalNameAchtRunden: "Wortarbeiter",
  medalDescAchtRunden: "Acht Übungsrunden beendet.",
  medalNameEinundzwanzigRunden: "Werkstattmeister",
  medalDescEinundzwanzigRunden: "21 Übungsrunden beendet.",
  medalNameRegelfest: "Regelfest",
  medalDescRegelfest: "Eine Regel dreimal ohne Fehler geübt.",
  medalNameAlleskoenner: "Rundum",
  medalDescAlleskoenner: "Jede Regel deines Zyklus mindestens einmal geübt.",
  medalNameWortschmied: "Wortschmied",
  medalDescWortschmied: "400 Buchstaben getippt. Üben zählt, auch wenn es daneben ging.",
  medalNameBlitzmerker: "Blitzmerker",
  medalDescBlitzmerker: "20 Merkwörter aus dem Kopf geschrieben.",
  medalNameZyklusreise: "Zyklusreise",
  medalDescZyklusreise: "In allen drei Zyklen geübt.",

  /* ── Round ─────────────────────────────────────────────────────── */
  roundProgress: "Aufgabe {i} von {n}",
  roundMixed: "Gemischte Übung",
  roundRule: "Regel",
  roundStepProgress: "Aufgabe {i} von {n}",

  instructionWord: "Welche Buchstaben fehlen?",
  instructionSentence: "Welches Wort passt?",
  instructionPunct: "Welches Zeichen passt?",
  instructionMemoryStudy: "Schau dir das Wort gut an.",
  instructionMemoryWrite: "Schreib das Wort aus dem Kopf.",

  memoryReady: "Ich kann es",
  memoryInputLabel: "Wort schreiben",
  memoryLetters: "{n} Buchstaben. Achte auf gross und klein.",
  memoryAutoHint: "Beim letzten Buchstaben siehst du sofort, ob es stimmt.",
  memoryTyped: "Du hast geschrieben:",

  optionsLabel: "Antwort wählen",
  optionNoComma: "kein Komma",
  blankLabel: "Lücke",

  feedbackCorrect: "Richtig.",
  feedbackWrong: "Fast. Schau die Regel an und versuch es nochmals.",
  feedbackWrongAgain: "Fast. Lies die Regel langsam durch.",
  feedbackReveal: "So wird es geschrieben. Präg es dir ein.",
  solutionLabel: "Richtig ist:",

  actionRetry: "Nochmals versuchen",
  actionReveal: "Lösung zeigen",
  actionRevealDone: "Weiter üben",
  actionNext: "Weiter",

  /* ── Round completion ──────────────────────────────────────────── */
  doneTitle: "Runde geschafft!",
  doneMsg: "{k} von {n} Aufgaben hast du direkt gewusst.",
  doneAll: "Alle {n} Aufgaben hast du direkt gewusst.",
  doneAgain: "Nochmals üben",
  doneHome: "Zur Übersicht",
  resultKnown: "gewusst",
  resultPracticed: "geübt",

  suggestCycle: "Das klappt richtig gut. Probier {cycle}!",
  suggestCycleBtn: "{cycle} üben",

  /* ── Settings ──────────────────────────────────────────────────── */
  settingsTitle: "Einstellungen",
  settingsLanguage: "Sprache",
  settingsLanguageHint: "Die Sprache der Bedienung. Die Übungswörter bleiben in der Lernsprache.",
  settingsContent: "Lernsprache",
  settingsContentHint: "Die Sprache, deren Rechtschreibung du übst.",
  settingsCycle: "Zyklus",
  settingsCycleHint: "Der Zyklus bestimmt, welche Regeln du übst. Du kannst jederzeit wechseln.",
  settingsCycleTopics: "{n} Regeln",

  /* ── Topics: title and rule ────────────────────────────────────── */
  topicNomenGrossTitle: "Nomen gross",
  topicNomenGrossRule: "Dinge, die du sehen oder anfassen kannst, sind Nomen. Nomen schreibt man gross.",
  topicSatzanfangTitle: "Satzanfang",
  topicSatzanfangRule: "Jeder Satz beginnt mit einem grossen Buchstaben.",
  topicSatzschlussPunktTitle: "Punkt und Fragezeichen",
  topicSatzschlussPunktRule: "Ein Satz, der etwas erzählt, endet mit einem Punkt. Eine Frage endet mit einem Fragezeichen.",
  topicMerkwort1Title: "Merkwörter",
  topicMerkwort1Rule: "Diese Wörter kannst du nicht herleiten. Schau sie dir genau an und schreib sie aus dem Kopf.",

  topicSchTitle: "sch",
  topicSchRule: "Den Laut sch schreibst du mit drei Buchstaben: s, c, h.",
  topicSpStTitle: "sp und st",
  topicSpStRule: "Am Wortanfang hörst du schp und scht. Geschrieben wird aber sp und st.",
  topicNgNkTitle: "ng und nk",
  topicNgNkRule: "Sprich das Wort langsam. Hörst du am Ende ein k, schreibst du nk. Sonst schreibst du ng.",
  topicDoppelkonsonantTitle: "Doppelte Mitlaute",
  topicDoppelkonsonantRule: "Sprichst du den Selbstlaut kurz, folgen zwei gleiche Mitlaute.",
  topicDehnungTitle: "Lange Selbstlaute",
  topicDehnungRule: "Ein lang gesprochener Selbstlaut wird gedehnt: mit ie, mit einem stummen h oder mit zwei gleichen Selbstlauten.",
  topicAbstrakteNomenTitle: "Abstrakte Nomen",
  topicAbstrakteNomenRule: "Auch Wörter, die man nicht anfassen kann, sind Nomen. Ein Begleiter wie der, die, das oder viel zeigt es dir. Nomen schreibt man gross.",
  topicSatzschlussTitle: "Satzschlusszeichen",
  topicSatzschlussRule: "Ein Aussagesatz endet mit einem Punkt, eine Frage mit einem Fragezeichen, ein Ausruf oder Befehl mit einem Ausrufezeichen.",
  topicMerkwort2Title: "Merkwörter",
  topicMerkwort2Rule: "Diese Wörter kannst du nicht herleiten. Schau sie dir genau an und schreib sie aus dem Kopf.",

  topicDasDassTitle: "das und dass",
  topicDasDassRule: "Kannst du das durch dieses, jenes oder welches ersetzen, schreibst du es mit einem s. Sonst steht dass.",
  topicNominalisierungTitle: "Nominalisierung",
  topicNominalisierungRule: "Steht vor einem Verb oder Adjektiv ein Wort wie das, beim, zum, etwas, nichts oder viel, wird es zum Nomen und gross geschrieben.",
  topicKommaTitle: "Komma beim Nebensatz",
  topicKommaRule: "Zwischen Hauptsatz und Nebensatz steht ein Komma. Wörter wie weil, dass, wenn oder obwohl leiten einen Nebensatz ein. Vor und steht kein Komma, wenn beide Teile dasselbe Subjekt haben.",
  topicEndungTitle: "Endungen ig und lich",
  topicEndungRule: "Verlänger das Wort, dann hörst du die Endung: freundlich wird freundliche, wichtig wird wichtige.",
  topicFremdwortTitle: "Fremdwörter",
  topicFremdwortRule: "Fremdwörter folgen den Regeln ihrer Herkunftssprache. Du musst sie dir merken."
};
