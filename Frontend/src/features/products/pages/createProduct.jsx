import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useProduct } from "../Hook/useProduct";
import { useAuth } from "../../auth/Hook/useAuth";
import { useTheme } from "../../../hooks/useTheme";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Card from "../../../components/ui/Card";

function Field({ id, label, children }) {
  return (
    <div className="font-sans">
      <label htmlFor={id} className="block text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#716B63] dark:text-[#9A948B] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function CreateProduct() {
  const navigate = useNavigate();
  const { handlecreateproduct } = useProduct();
  const { handleLogout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [message, setMessage] = useState("");

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

  const previews = useMemo(
    () =>
      images.map((image) => ({
        name: image.name,
        url: URL.createObjectURL(image),
      })),
    [images]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files || []).slice(0, 7));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const payload = new FormData();
    payload.append("title", formData.title.trim());
    payload.append("description", formData.description.trim());
    payload.append("priceAmount", formData.priceAmount);
    payload.append("priceCurrency", formData.priceCurrency);
    images.forEach((image) => payload.append("images", image));

    try {
      const product = await handlecreateproduct(payload);
      setMessage("Product published to vault successfully.");
      setFormData({
        title: "",
        description: "",
        priceAmount: "",
        priceCurrency: "INR",
      });
      setImages([]);
      e.target.reset();
      navigate("/seller/viewproduct", {
        state: {
          createdProduct: product,
        },
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg ||
        error.response?.data?.errors?.[0]?.msg ||
        error.message ||
        "Product creation failed.";
      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
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
              <Link to="/seller/createproduct" className="text-[#C8A96A] transition">
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

            <Link
              to="/seller/viewproduct"
              className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#716B63] dark:text-[#9A948B] hover:text-[#C8A96A] dark:hover:text-[#C8A96A] transition mr-2"
            >
              ← Back to Vault
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

      {/* Main Container */}
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 pt-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 text-left">
        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="rounded-[18px] border border-[#E5DCCB] dark:border-[#333333] bg-[#FFFDF8] dark:bg-[#1A1A1A] p-6 sm:p-8 shadow-[0_10px_30px_rgba(20,17,12,0.03)] dark:shadow-none space-y-6"
        >
          <div className="border-b border-[#E5DCCB]/60 dark:border-[#333333]/60 pb-5">
            <span className="font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-[#886D3B] dark:text-[#C8A96A]">
              PUBLISH NEW DROP
            </span>
            <h1 className="mt-2 font-brand text-3xl text-[#171513] dark:text-[#FBF9F4] font-light tracking-wide uppercase">
              Add a Product
            </h1>
            <p className="mt-2 text-xs text-[#716B63] dark:text-[#9A948B] font-sans font-light">
              Publish a base product to your vault. You can attach sizes & colors in the Variant Ledger next.
            </p>
          </div>

          <div className="space-y-5">
            <Input
              label="Product Title"
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Oversized Heavyweight Cotton T-Shirt"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Base Price"
                id="priceAmount"
                name="priceAmount"
                type="number"
                min="0"
                step="0.01"
                value={formData.priceAmount}
                onChange={handleChange}
                placeholder="899"
                required
              />

              <Field id="priceCurrency" label="Currency">
                <select
                  id="priceCurrency"
                  name="priceCurrency"
                  value={formData.priceCurrency}
                  onChange={handleChange}
                  className="h-10 w-full rounded-lg border border-[#E5DCCB] dark:border-[#333333] bg-[#FFFDF8] dark:bg-[#0D0D0D] px-4 text-xs text-[#171513] dark:text-[#FBF9F4] placeholder-[#9A948B] dark:placeholder-[#716B63] outline-none transition duration-200 focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A] cursor-pointer"
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
                className="mt-2 min-h-32 w-full resize-none rounded-lg border border-[#E5DCCB] dark:border-[#333333] bg-[#FFFDF8] dark:bg-[#0D0D0D] px-4 py-3 text-xs leading-relaxed text-[#171513] dark:text-[#FBF9F4] placeholder-[#9A948B] dark:placeholder-[#716B63] outline-none transition duration-200 focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]"
                placeholder="Describe tailoring details, fabric GSM, fit, silhouette, and care guidelines..."
                required
              />
            </Field>

            <Field id="images" label="Product Imagery (Up to 7)">
              <label
                htmlFor="images"
                className="mt-2 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#E5DCCB] dark:border-[#333333] bg-[#F7F3EB]/30 dark:bg-[#1A1A1A]/30 px-4 py-6 text-center transition hover:border-[#C8A96A]/60 hover:bg-[#F7F3EB]/60 dark:hover:bg-[#1A1A1A]/60"
              >
                <div className="h-10 w-10 rounded-full border border-[#C8A96A]/20 bg-[#C8A96A]/10 flex items-center justify-center text-[#C8A96A] mb-2">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <span className="text-xs font-sans font-bold text-[#171513] dark:text-[#FBF9F4] uppercase tracking-wider">
                  {images.length > 0
                    ? `${images.length} image(s) selected`
                    : "Drag images here or browse files"}
                </span>
                <span className="mt-1 text-[10px] uppercase tracking-wider text-[#9A948B] dark:text-[#716B63]">
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
              className={`rounded-lg px-4 py-3 text-xs font-semibold ${message.includes("successfully")
                  ? "bg-[#66745A]/10 border border-[#66745A]/20 text-[#66745A]"
                  : "bg-[#A65D52]/10 border border-[#A65D52]/20 text-[#A65D52]"
                }`}
            >
              {message}
            </div>
          )}

          <div className="pt-4 border-t border-[#E5DCCB]/60 dark:border-[#333333]/60 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  title: "",
                  description: "",
                  priceAmount: "",
                  priceCurrency: "INR",
                });
                setImages([]);
                setMessage("");
              }}
              className="h-11 px-6 border border-[#886D3B] text-[#171513] dark:text-[#FBF9F4] hover:bg-[#C8A96A] hover:text-[#0D0D0D] hover:border-transparent text-[10px] font-sans font-bold uppercase tracking-widest transition rounded-full cursor-pointer"
            >
              Reset
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-8 bg-[#C8A96A] text-[#0D0D0D] hover:bg-[#D8B77A] text-[10px] font-sans font-bold uppercase tracking-[0.12em] transition rounded-full cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Publishing..." : "Add to Vault"}
            </button>
          </div>
        </form>

        {/* Live Preview Column */}
        <aside className="h-fit">
          <Card className="p-6 border border-[#E5DCCB] dark:border-[#333333] bg-[#FFFDF8] dark:bg-[#1A1A1A] space-y-5 hover" hover>
            <div>
              <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#886D3B] dark:text-[#C8A96A]">
                LIVE STOREFRONT PREVIEW
              </span>
              <h2 className="font-brand text-2xl text-[#171513] dark:text-[#FBF9F4] font-light mt-1 tracking-wide uppercase">
                Store Listing Card
              </h2>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#E5DCCB] dark:border-[#333333] bg-[#FFFDF8] dark:bg-[#1A1A1A] shadow-sm dark:shadow-none">
              <div className="aspect-[4/5] bg-[#F2EFE8] dark:bg-[#0D0D0D] overflow-hidden relative">
                {previews[0] ? (
                  <img
                    src={previews[0].url}
                    alt={previews[0].name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-6 text-center text-[9px] text-[#716B63] dark:text-[#9A948B] uppercase tracking-widest font-bold bg-[#F2EFE8] dark:bg-[#0D0D0D]">
                    Image preview will render here
                  </div>
                )}
                <div className="absolute left-3 top-3">
                  <span className="rounded-full border border-[#E5DCCB]/40 dark:border-[#333333]/40 bg-[#FFFDF8]/90 dark:bg-[#0D0D0D]/90 px-2.5 py-0.5 text-[8px] font-sans font-bold uppercase tracking-wider text-[#171513] dark:text-[#FBF9F4]">
                    Preview
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-brand text-[15px] font-semibold text-[#171513] dark:text-[#FBF9F4] tracking-wide line-clamp-1">
                  {formData.title || "Your Product Title"}
                </h3>
                <p className="text-sm font-sans font-bold text-[#886D3B] dark:text-[#C8A96A]">
                  {formData.priceAmount
                    ? `${formData.priceCurrency} ${formData.priceAmount}`
                    : "INR 0.00"}
                </p>
                <p className="line-clamp-3 text-xs leading-relaxed text-[#716B63] dark:text-[#9A948B] font-sans font-light">
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
                    className="aspect-square rounded-xl border border-[#E5DCCB] dark:border-[#333333] object-cover bg-[#F2EFE8] dark:bg-[#0D0D0D]"
                  />
                ))}
              </div>
            )}
          </Card>
        </aside>
      </section>
    </main>
  );
}

export default CreateProduct;
