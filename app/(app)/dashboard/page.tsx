import { DashboardClient } from "@/components/crm/dashboard-client";
import { PageHead } from "@/components/crm/page-head";

export default function DashboardPage() {
  return (
    <div className="module-grid">
      <PageHead
        badge="Command center"
        title="Operating view across leads, lenders, and closings"
        description="The dashboard now runs off shared CRM state instead of a static marketing-style mock."
      />
      <DashboardClient />
    </div>
  );
}
