import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { useProduct } from "../../products/Hook/useProduct";
import HeroExperience from "../../../components/3d/HeroExperience";
import HeroSection from "../../../components/home/HeroSection";
import CollectionSection from "../../../components/home/CollectionSection";
import FeaturedSection from "../../../components/home/FeaturedSection";
import BenefitsSection from "../../../components/home/BenefitsSection";
import Footer from "../../../components/layout/Footer";

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { handlegetallproducts } = useProduct();
  const [searchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isExploring, setIsExploring] = useState(false);
  
  const heroContainerRef = useRef();
  const scrollRef = useRef();
  const lenisRef = useRef(null);

  const searchQuery = searchParams.get("search") || "";

  // 1. Fetch catalog products on mount
  useEffect(() => {
    async function fetchCatalog() {
      try {
        setLoading(true);
        const data = await handlegetallproducts();
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to load catalog products:", err);
        setError("Could not load products. Please reload.");
      } finally {
        setLoading(false);
      }
    }
    fetchCatalog();
  }, [handlegetallproducts]);

  // 2. Filter products based on search query
  const filteredProducts = products.filter((p) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.title?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    );
  });

  // 3. Scroll lock control when exploring
  useEffect(() => {
    if (isExploring) {
      if (lenisRef.current) lenisRef.current.stop();
      document.body.style.overflow = "hidden";
    } else {
      if (lenisRef.current) lenisRef.current.start();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isExploring]);

  // 4. Smooth Scrolling (Lenis) and GSAP Pinning/Overlapping animations
  useEffect(() => {
    if (loading) return;

    // Get the global Lenis instance
    const lenis = window.lenis;
    if (!lenis) return;

    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        return arguments.length ? lenis.scrollTo(value, { immediate: true }) : lenis.scroll;
      },
    });

    // GSAP ScrollTrigger animations
    const ctx = gsap.context(() => {
      if (heroContainerRef.current) {
        // Pin the 3D Hero section without adding pin spacer below it
        ScrollTrigger.create({
          trigger: heroContainerRef.current,
          start: "top top",
          end: "+=100%", // pin for 1 viewport height
          pin: true,
          pinSpacing: false, // allows scrollable content to overlay directly
          scrub: true,
        });

        // Translate the entire scrollable content wrapper from 100vh up to 0vh
        const contentEl = document.getElementById("scrollable-content");
        if (contentEl) {
          gsap.fromTo(contentEl, 
            { y: "100vh" },
            {
              y: "0vh",
              ease: "none",
              scrollTrigger: {
                trigger: heroContainerRef.current,
                start: "top top",
                end: "+=100%",
                scrub: true,
                invalidateOnRefresh: true,
              }
            }
          );
        }

        // Fade out hero content as the collection scrolls up
        gsap.to(".hero-fade-content", {
          scrollTrigger: {
            trigger: heroContainerRef.current,
            start: "top top",
            end: "bottom 30%",
            scrub: true,
          },
          opacity: 0,
          y: -80,
          scale: 0.95,
        });
      }
    });

    // Clean up
    return () => {
      lenis.destroy();
      lenisRef.current = null;
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [loading, products]);

  const handleExploreClick = () => {
    const colSection = document.getElementById("collection-section");
    if (colSection) {
      colSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Find a product to highlight as the featured signature drop
  const featuredProduct = products.length > 0 ? products[0] : null;

  return (
    <div className="w-full min-h-screen bg-[#FBF9F4] text-[#171513] selection:bg-[#C8A96A] selection:text-[#0D0D0D] transition-colors duration-300 overflow-x-hidden">
      
      {/* 1. Immersive 3D Hero Container */}
      <div 
        ref={heroContainerRef}
        className="relative w-full h-screen overflow-hidden z-10"
      >
        <HeroExperience isExploring={isExploring} />
        <div className="hero-fade-content absolute inset-0 w-full h-full">
          <HeroSection 
            onExploreClick={handleExploreClick} 
            isExploring={isExploring}
            setIsExploring={setIsExploring}
          />
        </div>
      </div>

      {/* 2. Scrollable Page Content (translates upward to overlap hero) */}
      <div id="scrollable-content" className="relative z-30">
        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center bg-[#f6f2e9] dark:bg-black rounded-t-[40px] sm:rounded-t-[64px] border-t border-[#e5dec9] dark:border-stone-900">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#b5945b] border-t-transparent"></div>
          </div>
        ) : (
          <CollectionSection 
            products={filteredProducts} 
            searchQuery={searchQuery} 
          />
        )}

        {/* 3. Featured Fashion Drop */}
        {!loading && featuredProduct && (
          <FeaturedSection product={featuredProduct} />
        )}

        {/* 4. Store Benefits Grid */}
        {!loading && (
          <BenefitsSection />
        )}

        {/* 5. Complete Footer */}
        {!loading && (
          <Footer />
        )}
      </div>

    </div>
  );
}
