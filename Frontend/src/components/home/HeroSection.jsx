import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroSection({ onExploreClick, isExploring, setIsExploring }) {
  const containerRef = useRef();
  const contentRef = useRef();
  const exploreOverlayRef = useRef();

  useEffect(() => {
    // Animate transition between normal branding and explore modes
    if (isExploring) {
      gsap.to(contentRef.current, { opacity: 0, y: -20, duration: 0.5, pointerEvents: "none" });
      gsap.fromTo(exploreOverlayRef.current, 
        { opacity: 0, scale: 1.01 }, 
        { opacity: 1, scale: 1, duration: 0.8, pointerEvents: "auto", delay: 0.3 }
      );
    } else {
      gsap.to(exploreOverlayRef.current, { opacity: 0, scale: 1.01, duration: 0.4, pointerEvents: "none" });
      gsap.fromTo(contentRef.current, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.7, pointerEvents: "auto", delay: 0.2 }
      );
    }
  }, [isExploring]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 flex flex-col justify-between items-center text-center px-6 py-12 z-20 pointer-events-none select-none"
    >
      {/* 1. Standard Branding Mode Overlay */}
      <div 
        ref={contentRef}
        className="my-auto max-w-3xl space-y-6 flex flex-col items-center pointer-events-auto"
      >
        {/* Eyebrow Label */}
        <span className="block text-[10px] font-brand font-bold tracking-[0.4em] text-[#C8A96A] uppercase">
          CURATED SIGNATURE BOUTIQUE
        </span>
        
        {/* Playfair Heading */}
        <h1 className="font-serif text-5xl sm:text-7xl font-light tracking-wide leading-tight text-[#FBF9F4] uppercase">
          CURATED <br />
          <span className="font-serif italic text-[#C8A96A]">SIGNATURE</span> <br />
          BOUTIQUE
        </h1>
        
        {/* Description */}
        <p className="text-xs sm:text-sm max-w-lg mx-auto text-[#F7F3EB]/80 font-sans font-light tracking-widest leading-relaxed">
          Timeless details, luxury materials, <br />
          and contemporary craftsmanship.
        </p>

        {/* Action Buttons */}
        <div className="pt-6 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setIsExploring(true)}
            className="px-8 py-3.5 bg-[#C8A96A] hover:bg-[#D8B77A] text-[#0D0D0D] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg text-[10px] font-sans font-semibold uppercase tracking-[0.12em] cursor-pointer rounded-full"
          >
            Explore Showroom
          </button>
          
          <button
            onClick={onExploreClick}
            className="px-8 py-3.5 border border-[#FBF9F4] text-[#FBF9F4] hover:bg-[#FBF9F4] hover:text-[#0D0D0D] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg text-[10px] font-sans font-semibold uppercase tracking-[0.12em] cursor-pointer rounded-full"
          >
            Shop Collection
          </button>
        </div>

        {/* Bounce Scroll Indicator */}
        <div className="pt-10 flex flex-col items-center gap-2 text-[8px] font-sans font-bold uppercase tracking-[0.3em] text-[#C8A96A] animate-pulse">
          <span>Scroll to explore</span>
          <span className="animate-bounce text-xs mt-1">↓</span>
        </div>
      </div>

      {/* 2. Interactive Showroom Exploration Mode Overlay */}
      <div 
        ref={exploreOverlayRef}
        className="absolute inset-0 flex flex-col justify-between items-center p-8 pointer-events-none opacity-0"
      >
        {/* Top visual borders for camera frame feel */}
        <div className="w-full flex justify-between border-t border-x border-[#C8A96A]/20 h-10 px-4 pt-2">
          <span className="text-[7px] font-sans font-bold tracking-widest text-[#C8A96A]/40">REC // LUXURY VAULT</span>
          <span className="text-[7px] font-sans font-bold tracking-widest text-[#C8A96A]/40">360° ACTIVE PANNING</span>
        </div>

        {/* Center Look Around Guide */}
        <div className="bg-[#0D0D0D]/90 border border-[#C8A96A]/30 p-4 max-w-xs text-center space-y-1 rounded-xl shadow-xl">
          <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#C8A96A] block">
            Showroom Active
          </span>
          <p className="text-[8px] text-stone-300 tracking-wider leading-relaxed font-light uppercase">
            Move your cursor across the screen to look around the boutique gallery.
          </p>
        </div>

        {/* Bottom Exit Button */}
        <div className="w-full flex flex-col items-center gap-4 border-b border-x border-[#C8A96A]/20 h-20 pb-4 justify-end pointer-events-auto">
          <button
            onClick={() => setIsExploring(false)}
            className="px-6 py-2.5 bg-[#C8A96A] text-[#0D0D0D] hover:bg-[#D8B77A] transition-all duration-300 text-[9px] font-sans font-bold uppercase tracking-[0.12em] cursor-pointer rounded-full border border-[#C8A96A]/40"
          >
            Exit Showroom ✕
          </button>
        </div>
      </div>
    </div>
  );
}
