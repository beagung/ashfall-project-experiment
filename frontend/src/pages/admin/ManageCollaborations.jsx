import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import InstagramIcon from '@mui/icons-material/Instagram';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const ManageCollaborations = () => {
  const navigate = useNavigate();
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 🟢 STATE PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const API_URL = 'http://127.0.0.1:5000/api/collaborations';

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      const result = Array.isArray(res.data) ? res.data : [];
      setCollaborations(result);
    } catch (err) {
      console.error("FETCH_ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset halaman jika pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`ERASE_COLLABORATION_ENTRY: "${name?.toUpperCase()}"?`)) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchData();
      } catch (err) {
        console.error("DELETE_ERROR:", err);
        alert("DELETE_FAILED: SERVER_ERROR");
      }
    }
  };

  const filteredData = collaborations.filter((item) => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🟢 LOGIKA SLICING DATA
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-4 border-black pb-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic leading-none uppercase">Manage_Collaborations</h2>
            <p className="text-[10px] text-zinc-500 font-bold tracking-[0.4em] mt-2 uppercase">Core // Collaboration_Database_Control</p>
          </div>
          
          <button 
            onClick={() => navigate('/admin/add-new-collaborations')}
            className="flex items-center gap-2 bg-[#f97316] text-white px-6 py-4 font-black text-[11px] tracking-[0.2em] uppercase border-2 border-black hover:bg-black transition-all shadow-[6px_6px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            <AddIcon sx={{ fontSize: 20 }} /> New_Entry
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="flex items-center gap-3 bg-white border-2 border-black p-3 max-w-sm shadow-[4px_4px_0px_#000]">
          <SearchIcon className="text-black" />
          <input 
            type="text" 
            placeholder="SEARCH_BY_NAME_OR_DESC..." 
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
                  <th className="px-2 py-4 text-[10px] tracking-[0.2em] uppercase italic border-r border-zinc-800 text-center w-20">Insta</th>
                  <th className="p-4 text-[10px] tracking-[0.2em] uppercase italic text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center font-black italic text-zinc-400 animate-pulse tracking-[0.5em]">SYNCING...</td>
                  </tr>
                ) : currentData.length > 0 ? (
                  currentData.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50 transition-all group">
                      <td className="p-4 border-r-2 border-black text-center">
                        <div className="w-16 h-10 border-2 border-black bg-zinc-100 overflow-hidden shadow-[2px_2px_0px_#000]">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4 border-r-2 border-black font-black text-sm tracking-tighter italic uppercase cursor-pointer group-hover:text-[#f97316]" onClick={() => navigate(`/admin/edite-collaborations/${item.id}`)}>
                        {item.name}
                      </td>
                      <td className="p-4 border-r-2 border-black font-bold text-[10px] text-zinc-600 max-w-xs truncate">
                        {item.description || "-"}
                      </td>
                      <td className="px-2 py-4 border-r-2 border-black text-center">
                        {item.instagram ? (
                          <a href={item.instagram} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-[#f97316] transition-colors">
                            <InstagramIcon sx={{ fontSize: 18 }} />
                          </a>
                        ) : <span className="text-zinc-300">-</span>}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => navigate(`/admin/edite-collaborations/${item.id}`)} className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-all shadow-[3px_3px_0px_#000] active:shadow-none"><EditIcon sx={{ fontSize: 18 }} /></button>
                          <button onClick={() => handleDelete(item.id, item.name)} className="p-2 border-2 border-black bg-white hover:bg-red-600 hover:text-white transition-all shadow-[3px_3px_0px_#000] active:shadow-none"><DeleteOutlineIcon sx={{ fontSize: 18 }} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="p-12 text-center font-black text-zinc-400 tracking-widest italic">NO_DATA</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 🟢 COMPONENT CONTROLLER PAGINATION BRUTALIST */}
        {totalPages > 1 && (
          <div className="flex justify-end items-center gap-1.5 pt-2">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`p-1 border border-black bg-white transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed bg-zinc-50' : 'hover:bg-black hover:text-white'}`}>
              <ChevronLeftIcon sx={{ fontSize: 16 }} />
            </button>
            <div className="border border-black bg-zinc-50 px-2 py-0.5 font-black text-[10px] tracking-wider uppercase text-black">
              {currentPage} / {totalPages}
            </div>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`p-1 border border-black bg-white transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed bg-zinc-50' : 'hover:bg-black hover:text-white'}`}>
              <ChevronRightIcon sx={{ fontSize: 16 }} />
            </button>
          </div>
        )}

        {/* 🟢 FOOTER INFO */}
        <div className="flex justify-between items-center py-4">
          <p className="text-[9px] font-black text-zinc-500 tracking-widest uppercase italic">
            DATA_SHOWN: {currentData.length} // SYSTEM_TOTAL: {filteredData.length}
          </p>
          <div className="flex gap-1">
             <div className="w-2 h-2 bg-[#f97316] animate-pulse"></div>
             <div className="w-2 h-2 bg-black animate-pulse delay-75"></div>
             <div className="w-2 h-2 bg-zinc-400 animate-pulse delay-150"></div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default ManageCollaborations;