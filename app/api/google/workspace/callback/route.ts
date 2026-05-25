import { NextResponse } from "next/server";
import { GOOGLE_WORKSPACE_COOKIE } from "@/lib/google-workspace-client";

type GoogleTokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope?: string;
  id_token?: string;
};

type GoogleUserInfo = {
  email?: string;
};

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || "https://assetlift-crm.vercel.app/api/google/workspace/callback";
  let returnTo = "/integrations";

  if (state) {
    try {
      const parsed = JSON.parse(Buffer.from(state, "base64url").toString("utf8")) as {
        returnTo?: string;
      };
      if (parsed.returnTo?.startsWith("/") && !parsed.returnTo.startsWith("//")) {
        returnTo = parsed.returnTo;
      }
    } catch {
      // Ignore malformed state payloads and fall back to integrations.
    }
  }

  if (error) {
    return NextResponse.redirect(`${origin}${returnTo}?google_error=${encodeURIComponent(error)}`);
  }

  if (!code || !clientId || !clientSecret) {
    return NextResponse.redirect(`${origin}${returnTo}?google_error=missing_configuration`);
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    return NextResponse.redirect(`${origin}${returnTo}?google_error=token_exchange_failed`);
  }

  const tokens = (await tokenResponse.json()) as GoogleTokenResponse;

  const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
    },
  });

  const user = userResponse.ok ? ((await userResponse.json()) as GoogleUserInfo) : {};
  const appRedirect = new URL(returnTo, origin);
  appRedirect.searchParams.set("google", "connected");
  const response = NextResponse.redirect(appRedirect);
  response.cookies.set(
    GOOGLE_WORKSPACE_COOKIE,
    encodeURIComponent(
      JSON.stringify({
        googleConnected: true,
        googleEmail: user.email || "",
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token || "",
        googleTokenExpiry: Date.now() + tokens.expires_in * 1000,
        providerLabel: "Google Workspace",
        fromEmail: user.email || "",
        fromName: "AssetLift Lending",
        smtpHost: "smtp.gmail.com",
        smtpPort: "587",
        smtpSecure: false,
        smtpUser: user.email || "",
        imapHost: "imap.gmail.com",
        imapPort: "993",
        imapUser: user.email || "",
      })
    ),
    {
      path: "/",
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 5,
    }
  );

  return response;
}
