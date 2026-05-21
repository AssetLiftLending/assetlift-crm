"use client";

import { useCrm } from "@/components/crm/crm-provider";
import { Badge, Card, SectionHeader } from "@/components/ui/primitives";

export function DocumentsClient() {
  const { advanceDocumentWorkflow, documentWorkflows } = useCrm();

  return (
    <Card>
      <SectionHeader
        eyebrow="Collections"
        title="Document workflows"
        description="The progress counters now advance instead of acting like static placeholders."
      />
      <div className="mini-list">
        {documentWorkflows.map((pack) => (
          <div key={pack.id} className="mini-row">
            <div>
              <strong>{pack.name}</strong>
              <p>{pack.detail}</p>
              <p>{pack.completed} / {pack.total} complete</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <Badge>{pack.status}</Badge>
              <button type="button" className="secondary-button" onClick={() => advanceDocumentWorkflow(pack.id)}>
                Mark item complete
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
