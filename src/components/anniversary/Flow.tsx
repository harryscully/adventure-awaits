import { useCallback, useState } from "react";
import { Envelope } from "./Envelope";
import { Gate } from "./Gate";
import { IntroLetter } from "./IntroLetter";
import { Menu } from "./Menu";
import { Parseword } from "./Parseword";
import { Redactle } from "./Redactle";
import { Betweenle } from "./Betweenle";
import { Ordering } from "./Ordering";
import { DateLock } from "./DateLock";
import { MapReveal } from "./MapReveal";
import { PUZZLE_LIST, type PuzzleCfg } from "@/lib/anniversary/constants";

type View =
  | "envelope"
  | "gate"
  | "intro"
  | "menu"
  | "puzzle"
  | "ordering"
  | "datelock"
  | "reveal";

export function Flow() {
  const [view, setView] = useState<View>("envelope");
  const [activePuzzle, setActivePuzzle] = useState<PuzzleCfg | null>(null);
  const [solved, setSolved] = useState<Record<string, boolean>>({});

  const openPuzzle = useCallback((p: PuzzleCfg) => {
    setActivePuzzle(p);
    setView("puzzle");
  }, []);

  const markSolved = useCallback((id: string) => {
    setSolved((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  }, []);

  const backToMenu = useCallback(() => {
    setActivePuzzle(null);
    setView("menu");
  }, []);

  if (view === "envelope") return <Envelope onSolved={() => setView("gate")} />;
  if (view === "gate") return <Gate onSolved={() => setView("intro")} />;
  if (view === "intro") return <IntroLetter onContinue={() => setView("menu")} />;
  if (view === "menu")
    return (
      <Menu
        solved={solved}
        onOpen={openPuzzle}
        onFinal={() => setView("ordering")}
      />
    );
  if (view === "ordering")
    return <Ordering onSolved={() => setView("datelock")} onBack={backToMenu} />;
  if (view === "datelock") return <DateLock onSolved={() => setView("reveal")} />;
  if (view === "reveal") return <MapReveal onReplay={() => setView("menu")} />;

  // puzzle view
  if (view === "puzzle" && activePuzzle) {
    const p = activePuzzle;
    const number = PUZZLE_LIST.findIndex((x) => x.id === p.id) + 1;
    const initialSolved = !!solved[p.id];
    const onSolved = () => markSolved(p.id);

    if (p.type === "parseword") {
      return (
        <Parseword
          number={number}
          clue={p.clue}
          answer={p.answer}
          definitionHint={p.definitionHint}
          wordplayHint={p.wordplayHint}
          initialSolved={initialSolved}
          onSolved={onSolved}
          onBack={backToMenu}
        />
      );
    }
    if (p.type === "redactle") {
      return (
        <Redactle
          number={number}
          title={p.title}
          article={p.article}
          answer={p.answer}
          initialSolved={initialSolved}
          onSolved={onSolved}
          onBack={backToMenu}
        />
      );
    }
    if (p.type === "betweenle") {
      return (
        <Betweenle
          answer={p.answer}
          initialSolved={initialSolved}
          onSolved={onSolved}
          onBack={backToMenu}
        />
      );
    }
  }

  return null;
}
