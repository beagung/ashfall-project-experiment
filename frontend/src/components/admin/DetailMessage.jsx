import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const DetailMessage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/contact/${id}`);
        if (res.data.success) setMessage(res.data.data);
      } catch (err) {
        console.error("API_ERROR:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <AdminLayout><div className="p-10 font-black uppercase text-white animate-pulse">Loading_System_Logs...</div></AdminLayout>;
  if (!message) return <AdminLayout><div className="p-10 font-black uppercase text-white">Entry_Not_Found</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Tombol Back */}
        <button 
          onClick={() => navigate(-1)} 
          className="mb-8 flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.3em] text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} /> Back_To_Console
        </button>

        {/* Main Card */}
        <div className="bg-white border-[6px] border-black shadow-[16px_16px_0px_#000] overflow-hidden">
          
          {/* Header */}
          <div className="bg-black text-white p-8 md:p-12 relative">
            <div 
              className="absolute top-2 right-4 opacity-10 font-black text-6xl select-none"
              style={{ fontStyle: 'italic' }} // Paksa miring via Inline CSS
            >
              ASHFALL
            </div>
            
            <div className="relative z-10">
              <span className="bg-[#f97316] text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                {message.subject}
              </span>
              <h1 
                className="text-5xl md:text-7xl font-black uppercase tracking-tighter mt-4 font-style:italic" 
                style={{ fontStyle: 'italic' }} // Backup jika class [font-style:italic] gagal
              >
                {message.full_name}
              </h1>
              <p className="text-zinc-400 font-bold uppercase text-xs mt-4 tracking-[0.2em]">
                {message.email}
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 md:p-12 space-y-10">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400 italic">Message_Payload :</p>
              <div className="bg-zinc-50 border-4 border-black p-8 shadow-inner">
                <p 
                  className="text-xl md:text-3xl font-bold leading-tight text-zinc-900 uppercase tracking-tight"
                  style={{ fontStyle: 'italic' }} // Paksa miring pada konten pesan
                >
                  "{message.message}"
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4 pt-6">
              <button 
                onClick={() => window.location.href = `mailto:${message.email}`}
                className="flex-2 bg-black text-white py-5 font-black uppercase text-xs tracking-[0.3em] border-4 border-black hover:bg-[#f97316] hover:text-black transition-all shadow-[8px_8px_0px_#ccc] active:translate-y-1 active:shadow-none"
              >
                Execute_Reply
              </button>
              
              <button 
                onClick={async () => {
                   if(window.confirm("PURGE_DATA?")) {
                      await axios.delete(`http://localhost:5000/api/contact/${id}`);
                      navigate('/admin/manage-contact');
                   }
                }}
                className="flex-1 bg-white text-red-600 py-5 font-black uppercase text-xs tracking-[0.3em] border-4 border-red-600 hover:bg-red-600 hover:text-white transition-all shadow-[8px_8px_0px_#fee2e2] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2"
              >
                <DeleteOutlineIcon /> Purge
              </button>
            </div>
          </div>
        </div>

        {/* Footer Metadata */}
        <div className="mt-8 flex justify-between font-black text-[9px] text-zinc-500 uppercase tracking-[0.4em]">
          <span>Node_ID: {id.slice(0,8)}</span>
          <span>Status: Synchronized</span>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DetailMessage;