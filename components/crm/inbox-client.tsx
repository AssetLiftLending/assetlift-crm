"use client";

import { useState } from "react";
import { useCrm } from "@/components/crm/crm-provider";
import { Badge, Card, SectionHeader } from "@/components/ui/primitives";

export function InboxClient() {
  const { addInboxThread, emailSettings, inboxThreads } = useCrm();
  const [form, setForm] = useState({
    sender: "",
    subject: "",
    summary: "",
    status: "Needs Reply" as const,
  });

  return (
    <div className="section-grid two">
      <Card>
        <SectionHeader
          eyebrow="Open communication"
          title="Inbox queue"
          description="This list now updates live from shared CRM state."
        />
        <div className="mini-list">
          {inboxThreads.map((thread) => (
            <div key={thread.id} className="mini-row">
              <div>
                <strong>{thread.sender}</strong>
                <p>{thread.subject}</p>
                <p>{thread.summary}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <Badge>{thread.status}</Badge>
                <p>{thread.age}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeader
          eyebrow="Compose"
          title="Log or draft a new thread"
          description={`Configured sender: ${emailSettings.fromEmail || "not set"}`}
        />
        <div className="login-grid">
          <input value={form.sender} onChange={(e) => setForm({ ...form, sender: e.target.value })} placeholder="Sender or recipient" />
          <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject" />
          <input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="Summary" />
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              if (!form.sender.trim() || !form.subject.trim()) return;
              addInboxThread(form);
              setForm({ sender: "", subject: "", summary: "", status: "Needs Reply" });
            }}
          >
            Save thread
          </button>
        </div>
      </Card>
    </div>
  );
}
