"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [cursorType, setCursorType] = useState<"default" | "hover" | "view">("default");

  useEffect(() => {
    // Check if device is touch or mobile
    if (typeof window !== "undefined") {
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      if (isTouch) return;
      
      document.documentElement.classList.add("custom-cursor-enabled");
    }

    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!dot || !ring) return;

    // Set initial position
    gsap.set(dot, { xPercent: -50, yPercent: -50 });
    gsap.set(ring, { xPercent: -50, yPercent: -50 });

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };

    const setDotX = gsap.quickSetter(dot, "x", "px");
    const setDotY = gsap.quickSetter(dot, "y", "px");
    const setRingX = gsap.quickSetter(ring, "x", "px");
    const setRingY = gsap.quickSetter(ring, "y", "px");

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("mousemove", onMouseMove);

    // GSAP ticker for smooth easing interpolation
    const updateCursor = () => {
      // Direct instant follow for dot
      pos.x += (mouse.x - pos.x) * 0.25;
      pos.y += (mouse.y - pos.y) * 0.25;
      setDotX(pos.x);
      setDotY(pos.y);

      // Slower spring lag for outer ring
      setRingX(pos.x);
      setRingY(pos.y);
    };

    gsap.ticker.add(updateCursor);

    // Hover state management
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const closestInteractive = target.closest("a, button, [role='button'], input, select, textarea");
      const closestPortfolio = target.closest("[data-cursor='view']");

      if (closestPortfolio) {
        setCursorType("view");
      } else if (closestInteractive) {
        setCursorType("hover");
      } else {
        setCursorType("default");
      }
    };

    const handleMouseOut = () => {
      setCursorType("default");
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      gsap.ticker.remove(updateCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.documentElement.classList.remove("custom-cursor-enabled");
    };
  }, []);

  // Determine class names
  let containerClass = "";
  if (cursorType === "hover") containerClass = "cursor-hover";
  if (cursorType === "view") containerClass = "cursor-view";

  return (
    <div className={`hidden lg:block pointer-events-none fixed inset-0 z-[99999] ${containerClass}`}>
      <div
        ref={dotRef}
        className="custom-cursor fixed top-0 left-0"
      />
      <div
        ref={ringRef}
        className="custom-cursor-ring fixed top-0 left-0 flex items-center justify-center"
      >
        {cursorType === "view" && (
          <span className="text-[9px] text-gold tracking-[0.2em] font-semibold font-sans mt-0.5 select-none animate-pulse">
            VIEW
          </span>
        )}
      </div>
    </div>
  );
}
