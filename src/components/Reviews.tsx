"use client";

import { useEffect, useState, useRef } from "react";
import { Star, Quote } from "lucide-react";

interface Review {
  id: number;
  name: string;
  role: string;
  text: string;
  rating: number;
  location: string;
}

const REVIEWS: Review[] = [
  {
    id: 1,
    name: "Raviteja K.",
    role: "Groom",
    text: "Satish and his crew were spectacular. The wedding film they put together felt like a feature film! The coloring and shots were beyond what we expected.",
    rating: 5,
    location: "Guntur"
  },
  {
    id: 2,
    name: "Sujatha V.",
    role: "Bride",
    text: "The portrait quality in the Haldi ceremony shoot was stunning. They made us feel so comfortable, and the final flush-mount album is a work of art.",
    rating: 5,
    location: "Piduguralla"
  },
  {
    id: 3,
    name: "Narendra M.",
    role: "Client",
    text: "Absolutely top-tier photography service. The drone mapping and live broadcast streams were seamless. All our relatives abroad watched the wedding in crystal clear quality.",
    rating: 5,
    location: "Vijayawada"
  },
  {
    id: 4,
    name: "Anusha R.",
    role: "Bride",
    text: "Our pre-wedding outdoor session felt like a Bollywood video. Satish selected the perfect locations and timings to catch the sunrise. highly recommend!",
    rating: 5,
    location: "Hyderabad"
  },
  {
    id: 5,
    name: "Dr. Srinivas",
    role: "Parent of Bride",
    text: "Extremely professional team. They showed up early, set up grand cinematic lighting rigs, and caught all traditional family actions without causing any disruption.",
    rating: 5,
    location: "Narasaraopet"
  }
];

export default function Reviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % REVIEWS.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="reviews" className="py-24 relative bg-primary overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-gold-radial opacity-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs text-gold tracking-[0.3em] uppercase block mb-3 font-semibold">
            Client Appreciations
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-light tracking-wide text-white">
            Words of Satisfaction
          </h2>
          <div className="w-12 h-[1px] bg-gold mx-auto mt-6" />
        </div>

        {/* Big Testimonial Display */}
        <div className="relative glass-panel p-8 md:p-16 border border-white/5 overflow-hidden min-h-[300px] flex flex-col justify-between">
          {/* Quote mark backgrounds */}
          <Quote className="absolute right-8 top-8 w-24 h-24 text-white/5 pointer-events-none" />
          <Quote className="absolute left-8 bottom-8 w-24 h-24 text-white/5 pointer-events-none rotate-180" />

          {/* Testimonial slides container */}
          <div className="relative w-full overflow-hidden">
            {REVIEWS.map((review, idx) => {
              if (idx !== activeIndex) return null;
              return (
                <div
                  key={review.id}
                  className="space-y-6 animate-fade-in"
                >
                  {/* Rating Stars */}
                  <div className="flex items-center space-x-1 justify-center md:justify-start">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm md:text-lg font-light leading-relaxed tracking-wide text-center md:text-left text-white/80 italic font-serif">
                    &ldquo;{review.text}&rdquo;
                  </p>

                  {/* Client Info */}
                  <div className="flex items-center justify-center md:justify-start space-x-4 pt-4 border-t border-white/5">
                    {/* Placeholder Avatar with luxury initials */}
                    <div className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center bg-gold/10 text-gold text-xs font-bold font-mono">
                      {review.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm text-white font-semibold tracking-wider font-sans">
                        {review.name}
                      </h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5 font-light">
                        {review.role} • {review.location}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Slide dots indicator */}
          <div className="flex justify-center space-x-2.5 mt-8 relative z-25">
            {REVIEWS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  idx === activeIndex ? "w-8 bg-gold" : "w-2.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
