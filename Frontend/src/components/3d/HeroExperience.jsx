import { useState, useEffect, useRef } from "react";
import panoramaImg from "../../app/assets/boutique-panorama.png";

export default function HeroExperience({ isExploring }) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  
  // Track mouse coordinates
  const mouseCoords = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Map screen coordinates to -1 to +1 range
      mouseCoords.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseCoords.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animate image position using requestAnimationFrame and lerp for absolute smoothness
  useEffect(() => {
    let animId;
    let currentX = 0;
    let currentY = 0;

    const animate = () => {
      // Accessibility check for prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        if (imageRef.current) {
          imageRef.current.style.transform = `translate3d(0, 0, 0) scale(1.1)`;
        }
        animId = requestAnimationFrame(animate);
        return;
      }

      // Dynamic sensitivity based on screen width (Responsiveness)
      const width = window.innerWidth;
      const isMobile = width < 640;
      const isTablet = width >= 640 && width < 1024;

      // Sensitivity translate limits (percentage bounds)
      let limitPercentX = isExploring ? 6.0 : 2.5; 
      let limitPercentY = isExploring ? 3.5 : 1.2;

      if (isMobile) {
        limitPercentX *= 0.15;
        limitPercentY *= 0.15;
      } else if (isTablet) {
        limitPercentX *= 0.5;
        limitPercentY *= 0.5;
      }

      const targetX = mouseCoords.current.x * limitPercentX;
      const targetY = -mouseCoords.current.y * limitPercentY; // Invert to simulate natural panning

      // Lerp/Damping calculation
      currentX += (targetX - currentX) * 0.045;
      currentY += (targetY - currentY) * 0.045;

      if (imageRef.current) {
        // Shift image in opposite direction to simulate camera panning
        imageRef.current.style.transform = `translate3d(${-currentX}%, ${-currentY}%, 0) scale(1.15)`;
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animId);
  }, [isExploring]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden bg-black flex items-center justify-center"
    >
      {/* Background panoramic image with 15% bleed margin for panning space */}
      <img
        ref={imageRef}
        src={panoramaImg}
        alt="Boutique Showroom"
        className="w-full h-full object-cover select-none pointer-events-none transition-transform will-change-transform duration-75"
        style={{
          transform: "translate3d(0, 0, 0) scale(1.15)"
        }}
      />
      
      {/* Dark luxury vignette overlay over image to make text legible */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/80 pointer-events-none z-1"></div>
    </div>
  );
}
