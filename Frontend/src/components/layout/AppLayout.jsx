import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useSearchParams, useLocation } from "react-router";
import { useAuth } from "../../features/auth/Hook/useAuth";
import { useCart } from "../../features/cart/hook/useCart";
import { useTheme } from "../../hooks/useTheme";
import Footer from "./Footer";

// Import the boutique panorama image for the global inner page backdrop
import panoramaImg from "../../app/assets/boutique-panorama.png";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { handleLogout, user } = useAuth();
  const { cartItems, handleGetCart } = useCart();
  const { theme, toggleTheme } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Fetch cart items on layout mount to sync cart badge
  useEffect(() => {
    if (user) {
      handleGetCart();
    }
  }, [user, handleGetCart]);

  // Sync search input with URL search param
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  // Scroll Listener for Navbar Sizing Transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buyer?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/buyer");
    }
  };

  const onLogout = async () => {
    try {
      setIsLoggingOut(true);
      await handleLogout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const totalCartCount = (cartItems || []).reduce((acc, item) => acc + Number(item.quantity || 1), 0);

  const isHome = location.pathname === "/buyer";

  // Dynamic header sizing classes based on scroll state
  const headerClasses = isScrolled
    ? "w-[85%] h-12 border border-[#E5DCCB]/30 bg-[#0D0D0D]/95 shadow-2xl"
    : "w-[94%] max-w-6xl h-16 border border-[#E5DCCB]/25 bg-[#0D0D0D]/90 shadow-lg";

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#171513] transition-colors duration-300 flex flex-col font-sans overflow-x-hidden">
      
      {/* 1. Global Fixed Backdrop for Inner Pages (e.g. Cart, Product Details) */}
      {!isHome && (
        <div className="fixed top-0 left-0 right-0 h-[45vh] z-0 overflow-hidden bg-black">
          <img
            src={panoramaImg}
            alt="Boutique Gallery"
            className="w-full h-full object-cover select-none pointer-events-none opacity-40 scale-105"
          />
          {/* Subtle dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-[#0D0D0D]/75 z-1"></div>
        </div>
      )}

      {/* 2. Fixed centered wrapper for floating header (resolves the top white bar issue) */}
      {/* Set pointer-events-none on wrapper so scroll/click pass to main content underneath */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none flex justify-center px-4 pt-4 transition-all duration-300">
        <header className={`transition-all duration-300 ease-out pointer-events-auto flex items-center justify-between rounded-2xl text-[#F7F3EB] backdrop-blur-md ${headerClasses}`}>
          <div className="w-full px-6 md:px-8">
            <div className="flex items-center justify-between gap-4">
              
              {/* Left: Brand Logo in Gold */}
              <div className="flex items-center">
                <Link to="/buyer" className="flex items-center gap-2 group">
                  <span className="font-brand text-xs sm:text-sm font-bold tracking-[0.25em] text-[#C8A96A] transition duration-300 hover:text-[#D8B77A]">
                    THE A&R STORE
                  </span>
                  <span className="hidden sm:inline-block rounded-md border border-[#C8A96A]/20 bg-[#C8A96A]/5 px-2 py-0.5 text-[6px] font-bold uppercase tracking-widest text-[#C8A96A]">
                    BUYER
                  </span>
                </Link>
              </div>

              {/* Center: Search Bar */}
              <form 
                onSubmit={handleSearchSubmit} 
                className="hidden md:flex flex-1 max-w-sm mx-4 relative"
              >
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search boutique drops..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-10 text-[10px] bg-[#1A1A1A] border border-[#E5DCCB]/15 text-[#F7F3EB] placeholder-[#8B867E] focus:border-[#C8A96A] outline-none transition duration-205 rounded-lg h-8"
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-0 h-full w-10 flex items-center justify-center transition cursor-pointer text-[#F7F3EB]/60 hover:text-[#C8A96A]"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>

              {/* Right: Actions */}
              <div className="hidden md:flex items-center gap-4">
                
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-1.5 transition cursor-pointer text-[#F7F3EB]/80 hover:text-[#C8A96A]"
                  title="Toggle Theme"
                >
                  {theme === "dark" ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>

                {/* Wishlist */}
                <Link
                  to="/buyer"
                  className="p-1.5 relative transition text-[#F7F3EB]/80 hover:text-[#C8A96A]"
                  title="Wishlist"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Wishlist EARLY ACCESS is coming in the next boutique drop!");
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#C8A96A] rounded-full"></span>
                </Link>

                {/* Cart */}
                <Link
                  to="/buyer/cart"
                  className="p-1.5 relative transition text-[#F7F3EB]/80 hover:text-[#C8A96A]"
                  title="Your Cart"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {totalCartCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[7px] font-brand font-bold bg-[#C8A96A] text-[#0D0D0D]">
                      {totalCartCount}
                    </span>
                  )}
                </Link>

                {/* User / Logout */}
                <div className="flex items-center gap-3 border-l border-[#E5DCCB]/15 pl-4">
                  <span className="text-[8px] font-brand font-bold uppercase tracking-wider text-[#F7F3EB]/70">
                    {user?.fullname?.split(" ")[0] || "Guest"}
                  </span>
                  <button
                    onClick={onLogout}
                    disabled={isLoggingOut}
                    className="px-3 py-1.5 text-[8px] font-brand font-bold uppercase tracking-widest transition cursor-pointer disabled:opacity-50 bg-[#C8A96A] text-[#0D0D0D] hover:bg-[#D8B77A] rounded-md"
                  >
                    {isLoggingOut ? "..." : "Logout"}
                  </button>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center gap-3 md:hidden">
                <button onClick={toggleTheme} className="p-2 text-[#F7F3EB]">
                  {theme === "dark" ? "☀️" : "🌙"}
                </button>

                <Link to="/buyer/cart" className="p-2 relative text-[#F7F3EB]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {totalCartCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[7px] font-bold bg-[#C8A96A] text-[#0D0D0D]">
                      {totalCartCount}
                    </span>
                  )}
                </Link>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-[#F7F3EB]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>

            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="absolute top-16 left-0 right-0 border border-[#E5DCCB]/20 rounded-xl bg-[#0D0D0D] p-4 space-y-4 shadow-xl z-50 pointer-events-auto text-[#F7F3EB]">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 pl-4 pr-10 border border-[#E5DCCB]/15 bg-[#1A1A1A] text-[10px] text-[#F7F3EB] placeholder-[#8B867E] focus:border-[#C8A96A] outline-none rounded-md"
                />
                <button type="submit" className="absolute right-0 top-0 h-8 w-10 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>

              <div className="flex flex-col gap-2 pt-2">
                <Link 
                  to="/buyer" 
                  className="py-2 text-[#F7F3EB]/80 text-[10px] font-brand font-semibold uppercase tracking-wider"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Collection
                </Link>
                <button
                  className="py-2 text-left text-[#F7F3EB]/80 text-[10px] font-brand font-semibold uppercase tracking-wider"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    alert("Wishlist feature coming soon!");
                  }}
                >
                  Wishlist
                </button>
                <div className="border-t border-[#E5DCCB]/15 pt-4 flex items-center justify-between">
                  <span className="text-[10px] text-[#C8A96A] font-brand font-bold uppercase">
                    {user?.fullname || "Guest User"}
                  </span>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    disabled={isLoggingOut}
                    className="bg-[#C8A96A] text-[#0D0D0D] hover:bg-[#D8B77A] px-4 py-2 text-[10px] font-brand font-bold uppercase tracking-wider rounded-md"
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </header>
      </div>

      {/* 3. Main Page Content Area */}
      {/* Home page renders directly; other pages display inside a rounded overlap card */}
      <main className={`flex-1 w-full mx-auto relative z-10 ${isHome ? "" : "pt-[32vh]"}`}>
        {isHome ? (
          <Outlet />
        ) : (
          <div className="relative z-20 bg-[#FBF9F4] rounded-t-[36px] border-t border-[#E5DCCB] shadow-[0_-15px_40px_rgba(20,17,12,0.05)] px-4 sm:px-6 lg:px-8 py-10 min-h-[70vh]">
            <div className="max-w-7xl mx-auto text-left">
              <Outlet />
            </div>
          </div>
        )}
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}
