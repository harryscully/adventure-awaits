import { useState } from "react";
import { COPY, FINAL_ORDER } from "@/lib/anniversary/constants";
import { BackToMenu } from "./BackToMenu";

interface Props {
  onSolved: () => void;
  onBack: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  // deterministic-ish shuffle that's definitely not in order
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (a.every((v, i) => v === FINAL_ORDER[i])) {
    [a[0], a[a.length - 1]] = [a[a.length - 1], a[0]];
  }
  return a;
}

export function Ordering({ onSolved, onBack }: Props) {
  const [tiles, setTiles] = useState<string[]>(() => shuffle([...FINAL_ORDER]));
  const [wrong, setWrong] = useState(false);
  const [solved, setSolved] = useState(false);

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= tiles.length) return;
    setTiles((prev) => {
      const n = [...prev];
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
    setWrong(false);
  }

  function submit() {
    if (tiles.every((v, i) => v === FINAL_ORDER[i])) {
      setSolved(true);
      setTimeout(onSolved, 1800);
    } else {
      setWrong(true);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[100svh] px-5 py-10">
      <BackToMenu onBack={onBack} />
      <div className="paper-card max-w-md w-full p-7 text-center fade-up">
        <p className="typewriter text-[10px] tracking-[0.3em] text-ink-soft uppercase">
          the final puzzle
        </p>
        <h2 className="hand text-4xl text-primary mt-1">Arrange the words</h2>
        <p className="letter-serif italic text-base text-ink mt-3">{COPY.ordering.prompt}</p>
        <p className="text-xs text-ink-soft mt-1 typewriter">{COPY.ordering.sub}</p>

        <ul className="mt-6 space-y-2">
          {tiles.map((word, i) => (
            <li
              key={word}
              className={`flex items-center gap-2 p-3 rounded-lg border-2 ${solved ? "border-primary bg-primary/10" : "border-border bg-background"} transition-colors`}
              style={solved ? { animation: `fade-up 0.4s ${i * 0.1}s both` } : undefined}
            >
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0 || solved}
                  className="w-8 h-7 rounded bg-secondary text-ink-soft text-sm disabled:opacity-30 active:scale-95"
                  aria-label="Move up"
                >▲</button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === tiles.length - 1 || solved}
                  className="w-8 h-7 rounded bg-secondary text-ink-soft text-sm disabled:opacity-30 active:scale-95"
                  aria-label="Move down"
                >▼</button>
              </div>
              <div className="flex-1 hand text-2xl text-ink tracking-wide text-left pl-2">
                {word}
              </div>
              <div className="typewriter text-[10px] tracking-widest text-ink-soft pr-1">
                #{i + 1}
              </div>
            </li>
          ))}
        </ul>

        {wrong && !solved && (
          <p className="hand text-xl text-seal mt-4 fade-up">{COPY.ordering.wrong}</p>
        )}

        {solved ? (
          <p className="hand text-2xl text-primary mt-5 fade-up">
            {COPY.ordering.revealed}
          </p>
        ) : (
          <button
            onClick={submit}
            className="mt-5 px-7 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow"
          >
            {COPY.ordering.submit}
          </button>
        )}
      </div>
    </div>
  );
}
