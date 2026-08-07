import DashboardNavbar from "@/components/dashboard/dashboard-navbar";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <DashboardNavbar />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
