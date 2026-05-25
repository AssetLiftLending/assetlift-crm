import { NextResponse } from "next/server";

type RefreshTokenResponse = {
  access_token: string;
  expires_in: number;
  scope?: string;
  token_type: string;
};

export async function POST(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Google OAuth environment variables are missing." },
      { status: 503 }
    );
  }

  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json(
        { error: "A Google refresh token is required." },
        { status: 400 }
      );
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!tokenResponse.ok) {
      const payload = await tokenResponse.json().catch(() => ({}));
      return NextResponse.json(
        {
          error:
            payload?.error_description ||
            payload?.error ||
            "Google token refresh failed.",
        },
        { status: 502 }
      );
    }

    const refreshed = (await tokenResponse.json()) as RefreshTokenResponse;
    return NextResponse.json({
      accessToken: refreshed.access_token,
      tokenExpiry: Date.now() + refreshed.expires_in * 1000,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Google token refresh failed" },
      { status: 500 }
    );
  }
}
