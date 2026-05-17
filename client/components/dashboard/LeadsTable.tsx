"use client";

import Link from "next/link";
import type { Lead } from "../../lib/types";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import ScoreBar from "../ui/ScoreBar";
import SkeletonRow from "../ui/SkeletonRow";

type LeadsTableProps = {
  leads: Lead[];
  isLoading: boolean;
  isAdmin: boolean;
  userNameById: Record<string, string>;
  hasFilters: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onClearFilters: () => void;
  onAddLead: () => void;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

const sourceLabel: Record<string, string> = {
  website: "Website",
  instagram: "Instagram",
  referral: "Referral"
};

export default function LeadsTable({
  leads,
  isLoading,
  isAdmin,
  userNameById,
  hasFilters,
  onEdit,
  onDelete,
  onClearFilters,
  onAddLead
}: LeadsTableProps) {
  if (isLoading) {
    return (
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border/70 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <th className="px-4 py-3 font-medium">Lead</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Source</th>
            <th className="px-4 py-3 font-medium">Score</th>
            {isAdmin ? <th className="px-4 py-3 font-medium">Assigned</th> : null}
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </tbody>
      </table>
    );
  }

  if (leads.length === 0) {
    return (
      <EmptyState
        title="No leads found"
        description={
          hasFilters
            ? "No leads match your current filters. Try adjusting search or filters."
            : "You have not added any leads yet. Create your first lead to get started."
        }
        actionLabel={hasFilters ? "Clear filters" : "Add your first lead"}
        onAction={hasFilters ? onClearFilters : onAddLead}
      />
    );
  }

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-border/70 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <th className="px-4 py-3 font-medium">Lead</th>
          <th className="px-4 py-3 font-medium">Status</th>
          <th className="px-4 py-3 font-medium">Source</th>
          <th className="px-4 py-3 font-medium">Score</th>
          {isAdmin ? <th className="px-4 py-3 font-medium">Assigned</th> : null}
          <th className="px-4 py-3 font-medium">Created</th>
          <th className="px-4 py-3 font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <tr key={lead._id} className="border-b border-border/50 hover:bg-muted/30">
            <td className="px-4 py-4">
              <Link href={`/dashboard/leads/${lead._id}`} className="group block">
                <p className="font-semibold group-hover:text-primary">{lead.name}</p>
                <p className="text-xs text-muted-foreground">{lead.email}</p>
              </Link>
            </td>
            <td className="px-4 py-4">
              <Badge status={lead.status} />
            </td>
            <td className="px-4 py-4">
              <span className="rounded-full border border-border px-2 py-0.5 text-xs">
                {sourceLabel[lead.source] ?? lead.source}
              </span>
            </td>
            <td className="px-4 py-4">
              <ScoreBar score={lead.score} />
            </td>
            {isAdmin ? (
              <td className="px-4 py-4 text-muted-foreground">
                {lead.assignedTo
                  ? userNameById[lead.assignedTo] ?? lead.assignedTo.slice(-6)
                  : "Unassigned"}
              </td>
            ) : null}
            <td className="px-4 py-4 text-muted-foreground">{formatDate(lead.createdAt)}</td>
            <td className="px-4 py-4">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(lead)}>
                  Edit
                </Button>
                {isAdmin ? (
                  <Button variant="ghost" size="sm" onClick={() => onDelete(lead)}>
                    Delete
                  </Button>
                ) : null}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
