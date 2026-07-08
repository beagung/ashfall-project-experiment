import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../../components/admin/AdminLayout";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FilterListIcon from "@mui/icons-material/FilterList";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ManageContact = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTime, setFilterTime] = useState("ALL");

  const navigate = useNavigate();
  const API_URL = "http://localhost:5000/api/contact";

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      const result = res.data.success ? res.data.data : [];
      setMessages(result);
    } catch (err) {
      console.error("FETCH_ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id, sender) => {
    if (window.confirm(`PURGE_MESSAGE_FROM: "${sender?.toUpperCase()}"?`)) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchData();
      } catch (err) {
        alert("DELETE_FAILED");
      }
    }
  };

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    alert(`EMAIL_COPIED: ${email}`);
  };

  const filteredMessages = messages
    .filter((item) => {
      const matchesSearch = item.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || item.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const messageDate = new Date(item.created_at);
      const now = new Date();
      let matchesTime = true;

      if (filterTime === "WEEK") {
        const lastWeek = new Date();
        lastWeek.setDate(now.getDate() - 7);
        matchesTime = messageDate >= lastWeek;
      } else if (filterTime === "MONTH") {
        const lastMonth = new Date();
        lastMonth.setMonth(now.getMonth() - 1);
        matchesTime = messageDate >= lastMonth;
      } else if (filterTime === "YEAR") {
        const lastYear = new Date();
        lastYear.setFullYear(now.getFullYear() - 1);
        matchesTime = messageDate >= lastYear;
      }

      return matchesSearch && matchesTime;
    })
    .sort((a, b) => {
      if (filterTime === "LATEST") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (filterTime === "OLDEST") {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      return 0;
    });

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-4 border-black pb-8">
          <div>
            <h2 className="text-5xl font-black uppercase tracking-tighter leading-none" style={{ fontStyle: "italic" }}>
              INBOX_TERMINAL
            </h2>
            <p className="text-[10px] tracking-[0.4em] text-zinc-500 font-bold uppercase mt-2 italic">Communication_Logs // User_Inquiries</p>
          </div>

          <div className="flex items-center gap-4 bg-black text-white p-3 border-2 border-black shadow-[4px_4px_0px_#000] hover:bg-[#f97316] hover:text-black transition-all group">
            <FilterListIcon fontSize="small" className="text-white group-hover:text-black" />
            <select className="bg-transparent font-black text-[10px] uppercase outline-none cursor-pointer appearance-none px-2" value={filterTime} onChange={(e) => setFilterTime(e.target.value)}>
              <option className="bg-white text-black" value="ALL">
                SEMUA_PESAN
              </option>
              <option className="bg-white text-black" value="LATEST">
                PESAN_TERBARU
              </option>
              <option className="bg-white text-black" value="OLDEST">
                PESAN_TERLAMA
              </option>
              <option className="bg-white text-black" value="WEEK">
                MINGGU_INI
              </option>
              <option className="bg-white text-black" value="MONTH">
                BULAN_INI
              </option>
              <option className="bg-white text-black" value="YEAR">
                TAHUN_INI
              </option>
            </select>
          </div>
        </div>

        <div className="relative group">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-black z-10" />
          <input
            type="text"
            placeholder="CARI_NAMA_ATAU_EMAIL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-black font-bold text-xs uppercase outline-none focus:bg-zinc-50 shadow-[4px_4px_0px_#000] transition-all"
          />
        </div>

        <div className="bg-white border-4 border-black overflow-hidden shadow-[12px_12px_0px_#000]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-black text-white text-[11px] uppercase font-black tracking-[0.2em]">
                <tr>
                  <th className="p-6 text-left border-r border-zinc-800">SENDER_INFO</th>
                  <th className="p-6 text-left border-r border-zinc-800">MESSAGE_PAYLOAD</th>
                  <th className="p-6 text-center border-r border-zinc-800 w-40">SUBJECT</th>
                  <th className="p-6 text-center border-r border-zinc-800 w-40">RECEIVED_AT</th>
                  <th className="p-6 text-center w-32">CONTROL</th>
                </tr>
              </thead>
              <tbody className="text-[11px] font-bold">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-24 text-center font-black italic uppercase animate-pulse text-zinc-400 tracking-[0.3em]">
                      Interfacing_Database...
                    </td>
                  </tr>
                ) : filteredMessages.length > 0 ? (
                  filteredMessages.map((item) => (
                    // MENGGUNAKAN item.id_message KARENA ITU PRIMARY KEY ANDA
                    <tr key={item.id_message} className="border-b-2 border-black hover:bg-zinc-50 transition-colors group">
                      <td className="p-6 border-r-2 border-zinc-100">
                        <div className="flex flex-col">
                          <span className="text-sm font-black uppercase tracking-tight group-hover:text-[#f97316]">{item.full_name}</span>
                          <span className="text-[9px] text-zinc-400 font-bold italic tracking-wider">{item.email}</span>
                        </div>
                      </td>
                      <td className="p-6 border-r-2 border-zinc-100 max-w-xs">
                        <p className="text-[10px] text-zinc-600 uppercase line-clamp-2 font-bold leading-relaxed break-all">{item.message}</p>
                      </td>
                      <td className="p-6 border-r-2 border-zinc-100 text-center">
                        <span className="inline-block px-3 py-1 bg-black text-white text-[9px] uppercase font-black tracking-widest italic border-2 border-black group-hover:bg-[#f97316] transition-colors">{item.subject}</span>
                      </td>
                      <td className="p-6 border-r-2 border-zinc-100 text-center">
                        <div className="text-[10px] uppercase font-black leading-tight text-zinc-500">
                          {new Date(item.created_at).toLocaleDateString("id-ID")}
                          <br />
                          {new Date(item.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <div className="flex justify-center items-center gap-3">
                          <button
                            onClick={() => navigate(`/admin/detail-message/${item.id_message}`)}
                            className="p-2.5 border-2 border-black bg-white hover:bg-black hover:text-white shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none transition-all"
                          >
                            <VisibilityIcon sx={{ fontSize: 18 }} />
                          </button>
                          <button onClick={() => handleCopyEmail(item.email)} className="p-2.5 border-2 border-black bg-white hover:bg-black hover:text-white shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none transition-all">
                            <ContentCopyIcon sx={{ fontSize: 18 }} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id_message, item.full_name)}
                            className="p-2.5 border-2 border-black bg-white hover:bg-red-600 hover:text-white shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none transition-all"
                          >
                            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-32 text-center font-black italic uppercase text-zinc-300 tracking-[0.5em]">
                      Inbox_Empty_//_No_Logs
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-between items-center text-[9px] font-black text-zinc-400 tracking-widest uppercase italic pt-4 border-t border-zinc-100">
          <span>{filteredMessages.length} LOGS_DETECTED</span>
          <span>Ashfall_Terminal // v1.2.0</span>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageContact;
