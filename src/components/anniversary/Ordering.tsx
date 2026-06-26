import { useState } from "react";
import { COPY, FINAL_ORDER } from "@/lib/anniversary/constants";
import { BackToMenu } from "./BackToMenu";

interface Props {
  onSolved: () => void;
  onBack: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // make sure it's not accidentally already in the right order
  if (a.every((v, i) => v === FINAL_ORDER[i])) {
    [a[0], a[a.length - 1]] = [a[a.length - 1], a[0]];
  }
  return a;
}

export function Ordering({ onSolved, onBack }: Props) {
  const [bank, setBank] = useState<string[]>(() => shuffle([...FINAL_ORDER]));
  const [placed, setPlaced] = useState<string[]>([]);
  const [wrong, setWrong] = useState(false);
  const [solved, setSolved] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const pick = (word: string) => {
    if (solved) return;
    setBank((b) => b.filter((w) => w !== word));
    setPlaced((p) => [...p, word]);
    setWrong(false);
  };

  const unplace = (word: string) => {
    if (solved) return;
    setPlaced((p) => p.filter((w) => w !== word));
    setBank((b) => [...b, word]);
    setWrong(false);
  };

  const reorder = (from: number, to: number) => {
    if (from === to) return;
    setPlaced((p) => {
      const n = [...p];
      const [m] = n.splice(from, 1);
      n.splice(to, 0, m);
      return n;
    });
    setWrong(false);
  };

  const submit = () => {
    if (placed.length !== FINAL_ORDER.length) return;
    if (placed.every((v, i) => v === FINAL_ORDER[i])) {
      setSolved(true);
      setTimeout(onSolved, 1800);
    } else {
      setWrong(true);
    }
  };

  const full = placed.length === FINAL_ORDER.length;

  return (
    <div className="flex flex-col items-center justify-center min-h-svh px-5 py-10">
      <BackToMenu onBack={onBack} />
      <div className="paper-card max-w-lg w-full p-7 text-center fade-up">
        <p className="typewriter text-xs tracking-[0.3em] text-ink-soft uppercase">
          the final puzzle
        </p>
        <h2 className="hand text-5xl text-primary mt-1">Arrange the words</h2>
        <p className="hand text-2xl text-ink mt-1">📬 All five words have been delivered!</p>
        <p className="letter-serif italic text-lg text-ink mt-3">{COPY.ordering.prompt}</p>
        <p className="text-sm text-ink-soft mt-1 typewriter">
          Tap a word to add it · tap it again to send it back · drag to reorder
        </p>

        {/* phrase box */}
        <div
          className={`mt-6 min-h-22 rounded-xl border-2 border-dashed p-3 flex flex-wrap gap-2 items-center justify-center transition-colors ${
            solved ? "border-primary bg-primary/10" : "border-border bg-background/60"
          }`}
        >
          {placed.length === 0 && (
            <span className="letter-serif italic text-base text-ink-soft">
              your phrase appears here…
            </span>
          )}
          {placed.map((word, i) => (
            <button
              key={word}
              draggable={!solved}
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex !== null) reorder(dragIndex, i);
                setDragIndex(null);
              }}
              onDragEnd={() => setDragIndex(null)}
              onClick={() => unplace(word)}
              className={`hand text-2xl tracking-wide px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                solved
                  ? "border-primary bg-primary/15 text-ink"
                  : "border-primary/50 bg-card text-ink hover:-translate-y-0.5 active:scale-95"
              } ${dragIndex === i ? "opacity-40" : ""}`}
              title={solved ? undefined : "Tap to remove · drag to reorder"}
            >
              {word}
            </button>
          ))}
        </div>

        {/* word bank */}
        {!solved && bank.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {bank.map((word) => (
              <button
                key={word}
                onClick={() => pick(word)}
                className="hand text-2xl tracking-wide px-4 py-2 rounded-lg border-2 border-border bg-secondary text-ink hover:-translate-y-0.5 active:scale-95 transition-transform"
              >
                {word}
              </button>
            ))}
          </div>
        )}

        {wrong && !solved && (
          <p className="hand text-2xl text-seal mt-5 fade-up">{COPY.ordering.wrong}</p>
        )}

        {solved ? (
          <p className="hand text-3xl text-primary mt-6 fade-up">{COPY.ordering.revealed}</p>
        ) : (
          <button
            onClick={submit}
            disabled={!full}
            className={`mt-6 px-7 py-3 rounded-full text-base font-medium shadow transition-transform ${
              full
                ? "bg-primary text-primary-foreground hover:scale-105"
                : "bg-secondary text-ink-soft cursor-not-allowed"
            }`}
          >
            {COPY.ordering.submit}
          </button>
        )}
      </div>
    </div>
  );
}