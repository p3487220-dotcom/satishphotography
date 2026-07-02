"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parseApiJson } from "@/lib/api";
import { Calendar, User, MapPin, Clock, Award, CheckCircle } from "lucide-react";

const PACKAGES = [
  { value: "Wedding Photography", label: "Wedding Photography (Fine Art)" },
  { value: "Wedding Cinematography", label: "Wedding Cinematography (4K)" },
  { value: "Wedding Photography & Videography", label: "Wedding Photography & Videography (Combo)" },
  { value: "Pre Wedding Shoot", label: "Premium Pre-Wedding" },
  { value: "Engagement Shoot", label: "Engagement Photography" },
  { value: "Half Saree Ceremony", label: "Half Saree Ceremony Portfolio" },
  { value: "Outdoor Shoot", label: "Cinematic Outdoor Session" },
  { value: "Indoor Shoot", label: "High-End Indoor Studio Session" },
  { value: "Baby Photography", label: "Premium Baby Shoot" },
  { value: "Fashion Photography", label: "Editorial Fashion Shoot" },
  { value: "Album Designing", label: "Luxury Flush-Mount Album Design" },
  { value: "Video Editing", label: "Professional Video Color-Grading & Edit" }
];

export default function Booking() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    package: "Wedding Photography",
    date: "",
    guests: "Under 100",
    location: "",
    time: "Morning (06:00 AM)",
    requests: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);

  // Calculate form completion progress for the animated bar
  const calculateProgress = () => {
    let fields = ["name", "phone", "date", "location"];
    let filled = fields.filter((f) => formData[f as keyof typeof formData] !== "").length;
    return (filled / fields.length) * 100;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date || !formData.location) {
      alert("Please fill in all the required fields (*)");
      return;
    }

    setIsSubmitting(true);
    setIsError(null);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await parseApiJson<{ success?: boolean; error?: string }>(res);

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Booking failed. Please try again.");
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setIsError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-24 relative bg-secondary overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-radial opacity-15 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs text-gold tracking-[0.3em] uppercase block mb-3 font-semibold">
            Reservation Portal
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-light tracking-wide text-white">
            Book Your Session
          </h2>
          <p className="text-xs text-white/50 tracking-wider max-w-md mx-auto mt-4 leading-relaxed font-light">
            Secure your date for an premium luxury photoshoot experience. Tailored layouts, cinema lens aesthetics, and elegant visual capture.
          </p>
          <div className="w-12 h-[1px] bg-gold mx-auto mt-6" />
        </div>

        {/* Booking Card */}
        <div className="glass-panel-gold p-8 md:p-12 relative overflow-hidden transition-all duration-500">

          {/* Form Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-white/5">
            <div
              className="h-full bg-gradient-to-r from-gold/40 to-gold transition-all duration-500"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>

          {isSuccess ? (
            <div
              className="text-center py-12 flex flex-col items-center"
            >
              <CheckCircle className="w-16 h-16 text-gold mb-6 animate-bounce" />
              <h3 className="text-2xl font-serif text-white font-light tracking-wide">
                Reservation Confirmed
              </h3>
              <p className="text-xs text-white/50 max-w-sm mt-3 tracking-wider leading-relaxed">
                Your booking has been saved and Satish has been notified via email and WhatsApp. He will confirm your availability shortly.
              </p>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setIsError(null);
                  setFormData({
                    name: "",
                    phone: "",
                    package: "Wedding Photography",
                    date: "",
                    guests: "Under 100",
                    location: "",
                    time: "Morning (06:00 AM)",
                    requests: ""
                  });
                }}
                className="mt-8 px-6 py-2.5 bg-gold text-primary hover:bg-gold-light font-bold text-xs tracking-widest uppercase transition-colors"
              >
                Book Another Event
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dual inputs: Name & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/60 mb-2 font-medium">
                    Your Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Durgaprasad"
                      className="w-full bg-[#1c1c1c] border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold transition-colors pl-10"
                    />
                    <User className="w-4 h-4 text-white/20 absolute left-3 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/60 mb-2 font-medium">
                    Phone & WhatsApp *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. +91 99999 99999"
                      className="w-full bg-[#1c1c1c] border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold transition-colors pl-10"
                    />
                    <User className="w-4 h-4 text-white/20 absolute left-3 top-3.5" />
                  </div>
                </div>
              </div>

              {/* Package Selector */}
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-white/60 mb-2 font-medium">
                  Select Luxury Package *
                </label>
                <div className="relative">
                  <select
                    name="package"
                    value={formData.package}
                    onChange={handleInputChange}
                    className="w-full bg-[#1c1c1c] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer pl-10 pr-10"
                  >
                    {PACKAGES.map((pkg) => (
                      <option key={pkg.value} value={pkg.value} className="bg-[#111] text-white">
                        {pkg.label}
                      </option>
                    ))}
                  </select>
                  <Award className="w-4 h-4 text-white/20 absolute left-3 top-3.5" />
                  <div className="absolute right-4 top-4.5 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-white/40 pointer-events-none" />
                </div>
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/60 mb-2 font-medium">
                    Event Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#1c1c1c] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-gold transition-colors pl-10 dark:[color-scheme:dark]"
                    />
                    <Calendar className="w-4 h-4 text-white/20 absolute left-3 top-3.5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/60 mb-2 font-medium">
                    Preferred Time Slot
                  </label>
                  <div className="relative">
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full bg-[#1c1c1c] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer pl-10 pr-10"
                    >
                      <option className="bg-[#111]" value="Morning (06:00 AM)">Morning (06:00 AM)</option>
                      <option className="bg-[#111]" value="Afternoon (12:00 PM)">Afternoon (12:00 PM)</option>
                      <option className="bg-[#111]" value="Sunset / Evening (04:00 PM)">Sunset / Evening (04:00 PM)</option>
                      <option className="bg-[#111]" value="Night (08:00 PM)">Night (08:00 PM)</option>
                      <option className="bg-[#111]" value="Full Day Event">Full Day Event Coverage</option>
                    </select>
                    <Clock className="w-4 h-4 text-white/20 absolute left-3 top-3.5" />
                    <div className="absolute right-4 top-4.5 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-white/40 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Location & Guest count Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/60 mb-2 font-medium">
                    Preferred Shoot Location *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Piduguralla, Andhra Pradesh"
                      className="w-full bg-[#1c1c1c] border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold transition-colors pl-10"
                    />
                    <MapPin className="w-4 h-4 text-white/20 absolute left-3 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/60 mb-2 font-medium">
                    Estimated Guests
                  </label>
                  <div className="relative">
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleInputChange}
                      className="w-full bg-[#1c1c1c] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer pl-10 pr-10"
                    >
                      <option className="bg-[#111]" value="Under 100">Portrait Only (Under 100 guests)</option>
                      <option className="bg-[#111]" value="100 - 300">Intimate Gathering (100 - 300 guests)</option>
                      <option className="bg-[#111]" value="300 - 600">Grand Celebration (300 - 600 guests)</option>
                      <option className="bg-[#111]" value="600+">Royal Scale (600+ guests)</option>
                    </select>
                    <User className="w-4 h-4 text-white/20 absolute left-3 top-3.5" />
                    <div className="absolute right-4 top-4.5 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-white/40 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-white/60 mb-2 font-medium">
                  Special Requests / Creative Visions
                </label>
                <textarea
                  name="requests"
                  value={formData.requests}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about your event theme, specific shots desired, or visual style requirements..."
                  className="w-full bg-[#1c1c1c] border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold transition-colors resize-none"
                />
              </div>

              {/* Error message */}
              {isError && (
                <div className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-400 tracking-wide">
                  ⚠ {isError}
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-transparent border border-gold text-gold font-bold text-xs tracking-[0.3em] uppercase hover:bg-gold hover:text-primary transition-all duration-500 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Confirm Luxury Booking</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
