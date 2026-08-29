import { useEffect, useMemo, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router"
import { useProduct } from "../Hook/useProduct"
import { useAuth } from "../../auth/Hook/useAuth"

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

function ViewProduct() {
  const navigate = useNavigate()
  const location = useLocation()
  const { handleLogout } = useAuth()
  const { handlegetsellerproduct } = useProduct()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [activeTab, setActiveTab] = useState("All")
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const createdProduct = location.state?.createdProduct

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
    async function loadProducts() {
      setIsLoading(true)
      setMessage("")

      try {
        const sellerProducts = await handlegetsellerproduct()
        setProducts(sellerProducts || [])
      } catch (error) {
        const errorMessage =
          error.response?.data?.msg ||
          error.message ||
          "Could not fetch seller products."
        setMessage(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [handlegetsellerproduct])

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const totalStock = (p.variants || []).reduce((acc, v) => acc + Number(v.stock || 0), 0)
      if (activeTab === "Published") return totalStock > 0
      if (activeTab === "Out of Stock") return totalStock === 0 && (p.variants?.length > 0)
      if (activeTab === "Low Stock") return totalStock > 0 && totalStock <= 10
      return true
    })
  }, [products, activeTab])

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
              to="/seller/createproduct"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#d8b15f] via-[#e5c378] to-[#c49842] px-4 text-xs font-bold uppercase tracking-[0.16em] text-black shadow-md shadow-[#d8b15f]/15 transition hover:opacity-95"
            >
              <span>+</span>
              <span>Add Product</span>
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


      {/* Main Container */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 space-y-6">
        {/* Header Title Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stone-800/80 pb-6">
          <div>
            <span className="font-brand text-xs uppercase tracking-[0.25em] text-[#d8b15f]">
              Inventory & Catalog
            </span>
            <h1 className="mt-1 font-serif text-3xl sm:text-4xl text-white font-medium">
              Product Vault
            </h1>
            <p className="mt-1 text-xs text-stone-400">
              Manage your boutique listings, variants, pricing, and stock levels.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-xl border border-stone-800 bg-[#12141c] px-3.5 py-2 text-xs font-bold text-stone-300">
              {products.length} Products
            </span>
          </div>
        </div>

        {/* Notifications */}
        {createdProduct && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-semibold text-emerald-400">
            ✓ Product published to vault: {createdProduct.title}
          </div>
        )}

        {message && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-semibold text-rose-400">
            {message}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-stone-800/80 pb-3 scrollbar-none">
          {["All", "Published", "Low Stock", "Out of Stock"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === tab
                  ? "bg-[#d8b15f] text-black shadow-md shadow-[#d8b15f]/20"
                  : "border border-stone-800 bg-[#12141c] text-stone-400 hover:text-stone-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-xs text-stone-500">
            Loading products from vault...
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const imageUrl = product.images?.[0]?.url
              const variantCount = product.variants?.length || 0
              const totalStock = (product.variants || []).reduce(
                (acc, v) => acc + Number(v.stock || 0),
                0
              )

              return (
                <div
                  key={product._id}
                  className="flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-800/90 bg-[#12141c] shadow-md transition duration-300 hover:border-[#d8b15f]/60 hover:shadow-xl hover:shadow-black/50"
                >
                  <div className="relative aspect-[4/5] bg-stone-900 overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-stone-500">
                        No product image
                      </div>
                    )}

                    <div className="absolute inset-x-3 top-3 flex justify-between">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          totalStock > 0
                            ? "border border-emerald-500/30 bg-black/70 text-emerald-400"
                            : "border border-rose-500/30 bg-black/70 text-rose-400"
                        }`}
                      >
                        {totalStock > 0 ? "Published" : "Out of stock"}
                      </span>
                      <span className="rounded-full border border-stone-700 bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-stone-300">
                        {variantCount} var.
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-base font-semibold text-white line-clamp-1">
                        {product.title}
                      </h3>
                      <p className="mt-1 text-sm font-bold text-[#f0cf7c]">
                        {formatPrice(product.price)}
                      </p>
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-stone-400">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-stone-400 font-medium">
                        Stock: <strong className="text-white">{totalStock}</strong>
                      </span>

                      <Link
                        to={`/seller/product/${product._id}`}
                        className="inline-flex h-8 items-center justify-center rounded-lg bg-stone-800 hover:bg-[#d8b15f] hover:text-black px-3 text-[11px] font-bold uppercase tracking-wider text-stone-200 transition"
                      >
                        Variants →
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-stone-800/80 bg-[#12141c] p-16 text-center space-y-4">
            <h3 className="font-serif text-2xl text-white">No products found in this filter</h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              Create your first product listing to publish to your boutique storefront.
            </p>
            <Link
              to="/seller/createproduct"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#d8b15f] via-[#e5c378] to-[#c49842] px-6 text-xs font-bold uppercase tracking-[0.18em] text-black shadow-md shadow-[#d8b15f]/20"
            >
              + Create Product
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}

export default ViewProduct
