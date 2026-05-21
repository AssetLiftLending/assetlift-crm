import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { settings, to, subject, text } = await request.json();

    if (!settings?.smtpHost || !settings?.smtpPort || !settings?.smtpUser || !settings?.smtpPass) {
      return NextResponse.json(
        { error: "Missing SMTP settings. Fill in host, port, username, and password." },
        { status: 400 }
      );
    }

    if (!to) {
      return NextResponse.json({ error: "A recipient email is required." }, { status: 400 });
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
