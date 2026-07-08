import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InstagramIcon from '@mui/icons-material/Instagram';
import TagIcon from '@mui/icons-material/Tag';
import LabelIcon from '@mui/icons-material/Label';
import LanguageIcon from '@mui/icons-material/Language';

// Asset
import backgroundCollab from '../../assets/img/backgroundshop.png'; 

const DetailCollaborations = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [collab, setCollab] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_COLLAB_DETAIL = `http://localhost:5000/api/collaborations/${id}`;

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_COLLAB_DETAIL);
        const data = res.data.data || res.data;
        setCollab(data);
      } catch (err) {
        console.error("COLLAB_DETAIL_FETCH_ERROR:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center font-black animate-pulse tracking-[0.5em] text-zinc-400 uppercase" style={{ fontStyle: 'italic' }}>
      DECRYPTING_COLLAB_DATA...
    </div>
  );
  
  if (!collab) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-black text-red-600 mb-4 uppercase" style={{ fontStyle: 'italic' }}>DATA_NOT_FOUND</h1>
        <button onClick={() => navigate(-1)} className="border-2 border-black px-6 py-2 font-black uppercase shadow-[4px_4px_0px_#000]" style={{ fontStyle: 'italic' }}>
          Back_to_Archive
        </button>
    </div>
  );

  return (
    <div 
      className="min-h-screen bg-fixed bg-cover bg-center text-black font-sans p-2 md:p-6 pb-20 uppercase font-bold"
      style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.92)), url(${backgroundCollab})` }}
    >
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* --- TOP NAVIGATION --- */}
        <div className="flex items-center gap-5 border-b-4 border-black pb-8 pt-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-4 border-2 border-black bg-white hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_#000] active:shadow-none"
          >
            <ArrowBackIcon />
          </button>
          <div>
            <p className="text-[10px] font-black tracking-[0.4em] text-[#f97316] mb-1 uppercase animate-pulse" style={{ fontStyle: 'italic' }}>
                Collab_Registry // {collab.type || 'PARTNER_CORE'}
            </p>
            <h1 
                className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none"
                style={{ overflowWrap: 'anywhere', wordBreak: 'break-word', fontStyle: 'italic' }}
            >
                {collab.name}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* --- LEFT: VISUAL DATA --- */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative group border-4 border-black bg-white aspect-square overflow-hidden shadow-[12px_12px_0px_#000]">
              <img 
                src={collab.image || 'https://via.placeholder.com/1000x1000?text=NO_VISUAL_DATA'} 
                alt={collab.name} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
              />
              <div className="absolute top-4 left-4 bg-black text-white px-4 py-1 text-[10px] border-2 border-white/20" style={{ fontStyle: 'italic' }}>
                PARTNER_UID: {String(collab.id).slice(0,8).toUpperCase()}
              </div>
            </div>

            <div className="bg-zinc-100 border-2 border-black p-4 flex items-center justify-between shadow-[4px_4px_0px_#000]">
                <div className="flex items-center gap-3">
                    <LabelIcon sx={{ fontSize: 16 }} />
                    <p className="text-[10px] font-black tracking-widest uppercase" style={{ fontStyle: 'italic' }}>System_ID</p>
                </div>
                <p className="text-xs font-black uppercase tracking-tighter text-[#f97316]" style={{ fontStyle: 'italic' }}>
                    {String(collab.id).toUpperCase()}
                </p>
            </div>
          </div>

          {/* --- RIGHT: TEXT CONTENT --- */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* TYPE BOX (Classification) */}
            <div className="bg-black text-white p-8 border-2 border-black shadow-[8px_8px_0px_#f97316]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-[#f97316]">
                  <TagIcon sx={{ fontSize: 18 }} />
                  <span className="text-[10px] font-black tracking-widest uppercase" style={{ fontStyle: 'italic' }}>Project_Type</span>
                </div>
              </div>
              <div className="flex flex-col">
                <h3 className="text-3xl md:text-5xl font-black tracking-tighter leading-none uppercase" style={{ fontStyle: 'italic' }}>
                    {collab.type || "CREATIVE_COLLAB"}
                </h3>
              </div>
            </div>

            {/* DESCRIPTION BOX */}
            <div className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_#000] relative">
              <div className="absolute -top-4 left-6 bg-black text-white px-4 py-1 border-2 border-black font-black text-[10px] uppercase tracking-widest" style={{ fontStyle: 'italic' }}>
                Project_Manifesto
              </div>
              
              <div 
                className="text-sm font-bold leading-relaxed text-zinc-700 uppercase mt-2 whitespace-pre-wrap"
                style={{ 
                    wordBreak: 'break-word', 
                    overflowWrap: 'anywhere',
                    fontStyle: 'italic',
                    display: 'block'
                }}
              >
                {collab.description || "NO_MISSION_STATEMENT_PROVIDED."}
              </div>
            </div>

            {/* SOCIALS & INFO BOX */}
            <div className="bg-zinc-50 border-2 border-black p-6 space-y-4 shadow-[6px_6px_0px_#000]">
                {collab.instagram && (
                  <div className="flex items-center gap-4 border-b border-black/10 pb-4">
                      <InstagramIcon className="text-[#f97316]" />
                      <div>
                          <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter">Social_Archive</p>
                          <a 
                            href={collab.instagram.startsWith('http') ? collab.instagram : `https://instagram.com/${collab.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-black text-xs uppercase hover:text-[#f97316] transition-colors" 
                            style={{ fontStyle: 'italic' }}
                          >
                            {collab.instagram.startsWith('@') ? collab.instagram : `@${collab.instagram}`}
                          </a>
                      </div>
                  </div>
                )}
                
                <div className="flex items-center gap-4">
                    <LanguageIcon className="text-[#f97316]" />
                    <div>
                        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter">Network_Status</p>
                        <p className="font-black text-xs uppercase text-green-600" style={{ fontStyle: 'italic' }}>Active_Partner_Node</p>
                    </div>
                </div>
            </div>

            {/* FOOTER LABEL */}
            <div className="pt-4 border-t-2 border-black/10 flex justify-between items-center opacity-40">
               <span className="text-[9px] font-black tracking-widest uppercase" style={{ fontStyle: 'italic' }}>Ashfall_Collaboration_Protocol</span>
               <span className="text-[9px] font-black uppercase">Established_2026</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailCollaborations;