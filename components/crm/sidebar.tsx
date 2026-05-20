import Link from "next/link";
import {
  Bot,
  CalendarDays,
  ChartColumnBig,
  FileCheck2,
  Inbox,
  LayoutDashboard,
  Link2,
  Users,
  Waypoints,
} from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/pipeline", label: "Pipeline", icon: Waypoints },
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/documents", label: "Documents", icon: FileCheck2 },
  { href: "/automations", label: "Automations", icon: Bot },
  { href: "/reporting", label: "Reporting", icon: ChartColumnBig },
  { href: "/integrations", label: "Integrations", icon: Link2 },
] as const;

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <span className="brand-kicker">AssetLift CRM</span>
        <h1>Capital Ops</h1>
        <p>Built for borrower intake, lender routing, and funding visibility.</p>
      </div>

      <nav className="nav-list">
        {items.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="nav-item">
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>Target build</p>
        <strong>Genie Rocket-style feature parity + AssetLift lending ops</strong>
      </div>
    </aside>
  );
}
