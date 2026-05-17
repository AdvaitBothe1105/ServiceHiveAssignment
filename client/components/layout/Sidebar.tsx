import Link from "next/link";
import IconBadge from "../ui/IconBadge";

type NavItem = {
  label: string;
  href: string;
  meta?: string;
};

const navItems: NavItem[] = [
  { label: "Overview", href: "/dashboard", meta: "Pulse" },
  { label: "Leads", href: "/dashboard/leads", meta: "Pipeline" },
  { label: "Users", href: "/dashboard/users", meta: "Admin" },
  { label: "Exports", href: "/dashboard/exports", meta: "CSV" }
];

export default function Sidebar() {
  return (
    <aside className="flex h-full flex-col border-r border-border/70 bg-card/70 px-6 py-8">
      <div className="flex items-center gap-3">
        <IconBadge label="SO" />
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">SignalOps</p>
          <p className="text-lg font-semibold">Command Center</p>
        </div>
      </div>

      <div className="mt-10 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center justify-between rounded-2xl border border-transparent px-4 py-3 text-sm transition hover:border-primary/50 hover:bg-background/80"
          >
            <span className="font-medium text-foreground/90 group-hover:text-foreground">
              {item.label}
            </span>
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {item.meta}
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-auto rounded-3xl border border-border/70 bg-background/70 p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Status</p>
        <p className="mt-2 text-sm font-semibold">All systems aligned</p>
        <p className="mt-2 text-xs text-muted-foreground">Latency 120ms · Signal +48%</p>
      </div>
    </aside>
  );
}
