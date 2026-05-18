export default function DashboardPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-3xl border border-border bg-card/90 p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Signal pulse</p>
        <h2 className="mt-3 text-2xl font-semibold">Lead velocity is trending up.</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          48% increase in qualified signals over the last 7 days. Response time is holding at 2h 14m.
        </p>
      </section>
      <section className="rounded-3xl border border-border bg-card/90 p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Risk watch</p>
        <h2 className="mt-3 text-2xl font-semibold">3 high-value leads are aging.</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Focus on referral signals waiting beyond 48 hours to protect conversion rates.
        </p>
      </section>
      <section className="rounded-3xl border border-border bg-card/90 p-6 shadow-sm lg:col-span-2">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Activity grid</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Qualified", value: "68%", detail: "+12%" },
            { label: "Contacted", value: "52%", detail: "+8%" },
            { label: "New", value: "31%", detail: "+4%" }
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-border/70 bg-background/70 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold">{item.value}</p>
              <p className="mt-1 text-xs text-primary">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
