import Link from "next/link";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export default function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -right-32 top-12 h-96 w-96 rounded-full bg-accent/25 blur-[140px]" />
      </div>

      <header className="relative z-10">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 pb-6 pt-10">
          <Link className="flex items-center gap-3" href="/">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-primary">SO</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">SignalOps</p>
              <p className="text-lg font-semibold">Smart Leads Dashboard</p>
            </div>
          </Link>
          <Link className="text-sm text-muted-foreground transition hover:text-foreground" href="/">
            Back to overview
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-96px)] w-full max-w-5xl items-center px-6 py-12">
        <div className="grid w-full gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="flex flex-col items-center justify-center gap-6 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Secure access</p>
          <h1 className="text-4xl font-semibold leading-tight">
            {title}
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            {subtitle}
          </p>
          <div className="rounded-3xl border border-border bg-card/80 p-6 text-left shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Signal note</p>
            <p className="mt-3 text-sm text-foreground">
              Command-center access is protected by JWT sessions and role-based visibility. Keep your
              credentials ready.
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>Auth: httpOnly cookies</span>
              <span>RBAC: admin / sales</span>
            </div>
          </div>
          </section>

          <section className="rounded-3xl border border-border bg-card/90 p-8 text-center shadow-xl">
            {children}
            <div className="mt-6 border-t border-border/70 pt-6 text-sm text-muted-foreground">
              {footer}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
