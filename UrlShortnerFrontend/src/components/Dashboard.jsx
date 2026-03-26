import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../Api/Api"
import Navbar from "./Navbar"
import {
  LayoutDashboard,
  BarChart3,
  LogOut,
  Pencil,
  Trash2,
  Menu,
  Link as LinkIcon,
  ExternalLink,
  Copy,
  BarChart2,
  QrCode,
  CalendarDays,
  Filter,
  Download
} from "lucide-react"
import Sidebar from "./Sidebar"

export default function Dashboard() {
  const navigate = useNavigate();
  const subDomain = (import.meta.env.VITE_REACT_SUBDOMAIN || "url.localhost:5174").replace(/^https?:\/\//, "");

  const [url, setUrl] = useState("")
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(false)

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/api/url/dashboard")
      setDashboard(res.data)
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const handleShorten = async () => {
    if (!url) return

    try {
      await API.post("/api/url/shorten", {
        originalUrl: url
      })

      setUrl("")
      fetchDashboard()
    } catch (err) {
      console.log(err)
    }
  }

  if (loading) {
    return <div className="p-10 text-gray-500 font-medium flex min-h-screen bg-[#FAFAFB]">Loading Dashboard...</div>
  }

  return (
    <div className="flex bg-[#FAFAFB] min-h-screen font-sans text-gray-900 overflow-hidden">
      
      {/* SIDEBAR - Full Height Left */}
      <Sidebar collapsed={collapsed} />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* NAVBAR */}
        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="p-8 max-w-6xl w-full mx-auto">

          {/* PAGE HEADER */}
          <div className="flex sm:flex-row flex-col sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h2>
              <p className="text-gray-500 text-sm">
                Welcome back, Alex. Here's what's happening with your links.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium text-sm shadow-sm transition-colors">
                <CalendarDays size={16} className="text-gray-400" />
                Last 30 Days
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-sm transition-colors ring-4 ring-blue-600/10">
                + New Collection
              </button>
            </div>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* CARD 1 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm font-medium mb-3">Total Active Links</p>
                    <div className="flex items-center gap-3">
                        <h3 className="text-3xl font-bold">{dashboard?.totalLinks || 42}</h3>
                        <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">+12% vs last month</span>
                    </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#F3F6FD] flex items-center justify-center text-blue-600 flex-shrink-0">
                    <LinkIcon size={20} className="-rotate-45" />
                </div>
            </div>

            {/* CARD 2 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm font-medium mb-3">Total Clicks</p>
                    <div className="flex items-center gap-3">
                        <h3 className="text-3xl font-bold">{dashboard?.totalClicks?.toLocaleString() || "15,204"}</h3>
                        <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">+12% vs last month</span>
                    </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#F3F6FD] flex items-center justify-center text-blue-600 flex-shrink-0">
                    <BarChart2 size={20} />
                </div>
            </div>

            {/* CARD 3 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm font-medium mb-3">Most Popular Link</p>
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold truncate max-w-[150px]">{dashboard?.mostPopularLink || "ph-launch"}</h3>
                    </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#F3F6FD] flex items-center justify-center text-blue-600 flex-shrink-0">
                    <ExternalLink size={20} />
                </div>
            </div>
          </div>

          {/* SHORTENER SECTION */}
          <div className="border border-[#E2E8F0] rounded-2xl p-8 mb-8 bg-[#F3F6FD] shadow-sm">
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
              Create a Short URL
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Paste your long link below to create a concise, trackable URL in seconds.
            </p>

            <div className="max-w-3xl mx-auto flex items-center bg-white border border-gray-200 rounded-xl p-1.5 pl-4 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
                <LinkIcon className="text-gray-400 mr-2 -rotate-45" size={20} />
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://very-long-original-destination.com/query?params=true"
                  className="flex-1 outline-none text-sm bg-transparent text-gray-800 placeholder-gray-400"
                />
                <button
                  onClick={handleShorten}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm ml-2"
                >
                  Shorten Now
                </button>
            </div>

            <div className="flex justify-center flex-wrap gap-8 mt-6 text-sm text-gray-500 font-medium">
              <label className="flex items-center gap-2 cursor-pointer hover:text-gray-700">
                <div className="w-8 h-4 bg-blue-600 rounded-full relative shadow-inner">
                    <div className="w-3.5 h-3.5 bg-white rounded-full absolute top-[2px] right-[2px] shadow-sm"></div>
                </div>
                Auto-analytics
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-gray-700">
                <div className="w-8 h-4 bg-gray-200 rounded-full relative shadow-inner">
                    <div className="w-3.5 h-3.5 bg-white rounded-full absolute top-[2px] left-[2px] shadow-sm"></div>
                </div>
                Custom Alias
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-gray-700">
                <div className="w-8 h-4 bg-gray-200 rounded-full relative shadow-inner">
                    <div className="w-3.5 h-3.5 bg-white rounded-full absolute top-[2px] left-[2px] shadow-sm"></div>
                </div>
                QR Codes
              </label>
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
            
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
               <h3 className="font-bold text-gray-900">Your Shortened Links</h3>
               <div className="flex items-center gap-4 text-sm font-semibold">
                  <button className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                     <Filter size={16}/> Filter
                  </button>
                  <button className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                     <Download size={16}/> Export CSV
                  </button>
               </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-gray-500 border-b border-gray-100 bg-gray-50/30">
                  <tr>
                    <th className="p-4 pl-6 text-left text-[13px] font-semibold">Original URL</th>
                    <th className="p-4 text-left text-[13px] font-semibold">Short URL</th>
                    <th className="p-4 text-left text-[13px] font-semibold">Clicks</th>
                    <th className="p-4 text-left text-[13px] font-semibold">Created</th>
                    <th className="p-4 pr-6 text-left text-[13px] font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard?.recentLinks?.map((link) => (
                    <tr key={link.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-2 text-gray-600 max-w-[200px] sm:max-w-xs xl:max-w-sm">
                           <ExternalLink size={14} className="flex-shrink-0 text-gray-400" />
                           <span className="truncate" title={link.originalUrl}>{link.originalUrl}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                           <a href={`${import.meta.env.VITE_REACT_SUBDOMAIN}/${link.shortUrl}`}
                              target="_blank"
                              className="text-[14.5px] font-montserrat font-[600] text-blue-600 hover:text-blue-700 hover:underline inline-flex">
                              {subDomain + "/" + `${link.shortUrl}`}
                           </a>
                           <button className="text-gray-400 hover:text-gray-600 bg-gray-100/50 hover:bg-gray-200 p-1 rounded transition-colors"><Copy size={14}/></button>
                        </div>
                      </td>
                      <td className="p-4">
                        <div 
                          onClick={() => navigate(`/analytics/${link.shortUrl}`)}
                          className="flex items-center gap-2 text-blue-600 font-semibold cursor-pointer hover:bg-blue-50 py-1.5 px-3 rounded-lg transition-colors w-fit"
                        >
                           {link.clicks?.toLocaleString() || 0} <BarChart2 size={14} className="text-blue-500" />
                        </div>
                      </td>
                      <td className="p-4 text-gray-500">
                        {new Date(link.createdAt).toLocaleDateString('en-CA')}
                      </td>
                      <td className="p-4 pr-6">
                        <div className="flex items-center gap-4 text-gray-400">
                           <button className="hover:text-blue-600 transition-colors" title="Edit"><Pencil size={16}/></button>
                           <button className="hover:text-red-500 transition-colors" title="Delete"><Trash2 size={16}/></button>
                           <button className="hover:text-gray-700 transition-colors" title="QR Code"><QrCode size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!dashboard?.recentLinks || dashboard.recentLinks.length === 0) && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500 bg-gray-50/30">
                        No customized links currently available. Shorten your first link!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* TABLE FOOTER */}
            {(dashboard?.recentLinks && dashboard.recentLinks.length > 0) && (
              <div className="p-4 px-6 flex items-center justify-between text-sm text-gray-500 border-t border-gray-100">
                 <span>Showing 1-{dashboard.recentLinks.length} of {dashboard?.totalLinks || 0} links</span>
                 <div className="flex gap-2 font-medium">
                    <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm bg-white">Previous</button>
                    <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm bg-white">Next</button>
                 </div>
              </div>
            )}
            
          </div>

          {/* PAGE FOOTER */}
          <div className="flex sm:flex-row flex-col items-center justify-between text-xs text-gray-400 pb-8 mt-4 gap-4 px-2">
            <p>© 2024 LinkSnap. All rights reserved.</p>
            <div className="flex gap-4 font-medium">
              <button className="hover:text-gray-600 transition-colors">Privacy</button>
              <button className="hover:text-gray-600 transition-colors">Terms</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}