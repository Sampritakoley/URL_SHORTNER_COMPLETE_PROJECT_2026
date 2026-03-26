import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ActivityChart({ logs }) {
    // Process logs to get click counts per date
    const chartData = logs.reduce((acc, log) => {
        const date = new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const existing = acc.find(item => item.name === date);
        if (existing) {
            existing.clicks += 1;
        } else {
            acc.push({ name: date, clicks: 1 });
        }
        return acc;
    }, []).reverse(); // Reverse to show chronological order

    return (
        <div className="bg-white rounded-xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100">
            <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-4">
                Activity Distribution
            </h3>
            <div className="h-[160px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" hide />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Area type="monotone" dataKey="clicks" stroke="#4F46E5" fill="url(#colorClicks)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}