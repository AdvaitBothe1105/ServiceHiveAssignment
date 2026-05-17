"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { LeadSource, LeadStatus } from "@shared/validators";
import { useUser } from "../../contexts/UserContext";
import { useDebounce } from "../../hooks/useDebounce";
import { useToast } from "../../hooks/useToast";
import {
  createLead,
  deleteLead,
  exportLeadsCsv,
  fetchLeadStats,
  fetchLeads,
  updateLead
} from "../../lib/leads";
import { fetchUsers } from "../../lib/users";
import type { Lead, LeadFilters, LeadStats } from "../../lib/types";
import type { PublicUser } from "../../lib/types";
import Toast from "../ui/Toast";
import DeleteLeadModal from "./DeleteLeadModal";
import LeadFormModal from "./LeadFormModal";
import LeadsTable from "./LeadsTable";
import LeadsToolbar from "./LeadsToolbar";
import PaginationBar from "./PaginationBar";
import StatsRow from "./StatsRow";

const DEFAULT_LIMIT = 10;

export default function DashboardView() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const { toast, showToast } = useToast();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<LeadStatus | "all">("all");
  const [source, setSource] = useState<LeadSource | "all">("all");
  const [sort, setSort] = useState<"latest" | "oldest">("latest");
  const [page, setPage] = useState(1);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [users, setUsers] = useState<PublicUser[]>([]);

  const [leadsLoading, setLeadsLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearch = useDebounce(search, 300);
  const isAdmin = user?.role === "admin";

  const filters: LeadFilters = useMemo(
    () => ({
      search: debouncedSearch,
      status,
      source,
      sort,
      page,
      limit: DEFAULT_LIMIT
    }),
    [debouncedSearch, status, source, sort, page]
  );

  const hasFilters =
    debouncedSearch.trim().length > 0 || status !== "all" || source !== "all";

  const userNameById = useMemo(
    () => Object.fromEntries(users.map((u) => [u._id, u.name])),
    [users]
  );

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await fetchLeadStats();
      setStats(data);
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setStatsLoading(false);
    }
  }, [showToast]);

  const loadLeads = useCallback(async () => {
    setLeadsLoading(true);
    try {
      const res = await fetchLeads(filters);
      setLeads(res.data ?? []);
      setTotal(res.meta?.total ?? 0);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setLeadsLoading(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace("/login");
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (!user) return;
    void loadStats();
  }, [user, loadStats]);

  useEffect(() => {
    if (!user) return;
    void loadLeads();
  }, [user, loadLeads]);

  useEffect(() => {
    if (!user || !isAdmin) return;
    void fetchUsers()
      .then((res) => setUsers(res.data ?? []))
      .catch(() => undefined);
  }, [user, isAdmin]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, source, sort]);

  const handleClearFilters = () => {
    setSearch("");
    setStatus("all");
    setSource("all");
    setSort("latest");
    setPage(1);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportLeadsCsv(filters);
      showToast("Export started", "success");
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleFormSubmit = async (values: {
    name: string;
    email: string;
    status: LeadStatus;
    source: LeadSource;
    assignedTo?: string;
  }) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        assignedTo: values.assignedTo?.trim() ? values.assignedTo : undefined
      };
      if (editingLead) {
        await updateLead(editingLead._id, payload);
        showToast("Lead updated successfully", "success");
      } else {
        await createLead(payload);
        showToast("Lead created successfully", "success");
      }
      setFormOpen(false);
      setEditingLead(null);
      await Promise.all([loadLeads(), loadStats()]);
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingLead) return;
    setIsDeleting(true);
    try {
      await deleteLead(deletingLead._id);
      showToast("Lead deleted successfully", "success");
      setDeleteOpen(false);
      setDeletingLead(null);
      await Promise.all([loadLeads(), loadStats()]);
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  if (userLoading || !user) {
    return (
      <>
        <StatsRow stats={null} isLoading />
        <section className="mt-8 rounded-3xl border border-border bg-card/90 p-4 shadow-sm">
          <LeadsTable
            leads={[]}
            isLoading
            isAdmin={false}
            userNameById={{}}
            hasFilters={false}
            onEdit={() => undefined}
            onDelete={() => undefined}
            onClearFilters={() => undefined}
            onAddLead={() => undefined}
          />
        </section>
      </>
    );
  }

  return (
    <>
      <Toast toast={toast} />
      <StatsRow stats={stats} isLoading={statsLoading} />

      <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-card/90 shadow-sm">
        <div className="p-4 sm:p-6">
          <LeadsToolbar
            search={search}
            status={status}
            source={source}
            sort={sort}
            isAdmin={isAdmin}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onSourceChange={setSource}
            onSortChange={setSort}
            onExport={() => void handleExport()}
            onAddLead={() => {
              setEditingLead(null);
              setFormOpen(true);
            }}
            isExporting={isExporting}
          />
        </div>
        <LeadsTable
          leads={leads}
          isLoading={leadsLoading}
          isAdmin={isAdmin}
          userNameById={userNameById}
          hasFilters={hasFilters}
          onEdit={(lead) => {
            setEditingLead(lead);
            setFormOpen(true);
          }}
          onDelete={(lead) => {
            setDeletingLead(lead);
            setDeleteOpen(true);
          }}
          onClearFilters={handleClearFilters}
          onAddLead={() => {
            setEditingLead(null);
            setFormOpen(true);
          }}
        />
        {!leadsLoading && leads.length > 0 ? (
          <PaginationBar
            page={page}
            totalPages={totalPages}
            total={total}
            limit={DEFAULT_LIMIT}
            onPageChange={setPage}
          />
        ) : null}
      </section>

      <LeadFormModal
        open={formOpen}
        lead={editingLead}
        isAdmin={isAdmin}
        users={users}
        isSubmitting={isSubmitting}
        onClose={() => {
          setFormOpen(false);
          setEditingLead(null);
        }}
        onSubmit={handleFormSubmit}
      />

      <DeleteLeadModal
        open={deleteOpen}
        lead={deletingLead}
        isDeleting={isDeleting}
        onClose={() => {
          setDeleteOpen(false);
          setDeletingLead(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
