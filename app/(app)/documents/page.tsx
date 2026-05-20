import { PageHead } from "@/components/crm/page-head";
import { Card, SectionHeader, Badge } from "@/components/ui/primitives";

const packs = [
  {
    name: "Borrower intake pack",
    detail: "LLC docs, operating agreement, purchase contract, rehab scope, bank statements",
    status: "Active",
  },
  {
    name: "Lender submission pack",
    detail: "Executive summary, borrower profile, property analysis, exit plan, rent support",
    status: "Template",
  },
  {
    name: "Closing checklist",
    detail: "Insurance, title, payoff, vesting, wire instructions, note package",
    status: "Active",
  },
];

export default function DocumentsPage() {
  return (
    <div className="module-grid">
      <PageHead
        badge="Documents"
        title="Packages, uploads, and signature flow"
        description="The document module is shaped around borrower collection, lender submission, and e-sign routing."
      />
      <Card>
        <SectionHeader
          eyebrow="Collections"
          title="Document workflows"
          description="These flows should later connect to DocuSeal, cloud storage, and audit logs."
        />
        <div className="mini-list">
          {packs.map((pack) => (
            <div key={pack.name} className="mini-row">
              <div>
                <strong>{pack.name}</strong>
                <p>{pack.detail}</p>
              </div>
              <Badge>{pack.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
