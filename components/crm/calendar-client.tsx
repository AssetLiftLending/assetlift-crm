"use client";

import { useState } from "react";
import { useCrm } from "@/components/crm/crm-provider";
import { Card, SectionHeader } from "@/components/ui/primitives";

export function CalendarClient() {
  const { addCalendarItem, calendarItems } = useCrm();
  const [form, setForm] = useState({
    title: "",
    type: "Follow-up" as const,
    date: "",
    owner: "YL",
  });

  return (
    <div className="section-grid two">
      <Card>
        <SectionHeader eyebrow="This week" title="Upcoming actions" description="Calendar items persist locally now." />
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

      <Card>
        <SectionHeader eyebrow="Add item" title="Create follow-up" description="Use this for calls, closings, and borrower reminders." />
        <div className="login-grid">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Task title" />
          <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="Today - 3:00 PM" />
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              if (!form.title.trim() || !form.date.trim()) return;
              addCalendarItem(form);
              setForm({ title: "", type: "Follow-up", date: "", owner: "YL" });
            }}
          >
            Add calendar item
          </button>
        </div>
      </Card>
    </div>
  );
}
