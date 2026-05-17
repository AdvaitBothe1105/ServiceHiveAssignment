"use client";

import type { LeadSource, LeadStatus } from "@shared/validators";
import Button from "../ui/Button";

const STATUS_OPTIONS: Array<{ value: LeadStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "lost", label: "Lost" }
];

const SOURCE_OPTIONS: Array<{ value: LeadSource | "all"; label: string }> = [
  { value: "all", label: "All sources" },
  { value: "website", label: "Website" },
  { value: "instagram", label: "Instagram" },
  { value: "referral", label: "Referral" }
];

type LeadsToolbarProps = {
  search: string;
  status: LeadStatus | "all";
  source: LeadSource | "all";
  sort: "latest" | "oldest";
  isAdmin: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: LeadStatus | "all") => void;
  onSourceChange: (value: LeadSource | "all") => void;
  onSortChange: (value: "latest" | "oldest") => void;
  onExport: () => void;
  onAddLead: () => void;
  isExporting?: boolean;
};

export default function LeadsToolbar({
  search,
  status,
  source,
  sort,
  isAdmin,
  onSearchChange,
  onStatusChange,
  onSourceChange,
  onSortChange,
  onExport,
  onAddLead,
  isExporting = false
}: LeadsToolbarProps) {
  return (
    <section className="space-y-4 border-b border-border/70 pb-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search leads by name or email…"
          className="min-w-[220px] flex-1 rounded-full border border-border bg-background/80 px-4 py-2.5 text-sm outline-none focus:border-primary/70"
        />
        <select
          value={source}
          onChange={(e) => onSourceChange(e.target.value as LeadSource | "all")}
          className="rounded-full border border-border bg-background/80 px-4 py-2.5 text-sm outline-none"
        >
          {SOURCE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as "latest" | "oldest")}
          className="rounded-full border border-border bg-background/80 px-4 py-2.5 text-sm outline-none"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
        {isAdmin ? (
          <Button variant="secondary" size="sm" isLoading={isExporting} onClick={onExport}>
            Export CSV
          </Button>
        ) : null}
        <Button size="sm" onClick={onAddLead}>
          Add Lead
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onStatusChange(opt.value)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
              status === opt.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </section>
  );
}
