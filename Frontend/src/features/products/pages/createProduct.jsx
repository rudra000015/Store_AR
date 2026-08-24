import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router"
import { useProduct } from "../Hook/useProduct"

const inputClass =
    "mt-2 h-12 w-full rounded-lg border border-stone-200 bg-white px-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d8b15f] focus:ring-2 focus:ring-[#d8b15f]/25"

const textareaClass =
    "mt-2 min-h-36 w-full resize-none rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm leading-6 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[#d8b15f] focus:ring-2 focus:ring-[#d8b15f]/25"

function Field({ id, label, children }) {
    return (
        <div>
            <label htmlFor={id} className="text-sm font-semibold text-stone-800">
                {label}
            </label>
            {children}
        </div>
    )
}

function CreateProduct() {
    const navigate = useNavigate()
    const { handlecreateproduct } = useProduct()
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priceAmount: "",
        priceCurrency: "INR"
    })
    const [images, setImages] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState("")
    const [createdProduct, setCreatedProduct] = useState(null)

    const previews = useMemo(
        () =>
            images.map((image) => ({
                name: image.name,
                url: URL.createObjectURL(image)
            })),
        [images]
    )

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
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
            setMessage("Product created successfully.")
            setFormData({
                title: "",
                description: "",
                priceAmount: "",
                priceCurrency: "INR"
            })
            setImages([])
            e.target.reset()
            navigate("/seller/viewproduct", {
                state: {
                    createdProduct: product
                }
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
        <main className="min-h-screen bg-stone-100 text-stone-950">
            <div className="border-b border-stone-200 bg-white">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <Link to="/" className="font-serif text-xl font-semibold tracking-wide">
                        THE A & R STORE
                    </Link>
                    <span className="rounded-full border border-[#d8b15f]/50 bg-[#d8b15f]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-stone-800">
                        Seller Studio
                    </span>
                </div>
            </div>

            <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
                <form
                    onSubmit={handleSubmit}
                    className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-7"
                >
                    <div className="flex flex-col gap-2 border-b border-stone-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#a98235]">
                                New Product
                            </p>
                            <h1 className="mt-2 font-serif text-3xl text-stone-950 sm:text-4xl">
                                Create Product
                            </h1>
                        </div>
                        <p className="max-w-sm text-sm leading-6 text-stone-500">
                            Add product information, pricing, and up to 7 images for your store listing.
                        </p>
                    </div>

                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <Field id="title" label="Product Title">
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="Oversized linen shirt"
                                    required
                                />
                            </Field>
                        </div>

                        <Field id="priceAmount" label="Price">
                            <input
                                id="priceAmount"
                                name="priceAmount"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.priceAmount}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="2499"
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
                                <option value="INR">INR</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBY">GBY</option>
                                <option value="JPY">JPY</option>
                            </select>
                        </Field>

                        <div className="sm:col-span-2">
                            <Field id="description" label="Description">
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className={textareaClass}
                                    placeholder="Describe fit, fabric, styling details, and care notes."
                                    required
                                />
                            </Field>
                        </div>

                        <div className="sm:col-span-2">
                            <Field id="images" label="Product Images">
                                <label
                                    htmlFor="images"
                                    className="mt-2 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 bg-stone-50 px-4 py-6 text-center transition hover:border-[#d8b15f] hover:bg-[#d8b15f]/5"
                                >
                                    <span className="text-sm font-semibold text-stone-800">
                                        Upload product photos
                                    </span>
                                    <span className="mt-1 text-xs text-stone-500">
                                        PNG, JPG, or WEBP. Maximum 7 images.
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
                    </div>

                    {message && (
                        <p
                            className={`mt-5 rounded-lg px-4 py-3 text-sm font-medium ${
                                message.includes("success")
                                    ? "bg-green-50 text-green-700"
                                    : "bg-red-50 text-red-700"
                            }`}
                        >
                            {message}
                        </p>
                    )}

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="reset"
                            onClick={() => {
                                setFormData({
                                    title: "",
                                    description: "",
                                    priceAmount: "",
                                    priceCurrency: "INR"
                                })
                                setImages([])
                                setMessage("")
                                setCreatedProduct(null)
                            }}
                            className="h-12 rounded-lg border border-stone-300 px-6 text-sm font-bold text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-12 rounded-lg border border-[#d8b15f] bg-[#d8b15f] px-7 text-sm font-bold uppercase tracking-[0.2em] text-black transition hover:-translate-y-0.5 hover:bg-[#f0cf7c] hover:shadow-lg hover:shadow-[#d8b15f]/20 disabled:cursor-not-allowed disabled:translate-y-0 disabled:border-stone-300 disabled:bg-stone-300 disabled:text-stone-500 disabled:shadow-none"
                        >
                            {isSubmitting ? "Creating..." : "Create Product"}
                        </button>
                    </div>
                </form>

                <aside className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#a98235]">
                            Preview
                        </p>
                        <h2 className="mt-2 font-serif text-2xl text-stone-950">
                            Store Listing
                        </h2>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-lg border border-stone-200">
                        <div className="aspect-[4/5] bg-stone-100">
                            {previews[0] ? (
                                <img
                                    src={previews[0].url}
                                    alt={previews[0].name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center px-6 text-center text-sm text-stone-500">
                                    Product image preview
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="line-clamp-2 text-base font-bold text-stone-950">
                                {formData.title || "Product title"}
                            </h3>
                            <p className="mt-2 text-sm font-semibold text-stone-700">
                                {formData.priceAmount
                                    ? `${formData.priceCurrency} ${formData.priceAmount}`
                                    : "INR 0.00"}
                            </p>
                            <p className="mt-3 line-clamp-4 text-sm leading-6 text-stone-500">
                                {formData.description ||
                                    "Your product description will appear here as you type."}
                            </p>
                        </div>
                    </div>

                    {previews.length > 1 && (
                        <div className="mt-4 grid grid-cols-4 gap-2">
                            {previews.slice(1).map((image) => (
                                <img
                                    key={image.url}
                                    src={image.url}
                                    alt={image.name}
                                    className="aspect-square rounded-md border border-stone-200 object-cover"
                                />
                            ))}
                        </div>
                    )}

                    {createdProduct && (
                        <p className="mt-5 rounded-lg bg-stone-100 px-4 py-3 text-sm text-stone-600">
                            Created listing:{" "}
                            <span className="font-semibold text-stone-900">
                                {createdProduct.title}
                            </span>
                        </p>
                    )}
                </aside>
            </section>
        </main>
    )
}

export default CreateProduct
