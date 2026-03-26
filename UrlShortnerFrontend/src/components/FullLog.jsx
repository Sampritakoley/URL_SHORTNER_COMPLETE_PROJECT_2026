import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import StatsCard from "./StatsCard";
import ActivityTable from "./ActivityTable";
import ActivityChart from "./ActivityChart";
import TopFilters from "./TopFilters";
import { Download, Loader2 } from "lucide-react";

export default function FullLog() {
    const [collapsed, setCollapsed] = useState(false);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/analytics/logs', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem("token")
                    }
                });
                const json = await response.json();
                setData(json);
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#FAFAFB]">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <div className="flex bg-[#FAFAFB] min-h-screen font-sans text-gray-900 overflow-hidden">
            <Sidebar collapsed={collapsed} />

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
                <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />

                <div className="p-8 max-w-[1400px] mx-auto w-full">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Full Activity Log</h1>
                            <p className="text-gray-500 text-[13px] mt-1 font-medium">
                                Real-time breakdown of every click across all links.
                            </p>
                        </div>
                        <div className="flex gap-3 items-center">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-2 shadow-sm">
                                <Download size={16} /> Export
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
                        <div className="md:col-span-8">
                            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
                                <TopFilters />
                                <ActivityTable logs={data?.logs || []} pagination={data?.pagination} />
                            </div>
                        </div>

                        <div className="md:col-span-4">
                            <div className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-6 h-full shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">Quick Insights</h3>
                                    <span className="bg-blue-50 text-blue-600 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-blue-100 uppercase">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>Live
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <StatsCard title="Total Clicks" value={data?.quickInsights?.totalEvents?.toLocaleString()} change="+--" />
                                    <StatsCard title="Unique Visitors" value={data?.quickInsights?.uniqueVisitors?.toLocaleString()} change="+--" />
                                </div>

                                <div className="mt-8">
                                    <ActivityChart logs={data?.logs || []} />
                                </div>

                                <div className="mt-6 bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 rounded-xl p-5 relative overflow-hidden">
                                    <h4 className="text-[11px] font-bold text-blue-600 tracking-wider uppercase mb-2">Top Source</h4>
                                    <p className="text-[13px] text-gray-800 font-medium mb-3 leading-snug">
                                        <span className="font-bold">{data?.quickInsights?.topSource}</span> is your primary driver this period.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}