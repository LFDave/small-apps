// fr.js — French. Mirrors the keys in de.js exactly.

export const fr = {
  appTitle: "Nummernfuchs",
  appTagline: "Retiens les numéros et les codes.",

  /* Home */
  homeMyNumbers: "Mes numéros",
  homeEmpty: "Aucun numéro enregistré. Ajoute le premier, par exemple le portable de maman ou le code de la porte d'entrée.",
  homeAdd: "Ajouter un numéro",
  homeStorageNote: "Tous les numéros restent sur cet appareil.",
  homeReset: "Tout réinitialiser",
  resetConfirm: "Supprimer tous les numéros et les progrès ? Les données sont uniquement sur cet appareil.",

  /* Random-number training */
  homeTraining: "Nombre au hasard",
  homeTrainingIntro: "Entraîne-toi avec un nombre au hasard. Choisis sa longueur.",
  trainingDigits: "{n} chiffres",
  trainingFewer: "Moins de chiffres",
  trainingMore: "Plus de chiffres",
  trainingStart: "Entraîner un nombre au hasard",
  trainingTitle: "Nombre au hasard",
  trainingDoneMsg: "Tu as retenu un nombre au hasard de {n} chiffres.",
  trainingAgain: "Nouveau nombre au hasard",
  trainingSuggest: "Ça marche très bien. Essaie avec {n} chiffres !",
  trainingSuggestBtn: "Entraîner {n} chiffres",

  /* Emergency section */
  homeEmergency: "Numéros d'urgence",
  homeEmergencyIntro: "Ces numéros sont valables {country}. Les connais-tu par cœur ?",
  homeEmergencyPractice: "Entraîner les numéros d'urgence",
  emgGapsTitle: "Ce qui manque ici",

  /* Entry status */
  statusNeu: "Nouveau",
  statusGeuebt: "Entraîné",
  statusSitzt: "Acquis !",

  /* Settings */
  settingsTitle: "Réglages",
  settingsOpen: "Ouvrir les réglages",
  settingsLanguage: "Langue",
  settingsLanguageHint: "Tous les textes de Nummernfuchs apparaissent dans cette langue.",
  settingsCountry: "Pays",
  settingsCountryHint: "Les numéros d'urgence valent pour ce pays. Les nouveaux numéros de téléphone reçoivent son indicatif.",

  countryCh: "Suisse",
  countryDe: "Allemagne",
  countryAt: "Autriche",
  countryFr: "France",
  countryIt: "Italie",
  countryLi: "Liechtenstein",
  countryNo: "Norvège",
  countryInCh: "en Suisse",
  countryInDe: "en Allemagne",
  countryInAt: "en Autriche",
  countryInFr: "en France",
  countryInIt: "en Italie",
  countryInLi: "au Liechtenstein",
  countryInNo: "en Norvège",

  /* Form */
  formTitleNew: "Nouveau numéro",
  formTitleEdit: "Modifier le numéro",
  formTypeLabel: "Quel genre de numéro est-ce ?",
  formTypeCode: "Code",
  formTypeCodeHint: "Code de porte, boîte aux lettres, cadenas de vélo",
  formTypePhone: "Numéro de téléphone",
  formTypePhoneHint: "Portable ou fixe",
  formLabelLabel: "Pour qui ou pour quoi ?",
  formLabelPlaceholderCode: "Porte d'entrée",
  formLabelPlaceholderPhone: "Portable de maman",
  formNumberLabel: "Le numéro",
  formNumberHint: "Sépare-le en groupes avec des espaces, comme tu le dis. Par exemple : 640 132",
  formNumberPlaceholderCode: "640 132",
  formNumberPlaceholderPhone: "079 640 13 21",
  formIntlLabel: "Entraîner aussi la forme internationale",
  formIntlCc: "Indicatif du pays",
  formIntlPreview: "International :",
  formSave: "Enregistrer",
  formDelete: "Supprimer",
  formDeleteConfirm: "Supprimer ce numéro ? Les données sont uniquement sur cet appareil.",
  formBack: "Retour",
  formEditEntry: "Modifier {label}",

  /* Form errors */
  errLabelEmpty: "Donne un nom au numéro, par exemple Portable de maman.",
  errLabelLong: "Le nom est trop long. 24 caractères au maximum.",
  errNumberEmpty: "Saisis le numéro.",
  errNumberInvalid: "Seuls les chiffres et les espaces sont autorisés.",
  errNumberShort: "Le numéro est trop court. Au moins 3 chiffres.",
  errNumberLong: "Le numéro est trop long. 16 chiffres au maximum.",
  errChunkLong: "Fais des groupes plus petits. 5 chiffres par groupe au maximum.",
  errCcInvalid: "L'indicatif du pays a besoin de 1 à 3 chiffres.",

  /* Learning ladder */
  ladderStepView: "Regarde bien le numéro. Lis-le à voix haute par groupes.",
  ladderStepCloze: "Un groupe manque. Saisis-le.",
  ladderStepTail: "Maintenant presque tout manque. Saisis les groupes manquants.",
  ladderStepFull: "Et maintenant de tête. Saisis le numéro en entier.",
  ladderStepIntlView: "Voici comment composer le numéro depuis l'étranger. Regarde-le bien.",
  ladderStepIntlFull: "Saisis le numéro international. Il commence par +.",
  ladderStepProgress: "Étape {i} sur {n}",
  ladderReady: "Je suis prêt",
  ladderNext: "Continuer",
  ladderRetry: "Réessayer",
  ladderReveal: "Revoir le numéro",
  ladderRevealMsg: "Regarde bien. Puis réessaie.",
  ladderRevealDone: "Continuer à s'entraîner",
  ladderCorrect: "Juste.",
  ladderWrong: "Presque. Réessaie.",
  ladderWrongAgain: "Presque. Revois le numéro si tu veux.",
  ladderDoneTitle: "Réussi !",
  ladderDoneMsg: "Tu as retenu «{label}».",
  ladderDoneSitzt: "Ce numéro est vraiment bien acquis.",
  ladderAgain: "S'entraîner encore",
  ladderHome: "Vers l'aperçu",

  /* Quiz */
  quizTitle: "Numéros d'urgence",
  quizQuestion: "Quel numéro appelles-tu ?",
  quizProgress: "Numéro {i} sur {n}",
  quizCorrect: "Juste. {explain}",
  quizWrongCopy: "Presque. {explain} Saisis-le encore une fois pour le retenir.",
  quizCopyAgain: "Regarde : {number}. Réessaie.",
  quizDoneTitle: "Bien joué !",
  quizDoneMsg: "Tu as su {k} numéros sur {n} tout de suite.",
  quizDoneAll: "Tu as su tous les numéros. Bravo !",
  quizKnown: "su",
  quizPracticed: "entraîné",

  /* Pad */
  padBackspace: "Effacer un chiffre",
  padAutoHint: "Au dernier chiffre, tu vois tout de suite si c'est juste.",
  padLabel: "Pavé numérique",

  /* Level, XP, medals */
  statsLevel: "Niveau {n} · {title}",
  statsXp: "{xp} sur {next} XP",
  statsXpMax: "{xp} XP · niveau le plus haut",
  statsMedals: "{k} médailles sur {n}",
  statsOpen: "Voir le niveau et les médailles",
  medalsTitle: "Médailles",
  rewardXp: "+{xp} XP",
  rewardLevelUp: "Nouveau niveau : {title} !",
  rewardMedal: "Nouvelle médaille : {name}",

  level1: "Renardeau",
  level2: "Renard malin",
  level3: "Renard des nombres",
  level4: "Renard de mémoire",
  level5: "Super renard",
  level6: "Maître renard",

  medalNameErsteUebung: "Premier exercice",
  medalDescErsteUebung: "Termine ton premier exercice.",
  medalNameDreiUebungen: "Renard appliqué",
  medalDescDreiUebungen: "Termine 3 exercices.",
  medalNameAchtUebungen: "Renard d'entraînement",
  medalDescAchtUebungen: "Termine 8 exercices.",
  medalNameEinundzwanzigUebungen: "Maître de l'entraînement",
  medalDescEinundzwanzigUebungen: "Termine 21 exercices.",
  medalNameSitzt: "Acquis !",
  medalDescSitzt: "Un numéro enregistré est vraiment bien acquis.",
  medalNameNotrufProfi: "Pro de l'urgence",
  medalDescNotrufProfi: "Tous les numéros d'urgence de ton pays sont acquis.",
  medalNameInternational: "International",
  medalDescInternational: "Apprends un numéro avec l'indicatif du pays.",
  medalNameRiesenzahl: "Nombre géant",
  medalDescRiesenzahl: "Réussis un nombre au hasard de 10 chiffres ou plus.",
  medalNameTippfuchs: "Renard clavier",
  medalDescTippfuchs: "Saisis 500 chiffres en tout.",

  /* Emergency numbers: names, situations, explanations */
  emgNameEuro: "Urgence européenne",
  emgSituationEuro: "Le numéro d'urgence général. Il fonctionne dans toute l'Europe.",
  emgExplainEuro: "{number} est le numéro d'urgence dans toute l'Europe.",

  emgNameItEuro: "Urgence",
  emgSituationItEuro: "Le numéro d'urgence pour tout : police, pompiers et secours.",
  emgExplainItEuro: "{number} regroupe toutes les urgences en Italie.",

  emgNameDeNotruf: "Pompiers et secours",
  emgSituationDeNotruf: "Il y a le feu, ou quelqu'un est gravement blessé.",
  emgExplainDeNotruf: "{number}, ce sont les pompiers et les secours en Allemagne.",

  emgNamePolice: "Police",
  emgSituationPolice: "Tu as besoin de la police.",
  emgExplainPolice: "{number}, c'est la police.",

  emgNameFire: "Pompiers",
  emgSituationFire: "Il y a le feu.",
  emgExplainFire: "{number}, ce sont les pompiers.",

  emgNameMedical: "Secours médical",
  emgSituationMedical: "Quelqu'un est blessé et a besoin d'aide vite.",
  emgExplainMedical: "{number}, c'est le secours médical.",

  emgNameDeDoctor: "Service médical de garde",
  emgSituationDeDoctor: "Quelqu'un a besoin d'un médecin, mais sa vie n'est pas en danger.",
  emgExplainDeDoctor: "{number}, c'est le service médical de garde.",

  emgNameToxCh: "Tox Info",
  emgSituationToxCh: "Quelqu'un a avalé quelque chose de toxique.",
  emgExplainToxCh: "{number}, c'est Tox Info Suisse. Ils aident en cas d'empoisonnement.",

  emgNameToxLi: "Tox Info",
  emgSituationToxLi: "Quelqu'un a avalé quelque chose de toxique.",
  emgExplainToxLi: "{number}, c'est Tox Info Suisse. Ils aident aussi au Liechtenstein en cas d'empoisonnement.",

  emgNameRega: "Rega",
  emgSituationRega: "Quelqu'un a besoin d'aide en montagne.",
  emgExplainRega: "{number}, c'est la Rega, le secours par les airs.",

  emgNameAtRescue: "Secours en montagne",
  emgSituationAtRescue: "Quelqu'un a besoin d'aide en montagne.",
  emgExplainAtRescue: "{number}, c'est le secours en montagne.",

  emgNameNoLegevakt: "Legevakt",
  emgSituationNoLegevakt: "Quelqu'un est malade et a besoin d'un médecin aujourd'hui.",
  emgExplainNoLegevakt: "{number}, c'est la Legevakt, le service médical de garde.",

  emgNameNoSeaRescue: "Secours en mer",
  emgSituationNoSeaRescue: "Quelqu'un a besoin d'aide sur l'eau.",
  emgExplainNoSeaRescue: "{number}, c'est la radio côtière. Elle envoie les secours en mer.",

  /* Gaps: services this country has no short number for */
  gapDePoison: "L'Allemagne n'a pas de numéro national pour les empoisonnements. Chaque Land a son propre centre antipoison. En cas de danger de mort, appelle le 112.",
  gapDeRescue: "L'Allemagne n'a pas de numéro propre pour le secours en montagne. Tu l'atteins par le 112.",
  gapAtPoison: "L'Autriche n'a pas de numéro d'urgence court pour les empoisonnements. Le centre d'information toxicologique de Vienne a le numéro 01 406 43 43.",
  gapFrPoison: "La France n'a pas de numéro national pour les empoisonnements. Chaque région a son propre Centre antipoison. En cas de danger de mort, appelle le 15 ou le 112.",
  gapFrRescue: "La France n'a pas de numéro propre pour le secours en montagne. Tu l'atteins par le 112.",
  gapItPoison: "L'Italie n'a pas de numéro national pour les empoisonnements. Chaque région a son propre Centro antiveleni. En cas de danger de mort, appelle le 112.",
  gapItRescue: "L'Italie n'a pas de numéro propre pour le secours en montagne. Tu l'atteins par le 112.",
  gapNoPoison: "La Norvège n'a pas de numéro d'urgence court pour les empoisonnements. La Giftinformasjonen a le numéro 22 59 13 00.",
  gapNoRescue: "La Norvège n'a pas de numéro propre pour le secours en montagne. Tu l'atteins par le 112.",

  /* Country notes */
  noteIt: "En Italie, le 112 regroupe toutes les urgences. Les anciens numéros 113, 115 et 118 fonctionnent toujours.",
  noteLi: "Le Liechtenstein utilise les mêmes numéros d'urgence que la Suisse.",
  noteNo: "En Norvège, le 112 est à la fois la police et le numéro d'urgence de toute l'Europe."
};
