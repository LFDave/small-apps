// content/de.js — German orthography curriculum, grouped by the three
// Lehrplan 21 cycles and, inside a rule, by chapter. This file carries
// content only: the words, sentence frames and clues a child works on.
// Rule titles and rule explanations are string ids resolved through the
// interface language tables, so an English interface can explain a
// German rule in English while the practice material stays German.
//
// `step` is the competency step of D.4.F.1 (Deutsch, Schreiben,
// Schreibprozess: sprachformal überarbeiten) where the rule is named
// word for word. It is null where the rule is standard orthography the
// document does not spell out; the app says so on the rule view rather
// than implying a source it does not have. See PRD.md for the ladder.
//
// Chapters run easy to hard and always end in writing:
//   1  recognise the rule on common words
//   2  the same rule on harder or rarer words
//   3  produce it: type the answer instead of choosing it
//
// Item shapes by chapter kind:
//   word     { before, answer, after, options, clue? }
//            the answer is a letter group inside a word: Sp|ort
//   sentence { before, answer, after, options }
//            the answer is one word inside a sentence
//   punct    { before, answer, after?, options }
//            the answer is a mark, joined without a space
//   write    { before, answer, after, clue }
//            the answer is typed into the gap, known length
//   copy     { prompt, answer }
//            the whole sentence is written out correctly
//   memory   { answer, clue }
//            study the word, then write it from memory
//
// Rules for the item data:
// - Exactly one option may produce a correct German word or sentence.
//   Where two options are both real (singen / sinken, Rad / Rat), the
//   item carries a clue that decides it.
// - A written answer must have exactly one correct spelling. No word
//   with an accepted variant (Biografie / Biographie) may appear.
// - Swiss standard German: ss, never sharp s.
// - Every distractor is one a child really makes, not a random letter.

export const de = {
  code: "de",
  htmlLang: "de-CH",
  topics: [
    /* ══ Zyklus 1 ══ D.4.F.1.a und .b ═══════════════════════════════ */

    {
      id: "nomen-gross",
      cycles: [1],
      step: "D.4.F.1.a",
      icon: "case-sensitive",
      chapters: [
        {
          id: "nomen-gross-1",
          kind: "sentence",
          items: [
            { before: "Der", answer: "Hund", after: "schläft im Korb.", options: ["Hund", "hund"] },
            { before: "Auf dem", answer: "Tisch", after: "liegt ein Buch.", options: ["Tisch", "tisch"] },
            { before: "Die", answer: "Blume", after: "wächst im Garten.", options: ["Blume", "blume"] },
            { before: "Mein", answer: "Velo", after: "ist rot.", options: ["Velo", "velo"] },
            { before: "Im", answer: "Wald", after: "wohnen viele Tiere.", options: ["Wald", "wald"] },
            { before: "Die", answer: "Sonne", after: "scheint warm.", options: ["Sonne", "sonne"] },
            { before: "Sie trinkt ein Glas", answer: "Wasser", after: ".", options: ["Wasser", "wasser"] },
            { before: "Das", answer: "Brot", after: "ist noch warm.", options: ["Brot", "brot"] }
          ]
        },
        {
          id: "nomen-gross-2",
          kind: "sentence",
          items: [
            { before: "Wir wohnen in", answer: "Bern", after: ".", options: ["Bern", "bern"] },
            { before: "Meine Schwester heisst", answer: "Lena", after: ".", options: ["Lena", "lena"] },
            { before: "Der Fluss heisst", answer: "Aare", after: ".", options: ["Aare", "aare"] },
            { before: "Im Sommer fahren wir nach", answer: "Italien", after: ".", options: ["Italien", "italien"] },
            { before: "Unser Hund heisst", answer: "Bello", after: ".", options: ["Bello", "bello"] },
            { before: "Der Berg heisst", answer: "Eiger", after: ".", options: ["Eiger", "eiger"] },
            { before: "Am", answer: "Montag", after: "gehen wir schwimmen.", options: ["Montag", "montag"] },
            { before: "Sie kommt aus", answer: "Zürich", after: ".", options: ["Zürich", "zürich"] }
          ]
        },
        {
          id: "nomen-gross-3",
          kind: "write",
          items: [
            { before: "Der", answer: "Hund", after: "wartet vor der Tür.", clue: "Er bellt und hat vier Beine." },
            { before: "Die", answer: "Katze", after: "schläft auf dem Sofa.", clue: "Sie miaut und schnurrt." },
            { before: "Auf dem", answer: "Berg", after: "liegt Schnee.", clue: "Hoch, steil, man wandert hinauf." },
            { before: "Mein", answer: "Bruder", after: "spielt Fussball.", clue: "Der Sohn deiner Eltern." },
            { before: "Im", answer: "Garten", after: "wachsen Blumen.", clue: "Hinter dem Haus, mit Gras und Beeten." },
            { before: "Wir wohnen in", answer: "Bern", after: ".", clue: "Die Hauptstadt der Schweiz." }
          ]
        }
      ]
    },

    {
      id: "satzanfang",
      cycles: [1],
      step: "D.4.F.1.a",
      icon: "type",
      chapters: [
        {
          id: "satzanfang-1",
          kind: "sentence",
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
          id: "satzanfang-2",
          kind: "sentence",
          items: [
            { before: "", answer: "Heute", after: "regnet es den ganzen Tag.", options: ["Heute", "heute"] },
            { before: "", answer: "Manchmal", after: "vergisst er die Aufgaben.", options: ["Manchmal", "manchmal"] },
            { before: "", answer: "Draussen", after: "ist es kalt geworden.", options: ["Draussen", "draussen"] },
            { before: "", answer: "Endlich", after: "sind die Ferien da.", options: ["Endlich", "endlich"] },
            { before: "", answer: "Gestern", after: "haben wir gebacken.", options: ["Gestern", "gestern"] },
            { before: "", answer: "Vielleicht", after: "kommt sie später.", options: ["Vielleicht", "vielleicht"] },
            { before: "", answer: "Zuerst", after: "räumen wir auf.", options: ["Zuerst", "zuerst"] },
            { before: "", answer: "Niemand", after: "hat etwas gesagt.", options: ["Niemand", "niemand"] }
          ]
        },
        {
          id: "satzanfang-3",
          kind: "copy",
          items: [
            { prompt: "heute scheint die Sonne", answer: "Heute scheint die Sonne." },
            { prompt: "wir essen um zwölf Uhr", answer: "Wir essen um zwölf Uhr." },
            { prompt: "der Bus kommt gleich", answer: "Der Bus kommt gleich." },
            { prompt: "meine Katze schläft viel", answer: "Meine Katze schläft viel." },
            { prompt: "morgen ist ein Feiertag", answer: "Morgen ist ein Feiertag." },
            { prompt: "im Garten blühen Blumen", answer: "Im Garten blühen Blumen." }
          ]
        }
      ]
    },

    {
      id: "wortgrenzen",
      cycles: [1],
      step: "D.4.F.1.a",
      icon: "scissors",
      chapters: [
        {
          id: "wortgrenzen-1",
          kind: "sentence",
          items: [
            { before: "Mein", answer: "Fahrrad", after: "hat einen Platten.", options: ["Fahrrad", "Fahr rad"] },
            { before: "Ich mache meine", answer: "Hausaufgaben", after: ".", options: ["Hausaufgaben", "Haus aufgaben"] },
            { before: "", answer: "Vielleicht", after: "kommt sie morgen.", options: ["Vielleicht", "Viel leicht"] },
            { before: "Zieh die", answer: "Handschuhe", after: "an.", options: ["Handschuhe", "Hand schuhe"] },
            { before: "Morgen ist mein", answer: "Geburtstag", after: ".", options: ["Geburtstag", "Geburts tag"] },
            { before: "Wir räumen", answer: "zusammen", after: "auf.", options: ["zusammen", "zu sammen"] },
            { before: "Nach dem Regen kam ein", answer: "Regenbogen", after: ".", options: ["Regenbogen", "Regen bogen"] },
            { before: "Der", answer: "Kindergarten", after: "ist gleich nebenan.", options: ["Kindergarten", "Kinder garten"] }
          ]
        },
        {
          id: "wortgrenzen-2",
          kind: "sentence",
          items: [
            { before: "Der", answer: "Schulweg", after: "ist kurz.", options: ["Schulweg", "Schul weg"] },
            { before: "Sie hat", answer: "Bauchweh", after: ".", options: ["Bauchweh", "Bauch weh"] },
            { before: "Das", answer: "Taschengeld", after: "ist schon alle.", options: ["Taschengeld", "Taschen geld"] },
            { before: "", answer: "Trotzdem", after: "kam er mit.", options: ["Trotzdem", "Trotz dem"] },
            { before: "Die", answer: "Zahnbürste", after: "ist neu.", options: ["Zahnbürste", "Zahn bürste"] },
            { before: "Er hat", answer: "Heimweh", after: ".", options: ["Heimweh", "Heim weh"] },
            { before: "Wir warten an der", answer: "Bushaltestelle", after: ".", options: ["Bushaltestelle", "Bus haltestelle"] },
            { before: "", answer: "Obwohl", after: "es regnet, gehen wir los.", options: ["Obwohl", "Ob wohl"] }
          ]
        },
        {
          id: "wortgrenzen-3",
          kind: "write",
          items: [
            { before: "Mein", answer: "Fahrrad", after: "steht im Keller.", clue: "Zwei Räder und Pedale." },
            { before: "Ich mache die", answer: "Hausaufgaben", after: ".", clue: "Arbeit für die Schule, zu Hause." },
            { before: "Morgen ist mein", answer: "Geburtstag", after: ".", clue: "Der Tag, an dem du geboren bist." },
            { before: "Die", answer: "Zahnbürste", after: "liegt im Bad.", clue: "Damit putzt du die Zähne." },
            { before: "Wir warten an der", answer: "Bushaltestelle", after: ".", clue: "Dort hält der Bus." },
            { before: "Nach dem Regen kam ein", answer: "Regenbogen", after: ".", clue: "Bunt und rund am Himmel." }
          ]
        }
      ]
    },

    {
      id: "merkwort-1",
      cycles: [1],
      step: "D.4.F.1.a",
      icon: "brain",
      chapters: [
        {
          id: "merkwort-1-1",
          kind: "memory",
          items: [
            { answer: "Mutter", clue: "Sie liest dir eine Geschichte vor." },
            { answer: "Vater", clue: "Er bringt dich ins Bett." },
            { answer: "Schule", clue: "Dort lernst du lesen und schreiben." },
            { answer: "Freund", clue: "Mit ihm spielst du am liebsten." },
            { answer: "Haus", clue: "Dort wohnst du." },
            { answer: "Baum", clue: "Er hat Äste und Blätter." },
            { answer: "Kind", clue: "So nennt man dich noch." },
            { answer: "Blume", clue: "Sie riecht gut und steht in der Vase." }
          ]
        },
        {
          id: "merkwort-1-2",
          kind: "memory",
          items: [
            { answer: "Bruder", clue: "Der Sohn deiner Eltern." },
            { answer: "Schwester", clue: "Die Tochter deiner Eltern." },
            { answer: "Garten", clue: "Dort wachsen Blumen und Gemüse." },
            { answer: "Fenster", clue: "Durch das schaust du hinaus." },
            { answer: "Winter", clue: "Die Jahreszeit mit Schnee." },
            { answer: "Sommer", clue: "Die Jahreszeit mit den langen Ferien." },
            { answer: "Vogel", clue: "Er hat Federn und fliegt." },
            { answer: "Wasser", clue: "Daraus trinkst du." }
          ]
        },
        {
          id: "merkwort-1-3",
          kind: "memory",
          items: [
            { answer: "Zimmer", clue: "Dort steht dein Bett." },
            { answer: "Strasse", clue: "Dort fahren die Autos." },
            { answer: "Schlüssel", clue: "Damit schliesst du die Tür auf." },
            { answer: "Kleider", clue: "Die ziehst du am Morgen an." },
            { answer: "Morgen", clue: "Die Zeit nach dem Aufstehen." },
            { answer: "Abend", clue: "Die Zeit vor dem Schlafen." }
          ]
        }
      ]
    },

    {
      id: "satzschluss",
      cycles: [1, 2],
      step: "D.4.F.1.a und .b",
      icon: "pilcrow",
      chapters: [
        {
          id: "satzschluss-1",
          kind: "punct",
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
          id: "satzschluss-2",
          kind: "punct",
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
          id: "satzschluss-3",
          kind: "copy",
          items: [
            { prompt: "Wo ist mein Ball", answer: "Wo ist mein Ball?" },
            { prompt: "Hilf mir bitte", answer: "Hilf mir bitte!" },
            { prompt: "Der Bus ist weg", answer: "Der Bus ist weg." },
            { prompt: "Wie alt bist du", answer: "Wie alt bist du?" },
            { prompt: "Pass gut auf", answer: "Pass gut auf!" },
            { prompt: "Wir essen jetzt", answer: "Wir essen jetzt." }
          ]
        }
      ]
    },

    {
      id: "sch",
      cycles: [1, 2],
      step: "D.4.F.1.b",
      icon: "spell-check",
      chapters: [
        {
          id: "sch-1",
          kind: "word",
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
          id: "sch-2",
          kind: "word",
          items: [
            { before: "", answer: "Sch", after: "littschuh", options: ["Sch", "Sh", "S"] },
            { before: "ra", answer: "sch", after: "", options: ["sch", "ch", "s"] },
            { before: "Ma", answer: "sch", after: "ine", options: ["sch", "ch", "s"] },
            { before: "Fro", answer: "sch", after: "", options: ["sch", "ch", "s"] },
            { before: "", answer: "Sch", after: "ublade", options: ["Sch", "Sh", "S"] },
            { before: "wün", answer: "sch", after: "en", options: ["sch", "ch", "s"] },
            { before: "Ta", answer: "sch", after: "enlampe", options: ["sch", "ch", "s"] },
            { before: "zwi", answer: "sch", after: "en", options: ["sch", "ch", "s"] }
          ]
        },
        {
          id: "sch-3",
          kind: "write",
          items: [
            { before: "Wir gehen in die", answer: "Schule", after: ".", clue: "Dort lernst du lesen und schreiben." },
            { before: "Auf dem", answer: "Tisch", after: "steht ein Glas.", clue: "Daran sitzt man beim Essen." },
            { before: "Im Winter fällt", answer: "Schnee", after: ".", clue: "Weiss und kalt." },
            { before: "Sie packt die", answer: "Tasche", after: ".", clue: "Darin trägst du deine Sachen." },
            { before: "Der", answer: "Frosch", after: "sitzt am Teich.", clue: "Er quakt und hüpft." },
            { before: "Er muss die Hände", answer: "waschen", after: ".", clue: "Mit Wasser und Seife sauber machen." }
          ]
        }
      ]
    },

    {
      id: "sp-st",
      cycles: [1, 2],
      step: "D.4.F.1.b",
      icon: "whole-word",
      chapters: [
        {
          id: "sp-st-1",
          kind: "word",
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
          id: "sp-st-2",
          kind: "word",
          items: [
            { before: "", answer: "St", after: "ein", options: ["St", "Scht"] },
            { before: "", answer: "Sp", after: "inne", options: ["Sp", "Schp"] },
            { before: "ver", answer: "sp", after: "rechen", options: ["sp", "schp"] },
            { before: "", answer: "St", after: "adt", options: ["St", "Scht"] },
            { before: "Ge", answer: "sp", after: "räch", options: ["sp", "schp"] },
            { before: "", answer: "St", after: "imme", options: ["St", "Scht"] },
            { before: "", answer: "Sp", after: "ass", options: ["Sp", "Schp"] },
            { before: "ver", answer: "st", after: "ecken", options: ["st", "scht"] }
          ]
        },
        {
          id: "sp-st-3",
          kind: "write",
          items: [
            { before: "Er treibt gern", answer: "Sport", after: ".", clue: "Fussball, Schwimmen, Turnen." },
            { before: "Am Himmel leuchtet ein", answer: "Stern", after: ".", clue: "Er funkelt in der Nacht." },
            { before: "Wir gehen über die", answer: "Strasse", after: ".", clue: "Dort fahren die Autos." },
            { before: "Die", answer: "Spinne", after: "webt ein Netz.", clue: "Sie hat acht Beine." },
            { before: "Sie schaut in den", answer: "Spiegel", after: ".", clue: "Darin siehst du dich selbst." },
            { before: "Die", answer: "Stunde", after: "ist gleich vorbei.", clue: "Sechzig Minuten." }
          ]
        }
      ]
    },

    {
      id: "ng-nk",
      cycles: [1, 2],
      step: "D.4.F.1.b",
      icon: "ear",
      chapters: [
        {
          id: "ng-nk-1",
          kind: "word",
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
          id: "ng-nk-2",
          kind: "word",
          items: [
            { before: "Zu", answer: "ng", after: "e", options: ["ng", "nk"] },
            { before: "Schla", answer: "ng", after: "e", options: ["ng", "nk"], clue: "sie kriecht und zischt" },
            { before: "O", answer: "nk", after: "el", options: ["ng", "nk"] },
            { before: "kra", answer: "nk", after: "", options: ["ng", "nk"] },
            { before: "Hu", answer: "ng", after: "er", options: ["ng", "nk"] },
            { before: "wi", answer: "nk", after: "en", options: ["ng", "nk"] },
            { before: "Pu", answer: "nk", after: "t", options: ["ng", "nk"] },
            { before: "Wa", answer: "ng", after: "e", options: ["ng", "nk"], clue: "im Gesicht, neben der Nase" }
          ]
        },
        {
          id: "ng-nk-3",
          kind: "write",
          items: [
            { before: "Der", answer: "Junge", after: "spielt draussen.", clue: "Ein Kind, kein Mädchen." },
            { before: "Wir sitzen auf der", answer: "Bank", after: ".", clue: "Im Park, zum Sitzen." },
            { before: "Sie kann schön", answer: "singen", after: ".", clue: "Das macht ein Chor." },
            { before: "Er hat grossen", answer: "Hunger", after: ".", clue: "Wenn du lange nichts gegessen hast." },
            { before: "Das Kind ist", answer: "krank", after: ".", clue: "Es hat Fieber und bleibt im Bett." },
            { before: "Am Satzende steht ein", answer: "Punkt", after: ".", clue: "Das kleine Zeichen am Satzende." }
          ]
        }
      ]
    },

    {
      id: "abstrakte-nomen",
      cycles: [1, 2],
      step: "D.4.F.1.b",
      icon: "cloud",
      chapters: [
        {
          id: "abstrakte-nomen-1",
          kind: "sentence",
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
          id: "abstrakte-nomen-2",
          kind: "sentence",
          items: [
            { before: "Er hat grossen", answer: "Hunger", after: ".", options: ["Hunger", "hunger"] },
            { before: "Sie hatte einen schönen", answer: "Traum", after: ".", options: ["Traum", "traum"] },
            { before: "Das war eine grosse", answer: "Hilfe", after: ".", options: ["Hilfe", "hilfe"] },
            { before: "Er sucht nach einer", answer: "Antwort", after: ".", options: ["Antwort", "antwort"] },
            { before: "Dafür braucht man viel", answer: "Geduld", after: ".", options: ["Geduld", "geduld"] },
            { before: "Sie hat viel", answer: "Kraft", after: ".", options: ["Kraft", "kraft"] },
            { before: "Der", answer: "Ärger", after: "war schnell vorbei.", options: ["Ärger", "ärger"] },
            { before: "Das ist nur die halbe", answer: "Wahrheit", after: ".", options: ["Wahrheit", "wahrheit"] }
          ]
        },
        {
          id: "abstrakte-nomen-3",
          kind: "write",
          items: [
            { before: "Sie hatte grosse", answer: "Angst", after: ".", clue: "Das Gefühl, wenn dir etwas unheimlich ist." },
            { before: "Er hat viel", answer: "Mut", after: "gezeigt.", clue: "Wenn du dich trotz Angst traust." },
            { before: "Die", answer: "Freude", after: "war riesig.", clue: "Das Gefühl, wenn du dich freust." },
            { before: "Wir brauchen mehr", answer: "Zeit", after: ".", clue: "Stunden und Minuten." },
            { before: "Sie hatte eine gute", answer: "Idee", after: ".", clue: "Ein guter Einfall." },
            { before: "Nach dem Lärm kam die", answer: "Ruhe", after: ".", clue: "Wenn es ganz still ist." }
          ]
        }
      ]
    },

    /* ══ Zyklus 2 ══ D.4.F.1.c, .d und .e ═══════════════════════════ */

    {
      id: "ie",
      cycles: [2],
      step: "D.4.F.1.c",
      icon: "move-horizontal",
      chapters: [
        {
          id: "ie-1",
          kind: "word",
          items: [
            { before: "Sp", answer: "ie", after: "l", options: ["ie", "i", "ih"] },
            { before: "Z", answer: "ie", after: "l", options: ["ie", "i", "ih"] },
            { before: "v", answer: "ie", after: "l", options: ["ie", "i", "ih"] },
            { before: "Br", answer: "ie", after: "f", options: ["ie", "i", "ih"] },
            { before: "L", answer: "ie", after: "be", options: ["ie", "i", "ih"] },
            { before: "t", answer: "ie", after: "f", options: ["ie", "i", "ih"] },
            { before: "W", answer: "ie", after: "se", options: ["ie", "i", "ih"] },
            { before: "s", answer: "ie", after: "ben", options: ["ie", "i", "ih"] }
          ]
        },
        {
          id: "ie-2",
          kind: "word",
          items: [
            { before: "B", answer: "i", after: "ld", options: ["i", "ie", "ih"] },
            { before: "K", answer: "i", after: "nd", options: ["i", "ie", "ih"] },
            { before: "sp", answer: "ie", after: "len", options: ["ie", "i", "ih"] },
            { before: "n", answer: "ie", after: "mand", options: ["ie", "i", "ih"] },
            { before: "W", answer: "i", after: "nter", options: ["i", "ie", "ih"] },
            { before: "fl", answer: "ie", after: "gen", options: ["ie", "i", "ih"] },
            { before: "F", answer: "i", after: "sch", options: ["i", "ie", "ih"] },
            { before: "verl", answer: "ie", after: "ren", options: ["ie", "i", "ih"] }
          ]
        },
        {
          id: "ie-3",
          kind: "write",
          items: [
            { before: "Wir spielen ein", answer: "Spiel", after: ".", clue: "Mit Würfel und Figuren." },
            { before: "Er schreibt einen", answer: "Brief", after: ".", clue: "Den steckst du in einen Umschlag." },
            { before: "Das Wasser ist sehr", answer: "tief", after: ".", clue: "Das Gegenteil von flach." },
            { before: "Auf der", answer: "Wiese", after: "grasen Kühe.", clue: "Grüne Fläche voller Gras." },
            { before: "Sie hat", answer: "sieben", after: "Murmeln.", clue: "Die Zahl zwischen sechs und acht." },
            { before: "Die Vögel", answer: "fliegen", after: "nach Süden.", clue: "Was Vögel mit den Flügeln machen." }
          ]
        }
      ]
    },

    {
      id: "e-ae",
      cycles: [2],
      step: "D.4.F.1.c",
      icon: "link",
      chapters: [
        {
          id: "e-ae-1",
          kind: "word",
          items: [
            { before: "H", answer: "ä", after: "nde", options: ["ä", "e"], clue: "kommt von Hand" },
            { before: "B", answer: "ä", after: "cker", options: ["ä", "e"], clue: "kommt von backen" },
            { before: "k", answer: "ä", after: "lter", options: ["ä", "e"], clue: "kommt von kalt" },
            { before: "W", answer: "ä", after: "lder", options: ["ä", "e"], clue: "kommt von Wald" },
            { before: "st", answer: "ä", after: "rker", options: ["ä", "e"], clue: "kommt von stark" },
            { before: "L", answer: "ä", after: "nder", options: ["ä", "e"], clue: "kommt von Land" },
            { before: "N", answer: "ä", after: "chte", options: ["ä", "e"], clue: "kommt von Nacht" },
            { before: "Gl", answer: "ä", after: "ser", options: ["ä", "e"], clue: "kommt von Glas" }
          ]
        },
        {
          id: "e-ae-2",
          kind: "word",
          items: [
            { before: "M", answer: "e", after: "nsch", options: ["e", "ä"] },
            { before: "L", answer: "e", after: "hrer", options: ["e", "ä"] },
            { before: "B", answer: "e", after: "rg", options: ["e", "ä"] },
            { before: "F", answer: "e", after: "nster", options: ["e", "ä"] },
            { before: "h", answer: "e", after: "lfen", options: ["e", "ä"] },
            { before: "St", answer: "e", after: "rn", options: ["e", "ä"] },
            { before: "w", answer: "e", after: "rfen", options: ["e", "ä"] },
            { before: "T", answer: "e", after: "ller", options: ["e", "ä"] }
          ]
        },
        {
          id: "e-ae-3",
          kind: "write",
          items: [
            { before: "Wasch dir die", answer: "Hände", after: ".", clue: "Verlängere: eine Hand, zwei ..." },
            { before: "Der", answer: "Bäcker", after: "backt Brot.", clue: "Von backen. Er macht Brot und Gipfeli." },
            { before: "Heute ist es", answer: "kälter", after: "als gestern.", clue: "Von kalt." },
            { before: "Die", answer: "Wälder", after: "sind hier gross.", clue: "Von Wald, Mehrzahl." },
            { before: "Die", answer: "Gläser", after: "stehen im Schrank.", clue: "Von Glas, Mehrzahl." },
            { before: "Im Winter sind die", answer: "Nächte", after: "lang.", clue: "Von Nacht, Mehrzahl." }
          ]
        }
      ]
    },

    {
      id: "komma-aufzaehlung",
      cycles: [2],
      step: "D.4.F.1.c",
      icon: "list",
      chapters: [
        {
          id: "komma-aufzaehlung-1",
          kind: "punct",
          emptyOptionKey: "optionNoComma",
          items: [
            { before: "Ich kaufe Brot", answer: ",", after: "Milch und Butter.", options: [",", ""] },
            { before: "Ich kaufe Brot, Milch", answer: "", after: "und Butter.", options: [",", ""] },
            { before: "Sie mag Hunde", answer: ",", after: "Katzen und Pferde.", options: [",", ""] },
            { before: "Wir packen Ball, Tuch", answer: "", after: "und Sonnencreme ein.", options: [",", ""] },
            { before: "Er hat einen Bruder", answer: ",", after: "zwei Schwestern und einen Hund.", options: [",", ""] },
            { before: "Auf dem Tisch stehen Teller, Gläser", answer: "", after: "und Besteck.", options: [",", ""] },
            { before: "Im Garten wachsen Äpfel", answer: ",", after: "Birnen und Beeren.", options: [",", ""] },
            { before: "Sie liest Bücher, Comics", answer: "", after: "und Zeitungen.", options: [",", ""] }
          ]
        },
        {
          id: "komma-aufzaehlung-2",
          kind: "punct",
          emptyOptionKey: "optionNoComma",
          items: [
            { before: "Der Hund ist gross", answer: ",", after: "stark und laut.", options: [",", ""] },
            { before: "Das Zimmer ist hell, warm", answer: "", after: "und gemütlich.", options: [",", ""] },
            { before: "Wir waren in Bern", answer: ",", after: "Zürich und Basel.", options: [",", ""] },
            { before: "Sie kann rechnen, lesen", answer: "", after: "und schreiben.", options: [",", ""] },
            { before: "Er nimmt Stift", answer: ",", after: "Heft und Lineal mit.", options: [",", ""] },
            { before: "Die Fahne ist rot", answer: ",", after: "weiss und blau.", options: [",", ""] },
            { before: "Wir essen Suppe, Salat", answer: "", after: "und Brot.", options: [",", ""] },
            { before: "Im Sack sind Nüsse, Äpfel", answer: "", after: "und Kekse.", options: [",", ""] }
          ]
        },
        {
          id: "komma-aufzaehlung-3",
          kind: "copy",
          items: [
            { prompt: "Ich kaufe Brot Milch und Butter", answer: "Ich kaufe Brot, Milch und Butter." },
            { prompt: "Sie mag Hunde Katzen und Pferde", answer: "Sie mag Hunde, Katzen und Pferde." },
            { prompt: "Wir waren in Bern Zürich und Basel", answer: "Wir waren in Bern, Zürich und Basel." },
            { prompt: "Er nimmt Stift Heft und Lineal mit", answer: "Er nimmt Stift, Heft und Lineal mit." },
            { prompt: "Die Fahne ist rot weiss und blau", answer: "Die Fahne ist rot, weiss und blau." },
            { prompt: "Wir essen Suppe Salat und Brot", answer: "Wir essen Suppe, Salat und Brot." }
          ]
        }
      ]
    },

    {
      id: "wortstamm",
      cycles: [2],
      step: "D.4.F.1.d",
      icon: "sprout",
      chapters: [
        {
          id: "wortstamm-1",
          kind: "word",
          items: [
            { before: "Hun", answer: "d", after: "", options: ["d", "t"], clue: "viele Hunde" },
            { before: "Ber", answer: "g", after: "", options: ["g", "k"], clue: "viele Berge" },
            { before: "Kin", answer: "d", after: "", options: ["d", "t"], clue: "viele Kinder" },
            { before: "Kor", answer: "b", after: "", options: ["b", "p"], clue: "viele Körbe" },
            { before: "Wal", answer: "d", after: "", options: ["d", "t"], clue: "viele Wälder" },
            { before: "Zwer", answer: "g", after: "", options: ["g", "k"], clue: "viele Zwerge" },
            { before: "gel", answer: "b", after: "", options: ["b", "p"], clue: "ein gelbes Auto" },
            { before: "Freun", answer: "d", after: "", options: ["d", "t"], clue: "viele Freunde" }
          ]
        },
        {
          id: "wortstamm-2",
          kind: "word",
          items: [
            { before: "Sie", answer: "b", after: "", options: ["b", "p"], clue: "viele Siebe" },
            { before: "Zu", answer: "g", after: "", options: ["g", "k"], clue: "viele Züge" },
            { before: "Ra", answer: "d", after: "", options: ["d", "t"], clue: "viele Räder" },
            { before: "Sta", answer: "b", after: "", options: ["b", "p"], clue: "viele Stäbe" },
            { before: "Bur", answer: "g", after: "", options: ["g", "k"], clue: "viele Burgen" },
            { before: "Hem", answer: "d", after: "", options: ["d", "t"], clue: "viele Hemden" },
            { before: "lie", answer: "b", after: "", options: ["b", "p"], clue: "ein liebes Kind" },
            { before: "We", answer: "g", after: "", options: ["g", "k"], clue: "viele Wege" }
          ]
        },
        {
          id: "wortstamm-3",
          kind: "write",
          items: [
            { before: "Der", answer: "Hund", after: "bellt laut.", clue: "Verlängere: viele Hunde." },
            { before: "Wir steigen auf den", answer: "Berg", after: ".", clue: "Verlängere: viele Berge." },
            { before: "Der", answer: "Zug", after: "fährt gleich ab.", clue: "Verlängere: viele Züge." },
            { before: "Das", answer: "Rad", after: "ist kaputt.", clue: "Verlängere: viele Räder." },
            { before: "Im", answer: "Wald", after: "ist es kühl.", clue: "Verlängere: viele Wälder." },
            { before: "Mein bester", answer: "Freund", after: "kommt mit.", clue: "Verlängere: viele Freunde." }
          ]
        }
      ]
    },

    {
      id: "doppelkonsonant",
      cycles: [2],
      step: "D.4.F.1.d",
      icon: "copy",
      chapters: [
        {
          id: "doppelkonsonant-1",
          kind: "word",
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
          id: "doppelkonsonant-2",
          kind: "word",
          items: [
            { before: "Adr", answer: "ess", after: "e", options: ["ess", "es"] },
            { before: "So", answer: "mm", after: "er", options: ["mm", "m"] },
            { before: "Ka", answer: "nn", after: "e", options: ["nn", "n"] },
            { before: "Ha", answer: "mm", after: "er", options: ["mm", "m"] },
            { before: "ti", answer: "pp", after: "en", options: ["pp", "p"] },
            { before: "bre", answer: "nn", after: "en", options: ["nn", "n"] },
            { before: "Ka", answer: "ff", after: "ee", options: ["ff", "f"] },
            { before: "Schi", answer: "ff", after: "", options: ["ff", "f"] }
          ]
        },
        {
          id: "doppelkonsonant-3",
          kind: "write",
          items: [
            { before: "Die", answer: "Sonne", after: "scheint.", clue: "Sie steht am Himmel und wärmt." },
            { before: "Das", answer: "Wasser", after: "ist eiskalt.", clue: "Daraus trinkst du." },
            { before: "Im", answer: "Sommer", after: "ist es warm.", clue: "Die Jahreszeit mit den langen Ferien." },
            { before: "Wir essen", answer: "Suppe", after: ".", clue: "Warm und flüssig, mit dem Löffel." },
            { before: "Mein", answer: "Zimmer", after: "ist aufgeräumt.", clue: "Dort steht dein Bett." },
            { before: "Das", answer: "Schiff", after: "fährt über den See.", clue: "Es schwimmt und trägt Menschen." }
          ]
        }
      ]
    },

    {
      id: "komma-teilsatz",
      cycles: [2],
      step: "D.4.F.1.d",
      icon: "pause",
      chapters: [
        {
          id: "komma-teilsatz-1",
          kind: "punct",
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
          id: "komma-teilsatz-2",
          kind: "punct",
          emptyOptionKey: "optionNoComma",
          items: [
            { before: "Er kam später", answer: ",", after: "weil der Bus Verspätung hatte.", options: [",", ""] },
            { before: "Nach der Schule", answer: "", after: "gehen wir schwimmen.", options: [",", ""] },
            { before: "Sie fragte", answer: ",", after: "ob wir mitkommen.", options: [",", ""] },
            { before: "Wir standen früh auf", answer: "", after: "und packten die Taschen.", options: [",", ""] },
            { before: "Er weiss nicht", answer: ",", after: "wann der Zug fährt.", options: [",", ""] },
            { before: "Am Wochenende", answer: "", after: "besuchen wir die Grosseltern.", options: [",", ""] },
            { before: "Sie bleibt sitzen", answer: ",", after: "bis der Regen aufhört.", options: [",", ""] },
            { before: "Sie räumte auf", answer: "", after: "und ging dann los.", options: [",", ""] }
          ]
        },
        {
          id: "komma-teilsatz-3",
          kind: "copy",
          items: [
            { prompt: "Er bleibt zu Hause weil er krank ist", answer: "Er bleibt zu Hause, weil er krank ist." },
            { prompt: "Ich weiss dass du das kannst", answer: "Ich weiss, dass du das kannst." },
            { prompt: "Sie freut sich wenn du kommst", answer: "Sie freut sich, wenn du kommst." },
            { prompt: "Wir warten bis der Regen aufhört", answer: "Wir warten, bis der Regen aufhört." },
            { prompt: "Er fragt ob wir Zeit haben", answer: "Er fragt, ob wir Zeit haben." },
            { prompt: "Sie ging früh schlafen damit sie fit ist", answer: "Sie ging früh schlafen, damit sie fit ist." }
          ]
        }
      ]
    },

    {
      id: "nachmorpheme",
      cycles: [2],
      step: "D.4.F.1.e",
      icon: "case-upper",
      chapters: [
        {
          id: "nachmorpheme-1",
          kind: "sentence",
          items: [
            { before: "Er wünscht sich", answer: "Freiheit", after: ".", options: ["Freiheit", "freiheit"] },
            { before: "Die", answer: "Entdeckung", after: "war wichtig.", options: ["Entdeckung", "entdeckung"] },
            { before: "Sie zeigt grosse", answer: "Freundlichkeit", after: ".", options: ["Freundlichkeit", "freundlichkeit"] },
            { before: "Die", answer: "Mannschaft", after: "hat gewonnen.", options: ["Mannschaft", "mannschaft"] },
            { before: "Die", answer: "Rechnung", after: "ist bezahlt.", options: ["Rechnung", "rechnung"] },
            { before: "Seine", answer: "Krankheit", after: "ist vorbei.", options: ["Krankheit", "krankheit"] },
            { before: "Die", answer: "Übung", after: "war schwer.", options: ["Übung", "übung"] },
            { before: "Ihre", answer: "Ehrlichkeit", after: "hilft ihr.", options: ["Ehrlichkeit", "ehrlichkeit"] }
          ]
        },
        {
          id: "nachmorpheme-2",
          kind: "word",
          items: [
            { before: "Frei", answer: "heit", after: "", options: ["heit", "keit", "ung"] },
            { before: "Freundlich", answer: "keit", after: "", options: ["keit", "heit", "ung"] },
            { before: "Rechn", answer: "ung", after: "", options: ["ung", "heit", "keit"] },
            { before: "Mann", answer: "schaft", after: "", options: ["schaft", "heit", "ung"] },
            { before: "Krank", answer: "heit", after: "", options: ["heit", "keit", "ung"] },
            { before: "Möglich", answer: "keit", after: "", options: ["keit", "heit", "ung"] },
            { before: "Wohn", answer: "ung", after: "", options: ["ung", "heit", "keit"] },
            { before: "Freund", answer: "schaft", after: "", options: ["schaft", "heit", "keit"] }
          ]
        },
        {
          id: "nachmorpheme-3",
          kind: "write",
          items: [
            { before: "Die", answer: "Wohnung", after: "liegt im dritten Stock.", clue: "Von wohnen. Dort lebt eine Familie." },
            { before: "Ihre", answer: "Freundschaft", after: "hält schon lange.", clue: "Von Freund." },
            { before: "Die", answer: "Übung", after: "war schwer.", clue: "Von üben." },
            { before: "Seine", answer: "Krankheit", after: "ist vorbei.", clue: "Von krank." },
            { before: "Die", answer: "Mannschaft", after: "hat gewonnen.", clue: "Von Mann. Ein Team im Sport." },
            { before: "Sie sucht die", answer: "Freiheit", after: ".", clue: "Von frei." }
          ]
        }
      ]
    },

    {
      id: "merkwort-2",
      cycles: [2],
      step: null,
      icon: "brain",
      chapters: [
        {
          id: "merkwort-2-1",
          kind: "memory",
          items: [
            { answer: "Fahrrad", clue: "Damit fährst du zur Schule." },
            { answer: "Theater", clue: "Dort spielt man Stücke auf einer Bühne." },
            { answer: "Geschichte", clue: "Die erzählt dir jemand vor dem Schlafen." },
            { answer: "Zwiebel", clue: "Beim Schneiden musst du weinen." },
            { answer: "Kalender", clue: "Dort stehen alle Tage des Jahres." },
            { answer: "Verkehr", clue: "Auf der Strasse ist morgens viel davon." },
            { answer: "Nachbar", clue: "Er wohnt gleich neben dir." },
            { answer: "Familie", clue: "Eltern, Kinder, Geschwister zusammen." }
          ]
        },
        {
          id: "merkwort-2-2",
          kind: "memory",
          items: [
            { answer: "Kartoffel", clue: "Sie wächst in der Erde, man macht Pommes daraus." },
            { answer: "Schokolade", clue: "Braun, süss, in Tafeln." },
            { answer: "Gemüse", clue: "Rüebli, Broccoli und Salat gehören dazu." },
            { answer: "Fahrkarte", clue: "Die brauchst du im Zug." },
            { answer: "Handtuch", clue: "Damit trocknest du dich ab." },
            { answer: "Werkstatt", clue: "Dort wird gehämmert und repariert." },
            { answer: "Nachmittag", clue: "Die Zeit nach dem Mittagessen." },
            { answer: "Vergnügen", clue: "Ein anderes Wort für Freude." }
          ]
        },
        {
          id: "merkwort-2-3",
          kind: "memory",
          items: [
            { answer: "Gewitter", clue: "Blitz und Donner zusammen." },
            { answer: "Werkzeug", clue: "Hammer, Zange und Schraubenzieher." },
            { answer: "Anfang", clue: "Das Gegenteil von Ende." },
            { answer: "Gespräch", clue: "Wenn zwei miteinander reden." },
            { answer: "Verkäufer", clue: "Er steht im Laden hinter der Kasse." },
            { answer: "Umgebung", clue: "Alles, was rund um einen Ort liegt." }
          ]
        }
      ]
    },

    /* ══ Zyklus 3 ══ ergänzende Rechtschreibung ═════════════════════ */

    {
      id: "dehnung",
      cycles: [3],
      step: null,
      icon: "move-horizontal",
      chapters: [
        {
          id: "dehnung-1",
          kind: "word",
          items: [
            { before: "F", answer: "ah", after: "rrad", options: ["ah", "a", "aa"] },
            { before: "B", answer: "ah", after: "n", options: ["ah", "a", "aa"] },
            { before: "B", answer: "oo", after: "t", options: ["oo", "o", "oh"] },
            { before: "M", answer: "ee", after: "r", options: ["ee", "e", "eh"] },
            { before: "w", answer: "oh", after: "nen", options: ["oh", "o", "oo"] },
            { before: "S", answer: "oh", after: "n", options: ["oh", "o", "oo"] },
            { before: "Z", answer: "ah", after: "n", options: ["ah", "a", "aa"] },
            { before: "S", answer: "aa", after: "l", options: ["aa", "a", "ah"] }
          ]
        },
        {
          id: "dehnung-2",
          kind: "word",
          items: [
            { before: "St", answer: "uh", after: "l", options: ["uh", "u", "uu"] },
            { before: "K", answer: "uh", after: "", options: ["uh", "u"] },
            { before: "n", answer: "eh", after: "men", options: ["eh", "e", "ee"] },
            { before: "T", answer: "ee", after: "", options: ["ee", "e", "eh"] },
            { before: "l", answer: "ee", after: "r", options: ["ee", "e", "eh"] },
            { before: "z", answer: "eh", after: "n", options: ["eh", "e", "ee"] },
            { before: "R", answer: "uh", after: "e", options: ["uh", "u", "uu"] },
            { before: "W", answer: "ah", after: "l", options: ["ah", "a", "aa"] }
          ]
        },
        {
          id: "dehnung-3",
          kind: "write",
          items: [
            { before: "Sie fährt mit dem", answer: "Fahrrad", after: ".", clue: "Zwei Räder und Pedale." },
            { before: "Das", answer: "Boot", after: "liegt am Ufer.", clue: "Es schwimmt auf dem Wasser." },
            { before: "Wir fahren ans", answer: "Meer", after: ".", clue: "Sehr grosses, salziges Wasser." },
            { before: "Er sitzt auf dem", answer: "Stuhl", after: ".", clue: "Darauf sitzt man am Tisch." },
            { before: "Sie trinkt einen", answer: "Tee", after: ".", clue: "Heisses Getränk aus Kräutern." },
            { before: "Nach dem Lärm braucht er", answer: "Ruhe", after: ".", clue: "Wenn es ganz still ist." }
          ]
        }
      ]
    },

    {
      id: "nominalisierung",
      cycles: [3],
      step: null,
      icon: "case-upper",
      chapters: [
        {
          id: "nominalisierung-1",
          kind: "sentence",
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
          id: "nominalisierung-2",
          kind: "sentence",
          items: [
            { before: "Beim", answer: "Warten", after: "wurde ihm kalt.", options: ["Warten", "warten"] },
            { before: "Sie hat nichts", answer: "Besseres", after: "gefunden.", options: ["Besseres", "besseres"] },
            { before: "Das", answer: "Schwimmen", after: "macht ihm Spass.", options: ["Schwimmen", "schwimmen"] },
            { before: "Zum", answer: "Lesen", after: "braucht sie Licht.", options: ["Lesen", "lesen"] },
            { before: "Sie erzählt etwas", answer: "Lustiges", after: ".", options: ["Lustiges", "lustiges"] },
            { before: "Beim", answer: "Kochen", after: "hört er Radio.", options: ["Kochen", "kochen"] },
            { before: "Es gibt viel", answer: "Interessantes", after: "zu sehen.", options: ["Interessantes", "interessantes"] },
            { before: "Das", answer: "Üben", after: "lohnt sich.", options: ["Üben", "üben"] }
          ]
        },
        {
          id: "nominalisierung-3",
          kind: "write",
          items: [
            { before: "Beim", answer: "Laufen", after: "hörte er Musik.", clue: "Von laufen. Nach beim wird es gross." },
            { before: "Das", answer: "Lernen", after: "fällt ihm leicht.", clue: "Von lernen. Nach das wird es gross." },
            { before: "Sie hat etwas", answer: "Schönes", after: "erlebt.", clue: "Von schön. Nach etwas wird es gross." },
            { before: "Zum", answer: "Essen", after: "gibt es Suppe.", clue: "Von essen. Nach zum wird es gross." },
            { before: "Er hat viel", answer: "Neues", after: "gelernt.", clue: "Von neu. Nach viel wird es gross." },
            { before: "Beim", answer: "Schwimmen", after: "wird ihm warm.", clue: "Von schwimmen. Nach beim wird es gross." }
          ]
        }
      ]
    },

    {
      id: "das-dass",
      cycles: [3],
      step: null,
      icon: "split",
      chapters: [
        {
          id: "das-dass-1",
          kind: "sentence",
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
          id: "das-dass-2",
          kind: "sentence",
          items: [
            { before: "Sie hofft,", answer: "dass", after: "es klappt.", options: ["das", "dass"] },
            { before: "Er legt", answer: "das", after: "Heft auf den Tisch.", options: ["das", "dass"] },
            { before: "Es ärgert ihn,", answer: "dass", after: "niemand hilft.", options: ["das", "dass"] },
            { before: "Das Haus,", answer: "das", after: "am See steht, ist alt.", options: ["das", "dass"] },
            { before: "Ich denke,", answer: "dass", after: "wir zu spät sind.", options: ["das", "dass"] },
            { before: "Wir haben", answer: "das", after: "Spiel verloren.", options: ["das", "dass"] },
            { before: "Sie merkte,", answer: "dass", after: "etwas fehlte.", options: ["das", "dass"] },
            { before: "Zeig mir", answer: "das", after: "Bild noch einmal.", options: ["das", "dass"] }
          ]
        },
        {
          id: "das-dass-3",
          kind: "write",
          items: [
            { before: "Sie sagt,", answer: "dass", after: "sie müde ist.", clue: "Ersatzprobe: dieses passt hier nicht." },
            { before: "Er hat", answer: "das", after: "Fenster geöffnet.", clue: "Ersatzprobe: dieses Fenster." },
            { before: "Wir wissen,", answer: "dass", after: "es regnet.", clue: "Ersatzprobe: dieses passt hier nicht." },
            { before: "Das Auto,", answer: "das", after: "dort steht, ist neu.", clue: "Ersatzprobe: welches dort steht." },
            { before: "Ich glaube,", answer: "dass", after: "er recht hat.", clue: "Ersatzprobe: dieses passt hier nicht." },
            { before: "Nimm", answer: "das", after: "Buch aus dem Regal.", clue: "Ersatzprobe: dieses Buch." }
          ]
        }
      ]
    },

    {
      id: "endung",
      cycles: [3],
      step: null,
      icon: "text-cursor-input",
      chapters: [
        {
          id: "endung-1",
          kind: "word",
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
          id: "endung-2",
          kind: "word",
          items: [
            { before: "kind", answer: "lich", after: "", options: ["lich", "ig", "isch"] },
            { before: "neid", answer: "isch", after: "", options: ["isch", "lich", "ig"] },
            { before: "vorsicht", answer: "ig", after: "", options: ["ig", "lich", "isch"] },
            { before: "herz", answer: "lich", after: "", options: ["lich", "ig", "isch"] },
            { before: "prakt", answer: "isch", after: "", options: ["isch", "ig", "lich"] },
            { before: "günst", answer: "ig", after: "", options: ["ig", "lich", "isch"] },
            { before: "natür", answer: "lich", after: "", options: ["lich", "ig", "isch"] },
            { before: "typ", answer: "isch", after: "", options: ["isch", "ig", "lich"] }
          ]
        },
        {
          id: "endung-3",
          kind: "write",
          items: [
            { before: "Er ist immer sehr", answer: "freundlich", after: ".", clue: "Verlängere: eine freundliche Person." },
            { before: "Das ist wirklich", answer: "wichtig", after: ".", clue: "Verlängere: eine wichtige Sache." },
            { before: "Sie putzt sich", answer: "täglich", after: "die Zähne.", clue: "Jeden Tag." },
            { before: "Der Film war sehr", answer: "lustig", after: ".", clue: "Verlängere: ein lustiger Film." },
            { before: "Sei bitte", answer: "ehrlich", after: ".", clue: "Verlängere: eine ehrliche Antwort." },
            { before: "Deine Antwort ist", answer: "richtig", after: ".", clue: "Verlängere: die richtige Antwort." }
          ]
        }
      ]
    },

    {
      id: "fremdwort",
      cycles: [3],
      step: null,
      icon: "globe",
      chapters: [
        {
          id: "fremdwort-1",
          kind: "memory",
          items: [
            { answer: "Rhythmus", clue: "Der Takt in der Musik." },
            { answer: "Physik", clue: "Das Fach über Kräfte und Energie." },
            { answer: "Restaurant", clue: "Dort isst man auswärts." },
            { answer: "Interview", clue: "Ein Gespräch mit Fragen und Antworten." },
            { answer: "Ingenieur", clue: "Dieser Beruf baut Brücken und Maschinen." },
            { answer: "Orchester", clue: "Viele Musiker spielen zusammen." },
            { answer: "Charakter", clue: "Die Art, wie ein Mensch ist." },
            { answer: "Garage", clue: "Dort steht das Auto." }
          ]
        },
        {
          id: "fremdwort-2",
          kind: "memory",
          items: [
            { answer: "Computer", clue: "Damit schreibst du und suchst im Netz." },
            { answer: "Ticket", clue: "Das brauchst du für Zug oder Kino." },
            { answer: "Baguette", clue: "Ein langes, dünnes Brot aus Frankreich." },
            { answer: "Champignon", clue: "Ein weisser Pilz aus dem Laden." },
            { answer: "Balkon", clue: "Der kleine Platz draussen an der Wohnung." },
            { answer: "Journalist", clue: "Dieser Beruf schreibt für die Zeitung." },
            { answer: "Karussell", clue: "Es dreht sich an der Chilbi." },
            { answer: "Chance", clue: "Eine Gelegenheit, die sich bietet." }
          ]
        },
        {
          id: "fremdwort-3",
          kind: "memory",
          items: [
            { answer: "Atmosphäre", clue: "Die Lufthülle um die Erde." },
            { answer: "Rezept", clue: "Darin steht, wie man ein Essen kocht." },
            { answer: "Theorie", clue: "Der Teil vor der Praxis." },
            { answer: "Kompass", clue: "Die Nadel zeigt immer nach Norden." },
            { answer: "Passagier", clue: "Ein Mensch, der mitfährt oder mitfliegt." },
            { answer: "Symbol", clue: "Ein Zeichen, das für etwas steht." }
          ]
        }
      ]
    }

  ],

  // Texts for the writing mode. Nothing is tapped here: the child
  // writes the whole thing, sentence by sentence, and the paragraph
  // takes shape on screen as it goes.
  //
  // The prompt is the text as someone would type it in a hurry: all
  // lowercase, no punctuation. It is never a misspelling — a child must
  // not be shown a wrongly spelled word. That is why the writing mode
  // exercises capitals, end marks and commas, and why `rules` lists
  // only those. Word spellings are still practised, because every
  // letter is typed out by hand.
  //
  // A sentence stays under about 65 characters, so one auto-check at
  // the end stays a fair unit to be judged on.
  texts: [
    /* ── Zyklus 1 ── */
    {
      id: "schulweg",
      cycles: [1],
      rules: ["satzanfang", "nomen-gross", "satzschluss"],
      sentences: [
        { prompt: "am morgen gehe ich zur schule", answer: "Am Morgen gehe ich zur Schule." },
        { prompt: "mein bruder kommt mit", answer: "Mein Bruder kommt mit." },
        { prompt: "wir warten an der bushaltestelle", answer: "Wir warten an der Bushaltestelle." },
        { prompt: "wo ist mein turnbeutel", answer: "Wo ist mein Turnbeutel?" }
      ]
    },
    {
      id: "garten",
      cycles: [1],
      rules: ["satzanfang", "nomen-gross", "satzschluss"],
      sentences: [
        { prompt: "die sonne scheint warm", answer: "Die Sonne scheint warm." },
        { prompt: "im garten blühen viele blumen", answer: "Im Garten blühen viele Blumen." },
        { prompt: "mein vater giesst die beete", answer: "Mein Vater giesst die Beete." },
        { prompt: "hilfst du mir", answer: "Hilfst du mir?" }
      ]
    },
    {
      id: "katze",
      cycles: [1],
      rules: ["satzanfang", "nomen-gross", "satzschluss"],
      sentences: [
        { prompt: "unsere katze heisst mimi", answer: "Unsere Katze heisst Mimi." },
        { prompt: "sie schläft den ganzen tag", answer: "Sie schläft den ganzen Tag." },
        { prompt: "am abend will sie futter", answer: "Am Abend will sie Futter." },
        { prompt: "komm schnell her", answer: "Komm schnell her!" }
      ]
    },

    /* ── Zyklus 2 ── */
    {
      id: "einkauf",
      cycles: [2],
      rules: ["satzanfang", "nomen-gross", "komma-aufzaehlung", "satzschluss"],
      sentences: [
        { prompt: "wir gehen zusammen einkaufen", answer: "Wir gehen zusammen einkaufen." },
        { prompt: "auf dem zettel stehen brot milch und butter", answer: "Auf dem Zettel stehen Brot, Milch und Butter." },
        { prompt: "meine mutter nimmt noch äpfel birnen und nüsse mit", answer: "Meine Mutter nimmt noch Äpfel, Birnen und Nüsse mit." },
        { prompt: "an der kasse ist eine lange schlange", answer: "An der Kasse ist eine lange Schlange." },
        { prompt: "hast du das geld dabei", answer: "Hast du das Geld dabei?" }
      ]
    },
    {
      id: "gewitter",
      cycles: [2],
      rules: ["satzanfang", "nomen-gross", "abstrakte-nomen", "komma-teilsatz", "satzschluss"],
      sentences: [
        { prompt: "am nachmittag zog ein gewitter auf", answer: "Am Nachmittag zog ein Gewitter auf." },
        { prompt: "wir blieben zu hause weil es stark regnete", answer: "Wir blieben zu Hause, weil es stark regnete." },
        { prompt: "meine schwester hatte grosse angst", answer: "Meine Schwester hatte grosse Angst." },
        { prompt: "nach einer stunde kam die sonne zurück", answer: "Nach einer Stunde kam die Sonne zurück." },
        { prompt: "was für ein glück", answer: "Was für ein Glück!" }
      ]
    },
    {
      id: "ausflug",
      cycles: [2],
      rules: ["satzanfang", "nomen-gross", "komma-aufzaehlung", "komma-teilsatz", "satzschluss"],
      sentences: [
        { prompt: "am samstag machten wir einen ausflug", answer: "Am Samstag machten wir einen Ausflug." },
        { prompt: "wir packten brote früchte und getränke ein", answer: "Wir packten Brote, Früchte und Getränke ein." },
        { prompt: "wir waren müde weil der weg steil war", answer: "Wir waren müde, weil der Weg steil war." },
        { prompt: "oben assen wir unser picknick", answer: "Oben assen wir unser Picknick." },
        { prompt: "wann gehen wir wieder", answer: "Wann gehen wir wieder?" }
      ]
    },

    /* ── Zyklus 3 ── */
    {
      id: "probe",
      cycles: [3],
      rules: ["nomen-gross", "nominalisierung", "komma-teilsatz", "satzschluss"],
      sentences: [
        { prompt: "das lernen fiel ihm diesmal leicht", answer: "Das Lernen fiel ihm diesmal leicht." },
        { prompt: "er wusste dass die probe am montag stattfand", answer: "Er wusste, dass die Probe am Montag stattfand." },
        { prompt: "beim üben hörte er musik", answer: "Beim Üben hörte er Musik." },
        { prompt: "am morgen war er trotzdem nervös", answer: "Am Morgen war er trotzdem nervös." },
        { prompt: "alles ging gut weil er sich vorbereitet hatte", answer: "Alles ging gut, weil er sich vorbereitet hatte." }
      ]
    },
    {
      id: "museum",
      cycles: [3],
      rules: ["nomen-gross", "nominalisierung", "komma-teilsatz", "satzschluss"],
      sentences: [
        { prompt: "am mittwoch besuchten wir das museum", answer: "Am Mittwoch besuchten wir das Museum." },
        { prompt: "das buch das im schaufenster lag war sehr alt", answer: "Das Buch, das im Schaufenster lag, war sehr alt." },
        { prompt: "beim betrachten der bilder wurde es still", answer: "Beim Betrachten der Bilder wurde es still." },
        { prompt: "wir sahen viel interessantes", answer: "Wir sahen viel Interessantes." },
        { prompt: "ich hoffe dass wir bald wiederkommen", answer: "Ich hoffe, dass wir bald wiederkommen." }
      ]
    },
    {
      id: "velo",
      cycles: [3],
      rules: ["nomen-gross", "nominalisierung", "komma-teilsatz", "satzschluss"],
      sentences: [
        { prompt: "zum geburtstag bekam sie das velo das sie sich wünschte", answer: "Zum Geburtstag bekam sie das Velo, das sie sich wünschte." },
        { prompt: "das fahren machte ihr sofort spass", answer: "Das Fahren machte ihr sofort Spass." },
        { prompt: "sie merkte dass die bremsen zu schwach waren", answer: "Sie merkte, dass die Bremsen zu schwach waren." },
        { prompt: "ihr vater stellte sie ein damit alles sicher war", answer: "Ihr Vater stellte sie ein, damit alles sicher war." },
        { prompt: "nichts schöneres hätte sie sich wünschen können", answer: "Nichts Schöneres hätte sie sich wünschen können." }
      ]
    }
  ]
};
