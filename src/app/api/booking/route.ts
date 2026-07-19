// src/app/api/booking/route.ts
// Public booking endpoint — inserts via anon key (RLS allows INSERT for anon)
// Sends notification via EmailJS after successful insert
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import EmailJS from "@emailjs/nodejs";

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || "";
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || "";
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || "";
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export interface BookingInput {
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string;
  event_time: string;
  location: string;
  message?: string;
}

function validate(data: Partial<BookingInput>): string | null {
  if (!data.name || data.name.trim().length < 2) return "Please enter a valid name.";
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    return "Please enter a valid email address.";
  if (!data.phone || data.phone.replace(/\D/g, "").length < 10)
    return "Please enter a valid phone number (at least 10 digits).";
  if (!data.event_type) return "Please select an event type.";
  if (!data.event_date || isNaN(new Date(data.event_date).getTime()))
    return "Please select a valid event date.";
  if (new Date(data.event_date) < new Date(new Date().toDateString()))
    return "Event date cannot be in the past.";
  if (!data.event_time) return "Please select a preferred time.";
  if (!data.location || data.location.trim().length < 2)
    return "Please enter a shoot location.";
  if (data.message && data.message.length > 2000)
    return "Message is too long (max 2000 characters).";
  return null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<BookingInput>;

    // Validate
    const validationError = validate(body);
    if (validationError) {
      return NextResponse.json({ success: false, error: validationError }, { status: 400 });
    }

    // Build the record
    const record = {
      name: body.name!.trim(),
      email: body.email!.trim().toLowerCase(),
      phone: body.phone!.trim(),
      event_type: body.event_type!,
      event_date: body.event_date!,
      event_time: body.event_time!,
      location: body.location!.trim(),
      message: body.message?.trim() || "",
      status: "pending",
      created_at: new Date().toISOString(),
    };

    // Insert into Supabase using service role key if available, else anon key (RLS bypassed for service role)
    if (!SUPABASE_URL || (!SUPABASE_SERVICE_ROLE_KEY && !SUPABASE_ANON_KEY)) {
      return NextResponse.json(
        { success: false, error: "Database not configured." },
        { status: 500 }
      );
    }

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY,
      {
        auth: { autoRefreshToken: false, persistSession: false },
      }
    );

    const { data: inserted, error: dbError } = await supabase
      .from("bookings")
      .insert([record])
      .select("id")
      .single();

    if (dbError) {
      console.error("[Booking] Supabase insert error:", dbError);
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to save booking. Please try again later.",
          details: dbError // Return actual Supabase error for debugging
        },
        { status: 500 }
      );
    }

    // Send EmailJS notification (best-effort)
    if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
      try {
        EmailJS.init({ publicKey: EMAILJS_PUBLIC_KEY, privateKey: EMAILJS_PRIVATE_KEY || undefined });

        await EmailJS.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            to_name: "Satish",
            from_name: record.name,
            from_email: record.email,
            from_phone: record.phone,
            event_type: record.event_type,
            event_date: record.event_date,
            event_time: record.event_time,
            location: record.location,
            message: record.message,
            booking_id: inserted?.id ?? "N/A",
            status: record.status,
          },
          { publicKey: EMAILJS_PUBLIC_KEY }
        );
      } catch (emailErr) {
        // Don't fail the booking if EmailJS fails
        console.error("[Booking] EmailJS notification failed:", emailErr);
      }
    } else {
      console.warn("[Booking] EmailJS not configured — skipping notification.");
    }

    return NextResponse.json({ success: true, id: inserted?.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Booking] Unexpected error:", message);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
