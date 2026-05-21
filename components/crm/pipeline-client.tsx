"use client";

import { useCrm } from "@/components/crm/crm-provider";
import { Badge, Card, SectionHeader } from "@/components/ui/primitives";
import { formatCurrency } from "@/lib/utils";

const stageOrder = ["Sizing", "Lender Review", "Conditional Approval", "Underwriting", "Funded"];

export function PipelineClient() {
  const { deals, updateDealStage } = useCrm();

  return (
    <div className="section-grid three">
      {stageOrder.map((stage) => (
        <Card key={stage}>
          <SectionHeader eyebrow="Stage" title={stage} description="Operational lending pipeline" />
          <div className="stack">
            {deals
              .filter((deal) => deal.stage === stage)
              .map((deal) => (
                <Card key={deal.id} className="card" style={{ background: "white" }}>
                  <strong>{deal.borrower}</strong>
                  <p>{deal.property}</p>
                  <p>{deal.program}</p>
                  <div className="pill-row">
                    <Badge>{formatCurrency(deal.amount)}</Badge>
                    <Badge>{deal.risk}</Badge>
                  </div>
                  {stage !== "Funded" ? (
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => {
                        const index = stageOrder.indexOf(stage);
                        updateDealStage(deal.id, stageOrder[index + 1]);
                      }}
                    >
                      Move to next stage
                    </button>
                  ) : null}
                </Card>
              ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
