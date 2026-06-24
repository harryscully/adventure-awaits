// All editable copy + answers live here.
// Toad = me. Frog = her. Replace [PLACEHOLDER] strings any time.

export const COPY = {
  envelope: {
    addressee: "Frog",
    sender: "from Toad",
    hint: "tap to break the seal",
  },
  gate: {
    question: "Frog, will you go on a date with me today?",
    yes: "Yes",
    no: "No",
    noVariants: ["No", "Nope", "Are you sure?", "Try again", "…fine, yes"],
  },
  introLetter: [
    // [PLACEHOLDER] — Toad's intro letter. Edit freely.
    "Dearest Frog,",
    "Four years. Four whole years of you.",
    "Before I tell you where we're going today, you have to do what we always do first — play today's games.",
    "I've rigged them. Solve them and the day reveals itself.",
    "Yours, always —",
    "Toad 🐸",
  ],
  snailLines: [
    // [PLACEHOLDER] — used at random between puzzles
    "📬 Snail is delivering your next letter…",
    "📬 Snail is plodding along the garden wall…",
    "📬 Snail says: hold tight, almost there…",
  ],
  itineraryLabel: "what Snail has delivered so far",
  dateLock: {
    prompt: "Toad needs the date it all started.",
    sub: "(day / month / year)",
    nudge: "Not quite, my Frog. Try again — you know this one.",
    answer: { day: 27, month: 6, year: 2022 },
  },
  map: {
    stage1Caption:
      // [PLACEHOLDER]
      "Once upon a sea, a Toad in Durham wrote to a Frog in Paris. Letters across the Channel, week after week.",
    stage2Caption:
      // [PLACEHOLDER]
      "Today, four years on, the letters meet in the middle. Here is your day, Frog.",
    closing: [
      // [PLACEHOLDER]
      "Happy four years, my Frog.",
      "From the Channel, to here. — Toad 🐸",
    ],
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

// Puzzle definitions (answers are hard-coded, client-side).
export const PUZZLES = {
  parseword1: {
    answer: "HITCHIN",
    // [PLACEHOLDER] — HIT + CHIN charade clue
    clue: "Strike the jaw of a Hertfordshire market town (7)",
    definitionHint: "Definition: a Hertfordshire market town.",
    wordplayHint: "Wordplay: a synonym for 'strike' (3) + a body part (4) = 7 letters.",
  },
  parseword2: {
    answer: "HERTFORD",
    // [PLACEHOLDER] — heart homophone + ford
    clue: "Sounds like the organ of love, then crosses the river — a county town (8)",
    definitionHint: "Definition: a county town in southern England.",
    wordplayHint: "Wordplay: homophone of 'heart' (4) + a river crossing (4).",
  },
  redactle: {
    answer: "LAVENDER",
    extraRedacted: ["PURPLE", "PROVENCE", "MEDITERRANEAN", "FLOWER", "FRAGRANT", "BEES"],
    // [PLACEHOLDER] — short blurb about the secret subject
    paragraph:
      "LAVENDER is a FRAGRANT FLOWER native to the MEDITERRANEAN, most famously cultivated in PROVENCE. Its slender stalks turn a deep PURPLE in midsummer and draw clouds of BEES. The plant is prized for its oil, its colour, and the way a single field of it can stop you in your tracks.",
  },
  betweenle: {
    answer: "FIELD",
  },
};

export const STAGES = [
  "envelope",
  "gate",
  "intro",
  "puzzle1",
  "snail1",
  "puzzle2",
  "snail2",
  "puzzle3",
  "snail3",
  "puzzle4",
  "datelock",
  "reveal",
] as const;
export type Stage = (typeof STAGES)[number];
