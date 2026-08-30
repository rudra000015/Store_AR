import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useProduct } from "../../products/Hook/useProduct";
import { useCart } from "../../cart/hook/useCart";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

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

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handlegetproductbyId } = useProduct();
  const { handleAddToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Selection States
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setErrorMsg("");
        const data = await handlegetproductbyId(id);
        setProduct(data);
        // Default to first variant if available
        if (data?.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (err) {
        console.error("Failed to load product:", err);
        setErrorMsg("The fashion piece could not be retrieved.");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id, handlegetproductbyId]);

  const handleAddSelectionToCart = async (redirectToCart = false) => {
    if (!product) return;
    
    if (product.variants?.length > 0 && !selectedVariant) {
      setErrorMsg("Please select a boutique size & color variant first.");
      return;
    }

    try {
      setActionLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const payload = {
        productId: product._id,
        quantity: quantity,
        variantId: selectedVariant ? selectedVariant._id : undefined,
      };

      await handleAddToCart(payload);
      setSuccessMsg("The piece has been secured in your Vault.");
      
      if (redirectToCart) {
        navigate("/buyer/cart");
      }
    } catch (err) {
      console.error("Cart addition failed:", err);
      setErrorMsg(err.message || "Failed to add product to Cart.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 bg-[#FBF9F4]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C8A96A] border-t-transparent"></div>
        <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#886D3B]">
          UNVEILING PIECE DETAILS...
        </p>
      </div>
    );
  }

  if (errorMsg && !product) {
    return (
      <div className="text-center py-24 max-w-md mx-auto space-y-4 bg-[#FBF9F4] font-sans">
        <div className="text-3xl">⚠️</div>
        <h3 className="font-brand text-lg text-[#171513]">Could not find product</h3>
        <p className="text-xs text-[#A65D52] bg-[#A65D52]/5 border border-[#A65D52]/10 p-3">{errorMsg}</p>
        <Link to="/buyer" className="inline-block underline text-xs font-bold uppercase tracking-wider text-[#886D3B]">
          Return to shop
        </Link>
      </div>
    );
  }

  const price = selectedVariant?.price || product.price;
  const currentImages = selectedVariant?.images?.length > 0 ? selectedVariant.images : product.images || [];
  const activeImage = currentImages[0]?.url || "";
  const stock = selectedVariant ? Number(selectedVariant.stock || 0) : 0;

  return (
    <div className="min-h-screen bg-[#FBF9F4] dark:bg-[#0D0D0D] text-[#171513] dark:text-[#FBF9F4] transition-colors duration-300 py-6 sm:py-12 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-10 text-left">
          <Link 
            to="/buyer" 
            className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-[#886D3B] dark:text-[#C8A96A] hover:text-[#C8A96A] hover:underline"
          >
            ← Return to Collection
          </Link>
        </div>

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Sticky Gallery */}
          <div className="lg:col-span-6 lg:sticky lg:top-28 self-start space-y-4">
            <div className="aspect-[3/4] w-full overflow-hidden bg-[#F2EFE8] dark:bg-[#1A1A1A] border border-[#E5DCCB] dark:border-[#333333] rounded-2xl">
              {activeImage ? (
                <img 
                  src={activeImage} 
                  alt={product.title} 
                  className="h-full w-full object-cover" 
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-[#716B63] dark:text-[#9A948B] uppercase tracking-widest font-bold">
                  No Preview Image
                </div>
              )}
            </div>

            {/* Thumbnail Gallery Grid */}
            {currentImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {currentImages.map((img, idx) => (
                  <div 
                    key={idx} 
                    className="aspect-[3/4] overflow-hidden border border-[#E5DCCB] dark:border-[#333333] bg-[#F2EFE8] dark:bg-[#1A1A1A] cursor-pointer rounded-lg hover:border-[#C8A96A] transition"
                  >
                    <img src={img.url} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information & Selections */}
          <div className="lg:col-span-6 space-y-8 text-left">
            
            {/* Metadata, Title, Rating */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-[#886D3B] dark:text-[#C8A96A]">
                  Studio Drop Selection
                </span>
                
                {/* Visual Star Rating */}
                <div className="flex items-center gap-1 text-[#C8A96A]">
                  <span className="text-xs">★★★★★</span>
                  <span className="text-[9px] font-sans font-bold text-[#9A948B] tracking-wider">5.0</span>
                </div>
              </div>

              <h1 className="font-brand text-3xl sm:text-4xl font-light text-[#171513] dark:text-[#FBF9F4] tracking-wide leading-tight uppercase">
                {product.title}
              </h1>

              <div className="flex items-baseline justify-between border-b border-[#E5DCCB] dark:border-[#333333] pb-4">
                <span className="text-2xl font-sans font-semibold text-[#171513] dark:text-[#FBF9F4]">
                  {formatPrice(price)}
                </span>
                <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#66745A]">
                  Insured Delivery Complimentary
                </span>
              </div>
            </div>

            {/* Product Details description */}
            <div className="space-y-3">
              <h3 className="text-[9px] font-sans font-bold uppercase tracking-[0.25em] text-[#716B63] dark:text-[#C8A96A]">
                Details & Description
              </h3>
              <p className="text-xs text-[#716B63] dark:text-[#9A948B] leading-relaxed font-light tracking-wide font-sans">
                {product.description || "Designed as part of our exclusive drop edition. High-end textiles, fine stitching details, and contemporary cuts. Fits naturally into premium luxury aesthetics."}
              </p>
            </div>

            <hr className="border-[#E5DCCB] dark:border-[#333333]" />

            {/* Feedback Banners using Luxury Colors */}
            {successMsg && (
              <div className="bg-[#66745A]/10 border border-[#66745A]/20 p-4 text-[11px] font-sans font-bold uppercase tracking-wider text-[#66745A] rounded-xl flex items-center justify-between">
                <span>✓ {successMsg}</span>
                <Link to="/buyer/cart" className="underline font-bold uppercase tracking-widest text-[#66745A]/85 hover:text-[#66745A]">
                  Open Vault →
                </Link>
              </div>
            )}

            {errorMsg && (
              <div className="bg-[#A65D52]/10 border border-[#A65D52]/20 p-4 text-[11px] font-sans font-bold uppercase tracking-wider text-[#A65D52] rounded-xl">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Variants configuration */}
            {product.variants?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-[9px] font-sans font-bold uppercase tracking-[0.25em] text-[#716B63]">
                  Select Size & Color Variant
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.variants.map((v) => {
                    const isActive = selectedVariant?._id === v._id;
                    return (
                      <button
                        key={v._id}
                        type="button"
                        onClick={() => {
                          setSelectedVariant(v);
                          setSuccessMsg("");
                          setErrorMsg("");
                        }}
                        className={`flex flex-col p-4 border text-left rounded-xl transition duration-200 cursor-pointer ${
                          isActive 
                            ? "border-[#C8A96A] bg-[#FFFDF8] dark:bg-[#1A1A1A] ring-1 ring-[#C8A96A] shadow-sm" 
                            : "border-[#E5DCCB] dark:border-[#333333] bg-[#F7F3EB] dark:bg-[#1A1A1A]/40 hover:border-[#C8A96A]/60"
                        }`}
                      >
                        <span className="text-xs font-sans font-bold text-[#171513] dark:text-[#FBF9F4]">
                          {v.color || "Standard"} / {v.size || "OS"}
                        </span>
                        {v.material && (
                          <span className="text-[9px] text-[#716B63] dark:text-[#9A948B] uppercase mt-0.5 tracking-wider">
                            Material: {v.material}
                          </span>
                        )}
                        <div className="mt-3 flex items-center justify-between w-full">
                          <span className="text-[10px] font-sans font-semibold text-[#886D3B] dark:text-[#C8A96A]">
                            {formatPrice(v.price)}
                          </span>
                          <span className={`text-[9px] font-sans font-semibold uppercase tracking-wider ${v.stock > 0 ? "text-[#9A948B]" : "text-[#A65D52]"}`}>
                            {v.stock > 0 ? `${v.stock} in stock` : "Out of Stock"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions Grid */}
            <div className="pt-4 space-y-4">
              
              {/* Quantity controller */}
              {selectedVariant && selectedVariant.stock > 0 && (
                <div className="flex items-center gap-4">
                  <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#716B63] dark:text-[#9A948B]">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-[#E5DCCB] dark:border-[#333333] bg-white dark:bg-[#1A1A1A] rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1 || actionLoading}
                      className="h-8 w-8 text-xs font-bold text-[#716B63] dark:text-[#9A948B] hover:bg-[#F7F3EB] dark:hover:bg-[#0D0D0D] disabled:opacity-30 cursor-pointer"
                    >
                      —
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-[#171513] dark:text-[#FBF9F4]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(q => Math.min(stock, q + 1))}
                      disabled={quantity >= stock || actionLoading}
                      className="h-8 w-8 text-xs font-bold text-[#716B63] dark:text-[#9A948B] hover:bg-[#F7F3EB] dark:hover:bg-[#0D0D0D] disabled:opacity-30 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart & Buy Now Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  type="button"
                  onClick={() => handleAddSelectionToCart(false)}
                  disabled={actionLoading || (selectedVariant && selectedVariant.stock === 0)}
                  className="h-12 text-[11px] font-sans font-bold uppercase tracking-[0.12em] bg-transparent border border-[#886D3B] text-[#171513] dark:text-[#FBF9F4] hover:bg-[#C8A96A] hover:text-[#0D0D0D] dark:hover:text-[#0D0D0D] hover:border-transparent rounded-full"
                >
                  {actionLoading ? "Processing..." : "Add to Vault"}
                </Button>

                <Button
                  type="button"
                  onClick={() => handleAddSelectionToCart(true)}
                  disabled={actionLoading || (selectedVariant && selectedVariant.stock === 0)}
                  className="h-12 text-[11px] font-sans font-bold uppercase tracking-[0.12em] bg-[#C8A96A] text-[#0D0D0D] hover:bg-[#D8B77A] rounded-full"
                >
                  Buy Now
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-[#E5DCCB]/40 flex flex-wrap items-center justify-center gap-6 text-[8px] font-sans font-bold uppercase tracking-widest text-[#9A948B]">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#C8A96A]">🔒</span> SECURE CHECKOUT
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#C8A96A]">🚚</span> INSURED DELIVERY
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#C8A96A]">🔄</span> EASY RETURNS
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
