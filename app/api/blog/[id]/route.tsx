import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/utlis/apiCall";

async function readJson(response: Response) {
  return response.json().catch(() => ({}));
}

type SessionUser = { id: string; role: "user" | "admin" };

async function getSession() {
  const token = (await cookies()).get("authToken")?.value;
  if (!token) return null;

  const authResponse = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!authResponse.ok) return null;
  const data = await readJson(authResponse);
  return { token, user: data.user as SessionUser };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );

    const { id } = await params;
    const backendResponse = await fetch(
      `${API_URL}/blogs/${encodeURIComponent(id)}`,
      {
        headers: { Authorization: `Bearer ${session.token}` },
        cache: "no-store",
      },
    );
    const data = await readJson(backendResponse);

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || data.message || "Failed to fetch blog",
        },
        { status: backendResponse.status },
      );
    }
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Blog service is unavailable" },
      { status: 503 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    const { id } = await params;
    const blogCheck = await fetch(
      `${API_URL}/blogs/${encodeURIComponent(id)}`,
      {
        headers: { Authorization: `Bearer ${session.token}` },
        cache: "force-cache",
        next: {
          revalidate: 300
        },
      },
    );
    const blogData = await readJson(blogCheck);
    if (!blogCheck.ok) {
      return NextResponse.json(
        {
          success: false,
          error: blogData.error || blogData.message || "Blog not found",
        },
        { status: blogCheck.status },
      );
    }
    const isOwner = blogData.data?.author?._id === session.user.id;
    const isAdmin = session.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "You do not have permission to edit this blog",
        },
        { status: 403 },
      );
    }

    const body = await request.json();
    const backendResponse = await fetch(
      `${API_URL}/blogs/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(body),
      },
    );
    const data = await readJson(backendResponse);

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || data.message || "Failed to update blog",
        },
        { status: backendResponse.status },
      );
    }
    return NextResponse.json(data, { status: 200 });
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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    const { id } = await params;
    const blogCheck = await fetch(
      `${API_URL}/blogs/${encodeURIComponent(id)}`,
      {
        headers: { Authorization: `Bearer ${session.token}` },
        cache: "no-store",
      },
    );
    const blogData = await readJson(blogCheck);
    if (!blogCheck.ok) {
      return NextResponse.json(
        {
          success: false,
          error: blogData.error || blogData.message || "Blog not found",
        },
        { status: blogCheck.status },
      );
    }
    const isOwner = blogData.data?.author?._id === session.user.id;
    const isAdmin = session.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "You do not have permission to delete this blog",
        },
        { status: 403 },
      );
    }
    const backendResponse = await fetch(
      `${API_URL}/blogs/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.token}` },
      },
    );
    const data = await readJson(backendResponse);

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || data.message || "Failed to delete blog",
        },
        { status: backendResponse.status },
      );
    }
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Blog service is unavailable" },
      { status: 503 },
    );
  }
}
