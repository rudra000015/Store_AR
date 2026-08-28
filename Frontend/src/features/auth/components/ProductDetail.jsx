import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { useProduct } from "../../products/Hook/useProduct"

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
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null)
  const { handlegetproductbyId } = useProduct()

  useEffect(() => {
    const fetchproduct = async () => {
      try {
        setLoading(true)
        setError("")
        const data = await handlegetproductbyId(id)
        setProduct(data)
        setSelectedImageIndex(0)
        setSelectedVariantIndex(null)
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

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-stone-950">
      <div className="border-b border-stone-200/80 bg-[#f7f4ef]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <Link to="/" className="font-serif text-xl font-semibold text-stone-950">
            THE A & R STORE
          </Link>
          <Link
            to="/"
            className="text-sm font-semibold text-stone-600 transition hover:text-[#a98235]"
          >
            Back to products
          </Link>
        </div>
      </div>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-7 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:px-8 lg:py-10">
        {loading ? (
          <>
            <div>
              <div className="aspect-[4/5] animate-pulse bg-stone-200" />
              <div className="mt-4 flex gap-3 overflow-hidden">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="h-24 w-20 shrink-0 animate-pulse bg-stone-200"
                  />
                ))}
              </div>
            </div>
            <div className="space-y-5 lg:pt-8">
              <div className="h-4 w-32 animate-pulse rounded bg-stone-200" />
              <div className="h-12 w-4/5 animate-pulse rounded bg-stone-200" />
              <div className="h-8 w-40 animate-pulse rounded bg-stone-200" />
              <div className="h-28 animate-pulse rounded bg-stone-100" />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="h-12 animate-pulse rounded-lg bg-stone-200" />
                <div className="h-12 animate-pulse rounded-lg bg-stone-200" />
              </div>
            </div>
          </>
        ) : error ? (
          <div className="lg:col-span-2 rounded-lg border border-red-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-700">
              Product unavailable
            </p>
            <h1 className="mt-3 font-serif text-3xl text-stone-950">
              We could not load this product.
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-600">
              {error}
            </p>
          </div>
        ) : product ? (
          <>
            <div>
              <div className="bg-stone-200">
                <div className="aspect-[4/5] max-h-[720px] w-full">
                  {selectedImageUrl ? (
                    <img
                      src={selectedImageUrl}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-sm font-medium text-stone-500">
                      Image coming soon
                    </div>
                  )}
                </div>
              </div>

              {productImages.length > 0 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-3">
                  {productImages.map((image, index) => (
                    <button
                      key={`${image.url}-${index}`}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className={`h-24 w-20 shrink-0 border bg-stone-100 transition sm:h-28 sm:w-24 ${
                        selectedImageIndex === index
                          ? "border-stone-950 opacity-100"
                          : "border-stone-200 opacity-55 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${product.title} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:pt-8">
              <h1 className="font-serif text-5xl leading-[0.95] text-stone-950 sm:text-6xl lg:text-7xl">
                {product.title}
              </h1>
              <p className="mt-8 text-sm font-bold uppercase tracking-[0.22em] text-stone-800">
                {formatPrice(displayPrice)}
              </p>

              <div className="mt-8 border-t border-stone-300 pt-7">
                <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-stone-400">
                  The Details
                </h2>
                <p className="mt-5 max-w-md text-sm leading-7 text-stone-700">
                  {product.description}
                </p>
              </div>

              {variants.length > 0 && (
                <div className="mt-8 border-t border-stone-300 pt-7">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-stone-400">
                      Select Variant
                    </h2>
                    {selectedVariant && (
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-stone-500">
                        Stock {selectedVariant.stock ?? 0}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 grid gap-3">
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
                          className={`w-full border px-4 py-4 text-left transition ${
                            selectedVariantIndex === index
                              ? "border-stone-950 bg-white"
                              : "border-stone-200 hover:border-stone-500"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-bold text-stone-950">
                                Variant {index + 1}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {attributeEntries.length > 0 ? (
                                  attributeEntries.map(([key, value]) =>
                                    value ? (
                                      <span
                                        key={key}
                                        className="text-xs font-semibold capitalize text-stone-500"
                                      >
                                        {key}: {value}
                                      </span>
                                    ) : null
                                  )
                                ) : (
                                  <span className="text-xs font-semibold text-stone-500">
                                    Standard option
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="text-sm font-bold text-[#8a6424]">
                                {formatPrice(variant.price)}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-stone-400">
                                {Number(variant.stock || 0) > 0
                                  ? `${variant.stock} in stock`
                                  : "Out of stock"}
                              </p>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="mt-8 space-y-3">
                <button
                  type="button"
                  className="inline-flex h-12 w-full items-center justify-center border border-stone-950 bg-stone-950 px-6 text-xs font-bold uppercase tracking-[0.26em] text-white transition hover:bg-stone-800"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  className="inline-flex h-12 w-full items-center justify-center border border-stone-200 bg-[#f7f4ef] px-6 text-xs font-bold uppercase tracking-[0.26em] text-stone-950 transition hover:border-stone-950"
                >
                  Buy Now
                </button>
              </div>

              <div className="mt-12 divide-y divide-stone-200 border-y border-stone-200 text-[11px] font-bold uppercase tracking-[0.16em] text-stone-400">
                <div className="grid grid-cols-2 gap-4 py-4">
                  <span>Shipping</span>
                  <span className="text-right text-stone-500">
                    Complimentary over INR 15,000
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <span>Returns</span>
                  <span className="text-right text-stone-500">
                    Within 14 days of delivery
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <span>Authenticity</span>
                  <span className="text-right text-stone-500">
                    100% guaranteed
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="lg:col-span-2 rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
            <h1 className="font-serif text-3xl text-stone-950">
              Product not found
            </h1>
            <p className="mt-3 text-sm text-stone-600">
              This product is not available right now.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

export default ProductDetail
