import { useCallback, useEffect, useMemo, useState } from "react";
import words from "an-array-of-english-words";
import { HintButton, type HintRung } from "./HintButton";
import { BackToMenu } from "./BackToMenu";

interface Props {
  answer: string; // lowercase 5 letters
  initialSolved: boolean;
  onSolved: () => void;
  onBack: () => void;
}

// Base-26 alphabetical value of a 5-letter word (first letter most significant).
const val = (w: string) =>
  [...w.toLowerCase()].reduce((a, c, i) => a + (c.charCodeAt(0) - 97) * 26 ** (4 - i), 0);
const MAX = 26 ** 5 - 1;

// Scaled alphabetical distance — cosmetic scale so values read ~0–146 across the whole A→Z span.
// (Tune SPAN if you want the numbers to look more/less like the real game.)
const SPAN = 146;
const dist = (a: number, b: number) => Math.round((Math.abs(a - b) / MAX) * SPAN * 10) / 10;

const KEY_ROWS = [
  "QWERTYUIOP".split(""),
  "ASDFGHJKL".split(""),
  ["ENTER", ..."ZXCVBNM".split(""), "DEL"],
];
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function Betweenle({ answer, initialSolved, onSolved, onBack }: Props) {
  const answerVal = useMemo(() => val(answer), [answer]);

  const FIVE = useMemo(
    () => new Set((words as string[]).filter((w) => w.length === 5 && /^[a-z]+$/.test(w))),
    [],
  );

  const [letters, setLetters] = useState<string[]>(["", "", "", "", ""]);
  const [guesses, setGuesses] = useState<string[]>(() => (initialSolved ? [answer] : []));
  const [solved, setSolved] = useState(initialSolved);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(0);
  const [struck, setStruck] = useState<Set<string>>(new Set());
  const [showFirst, setShowFirst] = useState(false);
  const [showLength, setShowLength] = useState(false);

  // Narrowing bounds: top = nearest guess BELOW the answer (toward AAAAA),
  // bottom = nearest guess ABOVE the answer (toward ZZZZZ).
  const lowerWord = useMemo(() => {
    const below = guesses.filter((g) => val(g) < answerVal);
    return below.length ? below.reduce((a, b) => (val(b) > val(a) ? b : a)) : "aaaaa";
  }, [guesses, answerVal]);
  const upperWord = useMemo(() => {
    const above = guesses.filter((g) => val(g) > answerVal);
    return above.length ? above.reduce((a, b) => (val(b) < val(a) ? b : a)) : "zzzzz";
  }, [guesses, answerVal]);

  const topDist = dist(val(lowerWord), answerVal);
  const bottomDist = dist(val(upperWord), answerVal);
  const denom = topDist + bottomDist;
  const dotFrac = denom === 0 ? 0.5 : topDist / denom; // 0 = at top row, 1 = at bottom row

  const lastGuess = guesses[guesses.length - 1];
  const lastRel: "below" | "above" | "match" | null = !lastGuess
    ? null
    : val(lastGuess) === answerVal
      ? "match"
      : val(lastGuess) < answerVal
        ? "below"
        : "above";

  const submit = useCallback(() => {
    const word = letters.join("");
    setError("");
    if (word.length !== 5) {
      setShake((n) => n + 1);
      setError("Five letters, please.");
      return;
    }
    if (!FIVE.has(word)) {
      setShake((n) => n + 1);
      setError("Snail doesn't know that word.");
      return;
    }
    if (guesses.includes(word)) {
      setShake((n) => n + 1);
      setError("Already guessed that one.");
      return;
    }
    setGuesses((prev) => [...prev, word]);
    setLetters(["", "", "", "", ""]);
    if (val(word) === answerVal) {
      setSolved(true);
      onSolved();
    }
  }, [letters, FIVE, guesses, answerVal, onSolved]);

  const press = useCallback(
    (ch: string) => {
      if (solved) return;
      setError("");
      setLetters((prev) => {
        const i = prev.findIndex((l) => l === "");
        if (i === -1) return prev;
        const next = [...prev];
        next[i] = ch.toLowerCase();
        return next;
      });
    },
    [solved],
  );

  const backspace = useCallback(() => {
    setError("");
    setLetters((prev) => {
      const filled = prev.map((l) => l !== "");
      const last = filled.lastIndexOf(true);
      if (last === -1) return prev;
      const next = [...prev];
      next[last] = "";
      return next;
    });
  }, []);

  // Physical keyboard support (desktop convenience).
  useEffect(() => {
    if (solved) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") submit();
      else if (e.key === "Backspace") backspace();
      else if (/^[a-zA-Z]$/.test(e.key)) press(e.key);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [solved, submit, backspace, press]);

  const toggleStrike = (ch: string) =>
    setStruck((prev) => {
      const next = new Set(prev);
      if (next.has(ch)) next.delete(ch);
      else next.add(ch);
      return next;
    });

  const rungs: HintRung[] = [
    {
      label: "First letter",
      content: (
        <button onClick={() => setShowFirst(true)} className="underline decoration-dotted">
          Reveal the first letter
        </button>
      ),
    },
    {
      label: "Length",
      content: (
        <button onClick={() => setShowLength(true)} className="underline decoration-dotted">
          Confirm the length
        </button>
      ),
    },
  ];

  // ---- tile row renderer ----
  const Row = ({
    word,
    variant,
  }: {
    word: string;
    variant: "lower" | "upper" | "input";
  }) => {
    const chars =
      variant === "input"
        ? solved
          ? answer.toUpperCase().split("")
          : letters
        : word.toUpperCase().split("");
    const firstEmpty = letters.findIndex((l) => l === "");
    return (
      <div
        key={variant === "input" ? shake : undefined}
        className={`flex gap-1.5 justify-center ${variant === "input" && shake ? "animate-pulse" : ""}`}
      >
        {chars.map((ch, i) => {
          const base =
            "typewriter w-11 h-12 sm:w-12 flex items-center justify-center text-xl font-semibold uppercase rounded-md border";
          if (variant === "lower")
            return (
              <div key={i} className={`${base} bg-lavender/30 border-border text-ink/70`}>
                {ch}
              </div>
            );
          if (variant === "upper")
            return (
              <div key={i} className={`${base} bg-primary border-primary text-primary-foreground`}>
                {ch}
              </div>
            );
          // input
          const active = i === firstEmpty && !solved;
          return (
            <div
              key={i}
              className={`${base} bg-background ${active ? "border-primary border-2" : "border-border"}`}
            >
              {ch ? ch.toUpperCase() : active ? <span className="text-primary">•</span> : ""}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100svh] px-4 py-10">
      <BackToMenu onBack={onBack} />
      <div className="paper-card max-w-md w-full p-6 sm:p-7 text-center fade-up">
        <p className="typewriter text-[10px] tracking-[0.3em] text-ink-soft uppercase">
          today's games · betweenle
        </p>
        <h2 className="hand text-4xl text-primary mt-1">Betweenle</h2>
        <p className="text-sm text-ink-soft mt-1">
          {solved
            ? "Solved — the word is in place."
            : "A 5-letter word lives between the bounds. Each guess narrows them."}
        </p>

        {/* board: left rail (tags + dot) + three rows */}
        <div className="relative mt-6">
          {/* left rail */}
          <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col items-center">
            <div className="typewriter text-[11px] font-semibold text-ink bg-secondary rounded px-1.5 py-0.5 border border-border">
              {topDist}
            </div>
            <div className="relative flex-1 w-px my-1 bg-border">
              <div
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-orange-500 border-2 border-background shadow"
                style={{ top: `${dotFrac * 100}%` }}
              />
            </div>
            <div className="typewriter text-[11px] font-semibold text-ink bg-secondary rounded px-1.5 py-0.5 border border-border">
              {bottomDist}
            </div>
          </div>

          {/* rows */}
          <div className="ml-12 flex flex-col gap-2.5">
            <Row word={lowerWord} variant="lower" />
            <Row word={solved ? answer : ""} variant="input" />
            <Row word={upperWord} variant="upper" />
          </div>
        </div>

        {error && <p className="text-xs text-destructive mt-3">{error}</p>}

        {!solved && lastRel && lastRel !== "match" && (
          <p className="mt-3 typewriter text-xs text-ink-soft">
            <b className="text-ink">{lastGuess.toUpperCase()}</b> — the answer is{" "}
            {lastRel === "below" ? "later ↓ (toward ZZZZZ)" : "earlier ↑ (toward AAAAA)"}
          </p>
        )}

        {(showFirst || showLength) && !solved && (
          <p className="mt-2 text-xs text-ink-soft typewriter">
            {showFirst && (
              <>
                starts with <b>{answer[0].toUpperCase()}</b>
                {showLength && " · "}
              </>
            )}
            {showLength && <>length 5</>}
          </p>
        )}

        {/* A–Z scratchpad */}
        {!solved && (
          <div className="mt-5 flex flex-wrap gap-1 justify-center">
            {ALPHABET.map((ch) => (
              <button
                key={ch}
                onClick={() => toggleStrike(ch)}
                className={`typewriter w-6 h-6 text-xs rounded-full border transition-colors ${
                  struck.has(ch)
                    ? "text-ink-soft/40 line-through bg-transparent border-transparent"
                    : "text-ink bg-secondary border-border"
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        )}

        {/* on-screen keyboard */}
        {!solved && (
          <div className="mt-5 space-y-1.5 select-none">
            {KEY_ROWS.map((row, r) => (
              <div key={r} className="flex justify-center gap-1">
                {row.map((k) => {
                  const wide = k === "ENTER" || k === "DEL";
                  const onTap =
                    k === "ENTER" ? submit : k === "DEL" ? backspace : () => press(k);
                  return (
                    <button
                      key={k}
                      onClick={onTap}
                      className={`typewriter h-11 rounded-md bg-secondary border border-border text-ink font-medium active:bg-primary active:text-primary-foreground ${
                        wide ? "px-3 text-[11px]" : "w-8 text-sm"
                      }`}
                    >
                      {k === "DEL" ? "⌫" : k}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {solved && <p className="mt-4 hand text-2xl text-primary">🎉 {answer.toUpperCase()}!</p>}

        {!solved && (
          <HintButton
            rungs={rungs}
            onSkip={() => {
              setSolved(true);
              onSolved();
            }}
          />
        )}
      </div>
    </div>
  );
}