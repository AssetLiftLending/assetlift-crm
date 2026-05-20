import { PageHead } from "@/components/crm/page-head";
import { Card, SectionHeader } from "@/components/ui/primitives";
import { calendarItems } from "@/lib/mock-data";

export default function CalendarPage() {
  return (
    <div className="module-grid">
      <PageHead
        badge="Calendar"
        title="Follow-ups, closings, and review blocks"
        description="The calendar module will become the center for SLA-driven follow-up scheduling and borrower package timing."
      />
      <Card>
        <SectionHeader
          eyebrow="This week"
          title="Upcoming actions"
          description="Each item should eventually sync with Google Calendar and owner reminders."
        />
        <div className="timeline-list">
          {calendarItems.map((item) => (
            <div key={item.id} className="timeline-row">
              <div>
                <strong>{item.title}</strong>
                <p>{item.type}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <strong>{item.date}</strong>
                <p>{item.owner}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
