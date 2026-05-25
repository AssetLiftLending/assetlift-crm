import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { settings, to, subject, text } = await request.json();

    if (!to || !subject || !text) {
      return NextResponse.json(
        { error: "Recipient, subject, and message body are required." },
        { status: 400 }
      );
    }

    if (!settings?.googleConnected || !settings?.googleAccessToken || !settings?.fromEmail) {
      return NextResponse.json(
        { error: "Google Workspace is not connected." },
        { status: 400 }
      );
    }

    const mime = [
      `From: ${settings.fromName || settings.fromEmail} <${settings.fromEmail}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      "Content-Type: text/plain; charset=utf-8",
      "",
      text,
    ].join("\r\n");

    const raw = Buffer.from(mime)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const gmailResponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${settings.googleAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw }),
    });

    if (!gmailResponse.ok) {
      const payload = await gmailResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: payload?.error?.message || "Google Workspace send failed." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Email send failed" },
      { status: 500 }
    );
  }
}
