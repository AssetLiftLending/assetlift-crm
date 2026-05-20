import { Sidebar } from "@/components/crm/sidebar";
import { Topbar } from "@/components/crm/topbar";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="app-shell">
      <div className="app-frame">
        <Sidebar />
        <div className="content-shell">
          <Topbar />
          {children}
        </div>
      </div>
    </div>
  );
}
