import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const secure = process.env.NODE_ENV === "production";
  const cookie = `satish_admin=deleted; Path=/; HttpOnly; Max-Age=0; SameSite=Lax${secure ? "; Secure" : ""}`;
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Set-Cookie": cookie },
  });
}
