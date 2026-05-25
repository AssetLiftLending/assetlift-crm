"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function GoogleWorkspaceConnectedContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    function completeConnection() {
      const payload = {
        googleConnected: searchParams.get("connected") === "true",
        googleEmail: searchParams.get("email") || "",
        googleAccessToken: searchParams.get("accessToken") || "",
        googleRefreshToken: searchParams.get("refreshToken") || "",
        googleTokenExpiry: Number(searchParams.get("tokenExpiry") || "0"),
        providerLabel: "Google Workspace",
        fromEmail: searchParams.get("email") || "",
        fromName: "AssetLift Lending",
        smtpHost: "smtp.gmail.com",
        smtpPort: "587",
        smtpSecure: false,
        smtpUser: searchParams.get("email") || "",
        imapHost: "imap.gmail.com",
        imapPort: "993",
        imapUser: searchParams.get("email") || "",
      };

      if (!payload.googleConnected || !payload.googleAccessToken) {
        window.location.replace("/integrations?google_error=missing_oauth_payload");
        return;
      }

      window.localStorage.setItem("assetlift-google-workspace-oauth", JSON.stringify(payload));
      window.location.replace("/integrations?google=connected");
    }

    completeConnection();
  }, [searchParams]);

  return <div style={{ padding: 24 }}>Completing Google Workspace connection...</div>;
}

export default function GoogleWorkspaceConnectedPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Completing Google Workspace connection...</div>}>
      <GoogleWorkspaceConnectedContent />
    </Suspense>
  );
}
