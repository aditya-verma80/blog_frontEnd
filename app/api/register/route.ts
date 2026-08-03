import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_BASE_URL || "http://localhost:5000/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendResponse = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await backendResponse.json().catch(() => ({}));
    if (!backendResponse.ok) {
      return NextResponse.json({ error: data.message || "Registration failed" }, { status: backendResponse.status });
    }
    if (!data.token) return NextResponse.json({ error: "Registration succeeded without a session token" }, { status: 502 });

    const response = NextResponse.json({ success: true, user: data.user ?? null }, { status: 201 });
    response.cookies.set("auth", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
