import React from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../auth/Hook/useAuth";
import { useTheme } from "../../../hooks/useTheme";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { handleLogout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const onLogout = async () => {
    try {
      await handleLogout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <main className="min-h-screen bg-[#FBF9F4] text-[#171513] pb-16 transition-colors duration-300 font-sans">
      {/* Seller Top Navbar */}
      <header className="border-b border-[#E5DCCB] bg-[#FFFDF8]/95 sticky top-0 z-40 backdrop-blur-md">
        <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link to="/seller" className="flex items-center gap-2 group">
              <span className="font-brand text-lg font-bold tracking-[0.25em] text-[#C8A96A] hover:text-[#D8B77A] transition duration-300">
                THE A&R STORE
              </span>
              <span className="rounded-md border border-[#C8A96A]/20 bg-[#C8A96A]/5 px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-[#C8A96A]">
                Studio
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#716B63]">
              <Link to="/seller" className="text-[#C8A96A] transition">
                Dashboard
              </Link>
              <Link to="/seller/viewproduct" className="hover:text-[#C8A96A] transition">
                Products Catalog
              </Link>
              <Link to="/seller/createproduct" className="hover:text-[#C8A96A] transition">
                Add Product
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="h-9 w-9 rounded-md border border-[#E5DCCB] text-xs flex items-center justify-center hover:bg-[#F7F3EB] transition cursor-pointer text-[#171513]"
              title="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            {/* Logout Button */}
            <div className="flex items-center gap-3 border-l border-[#E5DCCB] pl-4">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#716B63]">
                {user?.fullname || "Seller Studio"}
              </span>
              <button
                onClick={onLogout}
                className="rounded-full bg-[#C8A96A] text-[#0D0D0D] hover:bg-[#D8B77A] px-4 py-1.5 text-[9px] font-sans font-bold uppercase tracking-widest transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 space-y-10 text-left">
        
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E5DCCB] pb-6">
          <div>
            <h1 className="font-brand text-2xl sm:text-3xl font-light tracking-widest text-[#171513] uppercase">
              STUDIO DASHBOARD
            </h1>
            <p className="mt-2 text-[10px] font-sans font-bold tracking-[0.15em] text-[#716B63] uppercase">
              Manage inventory, launch product lines, and track studio growth
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-4">
            <Link
              to="/seller/createproduct"
              className="flex h-10 px-6 items-center justify-center bg-[#C8A96A] text-[#0D0D0D] hover:bg-[#D8B77A] text-[9px] font-sans font-bold uppercase tracking-widest transition rounded-full shadow-sm"
            >
              Add Boutique Line
            </Link>
            <Link
              to="/seller/viewproduct"
              className="flex h-10 px-6 items-center justify-center border border-[#886D3B] text-[#171513] hover:bg-[#C8A96A] hover:text-[#0D0D0D] hover:border-transparent text-[9px] font-sans font-bold uppercase tracking-widest transition rounded-full"
            >
              View Inventory
            </Link>
          </div>
        </div>

        {/* Dashboard Grid Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#716B63]">
              Total Revenue
            </span>
            <p className="mt-2 font-serif text-3xl font-light text-[#171513]">
              ₹8,49,200
            </p>
            <span className="text-[8px] font-sans font-bold text-[#66745A] uppercase tracking-wider">
              ↑ 12% from last month
            </span>
          </Card>

          <Card className="p-6">
            <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#716B63]">
              Studio Products
            </span>
            <p className="mt-2 font-serif text-3xl font-light text-[#171513]">
              18
            </p>
            <span className="text-[8px] font-sans font-bold text-[#9A948B] uppercase tracking-wider">
              4 Categories active
            </span>
          </Card>

          <Card className="p-6">
            <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#716B63]">
              Fulfillment Rate
            </span>
            <p className="mt-2 font-serif text-3xl font-light text-[#171513]">
              98.4%
            </p>
            <span className="text-[8px] font-sans font-bold text-[#66745A] uppercase tracking-wider">
              Excellent Standing
            </span>
          </Card>

          <Card className="p-6">
            <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#716B63]">
              Vault Items Insured
            </span>
            <p className="mt-2 font-serif text-3xl font-light text-[#171513]">
              142
            </p>
            <span className="text-[8px] font-sans font-bold text-[#9A948B] uppercase tracking-wider">
              Insured boutique delivery
            </span>
          </Card>
        </div>

        {/* Informative Block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="border border-[#E5DCCB] bg-[#FFFDF8] p-8 rounded-[18px] space-y-4 shadow-[0_10px_30px_rgba(20,17,12,0.04)]">
            <h3 className="font-brand text-xs font-bold tracking-[0.2em] text-[#886D3B] uppercase">
              STUDIO ANALYTICS
            </h3>
            <p className="text-xs text-[#716B63] leading-relaxed font-light font-sans">
              We are working to sync real-time sales and customer analytics graphs here soon. In the meantime, use the header links to manage listings and create new boutique drop variations.
            </p>
          </div>

          <div className="border border-[#E5DCCB] bg-[#FFFDF8] p-8 rounded-[18px] space-y-4 shadow-[0_10px_30px_rgba(20,17,12,0.04)]">
            <h3 className="font-brand text-xs font-bold tracking-[0.2em] text-[#171513] uppercase">
              DELIVERY SYSTEM UPDATE
            </h3>
            <p className="text-xs text-[#716B63] leading-relaxed font-light font-sans">
              Insured courier delivery services have been integrated for shipping out your high-end collections. Every purchase is tracked automatically via our buyer vaults.
            </p>
          </div>
        </div>

      </section>
    </main>
  );
}
