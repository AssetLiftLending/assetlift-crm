"use client";

import Link from "next/link";
import { MetricGrid } from "@/components/crm/metric-grid";
import { useCrm } from "@/components/crm/crm-provider";
import { Badge, SectionHeader } from "@/components/ui/primitives";
import { formatCurrency } from "@/lib/utils";

export function DashboardClient() {
  const { activities, calendarItems, deals, inboxThreads, metrics, pipelineStages } = useCrm();
  const stageName = (stageId: string) =>
    pipelineStages.find((stage) => stage.id === stageId)?.name ?? stageId;
  const watchlist = deals.slice(0, 4);
  const signalDeals = deals.slice(0, 3);
  const urgentThreads = inboxThreads.slice(0, 4);
  const nextActions = calendarItems.slice(0, 4);
  const recentActivity = activities.slice(0, 5);

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <span className="eyebrow">Today&apos;s command view</span>
          <h2>
            {formatCurrency(metrics.pipelineValue)} in active pipeline with {metrics.overdueTasks} tasks holding up movement.
          </h2>
          <p>
            This dashboard is now a cleaner operating surface. Every box below opens directly into the related workspace.
          </p>
          <div className="dashboard-hero-stats">
            <div className="dashboard-stat-chip">
              <span>Open leads</span>
              <strong>{metrics.openLeads}</strong>
            </div>
            <div className="dashboard-stat-chip">
              <span>Active loans</span>
              <strong>{metrics.activeLoans}</strong>
            </div>
            <div className="dashboard-stat-chip">
              <span>Response SLA</span>
              <strong>{metrics.responseSla}</strong>
            </div>
          </div>
        </div>
        <Link href="/pipeline" className="card dashboard-focus-card">
          <div className="dashboard-card-topline">
            <span className="eyebrow">High attention</span>
            <span className="dashboard-card-link">Open pipeline</span>
          </div>
          <SectionHeader
            title="Immediate operating signals"
            description="The top files to touch first."
          />
          <div className="signal-list">
            {signalDeals.map((deal) => (
              <div key={deal.id} className="signal-row">
                <div>
                  <strong>{deal.borrower}</strong>
                  <p>{deal.program} - {stageName(deal.stageId)}</p>
                </div>
                <Badge>{deal.risk} risk</Badge>
              </div>
            ))}
          </div>
        </Link>
      </section>

      <MetricGrid metrics={metrics} />

      <section className="section-grid two">
        <Link href="/pipeline" className="card dashboard-link-card">
          <div className="dashboard-card-topline">
            <span className="eyebrow">Deal pressure</span>
            <span className="dashboard-card-link">View all deals</span>
          </div>
          <SectionHeader title="Pipeline watchlist" description="Highest-value files with lender-fit and risk context." />
          <div className="timeline-list">
            {watchlist.map((deal) => (
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
        </Link>

        <Link href="/reporting" className="card dashboard-link-card">
          <div className="dashboard-card-topline">
            <span className="eyebrow">Recent activity</span>
            <span className="dashboard-card-link">Open reporting</span>
          </div>
          <SectionHeader title="Ops timeline" description="Latest borrower, lender, and internal execution events." />
          <div className="timeline-list">
            {recentActivity.map((activity) => (
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
        </Link>
      </section>

      <section className="section-grid two">
        <Link href="/inbox" className="card dashboard-link-card">
          <div className="dashboard-card-topline">
            <span className="eyebrow">Inbox triage</span>
            <span className="dashboard-card-link">Open inbox</span>
          </div>
          <SectionHeader title="Threads needing action" description="Borrower and lender communication that can move or stall deals." />
          <div className="mini-list">
            {urgentThreads.map((thread) => (
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
        </Link>

        <Link href="/calendar" className="card dashboard-link-card">
          <div className="dashboard-card-topline">
            <span className="eyebrow">Calendar</span>
            <span className="dashboard-card-link">Open schedule</span>
          </div>
          <SectionHeader title="Scheduled follow-through" description="Calls, closings, and next borrower actions." />
          <div className="mini-list">
            {nextActions.map((item) => (
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
        </Link>
      </section>
    </div>
  );
}
