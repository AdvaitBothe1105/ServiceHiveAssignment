"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { LeadStatus } from "@shared/validators";
import { leadStatusEnum } from "@shared/validators";
import LeadFormModal from "../../../../../components/dashboard/LeadFormModal";
import { useUser } from "../../../../../contexts/UserContext";
import { useToast } from "../../../../../hooks/useToast";
import { fetchLeadById, updateLead } from "../../../../../lib/leads";
import { fetchUsers } from "../../../../../lib/users";
import type { Lead, PublicUser } from "../../../../../lib/types";
import Badge from "../../../../../components/ui/Badge";
import Button from "../../../../../components/ui/Button";
import ScoreBar from "../../../../../components/ui/ScoreBar";
import SkeletonCard from "../../../../../components/ui/SkeletonCard";
import Toast from "../../../../../components/ui/Toast";

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const { toast, showToast } = useToast();

  const [lead, setLead] = useState<Lead | null>(null);
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = user?.role === "admin";

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetchLeadById(id);
      setLead(res.data);
    } catch {
      showToast("Something went wrong", "error");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }, [id, router, showToast]);

  useEffect(() => {
    if (!userLoading && !user) router.replace("/login");
  }, [user, userLoading, router]);

  useEffect(() => {
    if (!user || !id) return;
    void load();
  }, [user, id, load]);

  useEffect(() => {
    if (!isAdmin) return;
    void fetchUsers()
      .then((r) => setUsers(r.data ?? []))
      .catch(() => undefined);
  }, [isAdmin]);

  const handleStatusChange = async (status: LeadStatus) => {
    if (!lead) return;
    try {
      const res = await updateLead(lead._id, { status });
      setLead(res.data);
      showToast("Lead updated successfully", "success");
    } catch {
      showToast("Something went wrong", "error");
    }
  };

  if (loading || !lead) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <>
      <Toast toast={toast} />
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary">
          ← Back to leads
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-border bg-card/90 p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Lead</p>
              <h1 className="mt-2 text-3xl font-semibold">{lead.name}</h1>
              <p className="mt-1 text-muted-foreground">{lead.email}</p>
            </div>
            <Button variant="secondary" onClick={() => setFormOpen(true)}>
              Edit
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Badge status={lead.status} />
            <span className="rounded-full border border-border px-3 py-1 text-xs capitalize">
              {lead.source}
            </span>
          </div>
          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Score</p>
            <div className="mt-3 max-w-md">
              <ScoreBar score={lead.score} />
            </div>
          </div>
          <label className="mt-8 block text-sm">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Status</span>
            <select
              value={lead.status}
              onChange={(e) => void handleStatusChange(e.target.value as LeadStatus)}
              className="mt-2 w-full max-w-xs rounded-2xl border border-border bg-background px-4 py-3 text-sm"
            >
              {leadStatusEnum.options.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="rounded-3xl border border-border bg-card/90 p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Activity</p>
          <ul className="mt-4 space-y-4 text-sm">
            <li>
              <span className="text-muted-foreground">Created</span>
              <p className="font-medium">{new Date(lead.createdAt).toLocaleString()}</p>
            </li>
            <li>
              <span className="text-muted-foreground">Updated</span>
              <p className="font-medium">{new Date(lead.updatedAt).toLocaleString()}</p>
            </li>
          </ul>
        </section>
      </div>

      <LeadFormModal
        open={formOpen}
        lead={lead}
        isAdmin={isAdmin}
        users={users}
        isSubmitting={isSubmitting}
        onClose={() => setFormOpen(false)}
        onSubmit={async (values) => {
          setIsSubmitting(true);
          try {
            const res = await updateLead(lead._id, values);
            setLead(res.data);
            setFormOpen(false);
            showToast("Lead updated successfully", "success");
          } catch {
            showToast("Something went wrong", "error");
          } finally {
            setIsSubmitting(false);
          }
        }}
      />
    </>
  );
}
