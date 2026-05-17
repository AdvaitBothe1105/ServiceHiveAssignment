import DashboardShell from "../../components/layout/DashboardShell";
import { UserProvider } from "../../contexts/UserContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <DashboardShell>{children}</DashboardShell>
    </UserProvider>
  );
}
