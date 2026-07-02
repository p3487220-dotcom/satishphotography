"use client";

import { motion } from "framer-motion";
import { 
  LucideIcon,
  Camera, 
  Video, 
  Sparkles, 
  Heart, 
  Crown, 
  Sunset, 
  Home, 
  Smile, 
  Layers, 
  BookOpen, 
  Tv, 
  Compass, 
  Radio 
} from "lucide-react";

interface ServiceItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const SERVICES: ServiceItem[] = [
  {
    icon: Camera,
    title: "Wedding Photography",
    description: "Fine art capturing of your most sacred vows with a perfect balance of candid emotion and artistic framing."
  },
  {
    icon: Video,
    title: "Wedding Cinematography",
    description: "4K ultra-high-definition cinematic videos detailing your story with premium grading, music, and layout."
  },
  {
    icon: Sunset,
    title: "Pre Wedding Shoots",
    description: "Elegant, dreamy outdoor storytelling sessions at breathtaking settings capturing natural chemistry."
  },
  {
    icon: Heart,
    title: "Engagement Portfolio",
    description: "Beautiful snapshots highlighting the joy and spark of your formal engagement ceremony."
  },
  {
    icon: Crown,
    title: "Half Saree Ceremony",
    description: "Traditional family milestone coverage executed with deep cultural respect and premium portraits."
  },
  {
    icon: Compass,
    title: "Outdoor Shoots",
    description: "Creative location-based portraiture taking advantage of organic landscapes and twilight golden hours."
  },
  {
    icon: Home,
    title: "Indoor Shoots",
    description: "Professional studio shoots with controlled luxury modifiers, strobe modeling, and high-fashion backdrops."
  },
  {
    icon: Smile,
    title: "Baby Photography",
    description: "Patient, adorable, and extremely safe portraiture capturing baby giggles and pure initial years."
  },
  {
    icon: Sparkles,
    title: "Fashion Photography",
    description: "Editorial photography designed for brands, models, and personal styling catalogs."
  },
  {
    icon: BookOpen,
    title: "Album Designing",
    description: "Flush-mount leather albums printed on premier archival paper, handcrafted to tell a visual story."
  },
  {
    icon: Layers,
    title: "Video Editing",
    description: "High-grade color correction, multi-cam synchronization, and sound engineering for absolute cinema."
  },
  {
    icon: Sunset, // Using Sunset for Drone/Aerial
    title: "Drone Videography",
    description: "Stunning high-altitude 4K aerial storytelling to bring grand scale and cinematic motion to your celebration."
  },
  {
    icon: Radio,
    title: "Live Streaming",
    description: "Buffer-free multi-camera broadcast setups ensuring family globally can witness your wedding in HD."
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 relative bg-primary overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-gold-radial opacity-15 pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] bg-gold-radial opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-xs text-gold tracking-[0.3em] uppercase block mb-3 font-semibold">
            Signature Services
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-light tracking-wide text-white">
            What We Master
          </h2>
          <div className="w-12 h-[1px] bg-gold mx-auto mt-6" />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="glass-panel p-8 group relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-gold/30 border border-white/5"
              >
                {/* Thin gold backing card border on hover */}
                <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/30 z-10 pointer-events-none transition-all duration-500 m-3" />
                
                {/* Gold Glow inside */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-gold/5 rounded-full blur-xl group-hover:bg-gold/10 transition-colors duration-500" />

                {/* Icon Container */}
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6 group-hover:border-gold/40 group-hover:bg-gold/10 transition-all duration-500">
                  <Icon className="w-5 h-5 text-white/70 group-hover:text-gold transition-colors duration-500" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-serif font-light text-white mb-3 group-hover:text-gold transition-colors duration-300">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-white/50 leading-relaxed font-light tracking-wide">
                  {service.description}
                </p>

                {/* Action arrow element */}
                <div className="w-0 group-hover:w-8 h-[1px] bg-gold/50 transition-all duration-500 mt-6" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
