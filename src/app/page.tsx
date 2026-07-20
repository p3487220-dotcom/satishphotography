"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import { Calendar, Camera, Play, ArrowDown } from "lucide-react";

// Import custom sections
import CustomCursor from "@/components/CustomCursor";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import ThreeHero from "@/components/ThreeHero";
import Portfolio from "@/components/Portfolio";
import Services from "@/components/Services";
import Films from "@/components/Films";
import About from "@/components/About";
import Reviews from "@/components/Reviews";
import Booking from "@/components/Booking";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-like easing
      touchMultiplier: 2,
    });

    setLenisInstance(lenis);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Split heading into words so wrapping happens only between complete words
  const title1 = "CAPTURING MEMORIES";
  const title2 = "Creating Timeless Stories";
  const titleWords = title1.split(" ");

  const handleScrollTo = (id: string) => {
    if (lenisInstance) {
      lenisInstance.scrollTo(id, { offset: 0, duration: 1.5 });
    } else {
      const element = document.querySelector(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      {/* Loading Screen */}
      <Loader onComplete={() => setIsLoading(false)} />

      {/* Global Interactive Elements */}
      <CustomCursor />

      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col min-h-screen bg-primary selection:bg-gold selection:text-primary"
          >
            {/* Header navbar */}
            <Navbar />

            {/* HERO SECTION */}
            <section
              id="home"
              className="relative h-screen w-full flex items-center justify-center overflow-hidden"
            >
              {/* Three.js 3D Floating Cinematic Background */}
              <ThreeHero />

              {/* Foreground Hero Content Overlays */}
              <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 xl:px-10 w-full max-w-[min(92vw,1520px)] mx-auto flex flex-col items-center justify-center h-full pt-16 pb-20 sm:pt-20 lg:pt-24">
                
                {/* Micro Subtitle */}
                <motion.span
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                  className="text-xs text-gold tracking-[0.4em] uppercase mb-4 font-semibold font-sans block"
                >
                  Luxury Wedding & Cinematic Photography
                </motion.span>

                {/* Main Heading Row 1: Letter Reveal */}
                <h1 className="w-full max-w-[min(100%,1100px)] text-[clamp(2.6rem,6.6vw,6.5rem)] sm:text-[clamp(3.2rem,7vw,7.8rem)] lg:text-[clamp(4rem,8vw,9.2rem)] font-serif font-extralight tracking-[0.16em] sm:tracking-[0.24em] lg:tracking-[0.32em] text-white mb-3 leading-[0.8] sm:leading-[0.78] uppercase select-none">
                  <div className="flex flex-wrap justify-center items-center gap-x-[0.14em] sm:gap-x-[0.18em]">
                    {titleWords.map((word, wordIndex) => (
                      <motion.span
                        key={`${word}-${wordIndex}`}
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        transition={{
                          delay: 1.0 + wordIndex * 0.12,
                          duration: 0.8,
                          ease: [0.16, 1, 0.3, 1]
                        }}
                        className="hero-title-word"
                      >
                        {word.split("").map((char, charIndex) => (
                          <motion.span
                            key={`${word}-${charIndex}`}
                            initial={{ opacity: 0, filter: "blur(10px)" }}
                            animate={{ opacity: 1, filter: "blur(0px)" }}
                            transition={{
                              delay: 1.0 + (wordIndex * 0.12) + (charIndex * 0.03),
                              duration: 0.7,
                              ease: [0.16, 1, 0.3, 1]
                            }}
                            className="hero-title-char"
                            style={{ marginRight: charIndex === word.length - 1 ? 0 : "0.02em" }}
                          >
                            {char}
                          </motion.span>
                        ))}
                      </motion.span>
                    ))}
                  </div>
                </h1>

                {/* Main Heading Row 2: Fade Up & Blur Reveal */}
                <motion.h2
                  initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 1.8, duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
                  className="text-[clamp(1rem,2.3vw,1.7rem)] sm:text-[clamp(1.25rem,2.8vw,2.2rem)] font-serif font-light italic tracking-[0.16em] sm:tracking-[0.2em] text-gold-gradient mb-6"
                >
                  {title2}
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2, duration: 1.0, ease: "easeOut" }}
                  className="text-[11px] sm:text-xs text-white/50 tracking-[0.2em] uppercase max-w-2xl mx-auto leading-relaxed mb-10 sm:mb-12 font-light"
                >
                  Bespoke fine-art visual execution based in Piduguralla. We write your moments onto luxury cinematic canvases.
                </motion.p>

                {/* Action CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.5, duration: 1.0, ease: "easeOut" }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto"
                >
                  {/* Book Session Button with Glow border */}
                  <button
                    onClick={() => handleScrollTo("#booking")}
                    className="relative w-full sm:w-auto min-h-[44px] px-8 py-3.5 bg-gold text-primary font-bold text-xs tracking-[0.2em] uppercase hover:bg-gold-light transition-all duration-300 flex items-center justify-center space-x-2 group shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Your Session</span>
                  </button>

                  {/* View Portfolio Button */}
                  <button
                    onClick={() => handleScrollTo("#portfolio")}
                    className="relative w-full sm:w-auto min-h-[44px] px-8 py-3.5 bg-transparent border border-white/20 text-white font-bold text-xs tracking-[0.2em] uppercase hover:border-gold hover:text-gold transition-all duration-300 flex items-center justify-center space-x-2 group"
                  >
                    <Camera className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                    <span>View Portfolio</span>
                  </button>

                  {/* Watch Films Button */}
                  <button
                    onClick={() => handleScrollTo("#films")}
                    className="relative w-full sm:w-auto min-h-[44px] px-8 py-3.5 bg-[#111]/80 backdrop-blur-sm border border-gold/20 text-gold hover:text-primary font-bold text-xs tracking-[0.2em] uppercase flex items-center justify-center space-x-2 group overflow-hidden"
                  >
                    {/* Sliding hover fill background */}
                    <span className="absolute inset-0 w-full h-full bg-gold transform scale-x-0 origin-left transition-transform duration-500 cubic-bezier(0.25, 1, 0.5, 1) group-hover:scale-x-100 -z-10" />
                    <Play className="w-3.5 h-3.5 fill-gold group-hover:fill-primary group-hover:text-primary" />
                    <span>Watch Cinematic Films</span>
                  </button>
                </motion.div>

                {/* Animated Scroll Down Indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 3.2, duration: 1.0 }}
                  onClick={() => handleScrollTo("#portfolio")}
                  className="absolute bottom-8 cursor-pointer group flex flex-col items-center space-y-2"
                >
                  <span className="text-[9px] text-white/30 tracking-[0.35em] uppercase font-light group-hover:text-gold transition-colors duration-300">
                    Scroll to Explore
                  </span>
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    <ArrowDown className="w-4 h-4 text-white/30 group-hover:text-gold transition-colors duration-300" />
                  </motion.div>
                </motion.div>

              </div>
            </section>

            {/* SECTIONS */}
            <Portfolio />
            <Services />
            <Films />
            <About />
            <Reviews />
            <Booking />
            <Contact />

            {/* FOOTER */}
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
