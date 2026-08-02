// de.js — German (Swiss standard German, ss never ß). The reference
// table: every other language mirrors these keys exactly, and German is
// the fallback when a key is missing anywhere else.

export const de = {
  appTitle: "Nummernfuchs",
  appTagline: "Merk dir Nummern und Codes.",

  /* Home */
  homeMyNumbers: "Meine Nummern",
  homeEmpty: "Noch keine Nummern gespeichert. Füge die erste hinzu, zum Beispiel Mamis Handynummer oder den Code der Haustür.",
  homeAdd: "Nummer hinzufügen",
  homeStorageNote: "Alle Nummern bleiben auf diesem Gerät.",
  homeReset: "Alles zurücksetzen",
  resetConfirm: "Alle Nummern und Fortschritte löschen? Die Daten liegen nur auf diesem Gerät.",

  /* Random-number training */
  homeTraining: "Zufallszahl",
  homeTrainingIntro: "Übe mit einer zufälligen Zahl. Wähle, wie lang sie sein soll.",
  trainingDigits: "{n} Ziffern",
  trainingFewer: "Weniger Ziffern",
  trainingMore: "Mehr Ziffern",
  trainingStart: "Zufallszahl üben",
  trainingTitle: "Zufallszahl",
  trainingDoneMsg: "Du hast dir eine Zufallszahl mit {n} Ziffern gemerkt.",
  trainingAgain: "Neue Zufallszahl",
  trainingSuggest: "Das klappt richtig gut. Probier es mit {n} Ziffern!",
  trainingSuggestBtn: "Mit {n} Ziffern üben",

  /* Emergency section */
  homeEmergency: "Notfallnummern",
  homeEmergencyIntro: "Diese Nummern gelten {country}. Kennst du sie auswendig?",
  homeEmergencyPractice: "Notfallnummern üben",
  emgGapsTitle: "Was hier fehlt",

  /* Entry status */
  statusNeu: "Neu",
  statusGeuebt: "Geübt",
  statusSitzt: "Sitzt!",

  /* Settings */
  settingsTitle: "Einstellungen",
  settingsOpen: "Einstellungen öffnen",
  settingsLanguage: "Sprache",
  settingsLanguageHint: "Alle Texte im Nummernfuchs erscheinen in dieser Sprache.",
  settingsCountry: "Land",
  settingsCountryHint: "Die Notfallnummern gelten für dieses Land. Neue Telefonnummern bekommen seine Landesvorwahl.",

  countryCh: "Schweiz",
  countryDe: "Deutschland",
  countryAt: "Österreich",
  countryFr: "Frankreich",
  countryIt: "Italien",
  countryLi: "Liechtenstein",
  countryNo: "Norwegen",
  countryInCh: "in der Schweiz",
  countryInDe: "in Deutschland",
  countryInAt: "in Österreich",
  countryInFr: "in Frankreich",
  countryInIt: "in Italien",
  countryInLi: "in Liechtenstein",
  countryInNo: "in Norwegen",

  /* Form */
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
  formEditEntry: "{label} bearbeiten",

  /* Form errors */
  errLabelEmpty: "Gib der Nummer einen Namen, zum Beispiel Mami Handy.",
  errLabelLong: "Der Name ist zu lang. Höchstens 24 Zeichen.",
  errNumberEmpty: "Gib die Nummer ein.",
  errNumberInvalid: "Nur Ziffern und Leerzeichen sind erlaubt.",
  errNumberShort: "Die Nummer ist zu kurz. Mindestens 3 Ziffern.",
  errNumberLong: "Die Nummer ist zu lang. Höchstens 16 Ziffern.",
  errChunkLong: "Mach kleinere Gruppen. Höchstens 5 Ziffern pro Gruppe.",
  errCcInvalid: "Die Landesvorwahl braucht 1 bis 3 Ziffern.",

  /* Learning ladder */
  ladderStepView: "Schau dir die Nummer gut an. Lies sie laut in Gruppen.",
  ladderStepCloze: "Eine Gruppe fehlt. Tipp sie ein.",
  ladderStepTail: "Jetzt fehlt fast alles. Tipp die fehlenden Gruppen ein.",
  ladderStepFull: "Und jetzt ganz aus dem Kopf. Tipp die ganze Nummer ein.",
  ladderStepIntlView: "So wählst du die Nummer aus dem Ausland. Schau sie dir gut an.",
  ladderStepIntlFull: "Tipp die internationale Nummer ein. Sie beginnt mit +.",
  ladderStepProgress: "Schritt {i} von {n}",
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

  /* Quiz */
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

  /* Pad */
  padBackspace: "Ziffer löschen",
  padAutoHint: "Bei der letzten Ziffer siehst du sofort, ob es stimmt.",
  padLabel: "Zahlenfeld",

  /* Level, XP, medals */
  statsLevel: "Level {n} · {title}",
  statsXp: "{xp} von {next} XP",
  statsXpMax: "{xp} XP · höchstes Level",
  statsMedals: "{k} von {n} Medaillen",
  statsOpen: "Level und Medaillen ansehen",
  medalsTitle: "Medaillen",
  rewardXp: "+{xp} XP",
  rewardLevelUp: "Neues Level: {title}!",
  rewardMedal: "Neue Medaille: {name}",

  level1: "Fuchswelpe",
  level2: "Schlaufuchs",
  level3: "Zahlenfuchs",
  level4: "Merkfuchs",
  level5: "Superfuchs",
  level6: "Meisterfuchs",

  medalNameErsteUebung: "Erste Übung",
  medalDescErsteUebung: "Schliesse deine erste Übung ab.",
  medalNameDreiUebungen: "Fleissiger Fuchs",
  medalDescDreiUebungen: "Schliesse 3 Übungen ab.",
  medalNameAchtUebungen: "Übungsfuchs",
  medalDescAchtUebungen: "Schliesse 8 Übungen ab.",
  medalNameEinundzwanzigUebungen: "Trainingsmeister",
  medalDescEinundzwanzigUebungen: "Schliesse 21 Übungen ab.",
  medalNameSitzt: "Sitzt!",
  medalDescSitzt: "Eine gespeicherte Nummer sitzt richtig gut.",
  medalNameNotrufProfi: "Notruf-Profi",
  medalDescNotrufProfi: "Alle Notfallnummern deines Landes sitzen.",
  medalNameInternational: "International",
  medalDescInternational: "Lerne eine Nummer mit Landesvorwahl.",
  medalNameRiesenzahl: "Riesenzahl",
  medalDescRiesenzahl: "Schaffe eine Zufallszahl mit 10 oder mehr Ziffern.",
  medalNameTippfuchs: "Tippfuchs",
  medalDescTippfuchs: "Tippe insgesamt 500 Ziffern.",

  /* Emergency numbers: names, situations, explanations */
  emgNameEuro: "Notruf Europa",
  emgSituationEuro: "Der allgemeine Notruf. Er funktioniert in ganz Europa.",
  emgExplainEuro: "{number} ist der Notruf in ganz Europa.",

  emgNameItEuro: "Notruf",
  emgSituationItEuro: "Der Notruf für alles: Polizei, Feuerwehr und Sanität.",
  emgExplainItEuro: "{number} führt in Italien alle Notrufe zusammen.",

  emgNameDeNotruf: "Feuerwehr und Rettungsdienst",
  emgSituationDeNotruf: "Es brennt, oder jemand ist schwer verletzt.",
  emgExplainDeNotruf: "{number} ist in Deutschland die Feuerwehr und der Rettungsdienst.",

  emgNamePolice: "Polizei",
  emgSituationPolice: "Du brauchst die Polizei.",
  emgExplainPolice: "{number} ist die Polizei.",

  emgNameFire: "Feuerwehr",
  emgSituationFire: "Es brennt.",
  emgExplainFire: "{number} ist die Feuerwehr.",

  emgNameMedical: "Sanität",
  emgSituationMedical: "Jemand ist verletzt und braucht schnell Hilfe.",
  emgExplainMedical: "{number} ist die Sanität.",

  emgNameDeDoctor: "Ärztlicher Bereitschaftsdienst",
  emgSituationDeDoctor: "Jemand braucht eine Ärztin, aber es ist kein Notfall auf Leben und Tod.",
  emgExplainDeDoctor: "{number} ist der ärztliche Bereitschaftsdienst.",

  emgNameToxCh: "Tox Info",
  emgSituationToxCh: "Jemand hat etwas Giftiges geschluckt.",
  emgExplainToxCh: "{number} ist Tox Info Suisse. Sie hilft bei Vergiftungen.",

  emgNameToxLi: "Tox Info",
  emgSituationToxLi: "Jemand hat etwas Giftiges geschluckt.",
  emgExplainToxLi: "{number} ist Tox Info Suisse. Sie hilft auch in Liechtenstein bei Vergiftungen.",

  emgNameRega: "Rega",
  emgSituationRega: "Jemand braucht Hilfe in den Bergen.",
  emgExplainRega: "{number} ist die Rega, die Rettung aus der Luft.",

  emgNameAtRescue: "Bergrettung",
  emgSituationAtRescue: "Jemand braucht Hilfe in den Bergen.",
  emgExplainAtRescue: "{number} ist die Bergrettung.",

  emgNameNoLegevakt: "Legevakt",
  emgSituationNoLegevakt: "Jemand ist krank und braucht heute noch eine Ärztin.",
  emgExplainNoLegevakt: "{number} ist die Legevakt, der ärztliche Notdienst.",

  emgNameNoSeaRescue: "Seenot",
  emgSituationNoSeaRescue: "Jemand braucht Hilfe auf dem Wasser.",
  emgExplainNoSeaRescue: "{number} ist die Küstenfunkstelle. Sie holt Hilfe aufs Meer.",

  /* Gaps: services this country has no short number for */
  gapDePoison: "Für Vergiftungen gibt es in Deutschland keine bundesweite Nummer. Jedes Bundesland hat einen eigenen Giftnotruf. Bei Lebensgefahr wählst du 112.",
  gapDeRescue: "Für die Bergrettung gibt es in Deutschland keine eigene Nummer. Du erreichst sie über 112.",
  gapAtPoison: "Für Vergiftungen gibt es in Österreich keine kurze Notrufnummer. Die Vergiftungsinformationszentrale in Wien hat die Nummer 01 406 43 43.",
  gapFrPoison: "Für Vergiftungen gibt es in Frankreich keine landesweite Nummer. Jede Region hat ein eigenes Centre antipoison. Bei Lebensgefahr wählst du 15 oder 112.",
  gapFrRescue: "Für die Bergrettung gibt es in Frankreich keine eigene Nummer. Du erreichst sie über 112.",
  gapItPoison: "Für Vergiftungen gibt es in Italien keine landesweite Nummer. Jede Region hat ein eigenes Centro antiveleni. Bei Lebensgefahr wählst du 112.",
  gapItRescue: "Für die Bergrettung gibt es in Italien keine eigene Nummer. Du erreichst sie über 112.",
  gapNoPoison: "Für Vergiftungen gibt es in Norwegen keine kurze Notrufnummer. Die Giftinformasjonen hat die Nummer 22 59 13 00.",
  gapNoRescue: "Für die Bergrettung gibt es in Norwegen keine eigene Nummer. Du erreichst sie über 112.",

  /* Country notes */
  noteIt: "In Italien führt 112 alle Notrufe zusammen. Die alten Nummern 113, 115 und 118 funktionieren weiterhin.",
  noteLi: "Liechtenstein nutzt dieselben Notfallnummern wie die Schweiz.",
  noteNo: "In Norwegen ist 112 die Polizei und zugleich der Notruf für ganz Europa."
};
