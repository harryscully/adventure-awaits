import { useState } from "react";

interface Props {
  onSolved: () => void;
}

const lines = [
  "tap to break the seal",
];

export function Envelope({ onSolved }: Props) {
  const [opening, setOpening] = useState(false);

  function open() {
    if (opening) return;
    setOpening(true);
    setTimeout(onSolved, 1100);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[100svh] px-6 py-10">
      <p className="hand text-2xl text-ink-soft mb-6 fade-up">a letter for Frog</p>

      <button
        aria-label="Open the letter"
        onClick={open}
        className={`envelope w-[min(86vw,360px)] aspect-[3/2] ${opening ? "open" : ""}`}
      >
        <div className="envelope-flap" />
        <div className="wax-seal">F</div>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-[35%] pointer-events-none">
          <div className="hand text-3xl text-ink">Frog</div>
          <div className="typewriter text-[10px] tracking-widest text-ink-soft mt-1">
            FROM TOAD · WITH LOVE
          </div>
        </div>
      </button>

      <p className="typewriter text-xs text-ink-soft mt-8 tracking-widest uppercase fade-up">
        {lines[0]}
      </p>
    </div>
  );
}
