"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import Image from "next/image";

interface PortfolioItem {
  id: number;
  title: string;
  categories: string[];
  src: string;
  aspect: "portrait" | "landscape";
}

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 1,
    title: "The Regal Vows",
    categories: ["Wedding", "Candid", "Albums"],
    src: "/assets/wedding.webp",
    aspect: "portrait",
  },
  {
    id: 2,
    title: "Cinematic Reception",
    categories: ["Reception", "Fashion", "Albums"],
    src: "/assets/reception.webp",
    aspect: "portrait",
  },
  {
    id: 3,
    title: "Golden Hour Promise",
    categories: ["Engagement", "Pre Wedding", "Candid"],
    src: "/assets/engagement.webp",
    aspect: "portrait",
  },
  {
    id: 4,
    title: "Vibrant Haldi Glow",
    categories: ["Haldi", "Candid"],
    src: "/assets/haldi.webp",
    aspect: "portrait",
  },
  {
    id: 5,
    title: "Traditional Half Saree Elegance",
    categories: ["Half Saree", "Fashion"],
    src: "/assets/half_saree.webp",
    aspect: "portrait",
  },
  {
    id: 6,
    title: "Cherished Innocent Smiles",
    categories: ["Baby Shoot", "Indoor"],
    src: "/assets/baby.webp",
    aspect: "portrait",
  },
  {
    id: 7,
    title: "Sunlit Escapades",
    categories: ["Outdoor", "Pre Wedding", "Fashion"],
    src: "/assets/outdoor.webp",
    aspect: "landscape",
  },
  {
    id: 8,
    title: "Studio Lighting Portraits",
    categories: ["Indoor", "Fashion", "Albums", "Video Editing"],
    src: "/assets/indoor.webp",
    aspect: "landscape",
  },
  {
    id: 9,
    title: "Timeless Half Saree Grace",
    categories: ["Half Saree", "Ceremony", "Candid"],
    src: "/assets/half_saree2.jpg",
    aspect: "portrait",
  },
  {
    id: 10,
    title: "Joyful Half Saree Ritual",
    categories: ["Half Saree", "Ceremony", "Candid"],
    src: "/assets/half_saree3.jpg",
    aspect: "landscape",
  },
];

const FILTERS = [
  "All",
  "Wedding",
  "Reception",
  "Engagement",
  "Pre Wedding",
  "Haldi",
  "Half Saree",
  "Ceremony",
  "Baby Shoot",
  "Outdoor",
  "Indoor",
  "Fashion",
  "Candid",
  "Albums",
  "Video Editing",
];

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = PORTFOLIO_ITEMS.filter((item) =>
    activeFilter === "All" ? true : item.categories.includes(activeFilter)
  );

  const openLightbox = (id: number) => {
    const index = PORTFOLIO_ITEMS.findIndex((item) => item.id === id);
    setLightboxIndex(index !== -1 ? index : null);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    if (lightboxIndex === null) return;
    let nextIndex = direction === "next" ? lightboxIndex + 1 : lightboxIndex - 1;
    if (nextIndex < 0) nextIndex = PORTFOLIO_ITEMS.length - 1;
    if (nextIndex >= PORTFOLIO_ITEMS.length) nextIndex = 0;
    setLightboxIndex(nextIndex);
  };

  return (
    <section id="portfolio" className="py-24 relative bg-primary overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-gold-radial opacity-30 pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-gold-radial opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs text-gold tracking-[0.3em] uppercase block mb-3 font-semibold">
            Fine Art Exhibition
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-light tracking-wide text-white">
            Curated Portfolio
          </h2>
          <div className="w-12 h-[1px] bg-gold mx-auto mt-6" />
        </div>

        {/* Filter List */}
        <div className="flex flex-wrap justify-center gap-2 mb-16 max-w-4xl mx-auto">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 border ${
                activeFilter === filter
                  ? "border-gold bg-gold text-primary font-bold"
                  : "border-white/5 hover:border-gold/30 text-white/60 hover:text-white bg-[#111]/40"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <motion.div 
          layout
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={item.id}
                onClick={() => openLightbox(item.id)}
                data-cursor="view"
                className="break-inside-avoid relative overflow-hidden group border border-white/5 glass-panel aspect-[4/5] sm:aspect-auto cursor-none"
              >
                {/* Thin gold inner frame border showing on hover */}
                <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/40 z-20 pointer-events-none transition-all duration-500 m-3" />

                {/* Picture element */}
                <div className="relative overflow-hidden w-full h-full">
                  <Image
                    src={item.src}
                    alt={item.title}
                    width={item.aspect === "portrait" ? 800 : 1200}
                    height={item.aspect === "portrait" ? 1120 : 800}
                    className="w-full h-auto object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  {/* Subtle vignette layer */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-500 z-10" />
                </div>

                {/* Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-[9px] text-gold tracking-[0.2em] uppercase font-light">
                    {item.categories.slice(0, 2).join(" • ")}
                  </span>
                  <h3 className="text-lg font-serif font-light text-white mt-1 group-hover:text-gold transition-colors duration-300">
                    {item.title}
                  </h3>
                  {/* Expanding line */}
                  <div className="w-0 group-hover:w-16 h-[1px] bg-gold/60 transition-all duration-500 mt-3" />
                </div>

                {/* Center Maximize Icon on Hover */}
                <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="w-12 h-12 rounded-full border border-gold/30 bg-primary/40 backdrop-blur-sm flex items-center justify-center">
                    <Maximize2 className="w-4 h-4 text-gold" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Cinematic Fullscreen Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] bg-[#050505]/95 backdrop-blur-md flex items-center justify-center px-4"
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/60 hover:text-white p-2 z-50 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation controls */}
            <button
              onClick={() => navigateLightbox("prev")}
              className="absolute left-6 text-white/40 hover:text-white p-3 z-50 transition-colors bg-white/5 rounded-full"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={() => navigateLightbox("next")}
              className="absolute right-6 text-white/40 hover:text-white p-3 z-50 transition-colors bg-white/5 rounded-full"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Central Media Container */}
            <div className="relative max-w-5xl w-full h-[70vh] md:h-[80vh] flex flex-col items-center justify-center">
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative max-h-full max-w-full flex items-center justify-center"
              >
                {/* Gold outer border around lightbox image */}
                <div className="absolute inset-0 border border-gold/30 -m-3 pointer-events-none" />
                <Image
                  src={PORTFOLIO_ITEMS[lightboxIndex].src}
                  alt={PORTFOLIO_ITEMS[lightboxIndex].title}
                  width={PORTFOLIO_ITEMS[lightboxIndex].aspect === "portrait" ? 900 : 1600}
                  height={PORTFOLIO_ITEMS[lightboxIndex].aspect === "portrait" ? 1200 : 900}
                  className="max-h-[65vh] md:max-h-[75vh] w-auto object-contain"
                />
              </motion.div>

              {/* Lightbox Caption */}
              <div className="mt-8 text-center">
                <span className="text-[10px] text-gold tracking-[0.25em] uppercase font-light">
                  {PORTFOLIO_ITEMS[lightboxIndex].categories.join("  |  ")}
                </span>
                <h3 className="text-xl md:text-2xl font-serif font-light text-white mt-2">
                  {PORTFOLIO_ITEMS[lightboxIndex].title}
                </h3>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
