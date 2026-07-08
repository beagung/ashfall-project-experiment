import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../../components/admin/AdminLayout";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const ManageProposals = () => {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("NEWEST");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const API_URL = "http://localhost:5000/api/proposals";

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setProposals(res.data.data || []);
    } catch (err) {
      console.error("FETCH_ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateStatus = async (e, id_proposal, newStatus) => {
    e.stopPropagation();
    try {
      await axios.put(`${API_URL}/status/${id_proposal}`, { status: newStatus });
      fetchData();
    } catch (err) {
      alert("FAILED_TO_UPDATE_STATUS: " + err.message);
    }
  };

  const handleDelete = async (e, id_proposal, name) => {
    e.stopPropagation();
    if (window.confirm(`PURGE_PROPOSAL_RECORD: ${name?.toUpperCase()}?`)) {
      try {
        await axios.delete(`${API_URL}/${id_proposal}`);
        setProposals(proposals.filter((p) => p.id_proposal !== id_proposal));
      } catch (err) {
        alert("DELETE_FAILED: " + err.message);
      }
    }
  };

  // Logic Filtering & Sorting
  const filteredProposals = proposals
    .filter((item) => {
      const matchesSearch = item.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || item.brand_entity?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "ALL" || item.status === filterStatus;
      const matchesType = filterType === "ALL" || item.collab_type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === "NEWEST" ? dateB - dateA : dateA - dateB;
    });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProposals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProposals.length / itemsPerPage) || 1;

  const getStatusStyle = (status) => {
    switch (status) {
      case "disetujui":
        return "bg-green-500 text-white";
      case "pending":
        return "bg-yellow-400 text-black";
      case "ditolak":
        return "bg-red-500 text-white";
      default:
        return "bg-zinc-200";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 uppercase">
        {/* HEADER & CONTROLS */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black italic">PROPOSAL_MANAGEMENT</h2>
            <p className="text-[10px] font-bold text-zinc-500">TOTAL: {filteredProposals.length} ENTRIES</p>
          </div>
          <div className="flex gap-2">
            <input placeholder="SEARCH_BY_NAME..." className="border-2 border-black p-2 text-xs font-bold w-48" onChange={(e) => setSearchQuery(e.target.value)} />
            <button onClick={fetchData} className="bg-black text-white px-4 py-2 text-[10px] font-black hover:bg-[#f97316]">
              <RefreshIcon fontSize="small" />
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border-2 border-black shadow-[8px_8px_0px_#000] overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black text-white text-[10px] font-black">
                <th className="p-4">SENDER</th>
                <th className="p-4">BRAND</th>
                <th className="p-4">TYPE</th>
                <th className="p-4 text-center">STATUS</th>
                <th className="p-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id_proposal} className="border-b-2 hover:bg-zinc-50 cursor-pointer" onClick={() => navigate(`/admin/detail-proposals/${item.id_proposal}`)}>
                  <td className="p-4 font-black">{item.full_name}</td>
                  <td className="p-4">{item.brand_entity}</td>
                  <td className="p-4">{item.collab_type}</td>
                  <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <select value={item.status} onChange={(e) => handleUpdateStatus(e, item.id_proposal, e.target.value)} className={`p-1 text-[9px] font-black ${getStatusStyle(item.status)}`}>
                      <option value="pending">PENDING</option>
                      <option value="disetujui">DISETUJUI</option>
                      <option value="ditolak">DITOLAK</option>
                    </select>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={(e) => handleDelete(e, item.id_proposal, item.full_name)} className="hover:text-red-600">
                      <DeleteOutlineIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-4 mt-4">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)} className="p-2 border-2 border-black">
            <ChevronLeftIcon />
          </button>
          <span className="font-black text-sm">
            PAGE {currentPage} OF {totalPages}
          </span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)} className="p-2 border-2 border-black">
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageProposals;
