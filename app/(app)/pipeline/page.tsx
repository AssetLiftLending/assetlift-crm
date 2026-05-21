import { PageHead } from "@/components/crm/page-head";
import { PipelineClient } from "@/components/crm/pipeline-client";

export default function PipelinePage() {
  return (
    <div className="module-grid">
      <PageHead
        badge="Opportunities"
        title="Opportunity pipeline"
        description="A real operator-facing opportunities board with searchable stages, compact deal cards, and win/loss tracking."
      />
      <PipelineClient />
    </div>
  );
}
