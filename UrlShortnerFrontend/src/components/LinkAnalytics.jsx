import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import {
  Download, Share2, QrCode, Pencil, Copy, CalendarDays,
  MousePointer2, Link as LinkIcon, Users, ArrowUpRight,
  Smartphone, Monitor, Tablet, Globe, Activity, ChevronRight,
  CheckCircle2, X
} from "lucide-react";
import {
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { QRCodeSVG } from "qrcode.react";
import { downloadCSV } from "../utils/export";

const getDeviceIcon = (device) => {
  if (!device) return Monitor;
  const d = device.toLowerCase();
  if (d.includes("mobile")) return Smartphone;
  if (d.includes("tablet")) return Tablet;
  return Monitor;
};

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

/* ── Skeleton ──────────────────────────────────────────────── */
function SkeletonMetricCard() {
  return (
    <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="skeleton w-9 h-9 rounded-xl" />
        <div className="skeleton h-3 w-24 rounded" />
      </div>
      <div className="skeleton h-8 w-20 rounded" />
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-zinc-100 rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="font-semibold text-zinc-500 text-[11px] uppercase tracking-wider mb-1">{label}</p>
      <p className="text-indigo-600 font-bold text-lg">{payload[0]?.value?.toLocaleString()} <span className="text-zinc-400 text-xs font-medium">clicks</span></p>
    </div>
  );
};

export default function LinkAnalytics() {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [qrModal, setQrModal] = useState(false);

  const backendDomain = (import.meta.env.VITE_BACKEND_URL || "").replace(/^https?:\/\//, "");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/analytics/link/${linkId}`,
          { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token") } }
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [linkId]);

  const handleCopy = () => {
    if (data?.linkDetails?.shortUrl) {
      navigator.clipboard.writeText(
        `${import.meta.env.VITE_BACKEND_URL}/${data.linkDetails.shortUrl}`
      ).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen font-sans overflow-hidden" style={{ background: 'var(--color-bg)' }}>
        <Sidebar collapsed={collapsed} />
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
          <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
          <div className="p-8 max-w-[1400px] mx-auto w-full">
            <div className="card p-6 mb-7">
              <div className="skeleton h-4 w-40 rounded mb-4" />
              <div className="skeleton h-8 w-48 rounded mb-2" />
              <div className="skeleton h-3 w-80 rounded" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
              {[1,2,3,4].map(i => <SkeletonMetricCard key={i} />)}
            </div>
            <div className="card p-7 mb-7">
              <div className="skeleton h-[280px] rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen font-sans overflow-hidden" style={{ background: 'var(--color-bg)' }}>
        <Sidebar collapsed={collapsed} />
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
          <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Activity size={28} className="text-zinc-300" />
              </div>
              <p className="text-zinc-700 font-semibold mb-1">No data found</p>
              <p className="text-zinc-400 text-sm">Analytics data for this link isn't available yet.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { summary, linkDetails, latestEvents, topMetrics, trends, utmBreakdown } = data;

  const metricCards = [
    { label: "Total Clicks",     value: summary.totalClicks.toLocaleString(),    icon: MousePointer2, gradient: "from-blue-500 to-cyan-500" },
    { label: "Click Through",    value: summary.clickThrough,                     icon: LinkIcon,      gradient: "from-indigo-500 to-purple-500" },
    { label: "Unique Visitors",  value: summary.uniqueVisitors.toLocaleString(),  icon: Users,         gradient: "from-orange-400 to-amber-500" },
    { label: "Bounce Rate",      value: `${summary.bounceRate}%`,                 icon: Activity,      gradient: "from-rose-400 to-red-500" },
  ];

  return (
    <div className="flex min-h-screen font-sans overflow-hidden" style={{ background: 'var(--color-bg)' }}>
      <Sidebar collapsed={collapsed} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="p-6 lg:p-8 max-w-[1400px] mx-auto w-full">

          {/* HEADER CARD */}
          <div
            className="card p-6 mb-7 animate-fadeInUp relative overflow-hidden"
            style={{ borderLeft: '4px solid #4F46E5' }}
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-50/50 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
              <div>
                {/* BREADCRUMB */}
                <div className="flex items-center gap-2 text-[13px] text-zinc-500 mb-3 font-medium">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Dashboard
                  </button>
                  <ChevronRight size={14} className="text-zinc-400" />
                  <span className="text-zinc-900 font-semibold">{backendDomain}/{linkDetails.shortUrl}</span>
                </div>

                <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2.5 mb-2 tracking-tight font-mono-data">
                  {backendDomain}/{linkDetails.shortUrl}
                  <button
                    onClick={handleCopy}
                    className="text-zinc-400 hover:text-indigo-600 transition-all duration-200 bg-zinc-50 hover:bg-indigo-50 p-1.5 rounded-lg hover:scale-110"
                    title="Copy short URL"
                  >
                    {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  </button>
                </h1>

                <a
                  href={linkDetails.originalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-zinc-500 text-sm hover:text-indigo-600 hover:underline transition-colors font-medium max-w-xl truncate group"
                >
                  <span className="truncate">{linkDetails.originalUrl}</span>
                  <ArrowUpRight size={14} className="text-zinc-400 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button className="btn btn-secondary text-[13px] px-3 py-2">
                  <Share2 size={14} className="text-zinc-500" /> Share
                </button>
                <button 
                  onClick={() => setQrModal(true)}
                  className="btn btn-secondary text-[13px] px-3 py-2"
                >
                  <QrCode size={14} className="text-zinc-500" /> QR Code
                </button>
                <button className="btn btn-secondary text-[13px] px-3 py-2">
                  <Pencil size={14} className="text-zinc-500" /> Edit
                </button>
                <button className="btn btn-primary text-[13px] px-4 py-2">
                  Duplicate
                </button>
              </div>
            </div>
          </div>

          {/* FILTERS BAR */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 animate-fadeInUp" style={{ animationDelay: '0.05s' }}>
            <button className="btn btn-secondary text-[13px] px-4 py-2.5 bg-white shadow-sm border-zinc-200 hover:border-zinc-300">
              <CalendarDays size={14} className="text-zinc-400" />
              All Time
            </button>
            <button 
              onClick={() => downloadCSV(latestEvents, 'link_events.csv')}
              className="text-indigo-600 text-[13px] font-bold flex items-center gap-1.5 hover:underline decoration-indigo-300 underline-offset-2"
            >
              <Download size={14} /> Export Report
            </button>
          </div>

          {/* METRIC CARDS */}
          {summary.totalClicks === 0 ? (
            <div className="card p-12 flex flex-col items-center justify-center text-center mt-4 animate-fadeIn">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-5 border border-indigo-100">
                <MousePointer2 size={32} className="text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 mb-2">No Clicks Yet</h2>
              <p className="text-zinc-500 max-w-sm text-sm">Share your short link to start gathering analytics. Clicks, locations, and referrers will appear here instantly.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-7 stagger-children">
            {metricCards.map((m, i) => (
              <div key={i} className="card card-hover animate-fadeInUp p-6 group">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${m.gradient} shadow-md shadow-indigo-100 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <m.icon size={15} className="text-white" />
                  </div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{m.label}</p>
                </div>
                <h3 className="text-3xl font-bold text-zinc-900 tracking-tight animate-countUp">{m.value}</h3>
              </div>
            ))}
          </div>

          {/* MAIN CHART */}
          <div className="card p-7 mb-7 animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
            <h3 className="font-bold text-zinc-900 tracking-tight mb-6">Clicks Over Time</h3>
            <div className="w-full h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends.clicksOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMainClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#4F46E5" stopOpacity={0.15} />
                      <stop offset="50%" stopColor="#6366F1" stopOpacity={0.05} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 12 }} dy={10} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="clicks" stroke="#4F46E5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMainClicks)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TWO COLUMN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">

            {/* LEFT */}
            <div className="lg:col-span-8 flex flex-col gap-6">

              {/* EVENTS TABLE */}
              <div className="card animate-fadeInUp overflow-hidden" style={{ animationDelay: '0.2s' }}>
                <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
                  <h3 className="font-bold text-zinc-900 tracking-tight">Latest Link Events</h3>
                  <span className="badge badge-success text-[10px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="table-premium">
                    <thead>
                      <tr>
                        <th className="pl-6">Time</th>
                        <th>Location</th>
                        <th>Device</th>
                        <th>Referrer</th>
                        <th className="pr-6 text-right">OS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {latestEvents.map((e, idx) => {
                        const Icon = getDeviceIcon(e.device);
                        return (
                          <tr key={idx} className="animate-fadeIn" style={{ animationDelay: `${idx * 40}ms` }}>
                            <td className="pl-6 text-zinc-500 font-medium text-[13px] font-mono-data">
                              {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="text-zinc-700 font-medium text-[13px]">
                               <div className="flex items-center gap-1.5">
                                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                 {e.location || "Unknown"}
                               </div>
                            </td>
                            <td>
                              <div className="flex items-center gap-1.5 text-zinc-600 text-[13px] font-medium">
                                <Icon size={13} className="text-zinc-400" /> {e.device || "Unknown"}
                              </div>
                            </td>
                            <td className="text-zinc-600 text-[13px] font-medium">{e.referrer || "Direct"}</td>
                            <td className="pr-6 text-right">
                               <span className="badge badge-neutral text-[11px]">{e.os || "Unknown"}</span>
                            </td>
                          </tr>
                        );
                      })}
                      {latestEvents.length === 0 && (
                        <tr>
                          <td colSpan="5" className="py-14 text-center">
                            <div className="flex flex-col items-center gap-2 text-zinc-400">
                               <Activity size={24} className="text-zinc-200" />
                               <p className="text-sm font-medium">No events recorded yet.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* UTM PARAMETERS */}
              <div className="card animate-fadeInUp overflow-hidden" style={{ animationDelay: '0.25s' }}>
                <div className="px-6 py-4 border-b border-zinc-100">
                  <h3 className="font-bold text-zinc-900 tracking-tight">UTM Parameters Breakdown</h3>
                </div>
                <div className="p-6 space-y-3">
                  {utmBreakdown.length > 0 ? utmBreakdown.map((utm, i) => (
                    <div key={i} className="flex items-center justify-between border border-zinc-100 rounded-xl p-4 bg-zinc-50/50 hover:bg-zinc-50 hover:border-zinc-200 hover:shadow-sm transition-all duration-300">
                      <div className="flex gap-3 items-center">
                        <div className="font-mono-data text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 uppercase tracking-wider">
                          {utm.param}
                        </div>
                        <span className="text-[13px] font-semibold text-zinc-800">{utm.value}</span>
                      </div>
                      <span className="badge badge-neutral text-[11px] font-mono-data">
                        {utm.clicks.toLocaleString()} clicks
                      </span>
                    </div>
                  )) : (
                    <p className="text-zinc-400 text-[13px] font-medium text-center py-4">No UTM data available for this link.</p>
                  )}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-4 flex flex-col gap-6">

              {/* TOP COUNTRIES */}
              <div className="card animate-fadeInUp p-6" style={{ animationDelay: '0.2s' }}>
                <h3 className="font-bold text-zinc-900 mb-5 flex items-center gap-2 tracking-tight">
                  <Globe size={16} className="text-blue-500" /> Top Countries
                </h3>
                <div className="space-y-4">
                  {topMetrics.countries.map((c, i) => (
                    <div key={i} className="group">
                      <div className="flex justify-between items-center text-[13px] font-medium text-zinc-700 mb-1.5">
                        <span className="group-hover:text-zinc-900 transition-colors">{c.name}</span>
                        <span className="font-bold text-zinc-900 font-mono-data">{c.percentage}%</span>
                      </div>
                      <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-1.5 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${c.percentage}%`, background: COLORS[i % COLORS.length] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TOP DEVICES */}
              <div className="card animate-fadeInUp p-6" style={{ animationDelay: '0.25s' }}>
                <h3 className="font-bold text-zinc-900 mb-5 flex items-center gap-2 tracking-tight">
                  <Monitor size={16} className="text-blue-500" /> Top Devices
                </h3>
                <div className="flex justify-center items-center py-2 gap-4">
                  <div className="h-[130px] flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={topMetrics.devices}
                          innerRadius={38} outerRadius={58}
                          paddingAngle={4}
                          dataKey="percentage"
                          stroke="none"
                        >
                          {topMetrics.devices.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ borderRadius: '12px', border: '1px solid #E4E4E7', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col gap-3">
                    {topMetrics.devices.map((d, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-[12px] font-semibold text-zinc-700">{d.name}</span>
                        <span className="text-[12px] font-bold text-zinc-900 font-mono-data">{d.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          </>
          )}

          {/* FOOTER */}
          <div className="flex sm:flex-row flex-col items-center justify-between text-[11px] font-medium text-zinc-400 pb-8 px-2 border-t border-zinc-100 pt-6">
            <p>© 2026 LinkSnap. All systems operational.</p>
          </div>

        </div>
      </div>
      
      {/* QR CODE MODAL */}
      {qrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-scaleIn relative border border-zinc-100">
            <button 
              onClick={() => setQrModal(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-all"
            >
              <X size={18} />
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <QrCode size={24} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 tracking-tight">QR Code Generated</h3>
              <p className="text-zinc-500 text-sm mt-1 truncate px-2" title={`${import.meta.env.VITE_BACKEND_URL}/${linkDetails.shortUrl}`}>
                {import.meta.env.VITE_BACKEND_URL}/{linkDetails.shortUrl}
              </p>
            </div>
            
            <div className="flex justify-center p-4 bg-zinc-50 rounded-2xl border border-zinc-100 mb-6">
              <QRCodeSVG 
                id="qr-code-svg-analytics"
                value={`${import.meta.env.VITE_BACKEND_URL}/${linkDetails.shortUrl}`}
                size={180} 
                level="Q" 
                includeMargin={false}
                fgColor="#09090B"
              />
            </div>
            
            <button 
              onClick={() => {
                const svg = document.getElementById("qr-code-svg-analytics");
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
                  downloadLink.download = `QR_${linkDetails.shortUrl}.png`;
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
  );
}