import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const EditeStore = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [storeData, setStoreData] = useState({
    name: '',
    description: '',
    address: '' // Untuk Google Maps Link
  });

  const API_URL = `http://127.0.0.1:5000/api/stores/${id}`;

  useEffect(() => {
    const fetchStore = async () => {
      setFetching(true);
      try {
        const res = await axios.get(API_URL);
        if (res.data) {
          setStoreData({
            name: res.data.name || '',
            description: res.data.description || '',
            address: res.data.address || ''
          });
          if (res.data.image) setPreview(res.data.image);
        }
      } catch (err) {
        console.error("FETCH_ERROR:", err);
        alert("SYSTEM_ERROR: ENTRY_NOT_FOUND");
        navigate('/admin/manage-stores');
      } finally {
        setFetching(false);
      }
    };
    fetchStore();
  }, [id, navigate]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!storeData.name) return alert("VALIDATION_ERROR: NAME_IS_REQUIRED");

    setLoading(true);
    const formData = new FormData();
    formData.append('name', storeData.name.toUpperCase());
    formData.append('description', storeData.description || '');
    formData.append('address', storeData.address || '');
    if (imageFile) formData.append('image', imageFile);

    try {
      await axios.put(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("SUCCESS: ENTRY_UPDATED");
      navigate('/admin/manage-stores');
    } catch (err) {
      alert("UPDATE_FAILED: " + (err.response?.data?.error || "SERVER_ERROR"));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <AdminLayout><div className="flex items-center justify-center h-64 font-black animate-pulse">SYNCING_DATA...</div></AdminLayout>;

  return (
    <AdminLayout>
      <form onSubmit={handleUpdate} className={`w-full space-y-6 animate-in fade-in duration-700 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
        
        {/* HEADER SECTION */}
        <div className="flex items-center justify-between border-b-4 border-black pb-6">
          <div className="flex items-center gap-4">
            <button 
              type="button"
              onClick={() => navigate('/admin/manage-stores')} 
              className="p-3 border-2 border-black hover:bg-[#f97316] transition-all shadow-[4px_4px_0px_#000] active:shadow-none active:translate-y-1"
            >
              <ArrowBackIcon />
            </button>
            <div>
              <h2 className="text-4xl font-black tracking-tighter italic uppercase leading-none">EDIT_STORE</h2>
              <p className="text-[10px] tracking-[0.3em] text-zinc-500 font-bold uppercase italic mt-1">
                {loading ? 'STATUS: UPDATING_DATABASE...' : 'STATUS: ARCHIVE_MODE // TYPE: STORE_ENTRY'}
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex gap-4">
            <button 
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-[#f97316] text-white border-2 border-black font-black uppercase text-xs hover:bg-black hover:shadow-[6px_6px_0px_#f97316] transition-all flex items-center gap-2"
            >
              <CloudUploadIcon fontSize="small" /> {loading ? 'SYNCING...' : 'UPDATE_ENTRY'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* LEFT SIDE: Visuals + Maps */}
          <div className="flex flex-col gap-6">
            <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_#000]">
              <label className="text-[11px] font-black tracking-widest uppercase mb-4 block underline decoration-2 decoration-[#f97316]">Cover Visual</label>
              
              <div className="border-4 border-dashed border-zinc-200 p-8 min-h-300px flex flex-col items-center justify-center bg-zinc-50 relative group transition-all hover:bg-zinc-100">
                {preview ? (
                  <div className="w-full relative">
                    <img src={preview} className="w-full h-80 object-cover border-2 border-black grayscale group-hover:grayscale-0 transition-all shadow-[6px_6px_0px_#000]" alt="preview" />
                    <button 
                      type="button"
                      onClick={() => {setPreview(null); setImageFile(null);}} 
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
                      REPLACE_ASSET
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Google Maps Link */}
            <div className="bg-black text-white p-6 border-2 border-black shadow-[8px_8px_0px_#f97316]">
              <label className="text-[9px] text-zinc-500 font-black uppercase block mb-2">Google Maps Link</label>
              <div className="flex items-center gap-2">
                <LocationOnIcon />
                <input 
                  type="url" 
                  placeholder="HTTPS://MAPS.GOOGLE.COM/..." 
                  className="w-full bg-zinc-900 border-b-2 border-zinc-700 focus:border-[#f97316] outline-none py-3 px-2 font-black text-sm uppercase transition-all" 
                  value={storeData.address} 
                  onChange={(e) => setStoreData({...storeData, address: e.target.value})} 
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Content */}
          <div className="bg-white border-2 border-black p-8 shadow-[10px_10px_0px_#000] flex flex-col">
            <div className="space-y-2 mb-6">
              <label className="text-[11px] font-black tracking-widest uppercase block underline decoration-2 decoration-[#f97316]">Store Name</label>
              <input 
                type="text" 
                className="w-full p-4 border-2 border-black font-black text-2xl uppercase italic outline-none focus:bg-zinc-50 transition-all" 
                value={storeData.name} 
                onChange={(e) => setStoreData({...storeData, name: e.target.value})} 
              />
            </div>

            <div className="flex flex-col grow"> 
              <label className="text-[11px] font-black tracking-widest uppercase block mb-2 underline decoration-2 decoration-[#f97316]">Description</label>
              <textarea 
                className="w-full p-4 border-2 border-black font-bold text-xs uppercase resize-none outline-none focus:bg-zinc-50 transition-all grow min-h-300px" 
                value={storeData.description} 
                onChange={(e) => setStoreData({...storeData, description: e.target.value})}
              ></textarea>
            </div>

            {/* Mobile Buttons */}
            <div className="mt-6 md:hidden flex gap-4">
              <button type="submit" className="grow py-4 bg-[#f97316] text-white border-2 border-black font-black uppercase text-[10px]">UPDATE_ENTRY</button>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default EditeStore;