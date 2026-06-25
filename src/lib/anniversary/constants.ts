// All editable copy + answers live here.
// Frog = me (sender). Toad = her (recipient).

export const COPY = {
  envelope: {
    addressee: "Toad",
    sender: "from Frog",
    hint: "tap to break the seal",
    sealLetter: "F",
  },
  gate: {
    question: "Toad, will you go on a date with me today?",
    yes: "Yes",
    no: "No",
    noVariants: ["No", "Nope", "Are you sure?", "Try again", "…fine, yes"],
  },
  introLetter: [
    "Dearest Toad 🐸,",
    "Four years! Can you believe it!",
    "Before I tell you where we're going today, you have to do what we always do first - play today's games.",
    "Don't worry, I've rigged them. Solve all five and you'll have the words to arrange the day.",
    "Yours, always ",
    "Frog 🐸",
  ],
  menu: {
    title: "Today's games",
    sub: "Pick a puzzle. Solve them in any order.",
    finalLocked: "Arrange the words (unlocks when all 5 are solved)",
    finalUnlocked: "Arrange the words →",
  },
  snailLines: [
    "📬 Snail is delivering your next letter…",
    "📬 Snail is plodding along the garden wall…",
    "📬 Snail says: hold tight, almost there…",
  ],
  itineraryLabel: "words Snail has delivered",
  ordering: {
    prompt: "Arrange the five words into the right order.",
    sub: "Tap the arrows to move tiles up or down.",
    wrong: "Not quite — try again, Toad.",
    submit: "Lock it in",
    revealed: "Afternoon Tea at Hitchin Lavender Fields 🫖",
  },
  dateLock: {
    prompt: "Frog needs the date it all started.",
    sub: "(day / month / year)",
    nudge: "Not quite, my Toad. Try again — you know this one.",
    answer: { day: 27, month: 6, year: 2022 },
  },
  map: {
    stage1Caption:
      `Once upon a time,
      
      a Frog in Durham 
      wrote to a Toad in Paris...`,
    stage2Caption:
      `...four years on, 
      here is our day today, Toad.`,
    closing: [
      "Happy four years, my Toad.",
      "- Frog 🐸",
    ],
    replay: "View the puzzles again",
  },
  pins: {
    hitchin: {
      name: "Hitchin Lavender",
      emoji: "🫖",
      label: "Afternoon Tea",
      time: "12:00",
      lat: 51.9836,
      lng: -0.3406,
    },
    lussmans: {
      name: "Lussmans, Hertford",
      emoji: "🍽️",
      label: "Dinner",
      time: "19:00",
      lat: 51.7956,
      lng: -0.0793,
    },
  },
  origin: {
    durham: { name: "Durham", lat: 54.7761, lng: -1.5733 },
    paris: { name: "Paris", lat: 48.8566, lng: 2.3522 },
  },
};

// ---------- Puzzle definitions ----------

export type ParsewordCfg = {
  id: string;
  type: "parseword";
  label: string;
  teaser: string;
  answer: string;
  clue: string;
  definitionHint: string;
  wordplayHint: string;
};

export type RedactleCfg = {
  id: string;
  type: "redactle";
  label: string;
  teaser: string;
  answer: string; // lowercase
  title: string;
  article: string;
};

export type BetweenleCfg = {
  id: string;
  type: "betweenle";
  label: string;
  teaser: string;
  answer: string; // lowercase 5 letters
};

export type PuzzleCfg = ParsewordCfg | RedactleCfg | BetweenleCfg;

export const PUZZLE_LIST: PuzzleCfg[] = [
  {
    id: "afternoon",
    type: "parseword",
    label: "Parseword #1",
    teaser: "a cryptic clue",
    answer: "AFTERNOON",
    // [PLACEHOLDER] AFTER + NOON charade
    clue: "Later than midday — a part of the day (9)",
    definitionHint: "Definition: a part of the day.",
    wordplayHint: "Wordplay: 'later than' (5) + 'midday' (4) = 9 letters.",
  },
  {
    id: "tea",
    type: "redactle",
    label: "Redactle #1",
    teaser: "un-redact the article",
    answer: "tea",
    title: "Tea",
    // [PLACEHOLDER]
    article:
      `Tea is an aromatic beverage prepared by pouring hot or boiling water over cured or fresh leaves of Camellia sinensis, an evergreen shrub native to East Asia which originated in the borderlands of south-western China, north-east India and northern Myanmar. Tea is also made, but rarely, from the leaves of Camellia taliensis. After plain water, tea is the most widely consumed drink in the world. There are many types of tea; some have a cooling, slightly bitter, and astringent flavour, while others have profiles that include sweet, nutty, floral, or grassy notes. Tea has a stimulating effect in humans, primarily due to its caffeine content.

An early credible record of tea drinking dates to the third century AD, in a medical text written by Chinese physician Hua Tuo. It was popularised as a recreational drink during the Chinese Tang dynasty, and tea drinking spread to other East Asian countries. Portuguese priests and merchants introduced it to Europe during the 16th century. During the 17th century, drinking tea became fashionable among the British, who later started to plant tea on a large scale in India, where it had previously been used only as a medicine.

The term herbal tea refers to drinks not made from Camellia sinensis. They are the infusions of fruit, leaves, or other plant parts, such as steeps of rosehip, chamomile, or rooibos. These may be called tisanes or herbal infusions to prevent confusion with tea made from the tea plant.`,
  },
  {
    id: "hitchin",
    type: "parseword",
    label: "Parseword #2",
    teaser: "a cryptic clue",
    answer: "HITCHIN",
    clue: "Strike the jaw of a Hertfordshire market town (7)",
    definitionHint: "Definition: a Hertfordshire market town.",
    wordplayHint: "Wordplay: a synonym for 'strike' (3) + a body part (4) = 7 letters.",
  },
  {
    id: "lavender",
    type: "redactle",
    label: "Redactle #2",
    teaser: "un-redact the article",
    answer: "lavender",
    title: "Lavender",
    article:
      `Lavandula (common name lavender) is a genus of 47 known species of perennial flowering plants in the sage family, Lamiaceae. It is native to the Old World, primarily found across the drier, warmer regions of the Mediterranean, with an affinity for maritime breezes.

Lavender is found on the Iberian Peninsula and around the entirety of the Mediterranean coastline (including the Adriatic coast, the Balkans, the Levant, and coastal North Africa), in parts of Eastern and Southern Africa and the Middle East, as well as in South Asia and on the Indian subcontinent.

Many members of the genus are cultivated extensively in temperate climates as ornamental plants for garden and landscape use, for use as culinary herbs, and also commercially for the extraction of essential oils. Lavender is used in traditional medicine and as an ingredient in cosmetics.`,
  },
  {
    id: "field",
    type: "betweenle",
    label: "Betweenle",
    teaser: "narrow the alphabet",
    answer: "field",
  },
];

export const FINAL_ORDER = ["AFTERNOON", "TEA", "@", "HITCHIN", "LAVENDER", "FIELD"] as const;
