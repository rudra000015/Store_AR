import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useProduct } from "../Hook/useProduct";
import { useAuth } from "../../auth/Hook/useAuth";
import { useTheme } from "../../../hooks/useTheme";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";

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

function ViewProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogout, user } = useAuth();
  const { handlegetsellerproduct } = useProduct();
  const { theme, toggleTheme } = useTheme();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const createdProduct = location.state?.createdProduct;

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
    async function loadProducts() {
      setIsLoading(true);
      setMessage("");

      try {
        const sellerProducts = await handlegetsellerproduct();
        setProducts(sellerProducts || []);
      } catch (error) {
        const errorMessage =
          error.response?.data?.msg ||
          error.message ||
          "Could not fetch seller products.";
        setMessage(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [handlegetsellerproduct]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const totalStock = (p.variants || []).reduce((acc, v) => acc + Number(v.stock || 0), 0);
      if (activeTab === "Published") return totalStock > 0;
      if (activeTab === "Out of Stock") return totalStock === 0 && (p.variants?.length > 0);
      if (activeTab === "Low Stock") return totalStock > 0 && totalStock <= 10;
      return true;
    });
  }, [products, activeTab]);

  return (
    <main className="min-h-screen bg-[#FBF9F4] text-[#171513] pb-16 selection:bg-[#C8A96A] selection:text-[#0D0D0D] transition-colors duration-300 font-sans">
      {/* Seller Top Navbar */}
      <header className="border-b border-[#E5DCCB] bg-[#FFFDF8]/95 sticky top-0 z-40 backdrop-blur-md">
        <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link to="/seller" className="flex items-center gap-2 group">
              <span className="font-brand text-lg font-bold tracking-[0.25em] text-[#C8A96A] hover:text-[#D8B77A] transition duration-300">
                THE A&R STORE
              </span>
              <span className="rounded-md border border-[#C8A96A]/20 bg-[#C8A96A]/5 px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-[#C8A96A]">
                Studio
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#716B63]">
              <Link to="/seller" className="hover:text-[#C8A96A] transition">
                Dashboard
              </Link>
              <Link to="/seller/viewproduct" className="text-[#C8A96A] transition">
                Product Vault
              </Link>
              <Link to="/seller/createproduct" className="hover:text-[#C8A96A] transition">
                Add Product
              </Link>
              <Link to="/buyer" className="hover:text-[#C8A96A] transition">
                Storefront
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="h-9 w-9 rounded-md border border-[#E5DCCB] text-xs flex items-center justify-center hover:bg-[#F7F3EB] transition cursor-pointer text-[#171513]"
              title="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <Link to="/seller/createproduct">
              <Button className="h-9 px-4 text-[9px] font-sans font-bold uppercase tracking-widest bg-[#C8A96A] text-[#0D0D0D] hover:bg-[#D8B77A] rounded-full">
                + ADD PRODUCT
              </Button>
            </Link>

            <button
              onClick={onLogout}
              disabled={isLoggingOut}
              className="h-9 px-4 bg-transparent border border-[#886D3B] text-[#171513] hover:bg-[#C8A96A] hover:text-[#0D0D0D] hover:border-transparent text-[9px] font-sans font-bold uppercase tracking-widest transition rounded-full flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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
      <section className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 space-y-6 text-left">
        {/* Header Title Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#E5DCCB] pb-6">
          <div>
            <span className="font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-[#886D3B]">
              INVENTORY & CATALOG
            </span>
            <h1 className="mt-2 font-brand text-3xl sm:text-4xl text-[#171513] font-light tracking-wide uppercase">
              Product Vault
            </h1>
            <p className="mt-2 text-xs text-[#716B63] font-sans font-light">
              Manage your boutique listings, variants, pricing, and stock levels.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full border border-[#E5DCCB] bg-[#FFFDF8] px-4 py-2 text-[9px] font-sans font-bold tracking-wider text-[#171513] uppercase shadow-sm">
              {products.length} Products
            </span>
          </div>
        </div>

        {/* Notifications */}
        {createdProduct && (
          <div className="bg-[#66745A]/10 border border-[#66745A]/20 px-4 py-3 text-xs font-semibold text-[#66745A] rounded-xl">
            ✓ Product published to vault: {createdProduct.title}
          </div>
        )}

        {message && (
          <div className="bg-[#A65D52]/10 border border-[#A65D52]/20 px-4 py-3 text-xs font-semibold text-[#A65D52] rounded-xl">
            ⚠️ {message}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-2.5 overflow-x-auto border-b border-[#E5DCCB] pb-3 scrollbar-none">
          {["All", "Published", "Low Stock", "Out of Stock"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-[9px] font-sans font-bold uppercase tracking-wider transition-all cursor-pointer ${activeTab === tab
                  ? "bg-[#C8A96A] text-[#0D0D0D] shadow-sm"
                  : "border border-[#E5DCCB] bg-[#FFFDF8] text-[#716B63] hover:text-[#171513] transition"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-xs text-[#9A948B] font-bold uppercase tracking-widest animate-pulse">
            Loading products from vault...
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const imageUrl = product.images?.[0]?.url;
              const variantCount = product.variants?.length || 0;
              const totalStock = (product.variants || []).reduce(
                (acc, v) => acc + Number(v.stock || 0),
                0
              );

              return (
                <div
                  key={product._id}
                  className="flex flex-col justify-between overflow-hidden rounded-[18px] border border-[#E5DCCB] bg-[#FFFDF8] shadow-[0_10px_30px_rgba(20,17,12,0.03)] transition duration-300 hover:border-[#C8A96A] hover:shadow-[0_10px_30px_rgba(20,17,12,0.06)]"
                >
                  <div className="relative aspect-[4/5] bg-[#F2EFE8] overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[9px] text-[#716B63] uppercase tracking-widest font-bold bg-[#F2EFE8]">
                        No Preview Image
                      </div>
                    )}

                    <div className="absolute inset-x-3 top-3 flex justify-between">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[8px] font-sans font-bold uppercase tracking-wider ${totalStock > 0
                            ? "bg-[#66745A] text-white"
                            : "bg-[#A65D52] text-white"
                          }`}
                      >
                        {totalStock > 0 ? "Published" : "Out of stock"}
                      </span>
                      <span className="rounded-full border border-[#E5DCCB] bg-[#FFFDF8]/90 px-2.5 py-0.5 text-[8px] font-sans font-bold text-[#171513] uppercase tracking-wide">
                        {variantCount} var.
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-1 flex-col justify-between text-left">
                    <div>
                      <h3 className="font-brand text-[15px] font-semibold text-[#171513] tracking-wide line-clamp-1">
                        {product.title}
                      </h3>
                      <p className="mt-1 text-xs font-sans font-bold text-[#886D3B]">
                        {formatPrice(product.price)}
                      </p>
                      <p className="mt-2 line-clamp-2 text-[10px] leading-relaxed text-[#716B63] font-sans font-light">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E5DCCB]/60 flex items-center justify-between gap-2">
                      <span className="text-[9px] text-[#716B63] font-sans font-bold uppercase tracking-wide">
                        Total Stock: <strong className="text-[#171513] ml-1">{totalStock}</strong>
                      </span>

                      <Link to={`/seller/product/${product._id}`}>
                        <button
                          type="button"
                          className="h-8 px-4 border border-[#886D3B] text-[#171513] hover:bg-[#C8A96A] hover:text-[#0D0D0D] hover:border-transparent text-[9px] font-sans font-bold uppercase tracking-widest transition rounded-full cursor-pointer"
                        >
                          Variants
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Card className="p-16 text-center space-y-4 border border-[#E5DCCB] bg-[#FFFDF8]">
            <h3 className="font-brand text-2xl text-[#171513] font-light uppercase tracking-wide">No products found</h3>
            <p className="text-xs text-[#716B63] max-w-sm mx-auto leading-relaxed">
              Create your first product listing to publish to your boutique storefront catalog.
            </p>
            <Link to="/seller/createproduct" className="inline-block mt-2">
              <Button className="h-10 px-6 text-[10px] tracking-wider rounded-full">
                + Create Product
              </Button>
            </Link>
          </Card>
        )}
      </section>
    </main>
  );
}

export default ViewProduct;
