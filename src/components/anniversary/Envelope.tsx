import { useState } from "react";
import { COPY } from "@/lib/anniversary/constants";

interface Props {
  onSolved: () => void;
}

export function Envelope({ onSolved }: Props) {
  const [opening, setOpening] = useState(false);

  function open() {
    if (opening) return;
    setOpening(true);
    setTimeout(onSolved, 1100);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-svh px-6 py-10">
      <p className="hand text-3xl text-ink-soft mb-7 fade-up">
        a letter for {COPY.envelope.addressee}
      </p>

      <button
        aria-label="Open the letter"
        onClick={open}
        className={`envelope w-[min(86vw,360px)] aspect-3/2 ${opening ? "open" : ""}`}
      >
        <div className="envelope-flap" />
        <div className="wax-seal">{COPY.envelope.sealLetter}</div>

        {/* address sits in the lower body, clear of the flap tip and seal */}
        <div className="absolute inset-x-0 bottom-[14%] z-2 flex flex-col items-center px-4 pointer-events-none">
          <div className="hand text-4xl text-ink leading-none">
            {COPY.envelope.addressee}
          </div>
          <div className="typewriter text-xs tracking-[0.25em] text-ink-soft mt-2 uppercase">
            from Frog · with love
          </div>
        </div>
      </button>

      <p className="typewriter text-sm text-ink-soft mt-8 tracking-[0.25em] uppercase fade-up">
        {COPY.envelope.hint}
      </p>
    </div>
  );
}