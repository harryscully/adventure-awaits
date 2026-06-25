import { useCallback, useState } from "react";
import { Envelope } from "./Envelope";
import { Gate } from "./Gate";
import { IntroLetter } from "./IntroLetter";
import { Menu } from "./Menu";
import { Parseword } from "./Parseword";
import { Redactle } from "./Redactle";
import { Betweenle } from "./Betweenle";
import { SnailTransition } from "./SnailTransition";
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
  | "snail"
  | "ordering"
  | "datelock"
  | "reveal";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TOTAL = PUZZLE_LIST.length;

export function Flow() {
  const [view, setView] = useState<View>("envelope");
  const [activePuzzle, setActivePuzzle] = useState<PuzzleCfg | null>(null);
  const [solved, setSolved] = useState<Record<string, boolean>>({});
  const [delivered, setDelivered] = useState(0); // snail segments already shown
  const [menuOrder] = useState<PuzzleCfg[]>(() => shuffle(PUZZLE_LIST));

  const openPuzzle = useCallback((p: PuzzleCfg) => {
    setActivePuzzle(p);
    setView("puzzle");
  }, []);

  const markSolved = useCallback((id: string) => {
    setSolved((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  }, []);

  // Returning to the menu: if a NEW word was just solved, let Snail deliver it first.
  const backToMenu = useCallback(() => {
    setActivePuzzle(null);
    const solvedCount = PUZZLE_LIST.filter((p) => solved[p.id]).length;
    setView(solvedCount > delivered ? "snail" : "menu");
  }, [solved, delivered]);

  if (view === "envelope") return <Envelope onSolved={() => setView("gate")} />;
  if (view === "gate") return <Gate onSolved={() => setView("intro")} />;
  if (view === "intro") return <IntroLetter onContinue={() => setView("menu")} />;
  if (view === "menu")
    return (
      <Menu
        order={menuOrder}
        solved={solved}
        onOpen={openPuzzle}
        onFinal={() => setView("ordering")}
      />
    );
  if (view === "snail")
    return (
      <SnailTransition
        fromPct={(delivered / TOTAL) * 100}
        toPct={((delivered + 1) / TOTAL) * 100}
        delivered={delivered + 1}
        total={TOTAL}
        onDone={() => {
          setDelivered((d) => d + 1);
          setView("menu");
        }}
      />
    );
  if (view === "ordering")
    return <Ordering onSolved={() => setView("datelock")} onBack={() => setView("menu")} />;
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