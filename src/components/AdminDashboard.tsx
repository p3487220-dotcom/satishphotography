"use client";
import React, { useEffect, useState } from "react";

type Booking = {
  id: number;
  name: string;
  phone: string;
  package: string;
  date: string;
  time: string;
  location: string;
  guests?: string;
  requests?: string;
  created_at?: string;
};

export default function AdminDashboard() {
  const [auth, setAuth] = useState<{ authenticated: boolean; user?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch("/api/admin/me");
      if (res.ok) {
        const j = await res.json();
        setAuth(j);
      } else {
        setAuth({ authenticated: false });
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (auth?.authenticated) fetchBookings();
  }, [auth]);

  async function fetchBookings() {
    try {
      const res = await fetch("/api/admin/bookings");
      if (!res.ok) throw new Error("Unauthorized or server error");
      const j = await res.json();
      setBookings(j.bookings || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch bookings");
    }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const username = String(fd.get("username") || "");
    const password = String(fd.get("password") || "");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      setAuth({ authenticated: true, user: username });
      fetchBookings();
    } else {
      const j = await res.json();
      setError(j?.error || "Login failed");
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuth({ authenticated: false });
    setBookings([]);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete booking #" + id + "?")) return;
    const res = await fetch(`/api/admin/bookings?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchBookings();
  }

  if (loading) return <div>Loading…</div>;

  if (!auth?.authenticated) {
    return (
      <div style={{ maxWidth: 540, margin: "40px auto", padding: 20 }}>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 8 }}>
            <input name="username" placeholder="Username" style={{ width: "100%", padding: 8 }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <input name="password" type="password" placeholder="Password" style={{ width: "100%", padding: 8 }} />
          </div>
          <div>
            <button type="submit" style={{ padding: "8px 12px" }}>Sign in</button>
          </div>
        </form>
        {error && <div style={{ color: "#c00", marginTop: 12 }}>{error}</div>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 980, margin: "28px auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h2>Bookings — Admin</h2>
        <div>
          <button onClick={handleLogout} style={{ padding: "6px 10px" }}>Logout</button>
        </div>
      </div>

      {error && <div style={{ color: "#c00", marginBottom: 12 }}>{error}</div>}

      <div>
        {bookings.length === 0 ? (
          <div>No bookings found.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                <th>ID</th>
                <th>Client</th>
                <th>Package</th>
                <th>Date</th>
                <th>Time</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: 8 }}>{b.id}</td>
                  <td style={{ padding: 8 }}>{b.name}</td>
                  <td style={{ padding: 8 }}>{b.package}</td>
                  <td style={{ padding: 8 }}>{b.date}</td>
                  <td style={{ padding: 8 }}>{b.time}</td>
                  <td style={{ padding: 8 }}>{b.phone}</td>
                  <td style={{ padding: 8 }}>
                    <button onClick={() => handleDelete(b.id)} style={{ padding: "6px 8px" }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
