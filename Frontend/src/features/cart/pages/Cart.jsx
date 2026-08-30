import { useState } from "react";
import { Link } from "react-router";
import { useCart } from "../hook/useCart";

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

export default function Cart() {
  const { cartItems, handleUpdateCart, handleRemoveFromCart } = useCart();
  const [actionLoading, setActionLoading] = useState(null); // 'remove-itemId' or 'qty-itemId'
  const [errorMsg, setErrorMsg] = useState("");

  const updateQuantity = async (productId, variantId, newQty, stockLimit) => {
    if (newQty < 1) return;
    if (newQty > stockLimit) {
      alert(`Only ${stockLimit} units available for this variant.`);
      return;
    }

    const itemKey = `${productId}-${variantId}`;
    try {
      setActionLoading(itemKey);
      setErrorMsg("");
      
      const payload = {
        productId,
        quantity: newQty,
        variantId: variantId || undefined,
      };
      
      await handleUpdateCart(payload);
    } catch (err) {
      console.error("Failed to update cart quantity:", err);
      setErrorMsg("Failed to update cart quantity.");
    } finally {
      setActionLoading(null);
    }
  };

  const removeItem = async (productId, variantId) => {
    const itemKey = `${productId}-${variantId}`;
    try {
      setActionLoading(`remove-${itemKey}`);
      setErrorMsg("");

      const payload = {
        productId,
        variantId: variantId || undefined,
      };

      await handleRemoveFromCart(payload);
    } catch (err) {
      console.error("Failed to remove item from cart:", err);
      setErrorMsg("Failed to remove item from cart.");
    } finally {
      setActionLoading(null);
    }
  };

  // Calculate Subtotal amount
  const totalAmount = (cartItems || []).reduce((acc, item) => {
    const product = item.product || {};
    const variantId = item.variant;
    const variantDetails = (product.variants || []).find(v => v._id === variantId) || {};
    const priceObj = item.price || variantDetails.price || product.price;
    const priceAmount = Number(priceObj?.amount || 0);
    return acc + priceAmount * Number(item.quantity || 1);
  }, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 font-sans bg-[#FBF9F4] dark:bg-[#0D0D0D] min-h-screen text-[#171513] dark:text-[#FBF9F4] text-left transition-colors duration-300">
      {/* Header */}
      <div className="border-b border-[#E5DCCB] dark:border-[#333333] pb-6 mb-8">
        <h1 className="font-brand text-3xl sm:text-4xl font-light tracking-wide uppercase text-[#171513] dark:text-[#FBF9F4]">
          Your Shopping Vault
        </h1>
        <p className="mt-2 text-[10px] font-sans font-bold tracking-[0.15em] text-[#716B63] dark:text-[#9A948B] uppercase">
          {cartItems?.length || 0} exquisite pieces in your vault
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 bg-[#A65D52]/10 border border-[#A65D52]/20 p-4 text-[11px] font-sans font-bold uppercase tracking-wider text-[#A65D52] rounded-xl">
          ⚠️ {errorMsg}
        </div>
      )}

      {cartItems && cartItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            {cartItems.map((item, idx) => {
              const product = item.product || {};
              const variantId = item.variant;
              // Attempt to find the variant details inside product
              const variantDetails = (product.variants || []).find(v => v._id === variantId) || {};
              
              const imageUrl = variantDetails.images?.[0]?.url || product.images?.[0]?.url || "";
              const price = item.price || variantDetails.price || product.price;
              
              const stock = Number(variantDetails.stock || 50);
              const itemKey = `${product._id}-${variantId}`;

              return (
                <div 
                  key={item._id || idx}
                  className="flex flex-col sm:flex-row gap-6 p-6 border border-[#E5DCCB] dark:border-[#333333] bg-[#FFFDF8] dark:bg-[#1A1A1A] rounded-2xl shadow-[0_10px_30px_rgba(20,17,12,0.03)] dark:shadow-none"
                >
                  {/* Image Thumbnail inside #F2EFE8 aspect-ratio */}
                  <div className="h-32 w-24 overflow-hidden rounded-xl bg-[#F2EFE8] dark:bg-[#0D0D0D] border border-[#E5DCCB]/30 dark:border-[#333333]/30 shrink-0 mx-auto sm:mx-0">
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={product.title} 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[9px] text-[#716B63] dark:text-[#9A948B] uppercase tracking-widest font-bold bg-[#F2EFE8] dark:bg-[#0D0D0D]">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-brand text-base font-semibold text-[#171513] dark:text-[#FBF9F4] line-clamp-2">
                            {product.title}
                          </h3>
                          {variantDetails.size || variantDetails.color ? (
                            <p className="mt-1.5 text-[9px] font-sans font-bold uppercase tracking-widest text-[#716B63] dark:text-[#9A948B]">
                              {variantDetails.color && `Color: ${variantDetails.color}`}
                              {variantDetails.size && `  |  Size: ${variantDetails.size}`}
                            </p>
                          ) : null}
                        </div>
                        <span className="text-sm font-sans font-semibold text-[#171513] dark:text-[#FBF9F4] shrink-0">
                          {formatPrice(price)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 flex-wrap gap-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-[#E5DCCB] dark:border-[#333333] bg-white dark:bg-[#0D0D0D] rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product._id, variantId, item.quantity - 1, stock)}
                          disabled={item.quantity <= 1 || actionLoading === itemKey}
                          className="h-8 w-8 text-xs font-bold text-[#716B63] dark:text-[#9A948B] hover:bg-[#F7F3EB] dark:hover:bg-[#1A1A1A] disabled:opacity-30 cursor-pointer"
                        >
                          —
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-[#171513] dark:text-[#FBF9F4]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product._id, variantId, item.quantity + 1, stock)}
                          disabled={item.quantity >= stock || actionLoading === itemKey}
                          className="h-8 w-8 text-xs font-bold text-[#716B63] dark:text-[#9A948B] hover:bg-[#F7F3EB] dark:hover:bg-[#1A1A1A] disabled:opacity-30 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeItem(product._id, variantId)}
                        disabled={actionLoading === `remove-${itemKey}`}
                        className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#716B63] dark:text-[#9A948B] hover:text-[#C8A96A] transition cursor-pointer disabled:opacity-50"
                      >
                        {actionLoading === `remove-${itemKey}` ? "Removing..." : "Remove Piece"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary Side Panel */}
          <div className="lg:col-span-4">
            <div className="border border-[#E5DCCB] dark:border-[#333333] bg-[#F7F3EB] dark:bg-[#1A1A1A] p-8 sticky top-28 rounded-2xl shadow-[0_10px_30px_rgba(20,17,12,0.03)] dark:shadow-none">
              <h2 className="font-brand text-xs font-bold tracking-[0.2em] text-[#171513] dark:text-[#FBF9F4] border-b border-[#E5DCCB] dark:border-[#333333] pb-4 uppercase">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4 text-xs font-sans font-semibold text-[#716B63] dark:text-[#9A948B]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#171513] dark:text-[#FBF9F4]">
                    {formatPrice({ amount: totalAmount, currency: "INR" })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Vault Shipping</span>
                  <span className="text-[#66745A] font-bold uppercase tracking-wider">
                    Complimentary
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Taxes</span>
                  <span className="text-[#171513] dark:text-[#FBF9F4]">
                    {formatPrice({ amount: Math.round(totalAmount * 0.05), currency: "INR" })}
                  </span>
                </div>
                <div className="border-t border-[#E5DCCB] dark:border-[#333333] pt-4 flex justify-between text-sm font-bold text-[#171513] dark:text-[#FBF9F4]">
                  <span>Estimated Total</span>
                  <span className="text-base font-sans font-bold text-[#C8A96A]">
                    {formatPrice({ amount: Math.round(totalAmount * 1.05), currency: "INR" })}
                  </span>
                </div>
              </div>

              {/* Checkout Button - Strongest CTA */}
              <button
                type="button"
                onClick={() => {
                  alert("Proceeding to secure luxury 256-bit SSL checkout...");
                }}
                className="mt-8 flex h-12 w-full items-center justify-center bg-[#C8A96A] text-[#0D0D0D] hover:bg-[#D8B77A] text-[11px] font-sans font-bold uppercase tracking-[0.12em] transition cursor-pointer rounded-full shadow-md"
              >
                Checkout & Secure
              </button>

              {/* Secure Checkout Badges */}
              <div className="mt-6 text-center">
                <p className="text-[8px] font-sans font-bold uppercase tracking-widest text-[#9A948B] dark:text-[#716B63]">
                  🔒 256-bit encrypted checkout & insured luxury delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Cart State */
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 max-w-md mx-auto border border-dashed border-[#E5DCCB] dark:border-[#333333] bg-[#FFFDF8] dark:bg-[#1A1A1A] p-8 rounded-2xl">
          <div className="text-5xl">🛍️</div>
          <h2 className="font-brand text-lg tracking-[0.25em] text-[#171513] dark:text-[#FBF9F4] uppercase">
            Your Vault is Empty
          </h2>
          <p className="text-xs text-[#716B63] dark:text-[#9A948B] leading-relaxed">
            There are currently no signature boutique items selected. Visit our catalog to add products to your bag.
          </p>
          <Link
            to="/buyer"
            className="flex h-11 px-8 items-center justify-center bg-[#C8A96A] text-[#0D0D0D] hover:bg-[#D8B77A] text-[10px] font-sans font-bold uppercase tracking-widest transition rounded-full"
          >
            Explore Catalog
          </Link>
        </div>
      )}
    </div>
  );
}
