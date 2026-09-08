import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  response.cookies.set("authToken", "", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    expires: new Date(0),
    maxAge: 0,
    path: "/",
  });
  return response;
}
