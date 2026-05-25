import { IntegrationsClient } from "@/components/crm/integrations-client";
import { PageHead } from "@/components/crm/page-head";

export default function IntegrationsPage() {
  return (
    <div className="module-grid">
      <PageHead
        badge="Integrations"
        title="Connected systems and mailbox setup"
        description="Use Google Workspace OAuth for mailbox access, then test send directly from the connected account."
      />
      <IntegrationsClient />
    </div>
  );
}
