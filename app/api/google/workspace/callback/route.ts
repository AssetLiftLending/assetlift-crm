import { NextResponse } from "next/server";

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
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || "https://assetlift-crm.vercel.app/api/google/workspace/callback";

  if (error) {
    return NextResponse.redirect(`${origin}/integrations?google_error=${encodeURIComponent(error)}`);
  }

  if (!code || !clientId || !clientSecret) {
    return NextResponse.redirect(`${origin}/integrations?google_error=missing_configuration`);
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
    return NextResponse.redirect(`${origin}/integrations?google_error=token_exchange_failed`);
  }

  const tokens = (await tokenResponse.json()) as GoogleTokenResponse;

  const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
    },
  });

  const user = userResponse.ok ? ((await userResponse.json()) as GoogleUserInfo) : {};
  const appRedirect = new URL("/integrations", origin);
  appRedirect.searchParams.set("connected", "true");
  appRedirect.searchParams.set("google", "connected");
  appRedirect.searchParams.set("email", user.email || "");
  appRedirect.searchParams.set("accessToken", tokens.access_token);
  appRedirect.searchParams.set("refreshToken", tokens.refresh_token || "");
  appRedirect.searchParams.set(
    "tokenExpiry",
    String(Date.now() + tokens.expires_in * 1000)
  );

  return NextResponse.redirect(appRedirect);
}
