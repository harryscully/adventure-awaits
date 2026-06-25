import { useRef, useState } from "react";
import { COPY } from "@/lib/anniversary/constants";

interface Props {
  onSolved: () => void;
}

export function Gate({ onSolved }: Props) {
  const [dodgeCount, setDodgeCount] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const label =
    COPY.gate.noVariants[Math.min(dodgeCount, COPY.gate.noVariants.length - 1)];
  const surrendered = dodgeCount >= COPY.gate.noVariants.length - 1;

  function dodge() {
    const box = containerRef.current?.getBoundingClientRect();
    if (!box) return;
    const maxX = Math.min(box.width / 2 - 60, 140);
    const maxY = Math.min(box.height / 2 - 40, 80);
    setOffset({
      x: (Math.random() * 2 - 1) * maxX,
      y: (Math.random() * 2 - 1) * maxY,
    });
    setScale((s) => Math.max(0.55, s - 0.07));
    setDodgeCount((c) => c + 1);
  }

  function noClicked() {
    if (surrendered) {
      onSolved();
    }
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center min-h-svh px-6 py-10 relative"
    >
      <div className="paper-card max-w-md w-full p-8 text-center fade-up">
        <p className="hand text-3xl md:text-4xl text-ink leading-snug">
          {COPY.gate.question}
        </p>

        <div className="mt-10 flex items-center justify-center gap-6 relative h-24">
          <button
            onClick={onSolved}
            className="px-7 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-lg hover:scale-105 transition-transform"
          >
            {COPY.gate.yes}
          </button>

          <button
            onPointerEnter={() => !surrendered && dodge()}
            onFocus={() => !surrendered && dodge()}
            onClick={noClicked}
            className="dodge-btn px-7 py-3 rounded-full bg-secondary text-secondary-foreground font-medium border border-border"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            }}
          >
            {label}
          </button>
        </div>

        {dodgeCount > 0 && !surrendered && (
          <p className="typewriter text-xs text-ink-soft mt-6 tracking-widest uppercase">
            Snail is hiding the button
          </p>
        )}
      </div>
    </div>
  );
}
