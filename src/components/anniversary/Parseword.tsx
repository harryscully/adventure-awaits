import { useState } from "react";
import { HintButton, type HintRung } from "./HintButton";

interface Props {
  number: number;
  title?: string;
  clue: string;
  answer: string;
  definitionHint: string;
  wordplayHint: string;
  onSolved: (answer: string) => void;
}

export function Parseword({
  number,
  title = "Parseword",
  clue,
  answer,
  definitionHint,
  wordplayHint,
  onSolved,
}: Props) {
  const [guess, setGuess] = useState("");
  const [shake, setShake] = useState(false);
  const [letterRevealed, setLetterRevealed] = useState(0);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (guess.trim().toUpperCase() === answer.toUpperCase()) {
      onSolved(answer);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  const rungs: HintRung[] = [
    { label: "Definition", content: definitionHint },
    { label: "Wordplay", content: wordplayHint },
    {
      label: "A letter",
      content: (
        <button
          onClick={() => setLetterRevealed((n) => Math.min(n + 1, answer.length))}
          className="underline decoration-dotted"
        >
          Reveal letter {letterRevealed + 1}: <b>{answer[letterRevealed]}</b>
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[100svh] px-5 py-10">
      <div className={`paper-card max-w-md w-full p-7 text-center fade-up ${shake ? "animate-pulse" : ""}`}>
        <p className="typewriter text-[10px] tracking-[0.3em] text-ink-soft uppercase">
          today's games · #{number}
        </p>
        <h2 className="hand text-4xl text-primary mt-1">{title}</h2>

        <p className="letter-serif italic text-xl text-ink mt-6 leading-snug">
          "{clue}"
        </p>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
          <input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="your answer"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            className="typewriter text-center text-xl py-3 px-4 rounded-md bg-background border-2 border-border focus:border-primary outline-none uppercase tracking-widest"
          />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium shadow"
          >
            Send to Toad
          </button>
        </form>

        <HintButton rungs={rungs} onSkip={() => onSolved(answer)} />
      </div>
    </div>
  );
}
