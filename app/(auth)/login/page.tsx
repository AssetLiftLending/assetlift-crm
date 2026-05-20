import Link from "next/link";
import { ArrowRight, BadgeDollarSign, Building2, Workflow } from "lucide-react";
import { Card, Badge } from "@/components/ui/primitives";

export default function LoginPage() {
  return (
    <div className="login-shell">
      <section className="login-panel">
        <Badge>Fresh AssetLift CRM build</Badge>
        <div>
          <h1 style={{ fontSize: "3rem", marginBottom: 12 }}>
            Capital workflow CRM for borrower intake to funding.
          </h1>
          <p style={{ color: "var(--muted)", maxWidth: 620, lineHeight: 1.7 }}>
            This new codebase is the clean restart: separate from the marketing
            site, structured around lending ops, and designed to grow toward
            Genie Rocket-style feature parity with AssetLift-specific lender and
            borrower workflows.
          </p>
        </div>

        <div className="login-card">
          <div className="section-header" style={{ marginBottom: 20 }}>
            <span className="eyebrow">Demo access</span>
            <h2>Enter the CRM</h2>
            <p>No auth is wired yet. This opens the new app shell directly.</p>
          </div>
          <div className="login-grid">
            <input defaultValue="yl@assetliftcrm.com" aria-label="Email" />
            <input defaultValue="••••••••••••" aria-label="Password" />
            <Link href="/dashboard" className="primary-button" style={{ textAlign: "center" }}>
              Open CRM <ArrowRight size={16} style={{ verticalAlign: "middle", marginLeft: 8 }} />
            </Link>
          </div>
        </div>
      </section>

      <section className="login-side">
        <div>
          <span className="eyebrow" style={{ color: "rgba(255,255,255,0.72)" }}>
            Core build targets
          </span>
          <div className="stack" style={{ marginTop: 24 }}>
            <Card className="card" style={{ background: "rgba(255,255,255,0.12)", color: "white" }}>
              <Building2 size={20} />
              <h3>Borrower command center</h3>
              <p>Leads, deals, docs, tasks, lender routing, and closing status in one place.</p>
            </Card>
            <Card className="card" style={{ background: "rgba(255,255,255,0.12)", color: "white" }}>
              <Workflow size={20} />
              <h3>Automation-first operations</h3>
              <p>Response SLA, borrower package reminders, and lender follow-up workflows.</p>
            </Card>
            <Card className="card" style={{ background: "rgba(255,255,255,0.12)", color: "white" }}>
              <BadgeDollarSign size={20} />
              <h3>Funding visibility</h3>
              <p>Revenue, pipeline value, stage risk, and lender-fit intelligence per file.</p>
            </Card>
          </div>
        </div>
        <div>
          <strong>Phase 1</strong>
          <p style={{ color: "rgba(255,255,255,0.72)" }}>
            Dashboard, contacts, pipeline, inbox, calendar, docs, reporting,
            automations, and integrations.
          </p>
        </div>
      </section>
    </div>
  );
}
