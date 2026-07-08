import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const AddNewStore = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  const [storeData, setStoreData] = useState({
    name: '',
    description: '',
    address: '' // Untuk link Google Maps
  });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!storeData.name) return alert("VALIDATION_ERROR: NAME_IS_REQUIRED");
    if (!imageFile) return alert("VALIDATION_ERROR: IMAGE_IS_REQUIRED");

    setLoading(true);

    const formData = new FormData();
    formData.append('name', storeData.name.toUpperCase());
    formData.append('description', storeData.description || '');
    formData.append('address', storeData.address || ''); // Map Link
    formData.append('image', imageFile);

    try {
      // Pastikan URL API sesuai dengan endpoint store di backend Anda
      await axios.post('http://localhost:5000/api/stores', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert("SUCCESS: STORE_CREATED");
      navigate('/admin/manage-stores'); // Sesuaikan dengan route list store Anda
    } catch (err) {
      console.error(err);
      alert("CREATE_FAILED: " + (err.response?.data?.error || "DATABASE_SYNC_ERROR"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <form onSubmit={handleCreate} className={`w-full space-y-6 animate-in fade-in duration-700 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
        
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
              <h2 className="text-4xl font-black tracking-tighter italic uppercase leading-none">NEW_STORE</h2>
              <p className="text-[10px] tracking-[0.3em] text-zinc-500 font-bold uppercase italic mt-1">
                {loading ? 'STATUS: WRITING_TO_DATABASE...' : 'STATUS: ARCHIVE_MODE // TYPE: STORE_ENTRY'}
              </p>
            </div>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex gap-4">
            <button 
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-[#f97316] text-white border-2 border-black font-black uppercase text-xs hover:bg-black hover:shadow-[6px_6px_0px_#f97316] transition-all flex items-center gap-2"
            >
              <CloudUploadIcon fontSize="small" /> {loading ? 'SYNCING...' : 'CONFIRM_ENTRY'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* LEFT SIDE: Visuals + Map Link */}
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
                      SELECT_IMAGE
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
                placeholder="STORE_NAME_TITLE..." 
                className="w-full p-4 border-2 border-black font-black text-2xl uppercase italic outline-none focus:bg-zinc-50 transition-all" 
                value={storeData.name} 
                onChange={(e) => setStoreData({...storeData, name: e.target.value})} 
              />
            </div>

            <div className="flex flex-col grow"> 
              <label className="text-[11px] font-black tracking-widest uppercase block mb-2 underline decoration-2 decoration-[#f97316]">Description</label>
              <textarea 
                placeholder="WRITE_THE_STORE_DETAILS_HERE..." 
                className="w-full p-4 border-2 border-black font-bold text-xs uppercase resize-none outline-none focus:bg-zinc-50 transition-all grow min-h-300px" 
                value={storeData.description} 
                onChange={(e) => setStoreData({...storeData, description: e.target.value})}
              ></textarea>
            </div>

            {/* Mobile Buttons */}
            <div className="mt-6 md:hidden flex gap-4">
              <button type="submit" className="grow py-4 bg-[#f97316] text-white border-2 border-black font-black uppercase text-[10px]">CONFIRM_ENTRY</button>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AddNewStore;