import { AutomationsClient } from "@/components/crm/automations-client";
import { PageHead } from "@/components/crm/page-head";

export default function AutomationsPage() {
  return (
    <div className="module-grid">
      <PageHead
        badge="Automations"
        title="Operational workflows"
        description="Automation statuses now update and persist across the app."
      />
      <AutomationsClient />
    </div>
  );
}
