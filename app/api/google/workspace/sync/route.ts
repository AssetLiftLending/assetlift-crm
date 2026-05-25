import { NextResponse } from "next/server";

type GmailListResponse = {
  messages?: Array<{ id: string; threadId: string }>;
};

type GmailMessageResponse = {
  id: string;
  internalDate?: string;
  snippet?: string;
  payload?: {
    headers?: Array<{ name: string; value: string }>;
  };
};

function headerValue(
  headers: Array<{ name: string; value: string }> | undefined,
  name: string
) {
  return headers?.find((header) => header.name.toLowerCase() === name.toLowerCase())?.value ?? "";
}

function relativeAge(timestamp?: string) {
  if (!timestamp) return "Unknown";
  const diff = Date.now() - Number(timestamp);
  const minutes = Math.max(1, Math.round(diff / 60000));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  return `${days}d`;
}

export async function POST(request: Request) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json({ error: "Google access token is required." }, { status: 400 });
    }

    const listResponse = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=15&labelIds=INBOX",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!listResponse.ok) {
      const payload = await listResponse.json().catch(() => ({}));
      const message = payload?.error?.message || "Gmail inbox sync failed.";
      return NextResponse.json(
        {
          error:
            message.toLowerCase().includes("insufficient")
              ? "Google Workspace inbox permission is missing. Reconnect Google Workspace and approve inbox access."
              : message,
        },
        { status: 502 }
      );
    }

    const listed = (await listResponse.json()) as GmailListResponse;
    const messages = await Promise.all(
      (listed.messages || []).slice(0, 10).map(async (message) => {
        const detailResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!detailResponse.ok) {
          return null;
        }

        const detail = (await detailResponse.json()) as GmailMessageResponse;
        const headers = detail.payload?.headers;
        return {
          id: detail.id,
          sender: headerValue(headers, "From") || "Unknown sender",
          subject: headerValue(headers, "Subject") || "(No subject)",
          summary: detail.snippet || "No preview available",
          snippet: detail.snippet || "",
          status: "Waiting" as const,
          age: relativeAge(detail.internalDate),
          direction: "inbound" as const,
          sentAt: headerValue(headers, "Date"),
        };
      })
    );

    return NextResponse.json({
      threads: messages.filter(Boolean),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gmail inbox sync failed" },
      { status: 500 }
    );
  }
}
