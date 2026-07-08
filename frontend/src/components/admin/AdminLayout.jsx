import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// Material UI Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import StyleIcon from "@mui/icons-material/Style";
import HandshakeIcon from "@mui/icons-material/Handshake";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AnalyticsIcon from "@mui/icons-material/Analytics"; // Icon baru untuk stats

// --- SUB-COMPONENT: SIDEBAR ---
const SidebarAdmin = ({ isOpen, activeTab, navigate }) => {
  const menuItems = [
    { name: "Dashboard", icon: <DashboardIcon sx={{ fontSize: 20 }} />, path: "/admin/dashboard" },
    { name: "Orders", icon: <InventoryIcon sx={{ fontSize: 20 }} />, path: "/admin/manage-orders" },
    { name: "Customer Stats", icon: <AnalyticsIcon sx={{ fontSize: 20 }} />, path: "/admin/customer-stats" }, // <-- ITEM BARU
    { name: "Products", icon: <ShoppingBagIcon sx={{ fontSize: 20 }} />, path: "/admin/manage-products" },
    { name: "Category", icon: <CategoryIcon sx={{ fontSize: 20 }} />, path: "/admin/manage-category" },
    { name: "Issues/Series", icon: <StyleIcon sx={{ fontSize: 20 }} />, path: "/admin/manage-issues" },
    { name: "Journal", icon: <AutoStoriesIcon sx={{ fontSize: 20 }} />, path: "/admin/manage-journal" },
    { name: "Collaboration", icon: <HandshakeIcon sx={{ fontSize: 20 }} />, path: "/admin/manage-collaborations" },
    { name: "Proposal Collabs", icon: <ContactMailIcon sx={{ fontSize: 20 }} />, path: "/admin/manage-proposals" },
    { name: "Stores", icon: <StorefrontIcon sx={{ fontSize: 20 }} />, path: "/admin/manage-stores" },
    { name: "Contact/Messages", icon: <ContactMailIcon sx={{ fontSize: 20 }} />, path: "/admin/manage-contact" },
  ];

  return (
    <aside className={`bg-black border-r-2 border-white flex flex-col transition-all duration-300 ease-in-out sticky top-20 h-[calc(100vh-80px)] z-40 overflow-hidden ${isOpen ? "w-64 opacity-100" : "w-0 opacity-0 border-none"}`}>
      <nav className="flex-1 px-4 pt-10 space-y-2 overflow-y-auto custom-scrollbar pb-10">
        {menuItems.map((item) => {
          const isActive = activeTab === item.path;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between p-3 transition-all duration-200 group border-2 uppercase font-sans ${isActive ? "bg-white text-black border-white shadow-[6px_6px_0px_#f97316] -translate-x-1 -translate-y-1" : "text-zinc-500 border-transparent hover:text-white hover:bg-zinc-900 hover:border-zinc-800"}`}
            >
              <div className="flex items-center gap-4">
                <span className={`${isActive ? "text-black" : "text-zinc-500 group-hover:text-white"}`}>{item.icon}</span>
                <span className="text-[11px] font-black tracking-widest">{item.name}</span>
              </div>
              {isActive && <ChevronRightIcon sx={{ fontSize: 16 }} />}
            </button>
          );
        })}
      </nav>
      <div className="p-6 border-t-2 border-white bg-black">
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center justify-center gap-3 p-4 text-white font-black text-[10px] tracking-[0.3em] border-2 border-white transition-all hover:bg-red-600 hover:border-red-600 hover:shadow-[4px_4px_0px_#ffffff] uppercase"
        >
          <LogoutIcon sx={{ fontSize: 18 }} /> LOGOUT
        </button>
      </div>
    </aside>
  );
};

// --- MAIN COMPONENT ---
const AdminLayout = ({ children }) => {
  const [open, setOpen] = useState(true);
  const [showNotif, setShowNotif] = useState(false);
  const [latestOrders, setLatestOrders] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const notifRef = useRef(null);

  const fetchRecentOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders");
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const filtered = response.data.filter((order) => {
        const orderDate = new Date(order.created_at);
        return orderDate >= oneDayAgo && order.status === "pending";
      });
      setLatestOrders(filtered);
    } catch (error) {
      console.error("Gagal memuat notifikasi:", error);
    }
  };

  useEffect(() => {
    fetchRecentOrders();
    const interval = setInterval(fetchRecentOrders, 30000);
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const notificationCount = latestOrders.length;

  return (
    <div className="min-h-screen bg-black font-sans uppercase overflow-hidden text-white">
      <header className="h-20 flex items-center justify-between px-8 bg-black border-b-2 border-white sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <button onClick={() => setOpen(!open)} className="text-white hover:text-[#f97316] transition-colors p-1 active:scale-90">
            <MenuIcon sx={{ fontSize: 28 }} />
          </button>
          <h1 className="text-2xl font-black italic tracking-tighter cursor-pointer hover:text-[#f97316] transition-colors" onClick={() => navigate("/admin/dashboard")}>
            ASHFALL™
          </h1>
        </div>

        <div className="flex items-center gap-8">
          <div className="relative" ref={notifRef}>
            <div className={`relative cursor-pointer group p-2 transition-all border-2 ${showNotif ? "bg-zinc-900 border-white" : "border-transparent"}`} onClick={() => setShowNotif(!showNotif)}>
              <NotificationsNoneIcon className={`${notificationCount > 0 ? "text-[#f97316]" : "text-zinc-500"} group-hover:text-white transition-colors`} sx={{ fontSize: 26 }} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-[#f97316] text-black text-[10px] font-[1000] flex items-center justify-center rounded-full border-2 border-black animate-bounce">{notificationCount}</span>
              )}
            </div>
            {showNotif && (
              <div className="absolute right-0 mt-4 w-80 bg-linear-to-b from-black via-zinc-900 to-black border-[3px] border-white shadow-[0_20px_50px_rgba(0,0,0,1)] z-60 overflow-hidden">
                <div className="p-4 border-b border-zinc-700 flex justify-between items-center bg-black/50 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#f97316] rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black tracking-[0.2em] text-white">RECENT_MANIFESTS</span>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                  {latestOrders.length > 0 ? (
                    latestOrders.map((order, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          navigate("/admin/manage-orders");
                          setShowNotif(false);
                        }}
                        className="p-4 border-b border-zinc-800/50 hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[8px] font-black px-1.5 py-0.5 bg-zinc-800 text-zinc-400 group-hover:bg-black group-hover:text-white tracking-tighter">ID: {order.order_id?.split("-")[1] || "NEW"}</span>
                        </div>
                        <h4 className="text-[11px] font-[1000] tracking-wider mb-1 uppercase truncate italic">{order.customer_name}</h4>
                      </div>
                    ))
                  ) : (
                    <p className="p-12 text-center text-zinc-600 font-black italic">NO_ACTIVITY</p>
                  )}
                </div>
                <button
                  onClick={() => {
                    navigate("/admin/manage-orders");
                    setShowNotif(false);
                  }}
                  className="w-full py-4 bg-white text-black text-[10px] font-black hover:bg-[#f97316] uppercase tracking-[0.2em]"
                >
                  Enter_Central_Database
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-6 border-l-2 border-zinc-800 pl-8 font-black">
            <div className="text-right hidden sm:block">
              <p className="text-[9px] text-zinc-500 leading-none italic uppercase">System_Admin</p>
              <p className="text-xs text-white tracking-widest mt-1 uppercase">Admin Ashfall Store</p>
            </div>
            <AccountCircleIcon sx={{ fontSize: 32, color: "white" }} />
          </div>
        </div>
      </header>

      <div className="flex">
        <SidebarAdmin isOpen={open} activeTab={location.pathname} navigate={navigate} />
        <main className="flex-1 min-h-[calc(100vh-80px)] bg-zinc-100 relative transition-all duration-300 overflow-y-auto">
          <div className="relative z-10 p-8 mx-auto text-black font-sans">{children}</div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #f97316; }
      `}</style>
    </div>
  );
};

export default AdminLayout;
