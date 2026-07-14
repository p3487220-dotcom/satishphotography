// app/api/booking/route.ts
import { NextResponse } from "next/server";

interface BookingPayload {
  name: string;
  phone: string;
  package: string;
  date: string;
  guests: string;
  location: string;
  time: string;
  requests?: string;
}

// Fallbacks so the form still works even if env vars aren't set on the host.
// Recommended: set OWNER_WHATSAPP_NUMBER and OWNER_EMAIL in your .env file instead
// of relying on these hardcoded defaults.
const OWNER_WHATSAPP_NUMBER = process.env.OWNER_WHATSAPP_NUMBER || "918008231832";
const OWNER_EMAIL = process.env.OWNER_EMAIL || "erlasatish32@gmail.com";

function validate(data: Partial<BookingPayload>): string | null {
  if (!data.name || data.name.trim().length < 2) return "Please enter a valid name.";
  if (!data.phone || data.phone.replace(/\D/g, "").length < 10) return "Please enter a valid phone number.";
  if (!data.date || isNaN(new Date(data.date).getTime())) return "Please select a valid event date.";
  if (new Date(data.date) < new Date(new Date().toDateString())) return "Event date cannot be in the past.";
  if (!data.location || data.location.trim().length < 2) return "Please enter a shoot location.";
  if (data.requests && data.requests.length > 2000) return "Special requests are too long.";
  return null;
}

// Escapes HTML-sensitive characters so user input can't break the email markup.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as Partial<BookingPayload>;

    const validationError = validate(data);
    if (validationError) {
      return NextResponse.json({ success: false, error: validationError }, { status: 400 });
    }

    // waNumber should be digits only, no + or spaces (e.g. "918008231832")
    const waNumber = OWNER_WHATSAPP_NUMBER.replace(/\D/g, "");
    const waText = encodeURIComponent(
      `New booking:\nName: ${data.name}\nPhone: ${data.phone}\nPackage: ${data.package}\nDate: ${data.date}\nLocation: ${data.location}`
    );
    const whatsappLink = waNumber ? `https://wa.me/${waNumber}?text=${waText}` : null;

    // Email sending is best-effort: if this fails (bad key, Resend outage,
    // network error), the booking itself should still succeed for the user.
    if (process.env.RESEND_API_KEY && OWNER_EMAIL) {
      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Satish Photography <onboarding@resend.dev>",
            to: OWNER_EMAIL,
            subject: `New Booking: ${data.name} — ${data.date}`,
            html: `<h2>New Booking Request</h2>
              <p><b>Name:</b> ${escapeHtml(data.name!)}</p>
              <p><b>Phone:</b> ${escapeHtml(data.phone!)}</p>
              <p><b>Package:</b> ${escapeHtml(data.package || "—")}</p>
              <p><b>Date:</b> ${escapeHtml(data.date!)} — ${escapeHtml(data.time || "—")}</p>
              <p><b>Location:</b> ${escapeHtml(data.location!)}</p>
              <p><b>Guests:</b> ${escapeHtml(data.guests || "—")}</p>
              <p><b>Requests:</b> ${escapeHtml(data.requests || "—")}</p>`,
          }),
        });
        if (!emailRes.ok) {
          console.error("Resend error:", emailRes.status, await emailRes.text());
        }
      } catch (emailErr) {
        console.error("Resend request failed (network/timeout):", emailErr);
      }
    } else {
      console.warn("Email skipped: RESEND_API_KEY or OWNER_EMAIL not set.");
    }

    return NextResponse.json({ success: true, whatsappLink });
  } catch (err) {
    const message = err instanceof Error ? err.stack || err.message : String(err);
    // Log full detail server-side so the real cause is visible in your logs/host dashboard.
    console.error("Booking route error:", message);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong processing your booking. Please try again.",
        // TEMPORARY DEBUG FIELD — remove this line once the issue is found.
        debug: message,
      },
      { status: 500 }
    );
  }
}
