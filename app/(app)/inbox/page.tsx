import { PageHead } from "@/components/crm/page-head";
import { RecordTable } from "@/components/crm/record-table";
import { inboxThreads } from "@/lib/mock-data";

export default function InboxPage() {
  return (
    <div className="module-grid">
      <PageHead
        badge="Inbox"
        title="Borrower and lender communication"
        description="This is where email, SMS, and call summaries will converge once live integrations are wired."
      />
      <RecordTable
        title="Open threads"
        rows={inboxThreads}
        columns={[
          { key: "sender", label: "Sender", render: (row) => row.sender },
          { key: "subject", label: "Subject", render: (row) => row.subject },
          { key: "summary", label: "Summary", render: (row) => row.summary },
          { key: "status", label: "Status", render: (row) => row.status },
          { key: "age", label: "Age", render: (row) => row.age },
        ]}
      />
    </div>
  );
}
