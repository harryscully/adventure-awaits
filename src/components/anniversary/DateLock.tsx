import { useRef, useState } from "react";
import { COPY } from "@/lib/anniversary/constants";

interface Props {
  onSolved: () => void;
}

export function DateLock({ onSolved }: Props) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [nudge, setNudge] = useState(false);

  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    const a = COPY.dateLock.answer;
    if (d === a.day && m === a.month && y === a.year) {
      onSolved();
    } else {
      setNudge(true);
    }
  }

  function handleDay(value: string) {
    const v = value.replace(/\D/g, "").slice(0, 2);
    setDay(v);
    if (v.length === 2) monthRef.current?.focus();
  }

  function handleMonth(value: string) {
    const v = value.replace(/\D/g, "").slice(0, 2);
    setMonth(v);
    if (v.length === 2) yearRef.current?.focus();
  }

  function handleYear(value: string) {
    setYear(value.replace(/\D/g, "").slice(0, 4));
  }

  // backspace on an empty field jumps to the previous one
  function backspaceTo(
    e: React.KeyboardEvent<HTMLInputElement>,
    current: string,
    prev: React.RefObject<HTMLInputElement | null>,
  ) {
    if (e.key === "Backspace" && current === "") {
      e.preventDefault();
      prev.current?.focus();
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-svh px-5 py-10">
      <div className="paper-card max-w-md w-full p-8 text-center fade-up">
        <p className="typewriter text-xs tracking-[0.3em] text-ink-soft uppercase">
          one final thing
        </p>
        <h2 className="hand text-4xl text-primary mt-1">The date lock</h2>
        <p className="letter-serif italic text-lg text-ink mt-4">{COPY.dateLock.prompt}</p>
        <p className="text-xs text-ink-soft mt-1 typewriter">{COPY.dateLock.sub}</p>

        <form onSubmit={submit} className="mt-7 flex items-center justify-center gap-2">
          <input
            ref={dayRef}
            inputMode="numeric"
            maxLength={2}
            placeholder="DD"
            value={day}
            onChange={(e) => handleDay(e.target.value)}
            className="typewriter w-16 text-center text-2xl py-3 rounded-md bg-background border-2 border-border focus:border-primary outline-none"
          />
          <span className="text-2xl text-ink-soft">/</span>
          <input
            ref={monthRef}
            inputMode="numeric"
            maxLength={2}
            placeholder="MM"
            value={month}
            onChange={(e) => handleMonth(e.target.value)}
            onKeyDown={(e) => backspaceTo(e, month, dayRef)}
            className="typewriter w-16 text-center text-2xl py-3 rounded-md bg-background border-2 border-border focus:border-primary outline-none"
          />
          <span className="text-2xl text-ink-soft">/</span>
          <input
            ref={yearRef}
            inputMode="numeric"
            maxLength={4}
            placeholder="YYYY"
            value={year}
            onChange={(e) => handleYear(e.target.value)}
            onKeyDown={(e) => backspaceTo(e, year, monthRef)}
            className="typewriter w-24 text-center text-2xl py-3 rounded-md bg-background border-2 border-border focus:border-primary outline-none"
          />
        </form>

        <button
          onClick={submit as never}
          className="mt-5 px-7 py-2.5 rounded-full bg-primary text-primary-foreground font-medium shadow"
        >
          Unlock the day
        </button>

        {nudge && (
          <p className="hand text-xl text-seal mt-5 fade-up">{COPY.dateLock.nudge}</p>
        )}
      </div>
    </div>
  );
}