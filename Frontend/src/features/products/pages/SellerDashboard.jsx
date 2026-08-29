import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import { useSelector } from "react-redux"
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

function SellerDashboard() {
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth?.user)
  const { handleLogout } = useAuth()
  const { handlegetsellerproduct } = useProduct()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState("")
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

  const totalStockCount = products.reduce((acc, p) => {
    const variantStock = (p.variants || []).reduce((s, v) => s + Number(v.stock || 0), 0)
    return acc + variantStock
  }, 0)

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
              <Link to="/seller" className="text-[#f0cf7c] transition">
                Dashboard
              </Link>
              <Link to="/seller/viewproduct" className="hover:text-stone-200 transition">
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
              <span className="hidden sm:inline">Add Product</span>
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
      <div className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-stone-800/80 pb-6">
          <div>
            <span className="font-brand text-xs uppercase tracking-[0.25em] text-[#d8b15f]">
              Seller Studio & Overview
            </span>
            <h1 className="mt-1 font-serif text-3xl sm:text-4xl text-white font-medium">
              Welcome back, Seller 👋
            </h1>
            <p className="mt-1 text-xs text-stone-400">
              Here is what is happening with your boutique store today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/seller/viewproduct"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-stone-700 bg-[#141620] px-4 text-xs font-semibold text-stone-200 hover:border-[#d8b15f]/50 hover:bg-[#1a1e2d] transition"
            >
              View Vault
            </Link>
          </div>
        </div>

        {/* 4 Metric Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-stone-800/80 bg-[#12141c] p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="font-semibold uppercase tracking-wider">Total Sales</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                +12.3%
              </span>
            </div>
            <p className="mt-3 font-serif text-3xl font-bold text-white">
              ₹2,45,990
            </p>
            <p className="mt-1 text-[11px] text-stone-500">From 142 completed orders</p>
          </div>

          <div className="rounded-2xl border border-stone-800/80 bg-[#12141c] p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="font-semibold uppercase tracking-wider">Orders</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                +8.2%
              </span>
            </div>
            <p className="mt-3 font-serif text-3xl font-bold text-white">
              320
            </p>
            <p className="mt-1 text-[11px] text-stone-500">18 pending fulfillment</p>
          </div>

          <div className="rounded-2xl border border-stone-800/80 bg-[#12141c] p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="font-semibold uppercase tracking-wider">Vault Products</span>
              <span className="rounded-full bg-[#d8b15f]/15 px-2 py-0.5 text-[10px] font-bold text-[#f0cf7c]">
                Live
              </span>
            </div>
            <p className="mt-3 font-serif text-3xl font-bold text-white">
              {isLoading ? "..." : products.length}
            </p>
            <p className="mt-1 text-[11px] text-stone-500">{totalStockCount} units in stock</p>
          </div>

          <div className="rounded-2xl border border-stone-800/80 bg-[#12141c] p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="font-semibold uppercase tracking-wider">Net Revenue</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                +16.0%
              </span>
            </div>
            <p className="mt-3 font-serif text-3xl font-bold text-white">
              ₹1,82,990
            </p>
            <p className="mt-1 text-[11px] text-stone-500">After boutique margins</p>
          </div>
        </div>

        {/* Sales Overview Card + Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Overview Visual Card */}
          <div className="lg:col-span-2 rounded-2xl border border-stone-800/80 bg-[#12141c] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d8b15f]">
                  Performance
                </span>
                <h3 className="font-serif text-xl font-semibold text-white">
                  Sales Overview
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span className="inline-block h-2 w-2 rounded-full bg-[#d8b15f]" />
                <span>Monthly Volume</span>
              </div>
            </div>

            {/* Custom Aesthetic Chart Visualizer */}
            <div className="h-52 w-full pt-6 flex items-end justify-between gap-3 px-2">
              {[
                { month: "Jan", val: 45 },
                { month: "Feb", val: 62 },
                { month: "Mar", val: 80 },
                { month: "Apr", val: 55 },
                { month: "May", val: 92 },
                { month: "Jun", val: 78 },
                { month: "Jul", val: 98 },
                { month: "Aug", val: 88 },
              ].map((bar) => (
                <div key={bar.month} className="flex flex-1 flex-col items-center gap-2 group">
                  <div className="relative w-full rounded-t-lg bg-stone-800/60 overflow-hidden h-40 flex items-end">
                    <div
                      style={{ height: `${bar.val}%` }}
                      className="w-full bg-gradient-to-t from-[#8a6424] via-[#d8b15f] to-[#f0cf7c] rounded-t-lg transition duration-500 group-hover:brightness-125"
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-stone-400">{bar.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action & Vault Status */}
          <div className="rounded-2xl border border-stone-800/80 bg-[#12141c] p-6 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d8b15f]">
                Vault Action
              </span>
              <h3 className="font-serif text-xl font-semibold text-white mt-1">
                Expand Inventory
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-stone-400">
                Publish a new product drop or update variants with colors, sizes, and stock limits.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                to="/seller/createproduct"
                className="flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#d8b15f] via-[#e5c378] to-[#c49842] text-xs font-bold uppercase tracking-[0.18em] text-black shadow-md shadow-[#d8b15f]/15 transition hover:opacity-95"
              >
                + Create New Product
              </Link>
              <Link
                to="/seller/viewproduct"
                className="flex h-11 w-full items-center justify-center rounded-xl border border-stone-700 bg-[#161924] text-xs font-semibold text-stone-200 hover:border-stone-600 transition"
              >
                Manage All Products
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Products Collection */}
        <div className="rounded-2xl border border-stone-800/80 bg-[#12141c] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d8b15f]">
                Product Ledger
              </span>
              <h3 className="font-serif text-xl font-semibold text-white">
                Recent Listings in Vault
              </h3>
            </div>
            <Link
              to="/seller/viewproduct"
              className="text-xs font-semibold text-[#d8b15f] hover:underline"
            >
              View all ({products.length}) →
            </Link>
          </div>

          {message && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-400">
              {message}
            </div>
          )}

          {isLoading ? (
            <div className="py-12 text-center text-xs text-stone-500">
              Loading products...
            </div>
          ) : products.length > 0 ? (
            <div className="divide-y divide-stone-800">
              {products.slice(0, 5).map((product) => {
                const imageUrl = product.images?.[0]?.url
                const variantCount = product.variants?.length || 0

                return (
                  <div
                    key={product._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 transition hover:bg-stone-900/40 rounded-xl px-2"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-stone-900 border border-stone-800">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[9px] text-stone-600">
                            No Img
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-serif text-sm font-semibold text-white">
                          {product.title}
                        </h4>
                        <p className="mt-0.5 text-xs text-stone-400 line-clamp-1 max-w-md">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs font-bold text-[#f0cf7c]">
                          {formatPrice(product.price)}
                        </p>
                        <p className="text-[11px] text-stone-500">
                          {variantCount} variant{variantCount === 1 ? "" : "s"}
                        </p>
                      </div>

                      <Link
                        to={`/seller/product/${product._id}`}
                        className="inline-flex h-8 items-center rounded-lg border border-stone-700 bg-[#161922] px-3 text-[11px] font-semibold text-stone-200 hover:border-[#d8b15f]/60 hover:text-[#f0cf7c] transition"
                      >
                        Manage Variants
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-stone-500">
              <p className="font-serif text-lg text-stone-300">No listings in your vault yet</p>
              <p className="text-xs mt-1">Start by creating your first boutique item.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default SellerDashboard
