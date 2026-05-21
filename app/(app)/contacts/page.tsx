import { ContactsClient } from "@/components/crm/contacts-client";
import { PageHead } from "@/components/crm/page-head";

export default function ContactsPage() {
  return (
    <div className="module-grid">
      <PageHead
        badge="Contacts"
        title="Borrowers and lead records"
        description="Contacts can now be searched and added directly in the CRM."
      />
      <ContactsClient />
    </div>
  );
}
