import { useState, type ReactNode } from "react";

export interface HintRung {
  label: string;
  content: ReactNode;
}

interface Props {
  rungs: HintRung[];
  onSkip: () => void;
}

export function HintButton({ rungs, onSkip }: Props) {
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState(0);

  return (
    <div className="mt-6">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="typewriter text-xs tracking-widest text-ink-soft uppercase underline decoration-dotted underline-offset-4 hover:text-ink"
        >
          📜 Ask Snail for a hint
        </button>
      ) : (
        <div className="paper-card p-4 text-left max-w-md mx-auto fade-up">
          <p className="hand text-lg text-ink mb-3">A note from Snail:</p>

          <ul className="space-y-2 letter-serif text-base text-ink">
            {rungs.slice(0, revealed).map((r, i) => (
              <li key={i}>
                <span className="typewriter text-[10px] tracking-widest text-ink-soft uppercase mr-2">
                  {r.label}
                </span>
                {r.content}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap gap-2 justify-end">
            {revealed < rungs.length ? (
              <button
                onClick={() => setRevealed((r) => r + 1)}
                className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm border border-border"
              >
                Another hint
              </button>
            ) : (
              <button
                onClick={onSkip}
                className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm"
              >
                Skip this puzzle
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 rounded-full text-sm text-ink-soft hover:text-ink"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
