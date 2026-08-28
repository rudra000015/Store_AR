import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router"
import { useProduct } from "../../products/Hook/useProduct"

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
  const {
    handlegetproductbyId,
    handlecreateproductvariant,
  } = useProduct()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    color: "",
    size: "",
    material: "",
    stock: "",
    priceAmount: "",
    priceCurrency: "INR",
  })
  const [images, setImages] = useState([])

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
      setMessage("Variant created successfully.")
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
  return (
    <main className="min-h-screen bg-stone-100 text-stone-950">
      <div className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#a98235]">
              Seller Studio
            </p>
            <h1 className="mt-2 font-serif text-3xl text-stone-950 sm:text-4xl">
              Product Details
            </h1>
          </div>
          <Link
            to="/seller/viewproduct"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-stone-950 px-5 text-sm font-bold text-stone-950 transition hover:bg-stone-950 hover:text-white"
          >
            Back to Products
          </Link>
        </div>
      </div>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="rounded-lg border border-stone-200 bg-white p-8 text-center text-sm text-stone-500">
            Loading product details...
          </div>
        ) : error && !product ? (
          <div className="rounded-lg border border-red-200 bg-white p-8 text-center shadow-sm">
            <h2 className="font-serif text-3xl text-stone-950">
              Product unavailable
            </h2>
            <p className="mt-3 text-sm leading-6 text-red-700">{error}</p>
          </div>
        ) : product ? (
          <div className="space-y-6">
            {(message || error) && (
              <div
                className={`rounded-lg border px-4 py-3 text-sm font-medium ${
                  error
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-green-200 bg-green-50 text-green-700"
                }`}
              >
                {error || message}
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
                <div className="aspect-[4/5] bg-stone-100">
                  {product.images?.[0]?.url ? (
                    <img
                      src={product.images[0].url}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-sm text-stone-500">
                      No product image
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm lg:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#a98235]">
                  Main Product
                </p>
                <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
                  {product.title}
                </h2>
                <p className="mt-4 text-2xl font-black text-[#8a6424]">
                  {formatPrice(product.price)}
                </p>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-600">
                  {product.description}
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg bg-stone-100 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
                      Variants
                    </p>
                    <p className="mt-2 text-3xl font-black">
                      {product.variants?.length || 0}
                    </p>
                  </div>
                  <div className="rounded-lg bg-stone-100 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
                      Total Stock
                    </p>
                    <p className="mt-2 text-3xl font-black">{totalStock}</p>
                  </div>
                  <div className="rounded-lg bg-stone-100 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
                      Images
                    </p>
                    <p className="mt-2 text-3xl font-black">
                      {product.images?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
              <form
                onSubmit={handleCreateVariant}
                className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm"
              >
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#a98235]">
                  Create Variant
                </p>
                <h3 className="mt-2 font-serif text-3xl">New option</h3>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-stone-700">
                    Color
                    <input
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="mt-2 h-11 w-full rounded-lg border border-stone-200 px-3 text-sm outline-none focus:border-stone-950"
                      placeholder="Black"
                    />
                  </label>
                  <label className="text-sm font-semibold text-stone-700">
                    Size
                    <input
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      className="mt-2 h-11 w-full rounded-lg border border-stone-200 px-3 text-sm outline-none focus:border-stone-950"
                      placeholder="M"
                    />
                  </label>
                  <label className="text-sm font-semibold text-stone-700">
                    Material
                    <input
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      className="mt-2 h-11 w-full rounded-lg border border-stone-200 px-3 text-sm outline-none focus:border-stone-950"
                      placeholder="Cotton"
                    />
                  </label>
                  <label className="text-sm font-semibold text-stone-700">
                    Stock
                    <input
                      type="number"
                      min="0"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="mt-2 h-11 w-full rounded-lg border border-stone-200 px-3 text-sm outline-none focus:border-stone-950"
                      placeholder="10"
                    />
                  </label>
                  <label className="text-sm font-semibold text-stone-700">
                    Price
                    <input
                      required
                      type="number"
                      min="0"
                      name="priceAmount"
                      value={formData.priceAmount}
                      onChange={handleInputChange}
                      className="mt-2 h-11 w-full rounded-lg border border-stone-200 px-3 text-sm outline-none focus:border-stone-950"
                      placeholder="1200"
                    />
                  </label>
                  <label className="text-sm font-semibold text-stone-700">
                    Currency
                    <select
                      name="priceCurrency"
                      value={formData.priceCurrency}
                      onChange={handleInputChange}
                      className="mt-2 h-11 w-full rounded-lg border border-stone-200 px-3 text-sm outline-none focus:border-stone-950"
                    >
                      {currencyOptions.map((currency) => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="mt-4 block text-sm font-semibold text-stone-700">
                  Variant Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(event) => setImages(Array.from(event.target.files || []))}
                    className="mt-2 w-full rounded-lg border border-dashed border-stone-300 bg-stone-50 px-3 py-3 text-sm"
                  />
                </label>

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg border border-stone-950 bg-stone-950 px-5 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Create Variant"}
                </button>
              </form>

              <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#a98235]">
                      Variants
                    </p>
                    <h3 className="mt-2 font-serif text-3xl">Variant list</h3>
                  </div>
                  <p className="text-sm text-stone-500">
                    {product.variants?.length || 0} variants
                  </p>
                </div>

                {product.variants?.length > 0 ? (
                  <div className="mt-6 space-y-4">
                    {product.variants.map((variant, index) => (
                      <article
                        key={variant._id}
                        className="grid gap-4 rounded-lg border border-stone-200 p-4 sm:grid-cols-[96px_1fr]"
                      >
                        <div className="h-24 w-24 overflow-hidden rounded-lg bg-stone-100">
                          {variant.images?.[0]?.url ? (
                            <img
                              src={variant.images[0].url}
                              alt={`${product.title} variant ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center px-2 text-center text-xs text-stone-400">
                              No image
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h4 className="font-bold text-stone-950">
                                Variant {index + 1}
                              </h4>
                              <p className="mt-1 text-sm font-semibold text-[#8a6424]">
                                {formatPrice(variant.price)}
                              </p>
                            </div>
                            <div className="rounded-lg bg-stone-100 px-4 py-2 text-right">
                              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-500">
                                Stock
                              </p>
                              <p className="text-lg font-black text-stone-950">
                                {variant.stock ?? 0}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {attributesToEntries(variant.attributes).map(([key, value]) => (
                              value ? (
                                <span
                                  key={key}
                                  className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold capitalize text-stone-600"
                                >
                                  {key}: {value}
                                </span>
                              ) : null
                            ))}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 rounded-lg bg-stone-100 px-4 py-10 text-center">
                    <h4 className="font-serif text-2xl">No variants yet</h4>
                    <p className="mt-2 text-sm text-stone-500">
                      Create variants to track stock by size, color, material, or any option.
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
