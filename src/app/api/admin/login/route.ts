import { NextRequest } from "next/server";
import { createAdminToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body || {};

    const ADMIN_USER = process.env.ADMIN_USER;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_USER || !ADMIN_PASSWORD) {
      return Response.json({ success: false, error: "Admin not configured" }, { status: 500 });
    }

    if (username !== ADMIN_USER || password !== ADMIN_PASSWORD) {
      return Response.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    const token = createAdminToken(username);

    const secure = process.env.NODE_ENV === "production";
    const cookie = `satish_admin=${token}; Path=/; HttpOnly; Max-Age=3600; SameSite=Lax${secure ? "; Secure" : ""}`;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookie,
      },
    });
  } catch (err) {
    console.error("[Admin Login]", err);
    return Response.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
