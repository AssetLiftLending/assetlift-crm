import { DashboardClient } from "@/components/crm/dashboard-client";
import { PageHead } from "@/components/crm/page-head";

export default function DashboardPage() {
  return (
    <div className="module-grid">
      <PageHead
        badge="Overview"
        title="Simple CRM process"
        description="Start with a contact, move qualified files into deals, then track communication and follow-up."
      />
      <DashboardClient />
    </div>
  );
}
