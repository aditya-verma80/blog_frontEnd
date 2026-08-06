import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_BASE_URL || "http://localhost:5000/api";

type BackendRegisterResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  token?: string;
  user?: unknown;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendResponse = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: body.username,
        email: body.email,
        password: body.password,
        confirmPassword: body.confirmPassword,
        age: body.age,
        address: body.address,
      }),
    });

    const data: BackendRegisterResponse = await backendResponse
      .json()
      .catch(() => ({}));

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data.error || data.message || "Registration failed" },
        { status: backendResponse.status },
      );
    }

    if (!data.token || !data.user) {
      return NextResponse.json(
        { error: "Invalid registration response from auth server" },
        { status: 502 },
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        message: data.message || "User created successfully",
        user: data.user,
      },
      { status: 201 },
    );
    response.cookies.set("authToken", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch (error) {
    const invalidBody = error instanceof SyntaxError;
    return NextResponse.json(
      {
        error: invalidBody
          ? "Invalid request body"
          : "Authentication service is unavailable",
      },
      { status: invalidBody ? 400 : 503 },
    );
  }
}
