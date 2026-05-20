import { PageHead } from "@/components/crm/page-head";
import { MetricGrid } from "@/components/crm/metric-grid";
import { Card, Badge, SectionHeader } from "@/components/ui/primitives";
import { activities, calendarItems, deals, inboxThreads, metrics } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  return (
    <div className="module-grid">
      <PageHead
        badge="Command center"
        title="Operating view across leads, lenders, and closings"
        description="This is the clean restart for the AssetLift CRM: a real lending operations shell with lender-fit, borrower tasks, inbox pressure, and file visibility."
      />

      <section className="hero-panel">
        <div className="hero-grid">
          <div>
            <span className="eyebrow">Today&apos;s leverage</span>
            <h2 style={{ fontSize: "2.4rem", marginTop: 10 }}>
              {formatCurrency(metrics.pipelineValue)} in active pipeline with 9 overdue tasks to clear.
            </h2>
            <p style={{ maxWidth: 720, lineHeight: 1.8 }}>
              Prioritize lender review on bridge and construction files, clear title friction on the Los Angeles deal,
              and respond to two borrower threads before rate locks expire.
            </p>
          </div>
          <Card>
            <SectionHeader
              eyebrow="High attention"
              title="Immediate operating signals"
              description="Fastest path to keeping deals moving today."
            />
            <div className="signal-list">
              <div className="signal-row">
                <div>
                  <strong>Michael Torres</strong>
                  <p>Needs updated DSCR terms before LOI expires tonight.</p>
                </div>
                <Badge>Reply now</Badge>
              </div>
              <div className="signal-row">
                <div>
                  <strong>Jason Cole bridge file</strong>
                  <p>Title escalation overdue and lender appetite narrowing.</p>
                </div>
                <Badge>High risk</Badge>
              </div>
              <div className="signal-row">
                <div>
                  <strong>Sarah Mitchell closing package</strong>
                  <p>Only insurance binder remains before clear-to-close review.</p>
                </div>
                <Badge>Near funded</Badge>
              </div>
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
                  <p>{deal.program} · {deal.stage}</p>
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
            {activities.map((activity) => (
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
            {inboxThreads.map((thread) => (
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
            {calendarItems.map((item) => (
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
    </div>
  );
}
