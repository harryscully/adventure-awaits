import { COPY } from "@/lib/anniversary/constants";

interface Props {
  collected: string[];
}

export function ItineraryStrip({ collected }: Props) {
  if (collected.length === 0) return null;
  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-2 rounded-full bg-card/85 backdrop-blur border border-border shadow-sm">
      <span className="typewriter text-[9px] tracking-widest text-ink-soft uppercase pr-1">
        {COPY.itineraryLabel}:
      </span>
      <div className="flex gap-2">
        {collected.map((w) => (
          <span key={w} className="stamp">{w}</span>
        ))}
      </div>
    </div>
  );
}
