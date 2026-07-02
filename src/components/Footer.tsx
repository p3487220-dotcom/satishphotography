"use client";

import { Camera, Instagram, Youtube, Mail, Phone } from "lucide-react";

export default function Footer() {
  const handleScrollTo = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#050505] border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left: Brand logo */}
        <div className="flex items-center space-x-2">
          <Camera className="w-5 h-5 text-gold" />
          <span className="font-serif text-lg tracking-[0.15em] font-light">
            SATISH PHOTOGRAPHY<span className="text-gold font-normal">.</span>
          </span>
        </div>

        {/* Center: Quick navigation links */}
        <div className="flex flex-wrap justify-center gap-6">
          {["Home", "Portfolio", "Services", "Films", "About", "Reviews", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={(e) => {
                e.preventDefault();
                handleScrollTo(`#${item.toLowerCase()}`);
              }}
              className="text-[10px] tracking-[0.2em] uppercase font-light text-white/50 hover:text-gold transition-colors duration-300"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Right: Social icons */}
        <div className="flex items-center space-x-5">
          <a
            href="https://www.instagram.com/satish_photography1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-gold transition-colors duration-300"
            aria-label="Instagram Link"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="https://youtube.com/@satisheventphotography"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-gold transition-colors duration-300"
            aria-label="YouTube Link"
          >
            <Youtube className="w-4 h-4" />
          </a>
          <a
            href="tel:+918008231832"
            className="text-white/40 hover:text-gold transition-colors duration-300"
            aria-label="Call Link"
          >
            <Phone className="w-4 h-4" />
          </a>
          <a
            href="mailto:erlasatish32@gmail.com"
            className="text-white/40 hover:text-gold transition-colors duration-300"
            aria-label="Email Link"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Copyright border */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-center gap-4">
        <span className="text-[10px] tracking-wider text-white/30 font-light">
          © {new Date().getFullYear()} Satish Photography. All Rights Reserved.
        </span>
        <span className="text-[10px] tracking-[0.15em] text-white/30 font-light uppercase">
          Crafted with <span className="text-gold">♥</span> in Piduguralla
        </span>
      </div>
    </footer>
  );
}
