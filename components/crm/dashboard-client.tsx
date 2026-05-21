"use client";

import { MetricGrid } from "@/components/crm/metric-grid";
import { useCrm } from "@/components/crm/crm-provider";
import { Badge, Card, SectionHeader } from "@/components/ui/primitives";
import { formatCurrency } from "@/lib/utils";

export function DashboardClient() {
  const { activities, calendarItems, deals, inboxThreads, metrics, pipelineStages } = useCrm();
  const stageName = (stageId: string) =>
    pipelineStages.find((stage) => stage.id === stageId)?.name ?? stageId;

  return (
    <>
      <section className="hero-panel">
        <div className="hero-grid">
          <div>
            <span className="eyebrow">Today&apos;s leverage</span>
            <h2 style={{ fontSize: "2.4rem", marginTop: 10 }}>
              {formatCurrency(metrics.pipelineValue)} in active pipeline with {metrics.overdueTasks} operating tasks to clear.
            </h2>
            <p style={{ maxWidth: 720, lineHeight: 1.8 }}>
              The dashboard is now driven by shared state instead of fixed copy.
              Contacts, pipeline changes, inbox drafts, calendar items, and email settings
              all feed back into this view.
            </p>
          </div>
          <Card>
            <SectionHeader
              eyebrow="High attention"
              title="Immediate operating signals"
              description="Fastest path to keeping deals moving today."
            />
            <div className="signal-list">
              {deals.slice(0, 3).map((deal) => (
                <div key={deal.id} className="signal-row">
                  <div>
                    <strong>{deal.borrower}</strong>
                    <p>{deal.program} - {stageName(deal.stageId)}</p>
                  </div>
                  <Badge>{deal.risk} risk</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <MetricGrid metrics={metrics} />

      <section className="section-grid two">
        <Card>
          <SectionHeader
            eyebrow="Deal pressure"
            title="Pipeline watchlist"
            description="Highest-value files with lender-fit and risk context."
          />
          <div className="timeline-list">
            {deals.map((deal) => (
              <div key={deal.id} className="timeline-row">
                <div>
                  <strong>{deal.borrower}</strong>
                  <p>{deal.property}</p>
                  <p>{deal.program} - {stageName(deal.stageId)}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <strong>{formatCurrency(deal.amount)}</strong>
                  <p className={`risk-${deal.risk.toLowerCase()}`}>{deal.risk} risk</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader
            eyebrow="Recent activity"
            title="Ops timeline"
            description="Latest borrower, lender, and internal execution events."
          />
          <div className="timeline-list">
            {activities.slice(0, 6).map((activity) => (
              <div key={activity.id} className="timeline-row">
                <div>
                  <strong>{activity.title}</strong>
                  <p>{activity.detail}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <strong>{activity.owner}</strong>
                  <p>{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="section-grid two">
        <Card>
          <SectionHeader
            eyebrow="Inbox triage"
            title="Threads needing action"
            description="Borrower and lender communication that can move or stall deals."
          />
          <div className="mini-list">
            {inboxThreads.slice(0, 4).map((thread) => (
              <div key={thread.id} className="mini-row">
                <div>
                  <strong>{thread.sender}</strong>
                  <p>{thread.subject}</p>
                  <p>{thread.summary}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Badge>{thread.status}</Badge>
                  <p>{thread.age}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader
            eyebrow="Calendar"
            title="Scheduled follow-through"
            description="Calls, closings, and next borrower actions."
          />
          <div className="mini-list">
            {calendarItems.slice(0, 4).map((item) => (
              <div key={item.id} className="mini-row">
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.type}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <strong>{item.date}</strong>
                  <p>{item.owner}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </>
  );
}
