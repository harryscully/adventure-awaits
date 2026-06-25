import { useEffect, useMemo, useRef, useState } from "react";
import words from "an-array-of-english-words";
import { HintButton, type HintRung } from "./HintButton";
import { BackToMenu } from "./BackToMenu";

interface Props {
  answer: string; // lowercase 5 letters
  initialSolved: boolean;
  onSolved: () => void;
  onBack: () => void;
}

const val = (w: string) =>
  [...w.toLowerCase()].reduce((a, c, i) => a + (c.charCodeAt(0) - 97) * 26 ** (4 - i), 0);
const MAX = 26 ** 5 - 1;
const topPct = (w: string) => (val(w) / MAX) * 100;

interface Guess {
  word: string;
  pct: number;
  rel: "above" | "below" | "match";
}

export function Betweenle({ answer, initialSolved, onSolved, onBack }: Props) {
  const answerVal = useMemo(() => val(answer), [answer]);
  const answerPct = useMemo(() => topPct(answer), [answer]);

  const FIVE = useMemo(
    () => new Set((words as string[]).filter((w) => w.length === 5 && /^[a-z]+$/.test(w))),
    [],
  );

  const [letters, setLetters] = useState<string[]>(["", "", "", "", ""]);
  const [guesses, setGuesses] = useState<Guess[]>(() =>
    initialSolved ? [{ word: answer, pct: topPct(answer), rel: "match" }] : [],
  );
  const [shake, setShake] = useState(0);
  const [error, setError] = useState("");
  const [solved, setSolved] = useState(initialSolved);
  const [showFirst, setShowFirst] = useState(false);
  const [showLength, setShowLength] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!solved) inputsRef.current[0]?.focus();
  }, [solved]);

  function setAt(i: number, v: string) {
    const ch = v.slice(-1).toLowerCase();
    if (ch && !/[a-z]/.test(ch)) return;
    setLetters((prev) => {
      const next = [...prev];
      next[i] = ch;
      return next;
    });
    if (ch && i < 4) inputsRef.current[i + 1]?.focus();
  }

  function onKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (letters[i]) {
        setLetters((prev) => { const n = [...prev]; n[i] = ""; return n; });
      } else if (i > 0) {
        inputsRef.current[i - 1]?.focus();
        setLetters((prev) => { const n = [...prev]; n[i - 1] = ""; return n; });
      }
      e.preventDefault();
    } else if (e.key === "Enter") {
      submit();
    } else if (e.key === "ArrowLeft" && i > 0) {
      inputsRef.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < 4) {
      inputsRef.current[i + 1]?.focus();
    }
  }

  function submit() {
    const word = letters.join("");
    setError("");
    if (word.length !== 5) { setShake((n) => n + 1); setError("Five letters, please."); return; }
    if (!FIVE.has(word)) { setShake((n) => n + 1); setError("Snail doesn't know that word."); return; }
    if (guesses.some((g) => g.word === word)) { setShake((n) => n + 1); setError("Already guessed."); return; }
    const v = val(word);
    const rel: Guess["rel"] = v === answerVal ? "match" : v < answerVal ? "below" : "above";
    const g: Guess = { word, pct: topPct(word), rel };
    setGuesses((prev) => [...prev, g]);
    setLetters(["", "", "", "", ""]);
    inputsRef.current[0]?.focus();
    if (rel === "match") {
      setSolved(true);
      onSolved();
    }
  }

  const lowerGuess = useMemo(() => {
    const bs = guesses.filter((g) => g.rel === "below");
    return bs.length ? bs.reduce((a, b) => (b.pct > a.pct ? b : a)) : null;
  }, [guesses]);
  const upperGuess = useMemo(() => {
    const as = guesses.filter((g) => g.rel === "above");
    return as.length ? as.reduce((a, b) => (b.pct < a.pct ? b : a)) : null;
  }, [guesses]);

  const lastGuess = guesses[guesses.length - 1];
  const bandTop = upperGuess?.pct ?? 0;
  const bandBottom = lowerGuess?.pct ?? 100;
  const bandValid = bandTop <= bandBottom;

  const rungs: HintRung[] = [
    { label: "First letter", content: (
      <button onClick={() => setShowFirst(true)} className="underline decoration-dotted">
        Starts with <b>{answer[0].toUpperCase()}</b>
      </button>
    )},
    { label: "Length", content: (
      <button onClick={() => setShowLength(true)} className="underline decoration-dotted">
        Confirmed: 5 letters
      </button>
    )},
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[100svh] px-4 py-10">
      <BackToMenu onBack={onBack} />
      <div className="paper-card max-w-md w-full p-6 sm:p-7 text-center fade-up">
        <p className="typewriter text-[10px] tracking-[0.3em] text-ink-soft uppercase">
          today's games · betweenle
        </p>
        <h2 className="hand text-4xl text-primary mt-1">Betweenle</h2>
        <p className="text-sm text-ink-soft mt-1">
          {solved ? "Solved — the word is in place." : "A 5-letter word. Each guess narrows the alphabet."}
        </p>

        <div className="mt-6 flex gap-4 items-stretch">
          <div className="relative w-16 shrink-0">
            <div className="typewriter text-[10px] tracking-widest text-ink-soft text-center">AAAAA</div>
            <div className="relative mx-auto my-1 w-2 rounded-full bg-secondary border border-border" style={{ height: 360 }}>
              {bandValid && !solved && (lowerGuess || upperGuess) && (
                <div className="absolute inset-x-0 bg-lavender/50 rounded-full"
                  style={{ top: `${bandTop}%`, bottom: `${100 - bandBottom}%` }} />
              )}
              {solved && (
                <div className="absolute -inset-x-2 h-1 bg-primary rounded" style={{ top: `${answerPct}%` }} />
              )}
              {guesses.map((g, i) => (
                <div key={i}
                  className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 typewriter text-[10px] tracking-widest px-1.5 py-0.5 rounded border ${g.rel === "match" ? "bg-primary text-primary-foreground border-primary" : "bg-background text-ink border-border"}`}
                  style={{ top: `${g.pct}%` }} title={g.word}>
                  {g.word.toUpperCase()}
                </div>
              ))}
            </div>
            <div className="typewriter text-[10px] tracking-widest text-ink-soft text-center">ZZZZZ</div>
          </div>

          <div className="flex-1 flex flex-col">
            {!solved && (
              <>
                <div key={shake} className={`flex gap-1.5 justify-center ${shake ? "animate-pulse" : ""}`}>
                  {letters.map((ch, i) => (
                    <input key={i}
                      ref={(el) => { inputsRef.current[i] = el; }}
                      value={ch.toUpperCase()}
                      onChange={(e) => setAt(i, e.target.value)}
                      onKeyDown={(e) => onKey(i, e)}
                      maxLength={1} inputMode="text" autoCapitalize="characters" autoCorrect="off" spellCheck={false}
                      className="typewriter w-10 h-12 sm:w-11 sm:h-13 text-center text-xl font-semibold uppercase bg-background border-2 border-border focus:border-primary outline-none rounded-md" />
                  ))}
                </div>
                {error && <p className="text-xs text-destructive mt-2">{error}</p>}
                <button onClick={submit} className="mt-3 px-5 py-2 rounded-full bg-primary text-primary-foreground font-medium shadow">
                  Guess
                </button>
                {lastGuess && lastGuess.rel !== "match" && (
                  <div className="mt-4 text-left typewriter text-xs text-ink-soft space-y-1">
                    <p><b className="text-ink">{lastGuess.word.toUpperCase()}</b> — answer is{" "}
                      {lastGuess.rel === "below" ? "↑ later in the alphabet" : "↓ earlier in the alphabet"}</p>
                  </div>
                )}
                {(showFirst || showLength) && (
                  <p className="mt-3 text-xs text-ink-soft typewriter">
                    {showFirst && <>starts with {answer[0].toUpperCase()} · </>}
                    {showLength && <>length 5</>}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {solved && (
          <p className="mt-4 hand text-2xl text-primary">🎉 {answer.toUpperCase()}!</p>
        )}

        {!solved && <HintButton rungs={rungs} onSkip={() => { setSolved(true); onSolved(); }} />}
      </div>
    </div>
  );
}
