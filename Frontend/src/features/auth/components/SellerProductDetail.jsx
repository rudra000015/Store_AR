import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useProduct } from "../../products/Hook/useProduct";
import { useAuth } from "../Hook/useAuth";
import { useTheme } from "../../../hooks/useTheme";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Card from "../../../components/ui/Card";

const currencyOptions = ["INR", "USD", "EUR", "GBY", "JPY"];

function formatPrice(price) {
  const currency = price?.currency === "GBY" ? "GBP" : price?.currency || "INR";
  const amount = Number(price?.amount || 0);

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${price?.currency || "INR"} ${amount}`;
  }
}

function attributesToEntries(attributes) {
  if (!attributes) return [];
  return Object.entries(attributes instanceof Map ? Object.fromEntries(attributes) : attributes);
}

function SellerProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleLogout, user } = useAuth();
  const { handlegetproductbyId, handlecreateproductvariant } = useProduct();
  const { theme, toggleTheme } = useTheme();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [formData, setFormData] = useState({
    color: "",
    size: "",
    material: "",
    stock: "",
    priceAmount: "",
    priceCurrency: "INR",
  });
  const [images, setImages] = useState([]);

  const onLogout = async () => {
    try {
      setIsLoggingOut(true);
      await handleLogout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");
        const data = await handlegetproductbyId(id);
        setProduct(data);
        setFormData((current) => ({
          ...current,
          priceCurrency: data?.price?.currency || "INR",
        }));
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.msg ||
          err.message ||
          "Could not load seller product.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [handlegetproductbyId, id]);

  const totalStock = useMemo(() => {
    return (product?.variants || []).reduce(
      (total, variant) => total + Number(variant.stock || 0),
      0
    );
  }, [product]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateVariant = async (event) => {
    event.preventDefault();
    if (!product) return;

    setSaving(true);
    setMessage("");
    setError("");

    const payload = new FormData();
    payload.append("color", formData.color.trim());
    payload.append("size", formData.size.trim());
    payload.append("material", formData.material.trim());
    payload.append("stock", formData.stock);
    payload.append("priceAmount", formData.priceAmount);
    payload.append("priceCurrency", formData.priceCurrency);
    images.forEach((img) => payload.append("images", img));

    try {
      const updatedProduct = await handlecreateproductvariant(product._id, payload);
      setProduct(updatedProduct);
      setMessage("Boutique variant registered in ledger successfully.");
      setFormData({
        color: "",
        size: "",
        material: "",
        stock: "",
        priceAmount: "",
        priceCurrency: product?.price?.currency || "INR",
      });
      setImages([]);
      event.target.reset();
    } catch (err) {
      console.error("Variant creation failed:", err);
      const errorMessage =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        err.message ||
        "Failed to register variant.";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FBF9F4] dark:bg-[#0D0D0D] text-[#171513] dark:text-[#FBF9F4] pb-16 selection:bg-[#C8A96A] selection:text-[#0D0D0D] transition-colors duration-300 font-sans">
      {/* Seller Top Navbar */}
      <header className="border-b border-[#E5DCCB] dark:border-[#333333] bg-[#FFFDF8]/95 dark:bg-[#0D0D0D]/95 sticky top-0 z-40 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link to="/seller" className="flex items-center gap-2 group">
              <span className="font-brand text-lg font-bold tracking-[0.25em] text-[#C8A96A] hover:text-[#D8B77A] transition duration-300">
                THE A&R STORE
              </span>
              <span className="rounded-md border border-[#C8A96A]/20 bg-[#C8A96A]/5 px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-[#C8A96A]">
                Studio
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#716B63] dark:text-[#9A948B]">
              <Link to="/seller" className="hover:text-[#C8A96A] dark:hover:text-[#C8A96A] transition text-[#716B63] dark:text-[#9A948B]">
                Dashboard
              </Link>
              <Link to="/seller/viewproduct" className="hover:text-[#C8A96A] dark:hover:text-[#C8A96A] transition text-[#716B63] dark:text-[#9A948B]">
                Product Vault
              </Link>
              <Link to="/seller/createproduct" className="hover:text-[#C8A96A] dark:hover:text-[#C8A96A] transition text-[#716B63] dark:text-[#9A948B]">
                Add Product
              </Link>
              <Link to="/buyer" className="hover:text-[#C8A96A] dark:hover:text-[#C8A96A] transition text-[#716B63] dark:text-[#9A948B]">
                Storefront
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="h-9 w-9 rounded-md border border-[#E5DCCB] dark:border-[#333333] text-xs flex items-center justify-center hover:bg-[#F7F3EB] dark:hover:bg-[#1A1A1A] transition cursor-pointer text-[#171513] dark:text-[#FBF9F4]"
              title="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <Link to="/seller/viewproduct">
              <button
                type="button"
                className="h-9 px-4 bg-transparent border border-[#886D3B] text-[#171513] dark:text-[#FBF9F4] hover:bg-[#C8A96A] hover:text-[#0D0D0D] hover:border-transparent text-[9px] font-sans font-bold uppercase tracking-widest transition rounded-full cursor-pointer"
              >
                ← Back to Vault
              </button>
            </Link>

            <button
              onClick={onLogout}
              disabled={isLoggingOut}
              className="h-9 px-4 bg-transparent border border-[#886D3B] text-[#171513] dark:text-[#FBF9F4] hover:bg-[#C8A96A] hover:text-[#0D0D0D] hover:border-transparent text-[9px] font-sans font-bold uppercase tracking-widest transition rounded-full flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>{isLoggingOut ? "..." : "Logout"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 space-y-6 text-left">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#9A948B] font-bold tracking-widest uppercase animate-pulse">
            Loading variant ledger...
          </div>
        ) : error && !product ? (
          <Card className="p-10 text-center border border-[#E5DCCB] dark:border-[#333333] bg-[#FFFDF8] dark:bg-[#1A1A1A]">
            <h2 className="font-brand text-2xl text-[#171513] dark:text-[#FBF9F4] font-light tracking-wide uppercase">Product not available</h2>
            <p className="mt-2 text-xs text-[#A65D52] bg-[#A65D52]/5 border border-[#A65D52]/10 p-3 rounded-lg">{error}</p>
            <Link to="/seller/viewproduct" className="inline-block mt-6">
              <Button className="h-10 px-6 text-[10px] tracking-wider rounded-full">
                Back to Product Vault
              </Button>
            </Link>
          </Card>
        ) : product ? (
          <div className="space-y-6">
            {/* Notifications */}
            {(message || error) && (
              <div
                className={`rounded-xl px-4 py-3 text-xs font-semibold ${error
                    ? "bg-[#A65D52]/10 border border-[#A65D52]/20 text-[#A65D52]"
                    : "bg-[#66745A]/10 border border-[#66745A]/20 text-[#66745A]"
                  }`}
              >
                {error || message}
              </div>
            )}

            {/* Product Overview Card */}
            <Card className="p-6 border border-[#E5DCCB] dark:border-[#333333] bg-[#FFFDF8] dark:bg-[#1A1A1A]">
              <div className="grid gap-6 md:grid-cols-[140px_1fr] items-center">
                <div className="aspect-[4/5] max-h-44 overflow-hidden rounded-xl bg-[#F2EFE8] dark:bg-[#0D0D0D] border border-[#E5DCCB]/35 dark:border-[#333333]/35 shrink-0">
                  {product.images?.[0]?.url ? (
                    <img
                      src={product.images[0].url}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[9px] text-[#716B63] dark:text-[#9A948B] uppercase tracking-widest font-bold bg-[#F2EFE8] dark:bg-[#0D0D0D]">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#886D3B] dark:text-[#C8A96A]">
                        ACTIVE LISTING
                      </span>
                      <span className="rounded-full bg-[#66745A]/10 border border-[#66745A]/25 px-2.5 py-0.5 text-[8.5px] font-sans font-bold text-[#66745A] uppercase tracking-wide">
                        Live in Store
                      </span>
                    </div>
                    <h2 className="mt-2 font-brand text-2xl sm:text-3xl font-light text-[#171513] dark:text-[#FBF9F4] tracking-wide uppercase">
                      {product.title}
                    </h2>
                    <p className="mt-2 text-xs text-[#716B63] dark:text-[#9A948B] line-clamp-2 leading-relaxed font-sans font-light">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-8 border-t border-[#E5DCCB]/60 dark:border-[#333333]/60 pt-4">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest font-bold text-[#9A948B] block">
                        Base Price
                      </span>
                      <span className="text-base font-sans font-semibold text-[#886D3B] dark:text-[#C8A96A] mt-0.5 block">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest font-bold text-[#9A948B] block">
                        Total Stock
                      </span>
                      <span className="text-base font-sans font-semibold text-[#171513] dark:text-[#FBF9F4] mt-0.5 block">
                        {totalStock} units
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest font-bold text-[#9A948B] block">
                        Variants Attached
                      </span>
                      <span className="text-base font-sans font-semibold text-[#171513] dark:text-[#FBF9F4] mt-0.5 block">
                        {product.variants?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Split: Create Variant (Left) + Variant Ledger (Right) */}
            <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
              {/* Variant Creation Form */}
              <form onSubmit={handleCreateVariant} className="w-full">
                <Card className="p-6 border border-[#E5DCCB] dark:border-[#333333] bg-[#FFFDF8] dark:bg-[#1A1A1A] space-y-5 h-fit">
                  <div className="border-b border-[#E5DCCB]/60 dark:border-[#333333]/60 pb-3">
                    <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#886D3B] dark:text-[#C8A96A]">
                      SKU BUILDER
                    </span>
                    <h3 className="font-brand text-xl font-light text-[#171513] dark:text-[#FBF9F4] tracking-wide mt-1 uppercase">
                      + Add Variant Option
                    </h3>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 font-sans">
                    <Input
                      label="Color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      placeholder="e.g. Vintage Charcoal"
                    />

                    <Input
                      label="Size"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      placeholder="e.g. M, L, XL"
                    />

                    <Input
                      label="Material / Fabric"
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      placeholder="e.g. 280 GSM French Terry"
                    />

                    <Input
                      label="Initial Stock"
                      type="number"
                      min="0"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="e.g. 25"
                    />

                    <Input
                      label="Price (Amount)"
                      required
                      type="number"
                      min="0"
                      name="priceAmount"
                      value={formData.priceAmount}
                      onChange={handleInputChange}
                      placeholder="e.g. 899"
                    />

                    <div>
                      <label className="block text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#716B63] dark:text-[#9A948B] mb-1.5">
                        Currency
                      </label>
                      <select
                        name="priceCurrency"
                        value={formData.priceCurrency}
                        onChange={handleInputChange}
                        className="h-10 w-full rounded-lg border border-[#E5DCCB] dark:border-[#333333] bg-[#FFFDF8] dark:bg-[#0D0D0D] px-3 text-xs text-[#171513] dark:text-[#FBF9F4] placeholder-[#9A948B] dark:placeholder-[#716B63] outline-none focus:border-[#C8A96A] cursor-pointer"
                      >
                        {currencyOptions.map((curr) => (
                          <option key={curr} value={curr}>
                            {curr}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="font-sans">
                    <label className="block text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#716B63] dark:text-[#9A948B] mb-1.5">
                      Variant Imagery
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setImages(Array.from(e.target.files || []))}
                      className="w-full rounded-xl border border-dashed border-[#E5DCCB] dark:border-[#333333] bg-[#F7F3EB]/30 dark:bg-[#1A1A1A]/30 px-3 py-3.5 text-xs text-[#716B63] dark:text-[#9A948B] file:mr-3 file:rounded-full file:border-0 file:bg-[#C8A96A] file:px-3 file:py-1 file:text-[9px] file:font-sans file:font-bold file:uppercase file:tracking-wider file:text-[#0D0D0D] hover:border-[#C8A96A]/60 transition cursor-pointer"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={saving}
                    className="w-full h-11 mt-2 text-[10px] tracking-widest font-sans font-bold rounded-full"
                  >
                    {saving ? "Registering Variant..." : "Add to Variant Ledger"}
                  </Button>
                </Card>
              </form>

              {/* Variant Ledger Table */}
              <Card className="p-6 border border-[#E5DCCB] dark:border-[#333333] bg-[#FFFDF8] dark:bg-[#1A1A1A] space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5DCCB]/60 dark:border-[#333333]/60 pb-3">
                  <div>
                    <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#886D3B] dark:text-[#C8A96A]">
                      LEDGER VIEW
                    </span>
                    <h3 className="font-brand text-xl font-light text-[#171513] dark:text-[#FBF9F4] tracking-wide mt-1 uppercase">
                      Variant Ledger
                    </h3>
                  </div>
                  <span className="rounded-full border border-[#E5DCCB] dark:border-[#333333] bg-[#F7F3EB] dark:bg-[#0D0D0D] px-3.5 py-0.5 text-[8px] font-sans font-bold uppercase tracking-wider text-[#716B63] dark:text-[#9A948B]">
                    {product.variants?.length || 0} Registered
                  </span>
                </div>

                {product.variants?.length > 0 ? (
                  <div className="divide-y divide-[#E5DCCB]/60 dark:divide-[#333333]/60 space-y-3 pt-2">
                    {product.variants.map((variant, index) => (
                      <div
                        key={variant._id || index}
                        className="grid grid-cols-[72px_1fr_auto] gap-4 pt-3 items-center"
                      >
                        <div className="h-18 w-18 overflow-hidden rounded-xl bg-[#F2EFE8] dark:bg-[#0D0D0D] border border-[#E5DCCB]/40 dark:border-[#333333]/40 shrink-0">
                          {variant.images?.[0]?.url ? (
                            <img
                              src={variant.images[0].url}
                              alt={`${product.title} var ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[9px] text-[#716B63] dark:text-[#9A948B] uppercase font-bold bg-[#F2EFE8] dark:bg-[#0D0D0D]">
                              No Img
                            </div>
                          )}
                        </div>

                        <div className="space-y-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#171513] dark:text-[#FBF9F4] font-sans">
                              Variant #{index + 1}
                            </span>
                            <span className="text-xs font-sans font-bold text-[#886D3B] dark:text-[#C8A96A]">
                              {formatPrice(variant.price)}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {attributesToEntries(variant.attributes).map(([key, val]) =>
                              val ? (
                                <span
                                  key={key}
                                  className="rounded-md bg-[#F7F3EB] dark:bg-[#0D0D0D] border border-[#E5DCCB]/40 dark:border-[#333333]/40 px-2 py-0.5 text-[9px] font-sans font-bold uppercase tracking-wider text-[#716B63] dark:text-[#9A948B]"
                                >
                                  {key}: <strong className="text-[#171513] dark:text-[#FBF9F4] ml-0.5">{val}</strong>
                                </span>
                              ) : null
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[9px] font-sans font-bold uppercase tracking-wider ${Number(variant.stock || 0) > 0
                                ? "bg-[#66745A]/10 border border-[#66745A]/25 text-[#66745A]"
                                : "bg-[#A65D52]/10 border border-[#A65D52]/25 text-[#A65D52]"
                              }`}
                          >
                            {Number(variant.stock || 0) > 0
                              ? `${variant.stock} in stock`
                              : "Out of stock"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-14 text-center text-[#716B63] dark:text-[#9A948B] space-y-2">
                    <p className="font-brand text-lg text-[#171513] dark:text-[#FBF9F4] font-light uppercase tracking-wide">
                      No variants registered yet
                    </p>
                    <p className="text-xs max-w-xs mx-auto text-[#716B63] dark:text-[#9A948B] font-sans font-light leading-relaxed">
                      Use the SKU builder on the left to add sizes, colorways, and inventory counts.
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default SellerProductDetail;
