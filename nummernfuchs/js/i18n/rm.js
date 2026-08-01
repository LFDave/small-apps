// rm.js — Rumantsch Grischun. Mirrors the keys in de.js exactly.
//
// Note for reviewers: this table was written without a native speaker.
// It is complete and consistent, but the wording should be checked by
// someone who writes Rumantsch Grischun daily before it is presented
// as final. See PRD.md.

export const rm = {
  appTitle: "Nummernfuchs",
  appTagline: "Emprenda numers e codes per cor.",

  /* Home */
  homeMyNumbers: "Mes numers",
  homeEmpty: "Anc nagins numers memorisads. Agiuntescha il emprim, per exempel il telefonin da la mamma u il code da la porta da chasa.",
  homeAdd: "Agiuntar in numer",
  homeStorageNote: "Tut ils numers restan sin quest apparat.",
  homeReset: "Reinizialisar tut",
  resetConfirm: "Stizzar tut ils numers e tut ils progress? Las datas èn mo sin quest apparat.",

  /* Random-number training */
  homeTraining: "Numer casual",
  homeTrainingIntro: "Exercitescha cun in numer casual. Tscherna quant lung ch'el duai esser.",
  trainingDigits: "{n} cifras",
  trainingFewer: "Damain cifras",
  trainingMore: "Dapli cifras",
  trainingStart: "Exercitar in numer casual",
  trainingTitle: "Numer casual",
  trainingDoneMsg: "Ti has memorisà in numer casual cun {n} cifras.",
  trainingAgain: "Nov numer casual",
  trainingSuggest: "Quai va fitg bain. Emprova cun {n} cifras!",
  trainingSuggestBtn: "Exercitar cun {n} cifras",

  /* Emergency section */
  homeEmergency: "Numers d'urgenza",
  homeEmergencyIntro: "Quests numers valan {country}. Enconuschas ti els per cor?",
  homeEmergencyPractice: "Exercitar ils numers d'urgenza",
  emgGapsTitle: "Tge che manca qua",

  /* Entry status */
  statusNeu: "Nov",
  statusGeuebt: "Exercità",
  statusSitzt: "Ti sas el!",

  /* Settings */
  settingsTitle: "Configuraziuns",
  settingsOpen: "Avrir las configuraziuns",
  settingsLanguage: "Lingua",
  settingsLanguageHint: "Tut ils texts en il Nummernfuchs cumparan en questa lingua.",
  settingsCountry: "Pajais",
  settingsCountryHint: "Ils numers d'urgenza valan per quest pajais. Novs numers da telefon survegnan ses prefix.",

  countryCh: "Svizra",
  countryDe: "Germania",
  countryAt: "Austria",
  countryFr: "Frantscha",
  countryIt: "Italia",
  countryLi: "Liechtenstein",
  countryInCh: "en Svizra",
  countryInDe: "en Germania",
  countryInAt: "en Austria",
  countryInFr: "en Frantscha",
  countryInIt: "en Italia",
  countryInLi: "en Liechtenstein",

  /* Form */
  formTitleNew: "Nov numer",
  formTitleEdit: "Modifitgar il numer",
  formTypeLabel: "Tge sort da numer è quai?",
  formTypeCode: "Code",
  formTypeCodeHint: "Code da la porta, chascha da brevs, serradira da velo",
  formTypePhone: "Numer da telefon",
  formTypePhoneHint: "Telefonin u telefon fix",
  formLabelLabel: "Per tgi u per tge?",
  formLabelPlaceholderCode: "Porta da chasa",
  formLabelPlaceholderPhone: "Telefonin mamma",
  formNumberLabel: "Il numer",
  formNumberHint: "Parta el en gruppas cun spazis, uschia sco ti il dis. Per exempel: 640 132",
  formNumberPlaceholderCode: "640 132",
  formNumberPlaceholderPhone: "079 640 13 21",
  formIntlLabel: "Exercitar era la furma internaziunala",
  formIntlCc: "Prefix dal pajais",
  formIntlPreview: "Internaziunal:",
  formSave: "Memorisar",
  formDelete: "Stizzar",
  formDeleteConfirm: "Stizzar quest numer? Las datas èn mo sin quest apparat.",
  formBack: "Enavos",
  formEditEntry: "Modifitgar {label}",

  /* Form errors */
  errLabelEmpty: "Dà in num al numer, per exempel Telefonin mamma.",
  errLabelLong: "Il num è memia lung. Al pli 24 caracters.",
  errNumberEmpty: "Endatescha il numer.",
  errNumberInvalid: "Mo cifras e spazis èn permess.",
  errNumberShort: "Il numer è memia curt. Almain 3 cifras.",
  errNumberLong: "Il numer è memia lung. Al pli 16 cifras.",
  errChunkLong: "Fa gruppas pli pitschnas. Al pli 5 cifras per gruppa.",
  errCcInvalid: "Il prefix dal pajais dovra 1 fin 3 cifras.",

  /* Learning ladder */
  ladderStepView: "Guarda bain il numer. Legia el ad auta vusch en gruppas.",
  ladderStepCloze: "Ina gruppa manca. Endatescha ella.",
  ladderStepTail: "Ussa manca quasi tut. Endatescha las gruppas che mancan.",
  ladderStepFull: "Ed ussa tut ord il chau. Endatescha l'entir numer.",
  ladderStepIntlView: "Uschia telefoneschas ti al numer da l'exteriur. Guarda bain el.",
  ladderStepIntlFull: "Endatescha il numer internaziunal. El cumenza cun +.",
  ladderStepProgress: "Pass {i} da {n}",
  ladderReady: "Jau sun pront",
  ladderNext: "Enavant",
  ladderRetry: "Empruvar anc ina giada",
  ladderReveal: "Guardar anc ina giada il numer",
  ladderRevealMsg: "Guarda exact. Lura emprova anc ina giada.",
  ladderRevealDone: "Cuntinuar ad exercitar",
  ladderCorrect: "Correct.",
  ladderWrong: "Quasi. Emprova anc ina giada.",
  ladderWrongAgain: "Quasi. Guarda anc ina giada il numer, sche ti vuls.",
  ladderDoneTitle: "Reussì!",
  ladderDoneMsg: "Ti has memorisà «{label}».",
  ladderDoneSitzt: "Quest numer sas ti ussa propi bain.",
  ladderAgain: "Exercitar anc ina giada",
  ladderHome: "A la survista",

  /* Quiz */
  quizTitle: "Numers d'urgenza",
  quizQuestion: "Tge numer clamas ti?",
  quizProgress: "Numer {i} da {n}",
  quizCorrect: "Correct. {explain}",
  quizWrongCopy: "Quasi. {explain} Endatescha el anc ina giada per al memorisar.",
  quizCopyAgain: "Guarda: {number}. Emprova anc ina giada.",
  quizDoneTitle: "Ben fatg!",
  quizDoneMsg: "{k} da {n} numers has ti savì directamain.",
  quizDoneAll: "Ti has savì tut ils numers. Ferm!",
  quizKnown: "savì",
  quizPracticed: "exercità",

  /* Pad */
  padBackspace: "Stizzar ina cifra",
  padAutoHint: "Cun l'ultima cifra vesas ti immediatamain sche quai è correct.",
  padLabel: "Tastatura da cifras",

  /* Level, XP, medals */
  statsLevel: "Nivel {n} · {title}",
  statsXp: "{xp} da {next} XP",
  statsXpMax: "{xp} XP · nivel il pli aut",
  statsMedals: "{k} da {n} medaglias",
  statsOpen: "Guardar nivel e medaglias",
  medalsTitle: "Medaglias",
  rewardXp: "+{xp} XP",
  rewardLevelUp: "Nov nivel: {title}!",
  rewardMedal: "Nova medaglia: {name}",

  level1: "Vulpin",
  level2: "Vulp astuta",
  level3: "Vulp da cifras",
  level4: "Vulp da memoria",
  level5: "Supervulp",
  level6: "Vulp maestra",

  medalNameErsteUebung: "Emprim exercizi",
  medalDescErsteUebung: "Finescha tes emprim exercizi.",
  medalNameDreiUebungen: "Vulp diligenta",
  medalDescDreiUebungen: "Finescha 3 exercizis.",
  medalNameAchtUebungen: "Vulp d'exercizi",
  medalDescAchtUebungen: "Finescha 8 exercizis.",
  medalNameEinundzwanzigUebungen: "Meister da l'exercizi",
  medalDescEinundzwanzigUebungen: "Finescha 21 exercizis.",
  medalNameSitzt: "Ti sas el!",
  medalDescSitzt: "In numer memorisà sas ti propi bain.",
  medalNameNotrufProfi: "Profi da l'urgenza",
  medalDescNotrufProfi: "Ti sas tut ils numers d'urgenza da tes pajais.",
  medalNameInternational: "Internaziunal",
  medalDescInternational: "Emprenda in numer cun il prefix dal pajais.",
  medalNameRiesenzahl: "Numer gigantic",
  medalDescRiesenzahl: "Reussescha in numer casual cun 10 u dapli cifras.",
  medalNameTippfuchs: "Vulp da tastatura",
  medalDescTippfuchs: "Endatescha en tut 500 cifras.",

  /* Emergency numbers: names, situations, explanations */
  emgNameEuro: "Urgenza europeica",
  emgSituationEuro: "Il numer d'urgenza general. El funcziuna en tuta l'Europa.",
  emgExplainEuro: "{number} è il numer d'urgenza en tuta l'Europa.",

  emgNameItEuro: "Urgenza",
  emgSituationItEuro: "Il numer d'urgenza per tut: polizia, pumpiers e sanitad.",
  emgExplainItEuro: "{number} unescha en Italia tut las clamadas d'urgenza.",

  emgNameDeNotruf: "Pumpiers e sanitad",
  emgSituationDeNotruf: "I brischa, u insatgi è blessà grevamain.",
  emgExplainDeNotruf: "{number} èn en Germania ils pumpiers e la sanitad.",

  emgNamePolice: "Polizia",
  emgSituationPolice: "Ti dovras la polizia.",
  emgExplainPolice: "{number} è la polizia.",

  emgNameFire: "Pumpiers",
  emgSituationFire: "I brischa.",
  emgExplainFire: "{number} èn ils pumpiers.",

  emgNameMedical: "Sanitad",
  emgSituationMedical: "Insatgi è blessà e dovra svelt agid.",
  emgExplainMedical: "{number} è la sanitad.",

  emgNameDeDoctor: "Servetsch medicinal da pichet",
  emgSituationDeDoctor: "Insatgi dovra in medi, ma i n'è betg privel da mort.",
  emgExplainDeDoctor: "{number} è il servetsch medicinal da pichet.",

  emgNameToxCh: "Tox Info",
  emgSituationToxCh: "Insatgi ha engulà insatge tissientus.",
  emgExplainToxCh: "{number} è Tox Info Suisse. Ella gida en cas d'intoxicaziun.",

  emgNameToxLi: "Tox Info",
  emgSituationToxLi: "Insatgi ha engulà insatge tissientus.",
  emgExplainToxLi: "{number} è Tox Info Suisse. Ella gida era en Liechtenstein en cas d'intoxicaziun.",

  emgNameRega: "Rega",
  emgSituationRega: "Insatgi dovra agid en las muntognas.",
  emgExplainRega: "{number} è la Rega, il salvament da l'aria.",

  emgNameAtRescue: "Salvament da muntogna",
  emgSituationAtRescue: "Insatgi dovra agid en las muntognas.",
  emgExplainAtRescue: "{number} è il salvament da muntogna.",

  /* Gaps: services this country has no short number for */
  gapDePoison: "En Germania n'exista nagin numer valaivel en tut il pajais per intoxicaziuns. Mintga Land ha ses agen center da tissis. En cas da privel da mort clamas ti 112.",
  gapDeRescue: "En Germania n'exista nagin agen numer per il salvament da muntogna. Ti al cuntanschas via 112.",
  gapAtPoison: "En Austria n'exista nagin curt numer d'urgenza per intoxicaziuns. Il center d'infurmaziun da tissis a Vienna ha il numer 01 406 43 43.",
  gapFrPoison: "En Frantscha n'exista nagin numer valaivel en tut il pajais per intoxicaziuns. Mintga regiun ha ses agen Centre antipoison. En cas da privel da mort clamas ti 15 u 112.",
  gapFrRescue: "En Frantscha n'exista nagin agen numer per il salvament da muntogna. Ti al cuntanschas via 112.",
  gapItPoison: "En Italia n'exista nagin numer valaivel en tut il pajais per intoxicaziuns. Mintga regiun ha ses agen Centro antiveleni. En cas da privel da mort clamas ti 112.",
  gapItRescue: "En Italia n'exista nagin agen numer per il salvament da muntogna. Ti al cuntanschas via 112.",

  /* Country notes */
  noteIt: "En Italia unescha 112 tut las clamadas d'urgenza. Ils vegls numers 113, 115 e 118 funcziunan vinavant.",
  noteLi: "Liechtenstein dovra ils medems numers d'urgenza sco la Svizra."
};
