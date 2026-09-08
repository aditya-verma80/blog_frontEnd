import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/utlis/apiCall";

async function readJson(response: Response) {
  return response.json();
}

export async function GET() {
  const authToken = (await cookies()).get("authToken")?.value;

  if (!authToken) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const headers = { Authorization: `Bearer ${authToken}` };

    console.log(headers, "blog route lin no 23");
    const authResponse = await fetch(`${API_URL}/auth/me`, {
      headers,
      cache: "force-cache",
      next: {
        revalidate: 300,
      },
    });
    console.log(authResponse, "authResponse blog route lin no 31");
    if (!authResponse.ok) {
      const authData = await readJson(authResponse);
      const response = NextResponse.json(
        {
          success: false,
          error: authData.error || authData.message || "Unauthorized",
        },
        { status: authResponse.status === 403 ? 403 : 401 },
      );

      if (authResponse.status === 401) {
        response.cookies.set("authToken", "", {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          expires: new Date(0),
          path: "/",
        });
      }

      return response;
    }

    const blogResponse = await fetch(`${API_URL}/blogs`, {
      headers,
      cache: "no-store",
    });
    const blogData = await readJson(blogResponse);

    console.log(blogData, "blogData from blog router line no 61");

    if (!blogResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: blogData.error || blogData.message || "Failed to fetch blogs",
        },
        { status: blogResponse.status },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: blogData.message || "Blogs fetched successfully",
        data: blogData.data ?? [],
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Blog service is unavailable",
      },
      { status: 503 },
    );
  }
}

export async function POST(request: NextRequest) {
  const authToken = (await cookies()).get("authToken")?.value;
  if (!authToken) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const backendResponse = await fetch(`${API_URL}/blogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(body),
    });
    const data = await readJson(backendResponse);

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || data.message || "Failed to create blog",
        },
        { status: backendResponse.status },
      );
    }

    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof SyntaxError
            ? "Invalid request body"
            : "Blog service is unavailable",
      },
      { status: error instanceof SyntaxError ? 400 : 503 },
    );
  }
}
