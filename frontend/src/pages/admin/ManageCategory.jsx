import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../components/admin/AdminLayout";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // State UI & Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null); // Menyimpan id_category
  const [formData, setFormData] = useState({ name: "" });

  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 6;

  const API_URL = "http://127.0.0.1:5000/api/categories";

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("FETCH_ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handler Buka Modal (Edit atau Tambah)
  const openModal = (category = null) => {
    if (category) {
      setEditId(category.id_category); // Pakai id_category
      setFormData({ name: category.name });
    } else {
      setEditId(null);
      setFormData({ name: "" });
    }
    setIsModalOpen(true);
  };

  // Handler Simpan (POST atau PUT)
  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("VALIDATION_ERROR: NAME_REQUIRED");
      return;
    }

    const categoryData = {
      name: formData.name.toUpperCase().trim(),
      slug: formData.name.toLowerCase().trim().replace(/\s+/g, "-"),
    };

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, categoryData);
      } else {
        await axios.post(API_URL, categoryData);
      }
      fetchCategories();
      setIsModalOpen(false);
      setFormData({ name: "" });
    } catch (error) {
      console.error("TRANSACTION_ERROR:", error);
      alert(error.response?.data?.message || "TRANSACTION_FAILED");
    }
  };

  // Handler Delete
  const handleDelete = async (id_category) => {
    if (window.confirm("CRITICAL_ACTION: PERMANENTLY_DELETE_ENTRY?")) {
      try {
        await axios.delete(`${API_URL}/${id_category}`);
        fetchCategories(); // Refresh list setelah delete
      } catch (error) {
        console.error("DELETE_ERROR:", error);
        alert("DELETE_FAILED: CORE_PROTECTION_OR_SERVER_ERROR");
      }
    }
  };

  const filteredCategories = categories.filter((cat) => cat.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-4 border-black pb-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic leading-none uppercase">Manage_Category</h2>
            <p className="text-[10px] text-zinc-500 font-bold tracking-[0.4em] mt-2 uppercase">Core // Database_Inventory_Tags</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-[#f97316] text-white px-6 py-4 font-black text-[11px] tracking-[0.2em] uppercase border-2 border-black hover:bg-black transition-all shadow-[6px_6px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            <AddIcon sx={{ fontSize: 20 }} /> Create_New_Entry
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="flex items-center gap-3 bg-white border-2 border-black p-3 max-w-sm shadow-[4px_4px_0px_#000]">
          <SearchIcon className="text-black" />
          <input
            type="text"
            placeholder="FILTER_BY_TAG_NAME..."
            className="bg-transparent outline-none text-[10px] font-black tracking-widest w-full uppercase placeholder:text-zinc-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_#000] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white">
                <th className="p-4 text-[10px] tracking-[0.2em] uppercase italic border-r border-zinc-800">Ref_ID</th>
                <th className="p-4 text-[10px] tracking-[0.2em] uppercase italic border-r border-zinc-800">Label</th>
                <th className="p-4 text-[10px] tracking-[0.2em] uppercase italic border-r border-zinc-800">Slug_Path</th>
                <th className="p-4 text-[10px] tracking-[0.2em] uppercase italic text-center">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center font-black italic text-zinc-400 animate-pulse tracking-[0.5em]">
                    SYNCING_WITH_CORE...
                  </td>
                </tr>
              ) : (
                currentCategories.map((cat) => (
                  <tr key={cat.id_category} className="hover:bg-zinc-50 transition-all group">
                    <td className="p-4 border-r-2 border-black font-mono text-[10px] text-zinc-400">#{cat.id_category?.toString().padStart(3, "0")}</td>
                    <td className="p-4 border-r-2 border-black font-black text-sm uppercase italic group-hover:text-[#f97316]">{cat.name}</td>
                    <td className="p-4 border-r-2 border-black font-bold text-[10px] text-zinc-400 font-mono">/{cat.slug}</td>
                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => openModal(cat)} className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-all shadow-[3px_3px_0px_#000] active:shadow-none">
                          <EditIcon sx={{ fontSize: 18 }} />
                        </button>
                        <button onClick={() => handleDelete(cat.id_category)} className="p-2 border-2 border-black bg-white hover:bg-red-600 hover:text-white transition-all shadow-[3px_3px_0px_#000] active:shadow-none">
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Footer UI tetap seperti sebelumnya... */}
      </div>

      {/* MODAL EDITOR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white border-4 border-black w-full max-w-md shadow-[20px_20px_0px_#f97316] animate-in zoom-in duration-150">
            <div className="bg-black text-white p-5 flex justify-between items-center border-b-4 border-black">
              <h3 className="font-black tracking-[0.3em] text-[10px] italic uppercase">{editId ? "Modify_Existing_Record" : "Initialize_New_Record"}</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <input type="text" placeholder="E.G. OVERSIZED_TEE" className="w-full border-4 border-black p-4 text-sm font-black focus:outline-none uppercase" value={formData.name} onChange={(e) => setFormData({ name: e.target.value })} />
              <button onClick={handleSave} className="w-full bg-[#f97316] text-white border-2 border-black py-4 font-black text-[11px] tracking-[0.4em] uppercase hover:bg-black">
                Confirm_Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageCategory;
