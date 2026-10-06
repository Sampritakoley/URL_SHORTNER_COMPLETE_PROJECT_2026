import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../Api/Api"
import Navbar from "./Navbar"
import {
  Link as LinkIcon,
  ExternalLink,
  Copy,
  BarChart2,
  QrCode,
  CalendarDays,
  Filter,
  Download,
  Pencil,
  Trash2,
  Zap,
  TrendingUp,
  MousePointer2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  X,
} from "lucide-react"
import Sidebar from "./Sidebar"
import { QRCodeSVG } from "qrcode.react"
import { downloadCSV } from "../utils/export"

/* ── Skeleton card ─────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-zinc-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="skeleton h-3 w-24 mb-3 rounded" />
          <div className="skeleton h-8 w-16 rounded" />
        </div>
        <div className="skeleton w-12 h-12 rounded-2xl" />
      </div>
      <div className="skeleton h-2 w-32 rounded mt-2" />
    </div>
  );
}

/* ── Skeleton row ──────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <tr>
      {[240, 180, 60, 80, 80].map((w, i) => (
        <td key={i} className="p-4">
          <div className="skeleton h-3 rounded" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const backendDomain = (import.meta.env.VITE_BACKEND_URL || "").replace(/^https?:\/\//, "");

  const [url, setUrl] = useState("")
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState(null)
  const [shortening, setShortening] = useState(false)
  const [qrModal, setQrModal] = useState({ open: false, url: "", id: null })

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/api/url/dashboard")
      setDashboard(res.data)
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  useEffect(() => { fetchDashboard() }, [])

  const handleShorten = async () => {
    if (!url) return
    setShortening(true)
    try {
      await API.post("/api/url/shorten", { originalUrl: url })
      setUrl("")
      fetchDashboard()
    } catch (err) {
      console.log(err)
    }
    setShortening(false)
  }

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopyFeedback(id)
    setTimeout(() => setCopyFeedback(null), 1500)
  }

  const statCards = [
    {
      label: "Total Active Links",
      value: dashboard?.totalLinks ?? "—",
      badge: "+12%",
      icon: LinkIcon,
      iconClass: "-rotate-45",
      gradient: "from-indigo-500 to-indigo-600",
      lightBg: "bg-indigo-50",
      lightText: "text-indigo-600",
    },
    {
      label: "Total Clicks",
      value: dashboard?.totalClicks?.toLocaleString() ?? "—",
      badge: "+18%",
      icon: MousePointer2,
      iconClass: "",
      gradient: "from-blue-500 to-cyan-500",
      lightBg: "bg-blue-50",
      lightText: "text-blue-600",
    },
    {
      label: "Most Popular Link",
      value: dashboard?.mostPopularLink ?? "—",
      badge: null,
      icon: TrendingUp,
      iconClass: "",
      gradient: "from-emerald-500 to-teal-500",
      lightBg: "bg-emerald-50",
      lightText: "text-emerald-600",
      isClickable: !!dashboard?.mostPopularLink,
    },
  ];
  
  const hasData = dashboard?.totalLinks > 0;

  return (
    <div className="flex min-h-screen font-sans overflow-hidden" style={{ background: 'var(--color-bg)' }}>

      {/* SIDEBAR */}
      <Sidebar collapsed={collapsed} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">

        {/* NAVBAR */}
        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="p-6 lg:p-8 max-w-6xl w-full mx-auto">

          {/* PAGE HEADER */}
          <div className="flex sm:flex-row flex-col sm:items-end justify-between mb-8 gap-4 animate-fadeInUp">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Dashboard</h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-zinc-500 text-sm">Welcome back, Alex. Here's an overview of your links.</p>
            </div>
          </div>

          {/* STATS GRID */}
          {(!loading && !hasData) ? null : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 stagger-children">
              {loading
                ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
                : statCards.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={i}
                      onClick={() => card.isClickable ? navigate(`/analytics/${card.value}`) : null}
                      className={`card animate-fadeInUp p-6 flex items-center justify-between group ${card.isClickable ? 'card-hover cursor-pointer' : ''}`}
                    >
                      <div>
                        <p className="text-zinc-500 text-[13px] font-medium mb-2">{card.label}</p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className={`text-3xl font-bold tracking-tight animate-countUp ${card.isClickable ? 'text-indigo-600 group-hover:underline' : 'text-zinc-900'}`}>{card.value}</h3>
                          {card.badge && (
                            <span className="badge badge-success text-[11px]">
                              <TrendingUp size={10} />
                              {card.badge}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-100 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                        <Icon size={20} className={`text-white ${card.iconClass}`} />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* SHORTENER SECTION – Command Palette Style */}
          <div
            className="animate-fadeInUp rounded-2xl p-7 mb-8 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 50%, #EEF2FF 100%)',
              border: '1px solid rgba(199,210,254,0.8)',
              animationDelay: '0.15s'
            }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-200/30 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-200/20 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="text-center mb-5">
                <div className="inline-flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-200">
                    <Zap size={16} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Create a Short URL</h3>
                </div>
                <p className="text-sm text-zinc-500">Paste your long link below to create a trackable short URL in seconds.</p>
              </div>

              <div className="max-w-3xl mx-auto flex items-center bg-white border border-zinc-200/80 rounded-2xl p-2 pl-5 shadow-md shadow-indigo-50 transition-all duration-400 focus-within:border-indigo-300 focus-within:shadow-[0_0_30px_-8px_rgba(79,70,229,0.2)]"
                style={{ animation: 'borderGlow 4s ease-in-out infinite' }}
              >
                <LinkIcon className="text-zinc-400 mr-3 -rotate-45 flex-shrink-0" size={18} />
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://very-long-original-destination.com/query?params=true"
                  className="flex-1 outline-none text-sm bg-transparent text-zinc-800 placeholder-zinc-400 min-w-0 font-medium"
                  onKeyDown={(e) => e.key === 'Enter' && handleShorten()}
                />
                <button
                  onClick={handleShorten}
                  disabled={shortening}
                  className="btn btn-primary px-6 py-2.5 rounded-xl text-sm ml-2 flex-shrink-0 disabled:opacity-70 disabled:cursor-not-allowed min-w-[130px] group"
                >
                  {shortening ? (
                    <span className="flex items-center gap-2 justify-center">
                      <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Shorten Now
                      <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                    </span>
                  )}
                </button>
              </div>

            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="card animate-fadeInUp overflow-hidden mb-8" style={{ animationDelay: '0.2s' }}>

            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-zinc-900 tracking-tight">Your Shortened Links</h3>
                <span className="badge badge-neutral text-[10px]">{dashboard?.totalLinks ?? 0} total</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn btn-ghost text-[13px] px-3 py-1.5 text-zinc-500">
                  <Filter size={13} /> Filter
                </button>
                <button 
                  onClick={() => downloadCSV(dashboard?.recentLinks, 'links.csv')}
                  className="btn btn-ghost text-[13px] px-3 py-1.5 text-zinc-500"
                >
                  <Download size={13} /> Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="table-premium">
                <thead>
                  <tr>
                    <th className="pl-6">Original URL</th>
                    <th>Short URL</th>
                    <th>Clicks</th>
                    <th>Created</th>
                    <th className="pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? [1, 2, 3].map(i => <SkeletonRow key={i} />)
                    : dashboard?.recentLinks?.map((link, rowIdx) => (
                      <tr key={link.id} className="animate-fadeIn" style={{ animationDelay: `${rowIdx * 50}ms` }}>
                        <td className="pl-6">
                          <div className="flex items-center gap-2 text-zinc-500 max-w-[200px] sm:max-w-xs xl:max-w-sm">
                            <div className="w-6 h-6 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0">
                              <ExternalLink size={11} className="text-zinc-400" />
                            </div>
                            <span className="truncate text-[13px] font-medium" title={link.originalUrl}>{link.originalUrl}</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <a
                              href={`${import.meta.env.VITE_BACKEND_URL}/${link.shortUrl}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-600 hover:text-indigo-700 text-[13px] font-semibold font-mono-data hover:underline decoration-indigo-300 underline-offset-2 transition-colors"
                            >
                              {backendDomain}/{link.shortUrl}
                            </a>
                            <button
                              onClick={() => handleCopy(`${import.meta.env.VITE_BACKEND_URL}/${link.shortUrl}`, link.id)}
                              className="text-zinc-400 hover:text-indigo-600 bg-zinc-50 hover:bg-indigo-50 p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
                              title="Copy link"
                            >
                              {copyFeedback === link.id
                                ? <CheckCircle2 size={12} className="text-emerald-500" />
                                : <Copy size={12} />
                              }
                            </button>
                          </div>
                        </td>
                        <td>
                          <button
                            onClick={() => navigate(`/analytics/${link.shortUrl}`)}
                            className="flex items-center gap-1.5 text-indigo-600 font-bold text-[13px] hover:bg-indigo-50 py-1 px-2.5 rounded-lg transition-all duration-200 font-mono-data group"
                          >
                            {link.clicks?.toLocaleString() ?? 0}
                            <BarChart2 size={12} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                          </button>
                        </td>
                        <td className="text-zinc-500 text-[13px] font-mono-data">
                          {new Date(link.createdAt).toLocaleDateString('en-CA')}
                        </td>
                        <td className="pr-6">
                          <div className="flex items-center gap-1">
                            <button className="hover:text-indigo-600 text-zinc-400 transition-all duration-200 p-2 rounded-lg hover:bg-indigo-50 hover:scale-110" title="Edit">
                              <Pencil size={14} />
                            </button>
                            <button 
                              className="hover:text-red-500 text-zinc-400 transition-all duration-200 p-2 rounded-lg hover:bg-red-50 hover:scale-110" 
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                            <button 
                              onClick={() => setQrModal({ open: true, url: `${import.meta.env.VITE_BACKEND_URL}/${link.shortUrl}`, id: link.id })}
                              className="hover:text-zinc-700 text-zinc-400 transition-all duration-200 p-2 rounded-lg hover:bg-zinc-100 hover:scale-110" 
                              title="QR Code"
                            >
                              <QrCode size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  {/* EMPTY STATE */}
                  {!loading && (!dashboard?.recentLinks || dashboard.recentLinks.length === 0) && (
                    <tr>
                      <td colSpan="5" className="py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl flex items-center justify-center border border-indigo-100">
                            <LinkIcon size={28} className="text-indigo-400 -rotate-45" />
                          </div>
                          <div>
                            <p className="text-zinc-800 font-semibold mb-1">No links yet</p>
                            <p className="text-zinc-400 text-sm max-w-xs mx-auto">Shorten your first URL above and it will appear here with click analytics.</p>
                          </div>
                          <button className="btn btn-primary text-sm mt-1">
                            <Zap size={14} /> Create Your First Link
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* TABLE FOOTER */}
            {(dashboard?.recentLinks && dashboard.recentLinks.length > 0) && (
              <div className="px-6 py-4 flex items-center justify-between text-sm text-zinc-500 border-t border-zinc-100">
                <span className="text-[13px]">Showing 1–{dashboard.recentLinks.length} of {dashboard?.totalLinks ?? 0} links</span>
                <div className="flex gap-1.5">
                  <button className="px-3 py-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-40 transition-all duration-200 text-[13px] font-medium bg-white hover:border-zinc-300">
                    Previous
                  </button>
                  <button className="px-3 py-1.5 rounded-lg text-[13px] font-bold bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-sm shadow-indigo-200">
                    1
                  </button>
                  <button className="px-3 py-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-all duration-200 text-[13px] font-medium bg-white hover:border-zinc-300">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* PAGE FOOTER */}
          <div className="flex sm:flex-row flex-col items-center justify-between text-xs text-zinc-400 pb-8 gap-4 px-2 border-t border-zinc-100 pt-6">
            <p>© 2026 LinkSnap. All rights reserved.</p>
            <div className="flex gap-4 font-medium">
              <button className="hover:text-zinc-600 transition-colors">Privacy</button>
              <button className="hover:text-zinc-600 transition-colors">Terms</button>
            </div>
          </div>

        </div>
      </div>

      {/* QR CODE MODAL */}
      {qrModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-scaleIn relative border border-zinc-100">
            <button 
              onClick={() => setQrModal({ open: false, url: "", id: null })}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-all"
            >
              <X size={18} />
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <QrCode size={24} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 tracking-tight">QR Code Generated</h3>
              <p className="text-zinc-500 text-sm mt-1 truncate px-2" title={qrModal.url}>{qrModal.url}</p>
            </div>
            
            <div className="flex justify-center p-4 bg-zinc-50 rounded-2xl border border-zinc-100 mb-6">
              <QRCodeSVG 
                id="qr-code-svg"
                value={qrModal.url} 
                size={180} 
                level="Q" 
                includeMargin={false}
                fgColor="#09090B"
              />
            </div>
            
            <button 
              onClick={() => {
                const svg = document.getElementById("qr-code-svg");
                const svgData = new XMLSerializer().serializeToString(svg);
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                const img = new Image();
                img.onload = () => {
                  canvas.width = img.width;
                  canvas.height = img.height;
                  ctx.fillStyle = "white";
                  ctx.fillRect(0, 0, canvas.width, canvas.height);
                  ctx.drawImage(img, 0, 0);
                  const pngFile = canvas.toDataURL("image/png");
                  const downloadLink = document.createElement("a");
                  downloadLink.download = `QR_${qrModal.id}.png`;
                  downloadLink.href = pngFile;
                  downloadLink.click();
                };
                img.src = "data:image/svg+xml;base64," + btoa(svgData);
              }}
              className="btn btn-primary w-full py-3 text-sm font-semibold shadow-md shadow-indigo-100"
            >
              <Download size={16} />
              Download PNG
            </button>
          </div>
        </div>
      )}

    </div>
  )
}