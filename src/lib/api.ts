// app/api/booking/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // ...your existing logic here (email/WhatsApp/DB save)
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Booking route error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong processing your booking." },
      { status: 500 }
    );
  }
}