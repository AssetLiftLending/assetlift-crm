"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function GoogleWorkspaceConnectedContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    async function completeConnection() {
      const returnTo = searchParams.get("returnTo") || "/integrations";
      const response = await fetch("/api/google/workspace/pending", {
        method: "GET",
        credentials: "same-origin",
      });
      const data = await response.json().catch(() => ({ payload: null }));
      const payload = data?.payload;

      if (!payload?.googleConnected || !payload?.googleAccessToken) {
        window.location.replace(`${returnTo}?google_error=missing_oauth_payload`);
        return;
      }

      window.localStorage.setItem("assetlift-google-workspace-oauth", JSON.stringify(payload));
      window.location.replace(`${returnTo}?google=connected`);
    }

    void completeConnection();
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
