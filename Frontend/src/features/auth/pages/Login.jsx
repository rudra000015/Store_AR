import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "../Hook/useAuth"
import boutiqueBg from "../../../app/assets/boutique-register-bg.png"

function Login() {
  const navigate = useNavigate()
  const { handleLogin } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const user = await handleLogin(formData)
      if (user?.role === "Seller") {
        navigate("/seller")
      } else {
        navigate("/buyer")
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        err.message ||
        "Could not log in. Please check your credentials."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0c10] text-stone-100 flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-stone-800/80 bg-[#0f1118]/95 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-brand text-lg font-bold tracking-[0.2em] text-[#f0cf7c]">
              THE A&R STORE
            </span>
          </Link>

          <Link
            to="/register"
            className="text-xs font-semibold text-stone-400 hover:text-[#d8b15f] transition"
          >
            Need an account? <span className="text-[#f0cf7c] underline ml-1">Join</span>
          </Link>
        </div>
      </header>

      {/* Split Body Layout */}
      <section className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 p-6 lg:grid-cols-2 lg:p-12">
        {/* Left Side: High Fashion Editorial Card */}
        <div className="relative hidden h-full min-h-[500px] overflow-hidden rounded-3xl border border-stone-800 lg:block">
          <img
            src={boutiqueBg}
            alt="Boutique Luxury Editorial"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-10 flex flex-col justify-end">
            <span className="font-brand text-xs uppercase tracking-[0.25em] text-[#d8b15f]">
              Members Vault
            </span>
            <h2 className="mt-2 font-serif text-4xl font-normal leading-tight text-white">
              Curated Style. <br />
              Tailored for You.
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-stone-300">
              Access your personalized vault, tracked boutique orders, and exclusive seasonal releases.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form Card */}
        <div className="mx-auto w-full max-w-md rounded-3xl border border-stone-800/90 bg-[#12141c] p-8 shadow-2xl space-y-6">
          <div>
            <span className="font-brand text-xs uppercase tracking-[0.25em] text-[#d8b15f]">
              Welcome Back
            </span>
            <h1 className="mt-1 font-serif text-3xl font-medium text-white">
              Sign In to Your Account
            </h1>
            <p className="mt-1 text-xs text-stone-400">
              Enter your credentials to access your buyer or seller studio.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-semibold text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="mt-1.5 h-11 w-full rounded-xl border border-stone-800 bg-[#0d0e14] px-4 text-xs text-stone-100 placeholder:text-stone-600 outline-none transition focus:border-[#d8b15f] focus:ring-1 focus:ring-[#d8b15f]/40"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] font-semibold text-[#d8b15f] hover:underline"
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
                className="mt-1.5 h-11 w-full rounded-xl border border-stone-800 bg-[#0d0e14] px-4 text-xs text-stone-100 placeholder:text-stone-600 outline-none transition focus:border-[#d8b15f] focus:ring-1 focus:ring-[#d8b15f]/40"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-11 w-full rounded-xl bg-gradient-to-r from-[#d8b15f] via-[#e5c378] to-[#c49842] text-xs font-bold uppercase tracking-[0.2em] text-black shadow-lg shadow-[#d8b15f]/15 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          {/* Alternative Auth */}
          <div className="space-y-4 pt-2">
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-stone-800" />
              <span className="absolute bg-[#12141c] px-3 text-[10px] uppercase tracking-widest text-stone-500">
                Or Continue With
              </span>
            </div>

            <a
              href="http://localhost:3000/api/auth/google"
              className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-stone-700 bg-[#161922] text-xs font-semibold text-stone-200 hover:border-stone-500 hover:bg-[#1a1e2d] transition"
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
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-900 bg-[#08090d] py-4 text-center text-xs text-stone-500">
        © 2026 THE A&R STORE. Handcrafted with luxury standards.
      </footer>
    </main>
  )
}

export default Login
