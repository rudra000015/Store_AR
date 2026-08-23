import { useState } from 'react'
import boutiqueBg from '../../../app/assets/boutique-register-bg.png'
import { Link, useNavigate } from 'react-router'

const inputClass =
  'mt-2 h-11 w-full rounded-lg border border-white/15 bg-black/35 px-4 text-sm text-stone-50 outline-none transition placeholder:text-stone-400 focus:border-[#d8b15f] focus:bg-black/45 focus:ring-2 focus:ring-[#d8b15f]/30 sm:h-12'

function EyeIcon({ hidden }) {
  return hidden ? (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 3 18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.5 5.6A9.8 9.8 0 0 1 12 5c5 0 8.5 5 9 7a11.6 11.6 0 0 1-2.1 3.6" />
      <path d="M6.6 6.6C4.7 7.8 3.4 9.7 3 12c.5 2 4 7 9 7 1.4 0 2.7-.4 3.8-1" />
    </svg>
  ) : (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function TextInput({ id, label, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-stone-100">
        {label}
      </label>
      <input id={id} className={inputClass} {...props} />
    </div>
  )
}

function Register() {
    const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    contact: '',
    isSeller: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.msg || data.errors?.[0]?.msg || 'Registration failed')
      }

      setMessage('Registration successful')
      navigate("/")
    } catch (error) {
      setMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main
      className="min-h-screen bg-cover bg-center text-stone-50"
      style={{ backgroundImage: `url(${boutiqueBg})` }}
    >
      <div className="min-h-screen bg-black/55">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center gap-6 px-4 py-8 sm:px-6 md:px-8 lg:flex-row lg:justify-between lg:gap-12 lg:px-10 xl:px-12">
          <section className="w-full max-w-2xl text-center lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d8b15f]">
              THE A & R STORE
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-stone-50 sm:text-5xl lg:text-6xl">
              STYLE THAT DEFINES YOU
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-stone-200 sm:text-base lg:text-lg">
              Discover refined silhouettes, premium textures, and modern essentials
              crafted for wardrobes that speak with quiet confidence.
            </p>
          </section>

          <section className="w-[calc(100%-32px)] max-w-md rounded-2xl border border-[#d8b15f]/35 bg-black/55 p-5 shadow-2xl shadow-black/50 backdrop-blur-md sm:w-full sm:p-7 lg:p-8">
            <div>
              <h2 className="font-serif text-3xl text-stone-50 sm:text-4xl">
                Create Your Account
              </h2>
              <p className="mt-3 text-sm leading-6 text-stone-300">
                Join THE A & R STORE and start your fashion journey.
              </p>
              <div className="mt-5 h-px w-20 bg-[#d8b15f]" />
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <TextInput
                id="fullname"
                label="Full Name"
                name="fullname"
                type="text"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />

              <TextInput
                id="email"
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                autoComplete="email"
                required
              />

              <div>
                <label htmlFor="password" className="text-sm font-medium text-stone-100">
                  Password
                </label>
                <div className="relative mt-2">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className={`${inputClass} mt-0 pr-12`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-stone-300 transition hover:text-[#d8b15f] focus:outline-none focus:ring-2 focus:ring-[#d8b15f]/50"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon hidden={showPassword} />
                  </button>
                </div>
              </div>

              <TextInput
                id="contact"
                label="Contact Number"
                name="contact"
                type="tel"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Enter your contact number"
                autoComplete="tel"
                required
              />

              <label
                htmlFor="isSeller"
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-100 transition hover:border-[#d8b15f]/50"
              >
                <input
                  id="isSeller"
                  name="isSeller"
                  type="checkbox"
                  checked={formData.isSeller}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-white/30 bg-black/40 accent-[#d8b15f] focus:outline-none focus:ring-2 focus:ring-[#d8b15f]/50"
                />

                <span>Role: I am a Seller</span>
               <Link to="/api/auth/google">CONTINUE WITH GOOGLE</Link>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 h-12 w-full rounded-lg border border-[#d8b15f] bg-[#d8b15f] text-sm font-bold tracking-[0.24em] text-black transition hover:-translate-y-0.5 hover:bg-[#f0cf7c] hover:shadow-lg hover:shadow-[#d8b15f]/20 focus:outline-none focus:ring-2 focus:ring-[#d8b15f]/50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:border-stone-500 disabled:bg-stone-600 disabled:text-stone-300 disabled:shadow-none"
              >
                {isSubmitting ? 'REGISTERING...' : 'REGISTER'}
              </button>
            </form>

            {message && (
              <p className="mt-4 text-center text-sm text-[#d8b15f]">{message}</p>
            )}

            <p className="mt-6 text-center text-sm text-stone-300">
              Already have an account?{' '}
              <a
                href="/login"
                className="font-semibold text-[#d8b15f] transition hover:text-[#f0cf7c] focus:outline-none focus:ring-2 focus:ring-[#d8b15f]/50"
              >
                Login
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Register
