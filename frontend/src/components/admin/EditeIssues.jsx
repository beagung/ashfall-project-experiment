import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const EditIssues = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State UI
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // State Data
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [issueData, setIssueData] = useState({
    name: '',
    description: ''
  });

  const API_BASE_URL = 'http://127.0.0.1:5000/api/issues';

  // 1. Fetch Data Issue Berdasarkan ID
  useEffect(() => {
    const fetchIssue = async () => {
      setFetching(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/${id}`);
        if (res.data) {
          const fetched = res.data;
          setIssueData({
            name: fetched.name || '',
            description: fetched.description || ''
          });

          if (fetched.image_url) {
            setPreview(fetched.image_url);
          }
        }
      } catch (err) {
        console.error("FETCH_ERROR:", err);
        alert("SYSTEM_ERROR: ISSUE_ENTRY_NOT_FOUND");
        navigate('/admin/manage-issues');
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchIssue();
  }, [id, navigate]);

  // 2. Preview Image Handler
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 3. Handle Update
  const handleUpdate = async () => {
    if (!issueData.name) return alert("VALIDATION_ERROR: NAME_IS_REQUIRED");

    setLoading(true);
    const formData = new FormData();
    
    formData.append('name', issueData.name.toUpperCase());
    formData.append('description', issueData.description || '');

    // Append image hanya jika ada file baru yang di-upload
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      // Menggunakan headers 'multipart/form-data' untuk file upload
      const response = await axios.put(`${API_BASE_URL}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        alert(`SYSTEM_LOG: ISSUE_ID_${id}_UPDATED_SUCCESSFULLY`);
        navigate('/admin/manage-issues');
      }
    } catch (err) {
      console.error("UPDATE_ERROR:", err);
      alert(err.response?.data?.error || "UPDATE_FAILED: DATABASE_SYNC_ERROR");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64 font-black italic uppercase animate-pulse text-zinc-400">
        SYNCING_RECORDS_FROM_SUPABASE_CORE...
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className={`w-full space-y-6 animate-in fade-in duration-500 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-black pb-6 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin/manage-issues')} 
              className="p-3 border-2 border-black hover:bg-[#f97316] transition-all shadow-[4px_4px_0px_#000] active:shadow-none active:translate-y-1"
            >
              <ArrowBackIcon />
            </button>
            <div>
              <h2 className="text-4xl font-black tracking-tighter italic uppercase leading-none">EDIT_ISSUE</h2>
              <p className="text-[10px] tracking-[0.3em] text-zinc-500 font-bold uppercase italic mt-1">
                UID: {id} // STATUS: ACTIVE_EDIT_MODE
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={handleUpdate} 
              disabled={loading}
              className="w-full md:w-auto px-10 py-4 bg-[#f97316] text-white border-2 border-black font-black uppercase text-xs hover:bg-black hover:shadow-[6px_6px_0px_#f97316] transition-all flex items-center justify-center gap-2"
            >
              <CloudUploadIcon fontSize="small" />
              {loading ? 'SYNCING...' : 'UPDATE_ISSUE'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* LEFT: VISUALS */}
          <div className="flex flex-col gap-6">
            <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_#000]">
              <label className="text-[11px] font-black tracking-widest uppercase mb-4 block underline decoration-2 decoration-[#f97316]">Support Evidence</label>
              
              <div className="border-4 border-dashed border-zinc-200 p-4 min-h-300px flex flex-col items-center justify-center bg-zinc-50 relative group overflow-hidden">
                {preview ? (
                  <div className="w-full relative">
                    <img src={preview} className="w-full h-80 object-cover border-2 border-black grayscale group-hover:grayscale-0 transition-all shadow-[6px_6px_0px_#000]" alt="preview" />
                    <button 
                      type="button"
                      onClick={() => {setPreview(null); setImageFile(null);}} 
                      className="absolute -top-2 -right-2 bg-red-600 text-white p-2 border-2 border-black hover:bg-black transition-colors z-10"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <AddPhotoAlternateIcon sx={{ fontSize: 60, mb: 2, opacity: 0.1 }} />
                    <input type="file" id="file" className="hidden" onChange={handleImage} accept="image/*" />
                    <label htmlFor="file" className="cursor-pointer bg-black text-white px-8 py-3 font-black uppercase text-xs hover:bg-[#f97316] transition-colors block tracking-widest">
                      REPLACE_EVIDENCE
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: TEXT CONTENT */}
          <div className="bg-white border-2 border-black p-8 shadow-[10px_10px_0px_#000] flex flex-col">
            <div className="space-y-2 mb-6">
              <label className="text-[11px] font-black tracking-widest uppercase block underline decoration-2 decoration-[#f97316]">Issue Name</label>
              <input 
                type="text" 
                placeholder="ISSUE_NAME..." 
                className="w-full p-4 border-2 border-black font-black text-2xl uppercase italic outline-none focus:bg-zinc-50 transition-all" 
                value={issueData.name} 
                onChange={(e) => setIssueData({...issueData, name: e.target.value})} 
              />
            </div>

            <div className="flex flex-col grow"> 
              <label className="text-[11px] font-black tracking-widest uppercase block mb-2 underline decoration-2 decoration-[#f97316]">Description</label>
              <textarea 
                placeholder="DESCRIBE_ISSUE..." 
                className="w-full p-4 border-2 border-black font-bold text-xs uppercase resize-none outline-none focus:bg-zinc-50 grow min-h-350px" 
                value={issueData.description} 
                onChange={(e) => setIssueData({...issueData, description: e.target.value})}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <p className="text-[9px] font-black text-zinc-400 tracking-widest uppercase">
            Ashfall_System_v1.0 // Auth_Level: Admin // Mode: Edit_Active
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditIssues;