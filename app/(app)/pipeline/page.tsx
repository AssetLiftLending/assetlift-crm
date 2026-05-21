import { PageHead } from "@/components/crm/page-head";
import { PipelineClient } from "@/components/crm/pipeline-client";

export default function PipelinePage() {
  return (
    <div className="module-grid">
      <PageHead
        badge="Pipeline"
        title="Deal pipeline and lender routing"
        description="The pipeline now behaves like a real opportunities board with configurable stages, filters, and win/loss management."
      />
      <PipelineClient />
    </div>
  );
}
