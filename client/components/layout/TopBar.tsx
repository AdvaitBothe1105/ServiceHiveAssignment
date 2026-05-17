"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "../../contexts/UserContext";
import ThemeToggle from "../ThemeToggle";
import Avatar from "../ui/Avatar";
import { RoleBadge } from "../ui/Badge";
import Button from "../ui/Button";

const navLinkClass = (active: boolean) =>
  `text-sm font-medium transition ${
    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
  }`;

export default function TopBar() {
  const pathname = usePathname();
  const { user, isLoading, logout } = useUser();
  const isAdmin = user?.role === "admin";

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-card/80 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <div className="flex flex-wrap items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background font-mono text-xs font-semibold text-primary">
              SO
            </span>
            <span>
              <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">SignalOps</p>
              <p className="text-sm font-semibold">Smart Leads</p>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-5">
            <Link href="/dashboard" className={navLinkClass(pathname === "/dashboard")}>
              Leads
            </Link>
            <Link
              href="/dashboard#analytics"
              className={navLinkClass(pathname.includes("#analytics"))}
            >
              Analytics
            </Link>
            {isAdmin ? (
              <Link
                href="/dashboard/users"
                className={navLinkClass(pathname.startsWith("/dashboard/users"))}
              >
                Users
              </Link>
            ) : null}
          </nav>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <ThemeToggle />
          {isLoading ? (
            <span className="text-sm text-muted-foreground">Loading…</span>
          ) : user ? (
            <>
              <div className="flex items-center gap-3 rounded-full border border-border/70 bg-background/80 px-3 py-1.5">
                <Avatar name={user.name} />
                <span className="hidden text-sm sm:block">
                  <span className="block font-semibold leading-tight">{user.name}</span>
                  <RoleBadge role={user.role} />
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => void logout()}>
                Logout
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
