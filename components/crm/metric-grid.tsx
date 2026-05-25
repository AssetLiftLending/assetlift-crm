import type { Route } from "next";
import Link from "next/link";
import { Activity, ArrowUpRight, CalendarClock, MessageSquareMore, Users } from "lucide-react";
import { formatCompact, formatCurrency } from "@/lib/utils";

export function MetricGrid({
  metrics,
}: {
  metrics: {
    openLeads: number;
    activeLoans: number;
    fundedThisMonth: number;
    pipelineValue: number;
    overdueTasks: number;
    responseSla: string;
  };
}) {
  const items: Array<{
    label: string;
    value: string;
    icon: typeof Users;
    href: Route;
    detail: string;
  }> = [
    {
      label: "Open leads",
      value: formatCompact(metrics.openLeads),
      icon: Users,
      href: "/contacts",
      detail: "Review borrower leads",
    },
    {
      label: "Deals",
      value: formatCompact(metrics.activeLoans),
      icon: Activity,
      href: "/pipeline",
      detail: "Manage active files",
    },
    {
      label: "Pipeline value",
      value: formatCurrency(metrics.pipelineValue),
      icon: Activity,
      href: "/pipeline",
      detail: "Open pipeline totals",
    },
    {
      label: "Follow-ups",
      value: formatCompact(metrics.overdueTasks),
      icon: CalendarClock,
      href: "/calendar",
      detail: "Review scheduled actions",
    },
    {
      label: "Inbox",
      value: metrics.responseSla,
      icon: MessageSquareMore,
      href: "/inbox",
      detail: "Open tracked conversations",
    },
  ];

  return (
    <div className="metric-grid">
      {items.map(({ label, value, icon: Icon, href, detail }) => (
        <Link key={label} href={href} className="card metric-card metric-link-card">
          <div className="metric-head">
            <span>{label}</span>
            <Icon size={18} />
          </div>
          <strong>{value}</strong>
          <div className="metric-foot">
            <span>{detail}</span>
            <ArrowUpRight size={16} />
          </div>
        </Link>
      ))}
    </div>
  );
}
