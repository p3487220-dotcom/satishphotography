import { NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/auth";
import db from "@/lib/db";

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
  if (!res.ok) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const result = await db.query("SELECT * FROM bookings ORDER BY created_at DESC");
    return Response.json({ success: true, bookings: result.rows });
  } catch (err) {
    console.error("[Admin Bookings]", err);
    return Response.json({ success: false, error: "Internal" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie");
  const cookies = parseCookie(cookieHeader);
  const token = cookies["satish_admin"] || null;
  const res = verifyAdminToken(token);
  if (!res.ok) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return Response.json({ success: false, error: "Missing id" }, { status: 400 });
    await db.query("DELETE FROM bookings WHERE id = $1", [id]);
    return Response.json({ success: true });
  } catch (err) {
    console.error("[Admin Bookings DELETE]", err);
    return Response.json({ success: false, error: "Internal" }, { status: 500 });
  }
}
