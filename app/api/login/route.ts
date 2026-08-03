import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Handle POST requests for user sign-in
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const body = await request.json();

    const backendResponse = await fetch(
      "http://localhost:5000/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const contentType = backendResponse.headers.get("content-type") || "";
    let data: any = {};

    if (contentType.includes("application/json")) {
      data = await backendResponse.json().catch(() => ({}));
    } else {
      const text = await backendResponse.text();
      data = { message: text || "Invalid credentials" };
    }

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data.message || "Invalid credentials" },
        { status: backendResponse.status },
      );
    }

    if (data.token) {
      cookieStore.set("auth", data.token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    return NextResponse.json(
      { success: true, user: data.user ?? null },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}
