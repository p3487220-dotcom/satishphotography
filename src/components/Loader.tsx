"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Lock body scroll
    document.body.style.overflow = "hidden";

    // Simulate loading progress with organic speed changes
    let current = 0;
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 12) + 4; // Organic speed increments
      current = Math.min(current + increment, 100);
      setProgress(current);

      if (current === 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsDone(true);
          // Unlock body scroll
          document.body.style.overflow = "";
          setTimeout(onComplete, 800); // Trigger page reveal
        }, 500);
      }
    }, 120);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            filter: "blur(20px)",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-primary"
        >
          {/* Subtle gold background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gold-radial pointer-events-none opacity-50" />

          {/* Logo S Container */}
          <div className="relative mb-8 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-8xl md:text-9xl font-serif text-gold-gradient font-light select-none tracking-widest"
            >
              S
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-[10px] md:text-xs text-gold font-light tracking-[0.4em] uppercase mt-2"
            >
              Satish Photography
            </motion.div>
          </div>

          {/* Progress Bar Container */}
          <div className="w-[180px] md:w-[240px] relative flex flex-col items-center">
            {/* Outer Track */}
            <div className="w-full h-[1px] bg-white/10 overflow-hidden relative">
              {/* Active Progress Fill */}
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-gold/50 to-gold"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeInOut" }}
              />
            </div>

            {/* Percentage Text */}
            <div className="mt-3 flex items-center justify-between w-full">
              <span className="text-[9px] text-white/40 tracking-[0.2em] uppercase font-light">
                EXQUISITE GALLERY
              </span>
              <span className="text-[10px] text-gold font-mono font-light tracking-wider">
                {progress}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
