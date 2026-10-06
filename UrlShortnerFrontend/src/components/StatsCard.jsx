import { TrendingUp, TrendingDown } from "lucide-react";
import clsx from "clsx";

export default function StatsCard({ title, value, change }) {
  const positive = change.includes("+");

  return (
    <div className="bg-white rounded-xl p-4 border border-zinc-100 hover:border-zinc-200 hover:shadow-md transition-all duration-300 group">
      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.08em] mb-2">
        {title}
      </p>
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 animate-countUp">
          {value ?? "—"}
        </h2>
        <div
          className={clsx(
            "flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full border transition-all duration-300 group-hover:scale-105",
            positive
              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
              : "bg-rose-50 text-rose-500 border-rose-200"
          )}
        >
          {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {change}
        </div>
      </div>
    </div>
  );
}