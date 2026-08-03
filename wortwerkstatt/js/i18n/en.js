// i18n/en.js — English interface. Same keys and placeholders as de.js.
// The practice material stays in the content language (German), so the
// rules below explain German spelling in English.

export const en = {
  /* ── App shell ─────────────────────────────────────────────────── */
  appTitle: "Wortwerkstatt",
  appTagline: "Practise spelling, one rule at a time.",
  navBack: "Back",
  settingsOpen: "Open settings",

  /* ── Home ──────────────────────────────────────────────────────── */
  homePractice: "Practise",
  homeRules: "Rules",
  homeIntro: "You are working on {cycle}, {range}.",
  homeMixed: "Mixed practice",
  homeMixedHint: "{n} tasks from all rules in this cycle.",
  homeStorageNote: "Your progress stays on this device.",
  homeReset: "Delete progress",
  resetConfirm: "Really delete all progress? The data is only on this device.",
  topicRounds: "{n} rounds practised",
  topicNew: "Not practised yet",

  statusNeu: "New",
  statusGeuebt: "Practised",
  statusSitzt: "Solid!",

  /* ── Cycles ────────────────────────────────────────────────────── */
  cycle1: "Cycle 1",
  cycle1Range: "school years 1 and 2",
  cycle2: "Cycle 2",
  cycle2Range: "school years 3 to 6",
  cycle3: "Cycle 3",
  cycle3Range: "school years 7 to 9",

  /* ── Level, XP, medals ─────────────────────────────────────────── */
  statsLevel: "Level {n}: {title}",
  statsXp: "{xp} of {next} XP",
  statsXpMax: "{xp} XP",
  statsMedals: "{k} of {n} medals",
  statsOpen: "View level and medals",
  medalsTitle: "Medals",
  rewardXp: "+{xp} XP",
  rewardLevelUp: "New level: {title}",
  rewardMedal: "New medal: {name}",

  level1: "Writing Apprentice",
  level2: "Word Collector",
  level3: "Sentence Builder",
  level4: "Rule Expert",
  level5: "Writing Expert",
  level6: "Master Quill",

  medalNameErsteRunde: "First Round",
  medalDescErsteRunde: "Finished one practice round.",
  medalNameDreiRunden: "Keeping At It",
  medalDescDreiRunden: "Finished three practice rounds.",
  medalNameAchtRunden: "Word Worker",
  medalDescAchtRunden: "Finished eight practice rounds.",
  medalNameEinundzwanzigRunden: "Workshop Master",
  medalDescEinundzwanzigRunden: "Finished 21 practice rounds.",
  medalNameRegelfest: "Rule Solid",
  medalDescRegelfest: "Practised one rule three times without a slip.",
  medalNameAlleskoenner: "All Round",
  medalDescAlleskoenner: "Practised every rule in your cycle at least once.",
  medalNameWortschmied: "Word Smith",
  medalDescWortschmied: "Typed 400 letters. Practice counts, even the tries that missed.",
  medalNameBlitzmerker: "Quick Study",
  medalDescBlitzmerker: "Wrote 20 memory words from memory.",
  medalNameZyklusreise: "Cycle Journey",
  medalDescZyklusreise: "Practised in all three cycles.",

  /* ── Round ─────────────────────────────────────────────────────── */
  roundProgress: "Task {i} of {n}",
  roundMixed: "Mixed practice",
  roundRule: "Rule",
  roundStepProgress: "Task {i} of {n}",

  instructionWord: "Which letters are missing?",
  instructionSentence: "Which word fits?",
  instructionPunct: "Which mark fits?",
  instructionMemoryStudy: "Look at the word closely.",
  instructionMemoryWrite: "Write the word from memory.",

  memoryReady: "I know it",
  memoryInputLabel: "Write the word",
  memoryLetters: "{n} letters. Watch the capital letters.",
  memoryAutoHint: "On the last letter you see straight away whether it is right.",
  memoryTyped: "You wrote:",

  optionsLabel: "Choose an answer",
  optionNoComma: "no comma",
  blankLabel: "gap",

  feedbackCorrect: "Correct.",
  feedbackWrong: "Almost. Look at the rule and try again.",
  feedbackWrongAgain: "Almost. Read the rule slowly.",
  feedbackReveal: "This is how it is written. Remember it.",
  solutionLabel: "The right answer is:",

  actionRetry: "Try again",
  actionReveal: "Show the answer",
  actionRevealDone: "Keep practising",
  actionNext: "Next",

  /* ── Round completion ──────────────────────────────────────────── */
  doneTitle: "Round finished!",
  doneMsg: "You got {k} of {n} tasks right straight away.",
  doneAll: "You got all {n} tasks right straight away.",
  doneAgain: "Practise again",
  doneHome: "Back to the overview",
  resultKnown: "knew it",
  resultPracticed: "practised",

  suggestCycle: "This is going really well. Try {cycle}!",
  suggestCycleBtn: "Practise {cycle}",

  /* ── Settings ──────────────────────────────────────────────────── */
  settingsTitle: "Settings",
  settingsLanguage: "Language",
  settingsLanguageHint: "The language of the interface. The practice words stay in the learning language.",
  settingsContent: "Learning language",
  settingsContentHint: "The language whose spelling you practise.",
  settingsCycle: "Cycle",
  settingsCycleHint: "The cycle decides which rules you practise. You can switch at any time.",
  settingsCycleTopics: "{n} rules",

  /* ── Topics: title and rule ────────────────────────────────────── */
  topicNomenGrossTitle: "Nouns take a capital",
  topicNomenGrossRule: "Things you can see or touch are nouns. German writes nouns with a capital letter.",
  topicSatzanfangTitle: "Start of a sentence",
  topicSatzanfangRule: "Every sentence starts with a capital letter.",
  topicSatzschlussPunktTitle: "Full stop and question mark",
  topicSatzschlussPunktRule: "A sentence that tells you something ends with a full stop. A question ends with a question mark.",
  topicMerkwort1Title: "Memory words",
  topicMerkwort1Rule: "You cannot work these words out from a rule. Look closely, then write them from memory.",

  topicSchTitle: "sch",
  topicSchRule: "The sch sound is written with three letters: s, c, h.",
  topicSpStTitle: "sp and st",
  topicSpStRule: "At the start of a word you hear schp and scht, but you write sp and st.",
  topicNgNkTitle: "ng and nk",
  topicNgNkRule: "Say the word slowly. If you hear a k at the end, write nk. Otherwise write ng.",
  topicDoppelkonsonantTitle: "Double consonants",
  topicDoppelkonsonantRule: "When the vowel is spoken short, two identical consonants follow.",
  topicDehnungTitle: "Long vowels",
  topicDehnungRule: "A long vowel is stretched: with ie, with a silent h, or with two identical vowels.",
  topicAbstrakteNomenTitle: "Abstract nouns",
  topicAbstrakteNomenRule: "Words you cannot touch are nouns too. A marker such as der, die, das or viel shows you. Nouns take a capital letter.",
  topicSatzschlussTitle: "End-of-sentence marks",
  topicSatzschlussRule: "A statement ends with a full stop, a question with a question mark, a call or an order with an exclamation mark.",
  topicMerkwort2Title: "Memory words",
  topicMerkwort2Rule: "You cannot work these words out from a rule. Look closely, then write them from memory.",

  topicDasDassTitle: "das and dass",
  topicDasDassRule: "If you can replace it with dieses, jenes or welches, write das with one s. Otherwise write dass.",
  topicNominalisierungTitle: "Verbs used as nouns",
  topicNominalisierungRule: "When a word such as das, beim, zum, etwas, nichts or viel stands in front of a verb or adjective, it becomes a noun and takes a capital letter.",
  topicKommaTitle: "Comma before a subclause",
  topicKommaRule: "A comma stands between a main clause and a subclause. Words such as weil, dass, wenn or obwohl start a subclause. No comma before und when both parts share the same subject.",
  topicEndungTitle: "Endings ig and lich",
  topicEndungRule: "Lengthen the word and you hear the ending: freundlich becomes freundliche, wichtig becomes wichtige.",
  topicFremdwortTitle: "Loan words",
  topicFremdwortRule: "Loan words follow the rules of the language they come from. You have to remember them."
};
