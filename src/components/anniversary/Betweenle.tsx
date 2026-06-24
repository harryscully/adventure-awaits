import { useMemo, useState } from "react";
import { PUZZLES } from "@/lib/anniversary/constants";
import { isValidFiveLetter, FIVE_LETTER_WORDS } from "@/lib/anniversary/words";
import { HintButton, type HintRung } from "./HintButton";

interface Props {
  onSolved: (answer: string) => void;
}

function pct(word: string) {
  // Map a 5-letter word to a [0,1] position alphabetically between AAAAA and ZZZZZ.
  const base = 26;
  let n = 0;
  for (let i = 0; i < 5; i++) {
    const c = word.charCodeAt(i) - 65;
    n = n * base + c;
  }
  const max = Math.pow(base, 5) - 1;
  return n / max;
}

interface Guess {
  word: string;
  position: number;
  relation: "below" | "above" | "match";
}

export function Betweenle({ onSolved }: Props) {
  const answer = PUZZLES.betweenle.answer.toUpperCase();
  const answerPct = useMemo(() => pct(answer), [answer]);

  const [input, setInput] = useState("");
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [error, setError] = useState("");
  const [showFirst, setShowFirst] = useState(false);
  const [showLength, setShowLength] = useState(false);

  // Compute current bounds based on guesses
  const lower = useMemo(
    () => Math.max(0, ...guesses.filter((g) => g.relation === "below").map((g) => g.position)),
    [guesses],
  );
  const upper = useMemo(
    () => Math.min(1, ...guesses.filter((g) => g.relation === "above").map((g) => g.position), 1),
    [guesses],
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const word = input.trim().toUpperCase();
    setError("");
    if (word.length !== 5) {
      setError("Five letters, please.");
      return;
    }
    if (!isValidFiveLetter(word)) {
      setError("Snail doesn't know that word.");
      return;
    }
    const p = pct(word);
    const relation: Guess["relation"] = p === answerPct ? "match" : p < answerPct ? "below" : "above";
    setGuesses((prev) => [...prev, { word, position: p, relation }]);
    setInput("");
    if (relation === "match") {
      setTimeout(() => onSolved(answer), 600);
    }
  }

  const rungs: HintRung[] = [
    {
      label: "First letter",
      content: (
        <button onClick={() => setShowFirst(true)} className="underline decoration-dotted">
          Starts with <b>{answer[0]}</b>
        </button>
      ),
    },
    {
      label: "Length",
      content: (
        <button onClick={() => setShowLength(true)} className="underline decoration-dotted">
          Confirmed: it's a 5-letter word
        </button>
      ),
    },
  ];

  void FIVE_LETTER_WORDS; // keep import used

  return (
    <div className="flex flex-col items-center justify-center min-h-[100svh] px-5 py-10">
      <div className="paper-card max-w-md w-full p-7 text-center fade-up">
        <p className="typewriter text-[10px] tracking-[0.3em] text-ink-soft uppercase">
          today's games · #3
        </p>
        <h2 className="hand text-4xl text-primary mt-1">Betweenle</h2>
        <p className="text-sm text-ink-soft mt-1">
          Guess a 5-letter word. Each guess narrows the alphabet.
        </p>

        {/* Range bar */}
        <div className="mt-6">
          <div className="relative h-3 rounded-full bg-secondary border border-border overflow-hidden">
            <div
              className="absolute inset-y-0 bg-lavender/40"
              style={{ left: `${lower * 100}%`, right: `${(1 - upper) * 100}%` }}
            />
            {guesses.map((g, i) => (
              <div
                key={i}
                className="absolute top-1/2 -translate-y-1/2 w-1.5 h-4 bg-ink rounded"
                style={{ left: `calc(${g.position * 100}% - 3px)` }}
                title={g.word}
              />
            ))}
          </div>
          <div className="flex justify-between typewriter text-[10px] text-ink-soft mt-1 tracking-widest">
            <span>AAAAA</span>
            <span>ZZZZZ</span>
          </div>
        </div>

        {/* Guesses */}
        <ul className="mt-5 space-y-1 text-sm">
          {guesses.slice().reverse().map((g, i) => (
            <li
              key={i}
              className="typewriter flex items-center justify-between px-3 py-1.5 rounded bg-background border border-border"
            >
              <span className="tracking-widest">{g.word}</span>
              <span className="text-ink-soft text-xs">
                {g.relation === "match"
                  ? "🎉 match!"
                  : g.relation === "below"
                    ? "↑ later in the alphabet"
                    : "↓ earlier in the alphabet"}
              </span>
            </li>
          ))}
        </ul>

        <form onSubmit={submit} className="mt-5 flex flex-col gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={5}
            placeholder="5 letters"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            className="typewriter text-center text-xl py-3 px-4 rounded-md bg-background border-2 border-border focus:border-primary outline-none uppercase tracking-widest"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <button type="submit" className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium shadow">
            Guess
          </button>
        </form>

        {(showFirst || showLength) && (
          <p className="mt-3 text-xs text-ink-soft typewriter">
            {showFirst && <>starts with {answer[0]} · </>}
            {showLength && <>length 5</>}
          </p>
        )}

        <HintButton rungs={rungs} onSkip={() => onSolved(answer)} />
      </div>
    </div>
  );
}
