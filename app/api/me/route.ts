import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_URL } from "@/utlis/apiCall";

export async function GET() {
  const authToken = (await cookies()).get("authToken")?.value;
  if (!authToken)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const backendResponse = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
      cache: "no-store",
    });
    const data = await backendResponse.json().catch(() => ({}));
    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data.error || data.message || "Unable to load the user" },
        { status: backendResponse.status },
      );
    }
    return NextResponse.json({ success: true, user: data.user ?? data });
  } catch {
    return NextResponse.json(
      { error: "Authentication service is unavailable" },
      { status: 503 },
    );
  }
}
