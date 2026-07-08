import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TagIcon from '@mui/icons-material/Tag';
import InfoIcon from '@mui/icons-material/Info';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// Asset
import backgroundJournal from '../../assets/img/backgroundshop.png'; 

const DetailIssues = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_ISSUE_DETAIL = `http://localhost:5000/api/issues/${id}`;

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_ISSUE_DETAIL);
        const data = res.data.data || res.data;
        setIssue(data);
      } catch (err) {
        console.error("ISSUE_DETAIL_FETCH_ERROR:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center font-black animate-pulse tracking-[0.5em] text-zinc-400 uppercase italic">
      SCANNING_ISSUE_LOGS...
    </div>
  );
  
  if (!issue) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-black text-red-600 mb-4 uppercase italic">ISSUE_NOT_FOUND</h1>
        <button onClick={() => navigate(-1)} className="border-2 border-black px-6 py-2 font-black uppercase shadow-[4px_4px_0px_#000] italic">
          Back_to_Archive
        </button>
    </div>
  );

  return (
    <div 
      className="min-h-screen bg-fixed bg-cover bg-center text-black font-sans p-2 md:p-6 pb-20 uppercase font-bold"
      style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.92)), url(${backgroundJournal})` }}
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
            <p className="text-[10px] font-black tracking-[0.4em] text-[#f97316] mb-1 uppercase animate-pulse italic">
                System_Alert // Report_Entry
            </p>
            <h1 
                className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none italic break-all"
                style={{ overflowWrap: 'anywhere' }}
            >
                {issue.name}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* --- LEFT: VISUAL DATA --- */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative group border-4 border-black bg-white aspect-4/3 overflow-hidden shadow-[12px_12px_0px_#000]">
              <img 
                src={issue.image_url || 'https://via.placeholder.com/800x600?text=NO_VISUAL_REPORT'} 
                alt={issue.name} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
              />
              {/* DISINKRONKAN: Menggunakan issue.id_issue agar sesuai dengan dashboard admin */}
              <div className="absolute top-4 left-4 bg-black text-white px-4 py-1 text-[10px] border-2 border-white/20 italic">
                ISSUE_REF: {String(issue.id_issue || id).toUpperCase()}
              </div>
            </div>

            <div className="bg-zinc-100 border-2 border-black p-4 flex items-center justify-between shadow-[4px_4px_0px_#000]">
                <div className="flex items-center gap-3">
                    <InfoIcon sx={{ fontSize: 16 }} />
                    <p className="text-[10px] font-black tracking-widest uppercase italic">Security_Level</p>
                </div>
                {/* Menampilkan level isu dinamis jika ada dari backend */}
                <span className="text-xs font-black bg-black text-white px-3 py-1 italic tracking-widest uppercase">
                  {issue.level || 'LEVEL_01 // STANDARD'}
                </span>
            </div>
          </div>

          {/* --- RIGHT: TEXT CONTENT --- */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* NAME BOX */}
            <div className="bg-black text-white p-8 border-2 border-black shadow-[8px_8px_0px_#f97316]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-[#f97316]">
                  <WarningAmberIcon sx={{ fontSize: 18 }} />
                  <span className="text-[10px] font-black tracking-widest uppercase italic">Subject_ID</span>
                </div>
              </div>
              <div className="flex flex-col">
                <h3 className="text-3xl md:text-5xl font-black tracking-tighter leading-none uppercase italic">
                    {issue.name}
                </h3>
              </div>
            </div>

            {/* DESCRIPTION BOX */}
            <div className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_#000] relative">
              <div className="absolute -top-4 left-6 bg-black text-white px-4 py-1 border-2 border-black font-black text-[10px] uppercase tracking-widest italic">
                Incident_Log
              </div>
              
              <div 
                className="text-sm font-bold leading-relaxed text-zinc-700 uppercase mt-2 whitespace-pre-wrap italic block break-all"
                style={{ overflowWrap: 'anywhere' }}
              >
                {issue.description || "NO_DETAILED_LOG_AVAILABLE_IN_DATABASE."}
              </div>
            </div>

            {/* INFO BOX */}
            <div className="bg-zinc-50 border-2 border-black p-6 space-y-4 shadow-[6px_6px_0px_#000]">
                <div className="flex items-center gap-4 border-b border-black/10 pb-4">
                    <CalendarTodayIcon className="text-[#f97316]" />
                    <div>
                        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter">Creation_Date</p>
                        <p className="font-black text-xs uppercase italic">
                          {issue.created_at ? new Date(issue.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'UNKNOWN_DATE'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <TagIcon className="text-[#f97316]" />
                    <div>
                        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter">System_Status</p>
                        <p className="font-black text-xs uppercase text-green-600 italic">Logged_Verified</p>
                    </div>
                </div>
            </div>

            {/* FOOTER LABEL */}
            <div className="pt-4 border-t-2 border-black/10 flex justify-between items-center opacity-40">
               <span className="text-[9px] font-black tracking-widest uppercase italic">End_Of_Issue_Report</span>
               <span className="text-[9px] font-black uppercase">Core_System_2026</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailIssues;