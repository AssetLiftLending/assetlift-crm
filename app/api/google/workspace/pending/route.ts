import { NextResponse } from "next/server";
import {
  GOOGLE_WORKSPACE_COOKIE,
  parseGoogleWorkspaceCookie,
} from "@/lib/google-workspace-client";

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookieValue = cookieHeader
    .split("; ")
    .find((entry) => entry.startsWith(`${GOOGLE_WORKSPACE_COOKIE}=`))
    ?.split("=")
    .slice(1)
    .join("=");

  const payload = parseGoogleWorkspaceCookie(cookieValue);
  const response = NextResponse.json({ payload });
  response.cookies.set(GOOGLE_WORKSPACE_COOKIE, "", {
    path: "/",
    sameSite: "lax",
    secure: true,
    maxAge: 0,
  });
  return response;
}
