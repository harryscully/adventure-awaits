import { COPY } from "@/lib/anniversary/constants";

interface Props {
  onContinue: () => void;
}

export function IntroLetter({ onContinue }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh px-5 py-10">
      <article className="paper-card max-w-lg w-full p-8 md:p-10 fade-up">
        {/* Frog & Toad — establishes the snail-mail premise before any puzzle */}
        <figure className="mb-6 flex flex-col items-center">
          <img
            src="/frog-toad-letter.png"
            alt="Frog handing a letter to Snail"
            className="w-full max-w-xs rounded-lg border-4 border-card shadow-md -rotate-1"
          />
          <figcaption className="typewriter text-[11px] tracking-[0.2em] text-ink-soft uppercase mt-3 text-center">
            Frog hands today's letter to Snail
          </figcaption>
        </figure>

        <p className="typewriter text-xs tracking-[0.3em] text-ink-soft uppercase mb-4">
          Frog &middot; today
        </p>
        <div className="letter-serif text-lg md:text-xl text-ink leading-relaxed space-y-4">
          {COPY.introLetter.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onContinue}
            className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium shadow hover:scale-105 transition-transform"
          >
            Open today's games →
          </button>
        </div>
      </article>
    </div>
  );
}