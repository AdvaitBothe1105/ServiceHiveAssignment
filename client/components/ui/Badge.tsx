import type { LeadStatus } from "@shared/validators";

type BadgeProps = {
  status: LeadStatus;
  className?: string;
};

const statusStyles: Record<LeadStatus, string> = {
  new: "bg-chart-4/20 text-chart-4 border-chart-4/30",
  contacted: "bg-chart-5/20 text-secondary-foreground border-chart-5/30",
  qualified: "bg-primary/15 text-primary border-primary/30",
  lost: "bg-destructive/15 text-destructive border-destructive/30"
};

const statusLabels: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  lost: "Lost"
};

export default function Badge({ status, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${statusStyles[status]} ${className}`}
    >
      {statusLabels[status]}
    </span>
  );
}

export function RoleBadge({ role }: { role: "admin" | "sales" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${
        role === "admin"
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border bg-muted text-muted-foreground"
      }`}
    >
      {role}
    </span>
  );
}
