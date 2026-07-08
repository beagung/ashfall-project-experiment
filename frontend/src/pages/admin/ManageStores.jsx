import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../../components/admin/AdminLayout";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const ManageStores = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = "http://127.0.0.1:5000/api/stores";

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      // Jika backend mengirim data dalam objek { data: [...] }, ambil data-nya
      const result = Array.isArray(res.data) ? res.data : res.data.data || [];
      setStores(result);
    } catch (err) {
      console.error("FETCH_ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id_store, name) => {
    if (window.confirm(`Yakin ingin menghapus store: "${name?.toUpperCase()}"?`)) {
      try {
        await axios.delete(`${API_URL}/${id_store}`);
        fetchData();
      } catch (err) {
        console.error("DELETE_ERROR:", err);
        alert("Gagal menghapus data: " + (err.response?.data?.message || "Server Error"));
      }
    }
  };

  const filteredData = stores.filter(
    (item) => item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || item.description?.toLowerCase().includes(searchTerm.toLowerCase()) || item.address?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-4 border-black pb-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic leading-none uppercase">Manage_Stores</h2>
            <p className="text-[10px] text-zinc-500 font-bold tracking-[0.4em] mt-2 uppercase">Core // Store_Database_Control</p>
          </div>

          <button
            onClick={() => navigate("/admin/add-new-store")}
            className="flex items-center gap-2 bg-[#f97316] text-white px-6 py-4 font-black text-[11px] tracking-[0.2em] uppercase border-2 border-black hover:bg-black transition-all shadow-[6px_6px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            <AddIcon sx={{ fontSize: 20 }} />
            New_Entry
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="flex items-center gap-3 bg-white border-2 border-black p-3 max-w-sm shadow-[4px_4px_0px_#000]">
          <SearchIcon className="text-black" />
          <input
            type="text"
            placeholder="SEARCH_BY_NAME_OR_ADDR..."
            className="bg-transparent outline-none text-[10px] font-black tracking-widest w-full uppercase placeholder:text-zinc-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* DATA TABLE */}
        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_#000] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black text-white">
                  <th className="p-4 text-[10px] tracking-[0.2em] uppercase italic border-r border-zinc-800 text-center">Visual</th>
                  <th className="p-4 text-[10px] tracking-[0.2em] uppercase italic border-r border-zinc-800">Name</th>
                  <th className="p-4 text-[10px] tracking-[0.2em] uppercase italic border-r border-zinc-800">Description</th>
                  <th className="px-2 py-4 text-[10px] tracking-[0.2em] uppercase italic border-r border-zinc-800 text-center w-20">Map</th>
                  <th className="p-4 text-[10px] tracking-[0.2em] uppercase italic text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center font-black italic text-zinc-400 animate-pulse tracking-[0.5em]">
                      SYNCING...
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.id_store} className="hover:bg-zinc-50 transition-all group">
                      <td className="p-4 border-r-2 border-black text-center">
                        <div className="w-16 h-10 border-2 border-black bg-zinc-100 overflow-hidden shadow-[2px_2px_0px_#000]">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4 border-r-2 border-black font-black text-sm tracking-tighter italic uppercase group-hover:text-[#f97316]">{item.name}</td>
                      <td className="p-4 border-r-2 border-black font-bold text-[10px] text-zinc-600 max-w-xs truncate">{item.description || "-"}</td>
                      <td className="px-2 py-4 border-r-2 border-black text-center">
                        {item.address ? (
                          <a href={item.address} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-[#f97316] transition-colors">
                            <LocationOnIcon sx={{ fontSize: 18 }} />
                          </a>
                        ) : (
                          <span className="text-zinc-300 text-[9px] font-black italic">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => navigate(`/admin/edite-store/${item.id_store}`)} className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-all shadow-[3px_3px_0px_#000] active:shadow-none">
                            <EditIcon sx={{ fontSize: 18 }} />
                          </button>
                          <button onClick={() => handleDelete(item.id_store, item.name)} className="p-2 border-2 border-black bg-white hover:bg-red-600 hover:text-white transition-all shadow-[3px_3px_0px_#000] active:shadow-none">
                            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-12 text-center font-black text-zinc-400 tracking-widest italic">
                      NO_DATA
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageStores;
