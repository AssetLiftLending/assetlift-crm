"use client";

import { useState } from "react";
import { RefreshCw, Send } from "lucide-react";
import { useCrm } from "@/components/crm/crm-provider";
import { Badge, Card, SectionHeader } from "@/components/ui/primitives";

export function InboxClient() {
  const { addInboxThread, emailSettings, inboxThreads, replaceInboxThreads, saveEmailSettings } = useCrm();
  const [form, setForm] = useState({
    to: "",
    subject: "",
    text: "",
  });
  const [syncing, setSyncing] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState("");

  async function refreshGoogleToken() {
    if (
      !emailSettings.googleConnected ||
      !emailSettings.googleRefreshToken ||
      !emailSettings.googleTokenExpiry ||
      emailSettings.googleTokenExpiry > Date.now() + 60_000
    ) {
      return emailSettings;
    }

    const response = await fetch("/api/google/workspace/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: emailSettings.googleRefreshToken }),
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || "Google token refresh failed");
    }

    const nextSettings = {
      ...emailSettings,
      googleAccessToken: payload.accessToken,
      googleTokenExpiry: payload.tokenExpiry,
    };
    saveEmailSettings(nextSettings);
    return nextSettings;
  }

  async function syncInbox() {
    setSyncing(true);
    setResult("");
    try {
      const latestSettings = await refreshGoogleToken();
      if (!latestSettings.googleAccessToken) {
        throw new Error("Connect Google Workspace first.");
      }

      const response = await fetch("/api/google/workspace/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: latestSettings.googleAccessToken }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Inbox sync failed");
      }

      replaceInboxThreads(payload.threads || []);
      setResult(`Synced ${payload.threads?.length || 0} inbox threads`);
    } catch (error) {
      setResult(error instanceof Error ? error.message : "Inbox sync failed");
    } finally {
      setSyncing(false);
    }
  }

  async function sendEmail() {
    setSending(true);
    setResult("");
    try {
      const latestSettings = await refreshGoogleToken();
      if (!latestSettings.googleAccessToken) {
        throw new Error("Connect Google Workspace first.");
      }

      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: latestSettings,
          to: form.to,
          subject: form.subject,
          text: form.text,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Email send failed");
      }

      addInboxThread({
        sender: form.to,
        subject: form.subject,
        summary: form.text.slice(0, 160) || "Sent message",
        snippet: form.text.slice(0, 160),
        status: "Waiting",
        direction: "outbound",
        sentAt: new Date().toISOString(),
      });
      setForm({ to: "", subject: "", text: "" });
      setResult("Email sent");
    } catch (error) {
      setResult(error instanceof Error ? error.message : "Email send failed");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="section-grid two">
      <Card>
        <SectionHeader
          eyebrow="Step 3"
          title="Inbox"
          description="Sync Gmail threads and keep active deal conversations visible."
        />
        <div className="pill-row" style={{ marginBottom: 18 }}>
          <button
            type="button"
            className="secondary-button"
            onClick={syncInbox}
            disabled={syncing || !emailSettings.googleConnected}
          >
            <RefreshCw size={16} />
            {syncing ? "Syncing..." : "Sync Gmail inbox"}
          </button>
        </div>
        <div className="mini-list">
          {inboxThreads.length ? (
            inboxThreads.map((thread) => (
              <div key={thread.id} className="mini-row">
                <div>
                  <strong>{thread.direction === "outbound" ? `To: ${thread.sender}` : thread.sender}</strong>
                  <p>{thread.subject}</p>
                  <p>{thread.snippet || thread.summary}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Badge>{thread.direction === "outbound" ? "Sent" : thread.status}</Badge>
                  <p>{thread.age}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-panel">
              <strong>No synced messages yet</strong>
              <p>Connect Google Workspace, then sync the inbox to bring real messages into the CRM. If sync says permission is missing, reconnect Google Workspace once.</p>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <SectionHeader
          eyebrow="Compose"
          title="Send email"
          description={`From: ${emailSettings.fromEmail || emailSettings.googleEmail || "not connected"}`}
        />
        <div className="login-grid">
          <input
            value={form.to}
            onChange={(event) => setForm((current) => ({ ...current, to: event.target.value }))}
            placeholder="Recipient email"
          />
          <input
            value={form.subject}
            onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
            placeholder="Subject"
          />
          <textarea
            className="crm-textarea"
            value={form.text}
            onChange={(event) => setForm((current) => ({ ...current, text: event.target.value }))}
            placeholder="Write your message"
            rows={8}
          />
          <button
            type="button"
            className="primary-button"
            onClick={sendEmail}
            disabled={sending || !emailSettings.googleConnected}
          >
            <Send size={16} />
            {sending ? "Sending..." : "Send email"}
          </button>
          {result ? <p>{result}</p> : null}
        </div>
      </Card>
    </div>
  );
}
