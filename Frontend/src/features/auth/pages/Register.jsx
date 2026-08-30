import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../Hook/useAuth";
import { useTheme } from "../../../hooks/useTheme";
import boutiqueBg from "../../../app/assets/boutique-register-bg.png";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Card from "../../../components/ui/Card";

function Register() {
  const navigate = useNavigate();
  const { handleRegister } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    contact: "",
    password: "",
    isSeller: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await handleRegister(formData);
      if (user?.role === "Seller") {
        navigate("/seller");
      } else {
        navigate("/buyer");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FBF9F4] dark:bg-[#0D0D0D] text-[#171513] dark:text-[#FBF9F4] flex flex-col justify-between selection:bg-[#C8A96A] selection:text-[#0D0D0D] transition-colors duration-300 font-sans">
      {/* Top Luxury Navbar */}
      <header className="border-b border-[#E5DCCB] dark:border-[#333333] bg-[#FFFDF8]/80 dark:bg-[#0D0D0D]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-brand text-lg font-bold tracking-[0.25em] text-[#C8A96A] hover:text-[#D8B77A] transition-colors duration-300">
              THE A&R STORE
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="h-9 w-9 rounded-md border border-[#E5DCCB] dark:border-[#333333] bg-[#F7F3EB]/60 dark:bg-[#1A1A1A]/60 text-xs flex items-center justify-center hover:bg-[#E5DCCB] dark:hover:bg-[#333333] transition cursor-pointer text-[#171513] dark:text-[#FBF9F4]"
              title="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <Link
              to="/login"
              className="text-xs font-sans font-semibold tracking-wider text-[#716B63] dark:text-[#9A948B] hover:text-[#C8A96A] transition-colors duration-300"
            >
              Already a member? <span className="text-[#C8A96A] font-bold underline ml-1 hover:text-[#D8B77A]">Sign In</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Split Body Layout */}
      <section className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 p-6 lg:grid-cols-12 lg:p-12">
        {/* Left Side: Editorial Banner */}
        <div className="relative hidden h-full min-h-[580px] overflow-hidden rounded-[18px] border border-[#E5DCCB] dark:border-[#333333] lg:block lg:col-span-6">
          <img
            src={boutiqueBg}
            alt="Boutique Member Registration"
            className="h-full w-full object-cover brightness-[0.96] contrast-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FBF9F4] dark:from-[#0D0D0D] via-[#FBF9F4]/40 dark:via-[#0D0D0D]/40 to-transparent p-12 flex flex-col justify-end text-left">
            <span className="font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-[#886D3B] dark:text-[#C8A96A] mb-2">
              JOIN THE MOVEMENT
            </span>
            <h2 className="font-brand text-4xl lg:text-5xl font-light leading-tight text-[#171513] dark:text-[#FBF9F4] tracking-wide uppercase">
              Where Style <br />
              Meets Identity.
            </h2>
            <p className="mt-4 max-w-md text-xs leading-relaxed text-[#716B63] dark:text-[#9A948B] font-sans font-light tracking-wide">
              Create an account to shop limited boutique drops, or register as a seller to launch your independent studio.
            </p>
          </div>
        </div>

        {/* Right Side: Registration Form Card */}
        <div className="lg:col-span-6 flex justify-center w-full">
          <Card className="w-full max-w-lg p-8 space-y-6 hover" hover>
            <div className="text-left">
              <span className="font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-[#886D3B] dark:text-[#C8A96A]">
                CREATE ACCOUNT
              </span>
              <h1 className="mt-2 font-brand text-3xl font-light text-[#171513] dark:text-[#FBF9F4] tracking-wide uppercase">
                Become a Member
              </h1>
              <p className="mt-2 text-xs text-[#716B63] dark:text-[#9A948B] font-sans font-light">
                Select your membership role and complete your registration.
              </p>
            </div>

            {error && (
              <div className="rounded-lg border border-[#A65D52]/20 bg-[#A65D52]/10 px-4 py-3 text-xs font-semibold text-[#A65D52] tracking-wide text-left">
                ⚠️ {error}
              </div>
            )}

            {/* Role Selector Pills */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, isSeller: false }))}
                className={`flex flex-col items-center justify-center rounded-xl border p-4 transition-all duration-300 cursor-pointer ${!formData.isSeller
                    ? "border-[#C8A96A] bg-[#C8A96A]/5 text-[#C8A96A]"
                    : "border-[#E5DCCB] dark:border-[#333333] bg-[#FFFDF8] dark:bg-[#1A1A1A] text-[#716B63] dark:text-[#9A948B] hover:border-[#C8A96A]/50"
                  }`}
              >
                <span className="text-xs font-sans font-bold uppercase tracking-wider">Buyer</span>
                <span className="text-[9px] mt-0.5 uppercase tracking-widest opacity-60">Curated Shopping</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, isSeller: true }))}
                className={`flex flex-col items-center justify-center rounded-xl border p-4 transition-all duration-300 cursor-pointer ${formData.isSeller
                    ? "border-[#C8A96A] bg-[#C8A96A]/5 text-[#C8A96A]"
                    : "border-[#E5DCCB] dark:border-[#333333] bg-[#FFFDF8] dark:bg-[#1A1A1A] text-[#716B63] dark:text-[#9A948B] hover:border-[#C8A96A]/50"
                  }`}
              >
                <span className="text-xs font-sans font-bold uppercase tracking-wider">Seller Studio</span>
                <span className="text-[9px] mt-0.5 uppercase tracking-widest opacity-60">Boutique Listing</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                id="fullname"
                type="text"
                name="fullname"
                required
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Rudra Rathore"
              />

              <Input
                label="Email Address"
                id="email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
              />

              <Input
                label="Contact Number"
                id="contact"
                type="text"
                name="contact"
                required
                value={formData.contact}
                onChange={handleChange}
                placeholder="+91 98765 43210"
              />

              <div className="relative text-left">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#716B63] dark:text-[#9A948B]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#C8A96A] hover:text-[#D8B77A] transition cursor-pointer"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="h-10 w-full rounded-lg border border-[#E5DCCB] dark:border-[#333333] bg-[#FFFDF8] dark:bg-[#0D0D0D] px-3 text-[11px] text-[#171513] dark:text-[#FBF9F4] placeholder-[#9A948B] dark:placeholder-[#716B63] outline-none transition duration-200 focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-6"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="space-y-5 pt-2">
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-[#E5DCCB] dark:border-[#333333]" />
                <span className="absolute bg-[#FFFDF8] dark:bg-[#1A1A1A] px-3 text-[9px] uppercase tracking-[0.25em] text-[#9A948B]">
                  Or Continue With
                </span>
              </div>

              <a
                href="http://localhost:3000/api/auth/google"
                className="flex h-11 w-full items-center justify-center gap-3 rounded-full border border-[#E5DCCB] dark:border-[#333333] bg-white dark:bg-[#1A1A1A] text-xs font-sans font-semibold text-[#171513] dark:text-[#FBF9F4] hover:border-[#C8A96A] hover:bg-[#FFFDF8] dark:hover:bg-[#0D0D0D] transition duration-200"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z"
                  />
                </svg>
                <span>Continue with Google</span>
              </a>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5DCCB] dark:border-[#333333] bg-[#F7F3EB]/50 dark:bg-[#0D0D0D]/50 py-6 text-center text-[9px] font-sans font-bold tracking-wider uppercase text-[#9A948B] dark:text-[#716B63] transition-colors duration-300">
        © 2026 THE A&R STORE. Handcrafted with luxury standards.
      </footer>
    </main>
  );
}

export default Register;
