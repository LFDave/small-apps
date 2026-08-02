// it.js — Italian. Mirrors the keys in de.js exactly.

export const it = {
  appTitle: "Nummernfuchs",
  appTagline: "Impara a memoria numeri e codici.",

  /* Home */
  homeMyNumbers: "I miei numeri",
  homeEmpty: "Nessun numero salvato. Aggiungi il primo, per esempio il cellulare della mamma o il codice del portone.",
  homeAdd: "Aggiungi un numero",
  homeStorageNote: "Tutti i numeri restano su questo dispositivo.",
  homeReset: "Azzera tutto",
  resetConfirm: "Cancellare tutti i numeri e i progressi? I dati sono solo su questo dispositivo.",

  /* Random-number training */
  homeTraining: "Numero a caso",
  homeTrainingIntro: "Allenati con un numero a caso. Scegli quanto deve essere lungo.",
  trainingDigits: "{n} cifre",
  trainingFewer: "Meno cifre",
  trainingMore: "Più cifre",
  trainingStart: "Allena un numero a caso",
  trainingTitle: "Numero a caso",
  trainingDoneMsg: "Hai imparato a memoria un numero a caso di {n} cifre.",
  trainingAgain: "Nuovo numero a caso",
  trainingSuggest: "Ti sta riuscendo molto bene. Prova con {n} cifre!",
  trainingSuggestBtn: "Allena {n} cifre",

  /* Emergency section */
  homeEmergency: "Numeri di emergenza",
  homeEmergencyIntro: "Questi numeri valgono {country}. Li sai a memoria?",
  homeEmergencyPractice: "Allena i numeri di emergenza",
  emgGapsTitle: "Cosa manca qui",

  /* Entry status */
  statusNeu: "Nuovo",
  statusGeuebt: "Allenato",
  statusSitzt: "Lo sai!",

  /* Settings */
  settingsTitle: "Impostazioni",
  settingsOpen: "Apri le impostazioni",
  settingsLanguage: "Lingua",
  settingsLanguageHint: "Tutti i testi di Nummernfuchs appaiono in questa lingua.",
  settingsCountry: "Paese",
  settingsCountryHint: "I numeri di emergenza valgono per questo paese. I nuovi numeri di telefono ricevono il suo prefisso.",

  countryCh: "Svizzera",
  countryDe: "Germania",
  countryAt: "Austria",
  countryFr: "Francia",
  countryIt: "Italia",
  countryLi: "Liechtenstein",
  countryNo: "Norvegia",
  countryInCh: "in Svizzera",
  countryInDe: "in Germania",
  countryInAt: "in Austria",
  countryInFr: "in Francia",
  countryInIt: "in Italia",
  countryInLi: "nel Liechtenstein",
  countryInNo: "in Norvegia",

  /* Form */
  formTitleNew: "Nuovo numero",
  formTitleEdit: "Modifica il numero",
  formTypeLabel: "Che tipo di numero è?",
  formTypeCode: "Codice",
  formTypeCodeHint: "Codice del portone, cassetta della posta, lucchetto della bici",
  formTypePhone: "Numero di telefono",
  formTypePhoneHint: "Cellulare o fisso",
  formLabelLabel: "Per chi o per cosa?",
  formLabelPlaceholderCode: "Portone",
  formLabelPlaceholderPhone: "Cellulare mamma",
  formNumberLabel: "Il numero",
  formNumberHint: "Dividilo in gruppi con gli spazi, come lo dici. Per esempio: 640 132",
  formNumberPlaceholderCode: "640 132",
  formNumberPlaceholderPhone: "079 640 13 21",
  formIntlLabel: "Allena anche la forma internazionale",
  formIntlCc: "Prefisso del paese",
  formIntlPreview: "Internazionale:",
  formSave: "Salva",
  formDelete: "Cancella",
  formDeleteConfirm: "Cancellare questo numero? I dati sono solo su questo dispositivo.",
  formBack: "Indietro",
  formEditEntry: "Modifica {label}",

  /* Form errors */
  errLabelEmpty: "Dai un nome al numero, per esempio Cellulare mamma.",
  errLabelLong: "Il nome è troppo lungo. Al massimo 24 caratteri.",
  errNumberEmpty: "Inserisci il numero.",
  errNumberInvalid: "Sono ammessi solo cifre e spazi.",
  errNumberShort: "Il numero è troppo corto. Almeno 3 cifre.",
  errNumberLong: "Il numero è troppo lungo. Al massimo 16 cifre.",
  errChunkLong: "Fai gruppi più piccoli. Al massimo 5 cifre per gruppo.",
  errCcInvalid: "Il prefisso del paese ha bisogno di 1 a 3 cifre.",

  /* Learning ladder */
  ladderStepView: "Guarda bene il numero. Leggilo ad alta voce a gruppi.",
  ladderStepCloze: "Manca un gruppo. Inseriscilo.",
  ladderStepTail: "Adesso manca quasi tutto. Inserisci i gruppi che mancano.",
  ladderStepFull: "E adesso tutto a memoria. Inserisci il numero intero.",
  ladderStepIntlView: "Così componi il numero dall'estero. Guardalo bene.",
  ladderStepIntlFull: "Inserisci il numero internazionale. Comincia con +.",
  ladderStepProgress: "Passo {i} di {n}",
  ladderReady: "Sono pronto",
  ladderNext: "Avanti",
  ladderRetry: "Prova ancora",
  ladderReveal: "Guarda di nuovo il numero",
  ladderRevealMsg: "Guarda bene. Poi prova ancora.",
  ladderRevealDone: "Continua ad allenarti",
  ladderCorrect: "Giusto.",
  ladderWrong: "Quasi. Prova ancora.",
  ladderWrongAgain: "Quasi. Se vuoi, guarda di nuovo il numero.",
  ladderDoneTitle: "Fatto!",
  ladderDoneMsg: "Hai imparato a memoria «{label}».",
  ladderDoneSitzt: "Questo numero adesso lo sai davvero bene.",
  ladderAgain: "Allenati ancora",
  ladderHome: "Al riepilogo",

  /* Quiz */
  quizTitle: "Numeri di emergenza",
  quizQuestion: "Quale numero chiami?",
  quizProgress: "Numero {i} di {n}",
  quizCorrect: "Giusto. {explain}",
  quizWrongCopy: "Quasi. {explain} Inseriscilo ancora una volta per ricordarlo.",
  quizCopyAgain: "Guarda: {number}. Prova ancora.",
  quizDoneTitle: "Bravo!",
  quizDoneMsg: "Hai saputo subito {k} numeri su {n}.",
  quizDoneAll: "Hai saputo tutti i numeri. Forte!",
  quizKnown: "saputo",
  quizPracticed: "allenato",

  /* Pad */
  padBackspace: "Cancella una cifra",
  padAutoHint: "All'ultima cifra vedi subito se è giusto.",
  padLabel: "Tastierino numerico",

  /* Level, XP, medals */
  statsLevel: "Livello {n} · {title}",
  statsXp: "{xp} di {next} XP",
  statsXpMax: "{xp} XP · livello più alto",
  statsMedals: "{k} medaglie su {n}",
  statsOpen: "Guarda livello e medaglie",
  medalsTitle: "Medaglie",
  rewardXp: "+{xp} XP",
  rewardLevelUp: "Nuovo livello: {title}!",
  rewardMedal: "Nuova medaglia: {name}",

  level1: "Volpacchiotto",
  level2: "Volpe furba",
  level3: "Volpe dei numeri",
  level4: "Volpe di memoria",
  level5: "Supervolpe",
  level6: "Volpe maestra",

  medalNameErsteUebung: "Primo esercizio",
  medalDescErsteUebung: "Concludi il tuo primo esercizio.",
  medalNameDreiUebungen: "Volpe diligente",
  medalDescDreiUebungen: "Concludi 3 esercizi.",
  medalNameAchtUebungen: "Volpe da allenamento",
  medalDescAchtUebungen: "Concludi 8 esercizi.",
  medalNameEinundzwanzigUebungen: "Maestro dell'allenamento",
  medalDescEinundzwanzigUebungen: "Concludi 21 esercizi.",
  medalNameSitzt: "Lo sai!",
  medalDescSitzt: "Un numero salvato lo sai davvero bene.",
  medalNameNotrufProfi: "Esperto di emergenze",
  medalDescNotrufProfi: "Sai tutti i numeri di emergenza del tuo paese.",
  medalNameInternational: "Internazionale",
  medalDescInternational: "Impara un numero con il prefisso del paese.",
  medalNameRiesenzahl: "Numero gigante",
  medalDescRiesenzahl: "Riesci con un numero a caso di 10 cifre o più.",
  medalNameTippfuchs: "Volpe da tastiera",
  medalDescTippfuchs: "Inserisci 500 cifre in tutto.",

  /* Emergency numbers: names, situations, explanations */
  emgNameEuro: "Emergenza europea",
  emgSituationEuro: "Il numero di emergenza generale. Funziona in tutta Europa.",
  emgExplainEuro: "{number} è il numero di emergenza in tutta Europa.",

  emgNameItEuro: "Emergenza",
  emgSituationItEuro: "Il numero di emergenza per tutto: polizia, vigili del fuoco e soccorso sanitario.",
  emgExplainItEuro: "{number} raccoglie tutte le chiamate di emergenza in Italia.",

  emgNameDeNotruf: "Vigili del fuoco e soccorso",
  emgSituationDeNotruf: "C'è un incendio, oppure qualcuno è ferito gravemente.",
  emgExplainDeNotruf: "{number} in Germania sono i vigili del fuoco e il soccorso sanitario.",

  emgNamePolice: "Polizia",
  emgSituationPolice: "Hai bisogno della polizia.",
  emgExplainPolice: "{number} è la polizia.",

  emgNameFire: "Vigili del fuoco",
  emgSituationFire: "C'è un incendio.",
  emgExplainFire: "{number} sono i vigili del fuoco.",

  emgNameMedical: "Soccorso sanitario",
  emgSituationMedical: "Qualcuno è ferito e ha bisogno di aiuto in fretta.",
  emgExplainMedical: "{number} è il soccorso sanitario.",

  emgNameDeDoctor: "Servizio medico di guardia",
  emgSituationDeDoctor: "Qualcuno ha bisogno di un medico, ma non è in pericolo di vita.",
  emgExplainDeDoctor: "{number} è il servizio medico di guardia.",

  emgNameToxCh: "Tox Info",
  emgSituationToxCh: "Qualcuno ha ingoiato qualcosa di velenoso.",
  emgExplainToxCh: "{number} è Tox Info Suisse. Aiuta in caso di avvelenamento.",

  emgNameToxLi: "Tox Info",
  emgSituationToxLi: "Qualcuno ha ingoiato qualcosa di velenoso.",
  emgExplainToxLi: "{number} è Tox Info Suisse. Aiuta anche in Liechtenstein in caso di avvelenamento.",

  emgNameRega: "Rega",
  emgSituationRega: "Qualcuno ha bisogno di aiuto in montagna.",
  emgExplainRega: "{number} è la Rega, il soccorso dall'aria.",

  emgNameAtRescue: "Soccorso alpino",
  emgSituationAtRescue: "Qualcuno ha bisogno di aiuto in montagna.",
  emgExplainAtRescue: "{number} è il soccorso alpino.",

  emgNameNoLegevakt: "Legevakt",
  emgSituationNoLegevakt: "Qualcuno è malato e ha bisogno di un medico oggi stesso.",
  emgExplainNoLegevakt: "{number} è la Legevakt, il servizio medico di guardia.",

  emgNameNoSeaRescue: "Soccorso in mare",
  emgSituationNoSeaRescue: "Qualcuno ha bisogno di aiuto sull'acqua.",
  emgExplainNoSeaRescue: "{number} è la radio costiera. Manda i soccorsi in mare.",

  /* Gaps: services this country has no short number for */
  gapDePoison: "In Germania non c'è un numero valido in tutto il paese per gli avvelenamenti. Ogni Land ha il suo centro antiveleni. Se c'è pericolo di vita, chiama il 112.",
  gapDeRescue: "In Germania non c'è un numero proprio per il soccorso alpino. Lo raggiungi con il 112.",
  gapAtPoison: "In Austria non c'è un numero di emergenza corto per gli avvelenamenti. Il centro di informazione tossicologica di Vienna ha il numero 01 406 43 43.",
  gapFrPoison: "In Francia non c'è un numero valido in tutto il paese per gli avvelenamenti. Ogni regione ha il suo Centre antipoison. Se c'è pericolo di vita, chiama il 15 o il 112.",
  gapFrRescue: "In Francia non c'è un numero proprio per il soccorso alpino. Lo raggiungi con il 112.",
  gapItPoison: "In Italia non c'è un numero valido in tutto il paese per gli avvelenamenti. Ogni regione ha il suo Centro antiveleni. Se c'è pericolo di vita, chiama il 112.",
  gapItRescue: "In Italia non c'è un numero proprio per il soccorso alpino. Lo raggiungi con il 112.",
  gapNoPoison: "In Norvegia non c'è un numero di emergenza corto per gli avvelenamenti. La Giftinformasjonen ha il numero 22 59 13 00.",
  gapNoRescue: "In Norvegia non c'è un numero proprio per il soccorso alpino. Lo raggiungi con il 112.",

  /* Country notes */
  noteIt: "In Italia il 112 raccoglie tutte le chiamate di emergenza. I vecchi numeri 113, 115 e 118 funzionano ancora.",
  noteLi: "Il Liechtenstein usa gli stessi numeri di emergenza della Svizzera.",
  noteNo: "In Norvegia il 112 è la polizia e allo stesso tempo il numero di emergenza di tutta l'Europa."
};
