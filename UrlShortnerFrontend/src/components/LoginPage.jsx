import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useStoreContext } from "../contextApi/ContextApi"
import { Link as LinkIcon, Eye, EyeOff, AlertCircle, Zap, BarChart2, ShieldCheck } from "lucide-react"
import toast from "react-hot-toast"

export default function LoginPage() {
  const navigate = useNavigate()
  const { setToken } = useStoreContext()
  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      setError(errorParam)
      toast.error(errorParam)
    }
  }, [searchParams])

  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080"
    window.location.href = `${backendUrl}/oauth2/authorization/google`
  }


  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/public/login`,
        { username, password }
      )
      localStorage.setItem("token", response.data.token)
      setToken(response.data.token)
      toast.success("Successfully logged in!")
      navigate("/dashboard")
    } catch (err) {
      setError("Invalid credentials. Please check your username and password.")
      toast.error("Invalid credentials.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#F8FAFC' }}>

      {/* ── LEFT: FORM PANEL ─────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div
          className="w-full max-w-[420px] animate-fadeInUp"
          style={{ animationDuration: '0.5s' }}
        >

          {/* LOGO */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center shadow-md">
              <LinkIcon size={18} className="-rotate-45 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight gradient-text">LinkSnap</span>
          </div>

          {/* HEADING */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
            <p className="text-slate-500 text-sm">Sign in to your account to continue</p>
          </div>

          {/* SOCIAL BUTTONS */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2.5 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>


          {/* DIVIDER */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-4">

            {/* USERNAME */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Username
              </label>
              <input
                type="text"
                placeholder="your_username"
                className="input-base"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  className="text-xs text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input-base pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* REMEMBER ME */}
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
                Keep me signed in for 30 days
              </span>
            </label>

            {/* ERROR */}
            {error && (
              <div className="flex items-center gap-2.5 p-3 bg-red-50 border border-red-100 rounded-xl animate-alert">
                <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-2.5 text-sm rounded-xl font-semibold disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              style={{ marginTop: '0.5rem' }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : "Sign in to LinkSnap"}
            </button>

          </form>

          {/* FOOTER */}
          <p className="text-center text-sm text-slate-500 mt-6">
            New to LinkSnap?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-indigo-600 font-semibold cursor-pointer hover:text-indigo-700 hover:underline transition-colors"
            >
              Create a free account
            </span>
          </p>

          <div className="flex items-center justify-center gap-1.5 mt-4">
            <ShieldCheck size={13} className="text-slate-400" />
            <p className="text-center text-xs text-slate-400">
              Secure, encrypted authentication
            </p>
          </div>

        </div>
      </div>

      {/* ── RIGHT: BRAND PANEL ───────────────────────────── */}
      <div className="hidden lg:flex flex-1 gradient-mesh items-center justify-center p-12 relative overflow-hidden">

        {/* Floating orbs */}
        <div className="absolute top-16 right-16 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-16 left-8 w-48 h-48 bg-purple-600/15 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl" />

        <div className="relative max-w-sm animate-fadeInUp" style={{ animationDelay: '0.15s' }}>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/20 text-indigo-300 text-xs font-semibold mb-4">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
              Trusted by 12,000+ teams
            </div>
            <h2 className="text-3xl font-bold text-white leading-tight mb-3">
              Manage your links like a pro
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Real-time analytics, branded domains, and lightning-fast redirects — all in one place.
            </p>
          </div>

          {/* FEATURE CARDS */}
          <div className="space-y-3 stagger-children">
            {[
              { icon: Zap,        color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'Lightning Fast',      desc: 'Global CDN – redirects in &lt;10ms' },
              { icon: BarChart2,  color: 'text-blue-400',   bg: 'bg-blue-400/10',   label: 'Deep Analytics',      desc: 'Clicks, locations, devices & more' },
              { icon: ShieldCheck,color: 'text-emerald-400',bg: 'bg-emerald-400/10',label: 'Enterprise Security',  desc: 'Malware protection built-in' },
            ].map(({ icon: Icon, color, bg, label, desc }) => (
              <div
                key={label}
                className="animate-fadeInUp flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-200"
              >
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon size={18} className={color} />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{label}</p>
                  <p className="text-slate-400 text-xs" dangerouslySetInnerHTML={{ __html: desc }} />
                </div>
              </div>
            ))}
          </div>

          {/* TESTIMONIAL */}
          <div className="mt-8 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              "LinkSnap transformed how we manage our marketing campaigns. The analytics are simply amazing."
            </p>
            <p className="text-slate-500 text-xs mt-3 font-medium">Marcus Chen · Growth Marketer</p>
          </div>

        </div>
      </div>

    </div>
  )
}