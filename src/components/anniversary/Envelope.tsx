import { useState } from "react";
import { COPY } from "@/lib/anniversary/constants";

interface Props {
  onSolved: () => void;
}

const MAX_TILT = 8; // degrees

export function Envelope({ onSolved }: Props) {
  const [opening, setOpening] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [tilting, setTilting] = useState(false);

  function open() {
    if (opening) return;
    setTilt({ rx: 0, ry: 0 });
    setTilting(false);
    setOpening(true);
    setTimeout(onSolved, 1100);
  }

  function handleMove(e: React.MouseEvent<HTMLButtonElement>) {
    if (opening) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    setTilting(true);
    setTilt({
      rx: -(py - 0.5) * 2 * MAX_TILT,
      ry: (px - 0.5) * 2 * MAX_TILT,
    });
  }

  function handleLeave() {
    setTilting(false);
    setTilt({ rx: 0, ry: 0 });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-svh px-6 py-10">
      <p className="hand text-3xl text-ink-soft mb-7 fade-up">
        a letter for {COPY.envelope.addressee}
      </p>

      {/* perspective wrapper — only the envelope tilts */}
      <div style={{ perspective: "1000px" }}>
        <button
          aria-label="Open the letter"
          onClick={open}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          style={{
            transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            transition: tilting
              ? "transform 0.08s ease-out"
              : "transform 0.5s ease",
          }}
          className={`envelope w-[min(86vw,360px)] aspect-3/2 ${opening ? "open" : ""}`}
        >
          <div className="envelope-flap" />
          <div className="wax-seal">{COPY.envelope.sealLetter}</div>

          {/* address centred in the lower body, clear of the seal */}
          <div className="absolute inset-x-0 top-[62%] bottom-[6%] z-2 flex flex-col items-center justify-center px-4 pointer-events-none">
            <div className="hand text-4xl text-ink leading-none">
              {COPY.envelope.addressee}
            </div>
            <div className="typewriter text-xs tracking-[0.25em] text-ink-soft mt-2 uppercase">
              from Frog · with love
            </div>
          </div>
        </button>
      </div>

      <p className="typewriter text-sm text-ink-soft mt-8 tracking-[0.25em] uppercase fade-up">
        {COPY.envelope.hint}
      </p>
    </div>
  );
}