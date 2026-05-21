import { PageHead } from "@/components/crm/page-head";
import { PipelineClient } from "@/components/crm/pipeline-client";

export default function PipelinePage() {
  return (
    <div className="module-grid">
      <PageHead
        badge="Pipeline"
        title="Deal pipeline and lender routing"
        description="Pipeline cards now move forward stage by stage instead of staying static."
      />
      <PipelineClient />
    </div>
  );
}
