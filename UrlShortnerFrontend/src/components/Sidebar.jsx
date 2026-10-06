import { LayoutDashboard, BarChart3, LogOut, FileText, Link as LinkIcon, Sparkles } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useStoreContext } from "../contextApi/ContextApi"

export default function Sidebar({ collapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logoutUser } = useStoreContext();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };


  const menuItems = [
    { id: "dashboard",  label: "Dashboard",         icon: LayoutDashboard, path: "/dashboard" },
    { id: "analytics",  label: "Analytics",          icon: BarChart3,       path: "/analytics"  },
    { id: "fullLog",    label: "Full Activity Log",  icon: FileText,        path: "/fullLog"    },
  ];

  return (
    <div
      className={`bg-white/80 backdrop-blur-xl border-r border-zinc-100 flex flex-col transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] flex-shrink-0 z-20 ${
        collapsed ? "w-[72px]" : "w-[240px]"
      }`}
      style={{ boxShadow: '1px 0 0 rgba(0,0,0,0.02)' }}
    >
      {/* LOGO – top of sidebar */}
      <div className={`flex items-center gap-2.5 px-4 py-5 border-b border-zinc-100/80 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm shadow-indigo-200">
          <LinkIcon size={15} className="-rotate-45 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-bold text-[1rem] tracking-tight gradient-text leading-tight">
              LinkSnap
            </span>
            <span className="text-[10px] text-zinc-400 font-medium">Smart Links</span>
          </div>
        )}
      </div>

      {/* NAV ITEMS */}
      <div className="flex flex-col justify-between flex-1 py-4 px-3">
        <div>
          {!collapsed && (
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.1em] px-3 mb-3">
              Navigation
            </p>
          )}
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`sidebar-item relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer font-medium transition-all duration-300 group ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-50 to-purple-50/50 text-indigo-700"
                      : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full shadow-sm shadow-indigo-200" />
                  )}

                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 flex-shrink-0 ${
                    isActive 
                      ? "bg-indigo-100/80 shadow-sm"
                      : "group-hover:bg-zinc-100"
                  }`}>
                    <Icon
                      size={17}
                      className={`transition-all duration-300 ${
                        isActive ? "text-indigo-600" : "text-zinc-400 group-hover:text-zinc-600"
                      }`}
                    />
                  </div>

                  {!collapsed && (
                    <span className={`text-[13px] ${isActive ? "font-semibold" : ""}`}>
                      {item.label}
                    </span>
                  )}

                  {/* Active right indicator */}
                  {isActive && !collapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  )}

                  {/* Tooltip when collapsed */}
                  {collapsed && (
                    <span className="sidebar-tooltip">{item.label}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* BOTTOM SECTION */}
        <div className="space-y-2">
          {/* Upgrade Card (only when expanded) */}
          {!collapsed && (
            <div className="mx-1 p-3.5 rounded-xl bg-gradient-to-br from-indigo-50 via-purple-50/50 to-indigo-50 border border-indigo-100/60 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-indigo-500" />
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Pro Plan</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed mb-2.5">
                Unlimited links & advanced analytics
              </p>
              <div className="w-full bg-indigo-100 rounded-full h-1">
                <div className="h-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: '65%' }} />
              </div>
              <p className="text-[10px] text-zinc-400 mt-1.5">65% of quota used</p>
            </div>
          )}

          <div className="border-t border-zinc-100 pt-3">
            <button
              onClick={handleLogout}
              className={`sidebar-item relative flex items-center gap-3 w-full text-zinc-400 hover:text-red-600 px-3 py-2.5 rounded-xl hover:bg-red-50/80 transition-all duration-300 font-medium group ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg group-hover:bg-red-100/50 transition-all duration-300 flex-shrink-0">
                <LogOut size={17} className="flex-shrink-0" />
              </div>
              {!collapsed && <span className="text-[13px]">Logout</span>}
              {collapsed && <span className="sidebar-tooltip">Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
