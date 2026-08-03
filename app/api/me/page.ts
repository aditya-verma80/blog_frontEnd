import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const authToken = cookieStore.get("auth")?.value;

        console.log("Auth Token:", authToken);

        if (!authToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const res = await fetch("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${authToken}` },
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            return NextResponse.json(
                { error: data.message || "Failed to fetch user data" },
                { status: res.status }
            );
        }

        return NextResponse.json({ success: true, user: data.user ?? null });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
