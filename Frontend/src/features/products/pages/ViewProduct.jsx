import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router"
import { useProduct } from "../Hook/useProduct"

function ProductImage({ product }) {
    const imageUrl = product?.images?.[0]?.url

    return (
        <div className="aspect-[4/5] bg-stone-100">
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={product.title}
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="flex h-full items-center justify-center px-5 text-center text-sm text-stone-500">
                    No image
                </div>
            )}
        </div>
    )
}

function ViewProduct() {
    const location = useLocation()
    const { handlegetsellerproduct } = useProduct()
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [message, setMessage] = useState("")
    const createdProduct = location.state?.createdProduct

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
        <main className="min-h-screen bg-stone-100 text-stone-950">
            <div className="border-b border-stone-200 bg-white">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#a98235]">
                            Seller Studio
                        </p>
                        <h1 className="mt-2 font-serif text-3xl text-stone-950 sm:text-4xl">
                            View Product
                        </h1>
                    </div>
                    <Link
                        to="/seller/createproduct"
                        className="inline-flex h-11 items-center justify-center rounded-lg border border-[#d8b15f] bg-[#d8b15f] px-5 text-sm font-bold text-black transition hover:bg-[#f0cf7c]"
                    >
                        Create Product
                    </Link>
                </div>
            </div>

            <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {createdProduct && (
                    <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                        Product created successfully: {createdProduct.title}
                    </div>
                )}

                {message && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {message}
                    </div>
                )}

                {isLoading ? (
                    <div className="rounded-lg border border-stone-200 bg-white p-8 text-center text-sm text-stone-500">
                        Loading seller products...
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.map((product) => (
                            <article
                                key={product._id}
                                className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm"
                            >
                                <ProductImage product={product} />
                                <div className="p-4">
                                    <h2 className="line-clamp-2 text-base font-bold text-stone-950">
                                        {product.title}
                                    </h2>
                                    <p className="mt-2 text-sm font-semibold text-stone-700">
                                        {product.price?.currency || "INR"}{" "}
                                        {product.price?.amount ?? "0"}
                                    </p>
                                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-500">
                                        {product.description}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg border border-stone-200 bg-white p-8 text-center">
                        <h2 className="font-serif text-2xl text-stone-950">
                            No products yet
                        </h2>
                        <p className="mt-2 text-sm text-stone-500">
                            Create your first product to show it here.
                        </p>
                        <Link
                            to="/seller/createproduct"
                            className="mt-5 inline-flex h-11 items-center justify-center rounded-lg border border-[#d8b15f] bg-[#d8b15f] px-5 text-sm font-bold text-black transition hover:bg-[#f0cf7c]"
                        >
                            Create Product
                        </Link>
                    </div>
                )}
            </section>
        </main>
    )
}

export default ViewProduct
