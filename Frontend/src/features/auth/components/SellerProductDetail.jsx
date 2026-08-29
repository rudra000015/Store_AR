import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { useProduct } from "../../products/Hook/useProduct"
import { useAuth } from "../Hook/useAuth"

const currencyOptions = ["INR", "USD", "EUR", "GBY", "JPY"]

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

function SellerProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { handleLogout } = useAuth()
  const { handlegetproductbyId, handlecreateproductvariant } = useProduct()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [formData, setFormData] = useState({
    color: "",
    size: "",
    material: "",
    stock: "",
    priceAmount: "",
    priceCurrency: "INR",
  })
  const [images, setImages] = useState([])

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


  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true)
        setError("")
        const data = await handlegetproductbyId(id)
        setProduct(data)
        setFormData((current) => ({
          ...current,
          priceCurrency: data?.price?.currency || "INR",
        }))
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.msg ||
          err.message ||
          "Could not load seller product."
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [handlegetproductbyId, id])

  const totalStock = useMemo(() => {
    return (product?.variants || []).reduce(
      (total, variant) => total + Number(variant.stock || 0),
      0
    )
  }, [product])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleCreateVariant = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage("")
    setError("")

    try {
      const updatedProduct = await handlecreateproductvariant(id, {
        ...formData,
        images,
      })
      setProduct(updatedProduct)
      setFormData({
        color: "",
        size: "",
        material: "",
        stock: "",
        priceAmount: "",
        priceCurrency: updatedProduct?.price?.currency || "INR",
      })
      setImages([])
      event.target.reset()
      setMessage("Variant created and added to ledger successfully.")
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        err.message ||
        "Could not create variant."
      setError(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const inputStyle =
    "mt-1.5 h-10 w-full rounded-xl border border-stone-800 bg-[#0d0e14] px-3 text-xs text-stone-100 placeholder:text-stone-600 outline-none transition focus:border-[#d8b15f] focus:ring-1 focus:ring-[#d8b15f]/40"

  return (
    <main className="min-h-screen bg-[#0a0c10] text-stone-100 pb-16">
      {/* Seller Top Navbar */}
      <header className="border-b border-stone-800/80 bg-[#0f1118]/95 sticky top-0 z-40 backdrop-blur-md">
        <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link to="/seller" className="flex items-center gap-2">
              <span className="font-brand text-lg font-bold tracking-[0.2em] text-[#f0cf7c]">
                THE A&R STORE
              </span>
              <span className="rounded-md border border-[#d8b15f]/30 bg-[#d8b15f]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#d8b15f]">
                Studio
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
              <Link to="/seller" className="hover:text-stone-200 transition">
                Dashboard
              </Link>
              <Link to="/seller/viewproduct" className="text-[#f0cf7c] transition">
                Product Vault
              </Link>
              <Link to="/seller/createproduct" className="hover:text-stone-200 transition">
                Add Product
              </Link>
              <Link to="/buyer" className="hover:text-stone-200 transition">
                Storefront
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/seller/viewproduct"
              className="inline-flex h-9 items-center rounded-xl border border-stone-700 bg-[#161922] px-4 text-xs font-semibold text-stone-200 hover:border-[#d8b15f]/50 hover:text-[#f0cf7c] transition"
            >
              ← Back to Vault
            </Link>

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
        </div>
      </header>

      {/* Main Content Area */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 space-y-6">
        {loading ? (
          <div className="py-20 text-center text-xs text-stone-500">
            Loading variant ledger...
          </div>
        ) : error && !product ? (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-10 text-center">
            <h2 className="font-serif text-2xl text-white">Product not available</h2>
            <p className="mt-2 text-xs text-rose-400">{error}</p>
            <Link
              to="/seller/viewproduct"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-[#d8b15f] px-6 text-xs font-bold uppercase tracking-wider text-black"
            >
              Back to Product Vault
            </Link>
          </div>
        ) : product ? (
          <div className="space-y-6">
            {/* Notifications */}
            {(message || error) && (
              <div
                className={`rounded-xl px-4 py-3 text-xs font-semibold ${
                  error
                    ? "border border-rose-500/30 bg-rose-500/10 text-rose-400"
                    : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                }`}
              >
                {error || message}
              </div>
            )}

            {/* Product Overview Card */}
            <div className="rounded-2xl border border-stone-800/90 bg-[#12141c] p-6 shadow-xl">
              <div className="grid gap-6 md:grid-cols-[140px_1fr] items-center">
                <div className="aspect-[4/5] max-h-44 overflow-hidden rounded-xl bg-stone-900 border border-stone-800">
                  {product.images?.[0]?.url ? (
                    <img
                      src={product.images[0].url}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-stone-600">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-brand text-[10px] font-bold uppercase tracking-[0.2em] text-[#d8b15f]">
                        Active Listing
                      </span>
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                        Live in Store
                      </span>
                    </div>
                    <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-medium text-white">
                      {product.title}
                    </h2>
                    <p className="mt-1 text-xs text-stone-400 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 border-t border-stone-800/80 pt-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-500 block">
                        Base Price
                      </span>
                      <span className="text-base font-bold text-[#f0cf7c]">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-500 block">
                        Total Stock
                      </span>
                      <span className="text-base font-bold text-white">
                        {totalStock} units
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-500 block">
                        Variants Attached
                      </span>
                      <span className="text-base font-bold text-white">
                        {product.variants?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Split: Create Variant (Left) + Variant Ledger (Right) */}
            <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
              {/* Variant Creation Form */}
              <form
                onSubmit={handleCreateVariant}
                className="rounded-2xl border border-stone-800/90 bg-[#12141c] p-6 shadow-xl space-y-5 h-fit"
              >
                <div className="border-b border-stone-800 pb-3">
                  <span className="font-brand text-[10px] font-bold uppercase tracking-[0.2em] text-[#d8b15f]">
                    SKU Builder
                  </span>
                  <h3 className="font-serif text-xl font-medium text-white">
                    + Add Variant Option
                  </h3>
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-300">
                    Color
                    <input
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className={inputStyle}
                      placeholder="e.g. Vintage Charcoal"
                    />
                  </label>

                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-300">
                    Size
                    <input
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      className={inputStyle}
                      placeholder="e.g. M, L, XL, Oversized"
                    />
                  </label>

                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-300">
                    Material / Fabric
                    <input
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      className={inputStyle}
                      placeholder="e.g. 280 GSM French Terry"
                    />
                  </label>

                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-300">
                    Initial Stock
                    <input
                      type="number"
                      min="0"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className={inputStyle}
                      placeholder="e.g. 25"
                    />
                  </label>

                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-300">
                    Price (Amount)
                    <input
                      required
                      type="number"
                      min="0"
                      name="priceAmount"
                      value={formData.priceAmount}
                      onChange={handleInputChange}
                      className={inputStyle}
                      placeholder="e.g. 899"
                    />
                  </label>

                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-300">
                    Currency
                    <select
                      name="priceCurrency"
                      value={formData.priceCurrency}
                      onChange={handleInputChange}
                      className={inputStyle}
                    >
                      {currencyOptions.map((curr) => (
                        <option key={curr} value={curr}>
                          {curr}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300">
                  Variant Imagery
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setImages(Array.from(e.target.files || []))}
                    className="mt-1.5 w-full rounded-xl border border-dashed border-stone-700 bg-[#0d0e14] px-3 py-3 text-xs text-stone-400 file:mr-3 file:rounded-lg file:border-0 file:bg-stone-800 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-stone-200 hover:border-[#d8b15f]/50 transition"
                  />
                </label>

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-2 h-11 w-full rounded-xl bg-gradient-to-r from-[#d8b15f] via-[#e5c378] to-[#c49842] text-xs font-bold uppercase tracking-[0.2em] text-black shadow-lg shadow-[#d8b15f]/15 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Registering Variant..." : "Add to Variant Ledger"}
                </button>
              </form>

              {/* Variant Ledger Table */}
              <div className="rounded-2xl border border-stone-800/90 bg-[#12141c] p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div>
                    <span className="font-brand text-[10px] font-bold uppercase tracking-[0.2em] text-[#d8b15f]">
                      Ledger View
                    </span>
                    <h3 className="font-serif text-xl font-medium text-white">
                      Variant Ledger
                    </h3>
                  </div>
                  <span className="rounded-full border border-stone-700 bg-stone-900/80 px-3 py-1 text-xs font-semibold text-stone-300">
                    {product.variants?.length || 0} Registered
                  </span>
                </div>

                {product.variants?.length > 0 ? (
                  <div className="divide-y divide-stone-800 space-y-3 pt-2">
                    {product.variants.map((variant, index) => (
                      <div
                        key={variant._id || index}
                        className="grid grid-cols-[72px_1fr_auto] gap-4 pt-3 items-center"
                      >
                        <div className="h-18 w-18 overflow-hidden rounded-xl bg-stone-900 border border-stone-800 shrink-0">
                          {variant.images?.[0]?.url ? (
                            <img
                              src={variant.images[0].url}
                              alt={`${product.title} var ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] text-stone-600">
                              No Img
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">
                              Variant #{index + 1}
                            </span>
                            <span className="text-xs font-bold text-[#f0cf7c]">
                              {formatPrice(variant.price)}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {attributesToEntries(variant.attributes).map(([key, val]) =>
                              val ? (
                                <span
                                  key={key}
                                  className="rounded-md bg-stone-900 border border-stone-800 px-2 py-0.5 text-[10px] font-medium capitalize text-stone-300"
                                >
                                  {key}: <strong className="text-stone-100">{val}</strong>
                                </span>
                              ) : null
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              Number(variant.stock || 0) > 0
                                ? "bg-emerald-500/15 text-emerald-400"
                                : "bg-rose-500/15 text-rose-400"
                            }`}
                          >
                            {Number(variant.stock || 0) > 0
                              ? `${variant.stock} in stock`
                              : "Out of stock"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-14 text-center text-stone-500 space-y-2">
                    <p className="font-serif text-lg text-stone-300">
                      No variants registered yet
                    </p>
                    <p className="text-xs max-w-xs mx-auto">
                      Use the SKU builder on the left to add sizes, colorways, and inventory counts.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default SellerProductDetail
