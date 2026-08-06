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
// need a hedge (sharks and vipers that bear live young, salamanders that
// drop larvae) the species is left out rather than squeezed into the
// mammal-or-egg step.
//
// **Letters are stocked in continent pairs.** A letter where only one
// animal lives in Africa is a letter the very first clue solves, so a
// species is added with a partner from its own continent or not at all.
// The e2e suite counts what is left over and holds the line.

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
  "vier-beine", "sechs-beine", "sechs-beine-fluegel", "acht-beine",
  "zehn-beine", "fuenf-arme", "acht-arme"
];

export const BIRTHS = ["saeugetier", "eier"];

export const FOODS = ["pflanzen", "fleisch", "beides", "insekten", "fisch", "plankton", "nektar"];

export const COVERS = ["fell", "federn", "schuppen", "haut", "panzer", "stacheln", "wolle"];

export const COLORS = [
  "braun", "rotbraun", "gelb-braun", "gold-braun", "gelb-gefleckt", "grau",
  "schwarz", "weiss", "schwarz-weiss", "schwarz-braun", "orange-schwarz",
  "gelb-schwarz", "rot-schwarz", "rot", "gruen", "gruen-braun", "bunt", "rosa",
  "gelb", "blau-grau", "durchsichtig", "orange-weiss", "weiss-braun",
  "grau-gelb", "grau-rot", "blau-orange"
];

// ISO 3166-1 alpha-2, lowercase, so the flag image follows the code.
export const COUNTRIES = [
  "at", "au", "bo", "br", "ca", "cd", "ch", "cm", "cn", "de", "eg", "es",
  "gr", "in", "is", "ke", "mg", "na", "nl", "no", "pe", "pk", "pl", "ro",
  "tz", "us", "za"
];

export const ANIMALS = [
  /* ── A ── europa 5, suedamerika 2, afrika 2 ───────────────────── */
  { id: "adler", name: { de: "Adler", en: "Eagle" }, continent: "europa", country: "ch", habitat: "berge", body: "zwei-beine-fluegel", birth: "eier", food: "fleisch", cover: "federn", color: "braun" },
  { id: "ameise", name: { de: "Ameise", en: "Ant" }, continent: "europa", country: "de", habitat: "wald", body: "sechs-beine", birth: "eier", food: "beides", cover: "panzer", color: "schwarz" },
  { id: "amsel", name: { de: "Amsel", en: "Blackbird" }, continent: "europa", country: "de", habitat: "stadt", body: "zwei-beine-fluegel", birth: "eier", food: "beides", cover: "federn", color: "schwarz" },
  { id: "auerhahn", name: { de: "Auerhahn", en: "Capercaillie" }, continent: "europa", country: "at", habitat: "wald", body: "zwei-beine-fluegel", birth: "eier", food: "pflanzen", cover: "federn", color: "schwarz" },
  { id: "aal", name: { de: "Aal", en: "Eel" }, continent: "europa", country: "nl", habitat: "suesswasser", body: "flossen", birth: "eier", food: "fleisch", cover: "schuppen", color: "braun" },
  { id: "austernfischer", name: { de: "Austernfischer", en: "Oystercatcher" }, continent: "europa", country: "nl", habitat: "meer", body: "zwei-beine-fluegel", birth: "eier", food: "fleisch", cover: "federn", color: "schwarz-weiss" },
  { id: "ameisenbaer", name: { de: "Ameisenbär", en: "Anteater" }, continent: "suedamerika", country: "br", habitat: "regenwald", body: "vier-beine", birth: "saeugetier", food: "insekten", cover: "fell", color: "grau" },
  { id: "alpaka", name: { de: "Alpaka", en: "Alpaca" }, continent: "suedamerika", country: "pe", habitat: "berge", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "wolle", color: "braun" },
  { id: "antilope", name: { de: "Antilope", en: "Antelope" }, continent: "afrika", country: "na", habitat: "savanne", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "gelb-braun" },
  { id: "aasgeier", name: { de: "Aasgeier", en: "Egyptian vulture" }, continent: "afrika", country: "eg", habitat: "wueste", body: "zwei-beine-fluegel", birth: "eier", food: "fleisch", cover: "federn", color: "weiss" },

  /* ── B ── europa 5, nordamerika 2 ─────────────────────────────── */
  { id: "baer", name: { de: "Bär", en: "Bear" }, continent: "europa", country: "ro", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "beides", cover: "fell", color: "braun" },
  { id: "biene", name: { de: "Biene", en: "Bee" }, continent: "europa", country: "ch", habitat: "wiese", body: "sechs-beine-fluegel", birth: "eier", food: "nektar", cover: "panzer", color: "gelb-schwarz" },
  { id: "bussard", name: { de: "Bussard", en: "Buzzard" }, continent: "europa", country: "de", habitat: "wiese", body: "zwei-beine-fluegel", birth: "eier", food: "fleisch", cover: "federn", color: "braun" },
  { id: "buntspecht", name: { de: "Buntspecht", en: "Woodpecker" }, continent: "europa", country: "ch", habitat: "wald", body: "zwei-beine-fluegel", birth: "eier", food: "insekten", cover: "federn", color: "schwarz-weiss" },
  { id: "blaumeise", name: { de: "Blaumeise", en: "Blue tit" }, continent: "europa", country: "ch", habitat: "wald", body: "zwei-beine-fluegel", birth: "eier", food: "insekten", cover: "federn", color: "bunt" },
  { id: "biber", name: { de: "Biber", en: "Beaver" }, continent: "nordamerika", country: "ca", habitat: "suesswasser", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "braun" },
  { id: "bison", name: { de: "Bison", en: "Bison" }, continent: "nordamerika", country: "us", habitat: "wiese", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "braun" },

  /* ── C ── a thin letter: three animals, three continents ──────── */
  { id: "chamaeleon", name: { de: "Chamäleon", en: "Chameleon" }, continent: "afrika", country: "mg", habitat: "wald", body: "vier-beine", birth: "eier", food: "insekten", cover: "schuppen", color: "gruen" },
  { id: "clownfisch", name: { de: "Clownfisch", en: "Clownfish" }, continent: "ozeane", country: "au", habitat: "meer", body: "flossen", birth: "eier", food: "beides", cover: "schuppen", color: "orange-weiss" },
  { id: "chinchilla", name: { de: "Chinchilla", en: "Chinchilla" }, continent: "suedamerika", country: "bo", habitat: "berge", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "grau" },

  /* ── D ── europa 4, ozeane 2, afrika 2 ───────────────────────── */
  { id: "dachs", name: { de: "Dachs", en: "Badger" }, continent: "europa", country: "de", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "beides", cover: "fell", color: "schwarz-weiss" },
  { id: "dohle", name: { de: "Dohle", en: "Jackdaw" }, continent: "europa", country: "ch", habitat: "stadt", body: "zwei-beine-fluegel", birth: "eier", food: "beides", cover: "federn", color: "schwarz" },
  { id: "distelfink", name: { de: "Distelfink", en: "Goldfinch" }, continent: "europa", country: "de", habitat: "wiese", body: "zwei-beine-fluegel", birth: "eier", food: "pflanzen", cover: "federn", color: "bunt" },
  { id: "damhirsch", name: { de: "Damhirsch", en: "Fallow deer" }, continent: "europa", country: "de", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "gelb-braun" },
  { id: "delfin", name: { de: "Delfin", en: "Dolphin" }, alt: { de: ["Delphin"] }, continent: "ozeane", country: "gr", habitat: "meer", body: "flossen", birth: "saeugetier", food: "fisch", cover: "haut", color: "grau" },
  { id: "dugong", name: { de: "Dugong", en: "Dugong" }, continent: "ozeane", country: "au", habitat: "meer", body: "flossen", birth: "saeugetier", food: "pflanzen", cover: "haut", color: "grau" },
  { id: "dromedar", name: { de: "Dromedar", en: "Dromedary" }, continent: "afrika", country: "eg", habitat: "wueste", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "gold-braun" },
  { id: "dikdik", name: { de: "Dikdik", en: "Dik-dik" }, continent: "afrika", country: "ke", habitat: "savanne", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "braun" },

  /* ── E ── europa 7, afrika 2, arktis 2 ───────────────────────── */
  { id: "eichhoernchen", name: { de: "Eichhörnchen", en: "Squirrel" }, continent: "europa", country: "ch", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "rotbraun" },
  { id: "ente", name: { de: "Ente", en: "Duck" }, continent: "europa", country: "nl", habitat: "suesswasser", body: "zwei-beine-fluegel", birth: "eier", food: "beides", cover: "federn", color: "bunt" },
  { id: "esel", name: { de: "Esel", en: "Donkey" }, continent: "europa", country: "es", habitat: "zuhause", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "grau" },
  { id: "eisvogel", name: { de: "Eisvogel", en: "Kingfisher" }, continent: "europa", country: "at", habitat: "suesswasser", body: "zwei-beine-fluegel", birth: "eier", food: "fisch", cover: "federn", color: "bunt" },
  { id: "elch", name: { de: "Elch", en: "Moose" }, continent: "europa", country: "no", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "braun" },
  { id: "elster", name: { de: "Elster", en: "Magpie" }, continent: "europa", country: "ch", habitat: "stadt", body: "zwei-beine-fluegel", birth: "eier", food: "beides", cover: "federn", color: "schwarz-weiss" },
  { id: "eidechse", name: { de: "Eidechse", en: "Lizard" }, continent: "europa", country: "ch", habitat: "wiese", body: "vier-beine", birth: "eier", food: "insekten", cover: "schuppen", color: "gruen" },
  { id: "elefant", name: { de: "Elefant", en: "Elephant" }, continent: "afrika", country: "ke", habitat: "savanne", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "haut", color: "grau" },
  { id: "erdmaennchen", name: { de: "Erdmännchen", en: "Meerkat" }, continent: "afrika", country: "na", habitat: "wueste", body: "vier-beine", birth: "saeugetier", food: "insekten", cover: "fell", color: "braun" },
  { id: "erdferkel", name: { de: "Erdferkel", en: "Aardvark" }, continent: "afrika", country: "za", habitat: "savanne", body: "vier-beine", birth: "saeugetier", food: "insekten", cover: "haut", color: "rosa" },
  { id: "eisbaer", name: { de: "Eisbär", en: "Polar bear" }, continent: "arktis", country: "no", habitat: "eis", body: "vier-beine", birth: "saeugetier", food: "fleisch", cover: "fell", color: "weiss" },
  { id: "eismoewe", name: { de: "Eismöwe", en: "Glaucous gull" }, continent: "arktis", country: "no", habitat: "meer", body: "zwei-beine-fluegel", birth: "eier", food: "fisch", cover: "federn", color: "weiss" },

  /* ── F ── europa 5, afrika 2 ─────────────────────────────────── */
  { id: "fuchs", name: { de: "Fuchs", en: "Fox" }, continent: "europa", country: "ch", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "beides", cover: "fell", color: "rot" },
  { id: "frosch", name: { de: "Frosch", en: "Frog" }, continent: "europa", country: "de", habitat: "suesswasser", body: "vier-beine", birth: "eier", food: "insekten", cover: "haut", color: "gruen" },
  { id: "fledermaus", name: { de: "Fledermaus", en: "Bat" }, continent: "europa", country: "ch", habitat: "wald", body: "zwei-beine-fluegel", birth: "saeugetier", food: "insekten", cover: "fell", color: "braun" },
  { id: "forelle", name: { de: "Forelle", en: "Trout" }, continent: "europa", country: "ch", habitat: "suesswasser", body: "flossen", birth: "eier", food: "insekten", cover: "schuppen", color: "braun" },
  { id: "flusskrebs", name: { de: "Flusskrebs", en: "Crayfish" }, continent: "europa", country: "at", habitat: "suesswasser", body: "zehn-beine", birth: "eier", food: "beides", cover: "panzer", color: "braun" },
  { id: "flamingo", name: { de: "Flamingo", en: "Flamingo" }, continent: "afrika", country: "ke", habitat: "suesswasser", body: "zwei-beine-fluegel", birth: "eier", food: "plankton", cover: "federn", color: "rosa" },
  { id: "fennek", name: { de: "Fennek", en: "Fennec fox" }, continent: "afrika", country: "eg", habitat: "wueste", body: "vier-beine", birth: "saeugetier", food: "fleisch", cover: "fell", color: "gold-braun" },

  /* ── G ── afrika 4, europa 3 ─────────────────────────────────── */
  { id: "giraffe", name: { de: "Giraffe", en: "Giraffe" }, continent: "afrika", country: "tz", habitat: "savanne", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "gelb-braun" },
  { id: "gorilla", name: { de: "Gorilla", en: "Gorilla" }, continent: "afrika", country: "cd", habitat: "regenwald", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "schwarz" },
  { id: "gepard", name: { de: "Gepard", en: "Cheetah" }, continent: "afrika", country: "na", habitat: "savanne", body: "vier-beine", birth: "saeugetier", food: "fleisch", cover: "fell", color: "gelb-gefleckt" },
  { id: "gnu", name: { de: "Gnu", en: "Wildebeest" }, continent: "afrika", country: "tz", habitat: "savanne", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "grau" },
  { id: "gans", name: { de: "Gans", en: "Goose" }, continent: "europa", country: "de", habitat: "suesswasser", body: "zwei-beine-fluegel", birth: "eier", food: "pflanzen", cover: "federn", color: "grau" },
  { id: "geier", name: { de: "Geier", en: "Vulture" }, continent: "europa", country: "es", habitat: "berge", body: "zwei-beine-fluegel", birth: "eier", food: "fleisch", cover: "federn", color: "braun" },
  { id: "gaemse", name: { de: "Gämse", en: "Chamois" }, alt: { de: ["Gams"] }, continent: "europa", country: "ch", habitat: "berge", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "braun" },

  /* ── H ── weltweit 3, europa 3, afrika 2 ─────────────────────── */
  { id: "hund", name: { de: "Hund", en: "Dog" }, continent: "weltweit", country: "ch", habitat: "zuhause", body: "vier-beine", birth: "saeugetier", food: "beides", cover: "fell", color: "braun" },
  { id: "huhn", name: { de: "Huhn", en: "Chicken" }, continent: "weltweit", country: "ch", habitat: "zuhause", body: "zwei-beine-fluegel", birth: "eier", food: "beides", cover: "federn", color: "braun" },
  { id: "hamster", name: { de: "Hamster", en: "Hamster" }, continent: "weltweit", country: "ch", habitat: "zuhause", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "gold-braun" },
  { id: "hase", name: { de: "Hase", en: "Hare" }, continent: "europa", country: "de", habitat: "wiese", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "braun" },
  { id: "hirsch", name: { de: "Hirsch", en: "Deer" }, continent: "europa", country: "ch", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "rotbraun" },
  { id: "hirschkaefer", name: { de: "Hirschkäfer", en: "Stag beetle" }, continent: "europa", country: "de", habitat: "wald", body: "sechs-beine-fluegel", birth: "eier", food: "pflanzen", cover: "panzer", color: "schwarz-braun" },
  { id: "hyaene", name: { de: "Hyäne", en: "Hyena" }, continent: "afrika", country: "ke", habitat: "savanne", body: "vier-beine", birth: "saeugetier", food: "fleisch", cover: "fell", color: "gold-braun" },
  { id: "honigdachs", name: { de: "Honigdachs", en: "Honey badger" }, continent: "afrika", country: "za", habitat: "savanne", body: "vier-beine", birth: "saeugetier", food: "beides", cover: "fell", color: "schwarz-weiss" },

  /* ── I ── europa 2, afrika 2 ─────────────────────────────────── */
  { id: "igel", name: { de: "Igel", en: "Hedgehog" }, continent: "europa", country: "ch", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "insekten", cover: "stacheln", color: "braun" },
  { id: "iltis", name: { de: "Iltis", en: "Polecat" }, continent: "europa", country: "de", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "fleisch", cover: "fell", color: "schwarz-braun" },
  { id: "ibis", name: { de: "Ibis", en: "Ibis" }, continent: "afrika", country: "eg", habitat: "suesswasser", body: "zwei-beine-fluegel", birth: "eier", food: "insekten", cover: "federn", color: "schwarz-weiss" },
  { id: "impala", name: { de: "Impala", en: "Impala" }, continent: "afrika", country: "ke", habitat: "savanne", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "rotbraun" },

  /* ── J ── the thinnest letter in German ──────────────────────── */
  { id: "jaguar", name: { de: "Jaguar", en: "Jaguar" }, continent: "suedamerika", country: "br", habitat: "regenwald", body: "vier-beine", birth: "saeugetier", food: "fleisch", cover: "fell", color: "gelb-gefleckt" },

  /* ── K ── europa 3, australien 2, weltweit 2, afrika 2, suedamerika 2 ── */
  { id: "kuh", name: { de: "Kuh", en: "Cow" }, continent: "europa", country: "ch", habitat: "zuhause", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "schwarz-weiss" },
  { id: "kiebitz", name: { de: "Kiebitz", en: "Lapwing" }, continent: "europa", country: "nl", habitat: "wiese", body: "zwei-beine-fluegel", birth: "eier", food: "insekten", cover: "federn", color: "schwarz-weiss" },
  { id: "karpfen", name: { de: "Karpfen", en: "Carp" }, continent: "europa", country: "de", habitat: "suesswasser", body: "flossen", birth: "eier", food: "beides", cover: "schuppen", color: "gold-braun" },
  { id: "kaenguru", name: { de: "Känguru", en: "Kangaroo" }, alt: { de: ["Känguruh"] }, continent: "australien", country: "au", habitat: "wiese", body: "zwei-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "rotbraun" },
  { id: "koala", name: { de: "Koala", en: "Koala" }, continent: "australien", country: "au", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "grau" },
  { id: "katze", name: { de: "Katze", en: "Cat" }, continent: "weltweit", country: "ch", habitat: "zuhause", body: "vier-beine", birth: "saeugetier", food: "fleisch", cover: "fell", color: "grau" },
  { id: "kakerlake", name: { de: "Kakerlake", en: "Cockroach" }, continent: "weltweit", country: "de", habitat: "zuhause", body: "sechs-beine", birth: "eier", food: "beides", cover: "panzer", color: "braun" },
  { id: "krokodil", name: { de: "Krokodil", en: "Crocodile" }, continent: "afrika", country: "eg", habitat: "suesswasser", body: "vier-beine", birth: "eier", food: "fleisch", cover: "schuppen", color: "gruen" },
  { id: "kudu", name: { de: "Kudu", en: "Kudu" }, continent: "afrika", country: "na", habitat: "savanne", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "braun" },
  { id: "kolibri", name: { de: "Kolibri", en: "Hummingbird" }, continent: "suedamerika", country: "br", habitat: "regenwald", body: "zwei-beine-fluegel", birth: "eier", food: "nektar", cover: "federn", color: "bunt" },
  { id: "kapuzineraffe", name: { de: "Kapuzineraffe", en: "Capuchin monkey" }, continent: "suedamerika", country: "br", habitat: "regenwald", body: "vier-beine", birth: "saeugetier", food: "beides", cover: "fell", color: "braun" },
  { id: "klippspringer", name: { de: "Klippspringer", en: "Klipspringer" }, continent: "afrika", country: "na", habitat: "berge", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "gelb-braun" },
  { id: "krabbe", name: { de: "Krabbe", en: "Crab" }, continent: "ozeane", country: "nl", habitat: "meer", body: "zehn-beine", birth: "eier", food: "beides", cover: "panzer", color: "gruen" },
  { id: "kabeljau", name: { de: "Kabeljau", en: "Cod" }, continent: "ozeane", country: "no", habitat: "meer", body: "flossen", birth: "eier", food: "fisch", cover: "schuppen", color: "grau" },

  /* ── L ── europa 3, afrika 2, suedamerika 2, ozeane 2 ────────── */
  { id: "luchs", name: { de: "Luchs", en: "Lynx" }, continent: "europa", country: "ch", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "fleisch", cover: "fell", color: "rotbraun" },
  { id: "lerche", name: { de: "Lerche", en: "Lark" }, continent: "europa", country: "de", habitat: "wiese", body: "zwei-beine-fluegel", birth: "eier", food: "insekten", cover: "federn", color: "braun" },
  { id: "libelle", name: { de: "Libelle", en: "Dragonfly" }, continent: "europa", country: "ch", habitat: "suesswasser", body: "sechs-beine-fluegel", birth: "eier", food: "insekten", cover: "panzer", color: "blau-grau" },
  { id: "loewe", name: { de: "Löwe", en: "Lion" }, continent: "afrika", country: "ke", habitat: "savanne", body: "vier-beine", birth: "saeugetier", food: "fleisch", cover: "fell", color: "gelb-braun" },
  { id: "leopard", name: { de: "Leopard", en: "Leopard" }, continent: "afrika", country: "tz", habitat: "savanne", body: "vier-beine", birth: "saeugetier", food: "fleisch", cover: "fell", color: "gelb-gefleckt" },
  { id: "lama", name: { de: "Lama", en: "Llama" }, continent: "suedamerika", country: "bo", habitat: "berge", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "wolle", color: "weiss-braun" },
  { id: "leguan", name: { de: "Leguan", en: "Iguana" }, continent: "suedamerika", country: "br", habitat: "regenwald", body: "vier-beine", birth: "eier", food: "pflanzen", cover: "schuppen", color: "gruen" },
  { id: "lachs", name: { de: "Lachs", en: "Salmon" }, continent: "ozeane", country: "no", habitat: "meer", body: "flossen", birth: "eier", food: "fleisch", cover: "schuppen", color: "blau-grau" },
  { id: "languste", name: { de: "Languste", en: "Spiny lobster" }, continent: "ozeane", country: "es", habitat: "meer", body: "zehn-beine", birth: "eier", food: "beides", cover: "panzer", color: "rotbraun" },

  /* ── M ── europa 6, weltweit 2 ───────────────────────────────── */
  { id: "murmeltier", name: { de: "Murmeltier", en: "Marmot" }, continent: "europa", country: "ch", habitat: "berge", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "braun" },
  { id: "marienkaefer", name: { de: "Marienkäfer", en: "Ladybird" }, alt: { en: ["Ladybug"] }, continent: "europa", country: "de", habitat: "wiese", body: "sechs-beine-fluegel", birth: "eier", food: "insekten", cover: "panzer", color: "rot-schwarz" },
  { id: "molch", name: { de: "Molch", en: "Newt" }, continent: "europa", country: "ch", habitat: "suesswasser", body: "vier-beine", birth: "eier", food: "insekten", cover: "haut", color: "blau-orange" },
  { id: "maulwurf", name: { de: "Maulwurf", en: "Mole" }, continent: "europa", country: "de", habitat: "wiese", body: "vier-beine", birth: "saeugetier", food: "insekten", cover: "fell", color: "schwarz" },
  { id: "marder", name: { de: "Marder", en: "Marten" }, continent: "europa", country: "ch", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "beides", cover: "fell", color: "braun" },
  { id: "moewe", name: { de: "Möwe", en: "Seagull" }, continent: "europa", country: "nl", habitat: "meer", body: "zwei-beine-fluegel", birth: "eier", food: "beides", cover: "federn", color: "weiss" },
  { id: "maus", name: { de: "Maus", en: "Mouse" }, continent: "weltweit", country: "ch", habitat: "zuhause", body: "vier-beine", birth: "saeugetier", food: "beides", cover: "fell", color: "grau" },
  { id: "muecke", name: { de: "Mücke", en: "Mosquito" }, continent: "weltweit", country: "de", habitat: "suesswasser", body: "sechs-beine-fluegel", birth: "eier", food: "nektar", cover: "panzer", color: "grau" },
  { id: "mandrill", name: { de: "Mandrill", en: "Mandrill" }, continent: "afrika", country: "cm", habitat: "regenwald", body: "vier-beine", birth: "saeugetier", food: "beides", cover: "fell", color: "bunt" },
  { id: "marabu", name: { de: "Marabu", en: "Marabou" }, continent: "afrika", country: "tz", habitat: "savanne", body: "zwei-beine-fluegel", birth: "eier", food: "fleisch", cover: "federn", color: "schwarz-weiss" },

  /* ── N ── afrika 2, europa 2, suedamerika 2 ─────────────────── */
  { id: "nashorn", name: { de: "Nashorn", en: "Rhinoceros" }, alt: { de: ["Rhinozeros"], en: ["Rhino"] }, continent: "afrika", country: "na", habitat: "savanne", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "haut", color: "grau" },
  { id: "nilpferd", name: { de: "Nilpferd", en: "Hippopotamus" }, alt: { de: ["Flusspferd"], en: ["Hippo"] }, continent: "afrika", country: "tz", habitat: "suesswasser", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "haut", color: "grau" },
  { id: "nachtigall", name: { de: "Nachtigall", en: "Nightingale" }, continent: "europa", country: "de", habitat: "wald", body: "zwei-beine-fluegel", birth: "eier", food: "insekten", cover: "federn", color: "braun" },
  { id: "nerz", name: { de: "Nerz", en: "Mink" }, continent: "europa", country: "ro", habitat: "suesswasser", body: "vier-beine", birth: "saeugetier", food: "fleisch", cover: "fell", color: "schwarz-braun" },
  { id: "nutria", name: { de: "Nutria", en: "Nutria" }, continent: "suedamerika", country: "br", habitat: "suesswasser", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "braun" },
  { id: "nasenbaer", name: { de: "Nasenbär", en: "Coati" }, continent: "suedamerika", country: "br", habitat: "regenwald", body: "vier-beine", birth: "saeugetier", food: "beides", cover: "fell", color: "rotbraun" },

  /* ── O ── ozeane 2, europa 2 ─────────────────────────────────── */
  { id: "oktopus", name: { de: "Oktopus", en: "Octopus" }, alt: { de: ["Krake", "Octopus"] }, continent: "ozeane", country: "gr", habitat: "meer", body: "acht-arme", birth: "eier", food: "fleisch", cover: "haut", color: "rotbraun" },
  { id: "orca", name: { de: "Orca", en: "Orca" }, continent: "ozeane", country: "no", habitat: "meer", body: "flossen", birth: "saeugetier", food: "fleisch", cover: "haut", color: "schwarz-weiss" },
  { id: "otter", name: { de: "Otter", en: "Otter" }, continent: "europa", country: "at", habitat: "suesswasser", body: "vier-beine", birth: "saeugetier", food: "fisch", cover: "fell", color: "braun" },
  { id: "ohrwurm", name: { de: "Ohrwurm", en: "Earwig" }, continent: "europa", country: "de", habitat: "wald", body: "sechs-beine", birth: "eier", food: "beides", cover: "panzer", color: "braun" },
  { id: "oryx", name: { de: "Oryx", en: "Oryx" }, continent: "afrika", country: "na", habitat: "wueste", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "grau" },
  { id: "okapi", name: { de: "Okapi", en: "Okapi" }, continent: "afrika", country: "cd", habitat: "regenwald", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "schwarz-braun" },

  /* ── P ── europa 2, afrika 2, asien 2, suedamerika 2, nordamerika 2 ── */
  { id: "pferd", name: { de: "Pferd", en: "Horse" }, continent: "europa", country: "ch", habitat: "zuhause", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "braun" },
  { id: "papageitaucher", name: { de: "Papageitaucher", en: "Puffin" }, continent: "europa", country: "is", habitat: "meer", body: "zwei-beine-fluegel", birth: "eier", food: "fisch", cover: "federn", color: "schwarz-weiss" },
  { id: "pinguin", name: { de: "Pinguin", en: "Penguin" }, continent: "afrika", country: "za", habitat: "meer", body: "zwei-beine", birth: "eier", food: "fisch", cover: "federn", color: "schwarz-weiss" },
  { id: "pelikan", name: { de: "Pelikan", en: "Pelican" }, continent: "afrika", country: "tz", habitat: "suesswasser", body: "zwei-beine-fluegel", birth: "eier", food: "fisch", cover: "federn", color: "weiss" },
  { id: "panda", name: { de: "Panda", en: "Panda" }, continent: "asien", country: "cn", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "schwarz-weiss" },
  { id: "pfau", name: { de: "Pfau", en: "Peacock" }, continent: "asien", country: "in", habitat: "wald", body: "zwei-beine-fluegel", birth: "eier", food: "beides", cover: "federn", color: "bunt" },
  { id: "papagei", name: { de: "Papagei", en: "Parrot" }, continent: "suedamerika", country: "br", habitat: "regenwald", body: "zwei-beine-fluegel", birth: "eier", food: "pflanzen", cover: "federn", color: "bunt" },
  { id: "piranha", name: { de: "Piranha", en: "Piranha" }, continent: "suedamerika", country: "br", habitat: "suesswasser", body: "flossen", birth: "eier", food: "fleisch", cover: "schuppen", color: "grau-rot" },
  { id: "puma", name: { de: "Puma", en: "Puma" }, continent: "nordamerika", country: "us", habitat: "berge", body: "vier-beine", birth: "saeugetier", food: "fleisch", cover: "fell", color: "gold-braun" },
  { id: "praeriehund", name: { de: "Präriehund", en: "Prairie dog" }, continent: "nordamerika", country: "us", habitat: "wiese", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "gold-braun" },

  /* ── Q ── a thin letter: two animals, two continents ─────────── */
  { id: "qualle", name: { de: "Qualle", en: "Jellyfish" }, continent: "ozeane", country: "gr", habitat: "meer", body: "keine-beine", birth: "eier", food: "plankton", cover: "haut", color: "durchsichtig" },
  { id: "quokka", name: { de: "Quokka", en: "Quokka" }, continent: "australien", country: "au", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "braun" },

  /* ── R ── europa 4, weltweit 2 ───────────────────────────────── */
  { id: "reh", name: { de: "Reh", en: "Roe deer" }, continent: "europa", country: "ch", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "braun" },
  { id: "robbe", name: { de: "Robbe", en: "Seal" }, alt: { de: ["Seehund"] }, continent: "europa", country: "nl", habitat: "meer", body: "flossen", birth: "saeugetier", food: "fisch", cover: "fell", color: "grau" },
  { id: "rabe", name: { de: "Rabe", en: "Raven" }, continent: "europa", country: "ch", habitat: "berge", body: "zwei-beine-fluegel", birth: "eier", food: "beides", cover: "federn", color: "schwarz" },
  { id: "rotkehlchen", name: { de: "Rotkehlchen", en: "Robin" }, continent: "europa", country: "ch", habitat: "wald", body: "zwei-beine-fluegel", birth: "eier", food: "insekten", cover: "federn", color: "rot" },
  { id: "ratte", name: { de: "Ratte", en: "Rat" }, continent: "weltweit", country: "de", habitat: "stadt", body: "vier-beine", birth: "saeugetier", food: "beides", cover: "fell", color: "grau" },
  { id: "regenwurm", name: { de: "Regenwurm", en: "Earthworm" }, continent: "weltweit", country: "de", habitat: "wiese", body: "keine-beine", birth: "eier", food: "pflanzen", cover: "haut", color: "rosa" },

  /* ── S ── europa 6, ozeane 3, afrika 2 ──────────────────────── */
  { id: "schmetterling", name: { de: "Schmetterling", en: "Butterfly" }, continent: "europa", country: "de", habitat: "wiese", body: "sechs-beine-fluegel", birth: "eier", food: "nektar", cover: "panzer", color: "bunt" },
  { id: "schildkroete", name: { de: "Schildkröte", en: "Tortoise" }, continent: "europa", country: "gr", habitat: "wiese", body: "vier-beine", birth: "eier", food: "pflanzen", cover: "panzer", color: "gruen-braun" },
  { id: "schwan", name: { de: "Schwan", en: "Swan" }, continent: "europa", country: "ch", habitat: "suesswasser", body: "zwei-beine-fluegel", birth: "eier", food: "pflanzen", cover: "federn", color: "weiss" },
  { id: "schaf", name: { de: "Schaf", en: "Sheep" }, continent: "europa", country: "ch", habitat: "zuhause", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "wolle", color: "weiss" },
  { id: "storch", name: { de: "Storch", en: "Stork" }, continent: "europa", country: "pl", habitat: "wiese", body: "zwei-beine-fluegel", birth: "eier", food: "fleisch", cover: "federn", color: "schwarz-weiss" },
  { id: "schnecke", name: { de: "Schnecke", en: "Snail" }, continent: "europa", country: "de", habitat: "wiese", body: "keine-beine", birth: "eier", food: "pflanzen", cover: "panzer", color: "braun" },
  { id: "seepferdchen", name: { de: "Seepferdchen", en: "Seahorse" }, continent: "ozeane", country: "au", habitat: "meer", body: "keine-beine", birth: "eier", food: "plankton", cover: "haut", color: "gelb" },
  { id: "seestern", name: { de: "Seestern", en: "Starfish" }, continent: "ozeane", country: "no", habitat: "meer", body: "fuenf-arme", birth: "eier", food: "fleisch", cover: "haut", color: "rot" },
  { id: "seeigel", name: { de: "Seeigel", en: "Sea urchin" }, continent: "ozeane", country: "gr", habitat: "meer", body: "keine-beine", birth: "eier", food: "pflanzen", cover: "stacheln", color: "schwarz" },
  { id: "strauss", name: { de: "Strauss", en: "Ostrich" }, continent: "afrika", country: "ke", habitat: "savanne", body: "zwei-beine", birth: "eier", food: "pflanzen", cover: "federn", color: "schwarz-weiss" },
  { id: "schimpanse", name: { de: "Schimpanse", en: "Chimpanzee" }, continent: "afrika", country: "cd", habitat: "regenwald", body: "vier-beine", birth: "saeugetier", food: "beides", cover: "fell", color: "schwarz" },

  /* ── T ── europa 2, asien 2, suedamerika 2 ──────────────────── */
  { id: "taube", name: { de: "Taube", en: "Pigeon" }, continent: "europa", country: "ch", habitat: "stadt", body: "zwei-beine-fluegel", birth: "eier", food: "pflanzen", cover: "federn", color: "grau" },
  { id: "turmfalke", name: { de: "Turmfalke", en: "Kestrel" }, continent: "europa", country: "ch", habitat: "wiese", body: "zwei-beine-fluegel", birth: "eier", food: "fleisch", cover: "federn", color: "braun" },
  { id: "tiger", name: { de: "Tiger", en: "Tiger" }, continent: "asien", country: "in", habitat: "regenwald", body: "vier-beine", birth: "saeugetier", food: "fleisch", cover: "fell", color: "orange-schwarz" },
  { id: "trampeltier", name: { de: "Trampeltier", en: "Two-humped camel" }, alt: { en: ["Bactrian camel"] }, continent: "asien", country: "cn", habitat: "wueste", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "braun" },
  { id: "tukan", name: { de: "Tukan", en: "Toucan" }, continent: "suedamerika", country: "br", habitat: "regenwald", body: "zwei-beine-fluegel", birth: "eier", food: "pflanzen", cover: "federn", color: "bunt" },
  { id: "tapir", name: { de: "Tapir", en: "Tapir" }, continent: "suedamerika", country: "br", habitat: "regenwald", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "haut", color: "schwarz-weiss" },

  /* ── U ── europa 2, and two singles the letter cannot pair ──── */
  { id: "uhu", name: { de: "Uhu", en: "Eagle owl" }, continent: "europa", country: "ch", habitat: "wald", body: "zwei-beine-fluegel", birth: "eier", food: "fleisch", cover: "federn", color: "braun" },
  { id: "unke", name: { de: "Unke", en: "Fire-bellied toad" }, continent: "europa", country: "de", habitat: "suesswasser", body: "vier-beine", birth: "eier", food: "insekten", cover: "haut", color: "grau-gelb" },
  { id: "uakari", name: { de: "Uakari", en: "Uakari" }, continent: "suedamerika", country: "br", habitat: "regenwald", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "rotbraun" },
  { id: "urial", name: { de: "Urial", en: "Urial" }, continent: "asien", country: "pk", habitat: "berge", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "wolle", color: "braun" },

  /* ── V ── suedamerika 3, and one European the letter cannot pair ── */
  { id: "vogelspinne", name: { de: "Vogelspinne", en: "Tarantula" }, continent: "suedamerika", country: "br", habitat: "regenwald", body: "acht-beine", birth: "eier", food: "insekten", cover: "panzer", color: "schwarz-braun" },
  { id: "vikunja", name: { de: "Vikunja", en: "Vicuña" }, continent: "suedamerika", country: "pe", habitat: "berge", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "wolle", color: "gold-braun" },
  { id: "vampirfledermaus", name: { de: "Vampirfledermaus", en: "Vampire bat" }, continent: "suedamerika", country: "br", habitat: "regenwald", body: "zwei-beine-fluegel", birth: "saeugetier", food: "fleisch", cover: "fell", color: "grau" },
  { id: "vielfrass", name: { de: "Vielfrass", en: "Wolverine" }, continent: "europa", country: "no", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "fleisch", cover: "fell", color: "schwarz-braun" },

  /* ── W ── europa 4, arktis 2, ozeane 2, nordamerika 2 ───────── */
  { id: "wolf", name: { de: "Wolf", en: "Wolf" }, continent: "europa", country: "ch", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "fleisch", cover: "fell", color: "grau" },
  { id: "waldkauz", name: { de: "Waldkauz", en: "Tawny owl" }, continent: "europa", country: "ch", habitat: "wald", body: "zwei-beine-fluegel", birth: "eier", food: "fleisch", cover: "federn", color: "braun" },
  { id: "wildschwein", name: { de: "Wildschwein", en: "Wild boar" }, continent: "europa", country: "de", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "beides", cover: "fell", color: "schwarz-braun" },
  { id: "wachtel", name: { de: "Wachtel", en: "Quail" }, continent: "europa", country: "de", habitat: "wiese", body: "zwei-beine-fluegel", birth: "eier", food: "pflanzen", cover: "federn", color: "braun" },
  { id: "wuehlmaus", name: { de: "Wühlmaus", en: "Vole" }, continent: "europa", country: "de", habitat: "wiese", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "braun" },
  { id: "walross", name: { de: "Walross", en: "Walrus" }, continent: "arktis", country: "no", habitat: "eis", body: "flossen", birth: "saeugetier", food: "fleisch", cover: "haut", color: "braun" },
  { id: "weisswal", name: { de: "Weisswal", en: "White whale" }, alt: { de: ["Beluga"], en: ["Beluga"] }, continent: "arktis", country: "no", habitat: "meer", body: "flossen", birth: "saeugetier", food: "fisch", cover: "haut", color: "weiss" },
  { id: "wal", name: { de: "Wal", en: "Whale" }, alt: { de: ["Blauwal"], en: ["Blue whale"] }, continent: "ozeane", country: "is", habitat: "meer", body: "flossen", birth: "saeugetier", food: "plankton", cover: "haut", color: "blau-grau" },
  { id: "wellhornschnecke", name: { de: "Wellhornschnecke", en: "Whelk" }, continent: "ozeane", country: "nl", habitat: "meer", body: "keine-beine", birth: "eier", food: "fleisch", cover: "panzer", color: "braun" },
  { id: "waschbaer", name: { de: "Waschbär", en: "Raccoon" }, continent: "nordamerika", country: "us", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "beides", cover: "fell", color: "grau" },
  { id: "wapiti", name: { de: "Wapiti", en: "Wapiti" }, continent: "nordamerika", country: "us", habitat: "wald", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "braun" },

  /* ── Y ── one animal, and nothing honest to pair it with ────── */
  { id: "yak", name: { de: "Yak", en: "Yak" }, alt: { de: ["Jak"] }, continent: "asien", country: "cn", habitat: "berge", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "schwarz" },

  /* ── Z ── europa 3, afrika 2 ────────────────────────────────── */
  { id: "ziege", name: { de: "Ziege", en: "Goat" }, continent: "europa", country: "ch", habitat: "berge", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "weiss" },
  { id: "zikade", name: { de: "Zikade", en: "Cicada" }, continent: "europa", country: "es", habitat: "wald", body: "sechs-beine-fluegel", birth: "eier", food: "pflanzen", cover: "panzer", color: "gruen" },
  { id: "zander", name: { de: "Zander", en: "Zander" }, alt: { en: ["Pikeperch"] }, continent: "europa", country: "de", habitat: "suesswasser", body: "flossen", birth: "eier", food: "fisch", cover: "schuppen", color: "gruen-braun" },
  { id: "zebra", name: { de: "Zebra", en: "Zebra" }, continent: "afrika", country: "ke", habitat: "savanne", body: "vier-beine", birth: "saeugetier", food: "pflanzen", cover: "fell", color: "schwarz-weiss" },
  { id: "zwergmanguste", name: { de: "Zwergmanguste", en: "Dwarf mongoose" }, continent: "afrika", country: "tz", habitat: "savanne", body: "vier-beine", birth: "saeugetier", food: "insekten", cover: "fell", color: "braun" }
];
