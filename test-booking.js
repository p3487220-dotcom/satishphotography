async function testBooking() {
  const url = "http://localhost:3000/api/booking";
  const payload = {
    name: "Test User",
    email: "test@example.com",
    phone: "1234567890",
    event_type: "Wedding Photography",
    event_date: "2026-12-31",
    event_time: "Morning (06:00 AM)",
    location: "Test Location",
    message: "Test message"
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Test request failed:", err);
  }
}
testBooking();
