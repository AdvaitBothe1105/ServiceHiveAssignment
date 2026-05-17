export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-3xl border border-border bg-card/90 p-6 shadow-sm">
      <div className="h-3 w-24 rounded bg-muted" />
      <div className="mt-4 h-8 w-16 rounded bg-muted" />
      <div className="mt-3 h-3 w-32 rounded bg-muted" />
    </div>
  );
}
