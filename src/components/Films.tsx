"use client";

import { Youtube } from "lucide-react";

const CHANNEL_URL = "https://youtube.com/@satishphotography1?si=ny0tGouhipROLynC";
// Embed a specific video as requested by the user
const CHANNEL_EMBED_URL = "https://www.youtube.com/embed/Jw_K7iEEvos?si=fWAx9s31osff1hEP";

export default function Films() {
  return (
    <section id="films" className="py-24 relative bg-secondary overflow-hidden">
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-gold-radial opacity-15 pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-gold-radial opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs text-gold tracking-[0.3em] uppercase block mb-3 font-semibold">
            YouTube Channel
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-light tracking-wide text-white">
            Satish Photography YouTube
          </h2>
          <p className="mt-4 text-sm text-white/60 max-w-2xl mx-auto">
            Watch and play only official videos from my YouTube channel.
          </p>
          <div className="w-12 h-[1px] bg-gold mx-auto mt-6" />
        </div>

        <div className="glass-panel overflow-hidden border border-white/5">
          <div className="relative aspect-video bg-[#0a0a0a]">
            <iframe
              src={CHANNEL_EMBED_URL}
              title="Satish Photography YouTube Channel"
              className="w-full h-full border-0 absolute inset-0"
              frameBorder="0"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        <div className="text-center mt-10">
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-3 px-8 py-3 border border-white/10 text-white hover:text-gold hover:border-gold/50 text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300"
          >
            <Youtube className="w-4 h-4 text-red-600" />
            <span>Visit my official YouTube channel</span>
          </a>
        </div>
      </div>
    </section>
  );
}
