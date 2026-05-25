"use client";

import { useEffect, useState } from "react";
import { useCrm } from "@/components/crm/crm-provider";
import { Badge, Card, SectionHeader } from "@/components/ui/primitives";
import {
  buildConnectedGoogleSettings,
  createDisconnectedEmailSettings,
  GOOGLE_OAUTH_QUERY_KEYS,
} from "@/lib/google-workspace-client";

export function IntegrationsClient() {
  const { emailSettings, integrations, saveEmailSettings, updateIntegrationStatus } = useCrm();
  const [settings, setSettings] = useState(emailSettings);
  const [testTo, setTestTo] = useState("");
  const [result, setResult] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setSettings(emailSettings);
  }, [emailSettings]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextSettings = buildConnectedGoogleSettings({ ...emailSettings, ...settings }, params);

    if (nextSettings) {
      setSettings(nextSettings);
      saveEmailSettings(nextSettings);
      setResult(nextSettings.googleEmail ? `Connected as ${nextSettings.googleEmail}` : "Google Workspace connected");

      const cleanUrl = new URL(window.location.href);
      GOOGLE_OAUTH_QUERY_KEYS.forEach((key) => cleanUrl.searchParams.delete(key));
      window.history.replaceState({}, "", cleanUrl.toString());
      return;
    }

    const raw = window.localStorage.getItem("assetlift-google-workspace-oauth");
    if (!raw) return;

    try {
      const payload = JSON.parse(raw);
      const nextSettings = { ...settings, ...payload };
      setSettings(nextSettings);
      saveEmailSettings(nextSettings);
      window.localStorage.removeItem("assetlift-google-workspace-oauth");
      setResult(payload.googleEmail ? `Connected as ${payload.googleEmail}` : "Google Workspace connected");
    } catch {
      // Ignore malformed local payloads.
    }
  }, [emailSettings, saveEmailSettings, settings]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("google");
    const error = params.get("google_error");
    if (connected === "connected" && settings.googleConnected) {
      setResult(settings.googleEmail ? `Connected as ${settings.googleEmail}` : "Google Workspace connected");
      return;
    }

    if (error) {
      setResult(
        error === "token_exchange_failed"
          ? "Google sign-in completed, but token exchange failed."
          : `Google connection failed: ${error}`
      );
    }
  }, [settings.googleConnected, settings.googleEmail]);

  async function getFreshGoogleSettings() {
    if (
      !settings.googleConnected ||
      !settings.googleRefreshToken ||
      !settings.googleTokenExpiry ||
      settings.googleTokenExpiry > Date.now() + 60_000
    ) {
      return settings;
    }

    const response = await fetch("/api/google/workspace/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: settings.googleRefreshToken }),
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || "Google token refresh failed");
    }

    const nextSettings = {
      ...settings,
      googleAccessToken: payload.accessToken,
      googleTokenExpiry: payload.tokenExpiry,
    };
    setSettings(nextSettings);
    saveEmailSettings(nextSettings);
    return nextSettings;
  }

  async function sendTestEmail() {
    setSending(true);
    setResult("");
    try {
      const latestSettings = await getFreshGoogleSettings();
      const response = await fetch("/api/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: latestSettings,
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

  function clearGoogleState(message: string) {
    const nextSettings = createDisconnectedEmailSettings(settings.fromName);
    setSettings(nextSettings);
    saveEmailSettings(nextSettings);
    window.localStorage.removeItem("assetlift-google-workspace-oauth");
    setResult(message);

    const cleanUrl = new URL(window.location.href);
    GOOGLE_OAUTH_QUERY_KEYS.forEach((key) => cleanUrl.searchParams.delete(key));
    window.history.replaceState({}, "", cleanUrl.toString());
  }

  function reconnectGoogleWorkspace() {
    clearGoogleState("Mailbox state cleared. Starting a fresh Google Workspace sign-in.");
    window.location.href = "/api/google/workspace/start";
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
          description="Google Workspace now needs OAuth. Use the connect button below, then test send from the connected mailbox."
        />
        <div className="login-grid">
          <div className="empty-panel">
            <strong>
              {settings.googleConnected
                ? `Connected to Google Workspace as ${settings.googleEmail || "your mailbox"}`
                : "Google Workspace not connected"}
            </strong>
            <p>
              Password-based Gmail setup is no longer the right default for Workspace. Connect the mailbox through Google sign-in instead.
            </p>
            {settings.googleConnected ? (
              <p>
                From email: <strong>{settings.fromEmail || settings.googleEmail}</strong>
              </p>
            ) : null}
            <div className="pill-row">
              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  if (settings.googleConnected) {
                    reconnectGoogleWorkspace();
                    return;
                  }
                  window.location.href = "/api/google/workspace/start?returnTo=/integrations";
                }}
              >
                {settings.googleConnected ? "Reconnect Google Workspace" : "Connect Google Workspace"}
              </button>
              {settings.googleConnected ? (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => clearGoogleState("Google Workspace disconnected in this browser.")}
                >
                  Disconnect mailbox
                </button>
              ) : null}
              <button
                type="button"
                className="secondary-button"
                onClick={() => clearGoogleState("Mailbox state reset in this browser.")}
              >
                Reset mailbox state
              </button>
            </div>
          </div>

          <input value={settings.providerLabel} onChange={(e) => setSettings({ ...settings, providerLabel: e.target.value })} placeholder="Provider label" />
          <input value={settings.fromName} onChange={(e) => setSettings({ ...settings, fromName: e.target.value })} placeholder="From name" />
          <input value={settings.fromEmail} onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })} placeholder="From email" />
          {!settings.googleConnected ? (
            <>
              <input value={settings.smtpHost} onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })} placeholder="SMTP host" />
              <input value={settings.smtpPort} onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })} placeholder="SMTP port" />
              <input value={settings.smtpUser} onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })} placeholder="SMTP username" />
              <input value={settings.smtpPass} onChange={(e) => setSettings({ ...settings, smtpPass: e.target.value })} placeholder="SMTP password or app password" />
              <input value={settings.imapHost} onChange={(e) => setSettings({ ...settings, imapHost: e.target.value })} placeholder="IMAP host" />
              <input value={settings.imapPort} onChange={(e) => setSettings({ ...settings, imapPort: e.target.value })} placeholder="IMAP port" />
              <input value={settings.imapUser} onChange={(e) => setSettings({ ...settings, imapUser: e.target.value })} placeholder="IMAP username" />
              <input value={settings.imapPass} onChange={(e) => setSettings({ ...settings, imapPass: e.target.value })} placeholder="IMAP password or app password" />
            </>
          ) : null}
          <button type="button" className="primary-button" onClick={() => saveEmailSettings(settings)}>
            Save email settings
          </button>
          <input value={testTo} onChange={(e) => setTestTo(e.target.value)} placeholder="Send test email to" />
          <button type="button" className="secondary-button" onClick={sendTestEmail} disabled={sending || !settings.googleConnected}>
            {sending ? "Sending..." : "Send test email"}
          </button>
          {result ? <p><strong>Status:</strong> {result}</p> : null}
        </div>
      </Card>
    </div>
  );
}
