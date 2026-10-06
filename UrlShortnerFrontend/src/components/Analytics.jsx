import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import {
  CalendarDays, Filter, Download,
  TrendingUp, TrendingDown,
  MousePointer2, Link as LinkIcon, PieChart, Target,
  ChevronRight, Monitor, Smartphone, Tablet, BarChart2, Activity
} from "lucide-react"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line
} from "recharts"
import { downloadCSV } from "../utils/export"

const sparklineData = [
  { value: 10 }, { value: 15 }, { value: 8 }, { value: 20 },
  { value: 18 }, { value: 25 }, { value: 22 }
];

/* ── Skeleton card ─────────────────────────────────────────── */
function SkeletonStatCard() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-zinc-100">
      <div className="flex items-start justify-between mb-4">
        <div className="skeleton w-10 h-10 rounded-xl" />
        <div className="skeleton w-16 h-5 rounded-full" />
      </div>
      <div className="skeleton h-3 w-24 mb-2 rounded" />
      <div className="skeleton h-7 w-20 rounded" />
    </div>
  );
}

/* ── Custom tooltip ────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-zinc-100 rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="font-semibold text-zinc-500 text-[11px] uppercase tracking-wider mb-1">{label}</p>
      <p className="text-indigo-600 font-bold text-lg">{payload[0]?.value?.toLocaleString()} <span className="text-zinc-400 text-xs font-medium">clicks</span></p>
    </div>
  );
};

export default function Analytics() {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [summary, setSummary] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [referrers, setReferrers] = useState([])
  const [clickData, setClickData] = useState([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/api/analytics/global",
          { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
        )
        const data = await response.json()
        setSummary(data.summary)
        setRecentActivity(data.recentActivity)
        setReferrers(data.topReferrers)
        setClickData(data.trends.clicksOverTime)
      } catch (error) {
        console.error("Analytics API Error:", error)
      } finally {
        setLoadingData(false)
      }
    }
    fetchAnalytics()
  }, [])

  const statCards = summary ? [
    { title: "Total Clicks",  value: summary.totalClicks,           change: "+ 0%", trend: "up",   icon: MousePointer2, gradient: "from-blue-500 to-cyan-500"    },
    { title: "Active Links",  value: summary.activeLinks,           change: "+ 0%", trend: "up",   icon: LinkIcon,      gradient: "from-indigo-500 to-purple-500"  },
    { title: "Avg. CTR",      value: summary.avgCtr + "%",         change: "0%",   trend: "down", icon: PieChart,      gradient: "from-purple-500 to-pink-500"  },
    { title: "Conversion",    value: summary.conversion + "%",     change: "+ 0%", trend: "up",   icon: Target,        gradient: "from-emerald-500 to-teal-500" },
  ] : []

  const getDeviceIcon = (device) => {
    if (!device) return Monitor;
    const d = device.toLowerCase();
    if (d.includes('mobile')) return Smartphone;
    if (d.includes('tablet')) return Tablet;
    return Monitor;
  };

  const hasData = summary?.activeLinks > 0 || summary?.totalClicks > 0;

  return (
    <div className="flex min-h-screen font-sans overflow-hidden" style={{ background: 'var(--color-bg)' }}>

      <Sidebar collapsed={collapsed} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">

        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-7">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeInUp">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Analytics Overview</h1>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100">
                  <Activity size={11} className="text-indigo-500" />
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Real-time</span>
                </div>
              </div>
              <p className="text-zinc-500 text-sm mt-0.5">Track your links performance across all platforms.</p>
            </div>
            <div className="flex items-center gap-2.5">
              <button className="btn btn-secondary text-zinc-600 text-sm px-4 py-2.5">
                <CalendarDays size={15} className="text-zinc-400" />
                Last 30 Days
              </button>
              <button className="btn btn-secondary text-zinc-600 text-sm px-4 py-2.5">
                <Filter size={15} className="text-zinc-400" />
                Filter
              </button>
              <button 
                onClick={() => downloadCSV(recentActivity, 'analytics.csv')}
                className="btn btn-primary text-sm px-4 py-2.5"
              >
                <Download size={15} />
                Export
              </button>
            </div>
          </div>

          {/* STAT CARDS */}
          {(!loadingData && !hasData) ? null : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
              {loadingData
                ? [1, 2, 3, 4].map(i => <SkeletonStatCard key={i} />)
                : statCards.map((card, i) => {
                  return (
                    <div key={i} className="card card-hover animate-fadeInUp p-6 group">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg shadow-indigo-100/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                          <card.icon size={17} className="text-white" />
                        </div>
                        <div className={`badge ${card.trend === 'up' ? 'badge-success' : 'badge-danger'}`}>
                          {card.trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                          {card.change}
                        </div>
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-zinc-500 mb-1">{card.title}</p>
                        <div className="flex items-end justify-between">
                          <h3 className="text-2xl font-bold text-zinc-900 tracking-tight animate-countUp">{card.value}</h3>
                          <div className="w-16 h-8 opacity-60 group-hover:opacity-100 transition-opacity">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={sparklineData}>
                                <Line
                                  type="monotone" dataKey="value"
                                  stroke={card.trend === 'up' ? '#10b981' : '#f43f5e'}
                                  strokeWidth={2} dot={false}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {(!loadingData && !hasData) ? (
            <div className="card p-12 flex flex-col items-center justify-center text-center mt-8 animate-fadeIn">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-5 border border-indigo-100">
                <BarChart2 size={32} className="text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 mb-2">No Analytics Available</h2>
              <p className="text-zinc-500 max-w-sm mb-6 text-sm">Once you create your first short link and share it, beautiful charts and metrics will appear right here.</p>
            </div>
          ) : (
            <>
              {/* CHART */}
              <div className="card animate-fadeInUp p-7" style={{ animationDelay: '0.15s' }}>
                <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Click Activity Trends</h3>
                <p className="text-sm text-zinc-500 mt-0.5">Visualize engagement over the past few weeks.</p>
              </div>
              <div className="flex items-center bg-zinc-50 p-1 rounded-xl border border-zinc-100">
                <button className="px-4 py-1.5 text-sm font-semibold text-zinc-900 bg-white rounded-lg shadow-sm border border-zinc-200/50">
                  Clicks
                </button>
                <button className="px-4 py-1.5 text-sm font-semibold text-zinc-500 hover:text-zinc-700 transition-colors">
                  Impressions
                </button>
              </div>
            </div>

            {loadingData ? (
              <div className="h-[350px] flex items-center justify-center">
                <div className="skeleton w-full h-full rounded-xl" />
              </div>
            ) : clickData.length === 0 ? (
              <div className="h-[350px] flex flex-col items-center justify-center gap-3 text-zinc-400">
                <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                  <BarChart2 size={28} className="text-zinc-300" />
                </div>
                <p className="font-semibold text-zinc-500">No click data available yet</p>
                <p className="text-sm text-zinc-400">Data will appear here once your links receive clicks.</p>
              </div>
            ) : (
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={clickData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorClicksGlobal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#4F46E5" stopOpacity={0.12} />
                        <stop offset="50%" stopColor="#6366F1" stopOpacity={0.06} />
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F4F5" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="clicks" stroke="#4F46E5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorClicksGlobal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* BOTTOM GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">

            {/* RECENT ACTIVITY TABLE */}
            <div className="lg:col-span-2 card animate-fadeInUp overflow-hidden" style={{ animationDelay: '0.2s' }}>
              <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
                <h3 className="font-bold text-zinc-900 tracking-tight">Recent Click Activity</h3>
                <button 
                  onClick={() => navigate('/fullLog')}
                  className="text-indigo-600 text-[13px] font-semibold hover:underline decoration-indigo-300 underline-offset-2 flex items-center gap-1 group"
                >
                  View Full Log <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
              {loadingData ? (
                <div className="p-6 space-y-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="skeleton h-10 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table-premium">
                    <thead>
                      <tr>
                        <th className="pl-6">Short Link</th>
                        <th>Location</th>
                        <th>Device</th>
                        <th>Time</th>
                        <th className="pr-6 text-right">Browser</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.map((item, i) => {
                        const DevIcon = getDeviceIcon(item.device);
                        return (
                          <tr key={i} className="animate-fadeIn" style={{ animationDelay: `${i * 40}ms` }}>
                            <td className="pl-6 font-semibold text-indigo-600 font-mono-data">{item.shortUrl}</td>
                            <td>
                              <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                <span className="text-zinc-600 text-[13px]">{item.location || "Unknown"}</span>
                              </div>
                            </td>
                            <td>
                              <span className="inline-flex items-center gap-1.5 badge badge-neutral">
                                <DevIcon size={11} />
                                {item.device || "Unknown"}
                              </span>
                            </td>
                            <td className="text-zinc-500 font-mono-data text-[13px]">{new Date(item.time).toLocaleString()}</td>
                            <td className="pr-6 text-right">
                              <span className="badge badge-info">{item.browser || "Unknown"}</span>
                            </td>
                          </tr>
                        );
                      })}
                      {recentActivity.length === 0 && (
                        <tr>
                          <td colSpan="5" className="py-14 text-center">
                            <div className="flex flex-col items-center gap-2 text-zinc-400">
                              <Activity size={28} className="text-zinc-200" />
                              <p className="text-sm font-medium text-zinc-500">No recent activity yet.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* TOP REFERRERS */}
            <div className="card animate-fadeInUp p-6" style={{ animationDelay: '0.25s' }}>
              <h3 className="font-bold text-zinc-900 mb-5 tracking-tight">Top Referrers</h3>
              {loadingData ? (
                <div className="space-y-4">
                  {[1,2,3,4].map(i => <div key={i} className="skeleton h-10 rounded-xl" />)}
                </div>
              ) : referrers?.length > 0 ? (
                <div className="space-y-4">
                  {referrers.map((ref, i) => (
                    <div key={i} className="group">
                      <div className="flex justify-between text-[13px] font-medium text-zinc-700 mb-1.5">
                        <span className="group-hover:text-zinc-900 transition-colors">{ref.source || ref.name || `Source ${i+1}`}</span>
                        <span className="font-bold text-zinc-900 font-mono-data">{ref.percentage ?? ref.clicks}%</span>
                      </div>
                      <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${ref.percentage ?? Math.min(ref.clicks, 100)}%`,
                            background: `linear-gradient(90deg, hsl(${i * 50 + 240}, 70%, 60%), hsl(${i * 50 + 260}, 70%, 65%))`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-zinc-400 gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                    <PieChart size={22} className="text-zinc-300" />
                  </div>
                  <p className="text-sm font-medium text-zinc-500">No referrer data yet</p>
                </div>
              )}
            </div>

          </div>
          </>
          )}
        </div>
      </div>
    </div>
  )
}