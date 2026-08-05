import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_BASE_URL || "http://localhost:5000/api";

// Handle POST requests for user sign-in
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendResponse = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const contentType = backendResponse.headers.get("content-type") || "";
    let data: { token?: string; user?: unknown; message?: string } = {};

    if (contentType.includes("application/json")) {
      data = await backendResponse.json().catch(() => ({}));
    } else {
      const text = await backendResponse.text();
      data = { message: text || "Invalid credentials" };
    }

    if (!data.token) {
      return NextResponse.json(
        { error: "token is not getting" },
        { status: 502 },
      );
    }

    const response = NextResponse.json(
      { success: true, user: data.user ?? null },
      { status: 200 },
    );
    response.cookies.set("auth", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}
