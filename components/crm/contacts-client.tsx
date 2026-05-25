"use client";

import { useMemo, useState } from "react";
import { useCrm } from "@/components/crm/crm-provider";
import { Badge, Card, SectionHeader } from "@/components/ui/primitives";

export function ContactsClient() {
  const { addContact, contacts } = useCrm();
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    stage: "New Lead",
    score: 75,
    source: "Manual",
    owner: "YL",
    nextStep: "",
  });

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase();
    return contacts.filter((contact) =>
      [contact.name, contact.company, contact.email, contact.stage, contact.owner]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [contacts, query]);

  return (
    <div className="section-grid two">
      <Card>
        <SectionHeader
          eyebrow="Step 1"
          title="Contacts"
          description="Add a real contact first. Keep the next step short and clear."
        />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search contact, company, stage, or owner"
          style={{ width: "100%", marginBottom: 18 }}
        />
        <div className="timeline-list">
          {filtered.length ? (
            filtered.map((contact) => (
              <div key={contact.id} className="timeline-row">
                <div>
                  <strong>{contact.name}</strong>
                  <p>{contact.company} - {contact.email}</p>
                  <p>{contact.stage} - Next: {contact.nextStep || "Not set"}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Badge>Score {contact.score}</Badge>
                  <p>{contact.owner} - {contact.lastTouch}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-panel">
              <strong>No contacts yet</strong>
              <p>Add your first real contact on the right. Do not create a deal until the lead is qualified.</p>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <SectionHeader
          eyebrow="Add record"
          title="Create contact"
          description="Only the basics. You can add more detail later."
        />
        <div className="login-grid">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Contact name" />
          <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company" />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
          <input value={form.nextStep} onChange={(e) => setForm({ ...form, nextStep: e.target.value })} placeholder="Next step" />
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              if (!form.name.trim()) return;
              addContact(form);
              setForm({
                name: "",
                company: "",
                email: "",
                phone: "",
                stage: "New Lead",
                score: 75,
                source: "Manual",
                owner: "YL",
                nextStep: "",
              });
            }}
          >
            Add contact
          </button>
        </div>
      </Card>
    </div>
  );
}
