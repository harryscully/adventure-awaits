interface Props {
  onBack: () => void;
}

export function BackToMenu({ onBack }: Props) {
  return (
    <button
      onClick={onBack}
      className="fixed top-3 left-3 z-40 typewriter text-[11px] tracking-widest uppercase px-3 py-2 rounded-full bg-card/85 backdrop-blur border border-border shadow-sm text-ink-soft hover:text-ink"
    >
      ← Back to puzzles
    </button>
  );
}
