// content/de.js — German orthography curriculum, grouped by the three
// Lehrplan 21 cycles. This file carries content only: the words,
// sentence frames and clues a child works on. Topic titles and rule
// explanations are string ids resolved through the interface language
// tables, so an English interface can explain a German rule in English
// while the practice material stays German.
//
// Item shapes by topic kind:
//   word     { before, answer, after, options, clue? }
//            the answer is a letter group inside a word: Sp|ort
//   sentence { before, answer, after, options }
//            the answer is one word inside a sentence
//   punct    { before, answer, options, emptyOptionKey? }
//            the answer is a mark, joined without a space
//   memory   { word, clue }
//            study the word, then write it from memory
//
// Rules for the item data:
// - Exactly one option may produce a correct German word or sentence.
//   Where two options are both real (singen / sinken), the item carries
//   a clue that decides it.
// - Swiss standard German: ss, never sharp s.
// - Every distractor is one a child really makes, not a random letter.

export const de = {
  code: "de",
  htmlLang: "de-CH",
  topics: [
    /* ── Zyklus 1: 1. und 2. Klasse ──────────────────────────────── */
    {
      id: "nomen-gross",
      cycle: 1,
      kind: "sentence",
      icon: "case-sensitive",
      items: [
        { before: "Der", answer: "Hund", after: "schläft im Korb.", options: ["Hund", "hund"] },
        { before: "Auf dem", answer: "Tisch", after: "liegt ein Buch.", options: ["Tisch", "tisch"] },
        { before: "Die", answer: "Blume", after: "wächst im Garten.", options: ["Blume", "blume"] },
        { before: "Wir gehen in die", answer: "Schule", after: ".", options: ["Schule", "schule"] },
        { before: "Mein", answer: "Velo", after: "ist rot.", options: ["Velo", "velo"] },
        { before: "Im", answer: "Wald", after: "wohnen viele Tiere.", options: ["Wald", "wald"] },
        { before: "Die", answer: "Sonne", after: "scheint warm.", options: ["Sonne", "sonne"] },
        { before: "Sie trinkt ein Glas", answer: "Wasser", after: ".", options: ["Wasser", "wasser"] }
      ]
    },
    {
      id: "satzanfang",
      cycle: 1,
      kind: "sentence",
      icon: "type",
      items: [
        { before: "", answer: "Wir", after: "gehen nach Hause.", options: ["Wir", "wir"] },
        { before: "", answer: "Die", after: "Katze schläft.", options: ["Die", "die"] },
        { before: "", answer: "Er", after: "ist mein Freund.", options: ["Er", "er"] },
        { before: "", answer: "Mein", after: "Vater kocht.", options: ["Mein", "mein"] },
        { before: "", answer: "Es", after: "regnet stark.", options: ["Es", "es"] },
        { before: "", answer: "Sie", after: "spielen im Garten.", options: ["Sie", "sie"] },
        { before: "", answer: "Das", after: "hast du gut gemacht.", options: ["Das", "das"] },
        { before: "", answer: "Der", after: "Ball ist weg.", options: ["Der", "der"] }
      ]
    },
    {
      id: "satzschluss-punkt",
      cycle: 1,
      kind: "punct",
      icon: "pilcrow",
      items: [
        { before: "Wie heisst du", answer: "?", options: [".", "?"] },
        { before: "Ich habe Hunger", answer: ".", options: [".", "?"] },
        { before: "Wo ist mein Schuh", answer: "?", options: [".", "?"] },
        { before: "Der Hund bellt laut", answer: ".", options: [".", "?"] },
        { before: "Wann kommst du", answer: "?", options: [".", "?"] },
        { before: "Wir essen Suppe", answer: ".", options: [".", "?"] },
        { before: "Hast du das gesehen", answer: "?", options: [".", "?"] },
        { before: "Die Sonne scheint", answer: ".", options: [".", "?"] }
      ]
    },
    {
      id: "merkwort-1",
      cycle: 1,
      kind: "memory",
      icon: "brain",
      items: [
        { word: "Mutter", clue: "Sie liest dir eine Geschichte vor." },
        { word: "Vater", clue: "Er bringt dich ins Bett." },
        { word: "Schule", clue: "Dort lernst du lesen und schreiben." },
        { word: "Freund", clue: "Mit ihm spielst du am liebsten." },
        { word: "Haus", clue: "Dort wohnst du." },
        { word: "Baum", clue: "Er hat Äste und Blätter." },
        { word: "Kind", clue: "So nennt man dich noch." },
        { word: "Blume", clue: "Sie riecht gut und steht in der Vase." }
      ]
    },

    /* ── Zyklus 2: 3. bis 6. Klasse ──────────────────────────────── */
    {
      id: "sch",
      cycle: 2,
      kind: "word",
      icon: "spell-check",
      items: [
        { before: "", answer: "Sch", after: "ule", options: ["Sch", "Sh", "Ch"] },
        { before: "Ti", answer: "sch", after: "", options: ["sch", "ch", "sh"] },
        { before: "Fla", answer: "sch", after: "e", options: ["sch", "ch", "s"] },
        { before: "", answer: "Sch", after: "nee", options: ["Sch", "Sh", "S"] },
        { before: "wa", answer: "sch", after: "en", options: ["sch", "ch"], clue: "mit Wasser sauber machen" },
        { before: "Men", answer: "sch", after: "", options: ["sch", "ch", "s"] },
        { before: "", answer: "Sch", after: "atten", options: ["Sch", "Ch", "Sh"] },
        { before: "Ta", answer: "sch", after: "e", options: ["sch", "ch", "s"] }
      ]
    },
    {
      id: "sp-st",
      cycle: 2,
      kind: "word",
      icon: "whole-word",
      items: [
        { before: "", answer: "Sp", after: "ort", options: ["Sp", "Schp"] },
        { before: "", answer: "St", after: "ern", options: ["St", "Scht"] },
        { before: "", answer: "Sp", after: "iel", options: ["Sp", "Schp"] },
        { before: "", answer: "St", after: "rasse", options: ["St", "Scht"] },
        { before: "ver", answer: "st", after: "ehen", options: ["st", "scht"] },
        { before: "Bei", answer: "sp", after: "iel", options: ["sp", "schp"] },
        { before: "", answer: "Sp", after: "iegel", options: ["Sp", "Schp"] },
        { before: "", answer: "St", after: "unde", options: ["St", "Scht"] }
      ]
    },
    {
      id: "ng-nk",
      cycle: 2,
      kind: "word",
      icon: "ear",
      items: [
        { before: "Ju", answer: "ng", after: "e", options: ["ng", "nk"] },
        { before: "si", answer: "ng", after: "en", options: ["ng", "nk"], clue: "das macht ein Chor" },
        { before: "Ba", answer: "nk", after: "", options: ["ng", "nk"] },
        { before: "la", answer: "ng", after: "", options: ["ng", "nk"] },
        { before: "tri", answer: "nk", after: "en", options: ["ng", "nk"] },
        { before: "Fi", answer: "ng", after: "er", options: ["ng", "nk"] },
        { before: "de", answer: "nk", after: "en", options: ["ng", "nk"] },
        { before: "Ri", answer: "ng", after: "", options: ["ng", "nk"] }
      ]
    },
    {
      id: "doppelkonsonant",
      cycle: 2,
      kind: "word",
      icon: "copy",
      items: [
        { before: "So", answer: "nn", after: "e", options: ["nn", "n"] },
        { before: "ko", answer: "mm", after: "en", options: ["mm", "m"] },
        { before: "Wa", answer: "ss", after: "er", options: ["ss", "s"] },
        { before: "Bu", answer: "tt", after: "er", options: ["tt", "t"] },
        { before: "Te", answer: "ll", after: "er", options: ["ll", "l"] },
        { before: "re", answer: "nn", after: "en", options: ["nn", "n"] },
        { before: "Su", answer: "pp", after: "e", options: ["pp", "p"] },
        { before: "Zi", answer: "mm", after: "er", options: ["mm", "m"] }
      ]
    },
    {
      id: "dehnung",
      cycle: 2,
      kind: "word",
      icon: "move-horizontal",
      items: [
        { before: "Sp", answer: "ie", after: "l", options: ["ie", "i", "ih"] },
        { before: "Z", answer: "ie", after: "l", options: ["ie", "i", "ih"] },
        { before: "F", answer: "ah", after: "rrad", options: ["ah", "a", "aa"] },
        { before: "B", answer: "ah", after: "n", options: ["ah", "a", "aa"] },
        { before: "B", answer: "oo", after: "t", options: ["oo", "o", "oh"] },
        { before: "M", answer: "ee", after: "r", options: ["ee", "e", "eh"] },
        { before: "w", answer: "oh", after: "nen", options: ["oh", "o", "oo"] },
        { before: "v", answer: "ie", after: "l", options: ["ie", "i", "ih"] }
      ]
    },
    {
      id: "abstrakte-nomen",
      cycle: 2,
      kind: "sentence",
      icon: "cloud",
      items: [
        { before: "Sie hatte grosse", answer: "Angst", after: "vor dem Hund.", options: ["Angst", "angst"] },
        { before: "Er hat viel", answer: "Mut", after: "gezeigt.", options: ["Mut", "mut"] },
        { before: "Die", answer: "Freude", after: "war riesig.", options: ["Freude", "freude"] },
        { before: "Das", answer: "Glück", after: "war auf ihrer Seite.", options: ["Glück", "glück"] },
        { before: "Sie hatte eine gute", answer: "Idee", after: ".", options: ["Idee", "idee"] },
        { before: "Nach dem Lärm kam die", answer: "Ruhe", after: ".", options: ["Ruhe", "ruhe"] },
        { before: "Wir brauchen mehr", answer: "Zeit", after: ".", options: ["Zeit", "zeit"] },
        { before: "Seine", answer: "Liebe", after: "zur Musik ist gross.", options: ["Liebe", "liebe"] }
      ]
    },
    {
      id: "satzschluss",
      cycle: 2,
      kind: "punct",
      icon: "pilcrow",
      items: [
        { before: "Wie spät ist es", answer: "?", options: [".", "?", "!"] },
        { before: "Pass auf", answer: "!", options: [".", "?", "!"] },
        { before: "Wir gehen heute ins Kino", answer: ".", options: [".", "?", "!"] },
        { before: "Warum lachst du", answer: "?", options: [".", "?", "!"] },
        { before: "Komm sofort her", answer: "!", options: [".", "?", "!"] },
        { before: "Der Zug fährt um acht Uhr", answer: ".", options: [".", "?", "!"] },
        { before: "Hast du deine Aufgaben gemacht", answer: "?", options: [".", "?", "!"] },
        { before: "Das ist ja fantastisch", answer: "!", options: [".", "?", "!"] }
      ]
    },
    {
      id: "merkwort-2",
      cycle: 2,
      kind: "memory",
      icon: "brain",
      items: [
        { word: "Fahrrad", clue: "Damit fährst du zur Schule." },
        { word: "Vogel", clue: "Er hat Federn und fliegt." },
        { word: "Theater", clue: "Dort spielt man Stücke auf einer Bühne." },
        { word: "Geschichte", clue: "Die erzählt dir jemand vor dem Schlafen." },
        { word: "Zwiebel", clue: "Beim Schneiden musst du weinen." },
        { word: "Kalender", clue: "Dort stehen alle Tage des Jahres." },
        { word: "Verkehr", clue: "Auf der Strasse ist morgens viel davon." },
        { word: "Nachbar", clue: "Er wohnt gleich neben dir." }
      ]
    },

    /* ── Zyklus 3: 7. bis 9. Klasse ──────────────────────────────── */
    {
      id: "das-dass",
      cycle: 3,
      kind: "sentence",
      icon: "split",
      items: [
        { before: "Sie sagt,", answer: "dass", after: "sie müde ist.", options: ["das", "dass"] },
        { before: "Er hat", answer: "das", after: "Fenster geöffnet.", options: ["das", "dass"] },
        { before: "Wir wissen,", answer: "dass", after: "es morgen regnet.", options: ["das", "dass"] },
        { before: "Das Auto,", answer: "das", after: "dort steht, ist neu.", options: ["das", "dass"] },
        { before: "Ich glaube,", answer: "dass", after: "er recht hat.", options: ["das", "dass"] },
        { before: "Nimm", answer: "das", after: "Buch aus dem Regal.", options: ["das", "dass"] },
        { before: "Ich habe", answer: "das", after: "Spiel gewonnen.", options: ["das", "dass"] },
        { before: "Das Wetter war so schön,", answer: "dass", after: "wir baden gingen.", options: ["das", "dass"] }
      ]
    },
    {
      id: "nominalisierung",
      cycle: 3,
      kind: "sentence",
      icon: "case-upper",
      items: [
        { before: "Beim", answer: "Laufen", after: "hörte er Musik.", options: ["Laufen", "laufen"] },
        { before: "Sie hat etwas", answer: "Schönes", after: "erlebt.", options: ["Schönes", "schönes"] },
        { before: "Das", answer: "Lernen", after: "fällt ihm leicht.", options: ["Lernen", "lernen"] },
        { before: "Er sagt nichts", answer: "Schlechtes", after: "über sie.", options: ["Schlechtes", "schlechtes"] },
        { before: "Zum", answer: "Essen", after: "gibt es Suppe.", options: ["Essen", "essen"] },
        { before: "Er hat viel", answer: "Neues", after: "gelernt.", options: ["Neues", "neues"] },
        { before: "Das", answer: "Aufstehen", after: "am Morgen fällt schwer.", options: ["Aufstehen", "aufstehen"] },
        { before: "Sie hat wenig", answer: "Passendes", after: "gefunden.", options: ["Passendes", "passendes"] }
      ]
    },
    {
      id: "komma",
      cycle: 3,
      kind: "punct",
      icon: "pause",
      emptyOptionKey: "optionNoComma",
      items: [
        { before: "Er bleibt zu Hause", answer: ",", after: "weil er krank ist.", options: [",", ""] },
        { before: "Nach dem Essen", answer: "", after: "gehen wir spazieren.", options: [",", ""] },
        { before: "Ich weiss", answer: ",", after: "dass du das kannst.", options: [",", ""] },
        { before: "Wir treffen uns", answer: "", after: "und gehen ins Kino.", options: [",", ""] },
        { before: "Sie freut sich", answer: ",", after: "wenn du kommst.", options: [",", ""] },
        { before: "Er nahm den Schirm", answer: ",", after: "obwohl die Sonne schien.", options: [",", ""] },
        { before: "Am Abend", answer: "", after: "lesen wir noch ein Kapitel.", options: [",", ""] },
        { before: "Er ging nach Hause", answer: "", after: "und legte sich hin.", options: [",", ""] }
      ]
    },
    {
      id: "endung",
      cycle: 3,
      kind: "word",
      icon: "text-cursor-input",
      items: [
        { before: "freund", answer: "lich", after: "", options: ["lich", "ig"] },
        { before: "wicht", answer: "ig", after: "", options: ["ig", "ich"] },
        { before: "täg", answer: "lich", after: "", options: ["lich", "ig"] },
        { before: "traur", answer: "ig", after: "", options: ["ig", "ich"] },
        { before: "mög", answer: "lich", after: "", options: ["lich", "ig"] },
        { before: "lust", answer: "ig", after: "", options: ["ig", "ich"] },
        { before: "ehr", answer: "lich", after: "", options: ["lich", "ig"] },
        { before: "richt", answer: "ig", after: "", options: ["ig", "ich"] }
      ]
    },
    {
      id: "fremdwort",
      cycle: 3,
      kind: "memory",
      icon: "globe",
      items: [
        { word: "Rhythmus", clue: "Der Takt in der Musik." },
        { word: "Physik", clue: "Das Fach über Kräfte und Energie." },
        { word: "Restaurant", clue: "Dort isst man auswärts." },
        { word: "Adresse", clue: "Strasse, Nummer und Ort." },
        { word: "Maschine", clue: "Ein Gerät, das Arbeit abnimmt." },
        { word: "Interview", clue: "Ein Gespräch mit Fragen und Antworten." },
        { word: "Biografie", clue: "Die Lebensgeschichte einer Person." },
        { word: "Ingenieur", clue: "Dieser Beruf baut Brücken und Maschinen." }
      ]
    }
  ]
};
