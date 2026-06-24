import { useCallback, useState } from "react";
import { Envelope } from "./Envelope";
import { Gate } from "./Gate";
import { IntroLetter } from "./IntroLetter";
import { SnailTransition } from "./SnailTransition";
import { Parseword } from "./Parseword";
import { Redactle } from "./Redactle";
import { Betweenle } from "./Betweenle";
import { DateLock } from "./DateLock";
import { MapReveal } from "./MapReveal";
import { ItineraryStrip } from "./ItineraryStrip";
import { PUZZLES, STAGES, type Stage } from "@/lib/anniversary/constants";

export function Flow() {
  const [stage, setStage] = useState<Stage>("envelope");
  const [collected, setCollected] = useState<string[]>([]);

  const next = useCallback(() => {
    setStage((s) => {
      const i = STAGES.indexOf(s);
      return STAGES[Math.min(i + 1, STAGES.length - 1)];
    });
  }, []);

  const collect = useCallback(
    (word: string) => {
      setCollected((prev) => (prev.includes(word) ? prev : [...prev, word]));
      next();
    },
    [next],
  );

  return (
    <main className="min-h-[100svh] relative">
      <ItineraryStrip collected={collected} />

      {stage === "envelope" && <Envelope onSolved={next} />}
      {stage === "gate" && <Gate onSolved={next} />}
      {stage === "intro" && <IntroLetter onContinue={next} />}

      {stage === "puzzle1" && (
        <Parseword
          number={1}
          clue={PUZZLES.parseword1.clue}
          answer={PUZZLES.parseword1.answer}
          definitionHint={PUZZLES.parseword1.definitionHint}
          wordplayHint={PUZZLES.parseword1.wordplayHint}
          onSolved={collect}
        />
      )}
      {stage === "snail1" && <SnailTransition onDone={next} />}

      {stage === "puzzle2" && <Redactle onSolved={collect} />}
      {stage === "snail2" && <SnailTransition onDone={next} />}

      {stage === "puzzle3" && <Betweenle onSolved={collect} />}
      {stage === "snail3" && <SnailTransition onDone={next} />}

      {stage === "puzzle4" && (
        <Parseword
          number={4}
          clue={PUZZLES.parseword2.clue}
          answer={PUZZLES.parseword2.answer}
          definitionHint={PUZZLES.parseword2.definitionHint}
          wordplayHint={PUZZLES.parseword2.wordplayHint}
          onSolved={collect}
        />
      )}

      {stage === "datelock" && <DateLock onSolved={next} />}
      {stage === "reveal" && <MapReveal />}
    </main>
  );
}
