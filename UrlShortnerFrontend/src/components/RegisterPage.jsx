import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Link as LinkIcon, Eye, EyeOff, AlertCircle, CheckCircle2, Zap, BarChart2, ShieldCheck, Globe } from "lucide-react"
import toast from "react-hot-toast"

// Minimal password strength checker (visual only – no logic change)
function getStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8)               s++;
  if (/[A-Z]/.test(pw))             s++;
  if (/[0-9]/.test(pw))             s++;
  if (/[^A-Za-z0-9]/.test(pw))     s++;
  return s; // 0–4
}
const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColors = ['', '#EF4444', '#F59E0B', '#3B82F6', '#10B981'];

export default function RegisterPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const strength = getStrength(password);

  const handleRegister = async (e) => {
    e.preventDefault()
    
    if (password.length < 8) {
      return setError("Password must be at least 8 characters long.")
    }
    if (strength < 3) {
      return setError("Please use a stronger password.")
    }

    setLoading(true)
    setError("")
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/public/register`,
        { username, password, email }
      )
      toast.success("Account created successfully!")
      console.log(response.data)
      navigate("/login")
    } catch (err) {
      setError("Registration failed. Please try again.")
      toast.error("Registration failed.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#F8FAFC' }}>

      {/* ── LEFT: FORM ───────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[440px] animate-fadeInUp" style={{ animationDuration: '0.5s' }}>

          {/* LOGO */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center shadow-md">
              <LinkIcon size={18} className="-rotate-45 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight gradient-text">LinkSnap</span>
          </div>

          {/* HEADING */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h1>
            <p className="text-slate-500 text-sm">Join 12,000+ creators managing links with LinkSnap</p>
          </div>

          {/* SOCIAL */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* FORM */}
          <form onSubmit={handleRegister} className="space-y-4">

            {/* USERNAME */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name / Username</label>
              <input
                type="text"
                placeholder="Jane Doe"
                className="input-base"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                className="input-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="input-base pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* PASSWORD STRENGTH BAR */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{ background: level <= strength ? strengthColors[strength] : '#E2E8F0' }}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-medium" style={{ color: strengthColors[strength] }}>
                    {strengthLabels[strength]}
                  </p>
                </div>
              )}
            </div>

            {/* TERMS */}
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 mt-0.5 flex-shrink-0" required />
              <span className="text-sm text-slate-600">
                I agree to the{" "}
                <span className="text-indigo-600 font-semibold hover:underline cursor-pointer">Terms of Service</span>
                {" "}and{" "}
                <span className="text-indigo-600 font-semibold hover:underline cursor-pointer">Privacy Policy</span>
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
              className="btn btn-primary w-full py-2.5 text-sm rounded-xl disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  Create Account
                </span>
              )}
            </button>

          </form>

          {/* LINK TO LOGIN */}
          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-indigo-600 font-semibold cursor-pointer hover:underline"
            >
              Sign in
            </span>
          </p>

          <div className="flex items-center justify-center gap-1.5 mt-3">
            <ShieldCheck size={13} className="text-slate-400" />
            <p className="text-center text-xs text-slate-400">🔒 Secure SSL Encryption</p>
          </div>

        </div>
      </div>

      {/* ── RIGHT: BRAND PANEL ───────────────────────────── */}
      <div className="hidden lg:flex flex-1 gradient-mesh items-center justify-center p-12 relative overflow-hidden">

        <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-56 h-56 bg-purple-600/15 rounded-full blur-2xl" />

        <div className="relative max-w-sm animate-fadeInUp" style={{ animationDelay: '0.15s' }}>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/20 text-indigo-300 text-xs font-semibold mb-4">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Free forever plan available
            </div>
            <h2 className="text-3xl font-bold text-white leading-tight mb-3">
              Everything you need to grow your audience
            </h2>
            <p className="text-slate-400 leading-relaxed">
              From social campaigns to enterprise scale — LinkSnap grows with you.
            </p>
          </div>

          <div className="space-y-3 stagger-children">
            {[
              { icon: Zap,        color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'Lightning Fast',     desc: 'Global CDN – redirects in &lt;10ms' },
              { icon: BarChart2,  color: 'text-blue-400',   bg: 'bg-blue-400/10',   label: 'Advanced Analytics', desc: 'Track clicks, devices, countries' },
              { icon: Globe,      color: 'text-emerald-400',bg: 'bg-emerald-400/10',label: 'Branded Domains',    desc: 'Boost click-through with custom domains' },
              { icon: ShieldCheck,color: 'text-purple-400', bg: 'bg-purple-400/10', label: 'Enterprise Security',desc: 'Malware protection built-in' },
            ].map(({ icon: Icon, color, bg, label, desc }) => (
              <div
                key={label}
                className="animate-fadeInUp flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
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

          <div className="mt-8 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              "LinkSnap has completely changed how we handle our marketing campaigns. The analytics are simply amazing."
            </p>
            <p className="text-slate-500 text-xs mt-3 font-medium">Marcus Chen · Growth Marketer</p>
          </div>

        </div>
      </div>

    </div>
  )
}