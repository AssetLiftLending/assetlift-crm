import { PageHead } from "@/components/crm/page-head";
import { ReportingClient } from "@/components/crm/reporting-client";

export default function ReportingPage() {
  return (
    <div className="module-grid">
      <PageHead
        badge="Reporting"
        title="Revenue and execution reporting"
        description="Reporting now reflects live CRM state totals instead of frozen numbers."
      />
      <ReportingClient />
    </div>
  );
}
