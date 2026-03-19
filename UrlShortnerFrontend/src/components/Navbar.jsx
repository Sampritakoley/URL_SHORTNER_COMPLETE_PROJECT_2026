import { Search, Bell, Menu, Link as LinkIcon } from "lucide-react"

export default function Navbar({ collapsed, setCollapsed }) {
  return (
    <div className="flex items-center justify-between bg-white border-b border-gray-100 flex-shrink-0 px-8 py-4 sticky top-0 z-30 min-h-[72px] w-full">

      {/* LEFT: Menu & Logo & Search */}
      <div className="flex items-center gap-4 lg:gap-8">
        
        {/* COLLAPSE MENU BUTTON */}
        <button onClick={() => setCollapsed(!collapsed)} className="text-gray-400 hover:text-gray-600 outline-none p-1 shrink-0">
          <Menu size={22} />
        </button>
        
        {/* LOGO IN NAVBAR */}
        <div className="flex items-center gap-2 text-blue-600 shrink-0">
          <LinkIcon size={24} className="-rotate-45" />
          <h1 className="text-2xl font-bold tracking-tight">LinkSnap</h1>
        </div>

        {/* SEARCH */}
        <div className="hidden sm:flex items-center bg-[#f8fafc] border border-gray-200 px-3 py-2 rounded-lg w-64 md:w-80 lg:w-96 transition-colors focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
          <Search size={18} className="text-gray-400" />
          <input
            placeholder="Search links..."
            className="bg-transparent outline-none px-3 text-sm flex-1 text-gray-700 ml-2"
          />
        </div>

      </div>

      {/* RIGHT: User & Notifications */}
      <div className="flex items-center gap-6">
        <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm overflow-hidden">
             <img src="https://ui-avatars.com/api/?name=Alex&background=2563eb&color=fff" alt="User" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  )
}