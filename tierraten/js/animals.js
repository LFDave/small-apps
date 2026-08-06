// animals.js — the fact table. One entry per animal, one field per clue
// step, so a clue is never assembled from prose.
//
// Every field holds a **stable id**, never a label: the labels live in
// js/i18n/ and change with the interface language, the ids never do.
// `name` carries one entry per interface language, because the answer a
// child types is the animal's name in the language they are reading.
// The letter an animal sits under is derived from that name, so the
// alphabet is different in German and English on purpose (Eichhörnchen
// is E, Squirrel is S).
//
// Facts are the ordinary, checkable kind: where the species lives, what
// it eats, how it is covered. `country` is one country the animal really
// occurs in, shown as an example and labelled as one, never as "the"
// country of a species. Nothing here is invented; where a species would
// need a hedge (sharks that bear live young, for instance) the species
// is left out rather than squeezed into the binary.

export const CONTINENTS = [
  "afrika", "asien", "europa", "nordamerika", "suedamerika",
  "australien", "arktis", "ozeane", "weltweit"
];

export const HABITATS = [
  "wald", "regenwald", "savanne", "wiese", "berge", "wueste",
  "meer", "suesswasser", "zuhause", "stadt", "eis"
];

export const BODIES = [
  "keine-beine", "flossen", "zwei-beine", "zwei-beine-fluegel",
  "vier-beine", "sechs-beine", "sechs-beine-fluegel", "acht-beine", "acht-arme"
];

export const BIRTHS = ["saeugetier", "eier"];

export const FOODS = ["pflanzen", "fleisch", "beides", "insekten", "fisch", "plankton", "nektar"];

export const COVERS = ["fell", "federn", "schuppen", "haut", "panzer", "stacheln", "wolle"];

export const COLORS = [
  "braun", "rotbraun", "gelb-braun", "gold-braun", "gelb-gefleckt", "grau",
  "schwarz", "weiss", "schwarz-weiss", "schwarz-braun", "orange-schwarz",
  "gelb-schwarz", "rot-schwarz", "rot", "gruen", "gruen-braun", "bunt", "rosa",
  "gelb", "blau-grau", "durchsichtig", "orange-weiss", "weiss-braun",
  "grau-gelb", "blau-orange"
];

// ISO 3166-1 alpha-2, lowercase, so the flag image follows the code.
export const COUNTRIES = [
  "at", "au", "bo", "br", "ca", "cd", "ch", "cn", "de", "eg", "es", "gr",
  "in", "is", "ke", "mg", "na", "nl", "no", "pe", "pl", "ro", "sy",
  "tz", "us", "za"
];

export const ANIMALS = [
  { id: "adler", name: { de: "Adler", en: "Eagle" }, continent: "europa", country: "ch", habitat: "berge", body: "zwei-beine-fluegel", birth: "eier", food: "fleisch", cover: "federn", color: "braun" },
  { id: "ameise", name: { de: "Ameise", en: "Ant" }, continent: "weltweit", country: "de", habitat: "wald", body: "sechs-beine", birth: "eier", food: "beides", cover: "panzer", color: "schwarz" },
  { id: "ameisenbaer", name: { de: "Ameisenbär", en: "Anteater" }, continent: "suedamerika", country: "br", habitat: "regenwald", body: "vier-beine", birth: "saeugetier", food: "insekten", cover: "fell", color: "grau" },
  { id: "alpaka", name: { de: "Alpaka", en: "Alpaca" }, continent: "suedamerika", country: "pe", habitat: "berge", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "wolle", color: "braun" },

  { id: "baer", name: { de: "Bär", en: "Bear" }, continent: "europa", country: "ro", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "beides", cover: "fell", color: "braun" },
  { id: "biene", name: { de: "Biene", en: "Bee" }, continent: "europa", country: "ch", habitat: "wiese", body: "sechs-beine-fluegel", birth: "eier", food: "nektar", cover: "panzer", color: "gelb-schwarz" },
  { id: "biber", name: { de: "Biber", en: "Beaver" }, continent: "nordamerika", country: "ca", habitat: "suesswasser", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "braun" },
  { id: "bison", name: { de: "Bison", en: "Bison" }, continent: "nordamerika", country: "us", habitat: "wiese", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "braun" },

  { id: "chamaeleon", name: { de: "Chamäleon", en: "Chameleon" }, continent: "afrika", country: "mg", habitat: "wald", body: "vier-beine", birth: "eier", food: "insekten", cover: "schuppen", color: "gruen" },
  { id: "clownfisch", name: { de: "Clownfisch", en: "Clownfish" }, continent: "ozeane", country: "au", habitat: "meer", body: "flossen", birth: "eier", food: "beides", cover: "schuppen", color: "orange-weiss" },

  { id: "delfin", name: { de: "Delfin", en: "Dolphin" }, alt: { de: ["Delphin"] }, continent: "ozeane", country: "gr", habitat: "meer", body: "flossen", birth: "saeugetier", food: "fisch", cover: "haut", color: "grau" },
  { id: "dachs", name: { de: "Dachs", en: "Badger" }, continent: "europa", country: "de", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "beides", cover: "fell", color: "schwarz-weiss" },
  { id: "dromedar", name: { de: "Dromedar", en: "Dromedary" }, continent: "afrika", country: "eg", habitat: "wueste", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "gold-braun" },

  { id: "elefant", name: { de: "Elefant", en: "Elephant" }, continent: "afrika", country: "ke", habitat: "savanne", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "haut", color: "grau" },
  { id: "eichhoernchen", name: { de: "Eichhörnchen", en: "Squirrel" }, continent: "europa", country: "ch", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "rotbraun" },
  { id: "ente", name: { de: "Ente", en: "Duck" }, continent: "europa", country: "nl", habitat: "suesswasser", body: "zwei-beine-fluegel", birth: "eier", food: "beides", cover: "federn", color: "bunt" },
  { id: "eisbaer", name: { de: "Eisbär", en: "Polar bear" }, continent: "arktis", country: "no", habitat: "eis", body: "vier-beine", birth: "saeugetier", food: "fleisch", cover: "fell", color: "weiss" },
  { id: "esel", name: { de: "Esel", en: "Donkey" }, continent: "europa", country: "es", habitat: "zuhause", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "grau" },

  { id: "fuchs", name: { de: "Fuchs", en: "Fox" }, continent: "europa", country: "ch", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "beides", cover: "fell", color: "rot" },
  { id: "flamingo", name: { de: "Flamingo", en: "Flamingo" }, continent: "afrika", country: "ke", habitat: "suesswasser", body: "zwei-beine-fluegel", birth: "eier", food: "plankton", cover: "federn", color: "rosa" },
  { id: "frosch", name: { de: "Frosch", en: "Frog" }, continent: "europa", country: "de", habitat: "suesswasser", body: "vier-beine", birth: "eier", food: "insekten", cover: "haut", color: "gruen" },
  { id: "fledermaus", name: { de: "Fledermaus", en: "Bat" }, continent: "europa", country: "ch", habitat: "wald", body: "zwei-beine-fluegel", birth: "saeugetier", food: "insekten", cover: "fell", color: "braun" },

  { id: "giraffe", name: { de: "Giraffe", en: "Giraffe" }, continent: "afrika", country: "tz", habitat: "savanne", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "gelb-braun" },
  { id: "gorilla", name: { de: "Gorilla", en: "Gorilla" }, continent: "afrika", country: "cd", habitat: "regenwald", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "schwarz" },
  { id: "gans", name: { de: "Gans", en: "Goose" }, continent: "europa", country: "de", habitat: "suesswasser", body: "zwei-beine-fluegel", birth: "eier", food: "pflanzen", cover: "federn", color: "grau" },
  { id: "gepard", name: { de: "Gepard", en: "Cheetah" }, continent: "afrika", country: "na", habitat: "savanne", body: "vier-beine", birth: "saeugetier", food: "fleisch", cover: "fell", color: "gelb-gefleckt" },
  { id: "geier", name: { de: "Geier", en: "Vulture" }, continent: "europa", country: "es", habitat: "berge", body: "zwei-beine-fluegel", birth: "eier", food: "fleisch", cover: "federn", color: "braun" },

  { id: "hund", name: { de: "Hund", en: "Dog" }, continent: "weltweit", country: "ch", habitat: "zuhause", body: "vier-beine", birth: "saeugetier", food: "beides", cover: "fell", color: "braun" },
  { id: "hase", name: { de: "Hase", en: "Hare" }, continent: "europa", country: "de", habitat: "wiese", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "braun" },
  { id: "huhn", name: { de: "Huhn", en: "Chicken" }, continent: "weltweit", country: "ch", habitat: "zuhause", body: "zwei-beine-fluegel", birth: "eier", food: "beides", cover: "federn", color: "braun" },
  { id: "hamster", name: { de: "Hamster", en: "Hamster" }, continent: "asien", country: "sy", habitat: "zuhause", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "gold-braun" },
  { id: "hirsch", name: { de: "Hirsch", en: "Deer" }, continent: "europa", country: "ch", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "rotbraun" },

  { id: "igel", name: { de: "Igel", en: "Hedgehog" }, continent: "europa", country: "ch", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "insekten", cover: "stacheln", color: "braun" },
  { id: "iltis", name: { de: "Iltis", en: "Polecat" }, continent: "europa", country: "de", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "fleisch", cover: "fell", color: "schwarz-braun" },
  { id: "ibis", name: { de: "Ibis", en: "Ibis" }, continent: "afrika", country: "eg", habitat: "suesswasser", body: "zwei-beine-fluegel", birth: "eier", food: "insekten", cover: "federn", color: "schwarz-weiss" },
  { id: "impala", name: { de: "Impala", en: "Impala" }, continent: "afrika", country: "ke", habitat: "savanne", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "rotbraun" },

  { id: "jaguar", name: { de: "Jaguar", en: "Jaguar" }, continent: "suedamerika", country: "br", habitat: "regenwald", body: "vier-beine", birth: "saeugetier", food: "fleisch", cover: "fell", color: "gelb-gefleckt" },

  { id: "kaenguru", name: { de: "Känguru", en: "Kangaroo" }, alt: { de: ["Känguruh"] }, continent: "australien", country: "au", habitat: "wiese", body: "zwei-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "rotbraun" },
  { id: "koala", name: { de: "Koala", en: "Koala" }, continent: "australien", country: "au", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "grau" },
  { id: "katze", name: { de: "Katze", en: "Cat" }, continent: "weltweit", country: "ch", habitat: "zuhause", body: "vier-beine", birth: "saeugetier", food: "fleisch", cover: "fell", color: "grau" },
  { id: "krokodil", name: { de: "Krokodil", en: "Crocodile" }, continent: "afrika", country: "eg", habitat: "suesswasser", body: "vier-beine", birth: "eier", food: "fleisch", cover: "schuppen", color: "gruen" },
  { id: "kuh", name: { de: "Kuh", en: "Cow" }, continent: "europa", country: "ch", habitat: "zuhause", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "schwarz-weiss" },

  { id: "loewe", name: { de: "Löwe", en: "Lion" }, continent: "afrika", country: "ke", habitat: "savanne", body: "vier-beine", birth: "saeugetier", food: "fleisch", cover: "fell", color: "gelb-braun" },
  { id: "luchs", name: { de: "Luchs", en: "Lynx" }, continent: "europa", country: "ch", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "fleisch", cover: "fell", color: "rotbraun" },
  { id: "lama", name: { de: "Lama", en: "Llama" }, continent: "suedamerika", country: "bo", habitat: "berge", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "wolle", color: "weiss-braun" },

  { id: "maus", name: { de: "Maus", en: "Mouse" }, continent: "weltweit", country: "ch", habitat: "zuhause", body: "vier-beine", birth: "saeugetier", food: "beides", cover: "fell", color: "grau" },
  { id: "murmeltier", name: { de: "Murmeltier", en: "Marmot" }, continent: "europa", country: "ch", habitat: "berge", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "braun" },
  { id: "marienkaefer", name: { de: "Marienkäfer", en: "Ladybird" }, alt: { en: ["Ladybug"] }, continent: "europa", country: "de", habitat: "wiese", body: "sechs-beine-fluegel", birth: "eier", food: "insekten", cover: "panzer", color: "rot-schwarz" },
  { id: "molch", name: { de: "Molch", en: "Newt" }, continent: "europa", country: "ch", habitat: "suesswasser", body: "vier-beine", birth: "eier", food: "insekten", cover: "haut", color: "blau-orange" },

  { id: "nashorn", name: { de: "Nashorn", en: "Rhinoceros" }, alt: { de: ["Rhinozeros"], en: ["Rhino"] }, continent: "afrika", country: "na", habitat: "savanne", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "haut", color: "grau" },
  { id: "nilpferd", name: { de: "Nilpferd", en: "Hippopotamus" }, alt: { de: ["Flusspferd"], en: ["Hippo"] }, continent: "afrika", country: "tz", habitat: "suesswasser", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "haut", color: "grau" },
  { id: "nachtigall", name: { de: "Nachtigall", en: "Nightingale" }, continent: "europa", country: "de", habitat: "wald", body: "zwei-beine-fluegel", birth: "eier", food: "insekten", cover: "federn", color: "braun" },

  { id: "oktopus", name: { de: "Oktopus", en: "Octopus" }, alt: { de: ["Krake", "Octopus"] }, continent: "ozeane", country: "gr", habitat: "meer", body: "acht-arme", birth: "eier", food: "fleisch", cover: "haut", color: "rotbraun" },
  { id: "otter", name: { de: "Otter", en: "Otter" }, continent: "europa", country: "at", habitat: "suesswasser", body: "vier-beine", birth: "saeugetier", food: "fisch", cover: "fell", color: "braun" },
  { id: "orca", name: { de: "Orca", en: "Orca" }, continent: "ozeane", country: "no", habitat: "meer", body: "flossen", birth: "saeugetier", food: "fleisch", cover: "haut", color: "schwarz-weiss" },

  { id: "pinguin", name: { de: "Pinguin", en: "Penguin" }, continent: "afrika", country: "za", habitat: "meer", body: "zwei-beine", birth: "eier", food: "fisch", cover: "federn", color: "schwarz-weiss" },
  { id: "pferd", name: { de: "Pferd", en: "Horse" }, continent: "europa", country: "ch", habitat: "zuhause", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "braun" },
  { id: "papagei", name: { de: "Papagei", en: "Parrot" }, continent: "suedamerika", country: "br", habitat: "regenwald", body: "zwei-beine-fluegel", birth: "eier", food: "pflanzen", cover: "federn", color: "bunt" },
  { id: "panda", name: { de: "Panda", en: "Panda" }, continent: "asien", country: "cn", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "schwarz-weiss" },

  { id: "qualle", name: { de: "Qualle", en: "Jellyfish" }, continent: "ozeane", country: "gr", habitat: "meer", body: "keine-beine", birth: "eier", food: "plankton", cover: "haut", color: "durchsichtig" },
  { id: "quokka", name: { de: "Quokka", en: "Quokka" }, continent: "australien", country: "au", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "braun" },

  { id: "reh", name: { de: "Reh", en: "Roe deer" }, continent: "europa", country: "ch", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "braun" },
  { id: "robbe", name: { de: "Robbe", en: "Seal" }, alt: { de: ["Seehund"] }, continent: "europa", country: "nl", habitat: "meer", body: "flossen", birth: "saeugetier", food: "fisch", cover: "fell", color: "grau" },
  { id: "rabe", name: { de: "Rabe", en: "Raven" }, continent: "europa", country: "ch", habitat: "berge", body: "zwei-beine-fluegel", birth: "eier", food: "beides", cover: "federn", color: "schwarz" },

  { id: "schmetterling", name: { de: "Schmetterling", en: "Butterfly" }, continent: "europa", country: "de", habitat: "wiese", body: "sechs-beine-fluegel", birth: "eier", food: "nektar", cover: "panzer", color: "bunt" },
  { id: "schildkroete", name: { de: "Schildkröte", en: "Tortoise" }, continent: "europa", country: "gr", habitat: "wiese", body: "vier-beine", birth: "eier", food: "pflanzen", cover: "panzer", color: "gruen-braun" },
  { id: "schwan", name: { de: "Schwan", en: "Swan" }, continent: "europa", country: "ch", habitat: "suesswasser", body: "zwei-beine-fluegel", birth: "eier", food: "pflanzen", cover: "federn", color: "weiss" },
  { id: "schaf", name: { de: "Schaf", en: "Sheep" }, continent: "europa", country: "ch", habitat: "zuhause", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "wolle", color: "weiss" },
  { id: "storch", name: { de: "Storch", en: "Stork" }, continent: "europa", country: "pl", habitat: "wiese", body: "zwei-beine-fluegel", birth: "eier", food: "fleisch", cover: "federn", color: "schwarz-weiss" },
  { id: "seepferdchen", name: { de: "Seepferdchen", en: "Seahorse" }, continent: "ozeane", country: "au", habitat: "meer", body: "keine-beine", birth: "eier", food: "plankton", cover: "haut", color: "gelb" },

  { id: "tiger", name: { de: "Tiger", en: "Tiger" }, continent: "asien", country: "in", habitat: "regenwald", body: "vier-beine", birth: "saeugetier", food: "fleisch", cover: "fell", color: "orange-schwarz" },
  { id: "taube", name: { de: "Taube", en: "Pigeon" }, continent: "europa", country: "ch", habitat: "stadt", body: "zwei-beine-fluegel", birth: "eier", food: "pflanzen", cover: "federn", color: "grau" },
  { id: "tukan", name: { de: "Tukan", en: "Toucan" }, continent: "suedamerika", country: "br", habitat: "regenwald", body: "zwei-beine-fluegel", birth: "eier", food: "pflanzen", cover: "federn", color: "bunt" },

  { id: "uhu", name: { de: "Uhu", en: "Eagle owl" }, continent: "europa", country: "ch", habitat: "wald", body: "zwei-beine-fluegel", birth: "eier", food: "fleisch", cover: "federn", color: "braun" },
  { id: "unke", name: { de: "Unke", en: "Fire-bellied toad" }, continent: "europa", country: "de", habitat: "suesswasser", body: "vier-beine", birth: "eier", food: "insekten", cover: "haut", color: "grau-gelb" },
  { id: "uakari", name: { de: "Uakari", en: "Uakari" }, continent: "suedamerika", country: "br", habitat: "regenwald", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "rotbraun" },

  { id: "vogelspinne", name: { de: "Vogelspinne", en: "Tarantula" }, continent: "suedamerika", country: "br", habitat: "regenwald", body: "acht-beine", birth: "eier", food: "insekten", cover: "panzer", color: "schwarz-braun" },
  { id: "vielfrass", name: { de: "Vielfrass", en: "Wolverine" }, continent: "europa", country: "no", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "fleisch", cover: "fell", color: "schwarz-braun" },

  { id: "wolf", name: { de: "Wolf", en: "Wolf" }, continent: "europa", country: "ch", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "fleisch", cover: "fell", color: "grau" },
  { id: "wal", name: { de: "Wal", en: "Whale" }, alt: { de: ["Blauwal"], en: ["Blue whale"] }, continent: "ozeane", country: "is", habitat: "meer", body: "flossen", birth: "saeugetier", food: "plankton", cover: "haut", color: "blau-grau" },
  { id: "waschbaer", name: { de: "Waschbär", en: "Raccoon" }, continent: "nordamerika", country: "us", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "beides", cover: "fell", color: "grau" },

  { id: "yak", name: { de: "Yak", en: "Yak" }, alt: { de: ["Jak"] }, continent: "asien", country: "cn", habitat: "berge", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "schwarz" },

  { id: "zebra", name: { de: "Zebra", en: "Zebra" }, continent: "afrika", country: "ke", habitat: "savanne", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "schwarz-weiss" },
  { id: "ziege", name: { de: "Ziege", en: "Goat" }, continent: "europa", country: "ch", habitat: "berge", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "weiss" }
];
