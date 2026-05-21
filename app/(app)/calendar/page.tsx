import { CalendarClient } from "@/components/crm/calendar-client";
import { PageHead } from "@/components/crm/page-head";

export default function CalendarPage() {
  return (
    <div className="module-grid">
      <PageHead
        badge="Calendar"
        title="Follow-ups, closings, and review blocks"
        description="Calendar items are now editable in the CRM instead of being fixed text."
      />
      <CalendarClient />
    </div>
  );
}
