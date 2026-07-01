import { NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/auth";

function parseCookie(cookieHeader: string | null) {
  const obj: Record<string, string> = {};
  if (!cookieHeader) return obj;
  const parts = cookieHeader.split(";").map((s) => s.trim());
  for (const part of parts) {
    const [k, ...v] = part.split("=");
    obj[k] = v.join("=");
  }
  return obj;
}

export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie");
  const cookies = parseCookie(cookieHeader);
  const token = cookies["satish_admin"] || null;
  const res = verifyAdminToken(token);
  if (!res.ok) return Response.json({ authenticated: false }, { status: 401 });
  return Response.json({ authenticated: true, user: res.username });
}
