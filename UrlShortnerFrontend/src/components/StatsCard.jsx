import { TrendingUp, TrendingDown } from "lucide-react";
import clsx from "clsx";

export default function StatsCard({ title, value, change }) {
    const positive = change.includes("+");

    return (
        <div className="bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100">
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                {title}
            </p>
            <div className="flex items-end justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                    {value}
                </h2>
                <div
                    className={clsx(
                        "flex items-center gap-0.5 text-[12px] font-bold mb-1",
                        positive ? "text-emerald-500" : "text-rose-500"
                    )}
                >
                    {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {change}
                </div>
            </div>
        </div>
    );
}