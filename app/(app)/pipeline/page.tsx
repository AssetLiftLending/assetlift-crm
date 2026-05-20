import { PageHead } from "@/components/crm/page-head";
import { Card, Badge, SectionHeader } from "@/components/ui/primitives";
import { deals } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const stages = ["Sizing", "Lender Review", "Conditional Approval", "Underwriting"];

export default function PipelinePage() {
  return (
    <div className="module-grid">
      <PageHead
        badge="Pipeline"
        title="Deal pipeline and lender routing"
        description="A lender-facing board should show borrower fit, file risk, and next blocker instead of a generic sales board."
      />
      <div className="section-grid three">
        {stages.map((stage) => (
          <Card key={stage}>
            <SectionHeader
              eyebrow="Stage"
              title={stage}
              description="Borrower files grouped by actual funding motion."
            />
            <div className="stack">
              {deals.filter((deal) => deal.stage === stage).map((deal) => (
                <Card key={deal.id} className="card" style={{ background: "white" }}>
                  <strong>{deal.borrower}</strong>
                  <p>{deal.property}</p>
                  <p>{deal.program}</p>
                  <div className="pill-row">
                    <Badge>{formatCurrency(deal.amount)}</Badge>
                    <Badge>{deal.risk} risk</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
