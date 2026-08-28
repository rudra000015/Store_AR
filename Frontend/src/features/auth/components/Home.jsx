import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { Link } from "react-router"
import { useProduct } from "../../products/Hook/useProduct"
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

function ProductCard({ product }) {
  const imageUrl = product?.images?.[0]?.url
  const productId = product?._id || product?.id

  return (
    <Link
      to={`/product/${productId}`}
      className="group block overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#d8b15f]/60 hover:shadow-2xl hover:shadow-stone-300/60 cursor-pointer"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-200">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-stone-900 px-6 text-center text-sm text-stone-300">
            Image coming soon
          </div>
        )}
        <div className="absolute inset-x-3 top-3 flex justify-between">
          <span className="rounded-full border border-white/30 bg-black/55 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-stone-50 backdrop-blur">
            New
          </span>
          <span className="rounded-full border border-[#d8b15f]/40 bg-black/55 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#f0cf7c] backdrop-blur">
            Boutique
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-2 text-base font-bold text-stone-950">
            {product.title}
          </h2>
          <p className="shrink-0 text-sm font-black text-[#8a6424]">
            {formatPrice(product.price)}
          </p>
        </div>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-500">
          {product.description}
        </p>
        <div className="mt-5 flex h-11 w-full items-center justify-center rounded-lg border border-stone-950 bg-stone-950 text-xs font-bold uppercase tracking-[0.22em] text-stone-50 transition group-hover:border-[#d8b15f] group-hover:bg-[#d8b15f] group-hover:text-black">
          View Details
        </div>
      </div>
    </Link>
  )
}

function Home() {
  const products = useSelector((state) => state.product.products || [])
  const { handlegetallproducts } = useProduct()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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

  return (
    <main className="min-h-screen bg-[#f5f0e8] text-stone-950">
      <section
        className="bg-cover bg-center"
        style={{ backgroundImage: `url(${boutiqueBg})` }}
      >
        <div className="bg-black/60">
          <div className="mx-auto flex min-h-[56vh] w-full max-w-7xl flex-col justify-between px-4 py-5 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-between gap-4">
              <Link to="/" className="font-serif text-xl font-semibold text-stone-50">
                THE A & R STORE
              </Link>
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-stone-200 transition hover:text-[#f0cf7c]"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex h-10 items-center rounded-lg border border-[#d8b15f] bg-[#d8b15f] px-4 text-xs font-bold uppercase tracking-[0.18em] text-black transition hover:bg-[#f0cf7c]"
                >
                  Join
                </Link>
              </div>
            </nav>

            <div className="max-w-3xl py-16 sm:py-20">
              <p className="text-xs font-bold uppercase tracking-[0.34em] text-[#d8b15f]">
                Curated Seller Drops
              </p>
              <h1 className="mt-4 font-serif text-4xl leading-tight text-stone-50 sm:text-6xl lg:text-7xl">
                Premium pieces, freshly listed.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-200 sm:text-base">
                Explore elevated essentials and statement fits from THE A & R STORE
                sellers, presented with the same polished boutique energy they deserve.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-stone-300/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#a98235]">
              Available Now
            </p>
            <h2 className="mt-2 font-serif text-3xl text-stone-950 sm:text-4xl">
              Latest Products
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-stone-600">
            {products.length > 0
              ? `${products.length} product${products.length === 1 ? "" : "s"} ready to browse.`
              : "Products added by sellers will appear here after the backend serves them."}
          </p>
        </div>

        {loading ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm"
              >
                <div className="aspect-[4/5] animate-pulse bg-stone-200" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-stone-200" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-stone-200" />
                  <div className="h-16 animate-pulse rounded bg-stone-100" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-700">
              Products unavailable
            </p>
            <h3 className="mt-3 font-serif text-3xl text-stone-950">
              The product API is not responding from this backend.
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-600">
              {error}. Restart the backend from the `Backend` folder so
              `GET /api/products` uses the current product routes.
            </p>
          </div>
        ) : products.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-stone-200 bg-white p-8 text-center shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#a98235]">
              Empty Collection
            </p>
            <h3 className="mt-3 font-serif text-3xl text-stone-950">
              No products visible yet.
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-stone-600">
              Once the backend returns seller-created products from `GET /api/products`,
              they will appear here in the storefront.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

export default Home
