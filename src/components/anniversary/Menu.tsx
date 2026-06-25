import { COPY, PUZZLE_LIST, type PuzzleCfg } from "@/lib/anniversary/constants";

interface Props {
  solved: Record<string, boolean>;
  onOpen: (p: PuzzleCfg) => void;
  onFinal: () => void;
}

export function Menu({ solved, onOpen, onFinal }: Props) {
  const allSolved = PUZZLE_LIST.every((p) => solved[p.id]);
  const count = PUZZLE_LIST.filter((p) => solved[p.id]).length;

  return (
    <div className="min-h-[100svh] px-5 py-10 flex flex-col items-center">
      <div className="max-w-xl w-full text-center fade-up">
        <p className="typewriter text-[10px] tracking-[0.3em] text-ink-soft uppercase">
          from Frog
        </p>
        <h1 className="hand text-5xl text-primary mt-1">{COPY.menu.title}</h1>
        <p className="text-sm text-ink-soft mt-2">{COPY.menu.sub}</p>
        <p className="typewriter text-[10px] tracking-widest text-ink-soft uppercase mt-3">
          {count} / {PUZZLE_LIST.length} solved
        </p>
      </div>

      <ul className="mt-8 w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PUZZLE_LIST.map((p, i) => {
          const isSolved = !!solved[p.id];
          return (
            <li key={p.id}>
              <button
                onClick={() => onOpen(p)}
                className={`paper-card w-full p-5 text-left transition-transform hover:-translate-y-0.5 ${isSolved ? "ring-2 ring-primary/40" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <p className="typewriter text-[10px] tracking-[0.3em] text-ink-soft uppercase">
                    #{i + 1} · {p.label}
                  </p>
                  {isSolved && <span className="text-primary text-lg">✓</span>}
                </div>
                <p className="hand text-2xl text-ink mt-1">
                  {isSolved ? p.answer.toUpperCase() : "—————"}
                </p>
                <p className="text-xs text-ink-soft mt-1">{p.teaser}</p>
              </button>
            </li>
          );
        })}
      </ul>

      <button
        onClick={onFinal}
        disabled={!allSolved}
        className={`mt-8 px-7 py-3 rounded-full font-medium shadow-lg fade-up ${
          allSolved
            ? "bg-primary text-primary-foreground hover:scale-105 transition-transform"
            : "bg-secondary text-ink-soft cursor-not-allowed"
        }`}
      >
        {allSolved ? COPY.menu.finalUnlocked : `🔒 ${COPY.menu.finalLocked}`}
      </button>
    </div>
  );
}
