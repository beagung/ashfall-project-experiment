import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../../components/admin/AdminLayout";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const ManageJournal = () => {
  const navigate = useNavigate();
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // STATE PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const journalsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const API_URL = "http://localhost:5000/api/journals";

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);

      // LOG DATA UNTUK DEBUGGING
      console.log("DATA_DITERIMA_DARI_BACKEND:", res.data);

      const result = Array.isArray(res.data) ? res.data : res.data.data || [];
      setJournals(result);
    } catch (err) {
      console.error("FETCH_ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id_journal, title) => {
    if (window.confirm(`ERASE_ENTRY: "${title?.toUpperCase()}"?`)) {
      try {
        const token = localStorage.getItem("adminToken");
        await axios.delete(`${API_URL}/${id_journal}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchData();
      } catch (err) {
        console.error("DELETE_ERROR:", err);
        alert("DELETE_FAILED");
      }
    }
  };

  const filteredJournals = journals.filter((item) => {
    return item.title?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // LOGIKA PAGINATION
  const indexOfLastJournal = currentPage * journalsPerPage;
  const indexOfFirstJournal = indexOfLastJournal - journalsPerPage;
  const currentJournals = filteredJournals.slice(indexOfFirstJournal, indexOfLastJournal);
  const totalPages = Math.ceil(filteredJournals.length / journalsPerPage);

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-4 border-black pb-8">
          <div>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none">JOURNAL_ARCHIVE</h2>
            <p className="text-[10px] tracking-[0.4em] text-zinc-500 font-bold uppercase mt-2 italic">System_Database // Entry_Management</p>
          </div>

          <button
            onClick={() => navigate("/admin/add-new-journal")}
            className="w-full md:w-auto bg-black text-white px-10 py-4 border-2 border-black font-black uppercase text-xs hover:bg-[#f97316] shadow-[6px_6px_0px_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <AddIcon fontSize="small" />
            CREATE_NEW_ENTRY
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="flex items-center gap-3 bg-white border-2 border-black p-3 max-w-sm shadow-[4px_4px_0px_#000]">
          <SearchIcon className="text-black" />
          <input
            type="text"
            placeholder="SEARCH_BY_TITLE..."
            className="bg-transparent outline-none text-[10px] font-black tracking-widest w-full uppercase placeholder:text-zinc-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* DATA TABLE */}
        <div className="bg-white border-4 border-black overflow-hidden shadow-[12px_12px_0px_#000]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-black text-white text-[11px] uppercase font-black tracking-[0.2em]">
                <tr>
                  <th className="p-6 text-center border-r border-zinc-800 w-32">VISUAL</th>
                  <th className="p-6 text-left border-r border-zinc-800">TITLE_&_DESCRIPTION</th>
                  <th className="p-6 text-center border-r border-zinc-800 w-40">CATEGORY</th>
                  <th className="p-6 text-center border-r border-zinc-800 w-32">STATUS</th>
                  <th className="p-6 text-center w-44">CONTROL</th>
                </tr>
              </thead>
              <tbody className="text-[11px] font-bold">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-24 text-center font-black italic uppercase animate-pulse text-zinc-400 tracking-[0.3em]">
                      Syncing_Database...
                    </td>
                  </tr>
                ) : currentJournals.length > 0 ? (
                  currentJournals.map((item) => (
                    <tr key={item.id_journal} className="border-b-2 border-black hover:bg-zinc-50 transition-colors group">
                      <td className="p-4 border-r-2 border-zinc-100 text-center">
                        <div className="inline-block w-24 h-14 border-2 border-black overflow-hidden bg-zinc-100 shadow-[4px_4px_0px_#000] group-hover:shadow-[4px_4px_0px_#f97316] transition-all">
                          {/* MENGGUNAKAN item.image SESUAI KOLOM DATABASE */}
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-110 group-hover:scale-100" />
                        </div>
                      </td>
                      <td className="p-6 border-r-2 border-zinc-100">
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => navigate(`/admin/edit-journal/${item.id_journal}`)}
                            className="text-left text-base font-black italic uppercase tracking-tight group-hover:text-[#f97316] transition-colors leading-none hover:underline underline-offset-4"
                          >
                            {item.title}
                          </button>
                          <p className="text-[10px] text-zinc-400 uppercase line-clamp-1 font-bold italic tracking-wider">{item.description || "// NO_NARRATIVE_RECORDED"}</p>
                        </div>
                      </td>
                      <td className="p-6 border-r-2 border-zinc-100 text-center">
                        <span className="inline-block px-4 py-1 bg-black text-white text-[9px] uppercase font-black tracking-[0.15em] italic border-2 border-black group-hover:bg-[#f97316] transition-colors">
                          {item.category || "GENERAL"}
                        </span>
                      </td>
                      <td className="p-6 border-r-2 border-zinc-100 text-center">
                        <span
                          className={`inline-block w-full max-w-100px py-1.5 border-2 border-black font-black text-[9px] uppercase shadow-[3px_3px_0px_#000] ${
                            item.status === "publish" ? "bg-[#f97316] text-white" : "bg-zinc-200 text-zinc-600"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-6 text-center">
                        <div className="flex justify-center items-center gap-3">
                          <button
                            onClick={() => navigate(`/admin/edit-journal/${item.id_journal}`)}
                            className="p-2.5 border-2 border-black bg-white hover:bg-black hover:text-white shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none transition-all"
                          >
                            <EditIcon sx={{ fontSize: 18 }} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id_journal, item.title)}
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
                      Archive_Empty_//_No_Data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-end items-center gap-1.5 pt-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-1 border border-black bg-white transition-all ${currentPage === 1 ? "opacity-30 cursor-not-allowed bg-zinc-50" : "hover:bg-black hover:text-white"}`}
            >
              <ChevronLeftIcon sx={{ fontSize: 16 }} />
            </button>
            <div className="border border-black bg-zinc-50 px-2 py-0.5 font-black text-[10px] tracking-wider uppercase text-black">
              {currentPage} / {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-1 border border-black bg-white transition-all ${currentPage === totalPages ? "opacity-30 cursor-not-allowed bg-zinc-50" : "hover:bg-black hover:text-white"}`}
            >
              <ChevronRightIcon sx={{ fontSize: 16 }} />
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageJournal;
