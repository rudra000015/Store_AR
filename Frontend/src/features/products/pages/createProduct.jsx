import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router"
import { useProduct } from "../Hook/useProduct"
import { useAuth } from "../../auth/Hook/useAuth"

const inputClass =
  "mt-2 h-11 w-full rounded-xl border border-stone-800 bg-[#0d0e14] px-4 text-xs text-stone-100 placeholder:text-stone-600 outline-none transition focus:border-[#d8b15f] focus:ring-1 focus:ring-[#d8b15f]/40"

const textareaClass =
  "mt-2 min-h-32 w-full resize-none rounded-xl border border-stone-800 bg-[#0d0e14] px-4 py-3 text-xs leading-relaxed text-stone-100 placeholder:text-stone-600 outline-none transition focus:border-[#d8b15f] focus:ring-1 focus:ring-[#d8b15f]/40"

function Field({ id, label, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[11px] font-bold uppercase tracking-[0.16em] text-stone-300">
        {label}
      </label>
      {children}
    </div>
  )
}

function CreateProduct() {
  const navigate = useNavigate()
  const { handlecreateproduct } = useProduct()
  const { handleLogout } = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  })
  const [images, setImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [message, setMessage] = useState("")
  const [createdProduct, setCreatedProduct] = useState(null)

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


  const previews = useMemo(
    () =>
      images.map((image) => ({
        name: image.name,
        url: URL.createObjectURL(image),
      })),
    [images]
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files || []).slice(0, 7))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage("")
    setCreatedProduct(null)

    const payload = new FormData()
    payload.append("title", formData.title.trim())
    payload.append("description", formData.description.trim())
    payload.append("priceAmount", formData.priceAmount)
    payload.append("priceCurrency", formData.priceCurrency)
    images.forEach((image) => payload.append("images", image))

    try {
      const product = await handlecreateproduct(payload)
      setCreatedProduct(product)
      setMessage("Product published to vault successfully.")
      setFormData({
        title: "",
        description: "",
        priceAmount: "",
        priceCurrency: "INR",
      })
      setImages([])
      e.target.reset()
      navigate("/seller/viewproduct", {
        state: {
          createdProduct: product,
        },
      })
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg ||
        error.response?.data?.errors?.[0]?.msg ||
        error.message ||
        "Product creation failed."
      setMessage(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

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
              <Link to="/seller/viewproduct" className="hover:text-stone-200 transition">
                Product Vault
              </Link>
              <Link to="/seller/createproduct" className="text-[#f0cf7c] transition">
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
              className="text-xs font-semibold text-stone-400 hover:text-stone-200 transition"
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

      {/* Main Container */}
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 pt-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-stone-800/90 bg-[#12141c] p-6 sm:p-8 shadow-xl space-y-6"
        >
          <div className="border-b border-stone-800 pb-5">
            <span className="font-brand text-xs uppercase tracking-[0.25em] text-[#d8b15f]">
              Publish New Drop
            </span>
            <h1 className="mt-1 font-serif text-3xl text-white font-medium">
              Add a Product
            </h1>
            <p className="mt-1 text-xs text-stone-400">
              Publish a base product to your vault. You can attach sizes & colors in the Variant Ledger next.
            </p>
          </div>

          <div className="space-y-4">
            <Field id="title" label="Product Title">
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. Oversized Heavyweight Cotton T-Shirt"
                required
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field id="priceAmount" label="Base Price">
                <input
                  id="priceAmount"
                  name="priceAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.priceAmount}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="899"
                  required
                />
              </Field>

              <Field id="priceCurrency" label="Currency">
                <select
                  id="priceCurrency"
                  name="priceCurrency"
                  value={formData.priceCurrency}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBY">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </Field>
            </div>

            <Field id="description" label="Product Description">
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={textareaClass}
                placeholder="Describe tailoring details, fabric GSM, fit, silhouette, and care guidelines..."
                required
              />
            </Field>

            <Field id="images" label="Product Imagery (Up to 7)">
              <label
                htmlFor="images"
                className="mt-2 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-stone-700 bg-[#0d0e14] px-4 py-6 text-center transition hover:border-[#d8b15f]/60 hover:bg-[#d8b15f]/5"
              >
                <div className="h-10 w-10 rounded-full border border-[#d8b15f]/40 bg-[#d8b15f]/10 flex items-center justify-center text-[#f0cf7c] mb-2">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-stone-200">
                  {images.length > 0
                    ? `${images.length} image(s) selected`
                    : "Drag images here or browse files"}
                </span>
                <span className="mt-1 text-[11px] text-stone-500">
                  High-resolution PNG, JPG, or WEBP. Max 7 images.
                </span>
              </label>
              <input
                id="images"
                name="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="sr-only"
              />
            </Field>
          </div>

          {message && (
            <div
              className={`rounded-xl px-4 py-3 text-xs font-semibold ${
                message.includes("success")
                  ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border border-rose-500/30 bg-rose-500/10 text-rose-400"
              }`}
            >
              {message}
            </div>
          )}

          <div className="pt-3 border-t border-stone-800 flex items-center justify-end gap-3">
            <button
              type="reset"
              onClick={() => {
                setFormData({
                  title: "",
                  description: "",
                  priceAmount: "",
                  priceCurrency: "INR",
                })
                setImages([])
                setMessage("")
                setCreatedProduct(null)
              }}
              className="h-11 rounded-xl border border-stone-700 bg-[#161922] px-5 text-xs font-bold uppercase tracking-wider text-stone-300 hover:border-stone-600 transition"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 rounded-xl bg-gradient-to-r from-[#d8b15f] via-[#e5c378] to-[#c49842] px-7 text-xs font-bold uppercase tracking-[0.2em] text-black shadow-lg shadow-[#d8b15f]/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Publishing..." : "Add to Vault"}
            </button>
          </div>
        </form>

        {/* Live Preview Column */}
        <aside className="rounded-2xl border border-stone-800/90 bg-[#12141c] p-6 sm:p-7 shadow-xl space-y-5 h-fit">
          <div>
            <span className="font-brand text-xs uppercase tracking-[0.25em] text-[#d8b15f]">
              Live Storefront Preview
            </span>
            <h2 className="font-serif text-2xl text-white font-medium mt-1">
              Store Listing Card
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-stone-800 bg-[#0d0e14]">
            <div className="aspect-[4/5] bg-stone-900 overflow-hidden relative">
              {previews[0] ? (
                <img
                  src={previews[0].url}
                  alt={previews[0].name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center text-xs text-stone-600">
                  Image preview will render here
                </div>
              )}
              <div className="absolute left-3 top-3">
                <span className="rounded-full border border-white/20 bg-black/70 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Preview
                </span>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <h3 className="font-serif text-base font-semibold text-white line-clamp-1">
                {formData.title || "Your Product Title"}
              </h3>
              <p className="text-sm font-bold text-[#f0cf7c]">
                {formData.priceAmount
                  ? `${formData.priceCurrency} ${formData.priceAmount}`
                  : "INR 0.00"}
              </p>
              <p className="line-clamp-3 text-xs leading-5 text-stone-400">
                {formData.description ||
                  "Your product description and silhouette notes will render here."}
              </p>
            </div>
          </div>

          {previews.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {previews.slice(1).map((image) => (
                <img
                  key={image.url}
                  src={image.url}
                  alt={image.name}
                  className="aspect-square rounded-xl border border-stone-800 object-cover"
                />
              ))}
            </div>
          )}
        </aside>
      </section>
    </main>
  )
}

export default CreateProduct
