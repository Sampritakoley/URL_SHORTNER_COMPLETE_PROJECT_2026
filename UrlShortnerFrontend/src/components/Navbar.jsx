import { Search, Bell, Menu, Link as LinkIcon, ChevronDown, Command } from "lucide-react"
import { useStoreContext } from "../contextApi/ContextApi"

export default function Navbar({ collapsed, setCollapsed }) {
  const { user } = useStoreContext()
  const userName = user?.name || user?.username || "User"
  const userPicture = user?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&bold=true&size=64`

  return (
    <div className="flex items-center justify-between flex-shrink-0 px-6 py-0 sticky top-0 z-30 min-h-[64px] w-full animate-fadeInDown"
      style={{
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid rgba(228,228,231,0.6)',
      }}
    >

      {/* LEFT: Menu & Logo & Search */}
      <div className="flex items-center gap-4 lg:gap-6">

        {/* COLLAPSE MENU BUTTON */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-zinc-400 hover:text-indigo-600 p-2 rounded-xl hover:bg-zinc-100/80 transition-all duration-300 shrink-0 outline-none group"
          aria-label="Toggle sidebar"
        >
          <Menu size={19} className="transition-transform duration-300 group-hover:scale-110" />
        </button>

        {/* LOGO IN NAVBAR */}
        <div className="flex items-center gap-2 shrink-0 group cursor-pointer">
          <div className="w-8 h-8 gradient-brand rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
            <LinkIcon size={15} className="-rotate-45 text-white" />
          </div>
          <span className="text-[1.05rem] font-bold tracking-tight gradient-text hidden sm:block">
            LinkSnap
          </span>
        </div>

      </div>

      {/* RIGHT: Notifications & User */}
      <div className="flex items-center gap-2">

        {/* BELL */}
        <button className="relative text-zinc-400 hover:text-indigo-600 p-2.5 rounded-xl hover:bg-zinc-100/80 transition-all duration-300 outline-none group">
          <Bell size={17} className="group-hover:rotate-12 transition-transform duration-300" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 left-0 top-0"></span>
          </span>
        </button>

        {/* DIVIDER */}
        <div className="w-px h-6 bg-zinc-200/80 mx-1 hidden md:block" />

        {/* USER */}
        <button className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-zinc-100/80 transition-all duration-300 outline-none group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden flex-shrink-0 ring-2 ring-transparent group-hover:ring-indigo-100 transition-all duration-300 shadow-sm">
            <img
              src={userPicture}
              alt={userName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-[13px] font-semibold text-zinc-700 leading-tight">{userName}</span>
            <span className="text-[11px] text-zinc-400 leading-tight">{user?.authProvider === 'GOOGLE' ? 'Google Account' : 'Standard User'}</span>
          </div>
          <ChevronDown size={14} className="text-zinc-400 group-hover:text-indigo-500 transition-all duration-300 group-hover:translate-y-0.5 hidden md:block" />
        </button>

      </div>
    </div>
  )
}