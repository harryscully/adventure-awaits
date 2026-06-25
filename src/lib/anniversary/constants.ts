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
    "Dearest Toad,",
    "Four years. Four whole years of you.",
    "Before I tell you where we're going today, you have to do what we always do first — play today's games.",
    "I've rigged them. Solve all five and you'll have the words to arrange the day.",
    "Yours, always —",
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
      "Once upon a sea, a Frog in Durham wrote to a Toad in Paris. Letters across the Channel, week after week.",
    stage2Caption:
      "Today, four years on, the letters meet in the middle. Here is your day, Toad.",
    closing: [
      "Happy four years, my Toad.",
      "From the Channel, to here. — Frog 🐸",
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
      "Tea is a fragrant drink brewed by pouring hot water over cured leaves of the plant Camellia sinensis. Originating in China thousands of years ago, tea spread along trade routes through Japan and India, eventually reaching Britain where it became a daily ritual. The leaves are processed in different ways to make black, green, oolong, and white varieties, each carrying its own colour and flavour. Today tea is the second most consumed beverage in the world after water, and a quiet afternoon cup with milk and a biscuit remains a small everyday comfort.",
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
      "Lavender is a flowering plant in the mint family, known for its slender purple spikes and calming fragrance. Native to the Mediterranean, the Middle East, and parts of India, lavender has been cultivated for thousands of years for its oil, its scent, and its beauty. The Romans used lavender in their baths, and the name itself is often traced to a Latin verb meaning to wash. Today vast purple fields of lavender bloom across Provence in France, drawing visitors and photographers every summer. The plant thrives in poor, well-drained soil and full sun, which makes it popular in dry gardens. Bees and butterflies are strongly attracted to its flowers, and beekeepers prize the pale honey that results. Lavender oil is widely used in aromatherapy, soaps, and perfumes, and many people believe its scent helps with relaxation and sleep. The dried flowers keep their colour and fragrance for months, so they are often sewn into small bags and tucked among clothes. There are many species, but English lavender is the most common in gardens, valued for its hardiness and sweet smell. From cooking and baking to medicine and decoration, few plants are as versatile or as instantly recognisable as lavender.",
  },
  {
    id: "field",
    type: "betweenle",
    label: "Betweenle",
    teaser: "narrow the alphabet",
    answer: "field",
  },
];

export const FINAL_ORDER = ["AFTERNOON", "TEA", "HITCHIN", "LAVENDER", "FIELD"] as const;
