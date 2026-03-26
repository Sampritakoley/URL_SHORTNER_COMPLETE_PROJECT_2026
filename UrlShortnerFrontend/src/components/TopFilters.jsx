import { Search } from "lucide-react";

export default function TopFilters() {
    return (
        <div className="flex items-center gap-4 p-4 border-b border-gray-100 bg-white">
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-1.5 w-64 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 focus-within:bg-white transition-all">
                <Search size={16} className="text-gray-400" />
                <input
                    placeholder="Search referrers..."
                    className="ml-2 bg-transparent outline-none text-[13px] w-full text-gray-700"
                />
            </div>
            
            <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-[13px] text-gray-700 bg-white font-medium outline-none">
                <option>All Links</option>
            </select>
            
            <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-[13px] text-gray-700 bg-white font-medium outline-none">
                <option>Any Device</option>
            </select>
            
            <button className="ml-auto text-blue-600 text-[13px] font-semibold hover:underline">
                Clear All
            </button>
        </div>
    );
}