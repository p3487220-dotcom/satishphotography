"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Camera } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Services", href: "#services" },
    { name: "Films", href: "#films" },
    { name: "About", href: "#about" },
    { name: "Reviews", href: "#reviews" },
    { name: "Contact", href: "#contact" }
  ];

  const handleScrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#050505]/80 border-b border-white/5 py-4 backdrop-blur-md"
            : "bg-transparent py-6 border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleScrollTo("#home");
            }}
            className="flex items-center space-x-2 group"
          >
            <Camera className="w-6 h-6 text-gold group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-serif text-xl tracking-[0.15em] font-light">
              SATISH PHOTOGRAPHY<span className="text-gold font-normal">.</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollTo(link.href);
                }}
                className="relative text-xs tracking-[0.2em] uppercase font-light text-white/70 hover:text-white transition-colors duration-300 group py-1"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA Book Button */}
          <div className="hidden lg:block">
            <button
              onClick={() => handleScrollTo("#booking")}
              className="relative px-6 py-2.5 overflow-hidden group border border-gold/30 bg-transparent text-xs tracking-[0.25em] uppercase text-gold hover:text-primary transition-colors duration-300 font-semibold"
            >
              <span className="absolute inset-0 w-full h-full bg-gold transform scale-x-0 origin-left transition-transform duration-500 cubic-bezier(0.25, 1, 0.5, 1) group-hover:scale-x-100 -z-10" />
              Book Now
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white hover:text-gold transition-colors duration-200 p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-primary/95 z-40 lg:hidden flex flex-col items-center justify-center space-y-8"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleScrollTo(link.href);
              }}
              className="text-lg tracking-[0.25em] uppercase font-light text-white/80 hover:text-gold transition-colors duration-300 py-2 min-h-[44px] flex items-center justify-center w-full"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={() => handleScrollTo("#booking")}
            className="px-8 py-3 min-h-[44px] flex items-center justify-center bg-transparent border border-gold text-gold text-xs tracking-[0.3em] uppercase hover:bg-gold hover:text-primary transition-all duration-300 font-bold mt-4 w-[200px]"
          >
            Book Session
          </button>
        </div>
      )}
    </>
  );
}
