"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Send, MessageCircle } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Wedding",
    message: ""
  });
  
  const [isSent, setIsSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      alert("Please fill in required fields (*)");
      return;
    }

    // Direct WhatsApp message compilator
    const textMsg = `✨ *STUDIO INQUIRY — Satish Photography* ✨\n\n` +
      `👤 *Name:* ${formData.name}\n` +
      `📧 *Email:* ${formData.email || "Not Provided"}\n` +
      `📞 *Phone:* ${formData.phone}\n` +
      `🏷️ *Category:* ${formData.subject}\n` +
      `💬 *Message:* ${formData.message}\n\n` +
      `Sent via Satish Photography Inquiry Form.`;

    const waUrl = `https://wa.me/918008231832?text=${encodeURIComponent(textMsg)}`;
    setIsSent(true);
    setTimeout(() => {
      window.open(waUrl, "_blank");
      setIsSent(false);
      setFormData({ name: "", email: "", phone: "", subject: "Wedding", message: "" });
    }, 800);
  };

  return (
    <section id="contact" className="py-24 relative bg-primary overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-radial opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-xs text-gold tracking-[0.3em] uppercase block mb-3 font-semibold">
            Get In Touch
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-light tracking-wide text-white">
            Connect With Satish
          </h2>
          <div className="w-12 h-[1px] bg-gold mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details & Map - 5 columns */}
          <div className="lg:col-span-5 space-y-8">
            <div className="glass-panel p-8 border border-white/5 space-y-6">
              <h3 className="text-xl font-serif text-white tracking-wider font-light">
                Studio Information
              </h3>
              
              <div className="w-8 h-[1px] bg-gold" />

              <div className="space-y-4">
                <a 
                  href="tel:+918008231832"
                  className="flex items-start space-x-4 text-white/70 hover:text-gold transition-colors group"
                >
                  <Phone className="w-4.5 h-4.5 text-gold mt-1" />
                  <div>
                    <span className="text-[10px] text-white/40 block tracking-wider uppercase font-light">
                      Phone & Call
                    </span>
                    <span className="text-sm font-semibold tracking-wider font-mono">
                      +91 8008231832
                    </span>
                  </div>
                </a>

                <a 
                  href="https://wa.me/918008231832"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-4 text-white/70 hover:text-gold transition-colors group"
                >
                  <MessageCircle className="w-4.5 h-4.5 text-gold mt-1" />
                  <div>
                    <span className="text-[10px] text-white/40 block tracking-wider uppercase font-light">
                      WhatsApp Quick Chat
                    </span>
                    <span className="text-sm font-semibold tracking-wider font-mono">
                      +91 8008231832
                    </span>
                  </div>
                </a>

                <a 
                  href="mailto:erlasatish32@gmail.com"
                  className="flex items-start space-x-4 text-white/70 hover:text-gold transition-colors group"
                >
                  <Mail className="w-4.5 h-4.5 text-gold mt-1" />
                  <div>
                    <span className="text-[10px] text-white/40 block tracking-wider uppercase font-light">
                      Email Address
                    </span>
                    <span className="text-sm font-semibold tracking-wider font-mono">
                      erlasatish32@gmail.com
                    </span>
                  </div>
                </a>

                <div className="flex items-start space-x-4 text-white/70">
                  <MapPin className="w-4.5 h-4.5 text-gold mt-1" />
                  <div>
                    <span className="text-[10px] text-white/40 block tracking-wider uppercase font-light">
                      Luxury Gallery Location
                    </span>
                    <span className="text-xs leading-relaxed font-light tracking-wide">
                      Satish Photography, Janapadu Road,<br />
                      Near Sri Vedhavidyaniketh School,<br />
                      Piduguralla, Andhra Pradesh – 522413
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="glass-panel p-2 border border-white/5 h-[280px] overflow-hidden relative">
              <iframe
                src="https://maps.google.com/maps?q=Satish%20Photography,%20Janapadu%20Road,%20Near%20Sri%20Vedhavidyaniketh%20School,%20Piduguralla,%20Andhra%20Pradesh%20%E2%80%93%20522413&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(1) invert(0.9) contrast(1.2)" }}
                allowFullScreen
                loading="lazy"
                title="Satish Photography Studio Map"
              />
            </div>
          </div>

          {/* Inquiry Form - 7 columns */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-8 md:p-12 border border-white/5">
              <h3 className="text-xl font-serif text-white tracking-wider font-light mb-6">
                Send An Inquiry
              </h3>
              
              <form onSubmit={handleInquirySubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-white/60 mb-2 font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Durgaprasad"
                      className="w-full bg-[#1c1c1c] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-white/60 mb-2 font-medium">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="e.g. +91 99999 99999"
                      className="w-full bg-[#1c1c1c] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/60 mb-2 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. client@example.com"
                    className="w-full bg-[#1c1c1c] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/60 mb-2 font-medium">
                    Event Category
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-[#1c1c1c] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
                  >
                    <option className="bg-[#111]" value="Wedding">Wedding Shoot</option>
                    <option className="bg-[#111]" value="Pre-Wedding">Pre-Wedding / Outdoor</option>
                    <option className="bg-[#111]" value="Baby Shoot">Baby Shoot</option>
                    <option className="bg-[#111]" value="Fashion">Fashion / Portrait</option>
                    <option className="bg-[#111]" value="Album & Edits">Album & Post-Processing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/60 mb-2 font-medium">
                    Detailed Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us about dates, timeline plans, or preferred themes..."
                    className="w-full bg-[#1c1c1c] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-gold transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-transparent border border-gold text-gold font-bold text-xs tracking-[0.3em] uppercase hover:bg-gold hover:text-primary transition-all duration-500 flex items-center justify-center space-x-2"
                >
                  {isSent ? (
                    <span className="inline-block w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Transmit Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Quick Action Button */}
      <a
        href="https://wa.me/918008231832"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-green-600 hover:bg-green-500 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group animate-bounce"
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out text-xs font-bold tracking-widest uppercase pl-0 group-hover:pl-2 whitespace-nowrap">
          Chat With Satish
        </span>
      </a>
    </section>
  );
}
