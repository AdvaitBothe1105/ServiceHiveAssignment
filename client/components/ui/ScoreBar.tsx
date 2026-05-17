type ScoreBarProps = {
  score: number;
  className?: string;
};

export default function ScoreBar({ score, className = "" }: ScoreBarProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const tone =
    clamped >= 70 ? "bg-primary" : clamped >= 40 ? "bg-chart-5" : "bg-muted-foreground/50";

  return (
    <div className={`flex min-w-[120px] items-center gap-2 ${className}`}>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full transition-all ${tone}`} style={{ width: `${clamped}%` }} />
      </div>
      <span className="w-8 text-right font-mono text-xs font-semibold tabular-nums">{clamped}</span>
    </div>
  );
}
