import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { mapGoogleWorkspaceError } from "@/lib/google-workspace-errors";

export async function POST(request: Request) {
  try {
    const { settings, to, subject, text } = await request.json();

    if (!to) {
      return NextResponse.json({ error: "A recipient email is required." }, { status: 400 });
    }

    if (settings?.googleConnected && settings?.googleAccessToken && settings?.fromEmail) {
      const mime = [
        `From: ${settings.fromName || settings.fromEmail} <${settings.fromEmail}>`,
        `To: ${to}`,
        `Subject: ${subject || "AssetLift CRM test email"}`,
        "Content-Type: text/plain; charset=utf-8",
        "",
        text || "AssetLift CRM test email",
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
          {
            error: mapGoogleWorkspaceError(
              payload?.error?.message ||
                "Google Workspace send failed. Reconnect the mailbox and try again.",
              "send"
            ),
          },
          { status: 502 }
        );
      }

      return NextResponse.json({ ok: true });
    }

    if (!settings?.smtpHost || !settings?.smtpPort || !settings?.smtpUser || !settings?.smtpPass) {
      return NextResponse.json(
        { error: "Mailbox not connected. Use Google Workspace connect or fill in a valid SMTP configuration." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: settings.smtpHost,
      port: Number(settings.smtpPort),
      secure: Boolean(settings.smtpSecure),
      auth: {
        user: settings.smtpUser,
        pass: settings.smtpPass,
      },
    });

    await transporter.sendMail({
      from: settings.fromEmail || settings.smtpUser,
      to,
      subject: subject || "AssetLift CRM test email",
      text: text || "AssetLift CRM test email",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Email send failed" },
      { status: 500 }
    );
  }
}
