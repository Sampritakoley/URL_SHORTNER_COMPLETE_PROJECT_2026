import { useState, useEffect } from "react"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import {
  CalendarDays,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  MousePointer2,
  Link as LinkIcon,
  PieChart,
  Target,
  Twitter,
  Linkedin,
  Globe,
  Mail,
  ChevronRight,
  Monitor,
  Smartphone,
  Tablet
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts"

const sparklineData = [
  { value: 10 }, { value: 15 }, { value: 8 }, { value: 20 }, { value: 18 }, { value: 25 }, { value: 22 }
];

export default function Analytics() {

  const [collapsed, setCollapsed] = useState(false)

  const [summary, setSummary] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [referrers, setReferrers] = useState([])
  const [clickData, setClickData] = useState([])

  useEffect(() => {

    const fetchAnalytics = async () => {

      try {

        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/analytics/global", {
          headers: {
            Authorization:
              "Bearer " + localStorage.getItem("token")
          }
        })

        const data = await response.json()

        setSummary(data.summary)
        setRecentActivity(data.recentActivity)
        setReferrers(data.topReferrers)
        setClickData(data.trends.clicksOverTime)

      } catch (error) {
        console.error("Analytics API Error:", error)
      }

    }

    fetchAnalytics()

  }, [])

  const statCards = summary ? [
    {
      title: "Total Clicks",
      value: summary.totalClicks,
      change: "+ 0%",
      trend: "up",
      icon: MousePointer2,
      color: "blue"
    },
    {
      title: "Active Links",
      value: summary.activeLinks,
      change: "+ 0%",
      trend: "up",
      icon: LinkIcon,
      color: "indigo"
    },
    {
      title: "Avg. CTR",
      value: summary.avgCtr + "%",
      change: "0%",
      trend: "down",
      icon: PieChart,
      color: "purple"
    },
    {
      title: "Conversion",
      value: summary.conversion + "%",
      change: "+ 0%",
      trend: "up",
      icon: Target,
      color: "emerald"
    }
  ] : []

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans text-slate-900 overflow-hidden">

      <Sidebar collapsed={collapsed} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">

        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="p-8 max-w-7xl w-full mx-auto space-y-8">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Analytics Overview</h1>
              <p className="text-slate-500 mt-1">Track your links performance across all platforms.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                <CalendarDays size={18} className="text-slate-400" />
                Last 30 Days
              </button>
              <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                <Filter size={18} className="text-slate-400" />
                Filter
              </button>
              <button className="flex items-center gap-2 bg-blue-600 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
                <Download size={18} />
                Export
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${card.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                    card.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                      card.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                        'bg-emerald-50 text-emerald-600'
                    }`}>
                    <card.icon size={20} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${card.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                    {card.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {card.change}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500">{card.title}</p>

                  <div className="flex items-end justify-between mt-1">
                    <h3 className="text-2xl font-bold text-slate-900">{card.value}</h3>

                    <div className="w-16 h-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sparklineData}>
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={card.trend === 'up' ? '#10b981' : '#f43f5e'}
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">

            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Click Activity Trends</h3>
                <p className="text-sm text-slate-500 mt-1">Visualize engagement over the past few weeks.</p>
              </div>

              <div className="flex items-center bg-slate-50 p-1 rounded-lg border border-slate-100">
                <button className="px-4 py-1.5 text-sm font-semibold text-slate-900 bg-white rounded-md shadow-sm border border-slate-200/50">Clicks</button>
                <button className="px-4 py-1.5 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">Impressions</button>
              </div>

            </div>

            <div className="h-[350px] w-full">

              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={clickData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>

                  <defs>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    dy={10}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />

                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />

                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorClicks)"
                  />

                </AreaChart>
              </ResponsiveContainer>

            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">

            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">

              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Recent Click Activity</h3>
                <button className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1">
                  View Full Log <ChevronRight size={14} />
                </button>
              </div>

              <div className="overflow-x-auto flex-1">

                <table className="w-full text-left">

                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Short Link</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Device</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Browser</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-50">

                    {recentActivity.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">

                        <td className="px-6 py-4 font-semibold text-blue-600 text-sm">{item.shortUrl}</td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            {item.location || "Unknown"}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">

                            {item.device === 'Mobile' ? <Smartphone size={14} /> :
                              item.device === 'Desktop' ? <Monitor size={14} /> :
                                <Tablet size={14} />}

                            {item.device || "Unknown"}

                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {new Date(item.time).toLocaleString()}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                            {item.browser || "Unknown"}
                          </span>
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}