import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import AdminLayout from "../../components/admin/AdminLayout";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const CustomerStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook untuk navigasi

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/orders/admin/customer-stats");
      setStats(res.data);
    } catch (err) {
      console.error("STATS_FETCH_ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-500 uppercase">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-black italic">CUSTOMER_STATS</h2>
            <p className="text-[10px] font-black tracking-[0.2em] text-zinc-500">CLICK_ROW_TO_VIEW_PROFILE</p>
          </div>
          <button onClick={fetchStats} className="bg-black text-white px-6 py-4 flex gap-3 border-2 border-black hover:bg-[#f97316] transition-all active:scale-95">
            <RefreshIcon className={loading ? "animate-spin" : ""} />
            <span className="font-black text-xs tracking-widest">REFRESH</span>
          </button>
        </div>

        <div className="bg-white border-2 border-black shadow-[8px_8px_0px_#000] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white text-[10px] tracking-[.3em] font-black">
                <th className="p-5">CUSTOMER_NAME</th>
                <th className="p-5">EMAIL</th>
                <th className="p-5 text-center">TRANSACTIONS</th>
                <th className="p-5 text-right">TOTAL_SPENT</th>
                <th className="p-5"></th>
              </tr>
            </thead>
            <tbody className="text-[11px] font-bold">
              {stats.length > 0 ? (
                stats.map((c, i) => (
                  <tr key={i} onClick={() => navigate(`/admin/customer-profile/${c.email}`)} className="border-b-2 border-zinc-100 hover:bg-orange-50 cursor-pointer transition-all duration-200 group">
                    <td className="p-5 flex items-center gap-3">
                      <PersonSearchIcon className="text-zinc-400 group-hover:text-orange-500 transition-colors" />
                      {c.customer_name}
                    </td>
                    <td className="p-5">{c.email}</td>
                    <td className="p-5 text-center">
                      <span className="bg-zinc-900 text-white px-3 py-1 font-black rounded-sm">{c.total_orders}x</span>
                    </td>
                    <td className="p-5 text-right font-mono">Rp{Number(c.total_spent).toLocaleString("id-ID")}</td>
                    <td className="p-5 text-right">
                      <ChevronRightIcon className="text-zinc-300 group-hover:text-black transition-colors" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-zinc-400 font-black italic tracking-widest">
                    NO_MEMBER_DATA_AVAILABLE
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CustomerStats;
