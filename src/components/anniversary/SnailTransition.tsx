import { useEffect, useMemo, useState } from "react";
import { COPY } from "@/lib/anniversary/constants";

interface Props {
  fromPct: number;
  toPct: number;
  delivered: number; // which word (1..total)
  total: number;
  onDone: () => void;
}

export function SnailTransition({ fromPct, toPct, delivered, total, onDone }: Props) {
  const line = useMemo(
    () => COPY.snailLines[Math.floor(Math.random() * COPY.snailLines.length)],
    [],
  );
  const [pos, setPos] = useState(fromPct);

  useEffect(() => {
    const r = requestAnimationFrame(() => setPos(toPct));
    const t = setTimeout(onDone, 2400);
    return () => {
      cancelAnimationFrame(r);
      clearTimeout(t);
    };
  }, [toPct, onDone]);

  return (
    <div className="flex flex-col items-center justify-center min-h-svh px-6">
      <p className="hand text-3xl text-ink mb-2 text-center fade-up">{line}</p>
      <p className="typewriter text-xs tracking-[0.25em] text-ink-soft uppercase mb-10">
        word {delivered} of {total} delivered
      </p>

      <div className="w-full max-w-md relative h-16">
        {/* dashed path */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-border" />
        {/* filled progress */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 border-t-2 border-primary"
          style={{ width: `${pos}%`, transition: "width 1.8s ease-in-out" }}
        />
        {/* mailbox at the destination */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-3xl">📫</div>
        {/* the snail, carrying its letter */}
        <div
          className="absolute top-1/2 text-4xl"
          style={{
            left: `${pos}%`,
            transform: "translate(-50%,-50%)",
            transition: "left 1.8s ease-in-out",
          }}
        >
          🐌
        </div>
      </div>

      <button
        onClick={onDone}
        className="typewriter text-xs tracking-[0.25em] text-ink-soft uppercase mt-10 hover:text-ink"
      >
        skip
      </button>
    </div>
  );
}