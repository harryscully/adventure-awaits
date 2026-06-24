import { useMemo, useState } from "react";
import { PUZZLES } from "@/lib/anniversary/constants";
import { HintButton, type HintRung } from "./HintButton";

interface Props {
  onSolved: (answer: string) => void;
}

const FILLER = new Set([
  "A","AN","THE","IS","ARE","WAS","WERE","OF","TO","IN","ON","AT","BY","FOR","WITH",
  "AND","OR","BUT","IT","ITS","THIS","THAT","AS","FROM","INTO","THAN","SO","NOT","BE",
  "BEEN","HAS","HAVE","HAD","DO","DOES","DID","CAN","WILL","WOULD","COULD","ALSO",
]);

export function Redactle({ onSolved }: Props) {
  const { paragraph, answer, extraRedacted } = PUZZLES.redactle;
  const allRedacted = useMemo(() => {
    const s = new Set<string>([answer.toUpperCase(), ...extraRedacted.map((w) => w.toUpperCase())]);
    return s;
  }, [answer, extraRedacted]);

  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [guess, setGuess] = useState("");
  const [bumped, setBumped] = useState(0);
  const [firstLetterShown, setFirstLetterShown] = useState(false);
  const [extraReveal, setExtraReveal] = useState<string | null>(null);

  const tokens = useMemo(() => paragraph.split(/(\s+|[.,;:!?"])/), [paragraph]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const g = guess.trim().toUpperCase();
    setGuess("");
    if (!g) return;
    if (g === answer.toUpperCase()) {
      onSolved(answer);
      return;
    }
    // Reveal any redacted words that match
    if (allRedacted.has(g)) {
      setRevealed((prev) => {
        const next = new Set(prev);
        next.add(g);
        return next;
      });
    }
    setBumped((n) => n + 1);
  }

  function isRedacted(word: string) {
    const stripped = word.replace(/[^A-Za-z]/g, "").toUpperCase();
    if (!stripped) return false;
    if (FILLER.has(stripped)) return false;
    if (!allRedacted.has(stripped)) return false;
    if (revealed.has(stripped)) return false;
    if (stripped === answer.toUpperCase() && firstLetterShown) {
      return "first-letter";
    }
    return true;
  }

  const rungs: HintRung[] = [
    {
      label: "One redacted word",
      content: (
        <button
          onClick={() => {
            const remaining = [...allRedacted].filter(
              (w) => !revealed.has(w) && w !== answer.toUpperCase() && !extraReveal,
            );
            if (remaining.length) {
              const pick = remaining[0];
              setRevealed((prev) => new Set(prev).add(pick));
              setExtraReveal(pick);
            }
          }}
          className="underline decoration-dotted"
        >
          Reveal one hidden word{extraReveal ? `: ${extraReveal}` : ""}
        </button>
      ),
    },
    {
      label: "First letter",
      content: (
        <button
          onClick={() => setFirstLetterShown(true)}
          className="underline decoration-dotted"
        >
          The subject starts with <b>{answer[0]}</b>
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[100svh] px-5 py-10">
      <div className="paper-card max-w-lg w-full p-7 text-center fade-up">
        <p className="typewriter text-[10px] tracking-[0.3em] text-ink-soft uppercase">
          today's games · #2
        </p>
        <h2 className="hand text-4xl text-primary mt-1">Redactle</h2>
        <p className="text-sm text-ink-soft mt-1">
          Guess words to un-redact the text. Guess the subject to win.
        </p>

        <p className="letter-serif text-lg text-ink mt-6 leading-relaxed text-left">
          {tokens.map((t, i) => {
            const red = isRedacted(t);
            if (red === true) {
              return (
                <span
                  key={i}
                  className="inline-block align-middle h-[1em] rounded-sm bg-ink mx-[1px]"
                  style={{ width: `${Math.max(0.6, t.replace(/[^A-Za-z]/g, "").length * 0.55)}em` }}
                  aria-label="redacted"
                />
              );
            }
            if (red === "first-letter") {
              return (
                <span key={i} className="inline-block align-middle">
                  <span className="font-semibold">{t[0]}</span>
                  <span
                    className="inline-block h-[1em] rounded-sm bg-ink mx-[1px] align-middle"
                    style={{ width: `${(t.replace(/[^A-Za-z]/g, "").length - 1) * 0.55}em` }}
                  />
                </span>
              );
            }
            return <span key={i}>{t}</span>;
          })}
        </p>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
          <input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="guess a word"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            className="typewriter text-center text-lg py-3 px-4 rounded-md bg-background border-2 border-border focus:border-primary outline-none uppercase tracking-widest"
          />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium shadow"
          >
            Guess
          </button>
        </form>

        {bumped > 0 && (
          <p className="text-xs text-ink-soft mt-2 typewriter">{bumped} guess{bumped === 1 ? "" : "es"}</p>
        )}

        <HintButton rungs={rungs} onSkip={() => onSolved(answer)} />
      </div>
    </div>
  );
}
