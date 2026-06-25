import { useMemo, useState } from "react";
import { HintButton, type HintRung } from "./HintButton";

interface Props {
  onSolved: (answer: string) => void;
}

const TITLE = "Lavender";
const ARTICLE = `Lavender is a flowering plant in the mint family, known for its slender purple spikes and calming fragrance. Native to the Mediterranean, the Middle East, and parts of India, lavender has been cultivated for thousands of years for its oil, its scent, and its beauty. The Romans used lavender in their baths, and the name itself is often traced to a Latin verb meaning to wash. Today vast purple fields of lavender bloom across Provence in France, drawing visitors and photographers every summer. The plant thrives in poor, well-drained soil and full sun, which makes it popular in dry gardens. Bees and butterflies are strongly attracted to its flowers, and beekeepers prize the pale honey that results. Lavender oil is widely used in aromatherapy, soaps, and perfumes, and many people believe its scent helps with relaxation and sleep. The dried flowers keep their colour and fragrance for months, so they are often sewn into small bags and tucked among clothes. There are many species, but English lavender is the most common in gardens, valued for its hardiness and sweet smell. From cooking and baking to medicine and decoration, few plants are as versatile or as instantly recognisable as lavender.`;

const ANSWER = "lavender";

const STOPWORDS = new Set(
  [
    "a","an","the","and","or","of","in","to","for","its","it","is","are","was","were",
    "has","have","their","them","they","with","as","so","but","that","which","from",
    "every","many","few","most","there",
  ],
);

type Token = { kind: "word"; text: string; key: string } | { kind: "punct"; text: string };

function tokenize(s: string): Token[] {
  const out: Token[] = [];
  const re = /([A-Za-z']+)|([^A-Za-z']+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m[1]) out.push({ kind: "word", text: m[1], key: m[1].toLowerCase() });
    else out.push({ kind: "punct", text: m[2] });
  }
  return out;
}

export function Redactle({ onSolved }: Props) {
  const titleTokens = useMemo(() => tokenize(TITLE), []);
  const bodyTokens = useMemo(() => tokenize(ARTICLE), []);

  // word frequency map (lowercase)
  const freq = useMemo(() => {
    const f = new Map<string, number>();
    for (const t of [...titleTokens, ...bodyTokens]) {
      if (t.kind === "word") f.set(t.key, (f.get(t.key) ?? 0) + 1);
    }
    return f;
  }, [titleTokens, bodyTokens]);

  const [revealed, setRevealed] = useState<Set<string>>(() => new Set(STOPWORDS));
  const [guesses, setGuesses] = useState<string[]>([]);
  const [guess, setGuess] = useState("");
  const [shake, setShake] = useState(0);
  const [solved, setSolved] = useState(false);
  const [titleFirstLetter, setTitleFirstLetter] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const g = guess.trim().toLowerCase();
    setGuess("");
    if (!g || !/^[a-z']+$/.test(g)) {
      setShake((n) => n + 1);
      return;
    }
    if (!guesses.includes(g)) setGuesses((prev) => [...prev, g]);
    if (freq.has(g)) {
      setRevealed((prev) => {
        const next = new Set(prev);
        next.add(g);
        return next;
      });
    }
    if (g === ANSWER) {
      setSolved(true);
      setTimeout(() => onSolved(ANSWER), 1200);
    }
  }

  function renderToken(t: Token, i: number, isTitle = false) {
    if (t.kind === "punct") return <span key={i}>{t.text}</span>;
    const isRevealed = solved || revealed.has(t.key);
    if (isRevealed) {
      return (
        <span key={i} className={isTitle ? "" : "text-ink"}>
          {t.text}
        </span>
      );
    }
    // first letter peek for title word
    if (isTitle && titleFirstLetter && t.key === ANSWER) {
      return (
        <span key={i} className="inline-flex items-baseline">
          <span className="font-semibold">{t.text[0]}</span>
          <span
            className="inline-block h-[0.9em] rounded-sm bg-ink mx-[1px] align-middle"
            style={{ width: `${(t.text.length - 1) * 0.55}em` }}
          />
        </span>
      );
    }
    return (
      <span
        key={i}
        className="inline-block align-middle h-[0.95em] rounded-sm bg-ink mx-[1px]"
        style={{ width: `${Math.max(0.6, t.text.length * 0.55)}em` }}
        aria-label="redacted"
      />
    );
  }

  // Guess table data
  const tableRows = useMemo(() => {
    const rows = guesses.map((g) => ({ word: g, count: freq.get(g) ?? 0 }));
    rows.sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
    return rows;
  }, [guesses, freq]);

  const rungs: HintRung[] = [
    {
      label: "Reveal a word",
      content: (
        <button
          onClick={() => {
            const remaining = [...freq.keys()].filter(
              (w) => !revealed.has(w) && w !== ANSWER,
            );
            if (remaining.length) {
              const pick = remaining[Math.floor(Math.random() * remaining.length)];
              setRevealed((prev) => new Set(prev).add(pick));
            }
          }}
          className="underline decoration-dotted"
        >
          Reveal a random hidden word
        </button>
      ),
    },
    {
      label: "Title hint",
      content: (
        <button onClick={() => setTitleFirstLetter(true)} className="underline decoration-dotted">
          Show the first letter of the title
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[100svh] px-4 py-10">
      <div className="paper-card max-w-2xl w-full p-6 sm:p-8 fade-up">
        <p className="typewriter text-[10px] tracking-[0.3em] text-ink-soft uppercase text-center">
          today's games · #2
        </p>
        <h2 className="hand text-4xl text-primary mt-1 text-center">Redactle</h2>
        <p className="text-sm text-ink-soft mt-1 text-center">
          Guess words to un-redact the article. Guess the subject to win.
        </p>

        {/* Title */}
        <h3 className="letter-serif text-2xl text-ink mt-6 text-center leading-snug">
          {titleTokens.map((t, i) => renderToken(t, i, true))}
        </h3>

        {/* Article */}
        <p className="letter-serif text-base sm:text-lg text-ink mt-4 leading-relaxed text-left">
          {bodyTokens.map((t, i) => renderToken(t, i))}
        </p>

        {/* Input */}
        <form onSubmit={submit} className="mt-6 flex gap-2">
          <input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="guess a word"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            disabled={solved}
            className={`typewriter flex-1 text-center text-lg py-3 px-4 rounded-md bg-background border-2 border-border focus:border-primary outline-none lowercase tracking-widest ${shake ? "animate-pulse" : ""}`}
            key={shake}
          />
          <button
            type="submit"
            disabled={solved}
            className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium shadow disabled:opacity-50"
          >
            Guess
          </button>
        </form>

        {/* Guess table */}
        {tableRows.length > 0 && (
          <div className="mt-5 border border-border rounded-md overflow-hidden">
            <div className="grid grid-cols-[1fr_auto] typewriter text-[10px] tracking-widest text-ink-soft uppercase bg-secondary px-3 py-1.5">
              <span>guess</span>
              <span>matches</span>
            </div>
            <ul className="max-h-48 overflow-y-auto">
              {tableRows.map((r) => (
                <li
                  key={r.word}
                  className={`grid grid-cols-[1fr_auto] px-3 py-1.5 text-sm typewriter border-t border-border ${r.count === 0 ? "text-ink-soft/60" : "text-ink"}`}
                >
                  <span className="tracking-widest">{r.word}</span>
                  <span>{r.count}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {solved && (
          <p className="mt-4 text-center hand text-2xl text-primary">🎉 Lavender!</p>
        )}

        <HintButton rungs={rungs} onSkip={() => onSolved(ANSWER)} />
      </div>
    </div>
  );
}
