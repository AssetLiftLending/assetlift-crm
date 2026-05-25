import type { Route } from "next";
import Link from "next/link";
import { Activity, ArrowUpRight, DollarSign, MessageSquareMore, OctagonAlert, Trophy, Users } from "lucide-react";
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
      label: "Active loans",
      value: formatCompact(metrics.activeLoans),
      icon: Activity,
      href: "/pipeline",
      detail: "Manage live files",
    },
    {
      label: "Funded this month",
      value: formatCompact(metrics.fundedThisMonth),
      icon: Trophy,
      href: "/reporting",
      detail: "Check production pace",
    },
    {
      label: "Pipeline value",
      value: formatCurrency(metrics.pipelineValue),
      icon: DollarSign,
      href: "/pipeline",
      detail: "Open the pipeline board",
    },
    {
      label: "Overdue tasks",
      value: formatCompact(metrics.overdueTasks),
      icon: OctagonAlert,
      href: "/calendar",
      detail: "Clear follow-ups",
    },
    {
      label: "Response SLA",
      value: metrics.responseSla,
      icon: MessageSquareMore,
      href: "/inbox",
      detail: "Jump into conversations",
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
