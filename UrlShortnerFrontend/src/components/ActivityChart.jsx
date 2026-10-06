import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-zinc-100 rounded-xl px-3 py-2 shadow-xl text-sm">
      <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-indigo-600 font-bold">{payload[0]?.value} <span className="text-zinc-400 text-[10px] font-medium">clicks</span></p>
    </div>
  );
};

export default function ActivityChart({ logs }) {
  const chartData = logs.reduce((acc, log) => {
    const date = new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const existing = acc.find(item => item.name === date);
    if (existing) {
      existing.clicks += 1;
    } else {
      acc.push({ name: date, clicks: 1 });
    }
    return acc;
  }, []).reverse();

  return (
    <div className="bg-white rounded-xl p-5 border border-zinc-100 hover:border-zinc-200 hover:shadow-md transition-all duration-300">
      <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.08em] mb-4">
        Activity Distribution
      </h3>
      <div className="h-[150px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorClicksActivity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#4F46E5" stopOpacity={0.15} />
                <stop offset="50%" stopColor="#6366F1" stopOpacity={0.06} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" hide />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="clicks"
              stroke="#4F46E5"
              fill="url(#colorClicksActivity)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}