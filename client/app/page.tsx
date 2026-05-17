import ThemeToggle from "../components/ThemeToggle";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-primary/25 blur-[120px]" />
        <div className="absolute -right-40 top-10 h-96 w-96 rounded-full bg-accent/30 blur-[140px]" />
        <div className="absolute left-1/3 top-[32rem] h-72 w-72 rounded-full bg-secondary/25 blur-[120px]" />
      </div>

      <header className="relative z-10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-primary">SO</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">SignalOps</p>
              <p className="text-lg font-semibold">Smart Leads Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <a className="text-muted-foreground transition hover:text-foreground" href="#features">
              Features
            </a>
            <a className="text-muted-foreground transition hover:text-foreground" href="#workflow">
              Workflow
            </a>
            <a className="text-muted-foreground transition hover:text-foreground" href="#insight">
              Insight
            </a>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
            <a
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:shadow-md"
              href="/login"
            >
              Sign In
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 pb-24 pt-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-center gap-8">
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium uppercase tracking-[0.4em] text-muted-foreground">
                Bloomberg-grade lead intelligence
              </p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Every lead is a signal.
                <span className="block text-primary">Every decision is instant.</span>
              </h1>
              <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
                SignalOps surfaces lead urgency, pipeline velocity, and performance risk in a
                terminal-inspired command center. Filter, score, and move fast without losing
                context.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:shadow-lg"
                href="/register"
              >
                Launch Dashboard
              </a>
              <a
                className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-card-foreground shadow-sm transition hover:border-primary/60"
                href="#insight"
              >
                Inspect Pipeline
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Latency</p>
                <p className="text-2xl font-semibold">120ms</p>
              </div>
              <div className="rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Signal</p>
                <p className="text-2xl font-semibold">+48%</p>
              </div>
              <div className="rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Coverage</p>
                <p className="text-2xl font-semibold">24/7</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-border bg-card/90 p-6 shadow-xl">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground">
                <span>Live feed</span>
                <span className="text-primary">ACTIVE</span>
              </div>
              <div className="mt-6 space-y-5">
                {[
                  {
                    label: "Inbound spike",
                    detail: "Referral pipeline up 32%",
                    tone: "text-primary"
                  },
                  {
                    label: "Latency warning",
                    detail: "3 leads waiting 48h",
                    tone: "text-destructive"
                  },
                  {
                    label: "Score lift",
                    detail: "Qualified leads +18%",
                    tone: "text-secondary-foreground"
                  }
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start justify-between rounded-2xl border border-border/80 bg-background/80 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.detail}</p>
                    </div>
                    <span className={`text-xs font-semibold ${item.tone}`}>SIGNAL</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card/90 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Pipeline momentum</p>
                <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Week 20</span>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Qualified", value: "68%", width: "w-[68%]" },
                  { label: "Contacted", value: "52%", width: "w-[52%]" },
                  { label: "New", value: "31%", width: "w-[31%]" }
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div className={`h-2 rounded-full bg-primary ${item.width}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-6xl px-6 pb-24">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              {
                title: "Signal scoring",
                body: "Weighted status, source, and recency scores keep attention on the most urgent leads."
              },
              {
                title: "Instant filters",
                body: "Composable filters with debounced search make every response feel real-time."
              },
              {
                title: "Command visibility",
                body: "Role-based access keeps leadership in control while sales stays fast."
              }
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-border bg-card/80 p-6 shadow-sm"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Feature</p>
                <h3 className="mt-3 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="workflow" className="mx-auto w-full max-w-6xl px-6 pb-24">
          <div className="rounded-3xl border border-border bg-card/90 p-8 shadow-lg">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Workflow</p>
                <h2 className="mt-2 text-3xl font-semibold">From signal to sale in four moves.</h2>
              </div>
              <p className="max-w-md text-sm text-muted-foreground">
                Every stage is designed to keep velocity high and context intact across the pipeline.
              </p>
            </div>
            <div className="relative mt-10">
              <div className="pointer-events-none absolute left-6 right-6 top-7 hidden h-px bg-border/70 lg:block" />
              <div className="grid gap-6 lg:grid-cols-4">
                {[
                  {
                    title: "Capture",
                    body: "Unified intake across sources.",
                    offset: "lg:-translate-y-2",
                    dominant: true
                  },
                  {
                    title: "Score",
                    body: "Scores surfaced in real time.",
                    offset: "lg:translate-y-2",
                    dominant: false
                  },
                  {
                    title: "Qualify",
                    body: "Auto-assigned ownership.",
                    offset: "lg:-translate-y-1",
                    dominant: false
                  },
                  {
                    title: "Close",
                    body: "Live status dashboards.",
                    offset: "lg:translate-y-3",
                    dominant: false
                  }
                ].map((step, index) => (
                  <div key={step.title} className={`relative ${step.offset}`}>
                    <div
                      className={`rounded-2xl border bg-background/80 px-4 py-6 text-sm shadow-sm ${
                        step.dominant
                          ? "border-primary/60 shadow-lg"
                          : "border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                          Step {index + 1}
                        </p>
                        <span className="text-xs font-semibold text-primary">
                          {step.dominant ? "PRIMARY" : "FLOW"}
                        </span>
                      </div>
                      <p className="mt-3 text-lg font-semibold">{step.title}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{step.body}</p>
                    </div>
                    {index < 3 && (
                      <div className="pointer-events-none absolute -right-4 top-8 hidden items-center lg:flex">
                        <div className="h-px w-8 bg-border/70" />
                        <span className="ml-1 text-xs text-muted-foreground">➜</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="architecture" className="mx-auto w-full max-w-6xl px-6 pb-24">
          <div className="rounded-3xl border border-border bg-card/90 p-8 shadow-lg">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Built for operational scale</p>
                <h2 className="mt-2 text-3xl font-semibold">Engineering depth behind the interface.</h2>
              </div>
              <p className="max-w-md text-sm text-muted-foreground">
                SignalOps pairs command-center UX with a hardened backend: security, typed data, and
                streaming performance.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "JWT auth + httpOnly cookies",
                "RBAC (admin/sales) enforcement",
                "Streaming CSV exports",
                "Typed API responses",
                "Server-side filtering",
                "Role-based visibility",
                "Rate-limited endpoints",
                "Docker-ready deployment"
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border/70 bg-background/70 px-4 py-4 text-sm"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Capability</p>
                  <p className="mt-2 text-base font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="insight" className="mx-auto w-full max-w-6xl px-6 pb-24">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-border bg-card/90 p-8 shadow-lg">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Signal Map</p>
              <h2 className="mt-3 text-3xl font-semibold">Know where attention should move next.</h2>
              <p className="mt-4 text-sm text-muted-foreground">
                SignalOps blends scoring, recency, and source intelligence into a single radar. Leaders can
                redirect focus in minutes, not hours.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                {[
                  { label: "Top channel", value: "Referral" },
                  { label: "High intent", value: "Qualified" },
                  { label: "Avg response", value: "2h 14m" },
                  { label: "At risk", value: "6 leads" }
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-border/70 bg-background/70 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{item.label}</p>
                    <p className="mt-2 text-lg font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-3xl border border-border bg-card/90 p-6 shadow-lg">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Ops ready</p>
                <p className="mt-2 text-lg font-semibold">Ship to production fast.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Docker-ready setup and strict TypeScript discipline keep the stack predictable.
                </p>
              </div>
              <div className="rounded-3xl border border-border bg-primary/10 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-primary">Start now</p>
                <p className="mt-2 text-lg font-semibold">Bring your team into the war room.</p>
                <a
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:shadow-md"
                  href="/register"
                >
                  Launch Dashboard
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border/70 bg-card/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 text-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">SignalOps</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Built with Next.js + Express + MongoDB
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <a
              className="text-muted-foreground transition hover:text-foreground"
              href="https://github.com/AdvaitBothe1105/ServiceHireAssignment"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <span className="text-muted-foreground">TypeScript • TailwindCSS • Docker</span>
            <span className="text-muted-foreground">© 2026 SignalOps</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
