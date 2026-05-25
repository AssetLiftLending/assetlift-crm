"use client";

import { useEffect } from "react";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function GoogleWorkspaceConnectedPage({ searchParams }: PageProps) {
  useEffect(() => {
    async function completeConnection() {
      const params = await searchParams;
      const getValue = (key: string) => {
        const value = params[key];
        return Array.isArray(value) ? value[0] || "" : value || "";
      };

      const payload = {
        googleConnected: getValue("connected") === "true",
        googleEmail: getValue("email"),
        googleAccessToken: getValue("accessToken"),
        googleRefreshToken: getValue("refreshToken"),
        googleTokenExpiry: Number(getValue("tokenExpiry") || "0"),
        providerLabel: "Google Workspace",
        smtpHost: "smtp.gmail.com",
        smtpPort: "587",
        smtpSecure: false,
        smtpUser: getValue("email"),
        imapHost: "imap.gmail.com",
        imapPort: "993",
        imapUser: getValue("email"),
      };

      window.localStorage.setItem("assetlift-google-workspace-oauth", JSON.stringify(payload));
      window.location.replace("/integrations?google=connected");
    }

    completeConnection();
  }, [searchParams]);

  return <div style={{ padding: 24 }}>Completing Google Workspace connection...</div>;
}
