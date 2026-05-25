export function mapGoogleWorkspaceError(message: string, action: "send" | "sync") {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("access not configured") ||
    normalized.includes("api has not been used") ||
    normalized.includes("gmail api has not been used")
  ) {
    return "Gmail API is not enabled in Google Cloud for this project yet.";
  }

  if (
    normalized.includes("insufficient authentication scopes") ||
    normalized.includes("insufficientpermissions") ||
    normalized.includes("insufficient permission")
  ) {
    return action === "sync"
      ? "Inbox permission is missing. Reconnect Google Workspace and approve inbox access."
      : "Mailbox permission is missing. Reconnect Google Workspace and approve Gmail access.";
  }

  if (
    normalized.includes("invalid credentials") ||
    normalized.includes("login required") ||
    normalized.includes("unauthenticated")
  ) {
    return "Google Workspace session expired. Reconnect Google Workspace and try again.";
  }

  return message;
}
