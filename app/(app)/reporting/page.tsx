import { PageHead } from "@/components/crm/page-head";
import { Card, SectionHeader } from "@/components/ui/primitives";
import { metrics } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function ReportingPage() {
  return (
    <div className="module-grid">
      <PageHead
        badge="Reporting"
        title="Revenue and execution reporting"
        description="Reporting should eventually cover close rate, lender response time, borrower conversion, and source quality."
      />
      <div className="section-grid three">
        <Card>
          <SectionHeader eyebrow="Throughput" title="Funded this month" />
          <strong style={{ fontSize: "2.1rem" }}>{metrics.fundedThisMonth}</strong>
          <p>Target a funded-file scorecard by owner and by loan product.</p>
        </Card>
        <Card>
          <SectionHeader eyebrow="Velocity" title="Response SLA" />
          <strong style={{ fontSize: "2.1rem" }}>{metrics.responseSla}</strong>
          <p>Track first-response speed on new borrower inquiries and lender replies.</p>
        </Card>
        <Card>
          <SectionHeader eyebrow="Volume" title="Pipeline value" />
          <strong style={{ fontSize: "2.1rem" }}>{formatCurrency(metrics.pipelineValue)}</strong>
          <p>Break out by program, state, source, and owner.</p>
        </Card>
      </div>
    </div>
  );
}
