import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { useSelector } from "react-redux"
import { useProduct } from "../../products/Hook/useProduct"
import { useCart } from "../../cart/hook/useCart"
import { useAuth } from "../Hook/useAuth"
import CartVaultDrawer from "../../cart/components/CartVaultDrawer"


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

function attributesToEntries(attributes) {
  if (!attributes) return []
  return Object.entries(attributes instanceof Map ? Object.fromEntries(attributes) : attributes)
}

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth?.user)
  const { handleLogout } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [cartFeedback, setCartFeedback] = useState({ type: "", message: "" })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const onLogout = async () => {
    try {
      setIsLoggingOut(true)
      await handleLogout()
      navigate("/login")
    } catch (err) {
      console.error("Logout failed:", err)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const { handlegetproductbyId } = useProduct()
  const { handleaAddToCart, cartItems } = useCart()

  useEffect(() => {
    const fetchproduct = async () => {
      try {
        setLoading(true)
        setError("")
        const data = await handlegetproductbyId(id)
        setProduct(data)
        setSelectedImageIndex(0)
        setSelectedVariantIndex(0)
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.msg ||
          err.message ||
          "Could not load product details."
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchproduct()
  }, [handlegetproductbyId, id])

  const variants = product?.variants || []
  const selectedVariant =
    selectedVariantIndex !== null ? variants[selectedVariantIndex] : null
  const productImages =
    selectedVariant?.images?.length > 0 ? selectedVariant.images : product?.images || []
  const selectedImageUrl = productImages[selectedImageIndex]?.url
  const displayPrice = selectedVariant?.price || product?.price
  const amount = Number(displayPrice?.amount || 0)
  const compareAmount = amount > 0 ? Math.round(amount * 1.35) : 0

  const onAddToCart = async () => {
    if (!selectedVariant) return
    setAddingToCart(true)
    setCartFeedback({ type: "", message: "" })

    try {
      const data = await handleaAddToCart({
        productId: product._id,
        variantId: selectedVariant._id,
        quantity,
      })
      setCartFeedback({
        type: "success",
        message: data?.msg || "Item added to your vault successfully!",
      })
      setIsCartOpen(true)
    } catch (err) {
      const errorMessage =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        (err.response?.status === 401
          ? "Please log in to add items to your vault."
          : "Could not add item to cart.")
      setCartFeedback({
        type: "error",
        message: errorMessage,
      })
    } finally {
      setAddingToCart(false)
    }
  }

  const totalCartCount = (cartItems || []).reduce(
    (acc, curr) => acc + Number(curr.quantity || 1),
    0
  )

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-stone-950">
      {/* Luxury Dark Header */}
      <header className="sticky top-0 z-40 border-b border-stone-800/80 bg-[#0c0d12]/95 backdrop-blur-md text-stone-100">
        <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-brand text-lg sm:text-xl font-bold tracking-[0.2em] text-[#f0cf7c]">
              THE A&R STORE
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/buyer"
              className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400 hover:text-[#d8b15f] transition"
            >
              ← Collection
            </Link>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex h-9 items-center gap-2 rounded-xl border border-stone-800 bg-[#14161f] px-3 text-xs font-semibold text-stone-200 transition hover:border-[#d8b15f]/50 hover:bg-[#1a1e2d]"
            >
              <svg className="h-4 w-4 text-[#d8b15f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="hidden sm:inline text-[11px] tracking-wider uppercase">Vault</span>
              {totalCartCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d8b15f] px-1 text-[10px] font-black text-black">
                  {totalCartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-2.5">
                <div className="hidden md:flex items-center gap-2 rounded-xl border border-stone-800 bg-[#14161f] px-2.5 py-1 text-xs text-stone-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="max-w-24 truncate text-[11px]">{user.fullname || user.email}</span>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  disabled={isLoggingOut}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-stone-700/80 bg-[#161822] px-3 text-[11px] font-semibold text-stone-300 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
                  title="Log out"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span className="hidden sm:inline">{isLoggingOut ? "..." : "Logout"}</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex h-9 items-center rounded-xl bg-[#d8b15f] px-3 text-[11px] font-bold uppercase tracking-wider text-black transition hover:bg-[#f0cf7c]"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Details Section */}
      <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8 lg:py-12">
        {loading ? (
          <>
            <div>
              <div className="aspect-[4/5] animate-pulse rounded-2xl bg-stone-200" />
              <div className="mt-4 flex gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 w-20 animate-pulse rounded-xl bg-stone-200" />
                ))}
              </div>
            </div>
            <div className="space-y-5">
              <div className="h-6 w-32 animate-pulse rounded bg-stone-200" />
              <div className="h-12 w-4/5 animate-pulse rounded bg-stone-200" />
              <div className="h-8 w-40 animate-pulse rounded bg-stone-200" />
              <div className="h-28 animate-pulse rounded bg-stone-100" />
            </div>
          </>
        ) : error ? (
          <div className="lg:col-span-2 rounded-2xl border border-red-200 bg-white p-10 text-center shadow-sm">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-red-700">
              Product Unavailable
            </span>
            <h1 className="mt-3 font-serif text-3xl text-stone-950">
              We could not load this product.
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-xs leading-6 text-stone-600">
              {error}
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-stone-950 px-6 text-xs font-bold uppercase tracking-[0.2em] text-white"
            >
              Return to storefront
            </Link>
          </div>
        ) : product ? (
          <>
            {/* Gallery Column */}
            <div>
              <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
                <div className="relative aspect-[4/5] max-h-[680px] w-full overflow-hidden bg-stone-100">
                  {selectedImageUrl ? (
                    <img
                      src={selectedImageUrl}
                      alt={product.title}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-xs font-medium text-stone-500">
                      Product image coming soon
                    </div>
                  )}
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                      Boutique Drop
                    </span>
                  </div>
                </div>
              </div>

              {/* Thumbnails Row */}
              {productImages.length > 0 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {productImages.map((image, index) => (
                    <button
                      key={`${image.url}-${index}`}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className={`h-24 w-20 shrink-0 overflow-hidden rounded-xl border transition sm:h-28 sm:w-24 ${
                        selectedImageIndex === index
                          ? "border-stone-950 ring-2 ring-stone-950/20"
                          : "border-stone-200 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${product.title} view ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Panel Column */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-500 text-xs">★★★★★</div>
                  <span className="text-[11px] font-semibold text-stone-500">
                    4.9 (128 reviews)
                  </span>
                </div>

                <h1 className="mt-3 font-serif text-3xl sm:text-5xl text-stone-950 font-medium leading-tight">
                  {product.title}
                </h1>

                {/* Price Display */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-bold text-stone-950">
                    {formatPrice(displayPrice)}
                  </span>
                  {compareAmount > 0 && (
                    <span className="text-sm font-semibold text-stone-400 line-through">
                      {formatPrice({ amount: compareAmount, currency: displayPrice?.currency || "INR" })}
                    </span>
                  )}
                  <span className="rounded-full bg-[#d8b15f]/20 px-2.5 py-0.5 text-[11px] font-bold text-[#8a6424]">
                    31% OFF
                  </span>
                </div>

                {/* Description */}
                <div className="mt-6 border-t border-stone-200 pt-5">
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
                    The Silhouette & Details
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-stone-600">
                    {product.description}
                  </p>
                </div>

                {/* Variants Selector */}
                {variants.length > 0 && (
                  <div className="mt-6 border-t border-stone-200 pt-5">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
                        Select Variant / Size
                      </h2>
                      {selectedVariant && (
                        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-600">
                          {Number(selectedVariant.stock || 0) > 0
                            ? `✓ In Stock (${selectedVariant.stock})`
                            : "Out of Stock"}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {variants.map((variant, index) => {
                        const attributeEntries = attributesToEntries(variant.attributes)

                        return (
                          <button
                            key={variant._id || index}
                            type="button"
                            onClick={() => {
                              setSelectedVariantIndex(index)
                              setSelectedImageIndex(0)
                            }}
                            className={`flex flex-col justify-between rounded-xl border p-3 text-left transition ${
                              selectedVariantIndex === index
                                ? "border-stone-950 bg-white shadow-sm ring-1 ring-stone-950"
                                : "border-stone-200 bg-stone-50/70 hover:border-stone-400"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-stone-950">
                                Variant {index + 1}
                              </span>
                              <span className="text-xs font-bold text-[#8a6424]">
                                {formatPrice(variant.price)}
                              </span>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {attributeEntries.length > 0 ? (
                                attributeEntries.map(([key, value]) =>
                                  value ? (
                                    <span
                                      key={key}
                                      className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-semibold capitalize text-stone-600"
                                    >
                                      {key}: {value}
                                    </span>
                                  ) : null
                                )
                              ) : (
                                <span className="text-[10px] text-stone-400">
                                  Standard fit
                                </span>
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mt-6 border-t border-stone-200 pt-5 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
                    Quantity
                  </span>
                  <div className="flex items-center rounded-xl border border-stone-200 bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="flex h-9 w-9 items-center justify-center text-stone-600 hover:bg-stone-100 rounded-l-xl transition"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-stone-950">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="flex h-9 w-9 items-center justify-center text-stone-600 hover:bg-stone-100 rounded-r-xl transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Actions Block */}
                <div className="mt-8 space-y-3">
                  {cartFeedback.message && (
                    <div
                      className={`rounded-xl border px-4 py-3 text-xs font-semibold ${
                        cartFeedback.type === "success"
                          ? "border-emerald-500/30 bg-emerald-50 text-emerald-700"
                          : "border-rose-500/30 bg-rose-50 text-rose-700"
                      }`}
                    >
                      {cartFeedback.message}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={!selectedVariant || addingToCart}
                      className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-stone-950 bg-stone-950 px-6 text-xs font-bold uppercase tracking-[0.24em] text-white shadow-md shadow-stone-950/10 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:border-stone-300 disabled:bg-stone-300 disabled:text-stone-500"
                      onClick={onAddToCart}
                    >
                      {addingToCart ? "Adding..." : "Add to Cart"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onAddToCart()
                      }}
                      className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#d8b15f] via-[#e5c378] to-[#c49842] px-6 text-xs font-bold uppercase tracking-[0.24em] text-black shadow-md shadow-[#d8b15f]/20 transition hover:opacity-95"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>

                {/* Trust Pillars */}
                <div className="mt-10 divide-y divide-stone-200 border-y border-stone-200 text-xs font-medium text-stone-600">
                  <div className="flex items-center justify-between py-3.5">
                    <span className="font-semibold text-stone-800">100% Original Guarantee</span>
                    <span className="text-stone-500 text-[11px]">Direct from boutique sellers</span>
                  </div>
                  <div className="flex items-center justify-between py-3.5">
                    <span className="font-semibold text-stone-800">14 Days Easy Returns</span>
                    <span className="text-stone-500 text-[11px]">Complimentary pickup</span>
                  </div>
                  <div className="flex items-center justify-between py-3.5">
                    <span className="font-semibold text-stone-800">Secure Vault Protection</span>
                    <span className="text-stone-500 text-[11px]">256-bit encrypted checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </section>

      {/* Cart Vault Slide Drawer */}
      <CartVaultDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </main>
  )
}

export default ProductDetail
