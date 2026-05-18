"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useUser } from "../../contexts/UserContext";
import { fetchLeadAnalytics, type LeadAnalytics } from "../../lib/analytics";
import { RoleBadge } from "../ui/Badge";
import SkeletonCard from "../ui/SkeletonCard";
import ThemeToggle from "../ThemeToggle";

const CHART_ANIMATION_MS = 1400;

const sourceColors: Record<string, string> = {
  website: "#7f1d1d",
  instagram: "#c2410c",
  referral: "#be123c"
};

const piePalette = ["#7f1d1d", "#c2410c", "#92400e", "#be123c", "#e11d48", "#a16207"];

function formatSourceLabel(source: string): string {
  return source.charAt(0).toUpperCase() + source.slice(1);
}

function AnalyticsStatCard({
  label,
  value,
  loading
}: {
  label: string;
  value: string;
  loading?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-[#e6d7c4] bg-[#f7f4ef] p-5 shadow-sm dark:border-border dark:bg-card/90">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2.5 text-[1.7rem] font-semibold leading-none text-foreground">
        {loading ? "…" : value}
      </div>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[calc(var(--radius)+14px)] border border-border bg-card p-5 shadow-md md:p-6">
      <div className="mb-4 space-y-1.5">
        <h2 className="font-serif text-[1.55rem] text-foreground">{title}</h2>
        <p className="text-sm leading-6 text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

export default function AnalyticsView() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const [analytics, setAnalytics] = useState<LeadAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chartKey, setChartKey] = useState(0);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace("/login");
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    setLoading(true);
    setError("");

    void fetchLeadAnalytics()
      .then((res) => {
        if (!cancelled) {
          setAnalytics(res.data);
          setChartKey((key) => key + 1);
        }
      })
      .catch((caught) => {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : "Failed to load analytics.");
          setAnalytics(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const sourceBreakdown = useMemo(() => {
    if (!analytics) return [];
    return analytics.sourceBreakdown
      .map((item, index) => ({
        name: formatSourceLabel(item.source),
        value: item.count,
        color: sourceColors[item.source] ?? piePalette[index % piePalette.length]
      }))
      .filter((item) => item.value > 0);
  }, [analytics]);

  const sourceTotal = useMemo(
    () => sourceBreakdown.reduce((sum, item) => sum + item.value, 0),
    [sourceBreakdown]
  );

  const monthlyTrends = analytics?.monthlyTrends ?? [];

  if (userLoading || !user) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const totals = analytics?.totals;
  const conversionRate =
    totals && totals.total > 0 ? Math.round((totals.qualified / totals.total) * 100) : 0;

  return (
    <div className="space-y-5">
      <header className="rounded-[calc(var(--radius)+14px)] border border-border bg-card p-5 shadow-lg md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <span className="inline-flex w-fit rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-secondary-foreground">
              Role aware dashboard
            </span>
            <div>
              <h1 className="font-serif text-3xl tracking-tight text-foreground md:text-4xl">
                {user.name}
              </h1>
              <p className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {user.email} · <RoleBadge role={user.role} />
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
          {[
            { label: "Summary scope", value: isAdmin ? "All leads" : "Assigned leads" },
            { label: "Pipeline", value: "Enabled" },
            { label: "User admin", value: isAdmin ? "Enabled" : "Disabled" },
            { label: "Transport", value: "Session cookie" }
          ].map((chip) => (
            <div
              key={chip.label}
              className="rounded-2xl border border-border bg-muted/35 px-3.5 py-2.5"
            >
              <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {chip.label}
              </div>
              <div className="mt-1 text-xs font-medium text-foreground">{chip.value}</div>
            </div>
          ))}
        </div>
      </header>

      {error ? (
        <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-4">
        <AnalyticsStatCard label="Total leads" value={String(totals?.total ?? 0)} loading={loading} />
        <AnalyticsStatCard label="Qualified" value={String(totals?.qualified ?? 0)} loading={loading} />
        <AnalyticsStatCard
          label="Avg score"
          value={totals ? String(totals.avgScore) : "0"}
          loading={loading}
        />
        <AnalyticsStatCard
          label="Conversion"
          value={`${conversionRate}%`}
          loading={loading}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <ChartCard title="Monthly trends" subtitle="New leads and qualifications over the last 6 months">
          {monthlyTrends.length > 0 ? (
            <ResponsiveContainer key={`line-${chartKey}`} width="100%" height={300}>
              <LineChart data={monthlyTrends} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px"
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="created"
                  name="New leads"
                  stroke="#9f2b2f"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#fff", stroke: "#9f2b2f", strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: "#9f2b2f" }}
                  animationDuration={CHART_ANIMATION_MS}
                  animationEasing="ease-out"
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="qualified"
                  name="Qualified"
                  stroke="#c2410c"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  dot={{ r: 3, fill: "#fff", stroke: "#c2410c", strokeWidth: 2 }}
                  animationDuration={CHART_ANIMATION_MS + 200}
                  animationEasing="ease-out"
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              No trend data yet
            </div>
          )}
        </ChartCard>

        <ChartCard title="Source breakdown" subtitle="Leads by acquisition channel">
          {sourceBreakdown.length > 0 ? (
            <div className="relative h-[320px] pb-4">
              <ResponsiveContainer key={`pie-${chartKey}`} width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend verticalAlign="bottom" height={40} />
                  <Pie
                    data={sourceBreakdown}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={105}
                    stroke="#f7f4ef"
                    strokeWidth={2}
                    paddingAngle={2}
                    label={({ percent }) => `${Math.round((percent ?? 0) * 100)}%`}
                    labelLine={false}
                    animationDuration={CHART_ANIMATION_MS}
                    animationEasing="ease-out"
                  >
                    {sourceBreakdown.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <div className="mb-10 text-center">
                  <div className="text-3xl font-semibold text-foreground">{sourceTotal}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-[320px] items-center justify-center text-muted-foreground">
              No source data yet
            </div>
          )}
        </ChartCard>
      </div>

      <ChartCard title="Recent signals" subtitle="Latest leads entering the pipeline">
        <div className="space-y-3">
          {analytics?.recentActivity.length ? (
            analytics.recentActivity.map((lead) => (
              <Link
                key={lead._id}
                href={`/dashboard/leads/${lead._id}`}
                className="block rounded-2xl border border-border bg-background p-4 transition hover:border-primary/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatSourceLabel(lead.source)} · Score {lead.score}
                    </p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {lead.status}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No recent activity.</p>
          )}
        </div>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
        >
          View all leads →
        </Link>
      </ChartCard>
    </div>
  );
}
