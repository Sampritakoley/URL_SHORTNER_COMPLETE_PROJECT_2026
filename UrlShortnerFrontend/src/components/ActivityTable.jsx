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
                <table className="w-full text-sm">
                    <thead className="text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-white">
                        <tr>
                            <th className="p-4 pl-6 text-left border-b border-gray-100">Short Link</th>
                            <th className="p-4 text-left border-b border-gray-100">Original URL</th>
                            <th className="p-4 text-left border-b border-gray-100">Location</th>
                            <th className="p-4 text-left border-b border-gray-100">Device</th>
                            <th className="p-4 text-left border-b border-gray-100">Referrer</th>
                            <th className="p-4 pr-6 text-right border-b border-gray-100">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, i) => {
                            const { date, time } = formatDate(log.timestamp);
                            return (
                                <tr key={i} className="border-b border-gray-50 hover:bg-[#F8FAFC] transition-colors">
                                    <td className="p-4 pl-6 align-top font-semibold text-blue-600 text-[13px]">
                                        {log.shortUrl}
                                    </td>
                                    <td className="p-4 align-top text-gray-500 text-[13px] truncate max-w-[200px]" title={log.originalUrl}>
                                        {log.originalUrl}
                                    </td>
                                    <td className="p-4 align-top text-gray-700 text-[13px] font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <Globe size={12} className="text-gray-400" />
                                            {log.location || "Unknown"}
                                        </div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="flex items-center gap-1.5 text-gray-600 text-[12px] font-semibold uppercase">
                                            {log.device === "Desktop" ? <Monitor size={14} /> : <Smartphone size={14} />}
                                            {log.device || "N/A"}
                                        </div>
                                    </td>
                                    <td className="p-4 align-top text-gray-600 text-[13px]">
                                        {log.referrer || "Direct"}
                                    </td>
                                    <td className="p-4 pr-6 align-top text-right">
                                        <div className="text-gray-800 text-[13px] font-semibold">{date}</div>
                                        <div className="text-[11px] text-gray-400 font-mono">{time}</div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="p-5 flex justify-between items-center bg-white border-t border-gray-100">
                <p className="text-[13px] text-gray-500 font-medium">
                    Showing {logs.length} of {pagination?.totalEvents} events
                </p>
                <div className="flex items-center gap-1">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50">
                        <ChevronLeft size={16} />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white font-semibold text-[13px]">
                        {pagination?.currentPage}
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}