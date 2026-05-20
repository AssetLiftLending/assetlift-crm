import { PageHead } from "@/components/crm/page-head";
import { RecordTable } from "@/components/crm/record-table";
import { automations } from "@/lib/mock-data";

export default function AutomationsPage() {
  return (
    <div className="module-grid">
      <PageHead
        badge="Automations"
        title="Operational workflows"
        description="Automations here should cover intake, lender follow-up, borrower reminders, and internal escalation paths."
      />
      <RecordTable
        title="Automation library"
        rows={automations}
        columns={[
          { key: "name", label: "Workflow", render: (row) => row.name },
          { key: "trigger", label: "Trigger", render: (row) => row.trigger },
          { key: "action", label: "Action", render: (row) => row.action },
          { key: "status", label: "Status", render: (row) => row.status },
        ]}
      />
    </div>
  );
}
