import { useEffect, useState } from "react"
import { Link } from "react-router"
import { useProduct } from "../Hook/useProduct"

function SellerDashboard() {
  const { handlegetsellerproduct } = useProduct()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState("")

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

  return (
    <main className="min-h-screen bg-[#f5f0e8] text-stone-950">
      <section className="border-b border-stone-200 bg-stone-950 text-stone-50">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d8b15f]">
              Seller Studio
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
              Manage your boutique listings.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300">
              Create products, review your collection, and keep your storefront ready
              for buyers.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/seller/createproduct"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-[#d8b15f] bg-[#d8b15f] px-5 text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-[#f0cf7c]"
            >
              Create Product
            </Link>
            <Link
              to="/seller/viewproduct"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-stone-600 px-5 text-xs font-bold uppercase tracking-[0.2em] text-stone-100 transition hover:border-[#d8b15f] hover:text-[#f0cf7c]"
            >
              View Products
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#a98235]">
            Total Listings
          </p>
          <p className="mt-3 text-4xl font-black text-stone-950">
            {isLoading ? "..." : products.length}
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#a98235]">
            Seller Note
          </p>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            Products created here appear on the buyer dashboard after the backend
            returns them from the public products endpoint.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#a98235]">
                Recent Products
              </p>
              <h2 className="mt-2 font-serif text-3xl text-stone-950">
                Your Collection
              </h2>
            </div>
            <Link
              to="/seller/viewproduct"
              className="text-sm font-semibold text-stone-600 transition hover:text-[#8a6424]"
            >
              Manage all listings
            </Link>
          </div>

          {message ? (
            <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {message}
            </p>
          ) : isLoading ? (
            <p className="mt-5 rounded-lg bg-stone-100 px-4 py-6 text-center text-sm text-stone-500">
              Loading seller products...
            </p>
          ) : products.length > 0 ? (
            <div className="mt-5 divide-y divide-stone-200">
              {products.slice(0, 4).map((product) => (
                <Link
                  key={product._id}
                  to={`/seller/product/${product._id}`}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-bold text-stone-950">{product.title}</h3>
                    <p className="mt-1 line-clamp-1 text-sm text-stone-500">
                      {product.description}
                    </p>
                  </div>
                  <p className="text-sm font-black text-[#8a6424]">
                    {product.price?.currency || "INR"} {product.price?.amount ?? 0}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-lg bg-stone-100 px-4 py-8 text-center">
              <h3 className="font-serif text-2xl text-stone-950">
                No seller products yet.
              </h3>
              <p className="mt-2 text-sm text-stone-500">
                Start by creating your first listing.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default SellerDashboard
