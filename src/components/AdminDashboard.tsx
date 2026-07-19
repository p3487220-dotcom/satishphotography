"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { parseApiJson } from "@/lib/api";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  LogOut,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ChevronDown,
} from "lucide-react";

type Booking = {
  id: number;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string;
  event_time: string;
  location: string;
  message: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending: "border-yellow-500/40 text-yellow-400 bg-yellow-500/10",
  confirmed: "border-blue-500/40 text-blue-400 bg-blue-500/10",
  completed: "border-green-500/40 text-green-400 bg-green-500/10",
  cancelled: "border-red-500/40 text-red-400 bg-red-500/10",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock className="w-3 h-3" />,
  confirmed: <CheckCircle className="w-3 h-3" />,
  completed: <CheckCircle className="w-3 h-3" />,
  cancelled: <XCircle className="w-3 h-3" />,
};

export default function AdminDashboard() {
  const [auth, setAuth] = useState<{ authenticated: boolean; user?: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search & filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detail modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Check auth status on mount
  useEffect(() => {
    (async () => {
      setAuthLoading(true);
      try {
        const res = await fetch("/api/admin/me");
        const j = await parseApiJson<{ authenticated: boolean; user?: string }>(res);
        setAuth(j);
      } catch {
        setAuth({ authenticated: false });
      }
      setAuthLoading(false);
    })();
  }, []);

  // Fetch bookings when authenticated
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const j = await parseApiJson<{ success: boolean; bookings?: Booking[] }>(res);
      setBookings(j.bookings || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch bookings");
    }
    setLoading(false);
  }, [search, statusFilter]);

  useEffect(() => {
    if (auth?.authenticated) fetchBookings();
  }, [auth, fetchBookings]);

  // Debounced search
  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      if (auth?.authenticated) fetchBookings();
    }, 400);
  };

  // Login
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setLoginSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      if (res.ok) {
        setAuth({ authenticated: true, user: loginEmail });
        setLoginEmail("");
        setLoginPassword("");
      } else {
        const j = await parseApiJson<{ error?: string }>(res);
        setLoginError(j?.error || "Login failed");
      }
    } catch {
      setLoginError("Login failed. Please try again.");
    }
    setLoginSubmitting(false);
  }

  // Logout
  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuth({ authenticated: false });
    setBookings([]);
    setSelectedBooking(null);
  }

  // Update status
  async function handleStatusUpdate(id: number, newStatus: string) {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        fetchBookings();
        if (selectedBooking?.id === id) {
          setSelectedBooking((prev) => prev ? { ...prev, status: newStatus as Booking["status"] } : null);
        }
      }
    } catch {
      setError("Failed to update status.");
    }
  }

  // Delete
  async function handleDelete(id: number) {
    if (!confirm("Delete booking #" + id + "?")) return;
    try {
      const res = await fetch(`/api/admin/bookings?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchBookings();
        if (selectedBooking?.id === id) setSelectedBooking(null);
      }
    } catch {
      setError("Failed to delete booking.");
    }
  }

  // Format date for display
  function formatDate(dateStr: string) {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  }

  function formatDateTime(dateStr: string) {
    try {
      return new Date(dateStr).toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  }

  // ============== LOADING ==============
  if (authLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="flex items-center space-x-3 text-white/40">
          <span className="inline-block w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          <span className="text-xs tracking-widest uppercase">Loading</span>
        </div>
      </div>
    );
  }

  // ============== LOGIN FORM ==============
  if (!auth?.authenticated) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {/* Brand */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-serif text-white font-light tracking-wide">
              Admin Portal
            </h1>
            <p className="text-[10px] text-white/40 tracking-[0.3em] uppercase mt-2 font-light">
              Satish Photography
            </p>
            <div className="w-8 h-[1px] bg-gold/60 mx-auto mt-4" />
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-white/50 mb-2">
                Email
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="w-full bg-[#1c1c1c] border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-white/50 mb-2">
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[#1c1c1c] border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            {loginError && (
              <div className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-400 tracking-wide">
                ⚠ {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginSubmitting}
              className="w-full py-3.5 bg-gold text-primary font-bold text-xs tracking-[0.25em] uppercase hover:bg-gold-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loginSubmitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ============== DASHBOARD ==============
  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="border-b border-white/5 bg-secondary/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-serif text-white font-light tracking-wide">
              Bookings
            </h1>
            <p className="text-[10px] text-white/30 tracking-[0.2em] uppercase mt-0.5">
              {bookings.length} total{pendingCount > 0 ? ` · ${pendingCount} pending` : ""}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => { fetchBookings(); }}
              className="p-2 text-white/30 hover:text-gold transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-[10px] tracking-[0.2em] uppercase text-white/30 hover:text-gold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search & Filter Bar */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-white/20 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by name, email, phone, location..."
                className="w-full bg-[#1c1c1c] border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2.5 text-xs tracking-wider uppercase border transition-colors ${
                statusFilter
                  ? "border-gold/50 text-gold bg-gold/5"
                  : "border-white/10 text-white/40 hover:border-white/20"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
              {statusFilter && <span className="ml-1 text-[10px]">({statusFilter})</span>}
              <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Status filter chips */}
          {showFilters && (
            <div className="flex items-center space-x-2 mt-4">
              <button
                onClick={() => { setStatusFilter(""); fetchBookings(); }}
                className={`px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase border transition-colors ${
                  !statusFilter
                    ? "border-gold/50 text-gold bg-gold/5"
                    : "border-white/10 text-white/30 hover:border-white/20"
                }`}
              >
                All
              </button>
              {["pending", "confirmed", "completed", "cancelled"].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStatusFilter(statusFilter === s ? "" : s);
                    setTimeout(() => fetchBookings(), 0);
                  }}
                  className={`px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase border transition-colors ${
                    statusFilter === s
                      ? "border-gold/50 text-gold bg-gold/5"
                      : "border-white/10 text-white/30 hover:border-white/20"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="border border-red-500/30 bg-red-500/10 px-4 py-3 mb-6 text-xs text-red-400 tracking-wide">
            ⚠ {error}
            <button onClick={() => setError(null)} className="ml-4 underline">Dismiss</button>
          </div>
        )}

        {/* Table */}
        <div className="glass-panel overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <span className="inline-block w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/20 text-xs tracking-widest uppercase">No bookings found</p>
            </div>
          ) : (
            /* Desktop table */
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-white/30 font-medium px-4 py-3 whitespace-nowrap">Status</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-white/30 font-medium px-4 py-3 whitespace-nowrap">Client</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-white/30 font-medium px-4 py-3 whitespace-nowrap">Event</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-white/30 font-medium px-4 py-3 whitespace-nowrap">Date</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-white/30 font-medium px-4 py-3 whitespace-nowrap">Location</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-white/30 font-medium px-4 py-3 whitespace-nowrap">Created</th>
                    <th className="text-right text-[10px] tracking-[0.2em] uppercase text-white/30 font-medium px-4 py-3 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr
                      key={b.id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                      onClick={() => setSelectedBooking(b)}
                    >
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 text-[10px] tracking-wider uppercase border ${STATUS_COLORS[b.status] || "border-white/10 text-white/40"}`}
                        >
                          {STATUS_ICONS[b.status]}
                          <span>{b.status}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-white font-medium">{b.name}</div>
                        <div className="text-[11px] text-white/30">{b.email}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-white/60">{b.event_type}</td>
                      <td className="px-4 py-3 text-sm text-white/60 whitespace-nowrap">
                        {formatDate(b.event_date)}
                        <div className="text-[11px] text-white/30">{b.event_time}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-white/60">{b.location}</td>
                      <td className="px-4 py-3 text-sm text-white/30 whitespace-nowrap">
                        {formatDateTime(b.created_at)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          {b.status !== "confirmed" && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleStatusUpdate(b.id, "confirmed"); }}
                              className="p-2 text-white/20 hover:text-blue-400 transition-colors"
                              title="Confirm"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {b.status !== "cancelled" && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleStatusUpdate(b.id, "cancelled"); }}
                              className="p-2 text-white/20 hover:text-red-400 transition-colors"
                              title="Cancel"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(b.id); }}
                            className="p-2 text-white/20 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile cards */}
          {!loading && bookings.length > 0 && (
            <div className="md:hidden space-y-3 p-4">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#1c1c1c] border border-white/5 p-4 cursor-pointer hover:border-white/10 transition-colors"
                  onClick={() => setSelectedBooking(b)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-white font-medium">{b.name}</span>
                    <span
                      className={`inline-flex items-center space-x-1.5 px-2 py-1 text-[10px] tracking-wider uppercase border ${STATUS_COLORS[b.status] || "border-white/10 text-white/40"}`}
                    >
                      {STATUS_ICONS[b.status]}
                      <span>{b.status}</span>
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-white/40">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3 h-3" />
                      <span>{b.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(b.event_date)} — {b.event_type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3 h-3" />
                      <span>{b.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="bg-secondary border border-white/10 max-w-lg w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-serif text-white font-light tracking-wide">
                  {selectedBooking.name}
                </h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-white/20 hover:text-white/60 text-xl leading-none"
                >
                  &times;
                </button>
              </div>
              <span
                className={`inline-flex items-center space-x-1.5 px-3 py-1 text-[10px] tracking-wider uppercase border ${STATUS_COLORS[selectedBooking.status]}`}
              >
                {STATUS_ICONS[selectedBooking.status]}
                <span>{selectedBooking.status}</span>
              </span>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-1">Email</label>
                  <div className="flex items-center space-x-2 text-sm text-white/70">
                    <Mail className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
                    <span className="break-all">{selectedBooking.email}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-1">Phone</label>
                  <div className="flex items-center space-x-2 text-sm text-white/70">
                    <Phone className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
                    <span>{selectedBooking.phone}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-1">Event Type</label>
                <p className="text-sm text-white/70">{selectedBooking.event_type}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-1">Event Date</label>
                  <div className="flex items-center space-x-2 text-sm text-white/70">
                    <Calendar className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
                    <span>{formatDate(selectedBooking.event_date)}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-1">Time</label>
                  <p className="text-sm text-white/70">{selectedBooking.event_time}</p>
                </div>
              </div>

              <div>
                <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-1">Location</label>
                <div className="flex items-center space-x-2 text-sm text-white/70">
                  <MapPin className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
                  <span>{selectedBooking.location}</span>
                </div>
              </div>

              {selectedBooking.message && (
                <div>
                  <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-1">Message</label>
                  <p className="text-sm text-white/60 leading-relaxed">{selectedBooking.message}</p>
                </div>
              )}

              <div>
                <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-1">Created At</label>
                <p className="text-sm text-white/40">{formatDateTime(selectedBooking.created_at)}</p>
              </div>
            </div>

            {/* Modal Footer — Actions */}
            <div className="p-6 border-t border-white/5">
              <label className="block text-[9px] tracking-[0.2em] uppercase text-white/30 mb-3">Update Status</label>
              <div className="flex flex-wrap gap-2">
                {["pending", "confirmed", "completed", "cancelled"].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusUpdate(selectedBooking.id, s)}
                    disabled={selectedBooking.status === s}
                    className={`px-4 py-2 text-[10px] tracking-[0.15em] uppercase border transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                      selectedBooking.status === s
                        ? "border-gold/50 text-gold bg-gold/5"
                        : "border-white/10 text-white/40 hover:border-white/20"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (confirm("Delete this booking?")) {
                      handleDelete(selectedBooking.id);
                    }
                  }}
                  className="flex items-center space-x-2 text-[10px] tracking-[0.2em] uppercase text-red-400/60 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 text-[10px] tracking-[0.2em] uppercase text-white/30 hover:text-white/60 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
