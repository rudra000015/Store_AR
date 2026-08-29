import { useSelector } from "react-redux"
import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router"
import { useProduct } from "../../products/Hook/useProduct"
import { useCart } from "../../cart/hook/useCart"
import { useAuth } from "../Hook/useAuth"
import CartVaultDrawer from "../../cart/components/CartVaultDrawer"
import boutiqueBg from "../../../app/assets/boutique-register-bg.png"


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

const CATEGORIES = [
  "All",
  "T-Shirts",
  "Shirts",
  "Hoodies",
  "Pants",
  "Jackets",
  "Footwear",
  "Fragrance",
]

function ProductCard({ product }) {
  const imageUrl = product?.images?.[0]?.url
  const productId = product?._id || product?.id
  const amount = Number(product?.price?.amount || 0)
  const compareAmount = amount > 0 ? Math.round(amount * 1.35) : 0

  return (
    <Link
      to={`/product/${productId}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-[#d8b15f]/70 hover:shadow-xl hover:shadow-stone-900/10 cursor-pointer"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-stone-900 px-6 text-center text-xs text-stone-400">
            Image coming soon
          </div>
        )}

        <div className="absolute inset-x-3 top-3 flex justify-between items-center pointer-events-none">
          <span className="rounded-full border border-white/20 bg-black/65 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-100 backdrop-blur-md">
            New
          </span>
          <span className="rounded-full border border-[#d8b15f]/30 bg-black/65 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f0cf7c] backdrop-blur-md">
            Boutique
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <h3 className="line-clamp-1 font-serif text-base font-semibold text-stone-900 group-hover:text-[#a98235] transition">
            {product.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-stone-500">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <p className="text-base font-bold text-stone-950">
              {formatPrice(product.price)}
            </p>
            {compareAmount > 0 && (
              <p className="text-[11px] text-stone-400 line-through">
                {formatPrice({ amount: compareAmount, currency: product?.price?.currency || "INR" })}
              </p>
            )}
          </div>
          <span className="inline-flex h-8 items-center justify-center rounded-lg border border-stone-950 bg-stone-950 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition group-hover:border-[#d8b15f] group-hover:bg-[#d8b15f] group-hover:text-black">
            View
          </span>
        </div>
      </div>
    </Link>
  )
}

function Home() {
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth?.user)
  const products = useSelector((state) => state.product?.products || [])
  const { handlegetallproducts } = useProduct()
  const { cartItems } = useCart()
  const { handleLogout } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
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

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        setError("")
        await handlegetallproducts()
      } catch (err) {
        const errorMessage =
          err.response?.data?.msg ||
          err.message ||
          "Could not load products."
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [handlegetallproducts])

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCat =
        activeCategory === "All" ||
        item.title?.toLowerCase().includes(activeCategory.toLowerCase()) ||
        item.description?.toLowerCase().includes(activeCategory.toLowerCase())

      return matchesSearch && matchesCat
    })
  }, [products, searchQuery, activeCategory])

  const totalCartCount = (cartItems || []).reduce(
    (acc, curr) => acc + Number(curr.quantity || 1),
    0
  )

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-stone-950">
      {/* Luxury Dark Header */}
      <header className="sticky top-0 z-40 border-b border-stone-800/80 bg-[#0c0d12]/95 backdrop-blur-md text-stone-100">
        <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-brand text-lg sm:text-xl font-bold tracking-[0.2em] text-[#f0cf7c]">
                THE A&R STORE
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-[0.18em] text-stone-300">
              {["Men", "Women", "New Arrivals", "Best Sellers", "Offers"].map((navItem) => (
                <button
                  key={navItem}
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("products")
                    if (el) el.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="cursor-pointer hover:text-[#d8b15f] transition text-stone-300"
                >
                  {navItem}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="relative hidden sm:block w-48 lg:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collection..."
                className="h-9 w-full rounded-full border border-stone-800 bg-[#14161f] pl-9 pr-4 text-xs text-stone-100 placeholder:text-stone-500 outline-none transition focus:border-[#d8b15f] focus:ring-1 focus:ring-[#d8b15f]/40"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            {/* Cart Vault Trigger */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex h-10 items-center gap-2 rounded-xl border border-stone-800 bg-[#14161f] px-3.5 text-xs font-semibold text-stone-200 transition hover:border-[#d8b15f]/50 hover:bg-[#1a1e2b]"
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
              <div className="flex items-center gap-2.5 sm:gap-3">
                {/* User Pill */}
                <div className="hidden sm:flex items-center gap-2 rounded-xl border border-stone-800 bg-[#14161f] px-3 py-1.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d8b15f]/20 text-[11px] font-bold text-[#f0cf7c]">
                    {(user.fullname || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-semibold text-stone-200 leading-none truncate max-w-28">
                      {user.fullname || user.email}
                    </p>
                    <p className="text-[9px] font-bold tracking-wider text-[#d8b15f] uppercase mt-0.5">
                      {user.role || "Buyer"}
                    </p>
                  </div>
                </div>

                {user.role === "Seller" && (
                  <Link
                    to="/seller"
                    className="inline-flex h-9 items-center rounded-xl border border-[#d8b15f] bg-[#d8b15f] px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-black transition hover:bg-[#f0cf7c]"
                  >
                    Studio
                  </Link>
                )}

                {/* Styled Logout Button */}
                <button
                  type="button"
                  onClick={onLogout}
                  disabled={isLoggingOut}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-stone-700/80 bg-[#161822] px-3 text-[11px] font-semibold text-stone-300 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
                  title="Log out from account"
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
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="inline-flex h-9 items-center rounded-xl border border-stone-800 bg-[#14161f] px-3.5 text-xs font-semibold text-stone-200 transition hover:border-[#d8b15f]/50 hover:text-[#f0cf7c]"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex h-9 items-center rounded-xl bg-gradient-to-r from-[#d8b15f] via-[#e5c378] to-[#c49842] px-3.5 text-xs font-bold uppercase tracking-[0.16em] text-black shadow-md shadow-[#d8b15f]/15 transition hover:opacity-95"
                >
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>


      {/* Hero Showcase Section */}
      <section
        className="relative bg-cover bg-center text-stone-50 overflow-hidden"
        style={{ backgroundImage: `url(${boutiqueBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/40" />
        <div className="relative mx-auto flex min-h-[50vh] sm:min-h-[58vh] w-full max-w-7xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full border border-[#d8b15f]/40 bg-black/50 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-[#f0cf7c] backdrop-blur-md">
              NEW SEASON • OWN YOUR AURA
            </span>
            <h1 className="mt-4 font-serif text-4xl sm:text-6xl lg:text-7xl font-normal leading-tight text-white">
              Where Style Meets Identity.
            </h1>
            <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-stone-200">
              Timeless silhouettes, premium heavyweight knits, and elevated statement pieces curated from boutique independent designers.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#products"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#d8b15f] via-[#e5c378] to-[#c49842] px-8 text-xs font-bold uppercase tracking-[0.22em] text-black shadow-lg shadow-black/40 transition hover:opacity-95"
              >
                Explore Drops
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Highlights Strip */}
      <section className="border-y border-stone-200 bg-white">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 md:grid-cols-4 gap-4 px-4 py-5 sm:px-6 lg:px-8 text-stone-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f7f4ef] text-[#8a6424]">
              🚚
            </div>
            <div>
              <p className="text-xs font-bold text-stone-950">Free Shipping</p>
              <p className="text-[11px] text-stone-500">On all orders over ₹1,999</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f7f4ef] text-[#8a6424]">
              🔄
            </div>
            <div>
              <p className="text-xs font-bold text-stone-950">Easy Returns</p>
              <p className="text-[11px] text-stone-500">14 days return policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f7f4ef] text-[#8a6424]">
              🛡️
            </div>
            <div>
              <p className="text-xs font-bold text-stone-950">Secure Payment</p>
              <p className="text-[11px] text-stone-500">100% protected vault</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f7f4ef] text-[#8a6424]">
              ⭐
            </div>
            <div>
              <p className="text-xs font-bold text-stone-950">Premium Quality</p>
              <p className="text-[11px] text-stone-500">Verified boutique sellers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Strip */}
      <section id="products" className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-stone-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#a98235]">
              Curated Collection
            </span>
            <h2 className="mt-1 font-serif text-3xl sm:text-4xl text-stone-950 font-normal">
              Held in the Vault
            </h2>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  activeCategory === cat
                    ? "bg-stone-950 text-white shadow-sm"
                    : "bg-stone-200/70 text-stone-700 hover:bg-stone-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
              >
                <div className="aspect-[4/5] animate-pulse bg-stone-200" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-stone-200" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-stone-200" />
                  <div className="h-10 animate-pulse rounded bg-stone-100" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-700">
              Connection Notice
            </p>
            <h3 className="mt-2 font-serif text-2xl text-stone-950">
              Could not load products from server.
            </h3>
            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-stone-600">
              {error}
            </p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-12 text-center shadow-sm">
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#a98235]">
              Empty Vault
            </span>
            <h3 className="mt-2 font-serif text-2xl text-stone-950">
              No matching products found.
            </h3>
            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-stone-600">
              Try adjusting your category filter or search query.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-20 border-t border-stone-800 bg-[#0c0d12] py-12 text-stone-300">
        <div className="mx-auto flex flex-col items-center justify-between gap-8 px-4 text-center sm:px-6 lg:max-w-7xl lg:flex-row lg:text-left lg:px-8">
          <div>
            <span className="font-brand text-xl font-bold tracking-[0.2em] text-[#f0cf7c]">
              THE A&R STORE
            </span>
            <p className="text-xs text-stone-400 mt-1 uppercase tracking-widest">
              OWN YOUR AURA
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs text-stone-400">
            <span className="font-medium hover:text-stone-100 transition">Premium Quality</span>
            <span className="font-medium hover:text-stone-100 transition">Secure Payment</span>
            <span className="font-medium hover:text-stone-100 transition">Fast Delivery</span>
            <span className="font-medium hover:text-stone-100 transition">Easy Returns</span>
          </div>

          <p className="text-xs text-stone-500">
            © 2026 THE A&R STORE. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Cart Vault Slide-over Drawer */}
      <CartVaultDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </main>
  )
}

export default Home
