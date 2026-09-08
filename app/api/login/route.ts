import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/utlis/apiCall";

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

    console.log(backendResponse, "backendResponse login side");

    const contentType = backendResponse.headers.get("content-type") || "";
    console.log(contentType, "contentType getting contentType");
    let data: {
      token?: string;
      user?: unknown;
      message?: string;
      error?: string;
    } = {};

    console.log(data, "----------login data");

    if (contentType.includes("application/json")) {
      data = await backendResponse.json().catch(() => ({}));
    } else {
      const text = await backendResponse.text();
      data = { message: text || "Invalid credentials" };
    }

    if (!backendResponse.ok) {
      const errorMessage =
        data.error || data.message || "Enter the correct email & password";
      return NextResponse.json(
        { error: errorMessage },
        { status: backendResponse.status },
      );
    }

    if (!data.token) {
      return NextResponse.json(
        { error: "Invalid login response from auth server" },
        { status: 502 },
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        message: data.message || "Login successful",
        user: data.user ?? null,
      },
      { status: 200 },
    );
    console.log(response, "----------login response");
    response.cookies.set("authToken", data.token, {
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
