import { DocumentsClient } from "@/components/crm/documents-client";
import { PageHead } from "@/components/crm/page-head";

export default function DocumentsPage() {
  return (
    <div className="module-grid">
      <PageHead
        badge="Documents"
        title="Packages, uploads, and signature flow"
        description="Document workflows now have progress actions and can evolve into real borrower and lender packs."
      />
      <DocumentsClient />
    </div>
  );
}
