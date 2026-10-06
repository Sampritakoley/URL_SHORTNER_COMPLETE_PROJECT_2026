import heroImg from "../assets/hero.png"
import LightImg from "../assets/LightningFastRedirection.png"
import { useNavigate } from "react-router-dom";
import { Link as LinkIcon, Zap, ShieldCheck, BarChart2, ArrowRight } from "lucide-react";

export const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#0F172A] text-white min-h-screen font-sans overflow-x-hidden">

      {/* ── NAVBAR ────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/5 px-6 lg:px-20 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <LinkIcon size={18} className="-rotate-45 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">LinkSnap</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button className="hover:text-white transition-colors">Features</button>
            <button className="hover:text-white transition-colors">Analytics</button>
            <button className="hover:text-white transition-colors">Pricing</button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="text-slate-300 hover:text-white font-medium text-sm transition-colors"
            >
              Log in
            </button>
            <button
              onClick={() => navigate("/register")}
              className="gradient-brand text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>


      {/* ── HERO SECTION ──────────────────────────────────────── */}
      <section className="relative pt-40 pb-20 px-6 lg:px-20 overflow-hidden min-h-[90vh] flex items-center">
        
        {/* Animated Gradient Mesh Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px] mix-blend-screen animate-float" style={{ animationDuration: '6s' }} />
          <div className="absolute top-40 right-20 w-80 h-80 bg-purple-600/30 rounded-full blur-[100px] mix-blend-screen animate-float" style={{ animationDuration: '8s', animationDelay: '1s' }} />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-float" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center relative z-10">

          {/* LEFT: Text & Input */}
          <div className="animate-fadeInUp" style={{ animationDuration: '0.8s' }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold mb-6 shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              LinkSnap v2.0 is live
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
              Shorten, Manage <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x" style={{ backgroundSize: '200% auto' }}>
                Track Everything
              </span><br />
              Effortlessly.
            </h1>

            <p className="text-slate-400 text-lg lg:text-xl mb-10 max-w-lg leading-relaxed">
              Take control of your online presence. Create branded short links,
              track real-time analytics, and optimize marketing campaigns in milliseconds.
            </p>

            {/* URL BOX */}
            <div className="flex bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-2 shadow-2xl transition-all duration-300 focus-within:border-indigo-500/50 focus-within:bg-white/10 max-w-xl">
              <input
                type="text"
                placeholder="Paste your long URL here..."
                className="flex-1 bg-transparent px-4 py-3 outline-none text-white placeholder-slate-400 text-sm md:text-base min-w-0"
              />
              <button
                onClick={() => navigate("/register")}
                className="gradient-brand text-white font-semibold px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all duration-300 flex-shrink-0 flex items-center gap-2"
              >
                Shorten <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* RIGHT: Image/Illustration */}
          <div className="relative animate-fadeInUp flex justify-center lg:justify-end" style={{ animationDuration: '0.8s', animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-3xl transform rotate-3 scale-105 blur-lg"></div>
            <img
              src={heroImg}
              alt="Dashboard Preview"
              className="relative w-full max-w-[500px] rounded-2xl shadow-2xl border border-white/10 transform transition-transform duration-700 hover:scale-[1.02] hover:-rotate-1"
            />
          </div>

        </div>
      </section>


      {/* ── TRUSTED COMPANIES ─────────────────────────────────── */}
      <section className="border-y border-white/5 bg-white/[0.02] py-10 overflow-hidden relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-semibold tracking-widest text-slate-500 uppercase mb-8">
            Trusted by innovative teams worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-12 lg:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['Google', 'Slack', 'Stripe', 'Notion', 'Meta'].map((brand) => (
              <span key={brand} className="text-xl font-bold text-white hover:text-indigo-400 transition-colors cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>


      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section className="py-32 px-6 lg:px-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Everything you need to <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">grow your brand</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              LinkSnap provides a complete suite of tools to shorten, customize, and analyze every link you share.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
            
            {/* Card 1 */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(79,70,229,0.15)] group animate-fadeInUp">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-indigo-500/20">
                <Zap size={24} className="text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Lightning Fast</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Our global edge network ensures links redirect instantly, reducing bounce rates and improving conversion.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(79,70,229,0.15)] group animate-fadeInUp">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-emerald-500/20">
                <ShieldCheck size={24} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Enterprise Security</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Advanced security, HTTPS enforcement, and real-time malware protection built into every link.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(79,70,229,0.15)] group animate-fadeInUp">
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-purple-500/20">
                <BarChart2 size={24} className="text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Deep Analytics</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Track clicks, location data, devices, and referral insights in real time with our powerful dashboard.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ── WORKFLOW ──────────────────────────────────────────── */}
      <section className="py-32 px-6 lg:px-20 bg-slate-900/50 border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Optimized for <br/>every workflow
            </h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              From social media managers to enterprise developers, LinkSnap integrates seamlessly into your daily routine.
            </p>

            <div className="space-y-6">
              {[
                { step: '01', text: 'Copy & paste your long URL' },
                { step: '02', text: 'Customize your alias and domain' },
                { step: '03', text: 'Share and track real-time analytics' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center font-bold shadow-lg">
                    {item.step}
                  </div>
                  <span className="font-medium text-slate-200">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:gap-6">
             {[
               'Social Ready', 'Global Edge', 'One-Click Copy', 'Smart Insights'
             ].map((label, i) => (
               <div key={i} className="bg-white/5 border border-white/10 backdrop-blur-sm p-8 rounded-3xl text-center hover:bg-white/10 transition-all duration-300 hover:scale-105 flex items-center justify-center aspect-square">
                 <span className="font-semibold text-slate-200">{label}</span>
               </div>
             ))}
          </div>

        </div>
      </section>


      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-32 px-6 lg:px-20 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="gradient-brand rounded-[2.5rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-[0_20px_60px_rgba(79,70,229,0.4)]">
            
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Ready to own your links?
              </h2>
              <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
                Join thousands of marketers and creators using LinkSnap
                to manage and analyze their links effortlessly.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => navigate("/register")}
                  className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  Start For Free
                </button>
                <button className="bg-indigo-700/50 text-white border border-indigo-400/30 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                  Talk to Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 bg-[#0B1120] pt-20 pb-10 px-6 lg:px-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
            
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
                  <LinkIcon size={16} className="-rotate-45 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">LinkSnap</span>
              </div>
              <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                Powerful link management for modern teams. Shorten, track, and optimize your online presence.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><button className="hover:text-indigo-400 transition-colors">Features</button></li>
                <li><button className="hover:text-indigo-400 transition-colors">Analytics</button></li>
                <li><button className="hover:text-indigo-400 transition-colors">Pricing</button></li>
                <li><button className="hover:text-indigo-400 transition-colors">Integrations</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><button className="hover:text-indigo-400 transition-colors">About</button></li>
                <li><button className="hover:text-indigo-400 transition-colors">Blog</button></li>
                <li><button className="hover:text-indigo-400 transition-colors">Careers</button></li>
                <li><button className="hover:text-indigo-400 transition-colors">Contact</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><button className="hover:text-indigo-400 transition-colors">Privacy Policy</button></li>
                <li><button className="hover:text-indigo-400 transition-colors">Terms of Service</button></li>
                <li><button className="hover:text-indigo-400 transition-colors">Security</button></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>© 2026 LinkSnap. All rights reserved.</p>
            <div className="flex gap-6">
              <button className="hover:text-white transition-colors">Twitter</button>
              <button className="hover:text-white transition-colors">GitHub</button>
              <button className="hover:text-white transition-colors">LinkedIn</button>
            </div>
          </div>

        </div>
      </footer>

    </div>
  )
}