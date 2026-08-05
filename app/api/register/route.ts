import { NextRequest, NextResponse } from "next/server";

// const API_URL = process.env.API_BASE_URL || "http://localhost:5000/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const user = {
      username: body.username,
      email: body.email,
      password: body.password,
      age: body.age,
      address: body.address,
      role: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const backendResponse = await fetch("http://localhost:4000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await backendResponse.json();

    return NextResponse.json(
      {
        success: true,
        user: data,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Registration failed",
      },
      {
        status: 500,
      },
    );
  }
}
