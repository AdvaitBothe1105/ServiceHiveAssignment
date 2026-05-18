"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PaginationBar from "../../../../components/dashboard/PaginationBar";
import { useUser } from "../../../../contexts/UserContext";
import { useToast } from "../../../../hooks/useToast";
import { fetchUsers, updateUserRole } from "../../../../lib/users";
import type { PublicUser } from "../../../../lib/types";
import { RoleBadge } from "../../../../components/ui/Badge";
import SkeletonRow from "../../../../components/ui/SkeletonRow";
import Toast from "../../../../components/ui/Toast";

const PAGE_LIMIT = 10;

export default function UsersPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const { toast, showToast } = useToast();
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchUsers(page, PAGE_LIMIT);
      setUsers(res.data ?? []);
      setTotal(res.meta?.total ?? 0);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  }, [page, showToast]);

  useEffect(() => {
    if (!userLoading && !user) router.replace("/login");
    if (!userLoading && user && user.role !== "admin") router.replace("/dashboard");
  }, [user, userLoading, router]);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    void loadUsers();
  }, [user, loadUsers]);

  const handleRoleChange = async (target: PublicUser, role: "admin" | "sales") => {
    setUpdatingId(target._id);
    try {
      const res = await updateUserRole(target._id, role);
      if (res.data) {
        setUsers((prev) => prev.map((u) => (u._id === target._id ? res.data! : u)));
        showToast("Role updated successfully", "success");
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Something went wrong", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  if (userLoading || !user || user.role !== "admin") {
    return null;
  }

  return (
    <>
      <Toast toast={toast} />
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold">Users</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {total} users total · {PAGE_LIMIT} per page
        </p>
      </header>

      <section className="overflow-hidden rounded-3xl border border-border bg-card/90 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border/70 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: PAGE_LIMIT }).map((_, i) => <SkeletonRow key={i} />)
              : users.map((u) => (
                  <tr key={u._id} className="border-b border-border/50">
                    <td className="px-4 py-4 font-semibold">{u.name}</td>
                    <td className="px-4 py-4 text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-4">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={u.role}
                        disabled={updatingId === u._id || u._id === user._id}
                        onChange={(e) =>
                          void handleRoleChange(u, e.target.value as "admin" | "sales")
                        }
                        className="rounded-full border border-border bg-background px-3 py-1.5 text-xs disabled:opacity-50"
                      >
                        <option value="sales">Sales</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
        {!loading && users.length > 0 ? (
          <PaginationBar
            page={page}
            totalPages={totalPages}
            total={total}
            limit={PAGE_LIMIT}
            onPageChange={setPage}
          />
        ) : null}
      </section>
    </>
  );
}
