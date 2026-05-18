"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, LayoutDashboard, LogOut, Users } from "lucide-react";
import { useUser } from "../../contexts/UserContext";
import Avatar from "../ui/Avatar";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  adminOnly?: boolean;
};

const navItems: NavItem[] = [
  { href: "/dashboard/analytics", label: "Overview", icon: BarChart3 },
  { href: "/dashboard", label: "Leads", icon: LayoutDashboard },
  { href: "/dashboard/users", label: "Users", icon: Users, adminOnly: true }
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useUser();
  const isAdmin = user?.role === "admin";

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden h-screen w-60 flex-col border-r border-border bg-card/95 backdrop-blur md:sticky md:top-0 md:flex">
      <div className="border-b border-border px-6 py-5">
        <h2 className="font-serif text-xl text-foreground">SignalOps</h2>
        <p className="mt-1 text-xs text-muted-foreground">Smart Leads</p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
        {navItems
          .filter((item) => !item.adminOnly || isAdmin)
          .map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition ${
                isActive(item.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <item.icon size={16} strokeWidth={2} />
              {item.label}
            </Link>
          ))}
      </nav>
      <div className="mt-auto border-t border-border px-4 py-5">
        {user ? (
          <div className="mb-4 flex items-center gap-3 px-1">
            <Avatar name={user.name} />
            <span className="min-w-0 text-sm">
              <span className="block truncate font-semibold">{user.name}</span>
              <span className="block truncate text-xs capitalize text-muted-foreground">
                {user.role}
              </span>
            </span>
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => void logout().then(() => router.push("/login"))}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-destructive px-4 py-3 text-sm font-semibold text-destructive-foreground transition hover:opacity-95"
        >
          <LogOut size={16} strokeWidth={2} />
          Logout
        </button>
      </div>
    </aside>
  );
}
