import { Smartphone, Monitor, ChevronRight, ChevronLeft, Globe } from "lucide-react";

export default function ActivityTable({ logs, pagination }) {
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    };
  };

  return (
    <div className="bg-white overflow-hidden flex-1 flex flex-col">
      <div className="overflow-x-auto flex-1">
        <table className="table-premium">
          <thead>
            <tr>
              <th className="pl-6">Short Link</th>
              <th>Original URL</th>
              <th>Location</th>
              <th>Device</th>
              <th>Referrer</th>
              <th className="pr-6 text-right">Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-zinc-400">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                      <Globe size={24} className="text-zinc-300" />
                    </div>
                    <p className="text-sm font-semibold text-zinc-500">No activity recorded yet</p>
                    <p className="text-xs text-zinc-400">Click events will appear here in real-time.</p>
                  </div>
                </td>
              </tr>
            ) : logs.map((log, i) => {
              const { date, time } = formatDate(log.timestamp);
              return (
                <tr key={i} className="animate-fadeIn" style={{ animationDelay: `${i * 30}ms` }}>
                  <td className="pl-6 font-semibold text-indigo-600 text-[13px] font-mono-data">
                    {log.shortUrl}
                  </td>
                  <td className="text-zinc-500 text-[13px] truncate max-w-[180px] font-medium" title={log.originalUrl}>
                    {log.originalUrl}
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-zinc-700 text-[13px] font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      {log.location || "Unknown"}
                    </div>
                  </td>
                  <td>
                    <span className="inline-flex items-center gap-1.5 badge badge-neutral">
                      {log.device === "Desktop"
                        ? <Monitor size={11} />
                        : <Smartphone size={11} />
                      }
                      {log.device || "N/A"}
                    </span>
                  </td>
                  <td>
                    <span className="text-zinc-600 text-[13px] font-medium">
                      {log.referrer || "Direct"}
                    </span>
                  </td>
                  <td className="pr-6 text-right">
                    <div className="text-zinc-800 text-[13px] font-semibold font-mono-data">{date}</div>
                    <div className="text-[11px] text-zinc-400 font-mono-data">{time}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="px-6 py-4 flex justify-between items-center bg-white border-t border-zinc-100">
        <p className="text-[13px] text-zinc-500 font-medium">
          Showing {logs.length} of {pagination?.totalEvents ?? 0} events
        </p>
        <div className="flex items-center gap-1.5">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-all duration-200 border border-zinc-100 hover:border-zinc-200">
            <ChevronLeft size={15} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold text-[13px] shadow-sm shadow-indigo-200">
            {pagination?.currentPage ?? 1}
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-all duration-200 border border-zinc-100 hover:border-zinc-200">
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}