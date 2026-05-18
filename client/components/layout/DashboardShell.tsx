import DashboardSidebar from "./DashboardSidebar";
import TopBar from "./TopBar";

type DashboardShellProps = {
  children: React.ReactNode;
};

export default function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen w-full max-w-[1440px] grid-cols-[260px_1fr]">
        <DashboardSidebar />
        <div className="flex min-h-screen flex-col">
          <TopBar />
          <main className="flex-1 bg-background px-8 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
