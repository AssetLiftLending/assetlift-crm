"use client";

import { useCrm } from "@/components/crm/crm-provider";
import { Badge, Card, SectionHeader } from "@/components/ui/primitives";

export function AutomationsClient() {
  const { automations, updateAutomationStatus } = useCrm();

  return (
    <Card>
      <SectionHeader
        eyebrow="Automation library"
        title="Workflow controls"
        description="Status changes now persist in the CRM instead of staying hard-coded."
      />
      <div className="mini-list">
        {automations.map((automation) => (
          <div key={automation.id} className="mini-row">
            <div>
              <strong>{automation.name}</strong>
              <p>{automation.trigger}</p>
              <p>{automation.action}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <Badge>{automation.status}</Badge>
              <div className="pill-row" style={{ justifyContent: "flex-end" }}>
                {(["Live", "Draft", "Paused"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    className="secondary-button"
                    onClick={() => updateAutomationStatus(automation.id, status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
