import { IntegrationsClient } from "@/components/crm/integrations-client";
import { PageHead } from "@/components/crm/page-head";

export default function IntegrationsPage() {
  return (
    <div className="module-grid">
      <PageHead
        badge="Integrations"
        title="Connected systems and mailbox setup"
        description="Integration statuses persist now, and email settings plus test-send are wired into the app."
      />
      <IntegrationsClient />
    </div>
  );
}
