import { useState } from "react";
import { Link } from "react-router";

function formatPrice(price) {
  const currency = price?.currency === "GBY" ? "GBP" : price?.currency || "INR";
  const amount = Number(price?.amount || 0);

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${price?.currency || "INR"} ${amount}`;
  }
}

export default function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const defaultImageUrl = product.images?.[0]?.url || "";
  const defaultPrice = product.price;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="group border border-[#E5DCCB] bg-[#FFFDF8] p-4 flex flex-col justify-between hover:shadow-[0_10px_30px_rgba(20,17,12,0.1)] hover:-translate-y-1 transition-all duration-300 rounded-[18px] relative shadow-[0_10px_30px_rgba(20,17,12,0.06)] font-sans h-full">
      <div>
        {/* Image Container (#F2EFE8 bg, rounded-xl) */}
        <Link to={`/buyer/product/${product._id}`}>
          <div className="aspect-[3/4] w-full overflow-hidden bg-[#F2EFE8] border border-[#E5DCCB]/30 relative rounded-xl">
            {defaultImageUrl ? (
              <img
                src={defaultImageUrl}
                alt={product.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[9px] text-[#716B63] uppercase tracking-widest font-bold">
                No Image
              </div>
            )}

            {/* Wishlist Heart Icon overlay */}
            <button
              onClick={handleWishlistClick}
              className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-full bg-[#FBF9F4] text-[#171513] hover:text-[#C8A96A] transition cursor-pointer shadow-sm border border-[#E5DCCB]/40"
            >
              <svg 
                className={`w-3.5 h-3.5 transition ${isWishlisted ? "fill-rose-500 stroke-rose-500 scale-110" : "fill-transparent stroke-current"}`} 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {/* Limited Stock Badge */}
            {product.variants?.some(v => v.stock <= 3 && v.stock > 0) && (
              <span className="absolute bottom-3 left-3 bg-[#C8A96A] text-[#0D0D0D] text-[6.5px] font-sans font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                Limited Stock
              </span>
            )}
          </div>
        </Link>

        {/* Info */}
        <div className="mt-4 space-y-1.5 text-left">
          <Link to={`/buyer/product/${product._id}`}>
            <h3 className="font-serif text-[13px] font-semibold text-[#171513] hover:text-[#C8A96A] transition line-clamp-1">
              {product.title}
            </h3>
          </Link>
          <p className="text-[10px] text-[#716B63] line-clamp-2 leading-relaxed font-light">
            {product.description || "No description provided."}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[#E5DCCB]/60 pt-4">
        <span className="text-xs font-semibold text-[#171513] font-sans">
          {formatPrice(defaultPrice)}
        </span>
        <Link
          to={`/buyer/product/${product._id}`}
          className="text-[8px] font-sans font-bold uppercase tracking-widest text-[#C8A96A] hover:text-[#D8B77A] transition flex items-center gap-1"
        >
          View Details <span className="transition group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </div>
  );
}
