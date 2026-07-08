import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../../components/admin/AdminLayout";

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const AddNewIssues = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [issueData, setIssueData] = useState({
    name: "",
    description: "",
  });

  // Handle Image Preview
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle Submit
  const handleCreate = async (e) => {
    e.preventDefault();

    // Validasi input nama bersih dari spasi kosong
    if (!issueData.name.trim()) return alert("VALIDATION_ERROR: NAME_IS_REQUIRED");

    setLoading(true);
    const formData = new FormData();

    // 1. Masukkan teks bersih ke FormData terlebih dahulu
    formData.append("name", issueData.name.trim().toUpperCase());
    formData.append("description", issueData.description.trim() ? issueData.description.trim() : "-");

    // 2. Masukkan file biner gambar di paling bawah agar siklus pembacaan multer aman
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await axios.post("http://localhost:5000/api/issues", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("SUCCESS: ISSUE_REPORTED");
      navigate("/admin/manage-issues");
    } catch (err) {
      console.error(err);
      // Membaca pesan error asli dari backend jika tersedia
      const serverMessage = err.response?.data?.message || "DATABASE_SYNC_ERROR";
      alert(`CREATE_FAILED: ${serverMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <form onSubmit={handleCreate} className={`w-full space-y-6 animate-in fade-in duration-500 ${loading ? "opacity-50 pointer-events-none" : ""}`}>
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-black pb-6 gap-4">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => navigate(-1)} className="p-3 border-2 border-black hover:bg-[#f97316] transition-all shadow-[4px_4px_0px_#000] active:shadow-none">
              <ArrowBackIcon />
            </button>
            <div>
              <h2 className="text-4xl font-black tracking-tighter italic uppercase leading-none">NEW_ISSUE_REPORT</h2>
              <p className="text-[10px] tracking-[0.3em] text-zinc-500 font-bold uppercase italic mt-1">CORE // SYSTEM_INTAKE</p>
            </div>
          </div>

          <button type="submit" disabled={loading} className="px-10 py-4 bg-[#f97316] text-white border-2 border-black font-black uppercase text-xs hover:bg-black hover:shadow-[6px_6px_0px_#f97316] transition-all flex items-center gap-2">
            <CloudUploadIcon fontSize="small" />
            {loading ? "SYNCING..." : "CONFIRM_REPORT"}
          </button>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* LEFT: VISUALS */}
          <div className="flex flex-col gap-6">
            <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_#000]">
              <label className="text-[11px] font-black tracking-widest uppercase mb-4 block underline decoration-2 decoration-[#f97316]">Support Evidence</label>

              <div className="border-4 border-dashed border-zinc-200 p-4 min-h-300px flex flex-col items-center justify-center bg-zinc-50 relative group">
                {preview ? (
                  <div className="w-full relative">
                    <img src={preview} className="w-full h-80 object-cover border-2 border-black grayscale group-hover:grayscale-0 transition-all shadow-[6px_6px_0px_#000]" alt="preview" />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setImageFile(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-600 text-white p-2 border-2 border-black hover:bg-black z-10"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <AddPhotoAlternateIcon sx={{ fontSize: 60, mb: 2, opacity: 0.1 }} />
                    <input type="file" id="file" className="hidden" onChange={handleImage} accept="image/*" />
                    <label htmlFor="file" className="cursor-pointer bg-black text-white px-8 py-3 font-black uppercase text-xs hover:bg-[#f97316] transition-colors block tracking-widest">
                      UPLOAD_EVIDENCE
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: TEXT CONTENT */}
          <div className="bg-white border-2 border-black p-8 shadow-[10px_10px_0px_#000] flex flex-col">
            <div className="space-y-2 mb-6">
              <label className="text-[11px] font-black tracking-widest uppercase block underline decoration-2 decoration-[#f97316]">Issue Title</label>
              <input
                type="text"
                placeholder="ISSUE_NAME..."
                className="w-full p-4 border-2 border-black font-black text-2xl uppercase italic outline-none focus:bg-zinc-50 transition-all"
                value={issueData.name}
                onChange={(e) => setIssueData({ ...issueData, name: e.target.value })}
              />
            </div>

            <div className="flex flex-col grow">
              <label className="text-[11px] font-black tracking-widest uppercase block mb-2 underline decoration-2 decoration-[#f97316]">Description</label>
              <textarea
                placeholder="DESCRIBE_THE_ISSUE..."
                className="w-full p-4 border-2 border-black font-bold text-xs uppercase resize-none outline-none focus:bg-zinc-50 grow min-h-200px"
                value={issueData.description}
                onChange={(e) => setIssueData({ ...issueData, description: e.target.value })}
              ></textarea>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AddNewIssues;
