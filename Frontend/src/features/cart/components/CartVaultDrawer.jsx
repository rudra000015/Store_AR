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

export default function CartVaultDrawer({ isOpen, onClose }) {
  const { cartItems } = useCart();

  if (!isOpen) return null;

  const totalAmount = (cartItems || []).reduce((acc, item) => {
    const itemPrice = Number(item.price?.amount || item.product?.price?.amount || 0);
    const quantity = Number(item.quantity || 1);
    return acc + itemPrice * quantity;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-[#FFFDF8] text-[#171513] shadow-2xl border-l border-[#E5DCCB] flex flex-col justify-between transition-colors duration-300">
          
          {/* Header */}
          <div className="p-6 border-b border-[#E5DCCB] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-brand text-base font-bold tracking-[0.2em] text-[#C8A96A]">
                YOUR VAULT
              </span>
              <span className="rounded-full bg-[#F7F3EB] px-2.5 py-0.5 text-[8.5px] font-sans font-bold text-[#886D3B] uppercase">
                {cartItems?.length || 0} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-[#716B63] hover:bg-[#F7F3EB] transition cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems && cartItems.length > 0 ? (
              cartItems.map((item, idx) => {
                const product = item.product || {};
                const variant = item.variant || {};
                const imageUrl =
                  variant.images?.[0]?.url ||
                  product.images?.[0]?.url ||
                  "";
                const price = item.price || variant.price || product.price;

                return (
                  <div
                    key={item._id || idx}
                    className="flex gap-4 rounded-xl border border-[#E5DCCB] bg-[#FFFDF8] p-4 shadow-sm"
                  >
                    <div className="h-20 w-16 overflow-hidden rounded-lg bg-[#F2EFE8] shrink-0 border border-[#E5DCCB]/30">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.title || "Product"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[9px] text-[#716B63] uppercase bg-[#F2EFE8] font-bold">
                          No img
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between text-left">
                      <div>
                        <h4 className="font-brand text-sm font-semibold text-[#171513] line-clamp-1">
                          {product.title || "Boutique Item"}
                        </h4>
                        <p className="mt-1 text-xs text-[#716B63] font-sans font-light">
                          Qty: {item.quantity || 1}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs font-semibold text-[#171513] font-sans">
                          {formatPrice(price)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-20 text-center text-[#716B63] space-y-3">
                <div className="text-3xl">🛍️</div>
                <p className="font-brand text-lg text-[#171513] uppercase tracking-wider">Your vault is empty</p>
                <p className="text-xs text-[#716B63] leading-relaxed">
                  Add signature boutique pieces from the collection to view them here.
                </p>
              </div>
            )}
          </div>

          {/* Footer / Summary */}
          <div className="p-6 border-t border-[#E5DCCB] bg-[#F7F3EB] space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-[#716B63]">
              <span>Subtotal</span>
              <span className="text-sm font-bold text-[#171513]">
                {formatPrice({ amount: totalAmount, currency: "INR" })}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-[#716B63]">
              <span>Vault Delivery</span>
              <span className="text-[#66745A] font-bold">COMPLIMENTARY</span>
            </div>

            <button
              type="button"
              onClick={() => {
                alert("Proceeding to secure 256-bit encrypted checkout...");
              }}
              disabled={!cartItems || cartItems.length === 0}
              className="flex h-12 w-full items-center justify-center bg-[#C8A96A] text-[#0D0D0D] hover:bg-[#D8B77A] text-[11px] font-sans font-bold uppercase tracking-[0.12em] transition duration-300 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer rounded-full shadow-sm"
            >
              Secure Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
