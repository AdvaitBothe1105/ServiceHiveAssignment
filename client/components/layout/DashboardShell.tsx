import TopBar from "./TopBar";

type DashboardShellProps = {
  children: React.ReactNode;
};

export default function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <main className="mx-auto w-full max-w-[1440px] px-6 py-8 lg:px-8">{children}</main>
    </div>
  );
}
