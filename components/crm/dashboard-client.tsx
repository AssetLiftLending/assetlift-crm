"use client";

import type { Route } from "next";
import Link from "next/link";
import { useCrm } from "@/components/crm/crm-provider";
import { Badge, Card, SectionHeader } from "@/components/ui/primitives";
import { formatCurrency } from "@/lib/utils";

const processSteps: Array<{
  step: string;
  title: string;
  detail: string;
  href: Route;
}> = [
  {
    step: "01",
    title: "Add a contact",
    detail: "Start with the borrower or company record.",
    href: "/contacts",
  },
  {
    step: "02",
    title: "Create a deal",
    detail: "Move qualified files into the pipeline.",
    href: "/pipeline",
  },
  {
    step: "03",
    title: "Track communication",
    detail: "Log inbox activity and keep next steps visible.",
    href: "/inbox",
  },
  {
    step: "04",
    title: "Schedule follow-up",
    detail: "Create the next call, review, or closing task.",
    href: "/calendar",
  },
];

export function DashboardClient() {
  const { activities, calendarItems, deals, inboxThreads, metrics } = useCrm();
  const recentActivity = activities.slice(0, 4);
  const hasWork = metrics.openLeads || metrics.activeLoans || inboxThreads.length || calendarItems.length;

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero-simple">
        <span className="eyebrow">Simple process</span>
        <h2>Run the CRM in four steps: contact, deal, communication, follow-up.</h2>
        <p>
          No seeded borrower names, fake pipeline numbers, or demo activity. Start with a real contact and the rest of the workflow builds from there.
        </p>
      </section>

      <section className="dashboard-process-grid">
        {processSteps.map((item) => (
          <Link key={item.step} href={item.href} className="card process-card">
            <span className="process-step">{item.step}</span>
            <strong>{item.title}</strong>
            <p>{item.detail}</p>
          </Link>
        ))}
      </section>

      <section className="metric-grid metric-grid-simple">
        <Link href="/contacts" className="card metric-card metric-link-card">
          <div className="metric-head">
            <span>Contacts</span>
          </div>
          <strong>{metrics.openLeads}</strong>
          <div className="metric-foot">
            <span>Records in CRM</span>
          </div>
        </Link>
        <Link href="/pipeline" className="card metric-card metric-link-card">
          <div className="metric-head">
            <span>Deals</span>
          </div>
          <strong>{metrics.activeLoans}</strong>
          <div className="metric-foot">
            <span>{formatCurrency(metrics.pipelineValue)} open pipeline</span>
          </div>
        </Link>
        <Link href="/inbox" className="card metric-card metric-link-card">
          <div className="metric-head">
            <span>Inbox</span>
          </div>
          <strong>{inboxThreads.length}</strong>
          <div className="metric-foot">
            <span>Tracked conversations</span>
          </div>
        </Link>
        <Link href="/calendar" className="card metric-card metric-link-card">
          <div className="metric-head">
            <span>Follow-ups</span>
          </div>
          <strong>{calendarItems.length}</strong>
          <div className="metric-foot">
            <span>Scheduled actions</span>
          </div>
        </Link>
      </section>

      <section className="section-grid two">
        <Card>
          <SectionHeader
            eyebrow="Current state"
            title="What needs your attention"
            description="This stays empty until you add real records."
          />
          {hasWork ? (
            <div className="mini-list">
              {deals.slice(0, 3).map((deal) => (
                <div key={deal.id} className="mini-row">
                  <div>
                    <strong>{deal.borrower}</strong>
                    <p>{deal.nextStep || "Next step not set"}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <Badge>{deal.status}</Badge>
                    <p>{formatCurrency(deal.amount)}</p>
                  </div>
                </div>
              ))}
              {!deals.length && inboxThreads.slice(0, 3).map((thread) => (
                <div key={thread.id} className="mini-row">
                  <div>
                    <strong>{thread.subject}</strong>
                    <p>{thread.summary}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <Badge>{thread.status}</Badge>
                    <p>{thread.age}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-panel">
              <strong>No active work yet</strong>
              <p>Create a contact first, then add a deal only when it becomes real.</p>
            </div>
          )}
        </Card>

        <Card>
          <SectionHeader
            eyebrow="Recent updates"
            title="Activity log"
            description="A short record of what was added or changed."
          />
          {recentActivity.length ? (
            <div className="mini-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="mini-row">
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
          ) : (
            <div className="empty-panel">
              <strong>No activity yet</strong>
              <p>New contacts, deals, and follow-ups will appear here automatically.</p>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
