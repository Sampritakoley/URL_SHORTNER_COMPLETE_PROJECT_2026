import { Search, SlidersHorizontal, X } from "lucide-react";

export default function TopFilters() {
  return (
    <div className="flex items-center flex-wrap gap-3 p-4 border-b border-zinc-100 bg-white/80 backdrop-blur-sm">

      {/* SEARCH */}
      <div className="flex items-center border border-zinc-200 rounded-xl px-3.5 py-2 w-56 bg-zinc-50/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 focus-within:shadow-[0_0_15px_-5px_rgba(79,70,229,0.15)] transition-all duration-300 group">
        <Search size={14} className="text-zinc-400 flex-shrink-0 group-focus-within:text-indigo-500 transition-colors" />
        <input
          placeholder="Search referrers..."
          className="ml-2 bg-transparent outline-none text-[13px] w-full text-zinc-700 placeholder-zinc-400"
        />
      </div>

      {/* LINK FILTER */}
      <div className="relative">
        <select className="border border-zinc-200 rounded-xl px-3.5 py-2 text-[13px] text-zinc-700 bg-white font-medium outline-none appearance-none cursor-pointer hover:border-zinc-300 transition-all duration-200 pr-9 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300">
          <option>All Links</option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>

      {/* DEVICE FILTER */}
      <div className="relative">
        <select className="border border-zinc-200 rounded-xl px-3.5 py-2 text-[13px] text-zinc-700 bg-white font-medium outline-none appearance-none cursor-pointer hover:border-zinc-300 transition-all duration-200 pr-9 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300">
          <option>Any Device</option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>

      {/* FILTER ICON */}
      <button className="flex items-center gap-1.5 text-[13px] font-semibold text-zinc-600 hover:text-zinc-900 px-3.5 py-2 rounded-xl hover:bg-zinc-100 transition-all duration-200 border border-zinc-200 hover:border-zinc-300">
        <SlidersHorizontal size={13} />
        Filters
      </button>

      {/* CLEAR ALL */}
      <button className="ml-auto flex items-center gap-1 text-[13px] font-semibold text-zinc-400 hover:text-red-500 transition-all duration-200 group">
        <X size={13} className="group-hover:rotate-90 transition-transform duration-300" />
        Clear All
      </button>
    </div>
  );
}