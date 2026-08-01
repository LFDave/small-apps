// en.js — English. Mirrors the keys in de.js exactly.

export const en = {
  appTitle: "Nummernfuchs",
  appTagline: "Learn numbers and codes by heart.",

  /* Home */
  homeMyNumbers: "My numbers",
  homeEmpty: "No numbers saved yet. Add the first one, for example your mum's mobile number or the code for the front door.",
  homeAdd: "Add a number",
  homeStorageNote: "All numbers stay on this device.",
  homeReset: "Reset everything",
  resetConfirm: "Delete all numbers and progress? The data is only on this device.",

  /* Random-number training */
  homeTraining: "Random number",
  homeTrainingIntro: "Practise with a random number. Choose how long it should be.",
  trainingDigits: "{n} digits",
  trainingFewer: "Fewer digits",
  trainingMore: "More digits",
  trainingStart: "Practise a random number",
  trainingTitle: "Random number",
  trainingDoneMsg: "You memorised a random number with {n} digits.",
  trainingAgain: "New random number",
  trainingSuggest: "That is going really well. Try it with {n} digits!",
  trainingSuggestBtn: "Practise with {n} digits",

  /* Emergency section */
  homeEmergency: "Emergency numbers",
  homeEmergencyIntro: "These numbers apply {country}. Do you know them by heart?",
  homeEmergencyPractice: "Practise emergency numbers",
  emgGapsTitle: "What is missing here",

  /* Entry status */
  statusNeu: "New",
  statusGeuebt: "Practised",
  statusSitzt: "Got it!",

  /* Settings */
  settingsTitle: "Settings",
  settingsOpen: "Open settings",
  settingsLanguage: "Language",
  settingsLanguageHint: "All text in Nummernfuchs appears in this language.",
  settingsCountry: "Country",
  settingsCountryHint: "The emergency numbers apply to this country. New phone numbers get its dialling code.",

  countryCh: "Switzerland",
  countryDe: "Germany",
  countryAt: "Austria",
  countryFr: "France",
  countryIt: "Italy",
  countryLi: "Liechtenstein",
  countryInCh: "in Switzerland",
  countryInDe: "in Germany",
  countryInAt: "in Austria",
  countryInFr: "in France",
  countryInIt: "in Italy",
  countryInLi: "in Liechtenstein",

  /* Form */
  formTitleNew: "New number",
  formTitleEdit: "Edit number",
  formTypeLabel: "What kind of number is it?",
  formTypeCode: "Code",
  formTypeCodeHint: "Door code, letterbox, bike lock",
  formTypePhone: "Phone number",
  formTypePhoneHint: "Mobile or landline",
  formLabelLabel: "Who or what is it for?",
  formLabelPlaceholderCode: "Front door",
  formLabelPlaceholderPhone: "Mum mobile",
  formNumberLabel: "The number",
  formNumberHint: "Use spaces to split it into groups, the way you say it. For example: 640 132",
  formNumberPlaceholderCode: "640 132",
  formNumberPlaceholderPhone: "079 640 13 21",
  formIntlLabel: "Practise the international form too",
  formIntlCc: "Dialling code",
  formIntlPreview: "International:",
  formSave: "Save",
  formDelete: "Delete",
  formDeleteConfirm: "Delete this number? The data is only on this device.",
  formBack: "Back",
  formEditEntry: "Edit {label}",

  /* Form errors */
  errLabelEmpty: "Give the number a name, for example Mum mobile.",
  errLabelLong: "The name is too long. 24 characters at most.",
  errNumberEmpty: "Enter the number.",
  errNumberInvalid: "Only digits and spaces are allowed.",
  errNumberShort: "The number is too short. At least 3 digits.",
  errNumberLong: "The number is too long. 16 digits at most.",
  errChunkLong: "Make smaller groups. 5 digits per group at most.",
  errCcInvalid: "The dialling code needs 1 to 3 digits.",

  /* Learning ladder */
  ladderStepView: "Look at the number carefully. Read it out loud in groups.",
  ladderStepCloze: "One group is missing. Type it in.",
  ladderStepTail: "Now almost everything is missing. Type in the missing groups.",
  ladderStepFull: "And now all from memory. Type in the whole number.",
  ladderStepIntlView: "This is how you dial the number from abroad. Look at it carefully.",
  ladderStepIntlFull: "Type in the international number. It starts with +.",
  ladderStepProgress: "Step {i} of {n}",
  ladderReady: "I am ready",
  ladderNext: "Next",
  ladderRetry: "Try again",
  ladderReveal: "Look at the number again",
  ladderRevealMsg: "Look closely. Then try again.",
  ladderRevealDone: "Keep practising",
  ladderCorrect: "Correct.",
  ladderWrong: "Almost. Try again.",
  ladderWrongAgain: "Almost. Look at the number again if you like.",
  ladderDoneTitle: "Done!",
  ladderDoneMsg: "You memorised «{label}».",
  ladderDoneSitzt: "You really know this number now.",
  ladderAgain: "Practise again",
  ladderHome: "Back to the overview",

  /* Quiz */
  quizTitle: "Emergency numbers",
  quizQuestion: "Which number do you call?",
  quizProgress: "Number {i} of {n}",
  quizCorrect: "Correct. {explain}",
  quizWrongCopy: "Almost. {explain} Type it in once more to remember it.",
  quizCopyAgain: "Look: {number}. Try again.",
  quizDoneTitle: "Well done!",
  quizDoneMsg: "You knew {k} of {n} numbers straight away.",
  quizDoneAll: "You knew every number. Strong!",
  quizKnown: "knew it",
  quizPracticed: "practised",

  /* Pad */
  padBackspace: "Delete digit",
  padAutoHint: "On the last digit you see straight away whether it is right.",
  padLabel: "Number pad",

  /* Level, XP, medals */
  statsLevel: "Level {n} · {title}",
  statsXp: "{xp} of {next} XP",
  statsXpMax: "{xp} XP · highest level",
  statsMedals: "{k} of {n} medals",
  statsOpen: "View level and medals",
  medalsTitle: "Medals",
  rewardXp: "+{xp} XP",
  rewardLevelUp: "New level: {title}!",
  rewardMedal: "New medal: {name}",

  level1: "Fox Cub",
  level2: "Clever Fox",
  level3: "Number Fox",
  level4: "Memory Fox",
  level5: "Super Fox",
  level6: "Master Fox",

  medalNameErsteUebung: "First exercise",
  medalDescErsteUebung: "Finish your first exercise.",
  medalNameDreiUebungen: "Busy Fox",
  medalDescDreiUebungen: "Finish 3 exercises.",
  medalNameAchtUebungen: "Practice Fox",
  medalDescAchtUebungen: "Finish 8 exercises.",
  medalNameEinundzwanzigUebungen: "Training Master",
  medalDescEinundzwanzigUebungen: "Finish 21 exercises.",
  medalNameSitzt: "Got it!",
  medalDescSitzt: "You really know one of your saved numbers.",
  medalNameNotrufProfi: "Emergency Pro",
  medalDescNotrufProfi: "You know every emergency number of your country.",
  medalNameInternational: "International",
  medalDescInternational: "Learn a number with a dialling code.",
  medalNameRiesenzahl: "Giant Number",
  medalDescRiesenzahl: "Manage a random number with 10 digits or more.",
  medalNameTippfuchs: "Typing Fox",
  medalDescTippfuchs: "Type 500 digits in total.",

  /* Emergency numbers: names, situations, explanations */
  emgNameEuro: "European emergency",
  emgSituationEuro: "The general emergency number. It works all over Europe.",
  emgExplainEuro: "{number} is the emergency number all over Europe.",

  emgNameItEuro: "Emergency",
  emgSituationItEuro: "The emergency number for everything: police, fire brigade and ambulance.",
  emgExplainItEuro: "{number} brings all emergency calls in Italy together.",

  emgNameDeNotruf: "Fire brigade and ambulance",
  emgSituationDeNotruf: "There is a fire, or someone is badly hurt.",
  emgExplainDeNotruf: "{number} is the fire brigade and the ambulance service in Germany.",

  emgNamePolice: "Police",
  emgSituationPolice: "You need the police.",
  emgExplainPolice: "{number} is the police.",

  emgNameFire: "Fire brigade",
  emgSituationFire: "There is a fire.",
  emgExplainFire: "{number} is the fire brigade.",

  emgNameMedical: "Ambulance",
  emgSituationMedical: "Someone is hurt and needs help quickly.",
  emgExplainMedical: "{number} is the ambulance service.",

  emgNameDeDoctor: "On-call medical service",
  emgSituationDeDoctor: "Someone needs a doctor, but it is not life-threatening.",
  emgExplainDeDoctor: "{number} is the on-call medical service.",

  emgNameToxCh: "Tox Info",
  emgSituationToxCh: "Someone swallowed something poisonous.",
  emgExplainToxCh: "{number} is Tox Info Suisse. It helps with poisoning.",

  emgNameToxLi: "Tox Info",
  emgSituationToxLi: "Someone swallowed something poisonous.",
  emgExplainToxLi: "{number} is Tox Info Suisse. It helps with poisoning in Liechtenstein too.",

  emgNameRega: "Rega",
  emgSituationRega: "Someone needs help in the mountains.",
  emgExplainRega: "{number} is Rega, the rescue service from the air.",

  emgNameAtRescue: "Mountain rescue",
  emgSituationAtRescue: "Someone needs help in the mountains.",
  emgExplainAtRescue: "{number} is the mountain rescue service.",

  /* Gaps: services this country has no short number for */
  gapDePoison: "Germany has no nationwide number for poisoning. Each federal state runs its own poison centre. If life is in danger, call 112.",
  gapDeRescue: "Germany has no separate number for mountain rescue. You reach it through 112.",
  gapAtPoison: "Austria has no short emergency number for poisoning. The poison information centre in Vienna has the number 01 406 43 43.",
  gapFrPoison: "France has no nationwide number for poisoning. Each region has its own Centre antipoison. If life is in danger, call 15 or 112.",
  gapFrRescue: "France has no separate number for mountain rescue. You reach it through 112.",
  gapItPoison: "Italy has no nationwide number for poisoning. Each region has its own Centro antiveleni. If life is in danger, call 112.",
  gapItRescue: "Italy has no separate number for mountain rescue. You reach it through 112.",

  /* Country notes */
  noteIt: "In Italy 112 brings all emergency calls together. The older numbers 113, 115 and 118 still work.",
  noteLi: "Liechtenstein uses the same emergency numbers as Switzerland."
};
