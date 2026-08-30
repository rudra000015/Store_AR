import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../Hook/useAuth";
import { useTheme } from "../../../hooks/useTheme";
import boutiqueBg from "../../../app/assets/boutique-register-bg.png";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Card from "../../../components/ui/Card";

function Login() {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await handleLogin({
        email: formData.email,
        password: formData.password,
      });

      if (user?.role === "Seller") {
        navigate("/seller");
      } else {
        navigate("/buyer");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        err.message ||
        "Login failed. Please verify credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FBF9F4] text-[#171513] flex flex-col justify-between selection:bg-[#C8A96A] selection:text-[#0D0D0D] transition-colors duration-300 font-sans">
      {/* Top Luxury Navbar */}
      <header className="border-b border-[#E5DCCB] bg-[#FFFDF8]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
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
              className="h-9 w-9 rounded-md border border-[#E5DCCB] bg-[#F7F3EB]/60 text-xs flex items-center justify-center hover:bg-[#E5DCCB] transition cursor-pointer text-[#171513]"
              title="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <Link
              to="/register"
              className="text-xs font-sans font-semibold tracking-wider text-[#716B63] hover:text-[#C8A96A] transition-colors duration-300"
            >
              Don't have an account? <span className="text-[#C8A96A] font-bold underline ml-1 hover:text-[#D8B77A]">Sign Up</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Split Body Layout */}
      <section className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 p-6 lg:grid-cols-12 lg:p-12">
        {/* Left Side: Editorial Banner */}
        <div className="relative hidden h-full min-h-[520px] overflow-hidden rounded-[18px] border border-[#E5DCCB] lg:block lg:col-span-6">
          <img
            src={boutiqueBg}
            alt="Boutique Member Authentication"
            className="h-full w-full object-cover brightness-[0.96] contrast-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FBF9F4] via-[#FBF9F4]/40 to-transparent p-12 flex flex-col justify-end text-left">
            <span className="font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-[#886D3B] mb-2">
              RETURNING MEMBER
            </span>
            <h2 className="font-brand text-4xl lg:text-5xl font-light leading-tight text-[#171513] tracking-wide uppercase">
              Unlock Your <br />
              Style Vault.
            </h2>
            <p className="mt-4 max-w-md text-xs leading-relaxed text-[#716B63] font-sans font-light tracking-wide">
              Sign in to manage your drops, build variants, or explore signature collections.
            </p>
          </div>
        </div>

        {/* Right Side: Authentication Form Card */}
        <div className="lg:col-span-6 flex justify-center w-full">
          <Card className="w-full max-w-lg p-8 space-y-6 hover" hover>
            <div className="text-left">
              <span className="font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-[#886D3B]">
                SIGN IN
              </span>
              <h1 className="mt-2 font-brand text-3xl font-light text-[#171513] tracking-wide uppercase">
                Welcome Back
              </h1>
              <p className="mt-2 text-xs text-[#716B63] font-sans font-light">
                Please enter your credentials to access your account.
              </p>
            </div>

            {error && (
              <div className="rounded-lg border border-[#A65D52]/20 bg-[#A65D52]/10 px-4 py-3 text-xs font-semibold text-[#A65D52] tracking-wide text-left">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
              />

              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />

              <div className="pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Signing In..." : "Unlock Vault"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </section>
    </main>
  );
}

export default Login;
