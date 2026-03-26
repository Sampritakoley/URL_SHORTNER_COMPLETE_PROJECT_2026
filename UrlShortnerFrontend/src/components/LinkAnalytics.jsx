import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import {
    Download, Share2, QrCode, Pencil, Copy, CalendarDays, MousePointer2, Link as LinkIcon, Users, ArrowUpRight,
    Smartphone, Monitor, Tablet, Twitter, Linkedin, Globe, Activity, TrendingUp
} from "lucide-react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Helper to map device strings to Lucide icons
const getDeviceIcon = (device) => {
    if (!device) return Monitor;
    const d = device.toLowerCase();
    if (d.includes("mobile")) return Smartphone;
    if (d.includes("tablet")) return Tablet;
    return Monitor;
};

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
export default function LinkAnalytics() {
    const { linkId } = useParams();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/analytics/link/${linkId}`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem("token")
                    }
                });
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

    if (loading) return <div className="flex h-screen items-center justify-center">Loading Analytics...</div>;
    if (!data) return <div className="flex h-screen items-center justify-center">No data found.</div>;

    const { summary, linkDetails, latestEvents, topMetrics, trends, utmBreakdown } = data;

    return (
        <div className="flex bg-[#FAFAFB] min-h-screen font-sans text-gray-900 overflow-hidden">
            <Sidebar collapsed={collapsed} />

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
                <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />

                <div className="p-8 max-w-[1400px] mx-auto w-full">

                    {/* BREADCRUMBS & TOP HEADER */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2 font-medium">
                                <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/dashboard")}>Dashboard</span>
                                <span>/</span>
                                <span className="text-gray-900 font-semibold">{linkDetails.shortUrl}</span>
                            </div>
                            <h1 className="text-3xl font-bold text-blue-600 tracking-tight flex items-center gap-2">
                                {linkDetails.shortUrl}
                                <button className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 p-1 rounded-md"><Copy size={16} /></button>
                            </h1>
                            <a href={linkDetails.originalUrl} target="_blank" rel="noreferrer" className="text-gray-500 text-[13px] mt-1 hover:underline flex items-center gap-1 font-medium">
                                {linkDetails.originalUrl} <ArrowUpRight size={14} className="text-gray-400" />
                            </a>
                        </div>

                        <div className="flex gap-2">
                            <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-2 shadow-sm hover:bg-gray-50 transition-colors">
                                <Share2 size={16} className="text-gray-500" /> Share
                            </button>
                            <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-2 shadow-sm hover:bg-gray-50 transition-colors">
                                <QrCode size={16} className="text-gray-500" /> QR Code
                            </button>
                            <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-2 shadow-sm hover:bg-gray-50 transition-colors">
                                <Pencil size={16} className="text-gray-500" /> Edit
                            </button>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-[13px] font-semibold shadow-sm transition-colors ring-4 ring-blue-600/10">
                                Duplicate
                            </button>
                        </div>
                    </div>

                    {/* FILTERS BAR */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <div className="flex items-center gap-3">
                            <button className="bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2">
                                <CalendarDays size={16} className="text-gray-400" />
                                All Time
                            </button>
                        </div>
                        <button className="text-blue-600 text-[13px] font-bold flex items-center gap-1.5 hover:underline">
                            <Download size={16} /> Export Report
                        </button>
                    </div>

                    {/* TOP METRICS */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><MousePointer2 size={16} /></div>
                                <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">Total Clicks</p>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">{summary.totalClicks.toLocaleString()}</h3>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><LinkIcon size={16} /></div>
                                <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">Click Through</p>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">{summary.clickThrough}</h3>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Users size={16} /></div>
                                <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">Unique Visitors</p>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">{summary.uniqueVisitors.toLocaleString()}</h3>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Activity size={16} /></div>
                                <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">Bounce Rate</p>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">{summary.bounceRate}%</h3>
                        </div>
                    </div>

                    {/* MAIN CHART */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-8 mb-8 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-6">Clicks Over Time</h3>
                        <div className="w-full h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trends.clicksOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorMainClicks" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="clicks" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorMainClicks)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* TWO COLUMN GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                        <div className="lg:col-span-8 flex flex-col gap-8">
                            {/* EVENTS TABLE */}
                            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                                    <h3 className="font-bold text-gray-900">Latest Link Events</h3>
                                    <p className="text-gray-400 text-xs font-medium">Real-time activity.</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-[#F8FAFC]">
                                            <tr>
                                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Time</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Location</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Device</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Referrer</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">OS</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {latestEvents.map((e, idx) => {
                                                const Icon = getDeviceIcon(e.device);
                                                return (
                                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 text-[13px] text-gray-500 font-medium">
                                                            {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </td>
                                                        <td className="px-6 py-4 text-[13px] text-gray-700 font-medium">
                                                            {e.location || "Unknown"}
                                                        </td>
                                                        <td className="px-6 py-4 text-[13px] text-gray-600 font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <Icon size={14} className="text-gray-400" /> {e.device || "Unknown"}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-[13px] text-gray-600 font-medium">{e.referrer || "Direct"}</td>
                                                        <td className="px-6 py-4 text-[13px] text-gray-600 font-medium">{e.os || "Unknown"}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* UTM PARAMETERS */}
                            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                                <div className="p-6 border-b border-gray-50">
                                    <h3 className="font-bold text-gray-900">UTM Parameters Breakdown</h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    {utmBreakdown.length > 0 ? utmBreakdown.map((utm, i) => (
                                        <div key={i} className="flex items-center justify-between border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                                            <div className="flex gap-4 items-center">
                                                <div className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">{utm.param}</div>
                                                <span className="text-sm font-semibold text-gray-800">{utm.value}</span>
                                            </div>
                                            <div className="text-sm font-bold text-gray-900 border border-gray-200 bg-white px-3 py-1 rounded-lg tabular-nums">
                                                {utm.clicks.toLocaleString()} clicks
                                            </div>
                                        </div>
                                    )) : <p className="text-gray-400 text-sm">No UTM data available for this link.</p>}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="lg:col-span-4 flex flex-col gap-8">
                            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><Globe size={18} className="text-blue-500" /> Top Countries</h3>
                                <div className="space-y-5">
                                    {topMetrics.countries.map((c, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-center text-sm font-medium text-gray-700 mb-2">
                                                <span>{c.name}</span>
                                                <span className="text-gray-900 font-bold">{c.percentage}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${c.percentage}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><Monitor size={18} className="text-blue-500" /> Top Devices</h3>
                                <div className="flex justify-center items-center py-4 bg-[#FAFAFB] border border-gray-100 rounded-xl">
                                    <div className="h-[140px] w-full flex-1">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={topMetrics.devices}
                                                    innerRadius={40}
                                                    outerRadius={60}
                                                    paddingAngle={5}
                                                    dataKey="percentage"
                                                    stroke="none"
                                                >
                                                    {topMetrics.devices.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-3 justify-center">
                                        {topMetrics.devices.map((d, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                                <span className="text-[13px] font-semibold text-gray-700">{d.name}</span>
                                                <span className="text-[13px] font-bold text-gray-900">{d.percentage}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex sm:flex-row flex-col items-center justify-between text-[11px] font-medium text-gray-400 pb-8 px-2 border-t border-gray-200 mt-8 pt-8">
                        <p>© 2026 URL Insights Dashboard. All systems operational.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}