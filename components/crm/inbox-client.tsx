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
          eyebrow="Step 3"
          title="Inbox"
          description="Track only real conversations that need follow-up."
        />
        <div className="mini-list">
          {inboxThreads.length ? (
            inboxThreads.map((thread) => (
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
            ))
          ) : (
            <div className="empty-panel">
              <strong>No inbox threads yet</strong>
              <p>When a message matters to a deal, log it here and then schedule the next action.</p>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <SectionHeader
          eyebrow="Log thread"
          title="Add conversation"
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
