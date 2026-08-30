import { Link } from "react-router";

export default function FeaturedSection({ product }) {
  if (!product) return null;

  const imageUrl = product.images?.[0]?.url || "";
  const price = product.price;

  return (
    <section className="bg-[#0D0D0D] text-[#F7F3EB] py-20 sm:py-28 px-6 sm:px-12 border-t border-white/5 overflow-hidden relative font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(#C8A96A_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]"></div>

      <div className="mx-auto max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Text Details */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-[#C8A96A]">
            EDITORIAL DROP FEATURE
          </span>
          <h2 className="font-brand text-4xl sm:text-5xl font-extralight tracking-wide leading-tight uppercase text-[#F7F3EB]">
            THE SIGNATURE <br />
            <span className="italic text-[#C8A96A]">DROP</span> EDITION
          </h2>
          <p className="text-xs sm:text-sm text-[#9A948B] font-sans font-light tracking-widest leading-relaxed">
            {product.description || "A luxury signature drop crafted with attention to details, high-end materials, and tailored proportions. Designed to elevate daily styling with minimal branding."}
          </p>
          <div className="pt-2">
            <Link
              to={`/buyer/product/${product._id}`}
              className="inline-block px-8 py-3.5 bg-[#C8A96A] text-[#0D0D0D] hover:bg-[#D8B77A] transition-all duration-300 hover:-translate-y-0.5 text-[10px] font-sans font-bold uppercase tracking-[0.12em] rounded-full shadow-md"
            >
              Secure This Drop
            </Link>
          </div>
        </div>

        {/* Right Side: Sophisticated Dark Frame Graphic */}
        <div className="lg:col-span-7">
          {/* Black Outer Frame with thin gold border */}
          <div className="relative border border-[#C8A96A]/20 p-5 bg-[#0D0D0D] rounded-3xl shadow-2xl">
            {/* Deep Charcoal Inner Frame with thin border */}
            <div className="border border-stone-850 p-4 bg-[#1A1A1A] rounded-2xl">
              <div className="aspect-[16/10] w-full overflow-hidden bg-[#0D0D0D] border border-white/5 rounded-xl">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-stone-500 uppercase tracking-widest">
                    Drop Visual
                  </div>
                )}
              </div>
            </div>
            
            {/* Absolute price bubble (Charcoal card, gold total) */}
            <div className="absolute -bottom-6 -left-6 bg-[#1A1A1A] text-[#F7F3EB] p-5 border border-[#E5DCCB]/15 hidden sm:block rounded-2xl shadow-2xl">
              <span className="block text-[8px] font-sans font-bold uppercase tracking-wider text-[#9A948B]">
                LIMITED DROP PRICE
              </span>
              <span className="text-base font-serif font-semibold text-[#C8A96A] mt-1 block">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: price?.currency || "INR",
                  maximumFractionDigits: 0,
                }).format(Number(price?.amount || 0))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
