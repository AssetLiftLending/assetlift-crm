import type { EmailIntegrationSettings } from "@/lib/mock-data";

export const GOOGLE_WORKSPACE_COOKIE = "assetlift_google_workspace_oauth";
export const GOOGLE_OAUTH_QUERY_KEYS = [
  "connected",
  "google",
  "email",
  "accessToken",
  "refreshToken",
  "tokenExpiry",
  "google_error",
] as const;

export function createDisconnectedEmailSettings(fromName: string): EmailIntegrationSettings {
  return {
    providerLabel: "Google Workspace",
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpSecure: false,
    smtpUser: "",
    smtpPass: "",
    fromEmail: "",
    fromName: fromName || "AssetLift Lending",
    imapHost: "imap.gmail.com",
    imapPort: "993",
    imapUser: "",
    imapPass: "",
    googleConnected: false,
    googleEmail: "",
    googleAccessToken: "",
    googleRefreshToken: "",
    googleTokenExpiry: 0,
  };
}

export function buildConnectedGoogleSettings(
  current: EmailIntegrationSettings,
  params: URLSearchParams
): EmailIntegrationSettings | null {
  const accessToken = params.get("accessToken");
  const connected = params.get("connected");
  const email = params.get("email") || "";

  if (connected !== "true" || !accessToken) {
    return null;
  }

  return {
    ...current,
    googleConnected: true,
    googleEmail: email,
    googleAccessToken: accessToken,
    googleRefreshToken: params.get("refreshToken") || "",
    googleTokenExpiry: Number(params.get("tokenExpiry") || "0"),
    providerLabel: "Google Workspace",
    fromEmail: email,
    fromName: current.fromName || "AssetLift Lending",
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpSecure: false,
    smtpUser: email,
    imapHost: "imap.gmail.com",
    imapPort: "993",
    imapUser: email,
  };
}

export function parseGoogleWorkspaceCookie(cookieValue: string | undefined | null) {
  if (!cookieValue) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(cookieValue)) as Partial<EmailIntegrationSettings>;
  } catch {
    return null;
  }
}
