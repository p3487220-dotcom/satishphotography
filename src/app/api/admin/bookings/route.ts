// src/app/api/admin/bookings/route.ts
// Admin-only bookings CRUD — uses Supabase Auth session + service_role for full access
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createUserClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    // Verify the user is authenticated with Supabase Auth
    const supabase = await createUserClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Use service_role client to bypass RLS for admin reads
    const adminDb = createAdminClient();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();
    const statusFilter = searchParams.get("status")?.trim();

    let query = adminDb
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    // Filter by status if provided
    if (statusFilter && ["pending", "confirmed", "completed", "cancelled"].includes(statusFilter)) {
      query = query.eq("status", statusFilter);
    }

    // Search by name, email, phone, or location
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,location.ilike.%${search}%`
      );
    }

    const { data: bookings, error: dbError } = await query;

    if (dbError) {
      console.error("[Admin Bookings] Supabase error:", dbError);
      return NextResponse.json({ success: false, error: "Failed to fetch bookings" }, { status: 500 });
    }

    return NextResponse.json({ success: true, bookings: bookings || [] });
  } catch (err) {
    console.error("[Admin Bookings] Unexpected error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createUserClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing booking id" }, { status: 400 });
    }

    // Only allow updating specific fields
    const allowedFields: Record<string, true> = {
      status: true,
      event_date: true,
      event_time: true,
      location: true,
      message: true,
    };

    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields[key]) {
        sanitized[key] = value;
      }
    }

    if (Object.keys(sanitized).length === 0) {
      return NextResponse.json({ success: false, error: "No valid fields to update" }, { status: 400 });
    }

    const adminDb = createAdminClient();
    const { error: dbError } = await adminDb
      .from("bookings")
      .update(sanitized)
      .eq("id", id);

    if (dbError) {
      console.error("[Admin Bookings PATCH] Error:", dbError);
      return NextResponse.json({ success: false, error: "Failed to update booking" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Admin Bookings PATCH] Unexpected error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createUserClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
    }

    const adminDb = createAdminClient();
    const { error: dbError } = await adminDb
      .from("bookings")
      .delete()
      .eq("id", id);

    if (dbError) {
      console.error("[Admin Bookings DELETE] Error:", dbError);
      return NextResponse.json({ success: false, error: "Failed to delete booking" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Admin Bookings DELETE] Unexpected error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
