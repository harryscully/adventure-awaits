import { useState } from "react";
import { BackToMenu } from "./BackToMenu";

interface Props {
  number: number;
  title?: string;
  clue: string;
  answer: string;
  definition: string;
  indicator: string;
  fodder: string;
  initialSolved: boolean;
  onSolved: () => void;
  onBack: () => void;
}

type HintKey = "definition" | "indicator" | "fodder";

export function Parseword({
  number,
  title = "Parseword",
  clue,
  answer,
  definition,
  indicator,
  fodder,
  initialSolved,
  onSolved,
  onBack,
}: Props) {
  const [guess, setGuess] = useState("");
  const [shake, setShake] = useState(false);
  const [solved, setSolved] = useState(initialSolved);
  const [shown, setShown] = useState<Set<HintKey>>(new Set());
  const [letters, setLetters] = useState<Set<number>>(new Set());

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (guess.trim().toUpperCase() === answer.toUpperCase()) {
      setSolved(true);
      onSolved();
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  const reveal = (k: HintKey) =>
    setShown((prev) => {
      const next = new Set(prev);
      next.add(k);
      return next;
    });

  const revealLetter = () => {
    const remaining = answer
      .split("")
      .map((_, i) => i)
      .filter((i) => !letters.has(i));
    if (!remaining.length) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    setLetters((prev) => new Set(prev).add(pick));
  };

  const allLetters = letters.size >= answer.length;

  const HintBtn = ({
    label,
    onClick,
    done,
    disabled,
  }: {
    label: string;
    onClick: () => void;
    done?: boolean;
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`typewriter text-xs tracking-wide px-3 py-2 rounded-lg border transition-colors ${
        disabled
          ? "border-border bg-secondary/40 text-ink-soft/40 cursor-not-allowed"
          : done
            ? "border-primary bg-primary/10 text-ink"
            : "border-border bg-secondary text-ink hover:bg-secondary/70"
      }`}
    >
      {done ? "✓ " : ""}
      {label}
    </button>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-svh px-5 py-10">
      <BackToMenu onBack={onBack} />
      <div
        className={`paper-card max-w-md w-full p-7 text-center fade-up ${shake ? "animate-pulse" : ""}`}
      >
        <p className="typewriter text-xs tracking-[0.3em] text-ink-soft uppercase">
          today's games · #{number}
        </p>
        <h2 className="hand text-4xl text-primary mt-1">{title}</h2>

        <p className="italic text-xl text-ink mt-6 leading-snug">{clue}</p>

        {solved ? (
          <div className="mt-6 space-y-3">
            <p className="hand text-4xl text-primary">{answer.toUpperCase()} ✓</p>
            <div className="paper-card p-4 text-left text-sm text-ink space-y-1.5">
              <p>
                <span className="typewriter text-xs tracking-widest uppercase text-ink-soft mr-2">
                  Definition
                </span>
                {definition}
              </p>
              <p>
                <span className="typewriter text-xs tracking-widest uppercase text-ink-soft mr-2">
                  Indicator
                </span>
                {indicator}
              </p>
              <p>
                <span className="typewriter text-xs tracking-widest uppercase text-ink-soft mr-2">
                  Fodder
                </span>
                {fodder}
              </p>
            </div>
          </div>
        ) : (
          <>
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
                Send to Frog
              </button>
            </form>

            {/* choose-your-own hints */}
            <div className="mt-6">
              <p className="typewriter text-xs tracking-[0.25em] text-ink-soft uppercase">
                ask Snail for a hint
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <HintBtn
                  label="Definition"
                  onClick={() => reveal("definition")}
                  done={shown.has("definition")}
                />
                <HintBtn
                  label="Wordplay indicator"
                  onClick={() => reveal("indicator")}
                  done={shown.has("indicator")}
                />
                <HintBtn
                  label="Fodder"
                  onClick={() => reveal("fodder")}
                  done={shown.has("fodder")}
                />
                <HintBtn
                  label="Reveal a letter"
                  onClick={revealLetter}
                  disabled={allLetters}
                />
              </div>

              {(shown.size > 0 || letters.size > 0) && (
                <div className="mt-3 paper-card p-3 text-left text-sm text-ink space-y-1.5">
                  {shown.has("definition") && (
                    <p>
                      <b>Definition:</b> {definition}
                    </p>
                  )}
                  {shown.has("indicator") && (
                    <p>
                      <b>Wordplay indicator:</b> {indicator}
                    </p>
                  )}
                  {shown.has("fodder") && (
                    <p>
                      <b>Fodder</b>: {fodder}
                    </p>
                  )}
                  {letters.size > 0 && (
                    <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                      {answer.split("").map((ch, i) => (
                        <span
                          key={i}
                          className={`typewriter w-7 h-9 flex items-center justify-center rounded border text-lg font-semibold uppercase ${
                            letters.has(i)
                              ? "bg-primary/10 border-primary text-ink"
                              : "bg-background border-border text-transparent"
                          }`}
                        >
                          {letters.has(i) ? ch : "_"}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => {
                  setSolved(true);
                  onSolved();
                }}
                className="typewriter text-[11px] tracking-widest uppercase text-ink-soft/70 hover:text-ink mt-4"
              >
                stuck? reveal the answer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}