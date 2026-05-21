import { InboxClient } from "@/components/crm/inbox-client";
import { PageHead } from "@/components/crm/page-head";

export default function InboxPage() {
  return (
    <div className="module-grid">
      <PageHead
        badge="Inbox"
        title="Borrower and lender communication"
        description="Threads can now be logged into the inbox, and the email module is ready for real provider credentials."
      />
      <InboxClient />
    </div>
  );
}
