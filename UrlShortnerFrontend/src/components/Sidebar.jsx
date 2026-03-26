import { LayoutDashboard, BarChart3, LogOut, FileText } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useStoreContext } from "../contextApi/ContextApi"

export default function Sidebar({ collapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken } = useStoreContext();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "analytics", label: "Analytics", icon: BarChart3, path: "/analytics" },
    { id: "fullLog", label: "Full Activity Log", icon: FileText, path: "/fullLog" },
  ];

  return (
    <div className={`bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm ${collapsed ? "w-20" : "w-64"} z-20`}>
      <div className="flex flex-col justify-between flex-1 p-4 pt-6">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors font-medium ${
                  isActive
                    ? "bg-[#EEF2FF] text-blue-700 font-semibold"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon size={18} />
                {!collapsed && item.label}
              </li>
            );
          })}
        </ul>

        <button 
          onClick={() => {
            setToken("");
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="flex items-center gap-3 text-red-500 font-medium px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors w-full mt-8"
        >
          <LogOut size={18} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  )
}
