import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/utlis/apiCall";

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
    console.log(body, "coming from register page ==========");

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

    console.log(backendResponse, "==========backendResponse");

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
    
    console.log(response, "geting response form resgister side ===============");

    response.cookies.set("authToken", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch (error) {
    console.log(error, "comming form register side ");
    return NextResponse.json(error);
  }
}
