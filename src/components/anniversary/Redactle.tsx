import { useEffect, useMemo, useRef, useState } from "react";
import { HintButton, type HintRung } from "./HintButton";
import { BackToMenu } from "./BackToMenu";

interface Props {
  number: number;
  title: string;
  article: string;
  answer: string; // lowercase
  initialSolved: boolean;
  onSolved: () => void;
  onBack: () => void;
}

const STOPWORDS = new Set([
  "a","an","the","and","or","of","in","to","for","its","it","is","are","was","were",
  "has","have","their","them","they","with","as","so","but","that","which","from",
  "every","many","few","most","there","by","on","at","be","been","than","also",
]);

// Light inflectional stemmer: reduces common word forms to a shared root so a
// single guess reveals its variants (plant/plants/planted/planting -> "plant").
// Intentionally conservative — prefers missing a rare form over a false match.
function stem(word: string): string {
  let s = word.toLowerCase().replace(/[\u2019']/g, "'");
  s = s.replace(/'s$|'$/g, ""); // possessives
  const undouble = (b: string) =>
    /([bcdfghjklmnpqrstvwxz])\1$/.test(b) ? b.slice(0, -1) : b;
  if (s.length > 4 && s.endsWith("ies")) return s.slice(0, -3) + "y"; // berries -> berry
  if (s.length > 5 && s.endsWith("ied")) return s.slice(0, -3) + "y";
  if (s.length > 4 && s.endsWith("ing")) return undouble(s.slice(0, -3));
  if (s.length > 3 && s.endsWith("ed")) return undouble(s.slice(0, -2));
  if (s.length > 4 && s.endsWith("ly")) return s.slice(0, -2);
  if (s.length > 4 && /(sses|shes|ches|xes|zes)$/.test(s)) return s.slice(0, -2); // glasses -> glass, boxes -> box
  if (s.length > 3 && s.endsWith("s") && !s.endsWith("ss")) return s.slice(0, -1); // plants -> plant
  return s;
}

type Token =
  | { kind: "word"; text: string; key: string; id: string }
  | { kind: "punct"; text: string; id: string };

function tokenize(s: string, prefix: string): Token[] {
  const out: Token[] = [];
  const re = /([A-Za-z']+)|([^A-Za-z']+)/g;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(s))) {
    const id = `${prefix}${i++}`;
    if (m[1]) out.push({ kind: "word", text: m[1], key: m[1].toLowerCase(), id });
    else out.push({ kind: "punct", text: m[2], id });
  }
  return out;
}

export function Redactle({
  number,
  title,
  article,
  answer,
  initialSolved,
  onSolved,
  onBack,
}: Props) {
  const titleTokens = useMemo(() => tokenize(title, "t"), [title]);
  const bodyTokens = useMemo(() => tokenize(article, "b"), [article]);

  const freq = useMemo(() => {
    const f = new Map<string, number>();
    for (const t of [...titleTokens, ...bodyTokens]) {
      if (t.kind === "word") f.set(t.key, (f.get(t.key) ?? 0) + 1);
    }
    return f;
  }, [titleTokens, bodyTokens]);

  // stem -> all article word-keys sharing that stem (so one guess reveals its forms)
  const stemIndex = useMemo(() => {
    const idx = new Map<string, string[]>();
    for (const key of freq.keys()) {
      const st = stem(key);
      const arr = idx.get(st);
      if (arr) arr.push(key);
      else idx.set(st, [key]);
    }
    return idx;
  }, [freq]);
  const answerStem = useMemo(() => stem(answer), [answer]);

  // total occurrences a guess reveals (itself + its word-forms)
  const matchCount = (g: string) =>
    (stemIndex.get(stem(g)) ?? []).reduce((sum, k) => sum + (freq.get(k) ?? 0), 0);

  const [revealed, setRevealed] = useState<Set<string>>(() => {
    if (initialSolved) return new Set(freq.keys());
    return new Set(STOPWORDS);
  });
  const [guesses, setGuesses] = useState<string[]>([]);
  const [guess, setGuess] = useState("");
  const [shake, setShake] = useState(0);
  const [solved, setSolved] = useState(initialSolved);
  const [titleFirstLetter, setTitleFirstLetter] = useState(false);
  // ids of redaction boxes whose letter-count is currently shown
  const [counted, setCounted] = useState<Set<string>>(new Set());
  // a guessed word the player tapped to locate in the article
  const [focused, setFocused] = useState<string | null>(null);
  const focusedStem = focused ? stem(focused) : null;
  const firstFocusRef = useRef<HTMLSpanElement | null>(null);

  function toggleCount(id: string) {
    setCounted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const g = guess.trim().toLowerCase();
    setGuess("");
    setFocused(null);
    if (!g || !/^[a-z']+$/.test(g)) {
      setShake((n) => n + 1);
      return;
    }
    if (!guesses.includes(g)) setGuesses((prev) => [...prev, g]);
    const keys = stemIndex.get(stem(g));
    if (keys && keys.length) {
      setRevealed((prev) => {
        const next = new Set(prev);
        for (const k of keys) next.add(k);
        return next;
      });
    }
    if (stem(g) === answerStem) {
      setRevealed(new Set(freq.keys()));
      setSolved(true);
      onSolved();
    }
  }

  function Box({
    len,
    id,
    forceCount,
  }: {
    len: number;
    id: string;
    forceCount?: boolean;
  }) {
    const show = forceCount || counted.has(id);
    return (
      <span
        role="button"
        tabIndex={0}
        onClick={() => toggleCount(id)}
        title="click to show letters"
        className="inline-flex items-center justify-start align-middle h-[1.4em] rounded-[2px] bg-ink/85 text-paper text-[0.78em] font-bold leading-none cursor-pointer select-none mx-px px-1 hover:bg-ink transition-colors"
        style={{ minWidth: `${Math.max(1, len * 0.62)}em` }}
      >
        {show ? len : ""}
      </span>
    );
  }

  function renderToken(t: Token, isTitle = false) {
    if (t.kind === "punct") return <span key={t.id}>{t.text}</span>;
    const isRevealed = solved || revealed.has(t.key);
    if (isRevealed) {
      const isFocus = focusedStem !== null && stem(t.key) === focusedStem;
      return (
        <span
          key={t.id}
          ref={isFocus && t.id === firstFocusId ? firstFocusRef : undefined}
          className={`${isTitle ? "" : "text-ink"} ${
            isFocus ? "bg-amber-300 text-ink rounded-sm px-0.5 -mx-0.5" : ""
          }`}
        >
          {t.text}
        </span>
      );
    }
    // title hint: show first letter of the subject + a box for the rest
    if (isTitle && titleFirstLetter && t.key === answer) {
      return (
        <span key={t.id} className="inline-flex items-baseline">
          <span className="font-semibold">{t.text[0].toUpperCase()}</span>
          <Box len={t.text.length - 1} id={t.id} forceCount={isTitle} />
        </span>
      );
    }
    // title boxes always show their letter count; body boxes show on click
    return <Box key={t.id} len={t.text.length} id={t.id} forceCount={isTitle} />;
  }

  // most-recent guess first, with its number and match count
  const tableRows = useMemo(
    () =>
      guesses
        .map((g, idx) => ({ word: g, count: matchCount(g), n: idx + 1 }))
        .reverse(),
    [guesses, freq],
  );

  // id of the first revealed occurrence of the focused word (to scroll to)
  const firstFocusId = useMemo(() => {
    if (!focusedStem) return null;
    for (const t of [...titleTokens, ...bodyTokens]) {
      if (t.kind === "word" && revealed.has(t.key) && stem(t.key) === focusedStem) {
        return t.id;
      }
    }
    return null;
  }, [focusedStem, titleTokens, bodyTokens, revealed]);

  useEffect(() => {
    if (focused && firstFocusRef.current) {
      firstFocusRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [focused, firstFocusId]);

  const rungs: HintRung[] = [
    {
      label: "Reveal a word",
      content: (
        <button
          onClick={() => {
            const remaining = [...freq.keys()].filter(
              (w) => !revealed.has(w) && w !== answer,
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
        <button
          onClick={() => setTitleFirstLetter(true)}
          className="underline decoration-dotted"
        >
          Show the first letter of the title
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-svh px-4 py-10">
      <BackToMenu onBack={onBack} />
      <div className="paper-card max-w-2xl w-full p-6 sm:p-8 fade-up">
        <p className="typewriter text-xs tracking-[0.3em] text-ink-soft uppercase text-center">
          today's games · #{number}
        </p>
        <h2 className="hand text-4xl text-primary mt-1 text-center">Redactle</h2>
        <p className="text-sm text-ink-soft mt-1 text-center">
          {solved
            ? "Solved — the article is revealed."
            : "Guess words to un-redact the article. Tap a box to count its letters. Guess the subject to win."}
        </p>

        <h3 className="font-mono text-xl text-ink mt-6 text-left leading-loose">
          {titleTokens.map((t) => renderToken(t, true))}
        </h3>

        <p className="font-mono text-sm sm:text-base text-ink mt-4 leading-loose text-left">
          {bodyTokens.map((t) => renderToken(t))}
        </p>

        {!solved && (
          <form onSubmit={submit} className="mt-6 flex gap-2">
            <input
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="enter a word"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className={`typewriter flex-1 min-w-0 text-center text-lg py-3 px-4 rounded-md bg-background border-2 border-border focus:border-primary outline-none lowercase tracking-widest ${shake ? "animate-pulse" : ""}`}
              key={shake}
            />
            <button
              type="submit"
              className="shrink-0 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium shadow"
            >
              Guess
            </button>
          </form>
        )}

        {!solved && tableRows.length > 0 && (
          <div className="mt-5 border border-border rounded-md overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_auto] gap-3 typewriter text-xs tracking-widest text-ink-soft uppercase bg-secondary px-3 py-1.5">
              <span>#</span>
              <span>guess</span>
              <span>matches</span>
            </div>
            <ul className="max-h-52 overflow-y-auto">
              {tableRows.map((r) => {
                const clickable = r.count > 0;
                return (
                  <li
                    key={r.word}
                    onClick={clickable ? () => setFocused((p) => (p === r.word ? null : r.word)) : undefined}
                    className={`grid grid-cols-[auto_1fr_auto] gap-3 px-3 py-1.5 text-base typewriter border-t border-border ${
                      r.count === 0 ? "text-ink-soft/60" : "text-ink"
                    } ${clickable ? "cursor-pointer hover:bg-secondary/60" : ""} ${
                      focused === r.word ? "bg-amber-200" : ""
                    }`}
                  >
                    <span className="text-ink-soft">{r.n}</span>
                    <span className="tracking-widest">{r.word}</span>
                    <span className="font-semibold">{r.count}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {solved && (
          <p className="mt-4 text-center hand text-2xl text-primary">
            🎉 {answer.toUpperCase()}!
          </p>
        )}

        {!solved && (
          <HintButton
            rungs={rungs}
            onSkip={() => {
              setSolved(true);
              setRevealed(new Set(freq.keys()));
              onSolved();
            }}
          />
        )}
      </div>
    </div>
  );
}