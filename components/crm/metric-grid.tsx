import { Activity, DollarSign, MessageSquareMore, OctagonAlert, Trophy, Users } from "lucide-react";
import { Card } from "@/components/ui/primitives";
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
  const items = [
    { label: "Open leads", value: formatCompact(metrics.openLeads), icon: Users },
    { label: "Active loans", value: formatCompact(metrics.activeLoans), icon: Activity },
    { label: "Funded this month", value: formatCompact(metrics.fundedThisMonth), icon: Trophy },
    { label: "Pipeline value", value: formatCurrency(metrics.pipelineValue), icon: DollarSign },
    { label: "Overdue tasks", value: formatCompact(metrics.overdueTasks), icon: OctagonAlert },
    { label: "Response SLA", value: metrics.responseSla, icon: MessageSquareMore },
  ];

  return (
    <div className="metric-grid">
      {items.map(({ label, value, icon: Icon }) => (
        <Card key={label} className="metric-card">
          <div className="metric-head">
            <span>{label}</span>
            <Icon size={18} />
          </div>
          <strong>{value}</strong>
        </Card>
      ))}
    </div>
  );
}
