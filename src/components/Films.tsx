"use client";

import { motion } from "framer-motion";
import { Play, Youtube } from "lucide-react";
import Image from "next/image";

// Only YouTube channel videos
const YOUTUBE_VIDEOS = [
  {
    id: "lGz-fM02m5g",
    title: "The Royal Wedding Film | Teaser",
    duration: "2:45 Mins",
    category: "Pre Wedding Teaser",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "Cinematic Event Highlights | Showreel",
    duration: "5:20 Mins",
    category: "Studio Showreel",
  },
];

// YouTube Shorts and social edits from the same channel
const YOUTUBE_SOCIALS = [
  { id: "3JZ_D3ELwOQ", title: "Social Edit — Highlight Reel", duration: "0:45 Mins", category: "Socials" },
  { id: "V-_O7nl0Ii0", title: "Behind The Scenes — Quick Cut", duration: "1:10 Mins", category: "Socials" },
  { id: "L_jWHffIx5E", title: "Shorts — Cinematic Moment", duration: "0:30 Mins", category: "Socials" },
];

export default function Films() {
  return (
    <section id="films" className="py-24 relative bg-secondary overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-gold-radial opacity-15 pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-gold-radial opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs text-gold tracking-[0.3em] uppercase block mb-3 font-semibold">
            Cinema & Social
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-light tracking-wide text-white">
            Cinematic Films & Socials
          </h2>
          <div className="w-12 h-[1px] bg-gold mx-auto mt-6" />
        </div>

        {/* YouTube Section */}
        <div className="mb-24">
          <div className="flex items-center space-x-3 mb-8 justify-center lg:justify-start">
            <Youtube className="w-6 h-6 text-red-600 animate-pulse" />
            <h3 className="text-xl md:text-2xl font-serif text-white tracking-wider font-light">
              Featured YouTube Films
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {YOUTUBE_VIDEOS.map((video, index) => (
              <div
                key={video.title}
                className="glass-panel p-4 border border-white/5 relative overflow-hidden group"
              >
                {/* 16:9 Aspect Video Container */}
                <div className="relative aspect-video bg-[#0a0a0a] overflow-hidden group-hover:border-gold/30 border border-transparent transition-colors">
                  {video.id === "D4AF37_sample" ? (
                    // Beautiful custom showreel card with direct link
                    <a
                      href="https://youtube.com/@satisheventphotography"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 block"
                    >
                      <Image
                        src="/assets/outdoor.webp"
                        alt={video.title}
                        width={800}
                        height={450}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-[#050505]/40" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full border border-gold bg-primary/80 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 text-gold fill-gold ml-1" />
                        </div>
                      </div>
                    </a>
                  ) : (
                    // Iframe for direct embedding
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      className="w-full h-full border-0 absolute inset-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  )}
                </div>

                {/* Details */}
                <div className="mt-4 flex justify-between items-start">
                  <div>
                    <span className="text-[9px] text-gold tracking-widest uppercase font-light">
                      {video.category}
                    </span>
                    <h4 className="text-md font-serif text-white tracking-wide font-light mt-1">
                      {video.title}
                    </h4>
                  </div>
                  <span className="text-[10px] text-white/40 font-mono tracking-wider">
                    {video.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* YouTube Channel Button */}
          <div className="text-center mt-10">
            <a
              href="https://youtube.com/@satisheventphotography"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 px-8 py-3 border border-white/10 text-white hover:text-gold hover:border-gold/50 text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300"
            >
              <Youtube className="w-4 h-4 text-red-600" />
              <span>Watch More on YouTube</span>
            </a>
          </div>
        </div>

        {/* Socials — YouTube-only grid */}
        <div>
          <div className="flex items-center space-x-3 mb-8 justify-center lg:justify-start">
            <Youtube className="w-5 h-5 text-gold" />
            <h3 className="text-xl md:text-2xl font-serif text-white tracking-wider font-light">
              Socials (YouTube Shorts & Edits)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {YOUTUBE_SOCIALS.map((video) => (
              <div key={video.id} className="glass-panel p-2 border border-white/5 relative overflow-hidden">
                <div className="relative aspect-video bg-[#0a0a0a] overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    className="w-full h-full border-0 absolute inset-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>

                <div className="mt-3 flex justify-between items-start">
                  <div>
                    <span className="text-[9px] text-gold tracking-widest uppercase font-light">{video.category}</span>
                    <h4 className="text-sm font-serif text-white tracking-wide font-light mt-1">{video.title}</h4>
                  </div>
                  <span className="text-[10px] text-white/40 font-mono tracking-wider">{video.duration}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href="https://youtube.com/@satisheventphotography"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 px-8 py-3 border border-white/10 text-white hover:text-gold hover:border-gold/50 text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300"
            >
              <Youtube className="w-4 h-4 text-red-600" />
              <span>See More Socials on YouTube</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
