import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const EditJournal = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State UI
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // State Data
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [journalData, setJournalData] = useState({
    title: '',
    category: '',
    description: '',
    status: 'draft'
  });

  const API_BASE_URL = 'http://localhost:5000/api/journals';

  // 1. Fetch Data Jurnal Berdasarkan ID
  useEffect(() => {
    const fetchJournal = async () => {
      setFetching(true);
      try {
        const token = localStorage.getItem('adminToken');
        const res = await axios.get(`${API_BASE_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data) {
          const fetched = res.data;
          setJournalData({
            title: fetched.title || '',
            category: fetched.category || '',
            description: fetched.description || '',
            status: fetched.status || 'draft'
          });

          if (fetched.image_url) {
            setPreview(fetched.image_url);
          }
        }
      } catch (err) {
        console.error("FETCH_ERROR:", err);
        alert("SYSTEM_ERROR: JOURNAL_ENTRY_NOT_FOUND");
        navigate('/admin/manage-journal');
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchJournal();
  }, [id, navigate]);

  // 2. Preview Image Handler
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 3. Handle Update (Hanya Publish)
  const handleUpdate = async (newStatus = 'publish') => {
    if (!journalData.title) return alert("VALIDATION_ERROR: TITLE_IS_REQUIRED");

    setLoading(true);
    const formData = new FormData();
    
    formData.append('title', journalData.title.toUpperCase());
    formData.append('category', (journalData.category || 'GENERAL').toUpperCase());
    formData.append('description', journalData.description || '');
    formData.append('status', newStatus);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(`${API_BASE_URL}/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200 || response.status === 201) {
        alert(`SYSTEM_LOG: JOURNAL_ID_${id}_UPDATED_SUCCESSFULLY`);
        navigate('/admin/manage-journal');
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
              onClick={() => navigate('/admin/manage-journal')} 
              className="p-3 border-2 border-black hover:bg-[#f97316] transition-all shadow-[4px_4px_0px_#000] active:shadow-none active:translate-y-1"
            >
              <ArrowBackIcon />
            </button>
            <div>
              <h2 className="text-4xl font-black tracking-tighter italic uppercase leading-none">EDIT_JOURNAL</h2>
              <p className="text-[10px] tracking-[0.3em] text-zinc-500 font-bold uppercase italic mt-1">
                UID: {id} // LIVE_STATUS: <span className={journalData.status === 'publish' ? 'text-[#f97316]' : 'text-zinc-400'}>{journalData.status?.toUpperCase()}</span>
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            {/* Tombol Save as Draft telah dihapus sesuai permintaan */}
            <button 
              type="button"
              onClick={() => handleUpdate('publish')} 
              disabled={loading}
              className="w-full md:w-auto px-10 py-4 bg-[#f97316] text-white border-2 border-black font-black uppercase text-xs hover:bg-black hover:shadow-[6px_6px_0px_#f97316] transition-all flex items-center justify-center gap-2"
            >
              <CloudUploadIcon fontSize="small" />
              {loading ? 'SYNCING...' : 'UPDATE_&_PUBLISH'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* LEFT: VISUALS */}
          <div className="flex flex-col gap-6">
            <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_#000]">
              <label className="text-[11px] font-black tracking-widest uppercase mb-4 block underline decoration-2 decoration-[#f97316]">Header Visual</label>
              
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
                      REPLACE_VISUAL
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-black text-white p-6 border-2 border-black shadow-[8px_8px_0px_#f97316]">
              <label className="text-[9px] text-zinc-500 font-black uppercase block mb-2">Category Classification</label>
              <input 
                type="text" 
                placeholder="CATEGORY..." 
                className="w-full bg-zinc-900 border-b-2 border-zinc-700 focus:border-[#f97316] outline-none py-3 px-2 font-black text-sm uppercase transition-all text-white" 
                value={journalData.category} 
                onChange={(e) => setJournalData({...journalData, category: e.target.value})} 
              />
            </div>
          </div>

          {/* RIGHT: TEXT CONTENT */}
          <div className="bg-white border-2 border-black p-8 shadow-[10px_10px_0px_#000] flex flex-col">
            <div className="space-y-2 mb-6">
              <label className="text-[11px] font-black tracking-widest uppercase block underline decoration-2 decoration-[#f97316]">Entry Headline</label>
              <input 
                type="text" 
                placeholder="TITLE..." 
                className="w-full p-4 border-2 border-black font-black text-2xl uppercase italic outline-none focus:bg-zinc-50 transition-all" 
                value={journalData.title} 
                onChange={(e) => setJournalData({...journalData, title: e.target.value})} 
              />
            </div>

            <div className="flex flex-col grow"> 
              <label className="text-[11px] font-black tracking-widest uppercase block mb-2 underline decoration-2 decoration-[#f97316]">Narrative Content</label>
              <textarea 
                placeholder="REWRITE_STORY..." 
                className="w-full p-4 border-2 border-black font-bold text-xs uppercase resize-none outline-none focus:bg-zinc-50 grow min-h-350px" 
                value={journalData.description} 
                onChange={(e) => setJournalData({...journalData, description: e.target.value})}
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

export default EditJournal;