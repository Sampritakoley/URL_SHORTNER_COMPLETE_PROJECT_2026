import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import StatsCard from "./StatsCard";
import ActivityTable from "./ActivityTable";
import ActivityChart from "./ActivityChart";
import TopFilters from "./TopFilters";
import { Download, Loader2, FileText, Zap, Activity } from "lucide-react";
import { downloadCSV } from "../utils/export";

export default function FullLog() {
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + '/api/analytics/logs',
          { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token") } }
        );
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
      <div
        className="h-screen w-full flex items-center justify-center"
        style={{ background: 'var(--color-bg)' }}
      >
        <div className="flex flex-col items-center gap-4 animate-fadeInUp">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Loader2 className="animate-spin text-white" size={26} />
          </div>
          <div className="text-center">
            <p className="text-zinc-700 font-semibold text-sm">Loading activity log</p>
            <p className="text-zinc-400 text-xs mt-0.5">Fetching your latest data…</p>
          </div>
        </div>
      </div>
    );
  }

  const hasData = data?.logs?.length > 0;

  return (
    <div className="flex min-h-screen font-sans overflow-hidden" style={{ background: 'var(--color-bg)' }}>
      <Sidebar collapsed={collapsed} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="p-6 lg:p-8 max-w-[1400px] mx-auto w-full">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-7 animate-fadeInUp">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md shadow-indigo-100">
                  <FileText size={17} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Full Activity Log</h1>
                </div>
              </div>
              <p className="text-zinc-500 text-sm mt-1.5 ml-[46px]">
                Real-time breakdown of every click across all your links.
              </p>
            </div>
            <button 
              onClick={() => downloadCSV(data?.logs, 'full_activity_log.csv')}
              className="btn btn-primary text-sm px-4 py-2.5"
            >
              <Download size={15} /> Export
            </button>
          </div>

          {/* MAIN GRID */}
          {!hasData ? (
            <div className="card p-12 flex flex-col items-center justify-center text-center mt-8 animate-fadeIn">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-5 border border-indigo-100">
                <FileText size={32} className="text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 mb-2">No Activity Found</h2>
              <p className="text-zinc-500 max-w-sm mb-6 text-sm">You haven't received any clicks yet. When users click your shortened links, the raw activity logs will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">

              {/* LEFT: TABLE */}
            <div className="md:col-span-8">
              <div className="card overflow-hidden flex flex-col h-full animate-fadeInUp" style={{ animationDelay: '0.05s' }}>
                <TopFilters />
                <ActivityTable logs={data?.logs || []} pagination={data?.pagination} />
              </div>
            </div>

            {/* RIGHT: INSIGHTS */}
            <div className="md:col-span-4">
              <div
                className="rounded-2xl p-6 h-full border border-zinc-100 animate-fadeInUp bg-gradient-to-b from-white to-zinc-50/50"
                style={{ animationDelay: '0.1s' }}
              >
                {/* HEADER */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] font-bold text-zinc-400 tracking-[0.08em] uppercase">
                    Quick Insights
                  </h3>
                  <span className="badge badge-success text-[10px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </span>
                </div>

                {/* STATS */}
                <div className="space-y-3 stagger-children">
                  <StatsCard
                    title="Total Clicks"
                    value={data?.quickInsights?.totalEvents?.toLocaleString()}
                    change="+--"
                  />
                  <StatsCard
                    title="Unique Visitors"
                    value={data?.quickInsights?.uniqueVisitors?.toLocaleString()}
                    change="+--"
                  />
                </div>

                {/* CHART */}
                <div className="mt-6">
                  <ActivityChart logs={data?.logs || []} />
                </div>

                {/* TOP SOURCE */}
                <div
                  className="mt-5 rounded-xl p-5 relative overflow-hidden border border-indigo-100"
                  style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)' }}
                >
                  {/* Decorative */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-200/20 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <Zap size={12} className="text-indigo-600" />
                      </div>
                      <h4 className="text-[10px] font-bold text-indigo-600 tracking-[0.08em] uppercase">
                        Top Source
                      </h4>
                    </div>
                    <p className="text-[13px] text-zinc-700 font-medium leading-snug">
                      <span className="font-bold text-zinc-900">{data?.quickInsights?.topSource || "N/A"}</span>
                      {" "}is your primary traffic driver this period.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}