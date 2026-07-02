import { NextRequest } from "next/server";
import nodemailer from "nodemailer";
import db from "@/lib/db";

// ──────────────────────────────────────────
// Types
// ──────────────────────────────────────────
interface BookingPayload {
  name: string;
  phone: string;
  package: string;
  date: string;
  time: string;
  location: string;
  guests: string;
  requests: string;
}

// ──────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────

/** Save booking row to PostgreSQL */
async function saveBooking(data: BookingPayload): Promise<number> {
  const result = await db.query(
    `
      INSERT INTO bookings (name, phone, package, date, time, location, guests, requests)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `,
    [data.name, data.phone, data.package, data.date, data.time, data.location, data.guests, data.requests]
  );

  return Number(result.rows[0]?.id);
}

/** Send email notification to the studio owner via Gmail SMTP */
async function sendEmail(data: BookingPayload, bookingId: number) {
  const { OWNER_EMAIL, GMAIL_APP_PASSWORD } = process.env;
  if (!OWNER_EMAIL || !GMAIL_APP_PASSWORD) {
    console.warn("[Booking] Email env vars not set — skipping email notification.");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: OWNER_EMAIL,
      pass: GMAIL_APP_PASSWORD,
    },
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: Georgia, serif; background: #0d0d0d; color: #e5e5e5; margin: 0; padding: 0; }
        .wrapper { max-width: 580px; margin: 40px auto; background: #1a1a1a; border: 1px solid #c9a84c33; }
        .header { background: linear-gradient(135deg, #1a1a1a, #111); padding: 36px 40px; border-bottom: 1px solid #c9a84c55; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; letter-spacing: 0.15em; color: #c9a84c; font-weight: 300; }
        .header p { margin: 6px 0 0; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: #888; }
        .badge { display: inline-block; background: #c9a84c; color: #0d0d0d; font-size: 10px; font-weight: bold; letter-spacing: 0.2em; padding: 4px 12px; margin-top: 14px; text-transform: uppercase; }
        .body { padding: 36px 40px; }
        .row { display: flex; margin-bottom: 18px; align-items: flex-start; border-bottom: 1px solid #ffffff08; padding-bottom: 16px; }
        .row:last-child { border-bottom: none; }
        .icon { font-size: 18px; width: 28px; flex-shrink: 0; }
        .label { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #888; margin-bottom: 4px; }
        .value { font-size: 15px; color: #ffffff; font-weight: 400; }
        .footer { padding: 20px 40px; background: #111; border-top: 1px solid #c9a84c22; text-align: center; font-size: 10px; color: #555; letter-spacing: 0.15em; }
        .booking-id { color: #c9a84c; font-size: 12px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>✦ New Booking Received ✦</h1>
          <p>Satish Photography — Reservation Portal</p>
          <span class="badge">Booking #${bookingId}</span>
        </div>
        <div class="body">
          <div class="row">
            <span class="icon">👤</span>
            <div style="margin-left:12px">
              <div class="label">Client Name</div>
              <div class="value">${data.name}</div>
            </div>
          </div>
          <div class="row">
            <span class="icon">📞</span>
            <div style="margin-left:12px">
              <div class="label">Phone / WhatsApp</div>
              <div class="value">${data.phone}</div>
            </div>
          </div>
          <div class="row">
            <span class="icon">📸</span>
            <div style="margin-left:12px">
              <div class="label">Package Selected</div>
              <div class="value">${data.package}</div>
            </div>
          </div>
          <div class="row">
            <span class="icon">📅</span>
            <div style="margin-left:12px">
              <div class="label">Event Date</div>
              <div class="value">${data.date}</div>
            </div>
          </div>
          <div class="row">
            <span class="icon">⏰</span>
            <div style="margin-left:12px">
              <div class="label">Time Slot</div>
              <div class="value">${data.time}</div>
            </div>
          </div>
          <div class="row">
            <span class="icon">📍</span>
            <div style="margin-left:12px">
              <div class="label">Location</div>
              <div class="value">${data.location}</div>
            </div>
          </div>
          <div class="row">
            <span class="icon">👥</span>
            <div style="margin-left:12px">
              <div class="label">Estimated Guests</div>
              <div class="value">${data.guests || "Not specified"}</div>
            </div>
          </div>
          <div class="row">
            <span class="icon">✏️</span>
            <div style="margin-left:12px">
              <div class="label">Special Requests</div>
              <div class="value">${data.requests || "None"}</div>
            </div>
          </div>
        </div>
        <div class="footer">
          Sent automatically from Satish Photography Booking Portal<br/>
          <span class="booking-id">Booking ID: #${bookingId}</span>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Satish Photography Booking" <${OWNER_EMAIL}>`,
    to: OWNER_EMAIL,
    subject: `📸 New Booking #${bookingId} — ${data.name} | ${data.package}`,
    html,
  });
}

/** Send WhatsApp notification via CallMeBot API */
async function sendWhatsApp(data: BookingPayload, bookingId: number) {
  const { OWNER_WHATSAPP, CALLMEBOT_API_KEY } = process.env;
  if (!OWNER_WHATSAPP || !CALLMEBOT_API_KEY) {
    console.warn("[Booking] WhatsApp env vars not set — skipping WhatsApp notification.");
    return;
  }

  const message =
    `✨ *NEW BOOKING #${bookingId}* ✨\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 *Name:* ${data.name}\n` +
    `📞 *Phone:* ${data.phone}\n` +
    `📸 *Package:* ${data.package}\n` +
    `📅 *Date:* ${data.date}\n` +
    `⏰ *Time:* ${data.time}\n` +
    `📍 *Location:* ${data.location}\n` +
    `👥 *Guests:* ${data.guests || "N/A"}\n` +
    `✏️ *Requests:* ${data.requests || "None"}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `_Satish Photography Portal_`;

  const encoded = encodeURIComponent(message);
  const url = `https://api.callmebot.com/whatsapp.php?phone=${OWNER_WHATSAPP}&text=${encoded}&apikey=${CALLMEBOT_API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) {
    console.error("[Booking] CallMeBot WhatsApp notification failed:", res.status, await res.text());
  }
}

// ──────────────────────────────────────────
// POST /api/booking
// ──────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body: BookingPayload = await request.json();

    // Validate required fields
    const required: (keyof BookingPayload)[] = ["name", "phone", "package", "date", "time", "location"];
    for (const field of required) {
      if (!body[field]?.trim()) {
        return Response.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // 1. Save to PostgreSQL database
    const bookingId = await saveBooking(body);

    // 2. Send email + WhatsApp in parallel (non-blocking — failures won't break the response)
    await Promise.allSettled([
      sendEmail(body, bookingId),
      sendWhatsApp(body, bookingId),
    ]);

    return Response.json({ success: true, bookingId });
  } catch (err) {
    console.error("[Booking API] Unhandled error:", err);
    return Response.json(
      { success: false, error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
