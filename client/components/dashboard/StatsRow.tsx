import SkeletonCard from "../ui/SkeletonCard";
import type { LeadStats } from "../../lib/types";

type StatsRowProps = {
  stats: LeadStats | null;
  isLoading: boolean;
};

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  detailTone?: "default" | "positive" | "negative";
};

function StatCard({ label, value, detail, detailTone = "default" }: StatCardProps) {
  const detailClass =
    detailTone === "positive"
      ? "text-primary"
      : detailTone === "negative"
        ? "text-destructive"
        : "text-muted-foreground";

  return (
    <section className="rounded-3xl border border-border bg-card/90 p-6 shadow-sm">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{label}</p>
      <p className="mt-3 text-3xl font-semibold tabular-nums">{value}</p>
      <p className={`mt-2 text-sm ${detailClass}`}>{detail}</p>
    </section>
  );
}

export default function StatsRow({ stats, isLoading }: StatsRowProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const total = stats.total || 1;
  const qualifiedRate = Math.round((stats.qualified / total) * 100);
  const contactedPct = Math.round((stats.contacted / total) * 100);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Leads"
        value={String(stats.total)}
        detail={`${stats.newThisWeek} new this week`}
        detailTone="positive"
      />
      <StatCard
        label="Qualified"
        value={String(stats.qualified)}
        detail={`${qualifiedRate}% conversion rate`}
        detailTone="positive"
      />
      <StatCard
        label="Contacted"
        value={String(stats.contacted)}
        detail={`${contactedPct}% of total`}
      />
      <StatCard
        label="Lost"
        value={String(stats.lost)}
        detail={stats.lost > 0 ? `${stats.lost} need review` : "No change"}
        detailTone={stats.lost > 0 ? "negative" : "default"}
      />
    </div>
  );
}
