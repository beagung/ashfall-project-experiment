import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../../components/admin/AdminLayout";

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const AddNewJournal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [journalData, setJournalData] = useState({
    title: "",
    category: "",
    description: "",
    entry_type: "journals",
  });

  // Validasi token saat komponen dimuat
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("SESSI_EXPIRED: SILAHKAN LOGIN KEMBALI");
      navigate("/login");
    }
  }, [navigate]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (targetStatus) => {
    // Validasi input
    if (!journalData.title || !imageFile) {
      return alert("REQUIRED_FIELDS: TITLE & COVER_IMAGE ARE MANDATORY");
    }

    const token = localStorage.getItem("adminToken");
    if (!token) return navigate("/login");

    setLoading(true);

    const formData = new FormData();
    formData.append("title", journalData.title.toUpperCase());
    formData.append("category", (journalData.category || "GENERAL").toUpperCase());
    formData.append("description", journalData.description || "");
    formData.append("entry_type", journalData.entry_type);
    formData.append("status", targetStatus);
    formData.append("image", imageFile);

    try {
      await axios.post("http://localhost:5000/api/journals", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert(`SUCCESS: JOURNAL_ENTRY_${targetStatus.toUpperCase()}ED`);
      navigate("/admin/manage-journal");
    } catch (err) {
      console.error("FULL_ERROR_RESPONSE:", err.response || err);

      if (err.response?.status === 401) {
        alert("UNAUTHORIZED: TOKEN INVALID ATAU EXPIRED. SILAHKAN LOGIN ULANG.");
        localStorage.removeItem("adminToken");
        navigate("/login");
      } else {
        const errorMsg = err.response?.data?.error || "UPLOAD_FAILED: CEK CONSOLE BROWSER";
        alert("ERROR: " + errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className={`w-full space-y-6 animate-in fade-in duration-700 ${loading ? "opacity-50 pointer-events-none" : ""}`}>
        {/* HEADER */}
        <div className="flex items-center justify-between border-b-4 border-black pb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/admin/manage-journal")} className="p-3 border-2 border-black hover:bg-[#f97316] transition-all shadow-[4px_4px_0px_#000] active:shadow-none active:translate-y-1">
              <ArrowBackIcon />
            </button>
            <div>
              <h2 className="text-4xl font-black tracking-tighter italic uppercase leading-none">CREATE_JOURNAL</h2>
              <p className="text-[10px] tracking-[0.3em] text-zinc-500 font-bold uppercase italic mt-1">{loading ? "STATUS: WRITING_TO_DATABASE..." : "STATUS: ARCHIVE_MODE // TYPE: SYSTEM_JOURNAL"}</p>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleSave("publish")}
            className="px-8 py-4 bg-[#f97316] text-white border-2 border-black font-black uppercase text-xs hover:bg-black hover:shadow-[6px_6px_0px_#f97316] transition-all flex items-center gap-2"
          >
            <CloudUploadIcon fontSize="small" /> {loading ? "SYNCING..." : "PUBLISH_ENTRY"}
          </button>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="flex flex-col gap-6">
            <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_#000]">
              <label className="text-[11px] font-black tracking-widest uppercase mb-4 block underline decoration-2 decoration-[#f97316]">Cover Visual</label>
              <div className="border-4 border-dashed border-zinc-200 p-8 min-h-[300px] flex flex-col items-center justify-center bg-zinc-50 relative group transition-all hover:bg-zinc-100">
                {preview ? (
                  <div className="w-full relative">
                    <img src={preview} className="w-full h-80 object-cover border-2 border-black grayscale group-hover:grayscale-0 transition-all shadow-[6px_6px_0px_#000]" alt="preview" />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setImageFile(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-600 text-white p-2 border-2 border-black hover:bg-black transition-colors z-20"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  </div>
                ) : (
                  <>
                    <AddPhotoAlternateIcon sx={{ fontSize: 60, mb: 2, opacity: 0.1 }} />
                    <input type="file" id="file" className="hidden" onChange={handleImage} accept="image/*" />
                    <label htmlFor="file" className="cursor-pointer bg-black text-white px-8 py-3 font-black uppercase text-xs hover:bg-[#f97316] transition-colors tracking-widest">
                      SELECT_IMAGE
                    </label>
                  </>
                )}
              </div>
            </div>

            <div className="bg-black text-white p-6 border-2 border-black shadow-[8px_8px_0px_#f97316]">
              <label className="text-[9px] text-zinc-500 font-black uppercase block mb-2">Category Classification</label>
              <input
                type="text"
                placeholder="E.G. EDITORIAL, EVENT, LOOKBOOK..."
                className="w-full bg-zinc-900 border-b-2 border-zinc-700 focus:border-[#f97316] outline-none py-3 px-2 font-black text-sm uppercase transition-all"
                value={journalData.category}
                onChange={(e) => setJournalData({ ...journalData, category: e.target.value })}
              />
            </div>
          </div>

          <div className="bg-white border-2 border-black p-8 shadow-[10px_10px_0px_#000] flex flex-col">
            <div className="space-y-2 mb-6">
              <label className="text-[11px] font-black tracking-widest uppercase block underline decoration-2 decoration-[#f97316]">Headline Title</label>
              <input
                type="text"
                placeholder="ENTRY_TITLE..."
                className="w-full p-4 border-2 border-black font-black text-2xl uppercase italic outline-none focus:bg-zinc-50 transition-all"
                value={journalData.title}
                onChange={(e) => setJournalData({ ...journalData, title: e.target.value })}
              />
            </div>

            <div className="flex flex-col grow">
              <label className="text-[11px] font-black tracking-widest uppercase block mb-2 underline decoration-2 decoration-[#f97316]">Narrative Content</label>
              <textarea
                placeholder="WRITE_THE_JOURNAL_CONTENT_HERE..."
                className="w-full p-4 border-2 border-black font-bold text-xs uppercase resize-none outline-none focus:bg-zinc-50 transition-all grow min-h-[300px]"
                value={journalData.description}
                onChange={(e) => setJournalData({ ...journalData, description: e.target.value })}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddNewJournal;
