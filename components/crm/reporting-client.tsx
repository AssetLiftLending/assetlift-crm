"use client";

import { useCrm } from "@/components/crm/crm-provider";
import { Card, SectionHeader } from "@/components/ui/primitives";
import { formatCurrency } from "@/lib/utils";

export function ReportingClient() {
  const { contacts, deals, inboxThreads, metrics } = useCrm();
  const openDeals = deals.filter((deal) => deal.status === "Open");

  return (
    <div className="section-grid three">
      <Card>
        <SectionHeader eyebrow="Throughput" title="Funded this month" />
        <strong style={{ fontSize: "2.1rem" }}>{metrics.fundedThisMonth}</strong>
        <p>{contacts.length} active borrower records currently tracked.</p>
      </Card>
      <Card>
        <SectionHeader eyebrow="Velocity" title="Response SLA" />
        <strong style={{ fontSize: "2.1rem" }}>{metrics.responseSla}</strong>
        <p>{inboxThreads.length} inbox threads are active right now.</p>
      </Card>
      <Card>
        <SectionHeader eyebrow="Volume" title="Pipeline value" />
        <strong style={{ fontSize: "2.1rem" }}>{formatCurrency(metrics.pipelineValue)}</strong>
        <p>{openDeals.length} open files are included in the current pipeline total.</p>
      </Card>
    </div>
  );
}
