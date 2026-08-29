import { Link } from "react-router"
import { useCart } from "../hook/useCart"

function formatPrice(price) {
  const currency = price?.currency === "GBY" ? "GBP" : price?.currency || "INR"
  const amount = Number(price?.amount || 0)

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${price?.currency || "INR"} ${amount}`
  }
}

export default function CartVaultDrawer({ isOpen, onClose }) {
  const { cartItems } = useCart()

  if (!isOpen) return null

  const totalAmount = (cartItems || []).reduce((acc, item) => {
    const itemPrice = Number(item.price?.amount || item.product?.price?.amount || 0)
    const quantity = Number(item.quantity || 1)
    return acc + itemPrice * quantity
  }, 0)

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-[#0e1017] text-stone-100 shadow-2xl border-l border-stone-800 flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-stone-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-brand text-lg font-bold tracking-[0.2em] text-[#f0cf7c]">
                YOUR VAULT
              </span>
              <span className="rounded-full bg-[#d8b15f]/20 px-2 py-0.5 text-xs font-bold text-[#f0cf7c]">
                {cartItems?.length || 0} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-stone-400 hover:bg-stone-800 hover:text-white transition"
            >
              ✕
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems && cartItems.length > 0 ? (
              cartItems.map((item, idx) => {
                const product = item.product || {}
                const variant = item.variant || {}
                const imageUrl =
                  variant.images?.[0]?.url ||
                  product.images?.[0]?.url ||
                  ""
                const price = item.price || variant.price || product.price

                return (
                  <div
                    key={item._id || idx}
                    className="flex gap-4 rounded-xl border border-stone-800/80 bg-[#141620] p-4 shadow-sm"
                  >
                    <div className="h-20 w-16 overflow-hidden rounded-lg bg-stone-900 shrink-0">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.title || "Product"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-stone-600">
                          No img
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-sm font-semibold text-white line-clamp-1">
                          {product.title || "Boutique Item"}
                        </h4>
                        <p className="mt-1 text-xs text-stone-400">
                          Qty: {item.quantity || 1}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs font-bold text-[#f0cf7c]">
                          {formatPrice(price)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="py-20 text-center text-stone-500 space-y-3">
                <div className="text-3xl">🛍️</div>
                <p className="font-serif text-lg text-stone-300">Your vault is empty</p>
                <p className="text-xs text-stone-500">
                  Add signature boutique pieces from the collection to view them here.
                </p>
              </div>
            )}
          </div>

          {/* Footer / Summary */}
          <div className="p-6 border-t border-stone-800 bg-[#0a0c10] space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-400">
              <span>Subtotal</span>
              <span className="text-sm font-bold text-white">
                {formatPrice({ amount: totalAmount, currency: "INR" })}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Vault Shipping</span>
              <span className="text-emerald-400 font-bold">COMPLIMENTARY</span>
            </div>

            <button
              type="button"
              onClick={() => {
                alert("Proceeding to secure 256-bit encrypted checkout...")
              }}
              disabled={!cartItems || cartItems.length === 0}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#d8b15f] via-[#e5c378] to-[#c49842] text-xs font-bold uppercase tracking-[0.24em] text-black shadow-lg shadow-[#d8b15f]/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Unlock & Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
