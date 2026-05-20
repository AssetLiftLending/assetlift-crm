import { PageHead } from "@/components/crm/page-head";
import { RecordTable } from "@/components/crm/record-table";
import { contacts } from "@/lib/mock-data";

export default function ContactsPage() {
  return (
    <div className="module-grid">
      <PageHead
        badge="Contacts"
        title="Borrowers and lead records"
        description="Every borrower profile should carry source, score, owner, next step, and speed-to-close context."
      />
      <RecordTable
        title="Lead database"
        rows={contacts}
        columns={[
          { key: "name", label: "Borrower", render: (row) => row.name },
          { key: "company", label: "Company", render: (row) => row.company },
          { key: "stage", label: "Stage", render: (row) => row.stage },
          { key: "score", label: "Score", render: (row) => row.score },
          { key: "source", label: "Source", render: (row) => row.source },
          { key: "nextStep", label: "Next Step", render: (row) => row.nextStep },
          { key: "owner", label: "Owner", render: (row) => row.owner },
        ]}
      />
    </div>
  );
}
