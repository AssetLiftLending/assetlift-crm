"use client";

import { useState } from "react";
import { useCrm } from "@/components/crm/crm-provider";
import { Badge, Card, SectionHeader } from "@/components/ui/primitives";

export function IntegrationsClient() {
  const { emailSettings, integrations, saveEmailSettings, updateIntegrationStatus } = useCrm();
  const [settings, setSettings] = useState(emailSettings);
  const [testTo, setTestTo] = useState("");
  const [result, setResult] = useState("");
  const [sending, setSending] = useState(false);

  async function sendTestEmail() {
    setSending(true);
    setResult("");
    try {
      const response = await fetch("/api/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings,
          to: testTo,
          subject: "AssetLift CRM email integration test",
          text: "Your new AssetLift CRM is connected and able to send email.",
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Email test failed");
      }
      setResult(`Test email sent to ${testTo}`);
    } catch (error) {
      setResult(error instanceof Error ? error.message : "Email test failed");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="section-grid two">
      <Card>
        <SectionHeader
          eyebrow="Integration roadmap"
          title="Connected systems"
          description="Status controls now persist, and the email connection form below is live."
        />
        <div className="mini-list">
          {integrations.map((integration) => (
            <div key={integration.id} className="mini-row">
              <div>
                <strong>{integration.name}</strong>
                <p>{integration.purpose}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <Badge>{integration.status}</Badge>
                <div className="pill-row" style={{ justifyContent: "flex-end" }}>
                  {(["Connected", "Planned", "Needs Setup"] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      className="secondary-button"
                      onClick={() => updateIntegrationStatus(integration.id, status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeader
          eyebrow="Email integration"
          title="Connect your mailbox"
          description="Enter SMTP and IMAP details here. Test send works once you provide valid provider credentials."
        />
        <div className="login-grid">
          <input value={settings.providerLabel} onChange={(e) => setSettings({ ...settings, providerLabel: e.target.value })} placeholder="Provider label" />
          <input value={settings.fromName} onChange={(e) => setSettings({ ...settings, fromName: e.target.value })} placeholder="From name" />
          <input value={settings.fromEmail} onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })} placeholder="From email" />
          <input value={settings.smtpHost} onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })} placeholder="SMTP host" />
          <input value={settings.smtpPort} onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })} placeholder="SMTP port" />
          <input value={settings.smtpUser} onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })} placeholder="SMTP username" />
          <input value={settings.smtpPass} onChange={(e) => setSettings({ ...settings, smtpPass: e.target.value })} placeholder="SMTP password or app password" />
          <input value={settings.imapHost} onChange={(e) => setSettings({ ...settings, imapHost: e.target.value })} placeholder="IMAP host" />
          <input value={settings.imapPort} onChange={(e) => setSettings({ ...settings, imapPort: e.target.value })} placeholder="IMAP port" />
          <input value={settings.imapUser} onChange={(e) => setSettings({ ...settings, imapUser: e.target.value })} placeholder="IMAP username" />
          <input value={settings.imapPass} onChange={(e) => setSettings({ ...settings, imapPass: e.target.value })} placeholder="IMAP password or app password" />
          <button type="button" className="primary-button" onClick={() => saveEmailSettings(settings)}>
            Save email settings
          </button>
          <input value={testTo} onChange={(e) => setTestTo(e.target.value)} placeholder="Send test email to" />
          <button type="button" className="secondary-button" onClick={sendTestEmail} disabled={sending}>
            {sending ? "Sending..." : "Send test email"}
          </button>
          {result ? <p>{result}</p> : null}
        </div>
      </Card>
    </div>
  );
}
