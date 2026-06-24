import { useEffect, useMemo } from "react";
import { COPY } from "@/lib/anniversary/constants";

interface Props {
  onDone: () => void;
}

export function SnailTransition({ onDone }: Props) {
  const line = useMemo(
    () => COPY.snailLines[Math.floor(Math.random() * COPY.snailLines.length)],
    [],
  );

  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100svh] px-6">
      <p className="hand text-2xl md:text-3xl text-ink mb-8 text-center fade-up">{line}</p>
      <div className="w-full max-w-md h-16 relative overflow-hidden border-y border-dashed border-border">
        <div className="snail-track absolute top-1/2 -translate-y-1/2 text-4xl">🐌</div>
      </div>
      <button
        onClick={onDone}
        className="typewriter text-[10px] tracking-widest text-ink-soft uppercase mt-6 hover:text-ink"
      >
        skip
      </button>
    </div>
  );
}
