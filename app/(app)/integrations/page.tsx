import { PageHead } from "@/components/crm/page-head";
import { RecordTable } from "@/components/crm/record-table";
import { integrations } from "@/lib/mock-data";

export default function IntegrationsPage() {
  return (
    <div className="module-grid">
      <PageHead
        badge="Integrations"
        title="Connected systems and planned syncs"
        description="This is where the new CRM will absorb real email, calendar, SMS, doc, and lead-capture integrations."
      />
      <RecordTable
        title="Integration roadmap"
        rows={integrations}
        columns={[
          { key: "name", label: "System", render: (row) => row.name },
          { key: "purpose", label: "Purpose", render: (row) => row.purpose },
          { key: "status", label: "Status", render: (row) => row.status },
        ]}
      />
    </div>
  );
}
